var kakaocert = require('./');

kakaocert.config({
    LinkID :'TESTER',
    SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',
    defaultErrorHandler :  function(Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var kakaocertService = kakaocert.KakaocertService();

var requestCMS = {
    BankCode : '004',
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19900108',
    ReceiverHP : '01012341234',
    ReceiverName : '테스트',
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

kakaocertService.getCMSResult('020040000001', '020050616403400001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

var requestVerifyAuth = {
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19900108',
    ReceiverHP : '01012341234',
    ReceiverName : '테스트',
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


kakaocertService.getVerifyAuthResult('020040000001', '020050617020000001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });


var requestESign = {
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19900108',
    ReceiverHP : '01012341234',
    ReceiverName : '테스트',
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

kakaocertService.getESignResult('020040000001', '020050617035400001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });


var requestESign = {
    CallCenterNum : '1600-8536',
    Expires_in : 60,
    ReceiverBirthDay : '19800108',
    ReceiverHP : '010111222',
    ReceiverName : '테스트',
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

kakaocertService.getESignResult('020040000001', '020083111121200001', 'abcd',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });
