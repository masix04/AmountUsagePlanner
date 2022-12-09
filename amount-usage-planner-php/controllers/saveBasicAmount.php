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

$date = date('Y-m-d h:i:s');
$month = date('F');
$year = date('Y');
$previousYear = date('Y', strtotime("-365 days"));
$nextMonth = date('F', strtotime("+30 days"));


function formatArray($amount_type, $amountCount, $amount, $month, $year, $plan_percentage, $SAVE_PLAN_CHECK) {

    $dataArray['amount'][] =
      ($amountCount+1) . ','
      . '"' . $amount_type . '",'
      . '"' . $month . '",'
      . $year . ','
      . $amount ;

        /** Only Save 'Planned-data' if 1st Time Saving OR Any Change Received */
      if($SAVE_PLAN_CHECK == true) {
          foreach($plan_percentage as $key => $value) {
              // echo $key . "\n";
              // print_r($value); echo "\n";
              foreach($value as $c_key => $chuck) {
                  // echo $c_key. "\n";
                  // echo $chuck. "\n";
                  $dataArray['save_plan'][] =
                      ($key+1) . ','
                      . '"' . $c_key . '",'
                      . $chuck ;
              }
          }
      }

    print_r($dataArray);
    feedToDatabase($dataArray);
}

function feedToDatabase($finalArray) {
  $db = new DB_Query;
  $globals = array(
      'amount' => array(
          'keys' => '`id`,`type`,`month`,`year`,`value`',
          'duplicates' => '`type`=VALUES(`type`),`month`=VALUES(`month`),`year`=VALUES(`year`),`value`=VALUES(`value`)',
      )
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
  // print_r($check);
  if($check==null) {
      return false;
  }
  return true;
}

// echo '123';
$request_Method = $_SERVER['REQUEST_METHOD'];

if($request_Method == 'POST') {
    // echo 'POST REQUEST';
    $json = file_get_contents('php://input');
    $array = json_decode($json, true);

    $amount = $array['amount'];
    $amount_month = $array['month'];
    $amount_year = $array['year'];
    $amount_type = $array['amount_type'];

    // print_r($plan_percentage);
    // echo($amount . ' --- ' . $amount_type);
}

// echo $request_Method;
// print_r($plan_percentage);



/** LIKE MAIN Function => Work Starts From Below Here   */


$db = new DB_Query;
$SAVE_PLAN_CHECK = false;

// $checkEachMonthAmountSaveQuery = "SELECT count(*) `count` FROM amount WHERE `month` = MONTHNAME(CURDATE()) AND `year` = YEAR(CURDATE()) ";
$checkEachMonthAmountSaveQuery = "SELECT count(*) `count` FROM amount WHERE `month` = '". $amount_month ."' AND `year` = " . $amount_year . " ";
// echo $checkEachMonthAmountSaveQuery;
$checkEachMonthAmountSave = $db->rawSqlQuery($checkEachMonthAmountSaveQuery);

while($row = mysqli_fetch_assoc($checkEachMonthAmountSave)) {
    $monthAmountCount = $row['count'];
}

if($monthAmountCount == 1) {
    echo "This Month ".$month."'s and Year ".$year."'s Amount has already been saved.\n Use *Edit Option* If Provided. ";
    return;
} else {
    echo 'Saving the Amount for Month '.$month;
    /** IF Found then No need to SAVE Data Again -
     *   The option Edit Amount for Specific Month will / May be Provided
     **/

    /** get DB planned Length & compare it with the Data WHich has been recieved from VUE */
    $getPlannedDataCountQuery = "SELECT count(*) `count` from `save_plan`";
    $getPlannedDataCount = $db->rawSQLQuery($getPlannedDataCountQuery);
    $save_planCount = 0;
    while($row = mysqli_fetch_assoc($getPlannedDataCount)) {
        $save_planCount = $row['count'];
        if($save_planCount == 0) {
            $SAVE_PLAN_CHECK = true; /** THIS is for the First time When no Save_plan has Stored */
        }
    }

    $getAmountsCountQuery = "SELECT count(*) `count` from `amount`";
    $getAmountsCount = $db->rawSQLQuery($getAmountsCountQuery);
    $amountCount = 0;
    while($row = mysqli_fetch_assoc($getAmountsCount)) {
        $amountCount = $row['count'];
    }

    /** Just For 1 User */
    // if($amountCount == 0) {
        formatArray($amount_type, $amountCount, $amount, $amount_month, $amount_year, $plan_percentage, $SAVE_PLAN_CHECK);
    // }
}


return $array;
