const r = require('rethinkdb');

let connection = null;
r.connect({ host: 'localhost', port: 28015 }, (err,conn) => {
  if (err) throw err;
  connection = conn;
});

module.exports = {
  getConnection: () => connection
};
 