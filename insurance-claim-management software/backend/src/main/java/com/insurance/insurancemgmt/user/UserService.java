package com.insurance.insurancemgmt.user;

import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.BusinessException;
import com.insurance.insurancemgmt.common.exception.DuplicateResourceException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.user.dto.AgentCreationRequest;
import com.insurance.insurancemgmt.user.dto.UserResponse;
import com.insurance.insurancemgmt.user.dto.UserStatusUpdateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "fullName", "email", "role", "active", "createdDate", "updatedDate");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PageResponse<UserResponse> getAllUsers(int page, int size, String sortField, String sortDir,
                                                  User.Role role, Boolean active, String keyword) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<User> userPage;
        if (keyword != null && !keyword.isBlank()) {
            userPage = userRepository.searchUsers(keyword, role, active, pageable);
        } else if (role != null && active != null) {
            userPage = userRepository.findAllByRoleAndActive(role, active, pageable);
        } else if (role != null) {
            userPage = userRepository.findAllByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<UserResponse> content = userPage.getContent().stream()
                .map(UserResponse::fromEntity).toList();

        return PageResponse.of(
                content,
                userPage.getNumber() + 1,
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    public UserResponse createAgent(AgentCreationRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }

        User agent = new User();
        agent.setFullName(request.fullName());
        agent.setEmail(request.email());
        agent.setPassword(passwordEncoder.encode(request.password()));
        agent.setMobileNumber(request.mobileNumber());
        agent.setRole(User.Role.AGENT);
        agent.setActive(true);

        User saved = userRepository.save(agent);
        log.info("Agent account created: email={}", saved.getEmail());
        return UserResponse.fromEntity(saved);
    }

    public UserResponse updateUserStatus(Long id, UserStatusUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        boolean newActive = parseActive(request.active());
        user.setActive(newActive);
        User saved = userRepository.save(user);
        log.info("User status updated: email={} active={} reason={}",
                saved.getEmail(), newActive, request.reason());
        return UserResponse.fromEntity(saved);
    }

    /**
     * Users are deactivated instead of deleted so business records stay
     * auditable (DRD-001).
     */
    public UserResponse deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (Boolean.FALSE.equals(user.getActive())) {
            throw new BusinessException("User is already inactive", "ALREADY_INACTIVE", 400);
        }
        user.setActive(false);
        User saved = userRepository.save(user);
        log.info("User deactivated: email={}", saved.getEmail());
        return UserResponse.fromEntity(saved);
    }

    private boolean parseActive(String value) {
        String normalized = value == null ? "" : value.trim().toUpperCase();
        if (normalized.equals("TRUE") || normalized.equals("ACTIVE")) {
            return true;
        }
        if (normalized.equals("FALSE") || normalized.equals("INACTIVE")) {
            return false;
        }
        throw new BusinessException("Invalid active value. Allowed values: true, false, ACTIVE, INACTIVE",
                "INVALID_STATUS", 400);
    }
}
