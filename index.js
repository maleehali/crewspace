// Import necessary modules
const inquirer = require('inquirer'); // For command-line prompts
const client = require('./db/connection'); // Database connection

// Main menu function that prompts user for an action
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Employee',
                'Exit'
            ]
        }
    ]).then(answer => {
        // Perform action based on user selection
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View Employees by Manager':
                viewEmployeesByManager();
                break;
            case 'View Employees by Department':
                viewEmployeesByDepartment();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Exit':
                client.end(); // Close database connection
                console.log('Goodbye!');
                break;
        }
    });
}

// Initialize the application by displaying the main menu
mainMenu();

// Function to display all departments
function viewAllDepartments() {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows); // Display departments in table format
            mainMenu();
        }
    });
}

// Function to display all roles with their associated departments
function viewAllRoles() {
    client.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id', 
    (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
            mainMenu();
        }
    });
}

// Function to display all employees with their roles, departments, and manager IDs
function viewAllEmployees() {
    client.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id', 
    (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
            mainMenu();
        }
    });
}

// Function to add a new department to the database
function addDepartment() {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the department name:',
    }).then(answer => {
        client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.name} to the database.`);
            mainMenu();
        });
    });
}

// Function to add a new role with title, salary, and department ID
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the role title:',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for this role:',
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'Enter the department ID for this role:',
        }
    ]).then(answer => {
        client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
        [answer.title, answer.salary, answer.department_id], 
        (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.title} role to the database.`);
            mainMenu();
        });
    });
}

// Function to add a new employee with name, role, and manager ID
function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Enter the employee’s first name:',
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Enter the employee’s last name:',
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the role ID for this employee:',
        },
        {
            name: 'manager_id',
            type: 'input',
            message: 'Enter the manager ID for this employee (leave blank if none):',
            default: null
        }
    ]).then(answer => {
        client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
        [answer.first_name, answer.last_name, answer.role_id, answer.manager_id || null], 
        (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.first_name} ${answer.last_name} to the database.`);
            mainMenu();
        });
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    inquirer.prompt([
        {
            name: 'employee_id',
            type: 'input',
            message: 'Enter the employee ID to update:',
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the new role ID for this employee:',
        }
    ]).then(answer => {
        client.query('UPDATE employee SET role_id = $1 WHERE id = $2', 
        [answer.role_id, answer.employee_id], 
        (err, res) => {
            if (err) throw err;
            console.log(`Updated employee's role in the database.`);
            mainMenu();
        });
    });
}

// Function to update an employee's manager
function updateEmployeeManager() {
    client.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Choose an employee to update their manager:',
                choices: employees
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Choose a new manager:',
                choices: [...employees, { name: 'None', value: null }]
            }
        ]).then(answer => {
            client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answer.managerId, answer.employeeId], (err, res) => {
                if (err) throw err;
                console.log('Employee manager updated.');
                mainMenu();
            });
        });
    });
}

// Function to view employees grouped by their manager
function viewEmployeesByManager() {
    const query = `
        SELECT 
            manager.first_name AS manager_first, 
            manager.last_name AS manager_last, 
            emp.first_name AS employee_first, 
            emp.last_name AS employee_last
        FROM employee emp
        LEFT JOIN employee manager ON emp.manager_id = manager.id
        ORDER BY manager.last_name, emp.last_name;
    `;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching employees by manager:', err);
        } else {
            console.table(res.rows);
            mainMenu();
        }
    });
}

// Function to view employees grouped by department
function viewEmployeesByDepartment() {
    const query = `
        SELECT 
            department.name AS department, 
            employee.first_name AS employee_first, 
            employee.last_name AS employee_last
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY department.name, employee.last_name;
    `;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching employees by department:', err);
        } else {
            console.table(res.rows);
            mainMenu();
        }
    });
}

// Function to delete an employee from the database
function deleteEmployee() {
    client.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) {
            console.error('Error fetching employees:', err);
            mainMenu();
            return;
        }
        
        const employees = res.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select an employee to delete:',
                choices: employees
            }
        ]).then(answer => {
            client.query('DELETE FROM employee WHERE id = $1', [answer.employeeId], (err, res) => {
                if (err) {
                    console.error('Error deleting employee:', err);
                } else {
                    console.log('Employee deleted.');
                }
                mainMenu();
            });
        });
    });
}
