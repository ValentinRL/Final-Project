/*
Graded exercise in building cloud integration. 

Valentin Raltchev
Leon Bellmann
*/
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const User = require('./Models/User');
const Post = require('./Models/Post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('express');
const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
app.use(json());

let options = {};
let jwtSecretKey = 'jomama';

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey;

const userList = [];
const postList = [];

passport.use(
	new JwtStrategy(options, function(payload, done) {
		if ('user' in payload == false) {
			done(null, false);
		}
		if ('id' in payload.user == false) {
			done(null, false);
		}
		let user = userList.find(u => u.id == payload.user.id);
		if(user == null){
			done(null, false);
		}
		const now = Date.now() / 1000;
		if (payload.exp > now) {
			done(null, user.getUserInfo());
		} else {
			done(null, false);
		}
	})
);

app.post('/register', (req, res) => {
	if ('firstName' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing firstname' });
		return;
	}
	if ('lastName' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing lastname' });
		return;
	}
	if ('username' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing username' });
		return;
	}
	if ('password' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing password' });
		return;
	}
	if ('confirm_password' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing confirm_password' });
		return;
	}
	if ('email' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing email' });
		return;
	}
	if ('dateOfBirth' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing dateofbirth' });
		return;
	}

	if (req.body.password !== req.body.confirm_password) {
		res.status(400);
		res.json({ status: 'Password and Confirm Password do not match' });
		return;
	}

	if(userList.find(u => u.username == req.body.username) != null){
		res.status(400);
		res.json({ status: 'Username already exists' });
		return;
	}

	if(userList.find(u => u.email == req.body.email) != null){
		res.status(400);
		res.json({ status: 'Email already exists' });
		return;
	}

	const salt = bcrypt.genSaltSync(6);
	const hashedPassword = bcrypt.hashSync(req.body.password, salt);
	userList.push(
		new User(
			req.body.firstName,
			req.body.lastName,
			req.body.username,
			hashedPassword,
			req.body.email,
			req.body.dateOfBirth
		)
	);

	res.status(201).json({ status: 'created' });
});

app.get('/login', (req, res) => {
	if ('username' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing username' });
		return;
	}
	if ('password' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing password' });
		return;
	}
	let user = userList.find((c) => c.username == req.body.username);
	if (user == undefined) {
		res.status(404);
		res.json({ status: 'No such user' });
	}
	if (bcrypt.compareSync(req.body.password, user.password) == false) {
		res.status(403);
		res.json({ status: 'Wrong password' });
	}

	const payload = {
		user: user.getUserInfo()
	};

	const options = {
		expiresIn: '1d'
	};

	const token = jwt.sign(payload, jwtSecretKey, options);

	return res.json({ token });
});

app.post('/addPost',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if ('title' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing title' });
		return;
	}
	if ('description' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing description' });
		return;
	}
	if ('category' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing category' });
		return;
	}
	if ('location' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing location' });
		return;
	}
	if ('images' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing images' });
		return;
	}
	if(req.body.images instanceof Array == false){
		res.status(400);
		res.json({ status: 'images must be array' });
		return;
	}
	if(req.body.images.length > 4 || req.body.images.length < 1) {
		res.status(400);
		res.json({ status: 'Images should be from 1 to 4' });
		return;
	}
	if ('pickup' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing pickup' });
		return;
	}
	if ('shipping' in req.body == false) {
		res.status(400);
		res.json({ status: 'Missing shipping' });
		return;
	}

	let newPost = new Post(
		req.body.title,
		req.body.description,
		req.body.category,
		req.body.images,
		req.body.price,
		req.body.shipping,
		req.body.pickup,
		req.body.location,
		req.user
	)
	postList.push(newPost);
	res.status(201);
	res.send(newPost);
})

app.put('/post/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
	if ('id' in req.params == false) {
		res.status(400);
		res.json({ status: 'Missing id from params' });
		return;
	}

	let index = postList.findIndex(p => p.id == req.params.id && p.user.id == req.user.id);

	if(index == -1){
		res.status(404);
		res.json({ status: 'No such post' });
		return;
	}

    if ('title' in req.body != false) {
		postList[index].title = req.body.title;
	}
	if ('description' in req.body != false) {
		postList[index].description = req.body.description;
	}
	if ('category' in req.body != false) {
		postList[index].category = req.body.category;
	}
	if ('location' in req.body != false) {
		postList[index].location = req.body.location;
	}
	if ('images' in req.body != false) {
		if(req.body.images instanceof Array == false){
			res.status(400);
			res.json({ status: 'images must be array' });
			return;
		}
		if(req.body.images.length > 4 || req.body.images.length < 1) {
			res.status(400);
			res.json({ status: 'Images should be from 1 to 4' });
			return;
		} 
		postList[index].images = req.body.images;
	}
	if ('pickup' in req.body != false) {
		postList[index].hasPickup = req.body.pickup;
	}
	if ('shipping' in req.body != false) {
		postList[index].hasShipping = req.body.shipping;
	}

	res.send("Updated!");
})

app.delete('/post/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
	if ('id' in req.params == false) {
		res.status(400);
		res.json({ status: 'Missing id from params' });
		return;
	}
	let index = postList.findIndex(p => p.id == req.params.id && p.user.id == req.user.id);
	if(index == -1){
		res.status(404);
		res.json({ status: 'No such post' });
		return;
	}
	postList.splice(index,1);
	res.status(204);
	res.send("Deleted!");
})

app.get('/post/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
	if ('id' in req.params == false) {
		res.status(400);
		res.json({ status: 'Missing id from params' });
		return;
	}
	let index = postList.findIndex(p => p.id == req.params.id && p.user.id == req.user.id);
	if(index == -1){
		res.status(404);
		res.json({ status: 'No such post' });
		return;
	}

	res.send(postList[index]);
})

app.get('/posts',
  (req, res) => {
	let resultPostList = postList;
	if ('category' in req.query != false) {
		resultPostList = resultPostList.find(p => p.category == req.query.category);
	}
	if ('location' in req.query != false) {
		resultPostList = resultPostList.find(p => p.location == req.query.location);
	}
	if ('dop' in req.query != false) {
		resultPostList = resultPostList.find(p => p.dop == req.query.dop);
	}
	res.send(resultPostList);
})


let serverInstance = null;


function start(){
	serverInstance = app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`)	
	})
}

start();

module.exports = {
	start,
	close: function(){
		serverInstance.close();
	}
}
