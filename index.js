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

app.post('/createPost',
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
		//TODO
		res.status(400);
		res.json({ status: 'Missing images' });
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
	postList.push(new Post(
		req.body.title,
		req.body.description,
		req.body.category,
		req.body.image,
		req.body.price,
		req.body.shipping,
		req.body.pickup,
		req.user
	));
	res.send("Success!");
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
