const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.connect((err) => {
	if (err) console.log(err);
});

const query = (sql, params, cb) => client.query(sql, params, cb);

const sync = (cb) => {
	  var sql = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE,
      manager BOOLEAN
    );
  `;
  query(sql, null, (err) => {
  	if (err) return cb(err);
  	console.log('table synced')
  	cb(null);
  });
};

const createUser = (user, cb) => {
	query('insert into users (name, manager) values ($1, $2)', [user.name, user.manager], (err, result) => {
		if (err) return cb(err);
		cb(null);
	});
};

const seed = (cb) => {
  createUser({ name: 'HarveyX ', manager: true}, (err, id) => {
    if(err){
      return cb(err);
    }
    createUser({ name: 'Wallbanger', manager: false}, (err, id)  => {
      if(err){
        return cb(err);
      }
      createUser({ name: 'Snipes', manager: false}, (err, id) => {
        if(err){
          return cb(err);
        }
        cb(null);
      });
    });
  });
};

const getUsers = (cb) => {
	query('select * from users', null, (err, result) => {
		if (err) return cb(err);
		const managers = result.rows.filter((row) => row.manager);
		const users = result.rows.filter((row) => !row.manager);
		cb(null, users, managers);
	})
};

const getUser = (id, cb) => {
		query('select * from users where id=$1', [id], (err, result) => {
		if (err) return cb(err);
		cb(null, result.rows[0]);
	})
};

const updateUser = (id, cb) => {
	query('update users set manager = not manager where id=$1 returning * ', [id], (err, result) => {
		if (err) return cb(err);
		cb(null, result.rows[0]);
	});
};

const deleteUser = (id, cb) => {
	query('delete from user where id=$1', [id], (err, result) => {
		if (err) return cb(err);
		cb(null);
	})
};

module.exports = {
	sync,
	seed,
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
}; 