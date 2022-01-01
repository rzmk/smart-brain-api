const handleSignIn = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	// Validate the input to not be empty
	if (!email || !password) {
		return res.status(400).json("Incorrect form submission.");
	}
	// Check if the user exists in the database
	db.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			// If the user exists and the password is correct, return the user
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) =>
						res.status(400).json("Unable to get user.")
					);
			} else {
				res.status(400).json("Invalid credentials.");
			}
		})
		.catch((err) => res.status(400).json("Invalid credentials."));
};

module.exports = {
	handleSignIn: handleSignIn,
};
