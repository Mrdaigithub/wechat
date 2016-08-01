<?php
require dirname(__FILE__).'/../common/tools.php';
require dirname(__FILE__).'/../lib/Sql.php';
require dirname(__FILE__).'/../lib/Wechat.php';

$wechat = new Wechat();
$sql = new Sql();
$toUserName = $wechat->dataObj->FromUserName;
$activeUsers = array();

switch (trim($wechat->dataObj->Event[0])){

    //    关注事件
    case 'subscribe':
        $wechat->sendTextMsg("php大法好！！！");

        //    将用户加入数据库
        $sqlCommand = "INSERT INTO wechat.users (openid) VALUES ('$toUserName');";
        $sql->command($sqlCommand);
        break;

//        取消关注事件
    case 'unsubscribe':
//            //将用户从数据库中删除
        $sqlCommand = "DELETE FROM users WHERE openid='$toUserName';";
        $sql->command($sqlCommand);
        break;

//        按钮点击事件
    case 'CLICK':
        switch (trim($wechat->dataObj->EventKey[0])){
            case 'signIn':
//                    点击参加活动按钮
                $sqlCommand = "SELECT * FROM users WHERE openid='$toUserName';";
                $result = $sql->query($sqlCommand)[0];

                if ($result['activeDate'] === null){
                    $updateCommand = "UPDATE users SET activeDate=".time()." WHERE openid='$toUserName'";
                    $sql->command($updateCommand);
                    $wechat->sendTextMsg("你加入了活动");
                    $userInfo = json_decode($wechat->getUserinfo(ACCESS_TOKEN,$result['openid']));
                }else{
                    $wechat->sendTextMsg("不要重复加入活动");
                }
                break;
            case 'signOut':
//                    点击退出活动
                $sqlCommand = "SELECT * FROM users WHERE openid='$toUserName';";
                $result = $sql->query($sqlCommand)[0];

                if ($result['activeDate'] !== null){
                    $updateCommand = "UPDATE users SET activeDate=null WHERE openid='$toUserName';";
                    $sql->command($updateCommand);
                    $wechat->sendTextMsg("你退出了活动");
                }else{
                    $wechat->sendTextMsg("不要重复退出活动");
                }
                break;
            case 'vote':
                $redirectUri = urlencode('http://120.26.53.25/wechat/Project/core/vote.php');
                $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".APP_ID."&redirect_uri=$redirectUri&response_type=code&scope=snsapi_base#wechat_redirect";
                $contents =
                    '[
                        {
                        "title":"投出世界上最好的语言！！！",
                        "description":"投出世界上最好的语言",
                        "picUrl":"http://o7qephszd.bkt.clouddn.com/wechatVote.jpg",
                        "url":"'.$url.'"
                        }
                        ]';
                $wechat->sendArticleMsg(json_decode($contents));
                break;
        }
        break;

    default:
        echo '';
}
