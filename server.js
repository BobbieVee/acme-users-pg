const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const path = require('path');
const swig = require('swig');
const bodyParser = require('body-parser');
swig.setDefaults({cache: false});


app.set('view engine', "html");
app.engine('html', swig.renderFile);

app.set('views', path.join(__dirname, '/views'));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: true}));







	// sync,
	// seed,
	// getUsers,
	// getUser,
	// createUser,
	// updateUser,
	// deleletUser

app.get('/', (req, res, next) => {
	res.render('index');
});

app.get('/managers', (req, res, next) => {
	res.render('managers');
});

app.get('/users', (req, res, next) => {
	res.render('users');
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

