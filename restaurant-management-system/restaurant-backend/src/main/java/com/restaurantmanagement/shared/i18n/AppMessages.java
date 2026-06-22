package com.restaurantmanagement.shared.i18n;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AppMessages {

    private final MessageSource messageSource;

    public String get(String code) {
        return messageSource.getMessage(code, null, code, LocaleContextHolder.getLocale());
    }

    public String get(String code, Object... args) {
        return messageSource.getMessage(code, args, code, LocaleContextHolder.getLocale());
    }
}
