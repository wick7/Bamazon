DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_id INT NULL,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (3020, "Monitor", "Electronics", 149.99, 15), 
        (3021, "1 TB Storage Drive", "Electronics", 99.99, 40),
        (3022, "Shirt", "Clothing", 19.99, 60),
        (3023, "Pants", "Clothing", 29.99, 20), 
        (3024, "Shrek 2", "Entertainment", 14.99, 20),
        (3025, "The Place Beyond The Pines", "Entertainment", 19.99, 10),
        (3026, "Apple", "Food", 0.99, 6), 
        (3027, "Pie", "Food", 8.99, 12), 
        (3028, "Cold Medicine", "Health", 9.99, 20), 
        (3029, "Asprin", "Health", 7.99, 20); 
        

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);

-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)