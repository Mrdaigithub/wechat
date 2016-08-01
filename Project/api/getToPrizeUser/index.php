<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Sql.php';
require dirname(__FILE__).'/../../lib/Wechat.php';

/**
 * 获取加入活动的用户头像url和nickname,accesstoken
 * @param $wechat
 */
$wechat = new Wechat();
$sql = new sql();
$datas = array();
$selectCommand = 'SELECT * FROM users WHERE prizeId=0 && activeDate IS NOT NULL ;';
$results = $sql->query($selectCommand);
foreach ($results as $result){
    $userInfo = json_decode($wechat->getUserinfo($result['openid']));
    $arr = array('openid'=>$result['openid'],'nickname'=>$userInfo->nickname,'headimgurl'=>$userInfo->headimgurl);
    array_push($datas,$arr);
}
echo json_encode($datas);
