<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trying to login....</title>
    <!-- App Css-->
    <link href="<?= APP_URL ?>/public/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" />

    <!-- Custom Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/style.css?v=<?= APP_VER ?>" />
</head>

<body>

    <div class="loader-container">
        <div class="bg-light">
            <div class="text-center">
                <div class="loader"> <span></span> <span></span> </div>
            </div>
        </div>
    </div>

    <?php

    try {
        if (strlen($REQUEST) === 64) {
            $adminToken = $REQUEST;

            $url = API_HOST . '/user/adminlogin';

            $data = array(
                'admin' => true,
                'token' => $adminToken,
                'origin' => $_SERVER['HTTP_HOST'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'platform' => $_POST['platform'] ?? '',
                'client_ip' => getClientIP()
            );

            $response = curl_get_content($url, 'POST', json_encode($data));

            if ($response) {

                $response = json_decode($response, true);


                if ($response['error'] === 0) { ?>
                    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
                    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>
                    <script>
                        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
                        localStorage.clear();

                        (async () => {
                            try {
                                await initializeDB();

                                localStorage.setItem('auth_token', '<?= $response['token'] ?>');
                                localStorage.setItem('user', JSON.stringify(<?= json_encode($response['data']['user']) ?>));
                                localStorage.setItem('country_codes', JSON.stringify(<?= json_encode($response['data']['country_codes']) ?>));

                                await wipeDatabase();

                                window.location.replace('/');
                            } catch (error) {
                                console.error(error);
                                // Display an error message to the user in the DOM
                            }
                        })();
                    </script>
    <?php } else {
                    die($response['msg']);
                }
            }
        }
    } catch (Exception $e) {
        die($e->getMessage());
    }

    ?>

</body>

</html>