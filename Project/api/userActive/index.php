<?php
header("Access-Control_allow_Origin:*");
//require __DIR__.'/../ajaxSetting.php';
require __DIR__.'/../../fun.php';
require __DIR__.'/../../sql.php';
require __DIR__.'/../../Wechat.php';

/**
 * 获取加入活动的用户头像url和nickname
 * @param $wechat
 */
function getUserActiveStatus($wechat){
    $datas = array();
    $sql = new sql('120.26.53.25','root','root','wechat');
    $selectCommand = 'SELECT openid FROM users WHERE active=1 ORDER BY activeDate DESC ;';
    $results = $sql->query($selectCommand);
    foreach ($results as $result){
        $userInfo = json_decode($wechat->getUserinfo(ACCESS_TOKEN,$result['openid']));
        $arr = array('openid'=>$result['openid'],'nickname'=>$userInfo->nickname,'headimgurl'=>$userInfo->headimgurl);
        array_push($datas,$arr);
    }
    echo json_encode($datas);
}

getUserActiveStatus(new Wechat());
