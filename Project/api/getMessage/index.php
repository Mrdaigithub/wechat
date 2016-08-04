<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Sql.php';

$sql = new Sql();

$currData = json_decode(file_get_contents('php://input'));
while (true){
    $nowDatas = $sql->query("SELECT openid FROM message;");
    if ($currData !== count($nowDatas)){
        $sendData = array();
//        通过openid找到所有发言用户的信息，构建一个json对象
        $openids = $sql->query("SELECT DISTINCT openid FROM message;");
        $userInfos = array();
        foreach ($openids as $openid){
            $openid = $openid['openid'];
            $arr = $sql->query("SELECT nickname,headImgUrl FROM users WHERE openid='".$openid."';");
            $userInfos["$openid"] = $arr;
        }

//        获取消息和openid
        $msgs = $sql->query("SELECT openid,content FROM message ORDER BY date DESC;");

//        通过openid获取用户头像nickname
        foreach ($msgs as $msg){
            $openid = $msg['openid'];
            $userInfo = $userInfos["$openid"][0];
            $arr = array();
            $arr['nickname'] = $userInfo['nickname'];
            $arr['headImgUrl'] = $userInfo['headImgUrl'];
            $arr['content'] = $msg['content'];
            array_push($sendData,$arr);
        }
//        构建完成
        echo json_encode($sendData);
        break;
    }
    sleep(1);
}
