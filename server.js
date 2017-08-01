const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const path = require('path');
const swig = require('swig');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes');
swig.setDefaults({cache: false});


app.set('view engine', "html");
app.engine('html', swig.renderFile);

app.set('views', path.join(__dirname, '/views'));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use('/', routes);

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

