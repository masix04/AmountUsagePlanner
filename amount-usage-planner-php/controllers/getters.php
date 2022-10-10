<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

$getters = new Getters();

$getters->setRequestMethod();
$getters->setType();
$getters->setKey();

$date = date('Y-m-d h:i:s');

$getters->getFromDatabase();

class Getters {
    private $request_Method;
    private $type;
    private $key;

    public function setType() {
        $this->type = $_GET['type'];
    }
    public function setKey() {
        $this->key = $_GET['key'];
    }

    public function getKey() {
        return $this->key;
    }
    public function getType() {
        return $this->type;
    }

    public function setRequestMethod() {
        $this->request_Method = $_SERVER['REQUEST_METHOD'];
    }
    public function getRequestMethod() {
        return $this->request_Method;
    }

    public function getFromDatabase() {
        $db = new DB_Query;

        if($this->type == 'amount') {
            $getSavedQuery = "SELECT `value` from `amount`";
        }
        else if($this->type == 'key_planned_percent' && $this->key != null) {
            $getSavedQuery = "SELECT `planned_percentage` from `save_plan` WHERE `key_name` = $this->key";
        }

        $getSavedData = $db->rawSQLQuery($getSavedQuery);

        $myArray = array();
        if ( !empty($getSavedData->num_rows) && $getSavedData->num_rows > 0) {
            while($row = $getSavedData->fetch_assoc()) {
                $myArray[] = $row;
            }

            $response['AmountPlanner']['Planned'] = $myArray;
            $response['message'] = 'Success';
            $response['code'] = 200;

            echo json_encode($response);
        }
        else
        {
            echo "0 results";
        }
    }
}

return;
