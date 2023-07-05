'use strict'
const jwt = require('jsonwebtoken')
const authConfigs = require('../services/authConfig');
const _ = require('lodash');
const moment = require("moment");

/**
 * @description Verifies the token and makes sure it is still valid
 * @throws
 * @param {String} token JWT Signature
 */


 function verify(token) {
	let payload = jwt.verify(token, authConfigs.private_key)

	if (!_.has(payload, 'iat') || !_.has(payload, 'exp')) return  undefined;

	let tokenExpiry = payload.exp 
	
	if (isNaN(tokenExpiry)) return  undefined;

	const currentTime = moment().utc();
	const tokenExpiryMoment = moment.unix(tokenExpiry);

	if (tokenExpiryMoment.isSameOrBefore(currentTime)) return undefined;
					
	
	return payload
}

function issueToken(payload) {

	let tokenPayload = {
		...payload,
		exp: moment().utc().unix() + authConfigs.token_life,
		iat: moment().utc().unix()
	}

	let token = jwt.sign(tokenPayload, authConfigs.private_key)
	return token
}



module.exports = {
	verify,
	issueToken
}
