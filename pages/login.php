<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!empty($_POST['email']) && !empty($_POST['password'])) {

        $url = API_HOST . '/user/login';

        $data = array(
            'email' => $_POST['email'],
            'password' => $_POST['password'],
            'origin' => $_SERVER['HTTP_HOST'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'platform' => $_POST['platform'],
            'client_ip' => getClientIP()
        );

        $response = curl_get_content($url, 'POST', json_encode($data));

        if ($response) {

            $response = json_decode($response, true);

            if ($response['error'] === 0) {
                die(json_encode(['error' => 0, 'msg' => 'Successfully logged in', 'data' => [
                    'token' => $response['token'],
                    'user' => $response['data']['user'],
                    'country_codes' => $response['data']['country_codes']
                ]]));
            }

            die(json_encode(['error' => $response['error'], 'msg' => $response['msg']]));
        }
        die(json_encode(['error' => 409, 'msg' => 'Something went wrong']));
    } else {

        die(json_encode(['error' => 400, 'msg' => 'Please enter your email and password!']));
    }
}

?>

<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title>Login - <?= SITE_TITLE ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Responsive Bootstrap 5 Chat App" name="description" />
    <meta content="Themesbrand" name="author" />
    <!-- App favicon -->
    <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">

    <!-- Bootstrap Css -->
    <link href="/public/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- Icons Css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <!-- App Css-->
    <link href="<?= APP_URL ?>/public/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" />

    <!-- database init -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>

    <script>
        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
        localStorage.clear();
        initializeDB().then(async () => await wipeDatabase()).catch(err => console.log(err));
    </script>

</head>

<body>


    <div class="account-pages my-5 pt-sm-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6 col-xl-5">
                    <div class="text-center mb-4">
                        <a href="index.html" class="auth-logo mb-5 d-block">
                            <img src="/public/images/logo-dark.png" alt="" height="30" class="logo logo-dark">
                            <img src="assets/images/logo-light.png" alt="" height="30" class="logo logo-light">
                        </a>

                        <h4>Sign in</h4>
                        <p class="text-muted mb-4">Sign in to continue to <?= SITE_TITLE ?>.</p>

                    </div>

                    <div class="card">
                        <div class="card-body p-4">
                            <div class="p-3">

                                <div id="alertMessage"></div>

                                <form action="" id="loginForm">

                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <div class="input-group mb-3 bg-light-subtle rounded-3">
                                            <span class="input-group-text text-muted" id="basic-addon3">
                                                <i class="fa-solid fa-user"></i>
                                            </span>
                                            <input type="email" name="email" class="form-control form-control-lg border-light bg-light-subtle" placeholder="Enter Email" required>

                                        </div>
                                    </div>

                                    <div class="mb-4">
                                        <div class="float-end">
                                            <a href="#" class="text-muted font-size-13">Forgot password?</a>
                                        </div>
                                        <label class="form-label">Password</label>
                                        <div class="input-group mb-3 bg-light-subtle rounded-3">
                                            <span class="input-group-text text-muted" id="basic-addon4">
                                                <i class="fa-solid fa-lock"></i>
                                            </span>
                                            <input type="password" name="password" minlength="4" class="form-control form-control-lg border-light bg-light-subtle" placeholder="Enter Password" required>

                                        </div>
                                    </div>

                                    <div class="d-grid">
                                        <button class="btn btn-primary waves-effect waves-light" id="submitBtn" type="submit"><span id="buttonText">Sign in</span>
                                            <div class="spinner-border spinner-border-sm text-light" id="spinner" style="display: none;" role="status"><span class="visually-hidden">Loading...</span></div>
                                        </button>
                                    </div>



                                </form>



                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- end account-pages -->


    <!-- JAVASCRIPT -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>

    <script>
        $(document).ready(function() {


            $('#loginForm').submit(function(event) {

                event.preventDefault();

                $('#submitBtn').prop('disabled', true);

                // Show the loading indicator
                $('#spinner').show();
                $("#buttonText").hide();

                let formData = new FormData(this);
                formData.append('platform', navigator.platform);

                $.ajax({
                    type: 'POST',
                    url: '',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {

                        const resObj = JSON.parse(response);

                        if (resObj.error === 0) {

                            localStorage.setItem('auth_token', resObj.data.token);
                            localStorage.setItem('user', JSON.stringify(resObj.data.user));
                            localStorage.setItem('country_codes', JSON.stringify(resObj.data.country_codes));
                            // check url redirect params if any
                            window.location.replace(new URLSearchParams(window.location.search).get('redirect') || '/');

                        } else {

                            $("#alertMessage").html(`<div class="alert alert-danger text-center" role="alert">${resObj.msg}</div>`);

                        }

                    },
                    error: function() {

                        let alertMsg = `<div class="alert alert-danger text-center" role="alert">Invalid request</div>`;

                        $("#alertMessage").html(alertMsg);

                    },
                    complete: function() {
                        $('#spinner').hide();
                        $("#buttonText").show();
                        $('#submitBtn').prop('disabled', false);
                    }
                });

            });
        });
    </script>

</body>

</html>