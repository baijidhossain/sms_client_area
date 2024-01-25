<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

//Set TimeZone
date_default_timezone_set('Asia/Dhaka');

define("TIMESTAMP", date("Y-m-d H:i:s"));


//Define values
define('API_HOST', 'https://ipbxapi.mdriaz.com');
define('SITE_TITLE', 'IPBX SMS');
define('APP_VER', mt_rand());

//get current url path with http or https
define('APP_URL', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . '://' . $_SERVER['HTTP_HOST']);

$page_scripts = [];

//Check request uri
$URI = ltrim($_SERVER['REQUEST_URI'], "index.php");

$URL = explode('/', rtrim(ltrim($URI, "/"), "/"));

$path = (empty($URL[0]) ? 'index' : $URL[0]);

unset($URL[0]);

$REQUEST = (count($URL) > 0 ? implode("/", $URL) : '');

if ($path == 'index') {
    include('pages/' . $path . '.php');
}

//Generate page
else if (file_exists('pages/' . $path . '.php')) {
    include('pages/' . $path . '.php');
} else {

    include('pages/404.php');
}


// Functions

function add_script($path, $prio = 0)
{

    global $page_scripts;

    if ($prio == 0) {
        $page_scripts[] = $path;
    } else {
        array_splice($page_scripts, $prio, 0, $path);
    }
}

function load_script()
{

    global $page_scripts;

    if (count($page_scripts) > 0) {

        foreach ($page_scripts as $path) {
            echo '<script src="' . $path . '"></script>' . PHP_EOL;
        }
    }
}

function getClientIP()
{
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}


function curl_get_content($url, $method = 'GET', $postfields = null)
{

    $curl = curl_init($url);

    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    if ($method == 'POST') {

        curl_setopt($curl, CURLOPT_POST, true);

        curl_setopt($curl, CURLOPT_POSTFIELDS, $postfields);
    }

    $response = curl_exec($curl);
    $error = curl_error($curl);

    curl_close($curl);

    if ($error) {
        return false;
    }

    return $response;
}
