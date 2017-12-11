var express = require('express')
var multer = require('multer')
var mysql = require('mysql')
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser')
var user = express.Router()
var app = express()
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'gqq123..',
    database: 'jieke',
    port: 3306
})
app.use(bodyParser.urlencoded({}))
app.use(multer({
    dest: './img'
}).any())
app.use('/user', user)
//登录注册
user.post('/login', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var user = req.body.user
    var pass = req.body.pass
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('connection::' + err)
            return
        }
        connection.query('select * from login where user=?', [user], function(err, data) {
            if(err) {
                console.log('mysql::' + err)
                return
            }
            if(data == '') {
                res.send('用户名不存在')
            } else {
                if(data[0].pass == pass) {
                    res.send('登陆成功')
                } else {
                    res.send('用户名或密码错误')
                }
            }

        })
    })

})
//注册
user.post('/login2', function(req, res) {
    var user = req.body.user
    var pass = req.body.pass
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('connection::' + err)
            return
        }

        connection.query('select * from login where user=?', [user], function(err, data) {
            if(err) {
                console.log('mysql::' + err)
                return
            }
            if(data == '') {
                connection.query('insert into login(user,pass) values(?,?)', [user, pass], function(err, data) {
                    if(err) {
                        console.log('mysql::' + err)
                        return
                    }
                    res.send('http://localhost:8000/register.html?username=' + user)
                })
            } else {
                res.send('用户名以存在')
            }

        })
    })
})
app.use(express.static('./'))
app.listen(8000, function() {
    console.log('ok')
})
