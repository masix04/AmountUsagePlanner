<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

$get_used = new GetUsed;

$get_used->setRequestMethod();
$get_used->getData();
$get_used->getUsedFromDatabase();

$date = date('Y-m-d h:i:s');

class GetUsed {
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

    public function getUsedFromDatabase() {
        $db = new DB_Query;

        $getUsedquery = "SELECT sp.`id`, sp.`key_name`,sp.`planned_percentage`,
                                          SUM(ua.`used_amount`) AS `used_amount`
                                          , SUM(ua.`used_percentage`) AS `used_percentage`
                                          , sp.`planned_percentage` - IF(SUM(ua.`used_percentage`), SUM(ua.`used_percentage`), 0) AS `remaining_percentage`
                                      FROM save_plan sp
                                      LEFT JOIN used_amount ua ON ua.`key_id` = sp.`id`
                                      GROUP BY sp.`id`";

        $getUsed = $db->rawSQLQuery($getUsedquery);

        $myArray = array();
        if ( !empty($getUsed->num_rows) && $getUsed->num_rows > 0) {
            while($row = $getUsed->fetch_assoc()) {
                $myArray[] = $row;
            }

            $response['AmountPlanner']['Used']['data'] = $myArray;
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
