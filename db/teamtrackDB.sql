DROP DATABASE IF EXISTS teamtrack_db;
CREATE DATABASE teamtrack_db;
USE teamtrack_db;

CREATE TABLE department (
  id INTEGER NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(8,2) NOT NULL,
  department_id INTEGER(10) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INTEGER NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER(10) NOT NULL,
  manager_id INTEGER(10),
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);





