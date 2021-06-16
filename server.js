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
  console.log("Excelsior!");
  console.log("Listening on port: " + connection.port);
};

// ****************
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
        case 'Find songs by artist':
          artistSearch();
          break;

        case 'Find all artists who appear more than once':
          multiSearch();
          break;

        case 'Find data within a specific range':
          rangeSearch();
          break;

        case 'Search for a specific song':
          songSearch();
          break;

        case 'Find artists with a top song and top album in the same year':
          songAndAlbumSearch();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
