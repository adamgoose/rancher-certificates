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
		var body = this.prepareJsonBody();

		Rancher.findCertByName(this.domain, function (err, response, body) {
			console.log(err);
		});

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