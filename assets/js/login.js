$(function(){
    // 注意
    // 1.点的是a链接 显示隐藏的是盒子 a链接在在盒子里面
    // 2.所以在绑定事件 和 显示隐藏 要搞清楚对象
    $('#link_reg').on('click', function(){
        $('.login').hide();
        $('.reg').show();
    })
    $('#link_login').on('click', function(){
        $('.reg').hide();
        $('.login').show();
    })

    /* 自定义校验规则 */
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'],

        repwd: function(value){
            var pwd = $('.reg [name = password]').val();
            if(pwd !== value){
                return '两次密码不一致'
            }
        }

    });

    /* 实例化 layer */
    const layer = layui.layer;


    /* 监听注册form表单绑定提交事件 */
    var reg_data = {username: $('#form_reg [name=username]').val(), password:$('#form_reg [name = password]' ).val()}
    $('#form_reg').on('submit', function(e){
        // 1. 阻止表单默认提交行为
        e.preventDefault();
        $.post('/api/reguser', reg_data, 
        function(res){
            if(res.status !== 0){
                console.log(res.message);
                return layer.msg(res.message);              
            }
            layer.msg(res.message, {time: 800 },function(){
                // 自触发 去登录按钮 事件
                $('#link_login').trigger('click'); 
            }); 
                                
        })
    })

    /* 监听登录form表单绑定提交事件*/
    $('#form_login').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    console.log(res.message);
                    return layer.msg(res.message);              
                }
                localStorage.setItem('token',res.token);
                layer.msg(res.message, {time: 800 },function(){
                    // 自触发 去登录按钮 事件
                    location.href = '/index.html'  
                });
            }
        })

    })
})