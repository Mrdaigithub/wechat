<?php
require dirname(__FILE__).'/../config/sqlConfig.php';
class Sql{
    private $serverName = SERVER_NAME;
    private $username = USERNAME;
    private $password = PASSWORD;
    private $dbName = DATABASE_NAME;
    private $conn;

    function __construct(){
        $this->linkSql();
    }

    function __destruct(){
        $this->closeSql();
    }

    /**
     * 链接数据库
     */
    public function linkSql(){
        try{
            $conn = new PDO("mysql:host=".$this->serverName.";dbname=".$this->dbName,$this->username,$this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn = $conn;
        }catch (PDOException $e){
            echo $e->getMessage();
        }
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
            echo $e->getMessage();
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

    /**
     * 关闭连接
     */
    private function closeSql(){
        $this->conn = null;
    }
}
