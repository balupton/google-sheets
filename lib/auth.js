var GoogleClientLogin = require('googleclientlogin').GoogleClientLogin;

exports.authorize = function(options, callback) {
	var googleAuth = new GoogleClientLogin({
		email: options.email,
		password: options.password,
		service: 'spreadsheets',
		accountType: GoogleClientLogin.accountTypes.google
	});
	googleAuth.on(GoogleClientLogin.events.login, function(){
		// do things with google services
		callback(null, googleAuth.getAuthId());
	});
	googleAuth.on(GoogleClientLogin.events.error, function(e) {
		switch(e.message) {
			case GoogleClientLogin.errors.loginFailed:
				if (this.isCaptchaRequired()) {
					return callback('captcha required', {
						error: 'Process captcha then recall function with captcha and token parameters',
						captchaUrl: this.getCaptchaUrl(),
						captchaToken: this.getCaptchaToken()
					});
				}
				break;
			case GoogleClientLogin.errors.tokenMissing:
			case GoogleClientLogin.errors.captchaMissing:
				return callback('captcha missing', {error: 'You must pass the both captcha token and the captcha'});
		}
		callback('unkown error',{error: 'Unknown error in GoogleClientLogin.'});
	});
	var captcha = undefined;
	if (options.captcha) {
		captcha = {logincaptcha: options.captcha, logintoken: options.token};
	}
	googleAuth.login(captcha);
};