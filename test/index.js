 

  
    function queryDom(name){
      return document.querySelector(name)
    }
    let dialogBox = queryDom('.dialog-box')
    let confirmModal = queryDom('#confirmModal')
    let confirmMsg = queryDom('#confirmMsg')
    let confirmCancel = queryDom('#confirmCancel')
    let confirmOK = queryDom('#confirmOK')
    let searchBtn = queryDom('#searchBtn')
    let resetBtn = queryDom('#resetBtn')
    let searchValue = queryDom('#searchValue')
    let box = queryDom('#box')
    let nameValue = queryDom('#nameValue')
    let ageValue = queryDom('#ageValue')
    let addBtn = queryDom('#addBtn')
    let confirmBtn = queryDom('#confirmBtn')
    let cancelBtn = queryDom('#cancelBtn')
    let modal = queryDom('#modal')
    let tipsBox = queryDom('#tips')
    let delBtn = queryDom('.addBtn')
    /* 上传图片 */
    let fileBtn = document.getElementById('fileBtn')
    let fileAdd = document.getElementById('fileAdd')
    let imgBox = document.getElementById('imgBox')
    // 约定一个变量控制是新增还是编辑
    let flag = 'add'
    let gobj = {}  // 用来临时存储编辑数据
    var imgObj = {}
    // 页面加载的时候查询一次列表
    window.onload = function () {
      getList()
    }
    /* ------------------点击事件部分---------------------------- */
    searchBtn.onclick = function () {
      getListByName(searchValue.value)
    }
    // 重置
    resetBtn.onclick = function () {
      searchValue.value = ''
      getList()
    }
    // 编辑和删除
    box.onclick = function (e) { 
      if (e.target.className.indexOf('updateBtn')>-1) {
        modal.style.display = 'block' 
        modal.style.opacity = 1
        dialogBox.style.left = '50%'
        flag = 'edit'
        let obj = JSON.parse(e.target.getAttribute('data-item'))
        gobj = obj
        imgObj = {
          id:obj.fileId,
          path:obj.fileUrl, 
        }
        imgBox.innerHTML = `<img src="${imgObj.path}" width="50px" style="margin-right:10px;">`
        detail(obj)
      } else if (e.target.className.indexOf('delBtn')>-1) {
        let id = e.target.getAttribute('data-id')

        confirmBox('此操作会删除该行数据，是否确定？').then(function(){
          del(id)
        }).catch(function(){
          console.log('取消删除')
        })
      }
    }

    function detail(item) {
      nameValue.value = item.name
      ageValue.value = item.age
    }

    // 新增
    addBtn.onclick = function () {
      modal.style.display = 'block'
      modal.style.opacity = 1
      dialogBox.style.left = '50%'
      flag = 'add'
      nameValue.value = ''
      ageValue.value = ''
      imgObj = {}
      imgBox.innerHTML = ''
    }
   
    // 文件上传
    fileBtn.onchange = function(e){
      let file = e.target.files[0]
      fileUpload(file,function(res){ 
        imgBox.innerHTML = `<img src="${res.data.path}" width="50px" style="margin-right:10px;">`
        imgObj = res.data
      })
    }
    // 点击上传图片
    fileAdd.onclick = function(){ 
      fileBtn.click()
    }


    // 取消
    cancelBtn.onclick = function () {
      setTimeout(function() {
        modal.style.display = 'none'
      }, 1000);
      modal.style.opacity = 0
      dialogBox.style.left = '-300px'
    }
    // 确定
    confirmBtn.onclick = function () { 
      // 校验不能为空
      if(!ageValue.value||!nameValue.value||!imgObj.id){
        tips.error('不能为空')
        return
      }
      // 校验年龄是否为数字
      if(!/^\d*$/g.test(ageValue.value)){
        tips.error('年龄请输入数字')
        return
      }
      setTimeout(function() {
        modal.style.display = 'none'
      }, 1000);
      modal.style.opacity = 0
      dialogBox.style.left = '-300px'
      if (flag === 'add') {
        add()
      } else if (flag === 'edit') {
        update(gobj.id)
      }
    }
    /* ------------------点击事件部分---------------------------- */

    

    /* ------------------请求部分 开始--------------------------------- */
    //  删除数据
    function del(id) {
      _ajax({
        url: 'http://localhost:3000/deleteUser',
        data: {
          id: id,
        },
        success: function (res) {
          if (res.code === '200') {
            tips.success(res.msg)
            getList()
          } else {
            tips.error(res.msg)
          }
        },
        error: function (e) {
          console.log(e, 'error')
        }
      })
    }
    // 获取全部数据
    function getList() { 
      _ajax({
        url: 'http://localhost:3000/queryAll',
        success: function (res) {
          let resData = res.data || []
          if (resData) { 
              renderTable(resData) 
          }

        },
        error: function (e) {
          console.log(e, 'error')
        }
      })
    }
    // 根据name查询数据
    function getListByName(name) { 
      _ajax({
        url: 'http://localhost:3000/queryName',
        data: {
          name: name
        },
        success: function (res) {
          let resData = res.data || []
          if (resData) {
            renderTable(resData)
          } 
        },
        error: function (e) {
          console.log(e, 'error')
        }
      })
    }
    // 新增数据
    function add() {
      _ajax({
        url: 'http://localhost:3000/addUser',
        data: {
          name: nameValue.value,
          age: ageValue.value,
          fileId:imgObj.id,
          fileUrl:imgObj.path, 
        },
        success: function (res) {
          if (res.code === '200') {
            tips.success(res.msg)
            getList()
          } else {
            tips.error(res.msg)
          }
        },
        error: function (e) {
          console.log(e, 'error')
        }
      })
    }
    // 更新数据
    function update(id) {
      _ajax({
        url: 'http://localhost:3000/updateUser',
        method: 'POST',
        data: {
          id: id,
          name: nameValue.value,
          age: ageValue.value,
          fileId:imgObj.id,
          fileUrl:imgObj.path, 
        },
        success: function (res) {
          if (res.code === '200') {
            tips.success(res.msg)
            getList()
          } else {
            tips.error(res.msg)
          }
        },
        error: function (e) {
          console.log(e, 'error')
        }
      })
    }
    /* ------------------请求部分结束------------------------------------- */

    // 封装渲染表格函数
    function renderTable(list){
      // 清空之前的表格
      box.innerHTML = ''
      // 添加个头部
      let headerTrNode = document.createElement('tr')
      headerTrNode.innerHTML = `
        <th>序号</th>
        <th>id</th>
        <th>名字</th>
        <th>年龄</th>
        <th>照片</th>
        <th>操作</th>
      `
      box.appendChild(headerTrNode) 
      // 根据数据渲染表格体
      list.forEach((item,index)=>{
        let trNode = document.createElement('tr')
        trNode.innerHTML = `
          <td>${index+1}</td> 
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.age}</td>
          <td>
            <img src="${item.fileUrl}" width="50px"> 
          </td>
          <td  >
            <button class="updateBtn primary"  data-item='${JSON.stringify(item)}'>编辑</button>&nbsp;
            <button class="delBtn danger" data-id="${item.id}">删除</button>
          </td>`
        box.appendChild(trNode)
      })
    }
    // 封装请求函数
    function _ajax(option) {
      let url = option.url || ''
      let method = option.method ? option.method.toUpperCase() : 'GET'
      let data = option.data || null

      // 把请求参数变成表单格式
      var formData = []
      for (var key in data) {
        formData.push(''.concat(key, '=', data[key]))
      }
      data = formData.join('&')
      if (method === 'GET') {
        url += location.search.length === 0 ? ''.concat('?', data) : ''.concat('&', data)
      }
      let xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      // 设置响应参数为传入的格式或者默认json格式
      xhr.responseType = option.responseType || 'json'
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            option.success(xhr.response)
          } else {
            option.error()
          }
        }
      }

      if (method === 'POST') {
        //设置发送数据的请求格式为表单格式
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        // 设置发送数据的请求格式为json格式
        xhr.setRequestHeader('content-type', 'application/json');
      }
      xhr.send(method === 'POST' ? JSON.stringify(option.data) : null)
    }
    // 文件上传
    function fileUpload(file,callback){
      let url = "http://localhost:3000/upload";
      let form = new FormData(); // FormData 对象
      form.append("file", file); // 文件对象  这里名字要和后端接收名字一样upload.array('file')
      let xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
      xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            let resData = JSON.parse(xhr.responseText)
            callback(resData)
          }else{
            console.log('上传失败')
          }
        } 
      }
      xhr.send(form); //开始上传，发送form数据
    }


