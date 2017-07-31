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
      manager INTEGER
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
  createUser({ name: 'HarveyX ', manager: 1}, (err, id) => {
    if(err){
      return cb(err);
    }
    createUser({ name: 'Wallbanger', manager: 0}, (err, id)  => {
      if(err){
        return cb(err);
      }
      createUser({ name: 'Snipes', manager: 0}, (err, id) => {
        if(err){
          return cb(err);
        }
        cb(null);
      });
    });
  });
};


const getUsers = (managersOnly, cb) => {
	let params = [];
	if (managersOnly) params = [1];
	query('select * from users where managers=$1', params, (err, result) => {
		if (err) return cb(err);
		cb(null, result.rows);
	})
};

const getUser = (id, cb) => {
		query('select * from users where id=$1', [id], (err, result) => {
		if (err) return cb(err);
		cb(null, result.rows[0]);
	})
};

const updateUser = (user, cb) => {
	query('update users set manager = !manager', null, (err, result) => {
		if (err) return cb(err);
		cb(null);
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