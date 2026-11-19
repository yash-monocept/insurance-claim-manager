package com.insurance.insurancemgmt.authentication;

import com.insurance.insurancemgmt.authentication.dto.LoginRequest;
import com.insurance.insurancemgmt.authentication.dto.RegisterRequest;
import com.insurance.insurancemgmt.common.dto.AuthResponse;
import com.insurance.insurancemgmt.common.exception.BusinessException;
import com.insurance.insurancemgmt.common.exception.DuplicateResourceException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.customer.Customer;
import com.insurance.insurancemgmt.customer.CustomerRepository;
import com.insurance.insurancemgmt.security.JwtUtil;
import com.insurance.insurancemgmt.security.UserPrincipal;
import com.insurance.insurancemgmt.user.User;
import com.insurance.insurancemgmt.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setMobileNumber(request.mobileNumber());
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);

        user = userRepository.save(user);

        // Every customer account needs a matching profile row, otherwise all
        // /api/*/me endpoints would return 404 for this user.
        Customer customer = new Customer();
        customer.setUser(user);
        customerRepository.save(customer);

        log.info("Customer registered: email={}", user.getEmail());
        return generateAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new BusinessException(
                    "Account is inactive. Please contact admin.", "INACTIVE_USER", 401);
        }

        log.info("Login successful: email={} role={}", user.getEmail(), user.getRole());
        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtUtil.generateToken(principal);
        return new AuthResponse(
                token,
                "Bearer",
                user.getEmail(),
                user.getRole().name(),
                user.getFullName(),
                user.getMobileNumber(),
                user.getActive(),
                System.currentTimeMillis() + jwtUtil.getExpirationMs()
        );
    }
}
