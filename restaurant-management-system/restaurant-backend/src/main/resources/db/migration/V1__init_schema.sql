CREATE SCHEMA IF NOT EXISTS restaurant_mgmt;
SET search_path = restaurant_mgmt;

CREATE TABLE roles (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50) UNIQUE NOT NULL,
    description     VARCHAR(200),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id                  BIGSERIAL PRIMARY KEY,
    username            VARCHAR(100) UNIQUE NOT NULL,
    email               VARCHAR(150) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    full_name           VARCHAR(150),
    phone               VARCHAR(20),
    role_id             BIGINT NOT NULL REFERENCES roles(id),
    branch_id           BIGINT,
    is_active           BOOLEAN DEFAULT TRUE,
    must_change_password BOOLEAN DEFAULT FALSE,
    last_login          TIMESTAMP,
    last_login_ip       VARCHAR(45),
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE role_permissions (
    id          BIGSERIAL PRIMARY KEY,
    role_id     BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    module_key  VARCHAR(80) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(role_id, module_key)
);

CREATE TABLE branches (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    code            VARCHAR(50) UNIQUE NOT NULL,
    address         VARCHAR(500),
    phone           VARCHAR(20),
    email           VARCHAR(150),
    timezone        VARCHAR(50) DEFAULT 'UTC',
    tax_rate        DECIMAL(5,2) DEFAULT 0,
    service_charge  DECIMAL(5,2) DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ADD CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(id);

CREATE TABLE branch_settings (
    id          BIGSERIAL PRIMARY KEY,
    branch_id   BIGINT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(branch_id, setting_key)
);

CREATE TABLE restaurant_tables (
    id              BIGSERIAL PRIMARY KEY,
    branch_id       BIGINT NOT NULL REFERENCES branches(id),
    table_number    VARCHAR(20) NOT NULL,
    seating_type    VARCHAR(20) NOT NULL CHECK (seating_type IN ('INDOOR', 'OUTDOOR')),
    capacity        INT NOT NULL DEFAULT 4,
    status          VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING')),
    qr_code         VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(branch_id, table_number)
);

CREATE TABLE table_reservations (
    id              BIGSERIAL PRIMARY KEY,
    table_id        BIGINT NOT NULL REFERENCES restaurant_tables(id),
    customer_name   VARCHAR(150) NOT NULL,
    customer_phone  VARCHAR(20),
    party_size      INT NOT NULL,
    reserved_at     TIMESTAMP NOT NULL,
    status          VARCHAR(20) DEFAULT 'CONFIRMED',
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_categories (
    id              BIGSERIAL PRIMARY KEY,
    branch_id       BIGINT REFERENCES branches(id),
    name            VARCHAR(100) NOT NULL,
    category_type   VARCHAR(30) NOT NULL CHECK (category_type IN ('DRINKS', 'MEALS', 'DESSERTS', 'OFFERS')),
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_items (
    id                  BIGSERIAL PRIMARY KEY,
    category_id         BIGINT NOT NULL REFERENCES menu_categories(id),
    name                VARCHAR(200) NOT NULL,
    description         TEXT,
    image_url           VARCHAR(500),
    price               DECIMAL(10,2) NOT NULL,
    preparation_time    INT DEFAULT 15,
    is_available        BOOLEAN DEFAULT TRUE,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_modifiers (
    id              BIGSERIAL PRIMARY KEY,
    menu_item_id    BIGINT NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    modifier_type   VARCHAR(30) NOT NULL CHECK (modifier_type IN ('EXTRA', 'SPICY', 'SIZE', 'TOPPING')),
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customers (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150),
    phone           VARCHAR(20),
    address         VARCHAR(500),
    loyalty_tier    VARCHAR(30) DEFAULT 'STANDARD',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    order_number    VARCHAR(30) UNIQUE NOT NULL,
    branch_id       BIGINT NOT NULL REFERENCES branches(id),
    table_id        BIGINT REFERENCES restaurant_tables(id),
    customer_id     BIGINT REFERENCES customers(id),
    waiter_id       BIGINT REFERENCES users(id),
    order_type      VARCHAR(20) NOT NULL CHECK (order_type IN ('DINE_IN', 'TAKEAWAY', 'DELIVERY')),
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED')),
    subtotal        DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount      DECIMAL(12,2) DEFAULT 0,
    service_charge  DECIMAL(12,2) DEFAULT 0,
    tip_amount      DECIMAL(12,2) DEFAULT 0,
    total_amount    DECIMAL(12,2) DEFAULT 0,
    notes           TEXT,
    is_held         BOOLEAN DEFAULT FALSE,
    accepted_at     TIMESTAMP,
    preparing_at    TIMESTAMP,
    ready_at        TIMESTAMP,
    completed_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id    BIGINT NOT NULL REFERENCES menu_items(id),
    item_name       VARCHAR(200) NOT NULL,
    quantity        INT NOT NULL DEFAULT 1,
    unit_price      DECIMAL(10,2) NOT NULL,
    line_total      DECIMAL(12,2) NOT NULL,
    notes           TEXT,
    modifiers_json  JSONB DEFAULT '[]',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(id),
    payment_method  VARCHAR(20) NOT NULL CHECK (payment_method IN ('CASH', 'CARD', 'WALLET', 'MIXED')),
    amount          DECIMAL(12,2) NOT NULL,
    reference       VARCHAR(100),
    paid_at         TIMESTAMP DEFAULT NOW(),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE delivery_orders (
    id                  BIGSERIAL PRIMARY KEY,
    order_id            BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    driver_id           BIGINT REFERENCES users(id),
    delivery_address    VARCHAR(500) NOT NULL,
    delivery_fee        DECIMAL(10,2) DEFAULT 0,
    estimated_minutes   INT,
    status              VARCHAR(20) DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    assigned_at         TIMESTAMP,
    delivered_at        TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_points (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL REFERENCES customers(id),
    points          INT NOT NULL DEFAULT 0,
    tier            VARCHAR(30) DEFAULT 'STANDARD',
    lifetime_points INT DEFAULT 0,
    updated_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(customer_id)
);

CREATE TABLE coupons (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(50) UNIQUE NOT NULL,
    description     VARCHAR(255),
    discount_type   VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENT', 'FIXED')),
    discount_value  DECIMAL(10,2) NOT NULL,
    min_order       DECIMAL(10,2) DEFAULT 0,
    max_uses        INT,
    used_count      INT DEFAULT 0,
    valid_from      TIMESTAMP,
    valid_until     TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory_items (
    id              BIGSERIAL PRIMARY KEY,
    branch_id       BIGINT NOT NULL REFERENCES branches(id),
    name            VARCHAR(200) NOT NULL,
    unit            VARCHAR(30) NOT NULL,
    current_stock   DECIMAL(12,3) DEFAULT 0,
    min_stock       DECIMAL(12,3) DEFAULT 0,
    cost_per_unit   DECIMAL(10,2) DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_item_ingredients (
    id                  BIGSERIAL PRIMARY KEY,
    menu_item_id        BIGINT NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    inventory_item_id   BIGINT NOT NULL REFERENCES inventory_items(id),
    quantity_used       DECIMAL(12,3) NOT NULL,
    UNIQUE(menu_item_id, inventory_item_id)
);

CREATE TABLE stock_movements (
    id                  BIGSERIAL PRIMARY KEY,
    inventory_item_id   BIGINT NOT NULL REFERENCES inventory_items(id),
    movement_type       VARCHAR(20) NOT NULL CHECK (movement_type IN ('STOCK_IN', 'USAGE', 'WASTE', 'ADJUSTMENT')),
    quantity            DECIMAL(12,3) NOT NULL,
    reference           VARCHAR(100),
    notes               TEXT,
    created_by          BIGINT REFERENCES users(id),
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE receipts (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(id),
    receipt_number  VARCHAR(50) UNIQUE NOT NULL,
    subtotal        DECIMAL(12,2) NOT NULL,
    tax_amount      DECIMAL(12,2) DEFAULT 0,
    service_charge  DECIMAL(12,2) DEFAULT 0,
    tip_amount      DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount    DECIMAL(12,2) NOT NULL,
    printed_at      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(80),
    entity_id       BIGINT,
    details         JSONB,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE revoked_tokens (
    id              BIGSERIAL PRIMARY KEY,
    token_hash      VARCHAR(64) UNIQUE NOT NULL,
    expires_at      TIMESTAMP NOT NULL,
    revoked_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_branch ON orders(branch_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_restaurant_tables_branch ON restaurant_tables(branch_id);
CREATE INDEX idx_inventory_branch ON inventory_items(branch_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
