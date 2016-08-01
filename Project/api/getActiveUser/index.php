<?php
require dirname(__FILE__).'/../../common/cross.php';
//require dirname(__FILE__).'/../../common/tools.php';
require dirname(__FILE__).'/../../lib/Sql.php';
require dirname(__FILE__).'/../../lib/Wechat.php';

/**
 * 获取加入活动的用户头像url和nickname
 * @param $wechat
 */
function getUserActiveStatus($wechat){
    $datas = array();
    $sql = new sql('120.26.53.25','root','root','wechat');
    $selectCommand = 'SELECT openid FROM users WHERE activeDate REGEXP \'\d?\' ORDER BY activeDate DESC ;';
    $results = $sql->query($selectCommand);
    foreach ($results as $result){
        $userInfo = json_decode($wechat->getUserinfo($result['openid']));
        $arr = array('openid'=>$result['openid'],'nickname'=>$userInfo->nickname,'headimgurl'=>$userInfo->headimgurl);
        array_push($datas,$arr);
    }
    echo json_encode($datas);
}

getUserActiveStatus(new Wechat());
