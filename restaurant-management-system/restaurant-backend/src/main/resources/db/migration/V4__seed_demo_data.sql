SET search_path = restaurant_mgmt;

-- admin / admin123 (BCrypt)
INSERT INTO users (username, email, password_hash, full_name, phone, role_id, branch_id, must_change_password)
SELECT 'admin', 'admin@restaurant.com',
       '$2a$10$RlnXElHxduVgXXkvTDpZfOOdlfv20W4zlLBYhalxXwUWP/tuBRgU.',
       'System Administrator', '+10000000001', r.id, 1, false
FROM roles r WHERE r.name = 'ADMIN';

INSERT INTO users (username, email, password_hash, full_name, phone, role_id, branch_id, must_change_password)
SELECT u.username, u.email,
       '$2a$10$RlnXElHxduVgXXkvTDpZfOOdlfv20W4zlLBYhalxXwUWP/tuBRgU.',
       u.full_name, u.phone, r.id, 1, false
FROM (VALUES
    ('manager', 'manager@restaurant.com', 'Branch Manager', '+10000000002', 'MANAGER'),
    ('cashier', 'cashier@restaurant.com', 'Main Cashier', '+10000000003', 'CASHIER'),
    ('waiter', 'waiter@restaurant.com', 'Head Waiter', '+10000000004', 'WAITER'),
    ('kitchen', 'kitchen@restaurant.com', 'Kitchen Lead', '+10000000005', 'KITCHEN_STAFF'),
    ('driver', 'driver@restaurant.com', 'Delivery Driver', '+10000000006', 'DELIVERY_DRIVER')
) AS u(username, email, full_name, phone, role_name)
JOIN roles r ON r.name = u.role_name;

INSERT INTO restaurant_tables (branch_id, table_number, seating_type, capacity, status, qr_code) VALUES
(1, 'T01', 'INDOOR', 4, 'AVAILABLE', 'QR-T01'),
(1, 'T02', 'INDOOR', 4, 'AVAILABLE', 'QR-T02'),
(1, 'T03', 'INDOOR', 6, 'AVAILABLE', 'QR-T03'),
(1, 'T04', 'INDOOR', 2, 'AVAILABLE', 'QR-T04'),
(1, 'O01', 'OUTDOOR', 4, 'AVAILABLE', 'QR-O01'),
(1, 'O02', 'OUTDOOR', 6, 'AVAILABLE', 'QR-O02');

INSERT INTO customers (full_name, email, phone, loyalty_tier) VALUES
('John Smith', 'john@email.com', '+1555000001', 'STANDARD'),
('Jane Doe', 'jane@email.com', '+1555000002', 'VIP'),
('Ahmed Ali', 'ahmed@email.com', '+1555000003', 'GOLD');

INSERT INTO loyalty_points (customer_id, points, tier, lifetime_points) VALUES
(1, 120, 'STANDARD', 120),
(2, 850, 'VIP', 850),
(3, 420, 'GOLD', 420);

INSERT INTO coupons (code, description, discount_type, discount_value, min_order, max_uses, valid_from, valid_until) VALUES
('WELCOME10', '10% off first order', 'PERCENT', 10, 20, 100, NOW(), NOW() + INTERVAL '1 year'),
('FLAT5', '$5 off orders over $30', 'FIXED', 5, 30, 50, NOW(), NOW() + INTERVAL '6 months');

INSERT INTO branch_settings (branch_id, setting_key, setting_value) VALUES
(1, 'currency', 'USD'),
(1, 'receipt_footer', 'Thank you for dining with us!'),
(1, 'delivery_radius_km', '10'),
(1, 'low_stock_alert', 'true');

INSERT INTO orders (order_number, branch_id, table_id, customer_id, waiter_id, order_type, status,
                    subtotal, tax_amount, service_charge, total_amount, accepted_at, preparing_at, ready_at, completed_at)
VALUES
('ORD-1001', 1, 1, 1, 4, 'DINE_IN', 'COMPLETED', 25.48, 2.55, 1.27, 29.30, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '110 minutes', NOW() - INTERVAL '80 minutes', NOW() - INTERVAL '60 minutes'),
('ORD-1002', 1, NULL, 2, 4, 'TAKEAWAY', 'PREPARING', 18.99, 1.90, 0.95, 21.84, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '15 minutes', NULL, NULL),
('ORD-1003', 1, NULL, 3, NULL, 'DELIVERY', 'ACCEPTED', 32.50, 3.25, 1.63, 40.38, NOW() - INTERVAL '10 minutes', NULL, NULL, NULL);

INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, line_total) VALUES
(1, 4, 'Classic Burger', 1, 12.99, 12.99),
(1, 1, 'Fresh Orange Juice', 2, 4.50, 9.00),
(1, 8, 'Chocolate Cake', 1, 6.50, 6.50),
(2, 6, 'Margherita Pizza', 1, 11.99, 11.99),
(2, 2, 'Iced Latte', 1, 5.50, 5.50),
(3, 4, 'Classic Burger', 2, 12.99, 25.98),
(3, 3, 'Mint Lemonade', 1, 4.00, 4.00);

INSERT INTO payments (order_id, payment_method, amount) VALUES
(1, 'CARD', 29.30);

INSERT INTO delivery_orders (order_id, driver_id, delivery_address, delivery_fee, estimated_minutes, status, assigned_at)
VALUES (3, 6, '456 Customer Ave, City', 5.00, 35, 'ASSIGNED', NOW() - INTERVAL '5 minutes');

INSERT INTO receipts (order_id, receipt_number, subtotal, tax_amount, service_charge, total_amount, printed_at)
VALUES (1, 'RCP-1001', 25.48, 2.55, 1.27, 29.30, NOW() - INTERVAL '60 minutes');

INSERT INTO stock_movements (inventory_item_id, movement_type, quantity, reference, notes, created_by) VALUES
(1, 'STOCK_IN', 200, 'INIT-001', 'Initial stock', 1),
(2, 'STOCK_IN', 150, 'INIT-002', 'Initial stock', 1),
(3, 'USAGE', 30, 'ORD-1001', 'Burger order usage', 1);
