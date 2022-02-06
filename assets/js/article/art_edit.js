$(function(){
    // 定义所需的变量
    const layer = layui.layer;
    const form = layui.form;

    // 获取并初始化文章分类
    initCate()
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类失败！')
                }
                // 调用模板引擎渲染分类选项
                var htmlStr = template('tpl-cate', res);
                // console.log(cateIdStr);
                $('[name=cate_id]').html(htmlStr);
                // 由于layui.js在模板引擎引入的前面
                // 所以当layui.js渲染的时候 所有分类的下拉选项还不存在
                // 那么需要用form.render重新渲染一遍
                form.render();
            }
        })
    }

    //调用 tinymce自带的初始化编辑器方法 initEditor() 建立富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
  
     // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options)
    
    // 监听选择封面按钮的click事件
    $('#btnChooseCover').on('click', function(){
        // 让隐藏的封面文件选择按钮 自触发
        $('#filecover').click();
    })

    // 监听 文件选择 的 change 事件 
    $('#filecover').on('change', function(e){
        // 获取用户选择文件的个数 
        var fileList = e.target.files;
        if(fileList.length === 0){
            return layer.msg('请选择文件')
        }
        // 若用户已选择文件 就要 拿到用户的文件
        var file = fileList[0];

        // 根据选择的文件 生成对应的URL
        var newImgURL = URL.createObjectURL(file);

        // 先 销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域
        $image.cropper('destroy') // 销毁旧的裁剪区域
              .attr('src', newImgURL) // 重新设置图片路径
              .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';

    // 当点击存为草稿的按钮时 把 art_state 转为 '草稿'
    $('#btnDraft').on('click', function(e){
        art_state = '草稿'
    })

    // 监听表单的submit提交事件
    $('#form-edit').on('submit', function(e){
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 快速定义一个FormData实例对象
        var fd = new FormData($(this)[0])
        // 3. 通过append方法为fd对象添加一个新的 state状态属性
        fd.append('state', art_state);
        // 4. 将裁剪过后的图片裁剪成文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
          // 5.得到文件对象后，将该文件对象存储到 fd对象中
          fd.append('cover_img', blob)
          pubulishArticle(fd);        
        })
        // 6.调用发布文章的 pubulishArticle方法
        /* fd.forEach(function(v, k){
            console.log(k, v);
        }); */
    })

    // 定义一个发表文章的方法 pubulishArticle
    function pubulishArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意如你提交的的数据是FormData格式的
            // 需要再额外添加下面两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后跳转到art_list页面
                location.href = '/article/art_list.html'
            }
        })
    }
    
    // 初始化文章编辑页面
    initArtEdit()
    function initArtEdit(){
        // 获取该文章的id
        var id = localStorage.getItem('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章失败')
                }
                renderArtEdit(res.data)
                console.log(res);
            }
        })
    }

    // 渲染文章编辑页面的数据
    function renderArtEdit(data){
        $('[name=title]').val(data.title);
        $('[name=cate-id]').val(data.cate_id);
        form.render();
    }
})