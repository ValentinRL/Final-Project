let count = 1;

class User {
	constructor(firstName, lastName, username, password, email, dob) {
        this.id = count;
        count++;
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.password = password;
		this.email = email;
		this.dob = dob;
	}

	getUserInfo() {
		return {
			id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            email: this.email,
            dob: this.dob
        }
	}
}

module.exports = User;
