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

    $key_id = $array['key_id'];
    $used_amount = $array['used_amount'];
    $UpdateData_month = $array['UpdateData_month'];
    $UpdateData_year = $array['UpdateData_year'];

    // print_r($plan_percentage);
    // echo($key_id . ' --- ' . $used_amount);
}

// echo $request_Method;
// print_r($plan_percentage);

$date = date('Y-m-d h:i:s');

$db = new DB_Query;

/** Brings Total Amount and Planned Pecentage for the Item_key , User has SELECTED and Send to server from WEB */
$getPlannedPercentQuery = "SELECT amount.`id`,amount.`value`,`planned_percentage` FROM `save_plan`,`amount`
                          WHERE save_plan.`id` = $key_id AND `month` = '$UpdateData_month' AND `year` = $UpdateData_year";
// echo $getPlannedPercentQuery."\n";
$getPlannedPercent = $db->rawSQLQuery($getPlannedPercentQuery);

while($row = mysqli_fetch_assoc($getPlannedPercent)) {
    $amountId = $row['id'];
    $totalAmount = $row['value'];
    $plannedPercent = $row['planned_percentage'];
}

// echo "\n totalAmount: ". $totalAmount . "\n plannedPercentage: " . $plannedPercent."\n Amount Id: ".$amountId. "\n";

    $used_percentage = getUsedPercentage($used_amount, $plannedPercent, $totalAmount);
    // echo 'used_percent: '.$used_percentage."\n";

    $remaining_precent = ($plannedPercent - $used_percentage);
    // echo 'remain_percent: '.$remaining_precent."\n";

    formatArray($key_id, $used_amount, $used_percentage, $amountId);

    function formatArray($key_id, $used_amount, $used_percentage, $amountId) {

        $dataArray['used_amount'][] =
            $key_id . ','
            . $used_amount . ','
            . $used_percentage . ','
            . $amountId ;

        // print_r($dataArray);
        feedToDatabase($dataArray);
    }

    function feedToDatabase($finalArray) {
        $db = new DB_Query;
        $globals = array(
            'used_amount' => array(
                'keys' => '`key_id`,`used_amount`,`used_percentage`,`amount_id`',
                'duplicates' => '`key_id`=VALUES(`key_id`),`used_amount`=VALUES(`used_amount`),`used_percentage`=VALUES(`used_percentage`),`amount_id`=VALUES(`amount_id`)',
            ),
        );
        foreach($finalArray as $table_name => $data) {

            if(sizeof($data) > 1) {
                /** To furthure make indexeses  */
                foreach($data as $single_data) {
                  echo "INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}"."\n";
                  $check[$table_name] = $db->rawSQLQuery("INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}");
                }

            } else {
                echo "INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}"."\n";
                $check[$table_name] = $db->rawSQLQuery("INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $data[0] . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}");
            }

        }
        print_r($check);
        if($check==null) {
            return false;
        }
        return true;
    }

    /** Calculate used Percentage Against Amount */
    function getUsedPercentage($used_amount, $plannedPercent, $totalAmount) {
        return $used_percentage = (($used_amount / $totalAmount) * 100);
    }

return $array;
