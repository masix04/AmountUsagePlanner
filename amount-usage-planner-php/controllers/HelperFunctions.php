<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";

class HelperFunctions {

  public function check100PERCENTAGE($db, $edit_value = 0)
  {
    // echo $edit_value."\n";
      $CHECK_100_PERCENTAGE_Query = "SELECT SUM(`planned_percentage`) as total_percentage FROM save_plan";
      // echo "\n".$CHECK_100_PERCENTAGE_Query."\n";
      $CHECK_100_PERCENTAGE = $db->rawSQLQuery($CHECK_100_PERCENTAGE_Query);
      while($row = mysqli_fetch_assoc($CHECK_100_PERCENTAGE)) {
        if(($row['total_percentage'] - $edit_value) == 100) {
            echo 'Plan completed';
            return false;
        } else if(($row['total_percentage'] - $edit_value) < 100) {
            echo 'Plan not completed';
            return true;
        } else { // If Unexpectedly Percentage went beyond 100%
            echo 'View Plan & Correct it As soon As Possible';
            return false;
        }
      }
  }
}
