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
  var result = '알아듣지 못했습니다.';

  //console.log(req.body.action);

  // intent : 하고자 하는 의도
  // 1) what : 개념 설명
  // 2) different : 차이점 설명
  // 3) error : 뭐가 안될 떄
  // 4) how : 어떻게 해야 하는 지에 대한 설명
  // 5) etc : 기타 등등
  if(intent == "what"){
    var payment = req.body.action.params['payment'];
    switch(payment){
      case '링크결제':
        result = '링크결제는 생성된 결제링크를 여러 번 사용할 수 있는 기능입니다.\n'
               + '원격결제로 사용 중인 1회성의 결제링크와 달리, 하나의 링크로 여러 건의 결제를 계속해서 받을 수 있습니다.\n'
               + '* 원격결제 - 결제 완료시 해당 링크는 더이상 사용 할 수 없음\n'
               + '* 링크결제 - 하나의 링크로 여러 건의 결제를 계속해서 받을 수 있음\n';
        break;

      case '원격결제':
        result = '원격결제는 주문 시 입력한 구매자의 휴대폰번호로 결제링크를 SMS형태로 전송하여 구매자가 결제링크를 통해 '
               + '결제하는 결제방식입니다.\n';
        break;

      default:
        //result = "알아듣지 못했습니다."
        break;
    }

  }else if(intent == "different"){
    var payment = req.body.action.params['payment'];
    var payment2 = req.body.action.params['payment2'];

    if( (payment == "원격결제" && payment2 == "링크결제") || (payment == "링크결제" && payment2 == "원격결제") ){
      result = '링크결제는 결제링크를 생성해서 SNS(블로그, 카페, 페이스북, 카카오톡 단체톡방)에 포스팅하여 '
              + '여러번 결제를 받을 수 있는 서비스입니다.\n'
              + '반복사용이 가능한 링크이며, 다양한 결제옵션과 구매자가 메모나 배송주소를 입력할수있는 기능이 제공됩니다.\n'
              + '원격결제는 1회용 결제링크로, 고객에게 청구서 형태로 전달할 수 있으며 1회 결제가 완료되면 더이상 사용하실 수 없습니다.\n';
    }

  }else if(intent == "error"){
    var payment = req.body.action.params['payment'];

    switch(payment){
      case 'NFC결제':
        result = '페이앱라이트로 신용카드/체크카드를 결제할때 NFC기능을 켜달라는 메시지가 보인다면 '
                + '스마트폰의 환경설정에서 NFC 모드를 기본모드로 설정하면 됩니다. NFC 카드모드는 동작하지 않습니다.\n\n'
                + '[방법1]\n'
                + '스마트폰 맨 위 상단을 아래로 스와이프(손가락을 아래방향으로 움직이세요)\n'
                + 'NFC 마크를 눌러 기본모드로 변경\n'
                + '[방법2]\n'
                + '스마트폰 설정메뉴 > 연결 > NFC및 결제를 기본모드로 변경\n\n'
                + '한번만 변경하시면 계속 사용이 가능합니다.\n';
        break

      case '삼성페이':
        result = '폰2폰 결제로 삼성페이 결제를 받을때 휴대폰 단말을 서로 맞대면 화면공유 메시지가 나오는 경우가 있습니다.\n'
                + '이는 안드로이드빔(Android Beam) 기능이 켜져있을때 발생되며, 환경설정에서 안드로이드빔(Android Beam)을 off 하시면 '
                + '해결할 수 있습니다.\n'
                + '[ 설정 > 연결 > NFC및결제 > Adroid Beam 사용안함 ]\n'
                + '판매자 단말만 설정하면 되며, 구매자 단말은 설정변경이 필요없습니다.\n';

      default:
        break;
    }

  }else if(intent == "how"){
    var payment = req.body.action.params['payment'];

    switch(payment){
      case '결제취소':
        result = '결제가 완료된 경우 결제현황>결제완료탭>결제상세 화면에서 결제취소(또는 결제취소요청) 버튼을 통해 취소할 수 있습니다.\n'
                + '정산이 완료된 경우 결제취소 시 본사에 정산받은 금액을 입력한 후 승인취소가 가능합니다.\n';
        break;

      default:
        break;
    }

  }else if(intent == "etc"){
    var etc = req.body.action.params['etc'];

    switch(etc){
      case '판매점':
        result = '페이앱라이트는 사용 시 별도의 계약이 필요하지 않습니다.\n'
                + '판매자는 페이앱라이트를 설치 및  로그인 후 결제받기 버튼을 통하여 고객에게 결제를 받을 수 있습니다.\n';
        break;

      default:
        break;
    }
  }

  console.log(result);

  let data = new kakaoEmbed();
  data.addText(result);

  res.status(200).send(data.output());
});


// question_receipt : 영수증 관련된 문의 사항 처리
apiRouter.post('/question_receipt', function(req, res) {
  // 카카오 오픈빌더 question스킬에 등록된 'contexts' 파라미터를 post방식으로 가져옴.
  var intent = req.body.action.params['intent'];
  var result = '알아듣지 못했습니다.';

  //console.log(req.body.action);

  if(intent == "how"){
    var receipt = req.body.action.params['receipt'];
    var about_receipt = req.body.action.params['about_receipt'];  // 발행인지? (필수 파라미터는 아님)

    switch(receipt){
      case "현금영수증":
        result = '개인회원(비사업자)은 현금영수증 발행이 불가합니다.\n'
                + '현금영수증 발행을 위해서는 페이앱에서 사업자 등록이 필요합니다.\n'
                + '페이앱 바로가기 : http://payappnfc.co.kr\n';
        break;

      default:
        break;
    }
  }

  console.log(result);

  let data = new kakaoEmbed();
  data.addText(result);

  res.status(200).send(data.output());
});


// 서버 실행
app.listen(3000, function() {
  console.log('Example skill server listening on port 3000!');
});