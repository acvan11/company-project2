var express = require('express');
var router = express.Router();
var mysqlConnection = require('./mysqlConnection');
var bodyparser = require('body-parser');

router.use(bodyparser.json());

// GET all employees_projects
router.get('/', (req, res)=>{
	mysqlConnection.query('SELECT * FROM employees_projects', (err, rows, fields) => {
		if (!err){
			res.send(rows);
		}else{
			res.send(err);
		}
	});
});

// GET one employee_project
router.get('/:id', (req, res) => {
	mysqlConnection.query('SELECT * FROM employees_projects WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if(!err){
			res.send(rows);
		}else {
			res.send(err);
		}
	});
});

// DELETE one employee_project
router.delete('/:id', (req,res) => {
	mysqlConnection.query('DELETE FROM employees_projects WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if(!err){
			res.send('delete successfully');
		}else {
			res.send(err);
		}
	});
});

// INSERT one employee_project
router.post('/', (req,res) => {
	let emp_proj = req.body;
	let sql = "SET @id = ?; SET @employee_id =?; SET @project_id =?; \
	CALL EmpProjAddOrEdit(@id, @employee_id, @project_id);";
	mysqlConnection.query(sql,[emp_proj.id, emp_proj.employee_id, emp_proj.project_id], (err, rows, fields) => {
		if(!err){
			rows.forEach(element => {
				if (element.constructor == Array){
					res.send('Inserted one emp_proj id = ' + element[0].id);
				}
			})
		}else{
			res.send(err);
		}
	});
});

// UPDATE one employee_project
router.put('/', (req,res) => {
	let emp_proj = req.body;
	let sql = "SET @id =?; SET @employee_id = ?; SET @project_id =?; \
	CALL EmpProjAddOrEdit(@id, @employee_id, @project_id);";
	mysqlConnection.query(sql, [emp_proj.id, emp_proj.employee_id, emp_proj.project_id], (err, rows, fields) => {
		if (!err){
			res.send('Update successfully');
		}else {
			res.send(err);
		}
	});
});

// PROCEDURE EmpProjAddOrEdit for UPDATE/INSERT an employee_project
// CREATE DEFINER=`root`@`localhost` PROCEDURE `ProjectAddOrEdit`(
// 	IN _project_id INT,
//     IN _project_name VARCHAR(50),
//     IN _project_date_start DATE
// )
// BEGIN
// 	IF _project_id = 0 THEN
// 		INSERT INTO projects(project_name, project_date_start)
//         VALUES(_project_name, _project_date_start);
        
//         SET _project_id = LAST_INSERT_ID();
// 	ELSE
// 		UPDATE projects
//         SET
//         project_name = _project_name,
//         project_date_start = _project_date_start
//         WHERE project_id = _project_id;
// 	END IF;
    
//     SELECT _project_id AS 'project_id';
    

// END

//Create table "employees_projects" in MySql
// CREATE TABLE IF NOT EXISTS employees_projects (
// 	employee_id INT NOT NULL,
//     project_id INT NOT NULL,
//     FOREIGN KEY (employee_id)
//     REFERENCES employees (employee_id)
//     ON UPDATE CASCADE
//    ON DELETE RESTRICT,
//     FOREIGN KEY (project_id)
//     REFERENCES projects (project_id)
//     ON UPDATE CASCADE
//    ON DELETE RESTRICT
// );

module.exports = router;