//sql.js
// SQL语句封裝
var user = {
  insert:'INSERT INTO userlist(id, name, age) VALUES(?,?,?)',
  update:'UPDATE userlist SET name=?, age=? WHERE id=?',
  delete: 'DELETE FROM userlist WHERE id=?',
  queryById: 'SELECT * FROM userlist WHERE id=?',
  queryByName: `SELECT * FROM userlist WHERE name LIKE CONCAT('%',?,'%')`,
  queryAll: 'SELECT * FROM userlist'
};
module.exports = user;