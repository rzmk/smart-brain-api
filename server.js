const express = require("express");
const bcrypt = require("bcrypt-nodejs"); // bcrypt-nodejs is a module that we can use to hash passwords
const cors = require("cors");
const knex = require("knex"); // knex is a database library

// Import endpoint controllers
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// Set up database connection
const db = knex({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
	},
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Success!");
});

app.post("/signin", (req, res) => {
	signin.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}!`);
});
