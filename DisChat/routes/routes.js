module.exports = function (express,app, passport, rooms, config){
	var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {title : 'Welcome to DisChat'});
	})

	//preventing direct page access
	function securePages(req, res, next){
		if(req.isAuthenticated()){
			next();
		}else{
			res.redirect('/');
		}
	}

	router.get('/auth/facebook/', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/chatrooms',
		failRedirect : '/'
	}));

	router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	router.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect : '/chatrooms',
		failRedirect : '/'
	}));

	router.get('/auth/twitter', passport.authenticate('twitter'));
	router.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect : '/chatrooms',
		failRedirect : '/'
	}));

	router.get('/chatrooms', securePages, function(req, res, next){
		res.render('chatrooms', {title : 'DisChat chatrooms', user:req.user, config:config})
	});

	router.get('/room/:id', securePages, function(req, res, next){
		var room_name = findTitle(req.params.id);
		res.render('room', {user : req.user, room_number : req.params.id, room_name : room_name, config : config});
	})

	function findTitle(room_id){
		var n = 0;
		while(n < rooms.length){
			if(rooms[n].room_number == room_id){
				return rooms[n].room_name;
				break;
			}else{
				n++;
				continue;
			}
		}
	}

	router.get('/test', function(req, res, next){
		res.render('chatrooms', {})
	});

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/')
	})

	// router.get('/setcolor', function(req, res, next){
	// 	req.session.favColor = "Red";
	// 	res.send('Setting favorite color!');
	// })

	// router.get('/getcolor', function(req,res,next){
	// 	res.send('Favorite color :' + (req.session.favColor === undefined ? 'Color Not Found' : req.session.favColor));
	// })

	app.use('/', router);
}