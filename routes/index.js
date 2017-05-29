'use strict'

var express = require('express');
var router = express.Router();
var Place = require('../models/places');
var Director = require('../models/directors');
var Event = require('../models/events');
var User = require('../models/users_admins');
var CommentEvent = require('../models/commentsEvents');
var CommentPlace = require('../models/commentsPlaces');
var async = require('async');
var mongoose = require('mongoose');
var ObjectID = require('mongoose').ObjectID;
//var HttpError = require('error').HttpError;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('events/index', {title: 'Main Page'});
});

router.get('/signin', function(req, res ,next){
	res.render('user/signin');
});

router.get('/signup', function(req, res, next){
	res.render('user/signup');
});

router.get('/logout', isLoggedIn, function(req, res, next){
	req.session.destroy();
	res.redirect('/');
});

router.post('/signup', function(req, res, next){	
	var login = req.body.name;
	var password = req.body.password;
	
	async.waterfall([
		function(callback){
			User.findOne({login: login}, callback);
		},
		function(user, callback){
			if (user){
				if (user.password == password){
					callback(null, user);
				} else {
					res.send(403, "Wrong Password");
				}
			} else {
				var user = new User({login: login, password: password, type: "user"});
				user.save(function(err){
					if (err) return next(err);
					callback(null, user);
				});
			}
		}
	], function(err, user){
			if (err) return next(err);
			req.session.user = user;
			req.user = user;
			res.redirect('/');
		});	
});

router.get('/show-places', isLoggedIn, function(req, res, next) {
	Place.find(function(err, docs){
		if (err) return next(err);
		Director.find(function(err, dir){
			res.render('events/places', {places: docs, directors: dir, isAdmin: req.session.user.type == "admin"});
		});
	});
});

router.get('/remove-place/:id', function(req, res, next){
	var id = req.params.id;
	Place.findByIdAndRemove(id).exec();	
	res.send(200, 'Success');
});

router.post('/add-place', function(req, res, next){
	Director.findById(req.body.director, function(err, docs){
		if (err) return next(err);
		var place = new Place({
			name: req.body.name,
	        type: req.body.type,
	        address: req.body.address,
	        countOfPlaces: req.body.count,
	        idOfDirector: docs._id,
	        date: Date.now(),
	        duration: [req.body.date1, req.body.date2]
		});			
		place.save(function(err, result){
			if (err) console.log(err);
			res.send(200, 'Success');
		});
	});
});

router.get('/show-events', isLoggedIn, function(req, res, next) {	
	Event.find({}, function(err, docs){
		if (err) return next(err);
		Place.find(function(err, place){
			res.render('events/events', {events: docs, places: place, isAdmin: req.session.user.type == "admin", isUser: req.session.user.type == "user"});
		});
	});
});

router.get('/show-opened-events', isLoggedIn, function(req, res, next) {	
	Event.find({status: "Open"}, function(err, docs){
		if (err) return next(err);
		Place.find(function(err, place){
			res.render('events/events', {events: docs, places: place, isAdmin: req.session.user.type == "admin", isUser: req.session.user.type == "user"});
		});
	});
});

router.get('/show-closed-events', isLoggedIn, function(req, res, next) {
	Event.find({status: "Close"}, function(err, docs){
		if (err) return next(err);
		Place.find(function(err, place){
			res.render('events/closed-events', {events: docs.reverse(), places: place, isAdmin: req.session.user.type == "admin", isUser: req.session.user.type == "user"});
		});
	});
});

router.get('/show-events-by-date', isLoggedIn, function(req, res, next) {	
	Event.find({status: "Open"}).sort({date: 1}).exec(function(err, docs){
		if (err) return next(err);
		Place.find(function(err, place){
			res.render('events/events', {events: docs, places: place, isAdmin: req.session.user.type == "admin", isUser: req.session.user.type == "user"});
		});
	});
});

router.get('/show-events-by-name', isLoggedIn, function(req, res, next) {	
	Event.find({status: "Open"}).sort({name: 1}).exec(function(err, docs){
		if (err) return next(err);
		Place.find(function(err, place){
			res.render('events/events', {events: docs, places: place, isAdmin: req.session.user.type == "admin", isUser: req.session.user.type == "user"});
		});
	});
});

