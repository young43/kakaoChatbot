const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
// https://github.com/jaewon4492/kakaoEmbed 오픈소스 라이브러리 참고
const kakaoEmbed = require('./lib/kakaoEmbed');


const apiRouter = express.Router();

app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use('/api', apiRouter);


// 실제 스킬이 들어가는 부분.
// question_payment : 결제 관련된 문의사항 처리
apiRouter.post('/question_payment', function(req, res) {
  // 카카오 오픈빌더 question스킬에 등록된 'contexts' 파라미터를 post방식으로 가져옴.
  var intent = req.body.action.params['intent'];
  var result = null;
  var tmp = "";

  let data = new kakaoEmbed();
  data.addText("이해하지 못했습니다.");
  result = data.output();

  // intent : 하고자 하는 의도
  // 1) what : 개념 설명
  // 2) error : 뭐가 안될 떄
  // 3) how : 어떻게 해야 하는 지에 대한 설명
  // 4) etc : 기타 등등
  if(intent == "what"){
    var context = req.body.action.params['context'];

    switch(context){
      case '링크결제':
        tmp = '링크결제는 생성된 결제링크를 여러 번 사용할 수 있는 기능입니다.\n'
               + '원격결제로 사용 중인 1회성의 결제링크와 달리, 하나의 링크로 여러 건의 결제를 계속해서 받을 수 있습니다.\n'
               + '* 원격결제 - 결제 완료시 해당 링크는 더이상 사용 할 수 없음\n'
               + '* 링크결제 - 하나의 링크로 여러 건의 결제를 계속해서 받을 수 있음\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      case '원격결제':
        tmp = '원격결제는 주문 시 입력한 구매자의 휴대폰번호로 결제링크를 SMS형태로 전송하여 구매자가 결제링크를 통해 '
               + '결제하는 결제방식입니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      case '링크결제원격결제':
        tmp = '링크결제는 결제링크를 생성해서 SNS(블로그, 카페, 페이스북, 카카오톡 단체톡방)에 포스팅하여 '
              + '여러번 결제를 받을 수 있는 서비스입니다.\n'
              + '반복사용이 가능한 링크이며, 다양한 결제옵션과 구매자가 메모나 배송주소를 입력할수있는 기능이 제공됩니다.\n'
              + '원격결제는 1회용 결제링크로, 고객에게 청구서 형태로 전달할 수 있으며 1회 결제가 완료되면 더이상 사용하실 수 없습니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();

      default:
        break;
    }

  }else if(intent == "error"){
    var context = req.body.action.params['context'];

    switch(context){
      case 'NFC결제':
        tmp = '페이앱라이트로 신용카드/체크카드를 결제할때 NFC기능을 켜달라는 메시지가 보인다면 '
                + '스마트폰의 환경설정에서 NFC 모드를 기본모드로 설정하면 됩니다. NFC 카드모드는 동작하지 않습니다.\n\n'
                + '[방법1]\n'
                + '스마트폰 맨 위 상단을 아래로 스와이프(손가락을 아래방향으로 움직이세요)\n'
                + 'NFC 마크를 눌러 기본모드로 변경\n'
                + '[방법2]\n'
                + '스마트폰 설정메뉴 > 연결 > NFC및 결제를 기본모드로 변경\n\n'
                + '한번만 변경하시면 계속 사용이 가능합니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break

      case '삼성페이':
        tmp = '폰2폰 결제로 삼성페이 결제를 받을때 휴대폰 단말을 서로 맞대면 화면공유 메시지가 나오는 경우가 있습니다.\n'
                + '이는 안드로이드빔(Android Beam) 기능이 켜져있을때 발생되며, 환경설정에서 안드로이드빔(Android Beam)을 off 하시면 '
                + '해결할 수 있습니다.\n'
                + '[ 설정 > 연결 > NFC및결제 > Adroid Beam 사용안함 ]\n'
                + '판매자 단말만 설정하면 되며, 구매자 단말은 설정변경이 필요없습니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      default:
        break;
    }

  }else if(intent == "how"){
    var context = req.body.action.params['context'];

    switch(context){
      case '결제취소':
        tmp = '결제가 완료된 경우 결제현황>결제완료탭>결제상세 화면에서 결제취소(또는 결제취소요청) 버튼을 통해 취소할 수 있습니다.\n'
                + '정산이 완료된 경우 결제취소 시 본사에 정산받은 금액을 입력한 후 승인취소가 가능합니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      case '출금계좌변경':
        tmp = '결제대금의 출금 계좌는 반드시 국내은행의 실명 확인된 계좌로 한정됩니다.(임의 변경불가)\n'
                + '판매자가 출금 계좌를 변경 요청시에는, 콜센터를 통한 상담 및 본인확인 서류를 통한 확인이 완료 되어야만 가능하며, '
                + '온라인 신청은 불가능합니다.\n';

        data = new kakaoEmbed();
        data.addBasicCard()
            .setCardDescription(tmp)
            .addCardButton('문의 전화 하기', { action: 'phone', phoneNumber: '1800-3772' });

        result = data.output();
        break;

      default:
        break;
    }

  }else if(intent == "etc"){
    var context = req.body.action.params['context'];

    switch(context){
      case '판매점':
        tmp = '페이앱라이트는 사용 시 별도의 계약이 필요하지 않습니다.\n'
                + '판매자는 페이앱라이트를 설치 및  로그인 후 결제받기 버튼을 통하여 고객에게 결제를 받을 수 있습니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      default:
        break;
    }
  }

  //console.log(result);

  res.status(200).send(result);
});


