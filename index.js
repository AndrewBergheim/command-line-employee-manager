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
    message: "What should their ID be?"
},

{
    type: "input",
    name: "title",
    message: "What should their title be?"
},
{
    type: "input",
    name: "salary",
    message: "What should their salary be?"
},
{
    type: "input",
    name: "department",
    message: "What is the name of the department the role belongs to?"
}]

const addEmployeeQuestions = [{
    type: "input",
    name: "id",
    message: "What should their ID be?"
},

{
    type: "input",
    name: "first",
    message: "What is their first name?"
},
{
    type: "input",
    name: "last",
    message: "What is their last name?"
},
{
    type: "input",
    name: "role",
    message: "What is the name of their role?"
},{
    type: "input",
    name: "manager",
    message: "(optional) What is their manager's id?"
}

]

const UpdateEmployeeRole = [{
    type: "input",
    name: "id",
    message: "What is the employee's id?"
},

{
    type: "input",
    name: "role",
    message: "What should their new role be?"
}]

let init = function(){
    inquirer.prompt(login).then(function(data){
        const SQLConnectionData = {
            host: "localhost",
            user: data.username,
            password: data.password,
            database: "company_db"
        }


        let SQLQuery = function(yourQuery){
            let connection = mysql.createConnection(SQLConnectionData);
            connection.query(yourQuery, function(err, result){
                if (err){
                    console.log(err)
                }
                else{
                    console.table(result)
                    connection.end()
                }
            })
        }
        let restart = function(){
            inquirer.prompt(InitialQuestion).then(function(data){
                switch(data.action){
                    case "View Departments":
                        SQLQuery("select * FROM department")
                        restart()
    
                    break;
    
                    case "View Roles":
                        SQLQuery("select * FROM roles")
                        restart()
                        
                    break;
    
                    case "View Employees":
                        SQLQuery("select * FROM employees")
                        restart()
                    break;
    
                    case "Add a Department":
                        inquirer.prompt(addDepartmentQuestions).then(function(data){
                            SQLQuery(tString`insert into department VALUES(${data.id}, ${data.department});`)
                            restart()
                        });
                    break;
    
                    case "Add a Role":
                            
                        inquirer.prompt(addRoleQuestions).then(function(data){
                            SQLQuery(tString`select id from department where name = '${data.depName}' into @departmentVar; insert into roles VALUES('${data.id}', '${data.title}', '${data.salary}', @departmentVar)`)
                            restart()
                        });
                    break;
    
                    case "Add an Employee":
                        inquirer.prompt(addEmployeeQuestions).then(function(data){
                            SQLQuery(tString`select id from roles where name = '${data.role}' into @rolesVar; insert into employees VALUES(${data.id}, '${data.first}', '${data.last}', @rolesVar,  '${data.manager}' );`)
                            restart()
                        });
                    break;
    
                    case "Update an Employee's Role":
                        inquirer.prompt(UpdateEmployeeRole).then(function(data){
                            
                        });
                    break;
                }
            }
        )}
    restart()
    })
}

init()