/*
 * @Descripttion:
 * @version:
 * @Author: shetia
 * @Date: 2019-09-03 20:47:32
 * @LastEditors: somebody
 * @LastEditTime: 2020-07-27 21:57:31
 */
/*
    数据增删改查模块封装
    req.query 解析GET请求中的参数 包含在路由中每个查询字符串参数属性的对象，如果没有则为{}
    req.params 包含映射到指定的路线“参数”属性的对象,如果有route/user/：name，那么“name”属性可作为req.params.name
    req.body通常用来解析POST请求中的数据
     +req.query.id 可以将id转为整数
 */
// 引入mysql
var mysql = require('mysql');
// 引入mysql连接配置
var mysqlconfig = require('../config/mysql');
// 引入连接池配置
var poolextend = require('./poolextend');
// 引入SQL模块
var sql = require('./sql');
// 引入json模块
var json = require('./json');
var fs = require('fs');
var globalObj = require('../config')
// 使用连接池，提升性能
var pool = mysql.createPool(poolextend({}, mysqlconfig));
// 大文件上传
const fse = require('fs-extra')
const Multiparty = require('multiparty')
const path = require('path')
const UPLOAD_DIR = path.resolve(__dirname, '..', 'uploadFiles/big')
let fileDir = path.resolve(__dirname, '..', 'uploadFiles/file')
// 没有这个路径就新建一个
if(!fse.existsSync(fileDir)){
  fse.mkdirs(fileDir)
}
var userData = {
    add: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.query || req.params;
            connection.query(sql.insert, [param.id, param.name, param.age,param.fileId,param.fileUrl], function (err, result) {
                if (result) {
                    result = 'add'
                }
                // 以json形式，把操作结果返回给前台页面
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var id = +req.query.id;
            connection.query(sql.delete, id, function (err, result) {
                if (result.affectedRows > 0) {
                    result = 'delete';
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        var param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            json(res, undefined);
            return;
        }
        pool.getConnection(function (err, connection) {
            connection.query(sql.update, [param.name, param.age,param.fileId,param.fileUrl, +param.id], function (err, result) {
                if (result.affectedRows > 0) {
                    result = 'update'
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    queryById: function (req, res, next) {
        var id = +req.query.id;
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryById, id, function (err, result) {
                if (result != '') {
                    var _result = result && result[0] || {}
                    result = {
                        result: 'select',
                        data: _result
                    }
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    queryByName: function (req, res, next) {
        var name = req.query.name;
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryByName, name, function (err, result) {
                if (result != '') {
                    var _result = result;
                    result = {
                        result: 'select',
                        data: _result
                    }
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryAll, function (err, result) {
                if (result != '') {
                    var _result = result;
                    result = {
                        result: 'selectall',
                        data: _result
                    }
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    async upload(req, res, next) {
      var des_file =  "uploadFiles/file/" + req.originalname;
      fs.readFile(req.path, function (error, data) {
        if (error) {
            return console.error(error);
        }
        fs.writeFile(des_file, data, function (err) {
          if (err) {
              // 接收失败
              console.log("----------接收失败----------\n");
              console.log(err);
              res.json( err )
          }else {
            // 接收成功
            // 删除缓存文件
            fs.unlink(req.path, function(err){
                if (err){
                  console.log('文件:'+req.path+'删除失败！');
                    return console.error(err);
                }
            })
            // 将文件信息写入数据库
            var time = new Date();
            // 前端传过来的参数
            var addSqlParams = [
              req.fieldname,
              req.originalname,
              req.filename,
              req.encoding,
              req.mimetype,
              req.size,
              des_file,
              __dirname + '/' + req.path,
              time
            ]
            // 插入数据
            pool.getConnection(function (err, connection) {
              connection.query(sql.upload, addSqlParams, function (err, result) {
                  if (err) {
                        res.json( err )
                      return console.error(err);
                  }else {
                      var response = {
                        status:200,
                        message: '上传成功!',
                        data:{
                          id:result.insertId,
                          path: `/${req.fieldname}/${req.originalname}`,
                          fileName:req.originalname,
                          time:time,
                          type:req.mimetype,
                          size:req.size,
                        }
                      };
                      res.json( response );
                      connection.release();
                  }
              })
            })
          }
        })
      })

    },
    async chunk (req, res, next) {
      const multiparty = new Multiparty.Form()
      multiparty.parse(req, async (err, fields, files) => {
        if(err) {
          res.end('出错了! error', err)
          return
        }
        console.log('------------接收切片-------------------')
        let [ chunk ] = files.chunk
        let [ hash ] = fields.hash
        let [ filename ] = fields.filename
        let [ fileHash ] = fields.fileHash
        // 7.6 文件存在直接返回
        let ext = extractExt(filename) 
        let filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`)
        let chunkDir = path.resolve(UPLOAD_DIR, fileHash)
        if(fse.existsSync(filePath)){
          res.end(JSON.stringify({
            status: 200,
            msg: '文件已存在'
          }))
          return
        }
        // 不存在目录就创建
        if(!fse.existsSync(chunkDir)){
          await fse.mkdirs(chunkDir)
        }
        console.log('--------------缓存切片------------------')
        await fse.move(chunk.path, path.resolve(chunkDir, hash))
        res.end(JSON.stringify({
          status: 200,
          msg: '接收切片成功'
        }))
      })
    },
    async merge (req, res, next) {
      let data = req.body
      let {fileHash, filename, size} = data
      console.log(data)
      let ext = extractExt(filename)  // 7.5使用hash名
      let url = `${fileHash}${ext}`
      let filePath = path.resolve(UPLOAD_DIR, url)
      await mergeChunks(filePath, fileHash, size)
      res.end(JSON.stringify({
        status: 200,
        msg: '合并成功',
        filePath: '/fileBig/' + url
      }))
    },
    async verify (req, res, next) {
      let params = req.body
      let {filename, fileHash} = params
      let ext = extractExt(filename)
      let url = `${fileHash}${ext}`
      let filePath = path.resolve(UPLOAD_DIR, url)
      if(fse.existsSync(filePath)){
        res.end(JSON.stringify({
          status: 200,
          msg: '文件已存在, 无需再上传',
          shouldUpload: false,
          filePath: '/fileBig/' + url
        }))
      } else {
        res.end(JSON.stringify({
          status: 200,
          msg: '文件不存在, 请继续上传',
          shouldUpload: true,
          uploadedList: await createUploadedList(fileHash)
        }))
      }
    },
    async clearBigDir (req, res, next) {
      let files = await fse.readdir(UPLOAD_DIR)
      try {
        await files.forEach(filePath => {
          let url = path.resolve(UPLOAD_DIR, filePath)
          fse.unlinkSync(url)
        })
        res.end(JSON.stringify({
          status: 200,
          msg: '清空大文件夹成功'
        }))
      } catch (e) {
        res.end(JSON.stringify({
          status: 500,
          msg: e
        }))
      }
    },
    async getLocationBigFiles (req, res, next) {
      try {
        let files = await fse.readdir(UPLOAD_DIR)
        files = files.map(file => {
          return {
            name: file,
            fileUrl: '/fileBig/' + file
          }
        })
        res.end(JSON.stringify({
          status: 200,
          msg: '获取大文件夹内容成功',
          files,
        }))
      } catch (e) {
        res.end(JSON.stringify({
          status: 500,
          msg: e
        }))
      }
    }
};


/*
 合并文件工具函数
*/

function pipeStream (path, writeStream){
  return new Promise(resolve => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  })
}
async function mergeChunks(filePath, fileHash, size){
  const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
  const chunkPaths = await fse.readdir(chunkDir);
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序可能会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建可写流
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size
        })
      )
    )
  );
  fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
}
// 提取后缀名
function extractExt (filename) {
  return filename.slice(filename.lastIndexOf("."), filename.length); 
}
// 获取切片列表 返回已经上传的切片名 如果存在该文件夹, 就返回文件夹内的切片列表, 否则空
async function createUploadedList(fileHash){
  let filePath = path.resolve(UPLOAD_DIR, fileHash)
  return fse.existsSync(filePath) ? await fse.readdir(filePath) : []
}
module.exports = userData;