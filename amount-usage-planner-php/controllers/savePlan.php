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

/** Variables Declaration */

$date = date('Y-m-d h:i:s');
$month = date('F');
$year = date('Y');
$previousYear = date('Y', strtotime("-365 days"));
$nextMonth = date('F', strtotime("+30 days"));


$db = new DB_Query;
$SAVE_PLAN_CHECK = false;


function check100PERCENTAGE($db) {
    $CHECK_100_PERCENTAGE_Query = "SELECT SUM(`planned_percentage`) as total_percentage FROM save_plan";
    // echo "\n".$CHECK_100_PERCENTAGE_Query."\n";
    $CHECK_100_PERCENTAGE = $db->rawSQLQuery($CHECK_100_PERCENTAGE_Query);
    while($row = mysqli_fetch_assoc($CHECK_100_PERCENTAGE)) {
      // print_r($row);
      if($row['total_percentage'] == 100) {
          echo 'Plan completed';
          return false;
      } else if($row['total_percentage'] < 100) {
          echo 'Plan not completed';
          return true;
      } else { // If Unexpectedly Percentage went beyond 100%
          echo 'View Plan & Correct it As soon As Possible';
          return false;
      }
      // $CHECK_100 =
    }
}

function formatArray($key_name, $plan_percentage, $SAVE_PLAN_CHECK, $savePlanTableDataCount=0) {

        /** Only Save 'Planned-data' if 1st Time Saving OR Any Change Received */
      if($SAVE_PLAN_CHECK == true) {
                  $dataArray['save_plan'][] =
                      1 . ','
                      . '"' . $key_name . '",'
                      . $plan_percentage ;
      } else {
        $dataArray['save_plan'][] =
            ($savePlanTableDataCount+1) . ','
            . '"' . $key_name . '",'
            . $plan_percentage ;
      }

    // print_r($dataArray);
    feedToDatabase($dataArray);
}

function feedToDatabase($finalArray) {
  $db = new DB_Query;
  $globals = array(
      'save_plan' => array(
          'keys' => '`id`,`key_name`,`planned_percentage`',
          'duplicates' => '`id`=VALUES(`id`),`planned_percentage`=VALUES(`planned_percentage`)',
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

    $key_name = $array['key_name'];
    $plan_percentage = $array['planned_percentage'];

    // echo($plan_percentage.' - '. $key_name);
    // echo($amount . ' --- ' . $amount_type);
}

// echo $request_Method;
// print_r($plan_percentage);




/** LIKE MAIN Function => Work Starts From Below Here   */


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

    /** Check for Update/Edit */
    if($save_planCount != 0) {
        /** CHECK and Get COUNT of Data if 'key_name' is already exist in DataBase. */
        $getExistedPlannedDataCountQuery = "SELECT count(*) FROM `save_plan` WHERE `key_name` = '".$key_name."'";
        // echo $getExistedPlannedDataCountQuery."\n";
        $getExistedPlannedDataCount = $db->rawSQLQuery($getExistedPlannedDataCountQuery);

        while($row = mysqli_fetch_assoc($getExistedPlannedDataCount)) {
          // echo "\n2";
          // print_r($row);
            $EDIT_planCount = $row['count(*)'];
            // print_r($EDIT_planCount);
            if($EDIT_planCount != 0) { /** Means 'key_name' is already saved in 'save_Plan' Table */

                $UPDATEPlannedDataQuery = "UPDATE `save_plan` SET `planned_percentage` = $plan_percentage WHERE `key_name` = '".$key_name."'";
                // echo $UPDATEPlannedDataQuery;
                $UPDATEPlannedData  =$db->rawSQLQuery($UPDATEPlannedDataQuery);
                echo "\nData updated";
                return true;
            } else { /** Means 'key_name' doesn't exist in Database and their is a possibility where data saves like another Key */

                /** SO, we thought we should check for Total Percentage Too. [TO LIMIT PLANNED-KEYS till % below OR equal to 100] */
                /** Check For Percentage ->  showuld be Below 100% If went Above then Donot save Furthur, And Notify User To view Created Plan */
                $CHECK_GET_100 = check100PERCENTAGE($db);
            }
        }
    }

    /** CHECKING; If 100_%_CHECK says either [= 100% ] or [> 100% ] means FALSE, then donot save Data  */
    if($CHECK_GET_100 == true) {
        /** If savePlan Check is true => means 1st time plan item is going to save */
        if($SAVE_PLAN_CHECK == true) {
            formatArray($key_name, $plan_percentage, $SAVE_PLAN_CHECK);
        }
        else { /** Means Already some items are in it, So either It will Add another OR update Previous One */
            formatArray($key_name, $plan_percentage, $SAVE_PLAN_CHECK, $save_planCount);
        }
    }


return $array;
