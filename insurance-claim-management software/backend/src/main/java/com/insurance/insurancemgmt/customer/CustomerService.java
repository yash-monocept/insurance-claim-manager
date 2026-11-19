package com.insurance.insurancemgmt.customer;

import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.AccessDeniedBusinessException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.user.User;
import com.insurance.insurancemgmt.user.UserRepository;
import com.insurance.insurancemgmt.customer.dto.CustomerRequest;
import com.insurance.insurancemgmt.customer.dto.CustomerResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "city", "state", "pinCode", "createdDate", "updatedDate");

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerService(CustomerRepository customerRepository, UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public CustomerResponse createProfile(CustomerRequest request) {
        User currentUser = getCurrentUser();
        return createProfileForUser(currentUser, request);
    }

    public CustomerResponse createProfileForUser(User user, CustomerRequest request) {
        requireCustomerRole(user);
        if (customerRepository.existsByUserId(user.getId())) {
            throw new com.insurance.insurancemgmt.common.exception.DuplicateResourceException(
                    "Customer profile already exists for this user");
        }

        Customer customer = new Customer();
        customer.setUser(user);
        applyProfile(customer, request);

        Customer saved = customerRepository.save(customer);
        log.info("Customer profile created for {}", user.getEmail());
        return CustomerResponse.fromEntity(saved);
    }

    /**
     * Returns the customer profile for a user, creating an empty one when it is
     * missing. Self-registered accounts used to be created without a profile,
     * which made every customer endpoint return 404.
     */
    private Customer getOrCreateProfile(User user) {
        requireCustomerRole(user);
        return customerRepository.findByUserId(user.getId()).orElseGet(() -> {
            Customer customer = new Customer();
            customer.setUser(user);
            return customerRepository.save(customer);
        });
    }

    public CustomerResponse getMyProfile() {
        User currentUser = getCurrentUser();
        return CustomerResponse.fromEntity(getOrCreateProfile(currentUser));
    }

    public CustomerResponse updateMyProfile(CustomerRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = getOrCreateProfile(currentUser);

        applyProfile(customer, request);

        Customer saved = customerRepository.save(customer);
        log.info("Customer profile updated for {}", currentUser.getEmail());
        return CustomerResponse.fromEntity(saved);
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return CustomerResponse.fromEntity(customer);
    }

    public PageResponse<CustomerResponse> getAllCustomers(int page, int size, String sortField, String sortDir,
                                                          String keyword) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<Customer> customerPage;
        if (keyword != null && !keyword.isBlank()) {
            customerPage = customerRepository.searchCustomers(keyword, pageable);
        } else {
            customerPage = customerRepository.findAll(pageable);
        }

        return PageResponse.of(
                customerPage.getContent().stream().map(CustomerResponse::fromEntity).toList(),
                customerPage.getNumber() + 1,
                customerPage.getSize(),
                customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customerPage.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    private void applyProfile(Customer customer, CustomerRequest request) {
        customer.setDateOfBirth(request.dateOfBirth());
        customer.setAddress(request.address());
        customer.setCity(request.city());
        customer.setState(request.state());
        customer.setPinCode(request.pinCode());
        customer.setNomineeName(request.nomineeName());
        customer.setNomineeRelation(request.nomineeRelation());
    }

    /**
     * Customer profiles only exist for the CUSTOMER role (CUS-BR-001).
     */
    private void requireCustomerRole(User user) {
        if (user.getRole() != User.Role.CUSTOMER) {
            throw new AccessDeniedBusinessException(
                    "Customer profiles are only available to customer accounts");
        }
    }
}
