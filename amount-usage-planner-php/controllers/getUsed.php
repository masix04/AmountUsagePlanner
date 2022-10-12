<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";
// include "getPlanned.php";

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

        $getUsedquery = "SELECT am.month, ua.amount_id, sp.`id`, sp.`key_name`,sp.`planned_percentage`,
                                          SUM(ua.`used_amount`) AS `used_amount`
                                          , SUM(ua.`used_percentage`) AS `used_percentage`
                                          , sp.`planned_percentage` - IF(SUM(ua.`used_percentage`), SUM(ua.`used_percentage`), 0) AS `remaining_percentage`
                                      FROM save_plan sp
                                      RIGHT JOIN used_amount ua ON ua.`key_id` = sp.`id`
                                      LEFT JOIN amount am ON am.id = ua.`amount_id`
                                      GROUP BY ua.amount_id, sp.id
                                      ORDER BY ua.amount_id,sp.id";

        $getUsed = $db->rawSQLQuery($getUsedquery);

        $myArray = array();
        if ( !empty($getUsed->num_rows) && $getUsed->num_rows > 0) {
            while($row = $getUsed->fetch_assoc()) {
                $myArray[] = $row;
            }

            $myArray = $this->formatData($myArray);

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

    /** Data fromatted, Which got from Database */
    public function formatData($data) {

        $amount_id = $data[0]['amount_id'];
        // $eachIndex = 0;
        $innerIndex = 0;
        foreach($data as $key => $item) {
            if($key == 0 || $amount_id == $item['amount_id']) {
                $final_array[$item['month']][$innerIndex]['id'] = $item['id'];
                $final_array[$item['month']][$innerIndex]['key_name'] = $item['key_name'];
                $final_array[$item['month']][$innerIndex]['planned_percentage'] = $item['planned_percentage'];
                $final_array[$item['month']][$innerIndex]['used_amount'] = $item['used_amount'];
                $final_array[$item['month']][$innerIndex]['used_percentage'] = $item['used_percentage'];
                $final_array[$item['month']][$innerIndex]['remaining_percentage'] = $item['remaining_percentage'];
                $final_array[$item['month']][$innerIndex]['amount_id'] = $item['amount_id']; /** It is Repeating, Because Not handeling in Front-edn YET  */
                $innerIndex++;
            }
            else if($amount_id != $item['amount_id']) {
                $amount_id = $item['amount_id'];
                // $eachIndex++;
                $innerIndex = 0;
            }
        }

        return $final_array;
    }
}

return;
