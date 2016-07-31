<?php
require __DIR__.'/fun.php';
require __DIR__.'/sql.php';
//获取页面的openid
$code = $_GET['code'];
$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".APP_ID."&secret=".APPSECRET."&code=$code&grant_type=authorization_code";
$data = json_decode(curl('get',$url,null));
$userOpenId = $data->openid;
$sql = new sql('120.26.53.25','root','root','wechat');
$queryCommand = "SELECT voted FROM users WHERE openid='".$userOpenId."';";
$votedStatus = $sql->query($queryCommand);
if ($votedStatus[0]['voted'] === '1'){
    exit('你投过票了');
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <title>选出好语言</title>
    <link rel="stylesheet" href="css/normal.css">
    <link rel="stylesheet" href="css/vote.css">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="text-center">
<header>
    <img src="http://o7qephszd.bkt.clouddn.com/wechatVote.jpg" alt="vote">
    <h1>选出好语言</h1>
    <small>选出好语言</small>
</header>
<main>
    <p>总共有<i>13</i>人投票</p>
    <div class="form">
        <label for="php">php</label><input id="php" name="language" type="radio"><br>
        <label for="java">java</label><input id="java" name="language" type="radio"><br>
        <label for="c++">c++</label><input id="c++" name="language" type="radio"><br>
        <label for="javascript">javascript</label><input id="javascript" name="language" type="radio"><br>
        <input type="button" id="btn" value="提交">
    </div>
</main>
<script src="//cdn.bootcss.com/jquery/2.2.4/jquery.min.js"></script>
<?php
echo "<script>
    (function (DOC) {
        let btn = DOC.querySelector('#btn');
        btn.addEventListener('click',function () {
            let input = DOC.querySelectorAll('input');
            for (let i=0; i<input.length-1; i++){
                if (input[i].checked){
                    let postData = {
                        openid: '".$userOpenId."',
                        language: input[i].id
                    };
                    $.ajax({
                        type: 'POST',
                        url: 'http://120.26.53.25/wechat/saveVote.php',
                        data: JSON.stringify(postData),
                        success: function(){
                            DOC.body.innerHTML = '投票成功！！';
                        }
                    });
                }
            }
        },false);
    })(document);
</script>";
?>
</body>
</html>