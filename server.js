// 12-MySQL/01-Activities/14-TwoTables/Solved/topSongsAndAlbumsCode.js

const mysql = require('mysql');
const inquirer = require('inquirer');

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
});

const runSearch = () => {
  console.log("Service started");
};

const initialQuestions = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all employees by department',
        'View all employees by manager',
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

        case 'View all employees by department':
          viewAllEmployeesByDepartment();
          break;

        case 'View all employees by manager':
          viewAllEmployeesByManager();
          break;

// Add remaining cases

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });

  };


  const viewAllEmployees = () => {
    const query = 'SELECT * FROM employee';
    connection.query(query, [], (err, res) => {
      res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
        console.log(
          `ID: ${id} || First name: ${first_name} || Last name: ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
        );
      });
      initialQuestions();
    });
     
  };