// question_receipt : 영수증 관련된 문의 사항 처리
apiRouter.post('/question_receipt', function(req, res) {
  // 카카오 오픈빌더 question스킬에 등록된 'contexts' 파라미터를 post방식으로 가져옴.
  var intent = req.body.action.params['intent'];
  var result = null;
  var tmp = "";

  //console.log(req.body.action);
  let data = new kakaoEmbed();
  data.addText("이해하지 못했습니다.");
  result = data.output();

  if(intent == "how"){
    var context = req.body.action.params['context'];
    console.log(context);


    switch(context){
      case "현금영수증발급":
        tmp = '개인회원(비사업자)은 현금영수증 발행이 불가합니다.\n'
              + '현금영수증 발행을 위해서는 페이앱에서 사업자 등록이 필요합니다.\n';

        data = new kakaoEmbed();
        data.addBasicCard()
            .setCardDescription(tmp)
            .addCardButton('페이앱 바로가기', { action: 'webLink', webLinkUrl: 'http://payappnfc.co.kr' });

        result = data.output();
        break;

      case "취소영수증발급":
        tmp = '결제완료건에 대해  결제취소 진행 후 결제현황>결제취소탭>결제상세 화면에서 영수증 출력 버튼을 통해 '
                + '조회 및 발급이 가능합니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;


      case "영수증발급":
        tmp = '구매자가 영수증을 받는 방법은 아래와 같이 두가지가 있습니다.\n'
                + '[방법1]\n'
                + ' 결제완료 후 결제확인 화면에서 구매자의 휴대폰번호 입력 후 보내기 버튼을 통해 구매자에게 결제전표링크를 '
                + 'SMS로 전송할 수 있습니다.\n'
                + '[방법2]\n'
                + '  결제완료 후 결제현황>결제완료탭>결제상세 화면에서 영수증출력 버튼을 통해 구매자에게 결제전표링크를 '
                + 'SMS로 전송할 수 있습니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      default:
        break;
    }
  }

  //console.log(result);

  res.status(200).send(result);
});


