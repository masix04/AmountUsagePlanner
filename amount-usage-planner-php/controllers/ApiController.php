<?php

include('config/connection.php');

$request_Method = $_SERVER['REQUEST_METHOD'];

$date = date('Y-m-d h:i:s');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

Class APIController
{ 
    public function save_usage_plan() {
        if($request_Method == 'POST') {
            $planData = $_POST['plan_data'];
        }
        return $this->returnResponse(200, $planData, 'data');
    }

    public function save_spent_usage() {

    }

    /** If used  */
    public function get() {
        $db->rawSQLQuery($AddToTransactionDetails_query);
        /**NOTE: 
         *  Geeting Data from the form tof Object to Needed items. Using MYSQL Function.
         */
        while($row = mysqli_fetch_assoc($dataCount)) {
            $dbDataCount = $row['count'];
        }
        echo "ERROR => ". $AddToTransactionDetails_query."<br>".$conn->error;
    }
    private function returnResponse($code, $data, $message) {
        $content = ['status' => $code, 'message' => $message, 'result'=> $data];
        return response()->json($content, 200);
    }
}