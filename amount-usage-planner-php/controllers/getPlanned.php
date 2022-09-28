<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

$request_Method = $_SERVER['REQUEST_METHOD'];

if($request_Method == 'POST') {
    /**
     *  $_POST[]  Not Working Here => So Using Shown Below
     * */
    $json = file_get_contents('php://input');
    $array = json_decode($json, true);
}

$date = date('Y-m-d h:i:s');

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

return;