/* ----------------工具函数部分-------------- */
    // 封装个提示函数
    function Tips() {
      
      var loop
      this.error = function (str, delay) {
        if(loop){
          clearTimeout(loop)
        }
        tipsBox.style.display = 'block'
        tipsBox.style.background = '#ff6666'
        tipsBox.innerHTML = str
        loop = setTimeout(() => {
          tipsBox.style.display = 'none'
        }, delay || 3000)
      }
      this.success = function (str, delay) {
        if(loop){
          clearTimeout(loop)
        }
        tipsBox.style.display = 'block'
        tipsBox.style.background = '#78d626'
        tipsBox.innerHTML = str
      loop = setTimeout(() => {
          tipsBox.style.display = 'none'
        }, delay || 3000)
      }

    }
    let tips = new Tips()
    // 封装个二次确认弹框
    function confirmBox(msg){
      msg = msg || '确定删除？'
      confirmMsg.innerHTML = msg
      confirmModal.style.display = 'block'
      return new Promise(function (resolve,reject) {
        confirmOK.onclick = function(){ 
          confirmModal.style.display = 'none' 
          resolve()
        }
        confirmCancel.onclick = function(){ 
          confirmModal.style.display = 'none'
          reject()
        }
      });
      
    }
    /* ----------------工具函数部分-------------- */