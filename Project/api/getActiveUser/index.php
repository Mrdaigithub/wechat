<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Sql.php';

//获取加入活动的用户 openid 头像url和nickname
$currData = json_decode(file_get_contents('php://input'));
$sql = new sql();
$getOpenidCommand = "SELECT openid FROM users WHERE activeDate IS NOT NULL ORDER BY activeDate DESC ;";
while (true){
    $nowData = count($sql->query($getOpenidCommand));
    if ($currData !== $nowData){
        $result = $sql->query("SELECT openid,nickname,headImgUrl FROM users WHERE activeDate IS NOT NULL ORDER BY activeDate DESC ;");
        echo json_encode($result);
        break;
    }
    sleep(1);
}
