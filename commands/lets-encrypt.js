var cli = require('cli');

module.exports = function () {

	var LetsEncryptCommand = function (domainsFile) {
		this.domainsFile = domainsFile;
	}

	LetsEncryptCommand.prototype.handle = function () {

		var process = './letsencrypt.sh -c -k rancher-certificates/bin/sslizer';

		cli.exec(process, function (lines) {
			foreach(lines as line) {
				cli.ok(line);
			}
		});
	}

	return LetsEncryptCommand;

}();