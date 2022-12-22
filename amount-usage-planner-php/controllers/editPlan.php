<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "../config/db_class.php";
require_once "./HelperFunctions.php";

date_default_timezone_set('Asia/Karachi');// Otherwise it shows -5 hours from PAKISTAN

/** Variables Declaration */

$date = date('Y-m-d h:i:s');
$month = date('F');

$editPlan = new EditPlan();
$editPlan->setRequestMethod();
$editPlan->getData();

class EditPlan {
  private $requestMethod;
  private $editKeyId;
  private $editKeyValue;
  private $editKeyName;
  private $UPDATED_PLAN_CHECK;

  public function __construct() {
    echo "Edit Plan Initiated\n";
  }

  public function setRequestMethod() {
    $this->requestMethod = $_SERVER['REQUEST_METHOD'];
  }
  public function setEditedKeyId($id) {
    $this->editKeyId = $id;
  }
  public function setEditedKeyName($name) {
    $this->editKeyName = $name;
  }
  public function setEditedKeyValue($value) {
    $this->editKeyValue = $value;
  }

  public function getRequestMethod() {
    return $this->requestMethod;
  }
  public function getEditedKeyId() {
    return $this->editKeyId;
  }
  public function getEditedKeyName() {
    return $this->editKeyName;
  }
  public function getEditedKeyValue() {
    return $this->editKeyValue;
  }

  public function getData() {
    if($this->getRequestMethod() == 'POST') {
        $json = file_get_contents('php://input');
        $array = json_decode($json, true);

        // echo $array['key_name']."\n";
        $this->setEditedKeyName($array['key_name']);
        $this->setEditedKeyValue($array['value']);
        $this->setEditedKeyId($array['id']);

        // echo $this->getEditedKeyName();
        $this->updateToDatabase();
    }
  }

  public function updateToDatabase()
  {
    $edited_key_id = $this->getEditedKeyId();
    $edited_key_name = $this->getEditedKeyName();
    $edited_key_value = $this->getEditedKeyValue();

    $db = new DB_Query;
    $helper = new HelperFunctions();

    // echo $edited_key_value."\n";
    $isBelow100 = $helper->check100PERCENTAGE($db, $edited_key_value); /** Check For 100% Data Exists */
    if($isBelow100 = true) {
      $check = $db->rawSQLQuery("UPDATE `save_plan`
                                  SET `key_name` = '$edited_key_name' , `planned_percentage` = $edited_key_value
                                  WHERE `id`=$edited_key_id"
                                );
      echo 'Data Updated.';
    }
    else {
      echo 'Plan is already Completed';
    }

    if($check==null) {
        return false;
    }
    return true;
  }
}
