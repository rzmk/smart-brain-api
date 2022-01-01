const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	// Validate the input to not be empty
	if (!email || !name || !password) {
		return res.status(400).json("Incorrect form submission.");
	}

	// Hash (encrypt) the password
	const hash = bcrypt.hashSync(password);

	/*
	 *  Database transaction to make sure all the queries are executed together
	 *  First query is to insert the user into the login table
	 *  Second query is to insert the user into the users table
	 *  Then we return the user
	 */
	db.transaction((trx) => {
		trx.insert({
			hash: hash,
			email: email,
		})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				return trx("users")
					.returning("*")
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					})
					.then(trx.commit);
			})
			.catch(trx.rollback);
	}).catch((err) => res.status(400).json("Unable to register."));
};

module.exports = {
	handleRegister: handleRegister,
};
