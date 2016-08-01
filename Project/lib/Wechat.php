<?php
require dirname(__FILE__).'/../common/tools.php';
require dirname(__FILE__).'/../config/wechatConfig.php';

class Wechat{
    public $dataObj;
    private $toUserName;
    private $fromUserName;
    private $time;
    public $accessToken;

    function __construct(){
        $this->accessToken = $this->getAccessToken(APP_ID,APPSECRET);
        $this->dataObj = simplexml_load_string(file_get_contents('php://input'),'SimpleXMLElement',LIBXML_NOCDATA);
    }

    /**
     * 验证微信服务器
     * @return bool
     */
    public function checkSignature(){
        $signature = $_GET['signature'];
        $timestamp = $_GET['timestamp'];
        $nonce = $_GET['nonce'];
        $echostr = $_GET['echostr'];
        $token = 'mrdai';

        $tmpArr = array($token,$timestamp,$nonce);
        sort($tmpArr,SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);

        if ($tmpStr === $signature){
            echo $echostr;
            return true;
        }
        return false;
    }

    /**
     * 获取access token
     * @param $appid
     * @param $appsecret
     * @return mixed
     */
    public function getAccessToken($appid,$appsecret){
        $path = dirname(__FILE__);
//        判断accessToken文件是否存在
        if (!file_exists($path.'/../data/access_token.json')){
//            获取accessToken并存入数据
            $data = json_decode(curl('get',"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret",null));
            $data->date = time();
            file_put_contents($path.'/../data/access_token.json',json_encode($data));
        }
        $data = json_decode(file_get_contents($path.'/../data/access_token.json'));
        if ((time() - $data->date) >= $data->expires_in){
//            获取accessToken并存入数据
            $data = json_decode(curl('get',"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret",null));
            $data->date = time();
            file_put_contents($path.'/../data/access_token.json',json_encode($data));
        }
        $data = json_decode(file_get_contents($path.'/../data/access_token.json'));
        return $data->access_token;
    }

    /**
     * 创建菜单
     * @param $data
     * @return mixed
     */
    public function createMenu($data){
        return curl('post',"https://api.weixin.qq.com/cgi-bin/menu/create?access_token=".$this->accessToken,$data);
    }

    /**
     * 发送文本消息
     * @param $content
     * @return string
     */
    public function sendTextMsg($content){
        $type = 'text';
        $this->toUserName = $this->dataObj->FromUserName[0];
        $this->fromUserName = $this->dataObj->ToUserName[0];
        $sendData =
            "<xml>
                <ToUserName><![CDATA[$this->toUserName]]></ToUserName>
                <FromUserName><![CDATA[$this->fromUserName]]></FromUserName>
                <CreateTime>$this->time</CreateTime>
                <MsgType><![CDATA[$type]]></MsgType>
                <Content><![CDATA[$content]]></Content>
             </xml>";
        echo $sendData;
        return $sendData;
    }

    /**
     * 发送图文信息
     * @param $contents
     * @return string
     */
    public function sendArticleMsg($contents){
        $type = 'news';
        $count = count($contents);
        $this->toUserName = $this->dataObj->FromUserName[0];
        $this->fromUserName = $this->dataObj->ToUserName[0];
        $sendData =
            "<xml>
                <ToUserName><![CDATA[$this->toUserName]]></ToUserName>
                <FromUserName><![CDATA[$this->fromUserName]]></FromUserName>
                <CreateTime>$this->time</CreateTime>
                <MsgType><![CDATA[$type]]></MsgType>
                <ArticleCount>$count</ArticleCount>
                <Articles>";
        foreach ($contents as $content){
            $title = $content->title;
            $description = $content->description;
            $picUrl = $content->picUrl;
            $url = $content->url;
            $sendData .=
                "<item>
                   <Title><![CDATA[$title]]></Title>
                   <Description><![CDATA[$description]]></Description>
                   <PicUrl><![CDATA[$picUrl]]></PicUrl>
                   <Url><![CDATA[$url]]></Url>
                 </item>";
        }
        echo '';
        $sendData .=
            "</Articles>
                </xml>";
        echo $sendData;
        return $sendData;
    }

    /**
     * 获取用户基本信息
     * @param $openid
     * @return mixed
     */
    public function getUserinfo($openid){
        $url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$this->accessToken."&openid=$openid&lang=zh_CN";
        return curl('get',$url,null);
    }
}
