<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

$request_Method = $_SERVER['REQUEST_METHOD'];

if($request_Method == 'GET') {

    $type = $_GET['type'];
    $key = $_GET['key'];
    // echo($type . ' --- ' . $key);

}

$date = date('Y-m-d h:i:s');

$db = new DB_Query;

if($type == 'amount') {
    $getSavedQuery = "SELECT `value` from `amount`";
}
else if($type == 'key_planned_percent' && $key != null) {
    $getSavedQuery = "SELECT `planned_percentage` from `save_plan` WHERE `key_name` = $key";
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

return;
