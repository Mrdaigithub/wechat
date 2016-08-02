<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Wechat.php';
require dirname(__FILE__).'/../../lib/Sql.php';

$sql = new Sql();
$wechat = new Wechat();
$datas = $sql->query('SELECT openid,content FROM message ORDER BY date DESC ;');
$result = [];
for ($i=0; $i<count($datas); $i++){
    $userInfo = json_decode($wechat->getUserinfo($datas[$i]['openid']));
    if ($userInfo->headimgurl === '') $userInfo->headimgurl = 'http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png';
    $result[$i]['nickname'] = $userInfo->nickname;
    $result[$i]['headimgurl'] = $userInfo->headimgurl;
    $result[$i]['content'] = $datas[$i]['content'];
}
echo json_encode($result);
