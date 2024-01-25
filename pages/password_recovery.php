<?php
if (isset($_SESSION['token'])){
	header("location: /");
	exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title class="site_title"><?= SITE_TITLE ?></title> 
	<link rel="icon" href="/public/images/favicon.png" type="image/png">
    <!-- Bootstrap -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <!-- Fontes -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/1.0.0/css/simple-line-icons.min.css"
          rel="stylesheet">
    <!-- all buttons css -->
    <link href="/public/css/buttons.css" rel="stylesheet">
    <!-- animate css -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.0.0/animate.css" rel="stylesheet">
    <!-- top nev css -->
    <link href="/public/css/page-header.css" rel="stylesheet">
    <!-- adminui main css -->
    <link href="/public/css/main.css" rel="stylesheet">
    <!-- red green theme css -->
    <link href="/public/css/red-green.css" rel="stylesheet">
    <!-- media css for responsive  -->
    <link href="/public/css/main.media.css" rel="stylesheet">
    <link href="/public/css/custom.css?v=<?= APP_VER ?>" rel="stylesheet">
    <script>
        const config = {
            api_host: ''
        };
    </script>
</head>
<?php

$err = [];
$msg = [];
$view = 'recovery';
// phone and captcha validation
if (!empty($_POST['phone']) && !empty($_POST['captcha'])) {

	if ($_SESSION['captcha'] !== $_POST['captcha']) {
		$err['captcha'] = 'Invalid Captcha';
	}

	if (!$number = validateNumber($_POST['phone'])) {
		$err['phone'] = 'Invalid Phone Number';
	}

	if (empty($err)) {
		// all ok
		$url = API_HOST . "/user/recovery/token/?api_key=" . API_KEY . "&client_ip=" . getClientIP();

		if ($response = curl_get_content($url, 'POST', ['phone' => $number])) {
			$response = @json_decode($response, true);

			if ($response['error'] === 0) {
				$_SESSION['recovery_token'] = $response['data']['token'];
				$_SESSION['phone'] = '*******' . substr($number, -4);
				$view = 'password';
				$msg = ['success', "A verification code has been sent to $_SESSION[phone]."];

			} elseif ($response && ($response['error'] === 400)) {
				$msg = ['danger', $response['msg']];
			} else {
				$msg = ['danger', 'Unknown error occurred!'];
			}
		} else {
			$msg = ['danger', 'Unknown error occurred!'];
		}
	}
}

// check otp code and new password
if (isset($_SESSION['recovery_token'])) {

	$view = 'password';

	$url = API_HOST . "/user/recovery/?api_key=" . API_KEY . "&client_ip=" . getClientIP();

	if (!empty($_POST['password']) && !empty($_POST['otp_code'])) {
		if ($response = curl_get_content($url, 'POST', ['recovery_token' => $_SESSION['recovery_token'], 'otp_code' => $_POST['otp_code'], 'password' => $_POST['password']])) {
			$response = @json_decode($response, true);

			if ($response['error'] === 0) {
				$view = 'success';
				$msg = ['success', $response['msg'] . PHP_EOL . 'Redirecting to login page in 5 sec.'];
				unset($_SESSION['recovery_token']);

			} elseif (str_contains($response['msg'], 'Expired')) {
				$msg = ['danger', 'Token Expired!'];
				$view = 'recovery';

			} elseif ($response['error'] === 400) {
				$msg = ['danger', $response['msg']];
			} else {
				$msg = ['danger', 'Unknown error occurred!'];
			}

		} else {
			$msg = ['danger', 'Unknown error occurred!'];
		}
	}

	if (isset($_POST['resend_otp']) && $resp = curl_get_content($url, 'POST', ['recovery_token' => $_SESSION['recovery_token'], 'resend_otp' => true])) {
		$resp = @json_decode($resp, true);
		if ($resp['error'] === 0) {
			$msg = ['success', "A verification code has been sent to $_SESSION[phone]."];
		} else if (str_contains($resp['msg'], 'Expired')) {
			$msg = ['danger', 'Token Expired!'];
			$view = 'recovery';
		} elseif ($resp['error'] === 400) {
			$msg = ['danger', $resp['msg']];
		} else {
			$msg = ['danger', 'Unknown error occurred!'];
		}
	}

}

if ($view === 'recovery') {
	$captcha = generateCaptcha();
	$_SESSION['captcha'] = $captcha['code'];
}

?>
<body class="login">
<div class="middle-box text-center loginscreen">
    <div class="widgets-container">
        <div class="outer_logo"><a href="/"><img src="/public/brand/<?= $_SERVER['HTTP_HOST'] ?>/light_logo.png" alt="logo" class="img-responsive" width="150" ></a></div>
        <p class="font16" style="color:#b11800">Password Recovery</p>

		<?php if (!empty($msg)): ?>
            <div class="alert alert-<?= $msg[0] ?> alert-dismissible">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                            aria-hidden="true">×</span></button>
				<?= $msg[1] ?>
            </div>

		<?php endif; ?>

        <form action="" class="top15 text-left" method="post" id="recoveryForm" autocomplete="off">

			<?php if ($view === 'success'): ?>
                <script>
                    setTimeout(function () {
                        location.replace('/login/');
                    }, 5000);
                </script
			<?php elseif ($view === 'password'): ?>
                <div class="form-group">
                    <label class="pull-left" for="">Enter OTP</label>
                    <p class="pull-right mb-0 otp_counter">Your code will expire in 02:00</p>
                    <input type="number" name="otp_code" placeholder="Enter verification code"
                           class="form-control required">
                </div>

                <div class="form-group">
                    <label for="">New Password</label>
                    <input type="password" name="password" id="newpassword" placeholder="Enter new password"
                           class="form-control required"
                           data-pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})">
                    <span class="help-block"></span>
                </div>
                <div class="form-group">
                    <label for="">Repeat Password</label>
                    <input type="password" name="repeat_password" placeholder="Repeat password"
                           class="form-control required" id="repeatpassword">
                    <span class="help-block"></span>
                </div>

                <div class="help-block" style="color:#ce3e3e">Password must have uppercase, lowercase, numbers and
                    minimum 8
                    characters
                </div>
			<?php else: ?>

                <div class="form-group <?= isset($err['phone']) ? 'has-error' : '' ?>">
                    <p>Please enter your phone number.</p>
                    <input type="number" name="phone" placeholder="Phone Number" class="form-control required"
                           id="phone">
                    <span class="help-block <?= isset($err['phone']) ? 'd-inline' : '' ?>"><?= $err['phone']??'' ?></span>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="<?= $captcha['image'] ?>" alt="captcha" class="img-responsive border"
                                 style="height: 34px;object-fit: cover;">
                        </div>
                        <div class="col-md-6 <?= isset($err['captcha']) ? 'has-error' : '' ?>">
                            <input type="text" name="captcha" placeholder="Captcha" class="form-control required">
                            <span class="help-block <?= isset($err['captcha']) ? 'd-inline' : '' ?>"><?= $err['captcha']??'' ?></span>
                        </div>
                    </div>
                </div>

			<?php endif; ?>

			<?php if ($view !== 'success'): ?>
                <button class="btn green block full-width mt-3 bottom15" type="submit">Submit</button>
			<?php endif; ?>
        </form>
    </div>
    <p class="top15"><small class="site_title"><?= SITE_TITLE ?></small> <small>&copy; <?= date('Y') ?></small></p>
</div>
<div id="card_alert">
    <div class="card_alert">
        <i class="fa fa-3x fa-exclamation-triangle" aria-hidden="true"></i>
        <h3 class="card_alert_header">Error!</h3>
        <p class="card_alert_body"></p>
        <div class="card_alert_footer">
            Dismiss
        </div>
    </div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="/public/js/Framework.js?v=<?= APP_VER ?>"></script>
<script src="/public/js/common.js?v=<?= APP_VER ?>"></script>
<script>
    startTimer(120, $('.otp_counter'));

    function resendOTP() {
        $('body').append(`<form action="" id="otp_resend" method="POST"><input type="hidden" name="resend_otp" value="true"></form>`);
        $('#otp_resend')[0].submit();
    }
</script>
</body>

</html>