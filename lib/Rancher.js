var request = require('request');

module.exports = function () {

	var RancherClient = function () {
		this.endpoint = process.env.RANCHER_ENDPOINT;
		this.accessKey = process.env.RANCHER_ACCESS_KEY;
		this.secretKey = process.env.RANCHER_SECRET_KEY;
	};

	RancherClient.prototype.findCertByName = function (name, cb) {
		request.get(this.endpoint + '/certificates?name=' + name, {
			auth: {
				user: this.accessKey,
				pass: this.secretKey
			}
		}, cb);
	}

	return new RancherClient();

}();