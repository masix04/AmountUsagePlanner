<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";
// include "getPlanned.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

$get_amount = new GetAmount;

$get_amount->setRequestMethod();
$get_amount->getData();
$get_amount->getAmountFromDatabase();

$date = date('Y-m-d h:i:s');

class GetAmount {
    private $request_Method;
    private $data_array;

    public function setRequestMethod() {
        $this->request_Method = $_SERVER['REQUEST_METHOD'];
    }
    public function getRequestMethod() {
        return $this->request_Method;
    }

    public function getData() {
        if($this->request_Method == 'POST') {
            /**
             *  $_POST[]  Not Working Here => So Using Shown Below
             * */
            $json = file_get_contents('php://input');
            $this->data_array = json_decode($json, true);
        }
        else {}
    }

    public function getAmountFromDatabase() {
        $db = new DB_Query;

        $getUsedquery = "SELECT * from `amount`";

        $getUsed = $db->rawSQLQuery($getUsedquery);

        $myArray = array();
        if ( !empty($getUsed->num_rows) && $getUsed->num_rows > 0) {
            while($row = $getUsed->fetch_assoc()) {
                $myArray[] = $row;
            }

            $response['Amount']['data'] = $myArray;
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
