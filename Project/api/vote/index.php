<?php

require __DIR__.'/../ajaxSetting.php';
require __DIR__.'/../../sql.php';

//获取对象和票数
function getVote(){
    $sql = new sql('120.26.53.25','root','root','wechat');
    $selectCommand = 'SELECT lead,num FROM vote ;';
    $results = $sql->query($selectCommand);
    echo json_encode($results);
}

getVote();
