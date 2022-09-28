<?php

include_once "config.php";
// include_once "connection.php";

class DB_Query {
    var $connection;

    // function open(){

    //     // Create connection
    //     $this->conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

    //     // Check connection
    //     if ($this->conn->connect_error) {
    //         die("Connection failed: " . $conn->connect_error);
    //     }
    // }

    function  openConnection() {
        $this->connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME) or die();

        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }

        return true;
    }
    function rawSQLQuery($query) {
        $this->openConnection();

        $result = mysqli_query($this->connection,$query);
        return $result;
    }
}
