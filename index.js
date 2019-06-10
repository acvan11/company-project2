const express = require('express');
var PORT = process.env.PORT || 3000;
var employeeRoute = require('./routes/employees');
var projectRoute = require('./routes/projects');
var empProjRoute = require('./routes/employees_projects');
var skillsRoute = require('./routes/skills');
var emp_skillRoute = require('./routes/employees_skills');


var app = express();
app.use('/employees', employeeRoute);
app.use('/projects', projectRoute);
app.use('/employees_projects', empProjRoute);
app.use('/skills', skillsRoute);
app.use('/employees_skills', emp_skillRoute);

app.get('/', (req, res) => {
	res.send('hello');
});

app.listen(PORT, () => {
	console.log('listen to the server');
});