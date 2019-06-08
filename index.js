const express = require('express');
var PORT = process.env.PORT || 3000;
var employeeRoute = require('./routes/employees');
var projectRoute = require('./routes/projects');
var empProjRoute = require('./routes/employees_projects');


var app = express();
app.use('/employees', employeeRoute);
app.use('/projects', projectRoute);
app.use('/employees_projects', empProjRoute);

app.get('/', (req, res) => {
	res.send('hello');
});

app.listen(PORT, () => {
	console.log('listen to the server');
});