import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import session from 'express-session'
// 使用檔案的session store，存在sessions資料夾
import sessionFileStore from 'session-file-store'
const FileStore = sessionFileStore(session)

// 修正 __dirname for esm
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// end 修正 __dirname

// 讓console.log可以呈現檔案與行號
import { extendLog } from './utils/tool.js'
extendLog() // 執行全域套用
// console.log呈現顏色用 全域套用
import 'colors'
// 檔案上傳
import fileUpload from 'express-fileupload'

import authJwtRouter from './routes/auth-jwt.js'
import authRouter from './routes/auth.js'
import emailRouter from './routes/email.js'
import indexRouter from './routes/index.js'
import productsRouter from './routes/products.js'
import resetPasswordRouter from './routes/reset-password.js'
import usersRouter from './routes/users.js'
import googleLoginRouter from './routes/google-login.js'
import lineLoginRouter from './routes/line-login.js'
import facebookLoginRouter from './routes/facebook-login.js'
import couponRouter from './routes/coupon.js'
import productLikeRouter from './routes/product-like.js'
import commentRouter from './routes/comment.js'
import categoryRouter from './routes/category.js'
import articleRouter from './routes/article.js'
import cartRouter from './routes/cart.js'
import groupbuyRouter from './routes/groupbuy.js'
import rentRouter from './routes/rent.js'
import orderTestRouter from './routes/order-test.js'
import emailUser from './routes/email-user.js'

import orderRouter from './routes/order.js'
import test1 from './routes/test1.js'
import user_comment from './routes/user_comment.js'
const app = express()

// 檔案上傳
// 選項參考: https://github.com/richardgirges/express-fileupload
// app.use(fileUpload())

// 可以使用的CORS要求，options必要
// app.use(cors())
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:9000',
      'https://keytraveler-backend.onrender.com',
      'https://keytraveler.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// fileStore的選項
const fileStoreOptions = {}
// session-cookie使用
app.use(
  session({
    store: new FileStore(fileStoreOptions), // 使用檔案記錄session
    name: 'SESSION_ID', // cookie名稱，儲存在瀏覽器裡
    secret: '67f71af4602195de2450faeb6f8856c0', // 安全字串，應用一個高安全字串
    cookie: {
      maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session保存30天
      // httpOnly: false,
      // sameSite: 'none',
    },
    resave: false,
    saveUninitialized: false,
  })
)

// 路由使用
app.use('/api/', indexRouter)
app.use('/api/auth-jwt', authJwtRouter)
app.use('/api/auth', authRouter)
app.use('/api/email', emailRouter)
app.use('/api/products', productsRouter)
app.use('/api/reset-password', resetPasswordRouter)
app.use('/api/users', usersRouter)
app.use('/api/google-login', googleLoginRouter)
app.use('/api/line-login', lineLoginRouter)
app.use('/api/facebook-login', facebookLoginRouter)
app.use('/api/product-like', productLikeRouter)
app.use('/api/comment', commentRouter)
app.use('/api/category', categoryRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/cart', cartRouter)
app.use('/api/article', articleRouter)
app.use('/api/groupbuy', groupbuyRouter)
app.use('/api/rent', rentRouter)
app.use('/api/order-test', orderTestRouter)

app.use('/api/email-user', emailUser)

app.use('/api/order', orderRouter)
app.use('/api/test1', test1)
app.use('/api/user_comment', user_comment)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // 更改為錯誤訊息預設為JSON格式
  res.status(500).send({ error: err })
})

export default app
