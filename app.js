// 引入express
const express = require('express')
// 引入 cors解决跨域
const cors = require('cors')
// 导入使用用户路由模块
const userRouter = require('./router/user')
const joi = require('@hapi/joi')

const app = express()

app.use(cors({
    origin:['http://127.0.0.1'],
    methods:['GET','POST']
}))

app.use(express.urlencoded({extended:false}))

// 在路由之前，封装res.cc
app.use((req,res,next) => {
    // status 默认值为1表示失败
    // err的值，可能是错误对象也可以错误字符串
    res.cc = function (err, status = 1){
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

app.use('/api',userRouter)

// 定义错误级别中间件
app.use((err,req,res,next) => {
    if(err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // 未知的错误
    res.cc(err)
})

app.listen(8081, ()=>{
    console.log('express server at http://127.0.0.1:8081')
})