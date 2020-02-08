use company_db;
insert into department (id,depName) VALUES (1, 'Wizards');
insert into department (id,depName) VALUES (2, 'Sales');

insert into roles (id, title, salary, department_id) VALUES (1, 'Mall Cop', 42000.00, 1);
insert into roles (id, title, salary, department_id) VALUES (2, 'Propane',57000.00, 2);


insert into employees (id, first_name, last_name, role_id) VALUES (1, 'Paul', 'Blart', 1);
insert into employees (id, first_name, last_name, role_id) VALUES (2, 'Hank', 'Hill', 2);