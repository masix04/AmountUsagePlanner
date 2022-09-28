<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

$request_Method = $_SERVER['REQUEST_METHOD'];

$date = date('Y-m-d h:i:s');


// Class APIController
// {
    // function save_usage_plan() {
      echo 'save_usage_plan received.';
        $planData = [];
        if($request_Method == 'POST') {
            $planData = $_POST['plan_percentage'];
        }
        return $planData;
    // }

    // function save_spent_usage() {

    // }
    // function getPlannedValues() {
    //     return returnResponse(200, ['data' => 'Success'], 'Dummy Data');
    // }

    // /** If used  */
    // function get() {
    //     $db->rawSQLQuery($AddToTransactionDetails_query);
    //     /**NOTE:
    //      *  Geeting Data from the form tof Object to Needed items. Using MYSQL Function.
    //      */
    //     while($row = mysqli_fetch_assoc($dataCount)) {
    //         $dbDataCount = $row['count'];
    //     }
    //     echo "ERROR => ". $AddToTransactionDetails_query."<br>".$conn->error;
    // }
    // function returnResponse($code, $data, $message) {
    //     $content = ['status' => $code, 'message' => $message, 'result'=> $data];
    //     return response()->json($content, 200);
    // }
// }
