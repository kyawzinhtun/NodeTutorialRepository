module.exports = function(passport, FacebookStrategy, GoogletStrategy, TwittertStrategy, config, mongoose){

	//create schema for chat user
	var chatUser = new mongoose.Schema({
		profileID : String,
		fullName : String,
		profilePic : String
	})

	var userModel = mongoose.model('chatUser', chatUser);

	passport.serializeUser(function(user,done){
		done(null, user.id);
	})

	passport.deserializeUser(function(id,done){
		userModel.findById(id, function(err,user){
			done(err,user);
		})
	})

//using facebook auth & outh
	passport.use(new FacebookStrategy({
		clientID : config.fb.appID,
		clientSecret : config.fb.appSecret,
		callbackURL : config.fb.callbackURL,
		profileFields : ['id', 'displayName', 'photos']
	},	function(accessToken, refreshToken, profile, done){
		//check the user exist in our mongo db
		//if not, create the one and return the profile
		//if the user exist, simply return the profile

		userModel.findOne({'profileID' : profile.id}, function(err, result){
				if(result){
					done(null, result);
				}else{
					//create a new user in our mongo db
					var newChatUser = new userModel({
						profileID : profile.id,
						fullName : profile.displayName,
						profilePic : profile.photos[0].value || ''
					});

					newChatUser.save(function(err){
						done(null, newChatUser);
					})
				}
		})
	}
	))

	//using google auth & outh
	passport.use(new GoogletStrategy({
		clientID : config.google.appID,
		clientSecret : config.google.appSecret,
		callbackURL : config.google.callbackURL,
		profileFields : ['id', 'displayName', 'photos']
	}, function(accessToken, refreshToken, profile, done){
		userModel.findOne({'profileID' : profile.id}, function(err,result){
			if(result){
				done(null, result);
			}else{
				var newChatUser = new userModel({
					profileID : profile.id,
					fullName : profile.displayName,
					profilePic : profile.photos[0].value || ''
				});

				newChatUser.save(function(err){
					done(null, newChatUser);
				});
			}
		})
	}
	))

	//using twitter auth & outh
	passport.use(new TwittertStrategy({
		consumerKey : config.twitter.appID,
		consumerSecret : config.twitter.appSecret,
		callbackURL : config.twitter.callbackURL,
		profileFields : ['id', 'displayName', 'photos']
	}, function(accessToken, refreshToken, profile, done){
		userModel.findOne({'profileID' : profile.id}, function(err,result){
			if(result){
				done(null, result);
			}else{
				var newChatUser = new userModel({
					profileID : profile.id,
					fullName : profile.displayName,
					profilePic : profile.photos[0].value || ''
				});

				newChatUser.save(function(err){
					done(null, newChatUser);
				});
			}
		})
	}
	))

}