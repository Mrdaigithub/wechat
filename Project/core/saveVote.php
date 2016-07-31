<?php
require __DIR__.'/sql.php';
$data = json_decode(file_get_contents('php://input'));
$openid = $data->openid;
$language = $data->language;
$sql = new sql('120.26.53.25','root','root','wechat');

//添加用户的选择
$updateCommand = "UPDATE users SET voted=1, likeLead='".$language."' WHERE openid='".$openid."'&&voted=0;";
$sql->command($updateCommand);
$quertCommand = "SELECT num FROM vote WHERE lead='".$language."';";
$num = $sql->query($quertCommand)[0]['num'];
$num++;
$voteUpdateCommand = "UPDATE vote SET num=$num WHERE lead='".$language."';";
$sql->command($voteUpdateCommand);