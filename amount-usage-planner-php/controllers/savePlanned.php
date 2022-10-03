<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// include "../config/db_class.php";

// // header('Access-Control-Allow-Methods: POST');
// header('Content-Type : application/json');
// header('Cache-Control: no-cache');

require_once "../config/db_class.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

// echo '123';
$request_Method = $_SERVER['REQUEST_METHOD'];

if($request_Method == 'POST') {
    // echo 'POST REQUEST';
    $json = file_get_contents('php://input');
    $array = json_decode($json, true);

    $plan_percentage = $array['plan_percentage'];
    $amount = $array['amount'];
    $amount_type = $array['amount_type'];

    // print_r($plan_percentage);
    // echo($amount . ' --- ' . $amount_type);
}

// echo $request_Method;
// print_r($plan_percentage);

$date = date('Y-m-d h:i:s');

$db = new DB_Query;

/** get DB planned Length & compare it with the Data WHich has been recieved from VUE */
$getPlannedDataCountQuery = "SELECT count(*) `count` from `save_plan`";
$getPlannedDataCount = $db->rawSQLQuery($getPlannedDataCountQuery);

if($getPlannedDataCount != count($plan_percentage)) {
    $RemovePrevious = $db->rawSQLQuery('DELETE from `amount`');
}

$getAmountsCountQuery = "SELECT count(*) `count` from `amount`";
$getAmountsCount = $db->rawSQLQuery($getAmountsCountQuery);
$amountCount = 0;
while($row = mysqli_fetch_assoc($getAmountsCount)) {
    $amountCount = $row['count'];
}

/** Just For 1 User */
if($amountCount == 0) {
    formatArray($amount_type, $amountCount, $amount, $plan_percentage);
}
    function formatArray($amount_type, $amountCount, $amount, $plan_percentage) {

        $dataArray['amount'][] =
            ($amountCount+1) . ','
            . '"' . $amount_type . '",'
            . '"' . date('F') . '",'
            . date('Y') . ','
            . $amount ;

        foreach($plan_percentage as $key => $value) {
            // echo $key . "\n";
            // print_r($value); echo "\n";
            foreach($value as $c_key => $chuck) {
                // echo $c_key. "\n";
                // echo $chuck. "\n";
                $dataArray['save_plan'][] =
                    ($amountCount+1) . ','
                    . ($key+1) . ','
                    . '"' . $c_key . '",'
                    . $chuck ;
            }
        }
        // print_r($dataArray);
        feedToDatabase($dataArray);
    }

    function feedToDatabase($finalArray) {
        $db = new DB_Query;
        $globals = array(
            'amount' => array(
                'keys' => '`id`,`type`,`month`,`year`,`value`',
                'duplicates' => '`type`=VALUES(`type`),`month`=VALUES(`month`),`year`=VALUES(`year`),`value`=VALUES(`value`)',
            ),
            'save_plan' => array(
                'keys' => '`amount_id`,`id`,`key_name`,`planned_percentage`',
                'duplicates' => '`id`=VALUES(`id`),`key_name`=VALUES(`key_name`),`planned_percentage`=VALUES(`planned_percentage`)',
            ),
        );
        foreach($finalArray as $table_name => $data) {

            if(sizeof($data) > 1) {
                /** To furthure make indexeses  */
                foreach($data as $single_data) {
                  // echo "INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}"."\n";
                  $check[$table_name] = $db->rawSQLQuery("INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}");
                }

            } else {
                // echo "INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}"."\n";
                $check[$table_name] = $db->rawSQLQuery("INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $data[0] . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}");
            }

        }
        print_r($check);
        if($check==null) {
            return false;
        }
        return true;
    }
return $array;
