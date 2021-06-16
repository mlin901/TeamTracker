USE teamtrack_db;

INSERT INTO department (id, name)
VALUES (2, "marketing");

INSERT INTO department (id, name)
VALUES (3, "development");

INSERT INTO department (id, name)
VALUES (1, "sales");

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Developer", 100000.00, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Manager", 200000.00, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Salesperson", 100000.00, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Content Developer", 90000.00, 2);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (10, "Bob", "Smith", 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (22, "Joe", "Doaks", 4, 10);