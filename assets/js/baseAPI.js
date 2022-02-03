$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    
    /* 为要权限的请求统一设置请求体headers */
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization : localStorage.getItem('token') || '',
        }
        
    }

    // 全局挂载complete 配置对象
    options.complete = function(res){
        // console.log(res);
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 清空缓存token
            localStorage.removeItem('token');
            // 返回登录页面
            location.href = '/login.html'
        } 
    }
})