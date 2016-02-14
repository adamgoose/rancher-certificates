var fs = require('fs');
var Rancher = require('../lib/Rancher.js');
var cli = require('cli');

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
				var id = data[0].id;

				cli.info('Found existing certificate with ID ' + id);

				Rancher.updateCertificateById(id, payload, function (data) {
					cli.info('Updated certificate in Rancher!');
				});
			} else {
				Rancher.createCertificate(payload, function (data) {
					cli.info('Created certificate in Rancher!');
				});
			}
		}.bind(this));
	}

	UpdateRancherCommand.prototype.prepareJsonBody = function () {
		return {
			name: this.domain,
			key: fs.readFileSync(this.keyfile, 'utf8'),
			cert: fs.readFileSync(this.certfile, 'utf8'),
			certChain: this.chainfile ? fs.readFileSync(this.chainfile.replace('full', ''), 'utf8') : null,
		};
	}

	return UpdateRancherCommand;

}();