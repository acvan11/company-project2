const express = require('express');
const bodyparser = require('body-parser');
var router = express.Router()
const mysqlConnection = require('./mysqlConnection');

router.use(bodyparser.json());

// GET all employees_skills
router.get('/', (req, res) => {
	mysqlConnection.query('SELECT * FROM employees_skills', (err, rows, fields) => {
		if (!err){
			res.send(rows);
		}else{
			res.send(err);
		}
	});
});

// GET one employee_skill row
router.get('/:id', (req, res) => {
	mysqlConnection.query('SELECT * FROM employees_skills WHERE id =' + [req.params.id], (err, rows, fields) => {
		if(!err){
			res.send(rows);
		}else{
			res.send(err);
		}
	});
});

// INSERT one employee_skill row
router.post('/', (req, res) => {
	let emp_ski = req.body;
	let sql = 'SET @id =?; SET @employee_id =? ; SET @skill_id = ?; \
	CALL EmpSkiAddOrEdit(@id, @employee_id, @skill_id);';
	mysqlConnection.query(sql, [emp_ski.id, emp_ski.employee_id, emp_ski.skill_id], (err, rows, fields) => {
		if (!err){
			rows.forEach(element => {
				if (element.constructor == Array){
					res.send('inserted id = ' + element[0].id);
				}
			});
		}else{
			res.send(err);
		}
	});
});

// UPDATE one employee_skill row
router.put('/', (req, res) => {
	let emp_ski = req.body;
	let sql = 'SET @id =?; SET @employee_id =? ; SET @skill_id = ?; \
	CALL EmpSkiAddOrEdit(@id, @employee_id, @skill_id);';
	mysqlConnection.query(sql, [emp_ski.id, emp_ski.employee_id, emp_ski.skill_id], (err, rows, fields) => {
		if (!err){
			res.send('update successfully!');
		}else{
			res.send(err);
		}
	});
});

// DELETE one employee_skill row
router.delete('/:id', (req, res) => {
	mysqlConnection.query('DELETE FROM employees_skills WHERE id = ' + [req.params.id], (err, rows, fields) => {
		if (!err){
			res.send('delete successfully');
		}else{
			res.send(err);
		}
	});
})

// PROCEDURE "EmpSkiAddOrEdit" in order
// CREATE DEFINER=`root`@`localhost` PROCEDURE `SkillAddOrEdit`(
// 	IN _skill_id INT,
//     IN _skill_name VARCHAR(20)
// )
// BEGIN
// 	IF _skill_id = 0 THEN
// 		INSERT INTO skills (skill_name)
// 		VALUES (_skill_name);
        
//         SET _skill_id = LAST_INSERT_ID();
// 	ELSE
// 		UPDATE skills
//         SET
//         skill_name = _skill_name
//         WHERE skill_id = _skill_id;
// 	END IF;
    
//     SELECT _skill_id AS 'skill_id';
        

// END

// ********************************************************

// create table "employees_skills" in MySql
// CREATE TABLE IF NOT EXISTS employees_skills (
// 	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//     employee_id INT NOT NULL,
//     skill_id INT NOT NULL,
//     FOREIGN KEY (employee_id)
//     REFERENCES employees(employee_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT,
//     FOREIGN KEY (skill_id)
//     REFERENCES skills(skill_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT
// );



module.exports = router;