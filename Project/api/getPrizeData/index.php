<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Sql.php';

//获取奖品的数据
$sql = new sql();
$selectCommand = 'SELECT * FROM prize;';
$results = $sql->query($selectCommand);
echo json_encode($results);
