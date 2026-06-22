package com.restaurantmanagement.modules.users.service;

import com.restaurantmanagement.modules.users.dto.ChangePasswordRequest;
import com.restaurantmanagement.modules.users.dto.UserRequest;
import com.restaurantmanagement.modules.users.dto.UserResponse;
import com.restaurantmanagement.modules.users.entity.Role;
import com.restaurantmanagement.modules.users.entity.RoleType;
import com.restaurantmanagement.modules.users.entity.User;
import com.restaurantmanagement.modules.users.mapper.UserMapper;
import com.restaurantmanagement.modules.users.repository.RoleRepository;
import com.restaurantmanagement.modules.users.repository.UserRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppMessages appMessages;

    @Value("${user.default.password}")
    private String defaultPassword;

    public Page<UserResponse> getAll(Pageable pageable, String q, RoleType roleType) {
        return userRepository.search(q, roleType, pageable).map(UserMapper::toResponse);
    }

    public UserResponse getById(Long id) {
        return UserMapper.toResponse(findUser(id));
    }

    public UserResponse getCurrentUser() {
        User user = currentUser();
        return UserMapper.toResponse(user);
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw AppException.conflict(appMessages.get("error.username_conflict"));
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw AppException.conflict(appMessages.get("error.email_user_conflict"));
        }
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> AppException.badRequest("Invalid role"));
        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank()
                ? request.getPassword() : defaultPassword;
        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(rawPassword))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .branchId(request.getBranchId())
                .active(request.getActive() == null || request.getActive())
                .mustChangePassword(true)
                .build();
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = findUser(id);
        if (!user.getUsername().equalsIgnoreCase(request.getUsername())
                && userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw AppException.conflict(appMessages.get("error.username_conflict"));
        }
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw AppException.conflict(appMessages.get("error.email_user_conflict"));
        }
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> AppException.badRequest("Invalid role"));
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setBranchId(request.getBranchId());
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setMustChangePassword(true);
        }
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse toggleActive(Long id) {
        User user = findUser(id);
        user.setActive(!user.isActive());
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = findUser(id);
        userRepository.delete(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw AppException.badRequest("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> AppException.notFound(appMessages.get("user.not_found")));
    }

    private User currentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw AppException.forbidden("Authentication required");
    }
}
