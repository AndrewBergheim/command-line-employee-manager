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
    message: "What should the role ID be?"
},

{
    type: "input",
    name: "title",
    message: "What should the role title be?"
},
{
    type: "input",
    name: "salary",
    message: "What should the role salary be?"
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
    message: "What should their new role be (by ID)?"
}]

// allows time to search so the prompt doesn't show up first
let QueryTimer = function(){
    return new Promise(resolve =>{
        setTimeout(function(){
            resolve(null)
        }, 1700)
    })
}


let init = function(){// runs initial prompt then starts main loop
    inquirer.prompt(login).then(function(data){
        const SQLConnectionData = {
            host: "localhost",
            user: data.username,
            password: data.password,
            database: "company_db"
        }


    let SQLQuery = function(yourQuery, yourVars){
        // create connection
        let connection = mysql.createConnection(SQLConnectionData);
        //query connection
        connection.query(yourQuery, yourVars, function(err, result){
            if (err){
                console.log(err.code)
                console.log("An error has occured. Check that your inputs were valid and that your username and password were inputted correctly")
                console.log(err)
            }
            else{// log and close connection
                console.log(" ")
                console.table(result)
                console.log("Operation Successful.")
                connection.end()
            }
        })
    }
    

        let SQLStaticQuery = function(yourQuery){
            // create connection
            let connection = mysql.createConnection(SQLConnectionData);
            //query connection
            connection.query(yourQuery, function(err, result){
                if (err){
                    console.log(err.code)
                    console.log("An error has occured. Check that your inputs were valid and that your username and password were inputted correctly")
                    console.log(err)
                }
                else{// log and close connection
                    console.log(" ")
                    console.table(result)
                    console.log("Operation Successful.")
                    connection.end()
                }
            })
        }

        let restart = function(){
            inquirer.prompt(InitialQuestion).then(function(data){
                switch(data.action){
                    case "View Departments":
                        SQLStaticQuery("select * FROM department")
                        QueryTimer().then(()=>{
                            console.log(" ")
                            restart()
                        })
                    break;
    
                    case "View Roles":
                        SQLStaticQuery("select * FROM roles")
                        QueryTimer().then(()=>{
                            console.log(" ")
                            restart()
                        })
                    break;
    
                    case "View Employees":
                        SQLStaticQuery("select * FROM employees")
                        QueryTimer().then(()=>{
                            console.log(" ")
                            restart()
                        })
                    break;
    
                    case "Add a Department":
                        inquirer.prompt(addDepartmentQuestions).then(function(data){
                            SQLQuery("insert into department VALUES(?,?);", [data.id, data.values])
                            restart()
                        });
                    break;
    
                    case "Add a Role":
                            
                        inquirer.prompt(addRoleQuestions).then(function(data){
                            SQLQuery("select id into @departmentVar from department where name = ? limit 1; insert into roles VALUES(?,?,?, @departmentVar);", [data.department, data.id, data.title, data.salary])
                            QueryTimer().then(()=>{
                                console.log(" ")
                                restart()
                            })
                        });
                    break;
    
                    case "Add an Employee":
                        inquirer.prompt(addEmployeeQuestions).then(function(data){
                            SQLQuery("select id into @rolesVar from roles where title = ? limit 1; insert into employees VALUES(?, ?, ?, @rolesVar, ?);", [data.role, data.id, data.first, data.last, data.manager])
                            QueryTimer().then(()=>{
                                console.log(" ")
                                restart()
                            })
                        });
                    break;
    
                    case "Update an Employee's Role":
                        inquirer.prompt(UpdateEmployeeRole).then(function(data){
                            SQLQuery("update employees set role_id = ? where id = ?;", [data.role, data.id])
                            QueryTimer().then(()=>{
                                console.log(" ")
                                restart()
                            })
                        });
                    break;
                }
            }
        )}
    restart()
    })
}

init()