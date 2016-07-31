<?php
class sql{
    private $servername;
    private $username;
    private $password;
    private $conn;

    function __construct($sName,$uName,$pw,$dbName){
        $this->servername = $sName;
        $this->username = $uName;
        $this->password = $pw;
        $this->dataBaseName = $dbName;

//        链接数据库
        try{
            $conn = new PDO("mysql:host=".$this->servername.";dbname=".$this->dataBaseName,$this->username,$this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn = $conn;
        }catch (PDOException $e){
            echo $e->getMessage();
        }
    }

    function __destruct(){
//        关闭连接
        $this->conn = null;
    }

    /**
     * 自定义命令模式
     * @param $sqlCommand
     * @return mixed
     */
    public function command($sqlCommand){
        try{
            $this->conn->exec($sqlCommand);
        }catch (PDOException $e){
            file_put_contents('z.txt',$e->getMessage());
        }
    }

    /**
     * 查询数据
     * @param $sqlCommand
     * @return mixed
     */
    public function query($sqlCommand){
        $stmt = $this->conn->prepare($sqlCommand);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        return $stmt->fetchAll();
    }
}