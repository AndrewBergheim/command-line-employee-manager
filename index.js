const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");
let tString = require("sql-template-strings")

let username;
let password;
// prompt shorthand



const InitialQuestion = {
    type: "list",
    name: "action",
    message: "What action would you like to take?",
    choices: ["View Departments", "View Roles", "View Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee's Role"]
}

const login = [{
    type: "input",
    name: "username",
    message: "What is your MySQL username?"
},

{
    type: "input",
    name: "password",
    message: "What is your MySQL password?"
}]

// setting up mysql connection


//questions
const addDepartmentQuestions = [{
    type: "input",
    name: "id",
    message: "What would you like the department ID to be?"
},

{
    type: "input",
    name: "department",
    message: "What would you like to call the department?"
}]
const addRoleQuestions = [{
    type: "input",
    name: "id",
    message: "What is your MySQL username?"
},

{
    type: "input",
    name: "title",
    message: "What is your MySQL password?"
},
{
    type: "input",
    name: "salary",
    message: "What is your MySQL password?"
}]

const addEmployeeQuestions = [{
    type: "input",
    name: "id",
    message: "What is your MySQL username?"
},

{
    type: "input",
    name: "title",
    message: "What is your MySQL password?"
},
{
    type: "input",
    name: "salary",
    message: "What is your MySQL password?"
},
{
    type: "input",
    name: "department",
    message: "What is your MySQL password?"
}]

const UpdateEmployeeRole = [{
    type: "input",
    name: "username",
    message: "What is your MySQL username?"
},

{
    type: "input",
    name: "password",
    message: "What is your MySQL password?"
}]

const ContinueQuestion = {

}


let init = function(){
    inquirer.prompt(login).then(function(data){
        const SQLConnection = mysql.createConnection({
            host: "localhost",
            user: data.username,
            password: data.password,
            database: "company_db"
        });

        let SQLQuery = function(yourQuery){
            SQLConnection.connect(function(err){
                if (err){
                    console.log(err)
                }
                else{
                    SQLConnection.query(yourQuery, function(err, result){
                        if (err){
                            console.log(err)
                        }
                        else{
                            console.table(result)
                        }
                    })
                    SQLConnection.end()
                }
            })
        }

       
        inquirer.prompt(InitialQuestion).then(function(data){
            switch(data.action){
                case "View Departments":
                    SQLQuery("select * FROM department")

                break;

                case "View Roles":
                    SQLQuery("select * FROM roles")
                    
                break;

                case "View Employees":
                    SQLQuery("select * FROM employees")
                break;

                case "Add a Department":
                    inquirer.prompt(addDepartmentQuestions).then(function(data){
                        SQLQuery(tString`insert into department VALUES(${data.id}, ${data.department});`)
                        
                    });
                break;

                case "Add a Role":
                    inquirer.prompt(addRoleQuestions).then(function(data){

                    });
                break;

                case "Add an Employee":
                    inquirer.prompt(addEmployeeQuestions).then(function(data){

                    });
                break;

                case "Update an Employee's Role":
                    inquirer.prompt(UpdateEmployeeRole).then(function(data){

                    });
                break;
            }
        })
    })
}

init()