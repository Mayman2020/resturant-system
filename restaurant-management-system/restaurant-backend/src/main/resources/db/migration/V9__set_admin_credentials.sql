SET search_path TO restaurant_mgmt;
UPDATE users SET username = 'admin', password_hash = '$2b$10$49wu0oR2J3vEOrZkEGsLMuLFpKEt3nrQ9pnquwuvfZu2ceMvriOnq', is_active = TRUE, must_change_password = FALSE
WHERE username = 'admin' OR email = 'admin@restaurant.com';
