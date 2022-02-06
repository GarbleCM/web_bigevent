$(function(){
    // 定义layui所需的参数
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 当前页码值， 默认为第一 
        pagesize: 2, // 每页显示多少条， 默认为两条
        cate_id: '', // 文章分类的Id， 默认为空
        state: '', // 文章的状态 如：已发布和草稿 默认为空
    }
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function(date){
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var mm = padZero(dt.getMinutes());
        var hh = padZero(dt.getHours());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss 
    }
    // 定义补零函数
    function  padZero(n){
        return n > 9 ? n : '0' + n;
    }

    // 获取文章数据的方法
    initTable()
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！');
                // console.log(res);
                // 渲染文章列表
                var htmlStr = template('tpl-table', res);
                $('#art_list tbody').html(htmlStr);                    
                // 调用渲染分页 renderPage方法
                renderPage(res.total)
            }
        })
    }

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
                var cateIdStr = template('tpl-cate', res);
                // console.log(cateIdStr);
                $('#allCate').html(cateIdStr);
                // 由于layui.js在模板引擎引入的前面
                // 所以当layui.js渲染的时候 所有分类的下拉选项还不存在
                // 那么需要用form.render重新渲染一遍
                form.render();
            }
        })
    }

    // 监听 筛选表单的submit事件
    $('#form-filter').on('submit', function(e){
        e.preventDefault();
        // 获取 筛选表单中对应选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total){
        // console.log(totals);
        laypage.render({
            elem: 'pageBox',// 注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum, // 起始页。一般用于刷新类型的跳页以及HASH跳页。
            layout: ['count', 'limit','prev', 'page', 'next',  'refresh', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页切换时触发jump回调函数
            jump: function(obj, first){ //obj.curr 可以 获得最新页码值
                // 把最新的页码值，赋值给 q 这个参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数 赋值给q这个参数对象中的pagesize属性
                q.pagesize = obj.limit;
                if(!first){
                    initTable();                   
                }
            }
        })
    }

    // 通过代理的方式 监听删除按钮的点击事件
    $('tbody').on('click', '.btnDel', function(e){
        // 获取当前删除按钮所在的数据行的data-id 属性值（Id值）
        var id = $(this).attr('data-id');
        // 获取当前页面的删除按钮的个数
        // 注意获取到的按钮个数是当前页面的 而不是所有的按钮个数
        var len_btnDel = $('.btnDel').length;
        console.log(len_btnDel);
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //发起get请求删除分类
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    // 当每次数据删除完成后，我们要判断当前这一页是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值pagenum - 1
                    // 再重新调用initTable方法
                    if(len_btnDel === 1){
                        // 如果len_btnDel = 1 说明这次删除完成后，该页面就没肉数据了
                        // 就让页码值pagenum - 1
                        
                        // 由于页面值的最小值必须是1的
                        // 所有在让页码值pagenum - 1时要进行判断
                        q.pagenum = q.pagenum === 1? 1 : q.pagenum-1;
                    }
                    initTable()
                }
            })
            // 关闭弹出层
            layer.close(index);
        });      
    })

    // 监听文章的编辑按钮的click事件
    $('tbody').on('click','#art-edit', function(e){
        localStorage.setItem('id', $(this).attr('data-id'))
        location.href = '/article/art_edit.html'
    })
})