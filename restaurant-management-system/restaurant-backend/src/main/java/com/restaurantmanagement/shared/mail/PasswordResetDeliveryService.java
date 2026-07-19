package com.restaurantmanagement.shared.mail;

import com.restaurantmanagement.modules.users.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetDeliveryService {

    private final EmailService emailService;

    @Value("${restaurant.password-reset.base-url:}")
    private String resetBaseUrl;

    public void deliver(User user, String token) {
        if (user == null || token == null || token.isBlank()) {
            return;
        }
        String resetLink = buildResetLink(token);
        boolean emailSent = false;

        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            String subject = "Restaurant RMS password reset";
            String body = """
                    A password reset was requested for account "%s".

                    Open this link within 24 hours:
                    %s

                    If you did not request this, ignore this message.
                    """.formatted(user.getUsername(), resetLink);
            emailSent = emailService.sendOptional(user.getEmail(), subject, body);
        }

        if (!emailSent) {
            log.info("Password reset for user {} (mail off) - token for dev: {}", user.getUsername(), token);
            log.debug("Password reset link: {}", resetLink);
        }
    }

    private String buildResetLink(String token) {
        String base = resetBaseUrl != null ? resetBaseUrl.trim() : "";
        if (base.isEmpty()) {
            return token;
        }
        String separator = base.contains("?") ? "&" : "?";
        return base + separator + "token=" + token;
    }
}
