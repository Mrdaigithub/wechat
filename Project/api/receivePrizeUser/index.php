<?php
require dirname(__FILE__).'/../../common/cross.php';
require dirname(__FILE__).'/../../lib/Sql.php';

$datas = json_decode(file_get_contents('php://input'));
$sql = new Sql();
foreach ($datas as $data){
    $updateCommand = "UPDATE users SET prizeId='".$data->prizeid."' WHERE openid='".$data->openid."';";
    $sql->command($updateCommand);
}
