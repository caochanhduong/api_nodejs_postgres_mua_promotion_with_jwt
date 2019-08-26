'use strict';

module.exports = function(app) {
	var taskHandlers = require('../controllers/taskController'),
	userHandlers = require('../controllers/userController');

	app.route('/api/v1/mua/logins')
		.get(userHandlers.loginRequired,taskHandlers.getResultLogin)

	app.route('/api/v1/mua/combatforces')
		.get(userHandlers.loginRequired,taskHandlers.getResultCombatforce)

	app.route('/api/v1/mua/register')
		.post(userHandlers.register);

	app.route('/api/v1/mua/sign_in')
		.post(userHandlers.sign_in);
};