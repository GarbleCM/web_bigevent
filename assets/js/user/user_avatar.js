$(function(){
    const layer = layui.layer;

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  $('#btnChooseImage').on('click', function(e){
        $('#file').click();
  })
  
  /* 为文件选择框绑定一个change事件 */
  $('#file').on('change', function(e){
        var fileList = e.target.files;
        if(fileList.length === 0){
            return layer.msg('请选择图片文件')
        }
        var file = fileList[0];
        // 根据选择的文件对应的生成该文件的URL
        var newImageURL = URL.createObjectURL(file)
        // 重新初始化剪裁区域
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImageURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
  })
  /* 将裁剪后的头像上传到服务器 */
  $('#btnUploadAvatar').on('click', function(e){
    // 1. 得到裁剪后的头像
    var dataURL = $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 2.发起post请求把新头像上传到服务器
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL,
        },
        success: function(res){
            if(res.status !== 0){
                return layer.msg('更新头像失败！')
            }
            window.parent.getUserInfo();
            layer.msg('更新头像成功！');
            
        }
    })
  })
})