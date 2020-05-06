var KakaocertService = require('./lib/KakaocertService');
var linkhub = require('linkhub');

var configuration = {LinkID: '', SecretKey: ''};

exports.config = function (config) {
    configuration = config;
}

exports.KakaocertService = function () {
    if (!this._KakaocertService) {
        this._KakaocertService = new KakaocertService(configuration);
    }
    return this._KakaocertService;
}
