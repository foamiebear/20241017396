var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var WebSocket = require('ws')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});




// 创建WebSocket服务器，监听8080端口
const wss = new WebSocket.Server({ port: 8080 });

// 监听连接事件
wss.on('connection', (ws) => {

	let data = [4000, 5300, 53, 53, 400, 400, 491.52, "internal", "internal", [0, 0, 1, 0, 0, 1, 0, 0]];
	// 监听消息事件
	ws.on('message', (message) => {
		// let arr = message.toString().split(" ");
		let _mess = message.toString();
		let mess = _mess.split(" ");
		console.log(mess);

		if (mess[1] == "a") {
			getData(mess);

		}

		if (mess[1] == "b") {

			ws.send(`"12345678 a f_send ${data[0]} f_recv ${data[1]} g_send ${data[2]} g_recv ${data[3]} f_send ${data[4]} f_recv ${data[5]} s_rate ${data[6]} ${data[7]} ${data[8]} ${data[9].join('')}`);
		}

		function getData(mess) {
			data[0] = mess[3];
			data[1] = mess[5];
			data[2] = mess[7];
			data[3] = mess[9];
			data[4] = mess[11];
			data[5] = mess[13];
			data[6] = mess[15];
			data[7] = mess[16];
			data[8] = mess[17];
		}
	});

	// 监听关闭事件
	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

console.log('WebSocket server is running on ws://localhost:8080');








module.exports = app;
