var request = require('request');

module.exports = function () {

	var RancherClient = function () {
		this.endpoint = process.env.CATTLE_CONFIG_URL;
		this.accessKey = process.env.CATTLE_ACCESS_KEY;
		this.secretKey = process.env.CATTLE_SECRET_KEY;
		this.environment = process.env.CATTLE_ENVIRONMENT;
	};

	RancherClient.prototype.findCertByName = function (name, cb) {
		request.get(this.buildUrl('/certificates?name=' + name), {
			auth: {
				user: this.accessKey,
				pass: this.secretKey
			}
		}, cb);
	}

	RancherClient.prototype.buildUrl = function (path) {
		return this.endpoint + '/projects/' + this.environment + path;
	}

	return new RancherClient();

}();