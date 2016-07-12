var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js')
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	TwitterStrategy  = require('passport-twitter').Strategy,
	rooms = []

app.set('views', path.join(__dirname, 'web'));
//set template engine
//need to install module as npm install hogan-express --save
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'web/public')));
//Session management
//need to install module as npm install cookie-parser --save
app.use(cookieParser());
//need to install module as npm install express-session --save
// app.use(session({secret : 'dischatsecret', saveUninitialized : true, resave : true}));

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function(){
	console.log("DisChat runnig on port "+ app.get('port'));
})


var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
	//development specific setting
	// app.use(session({secret : 'dischatsecret'}));
	app.use(session({secret : config.sessionSecret}))
	io.set('log level', 1);
}else{
	app.use(session({
		secret : config.sessionSecret,
		//need to install module as npm install connect-mongo --save
		store : new ConnectMongo({
			// url : config.dbURL,
			mongoose_connection:mongoose.connections[0],
			stringify : true
		})
	}));
}

app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportAuth.js')(passport, FacebookStrategy, GoogleStrategy, TwitterStrategy, config, mongoose);
require('./routes/routes.js')(express,app, passport, rooms, config);

/*app.listen(3000, function(){
	console.log("dischat app server running on port 3000");
	console.log("Mode : " + env);
});*/

