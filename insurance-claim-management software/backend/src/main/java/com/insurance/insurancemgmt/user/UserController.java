package com.insurance.insurancemgmt.user;

import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.user.dto.UserResponse;
import com.insurance.insurancemgmt.user.dto.AgentCreationRequest;
import com.insurance.insurancemgmt.user.dto.UserStatusUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) User.Role role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String keyword) {

        PageResponse<UserResponse> response =
                userService.getAllUsers(page, size, sortField, sortDir, role, active, keyword);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", userService.getUserById(id)));
    }

    @PostMapping("/agents")
    public ResponseEntity<ApiResponse<UserResponse>> createAgent(@RequestBody @Valid AgentCreationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Agent created successfully", userService.createAgent(request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(@PathVariable Long id,
                                                                      @RequestBody @Valid UserStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully",
                userService.updateUserStatus(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully",
                userService.deactivateUser(id)));
    }
}
