const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');



	// sync,
	// seed,
	// getUsers,
	// getUser,
	// createUser,
	// updateUser,
	// deleletUser

app.use('/', (req, res, next) => {
	res.send('hello world!')
})

db.sync((err) => {
	if (err) return console.log(err.message);
	db.seed( () => {
		if (err) {
			return console.log(err.message);
		}
		console.log('Synced and seeded, baby!');
	} )
})

app.listen(port, () => console.log(`Listening intently on port ${port}`));

