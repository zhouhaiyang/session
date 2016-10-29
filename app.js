/**
 * Created by Administrator on 2016/10/29.
 */
var express = require('express');
var bodyParser= require('body-parser');//这个需要安装模块

var fs = require('fs');
var path =require('path');
var app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','html');
app.set('views',path.join(__dirname,'views'));
app.engine('.html',require('ejs').__express);
var cookieParser = require('cookie-parser')
app.use(cookieParser());
// session中间件
var session = require('express-session');
/**
 * 使用session中间件
 * 当使用此中间件之后会在req.session=就等于此客户端在服务器端对应的session数据对象
 */
app.use(session({
    resave:true,//每次客户端请求的时候重新保存session
    saveUninitialized:true,//保存未初始化的session
    secret:'zfpx',//加密cookie
    //cookie:{maxAge:10*1000}
}));
function checkLogin(req,res,next){
    if(req.path == '/login'){//如果请求的是登录页
        next();///直接继续
    }else{
        //如果cookie对象存在，并且已经登录过了
        if(req.cookies && req.session.username){
            if(req.path== '/user'){//如果访问的是就是/user直接next
                next();
            }else{//如果访问的不是/user 直接重定向/user
                res.redirect('/user')
            }
        }else{//如果没有登录，则重定向到登录页面
            res.redirect('/login');
        }
    }
}
app.use(checkLogin);
//登录页
app.get('/login',function(req,res){
    res.render('login.html')
});
app.post('/login',function(req,res){
    var user = req.body;//得到请求体
    if(user.username == user.password){//如果在表单中输入的用户名和密码相同，则登录成功
        //把用户名写入cookie
        req.session.username=user.username;
        req.session.password=user.password;
        //重定向到user页面
        res.redirect('/user');
    }else{
        res.redirect('back');
    }
});
//用户主页
app.get('/user',function(req,res){
    console.log(req.session)
    console.log(req.cookies);
    console.log(req.session.cookie);
    res.render('user',{username:req.cookies.username})
});


app.listen(8080);
