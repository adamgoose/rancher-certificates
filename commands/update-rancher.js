var fs = require('fs');
var Rancher = require('../lib/Rancher.js');

module.exports = function () {

	var UpdateRancherCommand = function (domain, keyfile, certfile, chainfile) {
		this.domain = domain;
		this.keyfile = keyfile;
		this.certfile = certfile;
		this.chainfile = chainfile;
	};

	UpdateRancherCommand.prototype.handle = function () {
		var payload = this.prepareJsonBody();

		Rancher.findCertByName(this.domain, function (data) {
			if (data.length) {
				// an existing certificate exists. Update it.
				var id = data[0].id;

				Rancher.updateCertificateById(id, payload, function (data) {
					console.log(data);
				});
			} else {
				// no certificate exists. Create one!
				Rancher.createCertificate(payload, function (data) {
					console.log(data);
				});
			}
		}.bind(this));

		// console.log(body);
	}

	UpdateRancherCommand.prototype.prepareJsonBody = function () {
		return {
			name: this.domain,
			key: fs.readFileSync(this.keyfile, 'utf8'),
			cert: fs.readFileSync(this.certfile, 'utf8'),
			chain: this.chainfile ? fs.readFileSync(this.chainfile, 'utf8') : null,
		};
	}

	return UpdateRancherCommand;

}();