// question_fee : 수수료 관련된 문의 사항 처리
apiRouter.post('/question_fee', function(req, res) {
  // 카카오 오픈빌더 question스킬에 등록된 'contexts' 파라미터를 post방식으로 가져옴.
  var intent = req.body.action.params['intent'];
  var result = null;
  var tmp = "";

  //console.log(req.body.action);
  let data = new kakaoEmbed();
  data.addText("이해하지 못했습니다.");
  result = data.output();


  if(intent == "what"){
    var context = req.body.action.params['context'];


    switch(context){
      case "결제수수료":
        tmp = "PAYAPP Lite에 등록하신 개인(비사업자)회원의 경우 4% 수수료가 일률로 적용됩니다.(VAT 별도)\n";

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      default:
        break;
    }

  }else if(intent == "how"){
    var context = req.body.action.params['context'];

    switch(context){
      case "수수료절감":
        tmp = 'PAYAPP Lite에 등록하신 개인(비사업자)회원의 경우 4% 수수료가 일률로 적용됩니다.\n'
              + '사업자의 경우 매출규모에 따라 수수료가 차등 적용됩니다.\n'
              + '사업자 등록 후 PAYAPP 서비스를 통해 수수료를 절감해 보세요.\n';

        data = new kakaoEmbed();
        data.addBasicCard()
            .setCardDescription(tmp)
            .addCardButton('페이앱 바로가기', { action: 'webLink', webLinkUrl: 'http://payappnfc.co.kr' })

        result = data.output();
        break;

      default:
        break;
    }
  }

  //console.log(result);

  res.status(200).send(result);
});


// question_calculate : 정산 관련된 문의 사항 처리
apiRouter.post('/question_calculate', function(req, res) {
  // 카카오 오픈빌더 question스킬에 등록된 'contexts' 파라미터를 post방식으로 가져옴.
  var intent = req.body.action.params['intent'];
  var result = null;
  var tmp = "";

  //console.log(req.body.action);
  let data = new kakaoEmbed();
  data.addText("이해하지 못했습니다.");
  result = data.output();

  if(intent == "what"){
    var context = req.body.action.params['context'];


    switch(context){
      case "정산일자":
        tmp = '구매자의 카드 결제 후 익일부터 영업일로 5일째 되는날 정산(입금)이 진행됩니다.\n'
            + '주말,공휴일이 포함된 경우 해당 일수 만큼 정산일이 미뤄집니다.\n';

        data = new kakaoEmbed();
        data.addText(tmp);
        result = data.output();
        break;

      default:
        break;
    }

  }
  //console.log(result);

  res.status(200).send(result);
});


// question_etc : 기타 관련된 문의 사항 처리
apiRouter.post('/question_etc', function(req, res) {
  // 카카오 오픈빌더 question스킬에 등록된 'contexts' 파라미터를 post방식으로 가져옴.
  var intent = req.body.action.params['intent'];
  var result = null;
  var tmp = "";

  //console.log(req.body.action);
  let data = new kakaoEmbed();
  data.addText("이해하지 못했습니다.");
  result = data.output();

  if(intent == "what"){
    var context = req.body.action.params['context'];


    switch(context){
      case "유의업종":
        tmp = '이용에 제한이 있는 업종의 경우 아래 URL에서 확인이 가능합니다.\n'

        data = new kakaoEmbed();
        data.addBasicCard()
            .setCardDescription(tmp)
            .addCardButton('유의업종 리스트', { action: 'webLink', webLinkUrl: 'https://www.payapplite.com/faq?detailType=ETC' })

        result = data.output();
        break;

      default:
        break;
    }

  }else if(intent == "how"){
    var context = req.body.action.params['context'];


    switch(context){
      case "사업자전환":
        tmp = '개인에서 사업자로 변경은 불가능하며 신규 가입만 가능합니다.\n'
              + '사업자의 경우 매출규모에 따라 수수료가 차등 적용됩니다.\n'
              + '사업자 등록 후 PAYAPP 서비스를 통해 수수료를 절감해 보세요.\n';

        data = new kakaoEmbed();
        data.addBasicCard()
            //.setCardTitle('사업자전환')
            .setCardDescription(tmp)
            .addCardButton('페이앱 바로가기', { action: 'webLink', webLinkUrl: 'http://payappnfc.co.kr' })

        result = data.output();
        break;

      default:
        break;
    }

  }
  //console.log(result);

  res.status(200).send(result);
});



// 서버 실행
app.listen(3000, function() {
  console.log('Example skill server listening on port 3000!');
});