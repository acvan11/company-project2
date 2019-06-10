const express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();
var mysqlConnection = require('./mysqlConnection');

router.use(bodyparser.json());

// GET all skills
router.get('/', (req, res) => {
	mysqlConnection.query('SELECT * FROM skills', (err, rows, fields) => {
		if (!err){
			res.send(rows)
		}else {
			res.send(err)
		}
	});
});

// GET one skills
router.get('/:id', (req, res) => {
	mysqlConnection.query('SELECT * FROM skills WHERE skill_id = ' + [req.params.id], (err, rows, fields) => {
		if (!err){
			res.send(rows)
		}else {
			res.send(err)
		}
	});
});

// GET all employees knowing that skill
router.get('/:id/employees', (req, res) => {
	mysqlConnection.query('SELECT employee_name \
	FROM employees, (SELECT employee_id FROM employees_skills WHERE skill_id = ' + 
	[req.params.id] + ') emp_skill WHERE employees.employee_id = emp_skill.employee_id',
	(err, rows, fields) =>{
		if (!err){
			res.send(rows);
		}else {
			res.send(err)
		}
	});
});

// GET all projects using that skill
router.get('/:id/projects', (req, res) => {
	mysqlConnection.query('SELECT project_name\
	FROM projects, (SELECT project_id FROM projects_skills WHERE skill_id =' + [req.params.id] +
	') proj_skill WHERE projects.project_id = proj_skill.project_id', (err, rows, fields) => {
		if (!err){
			res.send(rows);
		}else {
			res.send(err);
		}
	});
});

// ADD one skill
router.post('/', (req, res) => {
	let skill = req.body;
	let sql = 'SET @skill_id = ?; SET @skill_name = ?; \
	CALL SkillAddOrEdit(@skill_id, @skill_name);';
	mysqlConnection.query(sql, [skill.skill_id, skill.skill_name], (err, rows, fields) => {
		if (!err) {
			rows.forEach(element => {
				if (element.constructor == Array){
					res.send('Inserted successfully skill_id = ' + element[0].skill_id);
				}
			});
		}else {
			res.send(err)
		}
	});
});

// UPDATE on skill
router.put('/', (req, res) => {
	let skill = req.body;
	let sql = 'SET @skill_id = ?; SET @skill_name = ?; \
	CALL SkillAddOrEdit(@skill_id, @skill_name);';
	mysqlConnection.query(sql, [skill.skill_id, skill.skill_name], (err, rows, fields) => {
		if (!err) {
				res.send('Update the skill successfully');
		}else {
			res.send(err)
		}
	});
});

// DELETE one skill

router.delete('/:id', (req, res) => {
	mysqlConnection.query('DELETE FROM skills WHERE skill_id = ' + [req.params.id], (err, rows, fields) => {
		if (!err) {
			res.send('Update the skill successfully');
		}else {
			res.send(err)
		}
	});
})

// PROCEDURE SkillAddOrEdit in order to INSERT/EDIT a skill in table "skills"
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

// *****************************************************

//create table "skills" in MySQL
// CREATE TABLE IF NOT EXISTS skills (
// 	skill_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//     skill_name VARCHAR(20) NOT NULL
// );

module.exports = router