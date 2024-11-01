# Employee Tracker

Employee Tracker is a command-line application that manages a company's employee database. It allows business owners and HR teams to view, add, update, and delete employees, roles, and departments using an interactive command-line interface (CLI). The application is built with Node.js, PostgreSQL, and Inquirer.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)
- [License](#license)

---

## Installation

To set up the Employee Tracker on your local machine, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/maleehali/crewspace.git
    cd crewspace
    ```

2. **Install Dependencies**:
    Ensure that Node.js and PostgreSQL are installed on your machine. Then, install the required npm packages:
    ```bash
    npm install
    ```

3. **Set Up PostgreSQL Database**:
    - Start the PostgreSQL service on your computer.
    - Connect to PostgreSQL and create the database:
      ```sql
      CREATE DATABASE employee_db;
      ```
    - Run the `schema.sql` file to create the tables:
      ```bash
      psql -U postgres -d employee_db -f db/schema.sql
      ```

4. **Database Configuration**:
    Update the database connection details in `db/connection.js` if needed to match your PostgreSQL setup.

## Usage

To start the application, run the following command:
```bash
node index.js
```

You’ll be presented with an interactive menu where you can select various options to manage the employee database. Navigate through the options to view, add, update, and delete data.

Menu Options
View All Departments: Displays all departments in the database.
View All Roles: Lists all roles along with department names and salaries.
View All Employees: Shows all employees, including roles, departments, and managers.
Add Department: Prompts to add a new department.
Add Role: Prompts to add a new role with title, salary, and department.
Add Employee: Prompts to add a new employee with role and manager details.
Update Employee Role: Allows updating an employee’s role.
Update Employee Manager: Allows updating an employee’s manager.
View Employees by Manager: Displays employees grouped by manager.
View Employees by Department: Displays employees grouped by department.
Delete Employee: Deletes an employee from the database.
Exit: Exits the application.

Features
Manage Departments, Roles, and Employees: Add, view, and delete departments, roles, and employees.
Update Employee Data: Modify employee roles and managers.
View Data Grouped by Manager and Department: Easily view employees grouped by their managers or departments.
Error Handling: Handles invalid inputs and displays error messages when necessary.

Database Schema
The application uses the following tables to store data:

Department:

id: Primary key for the department
name: Department name
Role:

id: Primary key for the role
title: Role title
salary: Salary for the role
department_id: Foreign key referencing department.id
Employee:

id: Primary key for the employee
first_name: Employee's first name
last_name: Employee's last name
role_id: Foreign key referencing role.id
manager_id: Self-referencing foreign key for the employee's manager
Technologies Used
Node.js: JavaScript runtime environment
Inquirer: CLI prompts for interacting with users
PostgreSQL: Relational database to manage employee, role, and department data
License
This project is licensed under the MIT License.

### Walkthrough Video
[Watch the Walkthrough video here!](https://drive.google.com/file/d/1Sn2F7ewDlXb7qxy7O03-XxScp2STurDH/view?usp=sharing)

### GitHub Repository
[GitHub Repository Link](https://github.com/maleehali/crewspace)


Render Deployment Link:
