var kakaocert = require('./');

kakaocert.config({
    LinkID :'TESTER',
    SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',
    //AuthURL : 'http://192.168.0.228:9080',
    //ServiceURL : 'http://192.168.0.228:9081',
    defaultErrorHandler :  function(Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var kakaocertService = kakaocert.KakaocertService();

var requestCMS = {
    BankCode : '004',
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19800101',
    ReceiverHP : '010111222',
    ReceiverName : '홍길동',
    BankAccountName : '예금주명',
    BankAccountNum : '9-4324-5**7-58',
    BankCode : '004',
    ClientUserID : 'clientUserID-0423-01',
    SubClientID : '020040000001',
    TMSMessage : 'TMSMessage0423',
    TMSTitle : 'TMSTitle 0423',
    isAllowSimpleRegistYN : true,
    isVerifyNameYN : true,
    PayLoad : 'Payload123',
};

kakaocertService.requestCMS('020040000001', requestCMS,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

kakaocertService.getCMSState('020040000001', '020090913390400001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

kakaocertService.verifyCMS('020040000001', '020090913390400001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

var requestVerifyAuth = {
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19800101',
    ReceiverHP : '010111222',
    ReceiverName : '홍길동',
    SubClientID : '020040000001',
    TMSMessage : 'TMSMessage0423',
    TMSTitle : 'TMSTitle 0423',
    isAllowSimpleRegistYN : true,
    isVerifyNameYN : true,
    Token : 'Token Value 2345',
    PayLoad : 'Payload123',
};

kakaocertService.requestVerifyAuth('020040000001', requestVerifyAuth,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

kakaocertService.getVerifyAuthState('020040000001', '020090913401100001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

kakaocertService.verifyAuth('020040000001', '020090913401100001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });



var requestESign = {
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19800101',
    ReceiverHP : '010111222',
    ReceiverName : '홍길동',
    SubClientID : '020040000001',
    TMSMessage : 'TMSMessage0423',
    TMSTitle : 'TMSTitle 0423',
    isAllowSimpleRegistYN : true,
    isVerifyNameYN : true,
    Token : 'Token Value 2345',
    PayLoad : 'Payload123',
};

kakaocertService.requestESign('020040000001', requestESign,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

kakaocertService.getESignState('020040000001', '020090913412000001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

kakaocertService.verifyESign('020040000001', '020090913412000001','1234',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });


var requestESign = {
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19800101',
    ReceiverHP : '010111222',
    ReceiverName : '홍길동',
    SubClientID : '',
    TMSMessage : 'TMSMessage0423',
    TMSTitle : 'TMSTitle 0423',
    isAllowSimpleRegistYN : true,
    isVerifyNameYN : true,
    Token : 'Token Value 2345',
    PayLoad : 'Payload123',
    isAppUseYN : true,
};

kakaocertService.requestESign('020040000001', requestESign,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });
