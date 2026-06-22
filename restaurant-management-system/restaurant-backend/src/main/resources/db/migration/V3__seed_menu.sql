SET search_path = restaurant_mgmt;

INSERT INTO branches (name, code, address, phone, email, tax_rate, service_charge)
VALUES ('Main Branch', 'BR-001', '123 Restaurant Street', '+1234567890', 'main@restaurant.com', 10.00, 5.00);

INSERT INTO menu_categories (branch_id, name, category_type, sort_order) VALUES
(1, 'Drinks', 'DRINKS', 1),
(1, 'Meals', 'MEALS', 2),
(1, 'Desserts', 'DESSERTS', 3),
(1, 'Special Offers', 'OFFERS', 4);

INSERT INTO menu_items (category_id, name, description, price, preparation_time, image_url) VALUES
(1, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.50, 5, '/assets/menu/orange-juice.jpg'),
(1, 'Iced Latte', 'Cold espresso with milk', 5.50, 5, '/assets/menu/iced-latte.jpg'),
(1, 'Mint Lemonade', 'Refreshing mint lemonade', 4.00, 5, '/assets/menu/mint-lemonade.jpg'),
(2, 'Classic Burger', 'Beef patty with lettuce, tomato, cheese', 12.99, 20, '/assets/menu/burger.jpg'),
(2, 'Grilled Chicken', 'Marinated grilled chicken with rice', 14.50, 25, '/assets/menu/chicken.jpg'),
(2, 'Margherita Pizza', 'Tomato, mozzarella, basil', 11.99, 18, '/assets/menu/pizza.jpg'),
(2, 'Pasta Carbonara', 'Creamy pasta with bacon', 13.50, 15, '/assets/menu/pasta.jpg'),
(3, 'Chocolate Cake', 'Rich chocolate layer cake', 6.50, 5, '/assets/menu/chocolate-cake.jpg'),
(3, 'Ice Cream Sundae', 'Vanilla ice cream with toppings', 5.99, 5, '/assets/menu/sundae.jpg'),
(4, 'Family Combo', '2 burgers + 2 drinks + fries', 29.99, 25, '/assets/menu/combo.jpg');

INSERT INTO menu_modifiers (menu_item_id, name, modifier_type, price_adjustment) VALUES
(4, 'Extra Cheese', 'EXTRA', 1.50),
(4, 'Spicy Level - Mild', 'SPICY', 0.00),
(4, 'Spicy Level - Hot', 'SPICY', 0.00),
(4, 'Size - Regular', 'SIZE', 0.00),
(4, 'Size - Large', 'SIZE', 3.00),
(4, 'Bacon Topping', 'TOPPING', 2.00),
(6, 'Size - Small', 'SIZE', 0.00),
(6, 'Size - Medium', 'SIZE', 3.00),
(6, 'Size - Large', 'SIZE', 6.00),
(6, 'Extra Toppings', 'TOPPING', 2.50);

INSERT INTO inventory_items (branch_id, name, unit, current_stock, min_stock, cost_per_unit) VALUES
(1, 'Burger Bun', 'piece', 200, 50, 0.30),
(1, 'Beef Patty', 'piece', 150, 40, 2.50),
(1, 'Special Sauce', 'ml', 5000, 500, 0.01),
(1, 'Mozzarella Cheese', 'g', 10000, 1000, 0.02),
(1, 'Tomato', 'g', 8000, 1000, 0.005),
(1, 'Orange', 'piece', 100, 20, 0.40);

INSERT INTO menu_item_ingredients (menu_item_id, inventory_item_id, quantity_used) VALUES
(4, 1, 1),
(4, 2, 1),
(4, 3, 30),
(1, 6, 3);
