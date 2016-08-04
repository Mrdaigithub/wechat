<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Sql.php';

//获取加入活动的用户头像url和nickname,openid
$sql = new sql();
$data = array();
$selectCommand = 'SELECT * FROM users WHERE prizeId=0 && activeDate IS NOT NULL ;';
$results = $sql->query($selectCommand);
foreach ($results as $result){
    $arr = array();
    $arr['openid'] = $result['openid'];
    $arr['nickname'] = $result['nickname'];
    $arr['headImgUrl'] = $result['headImgUrl'];
    array_push($data,$arr);
}
echo json_encode($data);
