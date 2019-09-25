
var handlerType = ''    //约定一个变量，用来区分新增还是编辑
var itemObj = {} //声明一个变量用来存储每点击编辑时的数据
var imgObj = {} // 声明一个变量用来存储图片信息
// 新增
$('#addBtn').on('click',function(){
  handlerType = 'add'  // 点击新增按钮时，把它赋值为add 方便点击弹框确定按钮时判断
  $('#nameValue').val('')  //设置name的值为空
  $('#ageValue').val('') //设置age的值为空
  $('#modal').show()  //弹出新增窗口
  $('#imgBox').html(``)
  imgObj = {}
})
// 文件上传
// 点击上传图片 
$('#fileAdd').on('click',function(e){
  $('#fileBtn').click()
})
$('#fileBtn').on('change',function(e){
  let file = e.target.files[0]
  fileUpload(file,function(res){ 
    $('#imgBox').html(`<img src="${res.data.path}" width="50px" style="margin-right:10px;">`)
    imgObj = res.data
  })
}) 

// 弹框确认按钮
$('#confirmBtn').on('click',function(){
  // 校验是否为空
  if(!$('#ageValue').val()||!$('#nameValue').val()){
    toast.error('不能为空')
    return
  }
  // 校验是否输入正确  使用正则表达式校验
  var reg = /^\d*$/g
  if(!reg.test($('#ageValue').val())){
    toast.error('请输入正确年龄')
    return
  }

  if(handlerType==='add'){
    // 点击确定调用新增接口函数
    add()
  }else if(handlerType==='edit'){
    // 点击确定调用编辑接口函数  同时传入id
    edit(itemObj.id)
  } 
})

// 弹框取消按钮
$('#cancelBtn').on('click',function(){
  $('#modal').hide()  //关闭新增窗口
})


// 点击删除和编辑按钮   因为列表是动态生成的 无法具体绑定哪个按钮  所以这里使用事件委托的方式
// 点击它的父元素 来操作
// 因为是通过点击父元素，所以点击父元素任何地方都会触发这个方法，所以要准确知道点击的是哪个按钮
// 这里使用类名判断所点击的是否是删除 或者 编辑

$('#tableList').on('click',function(e){
  var target = e.target
  // 此处类名已在html处定好
  if(target.className.indexOf('delBtn')>-1){ 
    //id已在html 绑定到自定义属性data-id上，此处通过获取属性方法getAttribute 来获取 
    var id = target.getAttribute('data-id')  
    confirmBox('此操作将删除此条数据，是否确定').then(function(){
      del(id)
    }).catch(function(){console.log('取消删除')})
    
  }else if(target.className.indexOf('updateBtn')>-1){
    // 把json字符串转成json对象
    var item =JSON.parse(target.getAttribute('data-item')) 
    //把拿到的数据赋值给全局变量itemObj，这样全局就可以通过itemObj拿得到这个数据
    itemObj = item  
    imgObj = {
      id:item.fileId,
      path:item.fileUrl, 
    }
    $('#imgBox').html(`<img src="${item.fileUrl}" width="50px" style="margin-right:10px;">`)
    // 把它赋值成edit  方便点击弹框确定按钮时判断 
    handlerType = 'edit'   
    // 编辑时要把数据带回到输入框中
    $('#nameValue').val(item.name)  //设置name的值
    $('#ageValue').val(item.age) //设置age的值
    // 弹出框
    $('#modal').show()  
  }
})

