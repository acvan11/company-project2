var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var mysqlConnection = require('./mysqlConnection');

router.use(bodyparser.json());

// GET all employees 
router.get('/', (req, res)=>{
	mysqlConnection.query('SELECT * FROM employees', (err, rows, fields) => {
		if (!err){
			res.send(rows);
		}else {
			res.send(err);
		}
	});
});

// GET one employee
router.get('/:id', (req, res)=> {
	mysqlConnection.query('SELECT * FROM employees WHERE employee_id = ' + [req.params.id], (err, rows, fields) => {
		if (!err) {
			res.send(rows);
		}else {
			res.send(err);
		}
	});
});

// GET all projects of one employee
router.get('/:id/projects', (req, res) => {
	mysqlConnection.query('SELECT project_name \
FROM projects, (SELECT project_id FROM employees_projects WHERE employee_id =' + [req.params.id] +
') e WHERE e.project_id = projects.project_id', (err, rows, fields) => {
	if (!err) {
		res.send(rows);
	}else {
		res.send(err);
	}
});
});

// GET all skills that one employee knows
router.get('/:id/skills', (req, res) => {
	mysqlConnection.query('SELECT skills.skill_name \
		FROM skills , (SELECT skill_id FROM employees_skills WHERE employee_id = '
		+ [req.params.id] + ') emp_skill WHERE skills.skill_id = emp_skill.skill_id',
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			}else {
				res.send(err);
			}
		});
});

// DELETE an employee
router.delete('/:id', (req, res) => {
	mysqlConnection.query('DELETE FROM employees WHERE employee_id = ?', [req.params.id], (err, rows, fields) => {
		if (!err) {
			res.send('Delete successfully');
		}else {
			res.send(err);
		}
	});
});

// INSERT an employee
router.post('/', (req, res) =>{
	let emp = req.body;
	let sql = "SET @employee_id = ?; SET @employee_name = ?; SET @age =?; SET @gender =?; SET @employment_date =?; \
	CALL EmployeeAddOrEdit(@employee_id, @employee_name, @age, @gender, @employment_date);"
	
	mysqlConnection.query(sql, [emp.employee_id, emp.employee_name, emp.age, emp.gender, emp.employment_date], (err, rows, fields) => {
		if (!err){
			rows.forEach(element => {
				if (element.constructor == Array){
					res.send('Inserted employee id ='+ element[0].employee_id);
				}
			});
		} else{
			res.send(err);
		}
	});
});

// UPDATE a project
router.put('/', (req, res) => {
	let emp = req.body;
	let sql = "SET @employee_id = ?; SET @employee_name = ? ;SET @age =?; SET @gender =?; SET @employment_date =?; \
	CALL EmployeeAddOrEdit(@employee_id, @employee_name, @age, @gender, @employment_date);";
	mysqlConnection.query(sql, [emp.employee_id, emp.employee_name, emp.age, emp.gender, emp.employment_date], (err, rows, fields) => {
		if (!err){
			res.send('Updated successfully');
		} else {
			res.send(err);
		}
	});

})

// PROCEDURE EmployeeAddOrEdit for INSERT/UPDATE an employee in MySQL Workbench
// CREATE DEFINER=`root`@`localhost` PROCEDURE `EmployeeAddOrEdit`(
// 	IN _employee_id INT,
//     IN _employee_name VARCHAR(50),
//     IN _age INT,
//     IN _gender VARCHAR(10),
//     IN _employment_date DATE
// )
// BEGIN
// 	IF _employee_id = 0 THEN
// 		INSERT INTO employees (employee_name, age, gender, employment_date)
//         VALUES(_employee_name, _age, _gender, _employment_date);
//         SET _employee_id = LAST_INSERT_ID();
//     ELSE
// 		UPDATE employees
//         SET
//         employee_name = _employee_name,
//         age = _age,
//         gender = _gender,
//         employment_date = _employment_date
//         WHERE employee_id = _employee_id;
//     END IF;
// 	SELECT _employee_id AS 'employee_id';
// END

// Create table "employees" in MySql
// CREATE TABLE IF NOT EXISTS employees (	
// 	employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//     employee_name VARCHAR(255) NOT NULL,
//     age INT, 
//     gender VARCHAR(10),
//     employment_date DATE
// );

module.exports = router;