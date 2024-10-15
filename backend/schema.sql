-- schema.sql

-- Drop tables if they exist (without CASCADE, which is unsupported in SQLite)
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS companies;

-- Create tables

CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT,
    item_description TEXT
);

CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    company_address TEXT,
    mobile TEXT,
    email TEXT
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    pass TEXT,
    is_admin INTEGER,
    phone_number TEXT,
    email TEXT,
    company INTEGER,
    FOREIGN KEY (company) REFERENCES companies(id)
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_address TEXT,
    mobile TEXT,
    email TEXT
);

CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_of_purchase TEXT,
    company INTEGER,
    item INTEGER,
    quantity INTEGER,
    cost INTEGER,
    customer INTEGER,
    purchase_description TEXT,
    FOREIGN KEY (company) REFERENCES companies(id),
    FOREIGN KEY (item) REFERENCES items(id),
    FOREIGN KEY (customer) REFERENCES customers(id)
);
