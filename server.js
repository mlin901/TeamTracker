// Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');
require('dotenv').config();

// Set up connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,  
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// App starting point (connect to MySQL database, print welcome, and start asking user for input)
connection.connect((err) => {
  if (err) throw err;
  printWelcome();
  initialQuestions();
});

// FUNCTION getListsFromDb - Gets lists used in inquirer choices: employeeds, departments, and roles
// The following use of map was adapted from code in github.com/acucunato/employee-tracker/blob/master/server.js.
// And the following was used as a general SQL reference for queries in this and subsequent functions:
//    https://github.com/mysqljs/mysql
const getListsFromDb = () => {
  connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS 'emp', id FROM employee e", function(error, res) {
    employeesInDb = res.map(employee => ({
      name: employee.emp,
      value: employee.id
    }));
  });
  connection.query('SELECT name, id FROM department', function(error, res) {
    departmentsInDb = res.map(dept => ({ 
      name: dept.name, 
      value: dept.id 
    }));
  });
  connection.query('SELECT title, id FROM role', function(error, res) {
    rolesInDb = res.map(role => ({ 
      name: role.title, 
      value: role.id 
    }));
  });
}

// FUNCTION initialQuestions - Prompts user to select a course of action, 
//    then calls a function based on user's selection
const initialQuestions = () => {
  getListsFromDb();
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all employees by department', 
        'View all employees by manager', 
        'View departments',
        'View roles',
        'Add employee',
        'Add department', 
        'Add role',  
        'Update employee role',
        'Update employee manager',
        'Remove employee',
        'Remove department',  
        'Remove role', 
        'View the total utilized budget of a department',
        'Exit app'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'View all employees by department':
          viewAllEmployeesByDepartment();
          break;
        case 'View all employees by manager':
          viewAllEmployeesByManager();
          break;
        case 'View departments':
          viewDepartments();
          break;
        case 'View roles':
          viewRoles();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
          break;
        case 'Remove employee':
          removeEmployee();
          break;
        case 'Remove department':
          removeDepartment();
          break;
        case 'Remove role':
          removeRole();
          break;
        case 'View the total utilized budget of a department':
          viewTotalBudget();
          break;
        case 'Exit app':
          exitApp();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// FUNCTION - Displays a table with all data from employee database table
const viewAllEmployees = () => {
  const query = 
    'SELECT * FROM employee';
  connection.query(query, (err, res) => {
    console.log('\n');
    console.table(res);
    initialQuestions();
  });
};

// FUNCTION - Displays a table with all data from the employee database table 
//  with employees sorted by department
const viewAllEmployeesByDepartment = () => {
  const query = 
    "SELECT employee.first_name, employee.last_name, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.id";
  connection.query(query, (err, res) => {
    console.log('\n');
    console.table(res);
    initialQuestions();
  });
};

// FUNCTION - Displays a table with all data from the employee database table
//  with employees sorted by manager
// Reference used for the following join: https://www.mysqltutorial.org/mysql-self-join/
const viewAllEmployeesByManager = () => {
  const query = 
    "SELECT CONCAT(e.last_name, ', ', e.first_name) AS 'Employee (subordinate)', CONCAT(m.last_name, ', ', m.first_name) AS Manager FROM employee e INNER JOIN employee m ON m.id = e.manager_id ORDER BY Manager";
    connection.query(query, (err, res) => {
    console.log('\n');
    console.table(res);
    initialQuestions();
  });
};

// FUNCTION - Displays a table with all data from the department database table
const viewDepartments = () => {
  const query = 
    'SELECT * FROM department';
  connection.query(query, (err, res) => {
    console.log('\n');
    console.table(res);
    initialQuestions();
  });
};

// FUNCTION - Displays a table with all data from the role database table
const viewRoles = () => {
  const query = 
    'SELECT * FROM role';
  connection.query(query, (err, res) => {
    console.log('\n');
    console.table(res);
    initialQuestions();
  });
};

// FUNCTION - Enables user to add an employee. Prompts user for employee information.
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Employee id: '
      },        
      {
        type: 'input',
        name: 'first_name',
        message: 'First name: '
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Last name: '
      },
      {
        type: 'list',
        name: 'role',
        message: 'Role: ',
        choices: rolesInDb
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Manager ID: '
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'INSERT INTO employee SET ?', 
        { 
          id: answer.id,
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role,
          manager_id: answer.manager_id  
        },
         (err, res) => {
          console.log('\nEmployee deleted');
          initialQuestions();
        }
      );
    }
  );
}

// FUNCTION - Enables user to add a department. Prompts user for department information.
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Department id: '
      },        
      {
        type: 'input',
        name: 'name',
        message: 'Department name: '
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'INSERT INTO department SET ?', 
        { 
          id: answer.id,
          name: answer.name,
        },
         (err, res) => {
          console.log('\nDepartment added');
          initialQuestions();
        }
      );
    }
  );
}

