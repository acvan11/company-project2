const express = require('express');
const bodyparser = require('body-parser');
const mysqlConnection = require('./mysqlConnection');
var router = express.Router();

router.use(bodyparser.json());

// GET all rows of projects_skills
router.get('/', (req, res) => {
	mysqlConnection.query('SELECT * FROM projects_skills', (err, rows, fields) => {
		if (!err){
			res.send(rows)
		}else {
			res.send(err)
		}
	});
});

// GET one row of projects_skills
router.get('/:id', (req, res) => {
	mysqlConnection.query('SELECT * FROM projects_skills WHERE id = ' + [req.params.id], (err, rows, fields) => {
		if (!err) {
			res.send(rows)
		}else {
			res.send(err)
		}
	});
});

// INSERT one row of projects_skills
router.post('/', (req, res) => {
	let pro_ski = req.body;
	let sql = 'SET @id =?; SET @project_id = ?; SET @skill_id = ?;\
	CALL ProSkiAddOrEdit(@id, @project_id, @skill_id);';
	mysqlConnection.query(sql,[pro_ski.id, pro_ski.project_id, pro_ski.skill_id], (err, rows, fields) => {
		if (!err){
			rows.forEach(element => {
				if (element.constructor == Array){
					res.send('Inserted successfully id = ' + element[0].id);
				}
			});
		}else {
			res.send(err);
		}
	});
});

// UPDATE one row of projects_skills
router.put('/', (req, res) => {
	let pro_ski = req.body;
	let sql = 'SET @id =?; SET @project_id = ?; SET @skill_id = ?;\
	CALL ProSkiAddOrEdit(@id, @project_id, @skill_id);';
	mysqlConnection.query(sql,[pro_ski.id, pro_ski.project_id, pro_ski.skill_id], (err, rows, fields) => {
		if (!err){
			res.send('Update row successfully');
		}else {
			res.send(err);
		}
	});
});

// DELETE one row of projects_skills
router.delete('/:id',(req, res) => {
	mysqlConnection.query('DELETE FROM projects_skills WHERE id = ' + [req.params.id], (err, rows, fields) => {
		if (!err){
			res.send('Delete successfully');
		}else {
			res.send(err);
		}
	});
});

// PROCEDURE ProSkiAddOrEdit in order to INSERT/EDIT a row in projects_skills
// CREATE DEFINER=`root`@`localhost` PROCEDURE `ProSkiAddOrEdit`(
// 	IN _id INT,
//     IN _project_id INT,
//     IN _skill_id INT
// )
// BEGIN
// 	IF _id = 0 THEN
// 		INSERT INTO projects_skills(project_id, skill_id)
// 		VALUES(_project_id, _skill_id);
// 		SET _id = LAST_INSERT_ID();
	
//     ELSE
// 		UPDATE projects_skills
//         SET
//         project_id = _project_id,
//         skill_id = _skill_id
//         WHERE id = _id;
// 	END IF;
    
//     SELECT _id AS 'id';

// END
//======================================================

// create table "projects_skills" in MySQL
// CREATE TABLE IF NOT EXISTS projects_skills (
// 	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//     project_id INT NOT NULL,
//     skill_id INT NOT NULL,
//     FOREIGN KEY (project_id)
//     REFERENCES projects (project_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT,
//     FOREIGN KEY (skill_id)
//     REFERENCES skills (skill_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT
// );
module.exports = router;