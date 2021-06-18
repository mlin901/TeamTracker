// 12-MySQL/01-Activities/14-TwoTables/Solved/topSongsAndAlbumsCode.js

const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,  // ****** or (||) thing?
  user: 'root',
  password: 'qwert123',  // **********use env var stuff for this???????
  database: 'teamtrack_db',
});

connection.connect((err) => {
  if (err) throw err;
  initialQuestions();
  listsFromDb();
});

const listsFromDb = () => {
  connection.query("SELECT * from employee", function(error, res) {
    employeesInDb = res.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));
  });
  connection.query("SELECT * from department", function(error, res) {
    departmentsInDb = res.map(dept => ({ name: dept.name, value: dept.id }));
  });
  connection.query("SELECT * from role", function(error, res) {
    rolesInDb = res.map(role => ({ name: role.title, value: role.id }));
  });
}

const initialQuestions = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'Add employee',
        'Remove employee',
        'Update employee role',
        'Update employee manager',
        'View departments',
        'Add department',
        'Remove department',
        'Remove employee',
        'View roles',
        'Add role',
        'Remove role',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Remove employee':
          removeEmployee();
          break;
        case 'View departments':
          viewDepartments();
          break;
        case 'View roles':
          viewRoles();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewAllEmployees = () => {
  const query = 
    'SELECT * FROM employee';
  connection.query(query, (err, res) => {
    res.forEach(({ id, first_name, last_name, role_id, manager_id }) => console.table(res));
    initialQuestions();
  });
};

const viewDepartments = () => {
  const query = 
    'SELECT * FROM department';
  connection.query(query, (err, res) => {
    res.forEach(({ id, name }) => console.table(res));
    initialQuestions();
  });
};

const viewRoles = () => {
  const query = 
    'SELECT * FROM role';
  connection.query(query, (err, res) => {
    res.forEach(({ id, title, salary, department_id }) => console.table(res));
    initialQuestions();
  });
};

const addEmployee = () => {
  listsFromDb();
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Employee id: '
      },        {
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
    // .then((answer) => {
    //   const query = connection.query(
    //     "INSERT INTO employee SET ?",
    //     {
    //       id: answer.id,
    //       first_name: answer.first_name,
    //       last_name: answer.last_name,
    //       role_id: answer.role,
    //       manager_id: answer.manager_id
    //     },
    //     function(err, res) {
    //       if (err) throw err;  // *****check pattern
    //       console.log(query);
    //       console.log('Employee added');
    //       initialQuestions();
    //     }
    //   );
    // });

    .then((answer) => {
      const query = connection.query(
        'INSERT INTO employee SET ?', 
        { 
          id: answer.id,
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role,
          manager_id: answer.manager_id   // ****make optional???
        },
         (err, res) => {
          console.log(query);  // *******
          console.log('Employee deleted');
          initialQuestions();
        }
      );
    });


}

const removeEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'ID of employee to delete: '
      }
    ])
    .then((answer) => {
      const query = connection.query(
        'DELETE FROM employee WHERE ?', { id: answer.id }, (err, res) => {
          console.log(query);   // **************
          console.log('Employee deleted');
          initialQuestions();
        }
      );
    });
}


