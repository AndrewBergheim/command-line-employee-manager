drop database if exists company_db;
create database if not exists company_db;
use company_db;
create table department(
    id int PRIMARY KEY,
    depName VARCHAR(30)
);

create table roles (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

create table employees(
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL,
    FOREIGN KEY(role_id) REFERENCES ROLES(id)
);