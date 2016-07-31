<?php

//access token
define('ACCESS_TOKEN','hMQz7atNPxMsPN0sEbpQvDCainaMYBEqgkyZ8uct5v6qfxfdf07WamwSBB6DjIlY6wBrkvtZgECnl4PKUUWbZ57OBBbV612irCh70hOEHyHag4_wtHVRf9M8D22Yr8x_DXAeABALFI');
//appID
define('APP_ID','wx344ba4da84bb6782');
//appsecret
define('APPSECRET','e8f48ca9bc91a0cbdecac5341d090951');
//菜单数据
define('MENU_DATA','{
     "button":[
      {
           "name":"产品介绍",
           "sub_button":[
           {	
               "type":"view",
               "name":"微信大屏幕",
               "url":"http://www.soso.com/"
            },
            {
               "type":"view",
               "name":"微信连wifi",
               "url":"http://www.soso.com/"
            }]
       },
       {
           "name":"微信大屏幕",
           "sub_button":[
           {	
               "type":"click",
               "name":"大屏签到",
               "key":"signIn"
            },
            {	
               "type":"click",
               "name":"竞选组长",
               "key":"leader"
            },
            {	
               "type":"click",
               "name":"投票",
               "key":"vote"
            },
            {	
               "type":"click",
               "name":"摇一摇",
               "key":"shake"
            },
            {
               "type":"click",
               "name":"推出活动",
               "key":"signOut"
            }]
       },
       {
           "name":"关于我们",
           "type":"view",
           "url":"https://www.github.com";
       }]
 }');


/**
 * 用curl发起GET or POST 请求获取数据
 * @param $method
 * @param $url
 * @param $data
 * @return mixed
 */
function curl($method,$url,$data){
    $ch = curl_init($url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    if ($method==='post' || $method==='POST'){
        curl_setopt($ch,CURLOPT_POST,1);
        curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
    }
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}
