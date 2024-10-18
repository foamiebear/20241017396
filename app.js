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
	console.log('Client connected');
	let data = null;
	// 监听消息事件
	ws.on('message', (message) => {
		// let arr = message.toString().split(" ");
		let _mess = message.toString();
		let mess = _mess.split(" ");
		console.log(mess);

		if (mess[1] == "a") {
			data = getData(mess);

		}

		if (mess[1] == "b") {
			ws.send(`"12345678 a f_send ${data.sendFreq} f_recv ${data.recvFreq} g_send ${data.sendGain} g_recv ${data.recvGain} f_send ${data.sendBandwidth} f_recv ${data.recvBandwidth} s_rate ${data.sampleRate} ${data.refClock} ${data.refPps}`);
		}

		function getData(mess) {
			return {
				"sendFreq": mess[3],
				"recvFreq": mess[5],
				"sendGain": mess[7],
				"recvGain": mess[9],
				"sendBandwidth": mess[11],
				"recvBandwidth": mess[13],
				"sampleRate": mess[15],
				"refClock": mess[16],
				"refPps": mess[17]

			}
		}
	});

	// 监听关闭事件
	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

console.log('WebSocket server is running on ws://localhost:8080');








module.exports = app;
