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

$save_used = new SaveUsed();

$save_used->setRequestMethod();
$save_used->getRequestData();
$save_used->getAmountDataFromDatabase();

class SaveUsed {

  private $requestMethod;

  private $amountId;
  private $totalAmount;
  private $plannedPercentage;

  private $key_id;
  private $used_percentage;
  private $UpdateData_month;
  private $UpdateData_year;

  private $remaining_precent;

  public function setRequestMethod()
  {
    $this->request_Method = $_SERVER['REQUEST_METHOD'];
  }

  public function getRequestMethod()
  {
    return $this->requestMethod;
  }

//-------

  public function setAmountId($amount_id)
  {
    $this->amountId = $amount_id;
  }
  public function setTotalAmount($total_amount)
  {
    $this->totalAmount = $total_amount;
  }
  public function setplannedPercentage($planned_percentage)
  {
    $this->plannedPercentage = $planned_percentage;
  }

  public function getAmountId()
  {
    return $this->amountId;
  }
  public function getTotalAmount()
  {
    return $this->totalAmount;
  }
  public function getplannedPercentage()
  {
    return $this->plannedPercentage;
  }

//----------

  public function setKeyId($key_id)
  {
    $this->key_id = $key_id;
  }

  public function getKeyId()
  {
    return $this->key_id;
  }

  public function setUsedPercentage($used_percentage)
  {
    $this->used_percentage = $used_percentage;
  }

  public function getUsedPercentage()
  {
    return $this->used_percentage;
  }

  public function setMonth($month)
  {
    $this->UpdateData_month = $month;
  }

  public function getMonth()
  {
    return $this->UpdateData_month;
  }

  public function setYear($year)
  {
    $this->UpdateData_year = $year;
  }

  public function getYear()
  {
    return $this->UpdateData_year;
  }

  //----------
  public function setRemainPercentage($remain_percentage)
  {
    $this->remaining_precent = $remain_percentage;
  }
  public function getRemainPercentage()
  {
    return $this->remaining_precent;
  }
  //----------

  public function getRequestData()
  {
    if($this->request_Method == 'POST') {
      $json = file_get_contents('php://input');
      $array = json_decode($json, true);

      $this->setKeyId($array['key_id']);
      $this->setUsedPercentage($array['used_percentage']);
      $this->setMonth($array['UpdateData_month']);
      $this->setYear($array['UpdateData_year']);
    }
  }

  public function getAmountAgainstPercentage()
  {
    // assume amount is 25000
    $used_amount = ($this->getUsedPercentage()/100) * $this->getTotalAmount();
    return $used_amount;
  }

  public function formatArray()
  {
    $dataArray['used_amount'][] =
        $this->getKeyId() . ','
        . $this->getAmountAgainstPercentage() . ','
        . $this->getUsedPercentage() . ','
        . $this->getAmountId() ;

    $this->feedToDatabase($dataArray);
  }

  public function feedToDatabase($finalArray)
  {
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
            // echo "INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}"."\n";
            $check[$table_name] = $db->rawSQLQuery("INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}");
          }

      } else {
          // echo "INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $single_data . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}"."\n";
          $check[$table_name] = $db->rawSQLQuery("INSERT INTO `$table_name` ({$globals[$table_name]['keys']}) VALUES (" . $data[0] . ") ON DUPLICATE KEY UPDATE {$globals[$table_name]['duplicates']}");
      }

    }
    print_r($check);
    if($check==null || empty($check)) {
        return false;
    }
    return true;
  }

  public function getAmountDataFromDatabase()
  {
    $db = new DB_Query;
    $keyId = $this->getKeyId();
    $month = $this->getMonth();
    $year = $this->getYear();

    /** Brings Total Amount and Planned Pecentage for the Item_key , User has SELECTED and Send to server from WEB */
    $getPlannedPercentQuery = "SELECT amount.`id`,amount.`value`,`planned_percentage` FROM `save_plan`,`amount`
                              WHERE save_plan.`id` = $keyId AND `month` = '$month' AND `year` = $year";

    $getPlannedPercentData = $db->rawSQLQuery($getPlannedPercentQuery);

    while($row = mysqli_fetch_assoc($getPlannedPercentData)) {
        $this->setAmountId($row['id']);
        $this->setTotalAmount($row['value']);
        $this->setPlannedPercentage($row['planned_percentage']);
    }

    $this->setRemainPercentage( ($this->getplannedPercentage() - $this->getUsedPercentage()) );
    // echo "\n Remianing %: ".$this->getRemainPercentage();

    // echo "\n AmountId: ".$this->getAmountId()."\n totalAmount: ".$this->getTotalAmount()."\n Planned%: ".$this->getPlannedPercentage()."\n";

    $this->formatArray();
  }

// echo "\n totalAmount: ". $totalAmount . "\n plannedPercentage: " . $plannedPercent."\n Amount Id: ".$amountId. "\n";

    // echo 'remain_percent: '.$remaining_precent."\n";
}

