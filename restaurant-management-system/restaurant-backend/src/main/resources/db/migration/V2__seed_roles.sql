SET search_path = restaurant_mgmt;

INSERT INTO roles (name, description) VALUES
('ADMIN', 'System administrator with full access'),
('MANAGER', 'Branch manager'),
('CASHIER', 'Point of sale cashier'),
('WAITER', 'Waiter / server'),
('KITCHEN_STAFF', 'Kitchen display staff'),
('DELIVERY_DRIVER', 'Delivery driver');

INSERT INTO role_permissions (role_id, module_key, permissions)
SELECT r.id, m.module_key, m.perms::jsonb
FROM roles r
CROSS JOIN (VALUES
    ('ADMIN', 'dashboard', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'users', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'branches', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'tables', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'menu', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'orders', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'kitchen', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'delivery', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'customers', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'loyalty', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'billing', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'inventory', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'reports', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'settings', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('ADMIN', 'pos', '{"view":true,"create":true,"edit":true,"delete":true}'),
    ('MANAGER', 'dashboard', '{"view":true,"create":false,"edit":false,"delete":false}'),
    ('MANAGER', 'users', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'branches', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('MANAGER', 'tables', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'menu', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'orders', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'kitchen', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('MANAGER', 'delivery', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'customers', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'loyalty', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'billing', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'inventory', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('MANAGER', 'reports', '{"view":true,"create":false,"edit":false,"delete":false}'),
    ('MANAGER', 'settings', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('MANAGER', 'pos', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('CASHIER', 'dashboard', '{"view":true,"create":false,"edit":false,"delete":false}'),
    ('CASHIER', 'orders', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('CASHIER', 'billing', '{"view":true,"create":true,"edit":false,"delete":false}'),
    ('CASHIER', 'customers', '{"view":true,"create":true,"edit":false,"delete":false}'),
    ('CASHIER', 'pos', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('WAITER', 'tables', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('WAITER', 'orders', '{"view":true,"create":true,"edit":true,"delete":false}'),
    ('WAITER', 'menu', '{"view":true,"create":false,"edit":false,"delete":false}'),
    ('KITCHEN_STAFF', 'kitchen', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('KITCHEN_STAFF', 'orders', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('DELIVERY_DRIVER', 'delivery', '{"view":true,"create":false,"edit":true,"delete":false}'),
    ('DELIVERY_DRIVER', 'orders', '{"view":true,"create":false,"edit":false,"delete":false}')
) AS m(role_name, module_key, perms)
WHERE r.name = m.role_name;
