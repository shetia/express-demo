//sql.js
// SQL语句封裝
var user = {
  insert:'INSERT INTO userlist(id, name, age,fileId,fileUrl) VALUES(?,?,?,?,?)',
  update:'UPDATE userlist SET name=?, age=?,fileId=?,fileUrl=? WHERE id=?',
  delete: 'DELETE FROM userlist WHERE id=?',
  queryById: 'SELECT * FROM userlist WHERE id=?',
  queryByName: `SELECT * FROM userlist WHERE name LIKE CONCAT('%',?,'%')`,
  queryAll: 'SELECT * FROM userlist',
  upload:'INSERT INTO uploadfiles(fieldname, originalName, tmpName, encoding, mimetype, size, path, tmpPath, addTime) VALUES(?,?,?,?,?,?,?,?,?)'
};
module.exports = user;