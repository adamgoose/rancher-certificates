var request = require('request');

module.exports = function () {

	var RancherClient = function () {
		this.endpoint = process.env.RANCHER_ENDPOINT;
		this.accessKey = process.env.RANCHER_ACCESS_KEY;
		this.secretKey = process.env.RANCHER_SECRET_KEY;

		this.auth = {
			user: this.accessKey,
			pass: this.secretKey
		};
	};

	RancherClient.prototype.findCertByName = function (name, cb) {
		request.get(this.endpoint + '/certificates?name=' + name, {
			auth: this.auth
		}, function (err, response, body) {
			var data = JSON.parse(body)
				.data;

			if (!err)
				cb(data);
			else
				cli.warn('Unable to find Rancher certificate');
		});
	}

	RancherClient.prototype.updateCertificateById = function (id, payload, cb) {
		request.put(this.endpoint + '/certificates/' + id, {
			form: payload,
			auth: this.auth
		}, function (err, response, body) {
			var data = JSON.parse(body);

			if (!err)
				cb(data);
			else
				cli.error('Unable to update Rancher certificate by ID ' + id);
		})
	}

	RancherClient.prototype.createCertificate = function (payload, cb) {
		request.post(this.endpoint + '/certificates', {
			form: payload,
			auth: this.auth
		}, function (err, response, body) {
			var data = JSON.parse(body);

			cb(data);
		});
	}

	return new RancherClient();

}();