// 重置
$('#resetBtn').on('click',function(){ 
  $('#searchValue').val('')
  getAllList()
})
// 查询
$('#searchBtn').on('click',function(){  
  getListByName()
})




 
/* 接口 */
var urlObj = {
  add:'http://localhost:3000/addUser',       //新增一条数据  必传name age
  del:'http://localhost:3000/deleteUser',   //根据id删除一条数据 必传 id    
  update:'http://localhost:3000/updateUser', //根据id修改对应数据  必传id name age
  queryAll:'http://localhost:3000/queryAll',  // 查 
  queryName:'http://localhost:3000/queryName', // 根据name查询列表 必传 name
}
// 页面一开始就请求一次列表拿到数据
getAllList()
/* 获取列表全部内容 */
function getAllList(){
  $.ajax({
    type:'GET',
    url:urlObj.queryAll,
    data:{},
    dataType:'json',
    success:function(result){ 
      result = result || []
      if(result.code === '200'){
        var htmlContent = template('userList',result)
        $('#tableList').html(htmlContent) 
      }
      // 当返回错误或者为空时，
      if(!result.data){ 
        var htmlContent = template('userList',null)
        $('#tableList').html(htmlContent) 
      }
    },
    error:function(e){
      if(e){ 
        var htmlContent = template('userList',[])
        $('#tableList').html(htmlContent) 
      }
    }
  })
} 
/* 根据输入名字获取列表 */
function getListByName(){
  $.ajax({
    type:'GET',
    url:urlObj.queryName,
    data:{
      name:$('#searchValue').val()
    },
    dataType:'json',
    success:function(result){ 
      if(result.code === '200'){
        var htmlContent = template('userList',result)
        $('#tableList').html(htmlContent)
      } 
      // 当返回错误或者为空时，
      if(!result.data){ 
        var htmlContent = template('userList',null)
        $('#tableList').html(htmlContent) 
      }
    }
  })
}
/* 新增 */
function add(){ 
  $.ajax({
    type:'GET',
    url:urlObj.add,
    data:{
      name:$('#nameValue').val(),  //获取name的值
      age:$('#ageValue').val(),  //获取age的值
      fileId:imgObj.id,
      fileUrl:imgObj.path, 
    },
    dataType:'json',
    success:function(result){ 
      if(result.code === '200'){
        // 新增成功后刷新一次列表
        getAllList()
        // 关闭弹框
        $('#modal').hide()
        toast.success(result.msg) 
      }else{
        toast.error(result.msg)
      }
    }
  })
}
/* 删除 */
function del(id){ 
  $.ajax({
    type:'GET',
    url:urlObj.del,
    data:{
      id:id,
    },
    dataType:'json',
    success:function(result){ 
      if(result.code === '200'){
        // 删除成功后刷新一次列表
        getAllList() 
        toast.success(result.msg)
      }else{
        toast.error(result.msg)
      }
    }
  })
}
/* 编辑 */
function edit(id){ 
  $.ajax({
    type:'POST',    //编辑用的是post请求，
    url:urlObj.update,
    data:{
      id:id,
      name:$('#nameValue').val(),  //获取name的值
      age:$('#ageValue').val(),  //获取age的值
      fileId:imgObj.id,
      fileUrl:imgObj.path, 
    },
    dataType:'json',
    success:function(result){ 
      if(result.code === '200'){
        // 删除成功后刷新一次列表
        getAllList() 
        // 关闭弹框
        $('#modal').hide()
        toast.success(result.msg)
      }else{
        toast.error(result.msg)
      }
    }
  })
}

// 文件上传
function fileUpload(file,callback){
  let url = "http://localhost:3000/upload";
  let form = new FormData(); // FormData 对象
  form.append("file", file); // 文件对象  这里名字要和后端接收名字一样upload.array('file')
  $.ajax({
    type:'POST',    //编辑用的是post请求，
    url:url,
    data: form,
    //让数据不被处理
    processData:false,
    contentType:false,
    dataType:'json',
    success:function(result){  
      if(result.status === 200){
        callback(result)
      }else{
        toast.error(result.message)
      }
    }
  })
}


  /* 工具函数 */
// 提示
function Toast(){
  // 创建一个元素
  var tips = document.createElement('div') 
  tips.setAttribute('id','tips')
  // 把它放到body上面
  $('body').append(tips) 
  // 提供两个属性
  this.success =  fn('success')
  this.error =  fn('error')  
  function fn(type){
    // 此处相当于  声明一个对象 然后通过键来取值 例如 object['success']
    var color = {
      success:'#43c9b2',
      error:'#f5493b',
    }[type]
    var loop
    // 返回一个函数
    return function(msg,delay){
      if(loop){clearTimeout(loop)}
      $('#tips').show()
      $('#tips').css({
        background:color, 
      })
      $('#tips').html(msg)
      loop = setTimeout(function(){
        $('#tips').hide()
      },delay||3000)
    }
  }  
}
// 实例化
var toast = new Toast()

 // 封装个二次确认弹框
 function confirmBox(msg){ 
  // 创建一个元素
  var messageBox = document.createElement('div') 
  messageBox.setAttribute('id','confirmModal')
  messageBox.innerHTML = `
        <div class="confirm-box">
          <h3 class="title">提示</h3>
          <div id="confirmMsg">${msg||'确定删除么？'}</div>
          <div class="dialog-box__footer">
            <button id="confirmCancel">取消</button>
            <button id="confirmOK" class="primary">确定</button>
          </div>
        </div> 
      `
  // 把它放到body上面
  $('body').append(messageBox)
  $('#confirmModal').show()
  // 返回一个promise对象，此为es6后才有，调用的时候就可以通过.then()执行点击确定后要执行的.catch()执行取消后执行的
  return new Promise(function (resolve,reject) {
    $('#confirmOK').on('click',function(){
      $('#confirmModal').hide()
      resolve()
    }) 
    $('#confirmCancel').on('click',function(){ 
      $('#confirmModal').hide()
      reject() 
    })
  })
}