router.get('/show-events-by-count', isLoggedIn, function(req, res, next) {	
	Event.find({status: "Open"}).sort({countOfPeople: 1}).exec(function(err, docs){
		if (err) return next(err);
		Place.find(function(err, place){
			res.render('events/events', {events: docs, places: place, isAdmin: req.session.user.type == "admin", isUser: req.session.user.type == "user", isOpen: true});
		});
	});
});

router.get('/remove-event/:id', function(req, res, next){
	var id = req.params.id;
	Event.findByIdAndRemove(id).exec();
	res.send(200, 'Success');
});

router.post('/add-event', function(req, res, next){
	Place.findOne({name: req.body.place}, function(err, docs){
		if (err) console.log(err);
		var event = new Event({
			place: docs._id,
		    date: req.body.date,
		    name: req.body.name,
		    type: req.body.type,
		    idOfPeople: [],
		    countOfPeople: req.body.count,
		    imagePath: req.body.image,
		    status: 'Open'
		});
		event.save(function(err, result){
			if (err) console.log(err);
			res.send(200, 'Success');
		});
	});
});

router.get('/go-on-event/:id', function(req, res, next){
	var eventId = req.params.id;
	var userLogin = req.user.login;
	Event.findById(eventId, function(err, event){
		if (err) return next(err);
		var count = 0;
		event.idOfPeople.forEach(function(item){
			if (item == userLogin) count++;
		});		
		if (count > 0) res.send(403, 'Not more');
		else if (count == 0){
			event.idOfPeople.push(userLogin);
			event.save();
			res.redirect('/');
		}
	});		
});

router.get('/not-go-on-event/:id', function(req, res, next){
	var eventId = req.params.id;
	Event.findById(eventId, function(err, docs){
		if (err) return next(err);
		docs.idOfPeople.splice(docs.idOfPeople.indexOf(docs._id), 1);
		docs.save();
	});
	res.send(200, 'Success');
});

router.get('/close-event/:id', function(req, res, next){
	var eventId = req.params.id;
	Event.findById(eventId, function(err, docs){
		if (err) return next(err);
		docs.status = "Close";
		docs.save();
	});
	res.send(200, 'Success');
});

router.post('/add-comment-to-event/:id', function(req, res, next){
	var id = req.params.id;	
	Event.findById(id, function(err, docs){
		if (err) next(err);
		var comment = new CommentEvent({
			event: docs._id,
			user: req.user._id,
			text: req.body.text
		});
		comment.save(function(err, result){
			if (err) return res.redirect('/');
			res.send(200, 'Success');
		});
	});	
});

router.get('/show-comments-events/:id', function(req, res, next){
	var id = req.params.id;
	CommentEvent.find({event: id}, function(err, comment){
		if (err) return next(err);
		var comments = [];
		for (var i = 0; i < comment.length; i++){
			comments.push(comment[i]);
		};		
		Event.findById(id, function(err, event){
			if (err) return next(err);			
			res.render('events/comments', {comments: comments.reverse(), title: event.name});
		});
	});
});

router.post('/add-comment-to-place/:id', function(req, res, next){
	var id = req.params.id;	
	Place.findById(id, function(err, docs){
		if (err) next(err);
		var comment = new CommentPlace({
			event: docs._id,
			user: req.user._id,
			text: req.body.text
		});
		comment.save(function(err, result){
			if (err) return res.redirect('/');
			res.send(200, 'Success');
		});
	});	
});

router.get('/show-comments-place/:id', function(req, res, next){
	var id = req.params.id;
	CommentPlace.find({event: id}, function(err, comment){
		if (err) return next(err);
		var comments = [];
		for (var i = 0; i < comment.length; i++){
			comments.push(comment[i]);
		};		
		Place.findById(id, function(err, place){
			if (err) return next(err);
			res.render('events/comments', {comments: comments.reverse(), title: place.name});
		});
	});
});

router.post('/add-people-to-event/:id',function(req, res, next){
	var id = req.params.id;
	Event.findById(id, function(err, event){
		if (err) return next(err);
		event.countOfPeople = req.body.count;
		event.status = "Close";
		event.save(function(err, result){
			if (err) return next(err);
			res.redirect('/');
		});
	});
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect('/signup');
}



module.exports = router;
