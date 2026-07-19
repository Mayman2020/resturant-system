package com.restaurantmanagement.modules.auth.service;

import com.restaurantmanagement.modules.auth.dto.ForgotPasswordRequest;
import com.restaurantmanagement.modules.auth.dto.LoginRequest;
import com.restaurantmanagement.modules.auth.dto.LoginResponse;
import com.restaurantmanagement.modules.auth.dto.RefreshTokenRequest;
import com.restaurantmanagement.modules.auth.dto.ResetPasswordRequest;
import com.restaurantmanagement.modules.auth.entity.PasswordResetToken;
import com.restaurantmanagement.modules.auth.repository.PasswordResetTokenRepository;
import com.restaurantmanagement.shared.mail.PasswordResetDeliveryService;
import com.restaurantmanagement.modules.permission.service.RolePermissionService;
import com.restaurantmanagement.modules.users.entity.User;
import com.restaurantmanagement.modules.users.repository.UserRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import com.restaurantmanagement.shared.security.JwtUtil;
import com.restaurantmanagement.shared.security.LoginAttemptService;
import com.restaurantmanagement.shared.security.TokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppMessages appMessages;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RolePermissionService rolePermissionService;
    private final LoginAttemptService loginAttemptService;
    private final TokenBlacklistService tokenBlacklist;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordResetDeliveryService passwordResetDeliveryService;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw AppException.badRequest(appMessages.get("auth.error.credentials_required"));
        }
        String identifier = request.getUsername().trim();
        if (loginAttemptService.isLocked(identifier)) {
            throw AppException.badRequest(appMessages.get("auth.error.account_locked"));
        }
        User resolved = userRepository.findByUsernameOrEmail(identifier)
                .orElseThrow(() -> {
                    loginAttemptService.recordFailure(identifier);
                    return AppException.badRequest(appMessages.get("auth.error.invalid_password"));
                });
        if (!resolved.isActive()) {
            throw AppException.badRequest(appMessages.get("auth.error.account_inactive"));
        }
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(resolved.getUsername(), request.getPassword())
            );
            User user = (User) auth.getPrincipal();
            loginAttemptService.recordSuccess(identifier);
            String clientIp = resolveClientIp(httpRequest);
            user.setLastLogin(LocalDateTime.now());
            user.setLastLoginIp(clientIp);
            userRepository.save(user);
            return buildResponse(user);
        } catch (DisabledException e) {
            throw AppException.badRequest(appMessages.get("auth.error.account_inactive"));
        } catch (AuthenticationException e) {
            loginAttemptService.recordFailure(identifier);
            throw AppException.badRequest(appMessages.get("auth.error.invalid_password"));
        }
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            if (jwtUtil.isValid(token)) {
                Instant expiry = jwtUtil.extractExpiration(token).toInstant();
                tokenBlacklist.revoke(token, expiry);
            }
        }
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        if (username.isEmpty()) {
            return;
        }
        userRepository.findByUsernameIgnoreCase(username).ifPresent(user -> {
            String token = UUID.randomUUID().toString().replace("-", "");
            passwordResetTokenRepository.save(PasswordResetToken.builder()
                    .user(user)
                    .token(token)
                    .expiresAt(LocalDateTime.now().plusHours(24))
                    .used(false)
                    .build());
            passwordResetDeliveryService.deliver(user, token);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedFalse(request.getToken())
                .orElseThrow(() -> AppException.badRequest("Reset token is invalid or already used."));
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw AppException.badRequest("Reset token has expired.");
        }
        User user = resetToken.getUser();
        if (!user.isActive()) {
            throw AppException.badRequest("This account is inactive.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    public LoginResponse refresh(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtUtil.isValid(token)) {
            throw AppException.badRequest(appMessages.get("auth.refresh.invalid"));
        }
        String subject = jwtUtil.extractSubject(token);
        User user = userRepository.findByUsernameOrEmail(subject)
                .orElseThrow(() -> AppException.notFound(appMessages.get("auth.refresh.user_not_found")));
        if (!user.isActive()) {
            throw AppException.badRequest(appMessages.get("auth.refresh.account_inactive"));
        }
        return buildResponse(user);
    }

    private LoginResponse buildResponse(User user) {
        Map<String, Object> claims = Map.of(
                "role", user.getRoleType().name(),
                "userId", user.getId(),
                "branchId", user.getBranchId() != null ? user.getBranchId() : 0L,
                "mustChangePassword", user.isMustChangePassword()
        );
        String accessToken = jwtUtil.generateToken(user.getUsername(), claims);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        LoginResponse.UserDto userDto = LoginResponse.UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRoleType().name())
                .branchId(user.getBranchId())
                .mustChangePassword(user.isMustChangePassword())
                .permissions(rolePermissionService.getPermissionMap(user.getRole().getId()))
                .build();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .user(userDto)
                .build();
    }

    private static String resolveClientIp(HttpServletRequest request) {
        if (request == null) return null;
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
