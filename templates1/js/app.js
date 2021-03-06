var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , mongoose = require('./config/mongoose.js')
  , onerror = require('koa-onerror');

var index = require('./routes/index');
var users = require('./routes/users');

// error handler
onerror(app);

// mongodb
mongoose();

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: '{views}'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());

// mount root routes
app.use(koa.routes());

module.exports = app;
