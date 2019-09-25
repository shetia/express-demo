// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
//router/index.js
var express = require('express');
var router = express.Router();
var user = require('../modules/handle');

var multer = require('multer');
// 设置文件缓存的目录
var upload = multer({ dest: './uploadFiles/tmp/'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SQL for MySQL' });
});
router.get('/addUser', function(req, res, next) {
    user.add(req, res, next);
});
router.get('/queryAll', function(req, res, next) { 
    user.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {
    user.queryById(req, res, next);
});
router.get('/queryName', function(req, res, next) {
    user.queryByName(req, res, next);
});
router.get('/deleteUser', function(req, res, next) {
    user.delete(req, res, next);
});
router.get('/update', function(req, res, next) {
    res.render('update');
});
router.post('/updateUser', function(req, res, next) {
    user.update(req, res, next);
});

// 文件上传
router.post('/upload', upload.array('file'),function(req, res, next) {

  // 文件信息
  if (req.files[0]){
      console.log("----------接收文件----------\n"); 
      console.log(req.files[0]);
  }
  let reqData = req.files[0]
  user.upload(reqData, res, next);
});
module.exports = router;