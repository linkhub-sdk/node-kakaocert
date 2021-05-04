var crypto = require('crypto');
var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var linkhub = require('linkhub');
var http_tls = require('https');
var http_request = require('http');
var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var request = require('sync-request');

var LINKHUB_API_VERSION = "1.0";

module.exports = KakaocertService;
Util.inherits(KakaocertService, EventEmitter);

function KakaocertService(config) {
    EventEmitter.call(this);

    this._config = config;
    this.ServiceID = 'KAKAOCERT';
    this.ServiceURL = 'kakaocert-api.linkhub.co.kr';

    if (this._config.IPRestrictOnOff != undefined){
      this.IPRestrictOnOff = this._config.IPRestrictOnOff;
    } else {
      this.IPRestrictOnOff = true;
    }

    if (this._config.UseLocalTimeYN != undefined){
      this._config.UseLocalTimeYN = this._config.UseLocalTimeYN;;
    } else {
      this._config.UseLocalTimeYN = true;
    }

    linkhub.initialize({
        LinkID: this._config.LinkID,
        SecretKey: this._config.SecretKey,
        UseLocalTimeYN: this._config.UseLocalTimeYN,
        AuthURL : this._config.AuthURL,
        defaultErrorHandler: this._config.defaultErrorHandler
    });

    this._Linkhub_Token_Cash = {};
    this._scopes = ['member','310','320','330'];
};


KakaocertService.addMethod = function (object, name, fn) {
    var old = object[name];
    object[name] = function () {
        if (fn.length == arguments.length)
            return fn.apply(this, arguments);
        else if (typeof old == 'function')
            return old.apply(this, arguments);
    };
}



KakaocertService.prototype._getToken = function (ClientCode, err) {

    var newToken = this._Linkhub_Token_Cash[ClientCode];
    var expired = true;
    var UTCTime = linkhub.getTime();

    if (typeof newToken === 'function') {
        var expiration = new Date(newToken(function () {
        }, err).expiration);

        if (expiration) {
            expired = Date.parse(UTCTime) > Date.parse(expiration);

        } else {
            expired = true;
        }
    }

    if (expired) {
        newToken = linkhub.newToken(this.ServiceID, ClientCode, this._getScopes(), this.IPRestrictOnOff ? null : '*');
        this._Linkhub_Token_Cash[ClientCode] = newToken;
    }

    return newToken;

};

KakaocertService.prototype._getScopes = function () {
    return this._scopes;
};


KakaocertService.prototype._executeAction = function (options) {
    var CRLF = '\r\n';

    if (!(options.Method)) options.Method = 'GET';

    var headers = {};
    var Token = function (callback) {
        callback(null);
    };

    if (options.ClientCode) {
        Token = this._getToken(options.ClientCode);
    }
    var _this = this;

    Token(function (token) {

      if(options.Method == 'POST') {
        var xDate = linkhub.getTime();
        headers['x-lh-date'] = xDate;
        var requestData = options.Data;

        var md5 = crypto.createHash('md5');
        md5.update(requestData);
        var bodyDigest = md5.digest('base64');

        var digestTarget =
          'POST\n' +
          bodyDigest + '\n' +
          xDate +'\n' +
          LINKHUB_API_VERSION + '\n';

        var hmac = crypto.createHmac('sha1',new Buffer(_this._config.SecretKey,'base64'));
        hmac.update(digestTarget);
        var digest = hmac.digest('base64');

        headers['x-lh-version'] = LINKHUB_API_VERSION;
        headers['x-kc-auth'] = _this._config.LinkID+' '+digest;
        headers['Content-Type'] = 'application/json;charset=utf-8';
      }

      if (token) headers['Authorization'] = 'Bearer ' + token.session_token;

      var requestOpt = {
          host: _this.ServiceURL,
          path: options.uri,
          method: options.Method == 'GET' ? 'GET' : 'POST',
          headers: headers
      }

      var req = _this._makeRequest(
          requestOpt,
          function (response) {
              if (options.success) options.success(response);
          },
          (typeof options.error === 'function') ? options.error : _this._config.defaultErrorHandler
      );

      if (options.Method != 'GET' && options.Data) {
        req.write(options.Data);
      }
      req.end();

    }, options.error);
};

KakaocertService.prototype._makeRequest = function (options, success, error) {

  if (this._config.ServiceURL == undefined || this._config.ServiceURL.includes("https")) {

    var request = http_tls.request(options,
        function (response) {
            var buf = new Buffer(0);
            //Gzip Compressed Response stream pipe
            if (response.headers['content-encoding'] == 'gzip') {
                var gzip = zlib.createGunzip();
                response.pipe(gzip);
                gzip.on('data', function (chunk) {
                    buf = Buffer.concat([buf, chunk]);
                });

                gzip.on('end', function () {
                    if (response.statusCode == '200') {
                        success(JSON.parse(buf));
                    }
                    else if (error) {
                        error(JSON.parse(buf));
                    }
                });
            } else {
                response.on('data', function (chunk) {
                    buf = Buffer.concat([buf, chunk]);
                });

                response.on('end', function () {
                    if (this.statusCode == '200') {
                        success(JSON.parse(buf));
                    }
                    else if (error) {
                        error(JSON.parse(buf));
                    }
                });
            }
        }
    );

    request.on('error', function (err) {
        if (err.code != 'ECONNRESET')
            console.error(err);
    });
    return request;

  } else {

    options.host = this._config.ServiceURL.substring(7, this._config.ServiceURL.lastIndexOf(":"));
    options.port = Number(this._config.ServiceURL.substring(this._config.ServiceURL.lastIndexOf(":")+1));

    var request = http_request.request(options,
        function (response) {
            var buf = new Buffer(0);
            //Gzip Compressed Response stream pipe
            if (response.headers['content-encoding'] == 'gzip') {
                var gzip = zlib.createGunzip();
                response.pipe(gzip);
                gzip.on('data', function (chunk) {
                    buf = Buffer.concat([buf, chunk]);
                });

                gzip.on('end', function () {
                    if (response.statusCode == '200') {
                        success(JSON.parse(buf));
                    }
                    else if (error) {
                        error(JSON.parse(buf));
                    }
                });
            } else {
                response.on('data', function (chunk) {
                    buf = Buffer.concat([buf, chunk]);
                });

                response.on('end', function () {
                    if (this.statusCode == '200') {
                        success(JSON.parse(buf));
                    }
                    else if (error) {
                        error(JSON.parse(buf));
                    }
                });
            }
        }
    );

    request.on('error', function (err) {
        if (err.code != 'ECONNRESET')
            console.error(err);
    });
    return request;

  }



};

KakaocertService.prototype._stringify = function (obj) {
    return JSON.stringify(obj, function (key, value) {
        return !value ? undefined : value;
    });
};

KakaocertService.prototype._throwError = function (Code, Message, err) {
    if (err)
        err({code: Code, message: Message});
    else if (typeof this._config.defaultErrorHandler === 'function')
        this._config.defaultErrorHandler({code: Code, message: Message});
};

KakaocertService.addMethod(KakaocertService.prototype, 'requestCMS', function(ClientCode, RequestCMS, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(Object.keys(RequestCMS).length === 0) {
    this._throwError(-99999999,'자동이체 출금동의 요청 정보가 입력되지 않았습니다.',error);
    return;
  }
  var postData = this._stringify(RequestCMS);

  this._executeAction({
    uri : '/SignDirectDebit/Request',
    ClientCode : ClientCode,
    Method : 'POST',
    Data : postData,
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'requestVerifyAuth', function(ClientCode, RequestVerifyAuth, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(Object.keys(RequestVerifyAuth).length === 0) {
    this._throwError(-99999999,'본인인증 요청정보가 입력되지 않았습니다.',error);
    return;
  }

  var postData = this._stringify(RequestVerifyAuth);

  this._executeAction({
    uri : '/SignIdentity/Request',
    ClientCode : ClientCode,
    Method : 'POST',
    Data : postData,
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'requestESign', function(ClientCode, RequestESign, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }
  if(Object.keys(RequestESign).length === 0) {
    this._throwError(-99999999,'간편 전자서명 요청정보가 입력되지 않았습니다.',error);
    return;
  }

  var postData = this._stringify(RequestESign);

  this._executeAction({
    uri : '/SignToken/Request',
    ClientCode : ClientCode,
    Method : 'POST',
    Data : postData,
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'getCMSState', function(ClientCode, ReceiptID, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignDirectDebit/Status/'+ReceiptID,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'verifyCMS', function(ClientCode, ReceiptID, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignDirectDebit/Verify/'+ReceiptID,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'verifyCMS', function(ClientCode, ReceiptID, Signature, success, error){

  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  if(!Signature || 0 === Signature.length) {
    this._throwError(-99999999,'서명값이 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignDirectDebit/Verify/'+ReceiptID+'/'+Signature,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'getVerifyAuthState', function(ClientCode, ReceiptID, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignIdentity/Status/'+ReceiptID,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'verifyAuth', function(ClientCode, ReceiptID, success, error){
  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignIdentity/Verify/'+ReceiptID,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'getESignState', function(ClientCode, ReceiptID, success, error){

  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignToken/Status/'+ReceiptID,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'verifyESign', function(ClientCode, ReceiptID, success, error){

  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignToken/Verify/'+ReceiptID,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});

KakaocertService.addMethod(KakaocertService.prototype, 'verifyESign', function(ClientCode, ReceiptID, Signature, success, error){

  if(!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999,'이용기관코드가 입력되지 않았습니다.',error);
    return;
  }

  if(!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999,'접수아이디가 입력되지 않았습니다.',error);
    return;
  }

  if(!Signature || 0 === Signature.length) {
    this._throwError(-99999999,'서명값이 입력되지 않았습니다.',error);
    return;
  }

  this._executeAction({
    uri : '/SignToken/Verify/'+ReceiptID+'/'+Signature,
    ClientCode : ClientCode,
    Method : 'GET',
    success : function(response){
      if(success) success(response);
    },
    error : error
  });
});
