<?php

require __DIR__.'/../ajaxSetting.php';
require __DIR__.'/../../sql.php';

/**
 * 获取加入活动的用户头像url和nickname
 * @param $wechat
 */
function getPrize(){
    $sql = new sql('120.26.53.25','root','root','wechat');
    $selectCommand = 'SELECT * FROM prize;';
    $results = $sql->query($selectCommand);
    echo json_encode($results);
}
getPrize();
