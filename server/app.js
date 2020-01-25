var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('./lib/db').db;
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();


// redis 配置
var resConfig = {
    "cookie": {
        "maxAge": 1800000
    },
    "sessionStore": {
        "client": redis,
        "ttl": config.redis.sessionTtl,
        "prefix": config.redis.prefix + 'SESS:',
        "logErrors": true
    }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.secret.cookie));

//配置redis 缓存session

app.use(session({
  name : "sid",
  secret: config.secret.cookie,
  cookie: resConfig.cookie,
  store : new RedisStore(resConfig.sessionStore)
}));

// 路由设置
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
