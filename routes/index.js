
const app = require('express').Router();
const db = require('../db')

module.exports = app;

app.get('/', (req, res, next) => {
	db.getUsers((err, users, managers) => {
		if (err) return console.log(err.message);
		res.render('index',{homeTab: 'active', users: users, managers: managers});
	});
});

app.get('/managers', (req, res, next) => {
	db.getUsers((err, users, managers) => {
		if (err) return console.log(err.message);
	res.render('managers', {users: users, managers: managers, managerTab: 'active'});
	});
});

app.get('/users', (req, res, next) => {
	db.getUsers((err, users, managers) => {
		if (err) return console.log(err.message);
	res.render('users', {users: users, managers: managers, userTab: 'active'});
	});
});

app.post('/users', (req, res, next) => {
	const manager = req.body.isManager === 'on';
	db.createUser({name: req.body.name, manager: manager }, (err) => {
		if(err) return console.log(err.message);
		if (manager) {
			res.redirect('/managers');
		} else {
			res.redirect('/users');		
		}
	});
});

app.put('/users/:id', (req, res, next) => {
	db.updateUser(req.params.id, (err, result) => {
		if (err) return console.log(err.message);
		if (result.manager === true) {
			res.redirect('/managers');
		} else {
		 res.redirect('/users');
		}
	});	
});

app.delete('/users/:id', (req, res, next) => {
	db.deleteUser(req.params.id, (err, result) => {
		if (err) return console.log(err.message);
	  res.redirect('/users');
	});	
});