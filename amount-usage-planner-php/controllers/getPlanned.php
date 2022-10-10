<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

$date = date('Y-m-d h:i:s');

$getPlanned = new GetPlanned;
$getPlanned->setRequestMethod();
$getPlanned->getData();
$getPlanned->getPlannedFromDatabase();

class GetPlanned {
    private $request_Method;

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

    public function getPlannedFromDatabase() {
        $db = new DB_Query;

        $getDBTableDataCount_query = "SELECT * from `save_plan`";
        $plannedDataExists = $db->rawSQLQuery($getDBTableDataCount_query);

        $myArray = array();
        if ( !empty($plannedDataExists->num_rows) && $plannedDataExists->num_rows > 0) {
            while($row = $plannedDataExists->fetch_assoc()) {
                $myArray[] = $row;
            }

            $response['AmountPlanner']['Planned']['data'] = $myArray;
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
