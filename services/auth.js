'use strict'
const { AspNetUsers } = require("../models");


// If we have different users with different roles then 
// we can check wether they are authorized or not.
async function authenticate(email) {
	try {
		const user = await AspNetUsers.findOne({ where: { email } });
		if (user) {
			return { Id, UserName, Email } = user;
		}
		// No matching account found
		return undefined;
	} catch (error) {
		console.log(error)
		return undefined
	}
}

module.exports = {
	authenticate,
}
