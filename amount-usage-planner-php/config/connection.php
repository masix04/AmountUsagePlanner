<?php

require_once "config.php";

class DB {

    function  openConnection() {
        $connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME) or die();

        return true;
    }
}

