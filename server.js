const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const path = require('path');
const swig = require('swig');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
swig.setDefaults({cache: false});


app.set('view engine', "html");
app.engine('html', swig.renderFile);

app.set('views', path.join(__dirname, '/views'));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

db.sync((err) => {
	if (err) return console.log(err.message);
	db.seed( () => {
		if (err) {
			return console.log(err.message);
		}
		console.log('Synced and seeded, baby!');
	} );
});

app.listen(port, () => console.log(`Listening intently on port ${port}`));

