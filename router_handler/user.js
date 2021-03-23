// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs 这个包
const bcrypt = require('bcryptjs')

// 注册的处理函数
exports.regUser = (req, res) => {
    // 获取用户提交到服务器的用户信息
    const userinfo = req.body
    // 对表单进行合法校验
    // if(!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或密码不合法'
    //     // })
    //     res.cc('用户名或密码不合法')
    // }

    // 定义sql语言
    const sqlStr = 'select username from ev_user where username = ?'
    db.query(sqlStr,userinfo.username,(err,results) => {
        if(err){
            // return res.send({
            //     status: 1,
            //     message: err.message
            // })
            return res.cc(err)
        }
        //判断用户名是否被占用
        if(results.length > 0){
            // return res.send({
            //     status: 1,
            //     message:'用户名被占用，请更换其他用户名'
            // })
            return res.cc('用户名被占用，请更换其他用户名')
        }

        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        
        // 定义插入新用户的sql语句
        const sql = 'insert into ev_user set ?'
        db.query(sql,
            ({
                username: userinfo.username,
                password: userinfo.password}
            ),
            (err,results) => {
            if(err) {
                // return res.send({
                //     status: 1,
                //     message:err.message
                // })
                return res.cc(err)
            }
            // 判断影响行数是否为1
            if(results.affectedRows !== 1){
                // return res.send({
                //     status: 1,
                //     message: '注册用户失败，请稍后再试'
                // })
                res.cc('注册用户失败，请稍后再试')
            }
            
            // res.send({
            //     status: 0,
            //     message:'注册成功'
            // })
            res.cc('注册成功',0)
        })
    })
}

// 登录的处理函数
exports.login = (req,res) => {
    // 接收表单的数据
    const userInfo = req.body
    // 定义sql语句
    const sql = 'select username,password from ev_user where username=?'
    db.query(sql,userInfo.username, (err,results) => {
        if(err){
            return res.cc(err)
        }
        // 如果条数不为1也是查询不到
        if(results.length !== 1){
            return res.cc('登录失败')
        }
    })
   
}