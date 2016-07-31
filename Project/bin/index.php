<?php
require __DIR__.'/fun.php';
require __DIR__.'/sql.php';
require __DIR__.'/Wechat.php';


function event($wechat,$sql){
    $toUserName = $wechat->dataObj->FromUserName;
    $time = time();
    $activeUsers = array();

    switch (trim($wechat->dataObj->Event[0])){

        //    关注事件
        case 'subscribe':
            $wechat->sendTextMsg("php大法好！！！");

            //    将用户加入数据库
            $sqlCommand = "INSERT INTO wechat.users (openid, active) VALUES ('$toUserName',0);";
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

                    if ($result['active'] === '0'){
                        $updateCommand = "UPDATE users SET active=1 ,activeDate=$time WHERE openid='$toUserName'&&active=0;";
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

                    if ($result['active'] === '1'){
                        $updateCommand = "UPDATE users SET active=0,activeDate=null WHERE openid='$toUserName'&&active=1;";
                        $sql->command($updateCommand);
                        $wechat->sendTextMsg("你退出了活动");
                        $userData = curl('get',"https://api.weixin.qq.com/cgi-bin/user/info?access_token=".ACCESS_TOKEN."&openid=".$result['openid']."&lang=zh_CN",null);
                    }else{
                        $wechat->sendTextMsg("不要重复退出活动");
                    }
                    break;
                case 'vote':
                    $redirectUri = urlencode('http://120.26.53.25/wechat/vote.php');
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
}



event(new Wechat(),new sql('120.26.53.25','root','root','wechat'));
