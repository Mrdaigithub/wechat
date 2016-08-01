<?php

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
