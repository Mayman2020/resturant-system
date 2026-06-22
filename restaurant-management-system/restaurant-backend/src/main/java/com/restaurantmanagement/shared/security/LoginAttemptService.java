package com.restaurantmanagement.shared.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private record AttemptRecord(int count, LocalDateTime lockedUntil) {}

    private final ConcurrentHashMap<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    public void recordSuccess(String identifier) {
        attempts.remove(identifier.toLowerCase());
    }

    public void recordFailure(String identifier) {
        String key = identifier.toLowerCase();
        AttemptRecord current = attempts.getOrDefault(key, new AttemptRecord(0, null));
        int newCount = current.count() + 1;
        LocalDateTime lockedUntil = newCount >= MAX_ATTEMPTS
                ? LocalDateTime.now().plusMinutes(LOCK_MINUTES)
                : null;
        attempts.put(key, new AttemptRecord(newCount, lockedUntil));
    }

    public boolean isLocked(String identifier) {
        AttemptRecord record = attempts.get(identifier.toLowerCase());
        if (record == null || record.lockedUntil() == null) return false;
        if (LocalDateTime.now().isAfter(record.lockedUntil())) {
            attempts.remove(identifier.toLowerCase());
            return false;
        }
        return true;
    }

    public int remainingAttempts(String identifier) {
        AttemptRecord record = attempts.get(identifier.toLowerCase());
        if (record == null) return MAX_ATTEMPTS;
        return Math.max(0, MAX_ATTEMPTS - record.count());
    }
}
