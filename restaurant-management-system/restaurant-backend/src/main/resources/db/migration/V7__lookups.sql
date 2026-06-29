-- V7: Lookups reference data (PostgreSQL)
SET search_path TO restaurant_mgmt;

CREATE TABLE IF NOT EXISTS lookups (
    id          BIGSERIAL PRIMARY KEY,
    type        VARCHAR(50) NOT NULL,
    code        VARCHAR(50) NOT NULL,
    name_ar     VARCHAR(150) NOT NULL,
    name_en     VARCHAR(150) NOT NULL,
    parent_id   BIGINT,
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    is_locked   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uk_lookup_type_code UNIQUE (type, code)
);

CREATE INDEX IF NOT EXISTS idx_lookups_type_active ON lookups (type, is_active, sort_order);

INSERT INTO lookups (type, code, name_ar, name_en, sort_order) VALUES
('MENU_CATEGORY', 'APPETIZER', 'مقبلات', 'Appetizers', 1),
('MENU_CATEGORY', 'MAIN', 'أطباق رئيسية', 'Main courses', 2),
('MENU_CATEGORY', 'DESSERT', 'حلويات', 'Desserts', 3),
('MENU_CATEGORY', 'BEVERAGE', 'مشروبات', 'Beverages', 4),
('MENU_CATEGORY', 'SIDE', 'أطباق جانبية', 'Sides', 5);

INSERT INTO lookups (type, code, name_ar, name_en, sort_order, is_locked) VALUES
('PAYMENT_METHOD', 'CASH', 'نقدي', 'Cash', 1, TRUE),
('PAYMENT_METHOD', 'CARD', 'بطاقة', 'Card', 2, TRUE),
('PAYMENT_METHOD', 'WALLET', 'محفظة', 'Wallet', 3, FALSE);

INSERT INTO lookups (type, code, name_ar, name_en, sort_order) VALUES
('ORDER_CHANNEL', 'DINE_IN', 'صالة', 'Dine-in', 1),
('ORDER_CHANNEL', 'TAKEAWAY', 'تيك أواي', 'Takeaway', 2),
('ORDER_CHANNEL', 'DELIVERY', 'توصيل', 'Delivery', 3);

INSERT INTO lookups (type, code, name_ar, name_en, sort_order) VALUES
('TABLE_ZONE', 'INDOOR', 'داخلي', 'Indoor', 1),
('TABLE_ZONE', 'OUTDOOR', 'خارجي', 'Outdoor', 2),
('TABLE_ZONE', 'VIP', 'VIP', 'VIP', 3);

INSERT INTO lookups (type, code, name_ar, name_en, sort_order) VALUES
('INVENTORY_UNIT', 'KG', 'كيلو', 'Kilogram', 1),
('INVENTORY_UNIT', 'G', 'جرام', 'Gram', 2),
('INVENTORY_UNIT', 'L', 'لتر', 'Liter', 3),
('INVENTORY_UNIT', 'PCS', 'قطعة', 'Piece', 4);
