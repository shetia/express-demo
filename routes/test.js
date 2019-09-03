var express = require('express');
var router = express.Router();
const mysql = require('mysql')
let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  port:'3306',
  database:'abc'
})
connection.connect()
let sql = 'SELECT name=? FROM userlist'
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.url.query)
  connection.query(sql,['张翠花'],function(err,result){
    if(err){
      console.log('[SELECT ERROR] - ', err.message)
      return
    }
    res.send({
      status:'0000',
      data:result,
      msg:'success'
    }); 
  })
  

  
});

module.exports = router;