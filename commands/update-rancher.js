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

		console.log('Using payload for create/update requests:', payload);

		Rancher.findCertByName(this.domain, function (data) {
			if (data.length) {
				// an existing certificate exists. Update it.
				var id = data[0].id;

				console.log('Found existing certificate with ID ' + id);

				Rancher.updateCertificateById(id, payload, function (data) {
					console.log('Updated certificate in Rancher!');
				});
			} else {
				// no certificate exists. Create one!
				Rancher.createCertificate(payload, function (data) {
					console.log('Created certificate in Rancher!');
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
			chain: this.chainfile ? fs.readFileSync(this.chainfile.replace('full', ''), 'utf8') : null,
		};
	}

	return UpdateRancherCommand;

}();