// FUNCTION - Enables user to add a role. Prompts user for role information.
const addRole = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Role ID: '
      },        
      {
        type: 'input',
        name: 'title',
        message: 'Role title: '
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Salary for role: '
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Department: ',
        choices: departmentsInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'INSERT INTO role SET ?', 
        { 
          id: answer.id,
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
         (err, res) => {
          console.log('\nRole added');
          initialQuestions();
        }
      );
    }
  );
}

// FUNCTION - Enables user to delete an employee. Prompts user to choose an employee from a list of all employees.
const removeEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Employee to delete: ',
        choices: employeesInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'DELETE FROM employee WHERE ?', { id: answer.id }, (err, res) => {
          console.log('\nEmployee deleted');
          initialQuestions();
        }
      );
    });
}

// FUNCTION - Enables user to delete a department. Prompts user to choose a department from a list of all departments.
const removeDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Department to delete: ',
        choices: departmentsInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'DELETE FROM department WHERE ?', { id: answer.id }, (err, res) => {
          console.log('\nDepartment deleted');
          initialQuestions();
        }
      );
    });
}

// FUNCTION - Enables user to delete a role. Prompts user to choose a role from a list of all roles.
const removeRole = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Role to delete: ',
        choices: rolesInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'DELETE FROM role WHERE ?', { id: answer.id }, (err, res) => {
          console.log('\nRole deleted');
          initialQuestions();
        }
      );
    });
}

// FUNCTION - Enables user to change the role for an employee. Prompts user to choose an employee from a 
// list of all employees and a new role from a list of all roles.
const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Employee: ',
        choices: employeesInDb
      },  
      {
        type: 'list',
        name: 'role',
        message: 'New role: ',
        choices: rolesInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {role_id: answer.role},
          {id: answer.id}
        ],
        (err, res) => {
          console.log('\nEmployee role updated');
          initialQuestions();
        }
      );
    });
}

// FUNCTION - Enables user to change an employee's manager. Prompts user to choose an employee from a 
// list of all employees and a new manager from a list of all employees.
const updateEmployeeManager = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Employee: ',
        choices: employeesInDb
      },  
      {
        type: 'list',
        name: 'manager',
        message: 'New manager: ',
        choices: employeesInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {manager_id: answer.manager},
          {id: answer.id}
        ],
        (err, res) => {
          console.log('\nEmployee role updated');
          initialQuestions();
        }
      );
    });
}

// FUNCTION - Enables user to view the salary expenditure for a specified department. Prompts user to choose a department
// from a list of all departments.
const viewTotalBudget = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Department whose salary total you want to view: ',
        choices: departmentsInDb
      }
    ])
    .then((answer) => {
      const query = connection.query(
        "SELECT SUM(role.salary) AS 'Total salary for department:' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE ?", 
        {'department.id': answer.id}, (err, res) => {
          console.log('\n');
          console.table(res);
          initialQuestions();
        }
      );
    });
}

// FUNCTION - Exits TeamTracker app, ending the connection to the MySQL database.
function exitApp() {
  connection.end(function(err) {
    console.log('\nThank you for using TeamTracker!\nServer connection terminated.\n');
  });
}

// FUNCTION - Renders welcome screen in ASCII art.
// The following was adapted from ASCII art generated by https://patorjk.com/software/taag/.
// It doesn't look quite right here because escape characters have been added where necessary, 
// which messes up the alignment in places.
function printWelcome() {
  console.log(`\n\n\n
 __          __        _                                         _                       
 \\ \\        / /       | |                                       | |                      
  \\ \\  /\\  / /   ___  | |   ___    ___    _ __ ___     ___      | |_    ___              
   \\ \\/  \\/ /   / _ \\ | |  / __|  / _ \\  | '_ \` _ \\   / _ \\     | __|  / _ \\             
    \\  /\\  /   |  __/ | | | (__  | (_) | | | | | | | |  __/     | |_  | (_) |            
  ___\\/__\\/     \\___| |_|  \\___|  \\___/__|_|_|_| |_|  \\___|      \\__| _\\___/             
 |__   __|                           |__   __|                       | |                 
    | |     ___    __ _   _ __ ___      | |     _ __    __ _    ___  | | __   ___   _ __ 
    | |    / _ \\  / _\` | | '_ \` _ \\     | |    | '__|  / _\` |  / __| | |/ /  / _ \\ | '__|
    | |   |  __/ | (_| | | | | | | |    | |    | |    | (_| | | (__  |   <  |  __/ | |   
    |_|    \\___|  \\__,_| |_| |_| |_|    |_|    |_|     \\__,_|  \\___| |_|\\_\\  \\___| |_|   
\n`)
}