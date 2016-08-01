<?php

//微信 appID
define("APP_ID","wx344ba4da84bb6782");

//微信 appsecret
define("APPSECRET","e8f48ca9bc91a0cbdecac5341d090951");

//微信 Token
define("Token","mrdai");

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