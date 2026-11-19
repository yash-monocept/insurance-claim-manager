package com.insurance.insurancemgmt.history;

import com.insurance.insurancemgmt.claim.Claim;
import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.claim.ClaimRepository;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.AccessDeniedBusinessException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.history.dto.ClaimStatusHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional(readOnly = true)
public class ClaimStatusHistoryService {

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "previousStatus", "newStatus", "updatedDate");

    private final ClaimStatusHistoryRepository historyRepository;
    private final ClaimRepository claimRepository;

    public ClaimStatusHistoryService(ClaimStatusHistoryRepository historyRepository,
                                     ClaimRepository claimRepository) {
        this.historyRepository = historyRepository;
        this.claimRepository = claimRepository;
    }

    public PageResponse<ClaimStatusHistoryResponse> getClaimHistory(Long claimId, int page, int size,
                                                                    String sortField, String sortDir,
                                                                    String updatedBy, ClaimStatus status) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        if (currentUserIsCustomer()
                && !claim.getPolicy().getCustomer().getUser().getEmail().equals(currentUserEmail())) {
            throw new AccessDeniedBusinessException("You can only view history for your own claims");
        }

        Page<ClaimStatusHistory> pageResult = historyRepository.searchHistory(claimId, updatedBy, status, pageable);

        return PageResponse.of(
                pageResult.getContent().stream().map(ClaimStatusHistoryResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    private String currentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private boolean currentUserIsCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_CUSTOMER"));
    }
}
