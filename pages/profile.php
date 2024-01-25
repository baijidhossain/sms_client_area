<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?> | Profile</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">
    <!-- magnific-popup css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css">

    <!-- Bootstrap Css-->
    <link href="../public/css/bootstrap.min.css" id="app-style" rel="stylesheet" type="text/css" />
    <!-- App Css-->
    <link href="../public/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="../public/css/style.css">
    <script>
        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
    </script>

</head>

<body>
    <div class="loader-container">
        <div class="bg-light">
            <div class="text-center">
                <div class="loader"> <span></span> <span></span> </div>
            </div>
        </div>
    </div>

    <div class="layout-wrapper d-md-flex overflow-hidden">

        <!-- Start left sidebar-menu -->
        <?php include_once 'layouts/sidebar.php'; ?>
        <!-- end left sidebar-menu -->

        <!-- Start User chat -->
        <div class="profile-leftsidebar w-100">

            <button class="border-0 menu-icon d-block d-md-none me-2 menu-icon" style="position: absolute; z-index: 201; top: 24px; left: 18px">
                <i class="ri-menu-3-line"></i>
            </button>

            <div class="d-lg-flex">
                <!-- start chat conversation section -->
                <div class="w-100 position-relative">

                    <div class="align-items-center bg-pattern d-flex justify-content-center justify-content-lg-center row" style="min-height: 100vh;">
                        <div class="row w-100 justify-content-center">
                            <div class="col-xxl-6 col-md-10">

                                <!-- profile -->

                                <div class="bg-white rounded-2 shadow p-md-4 p-0" id="profile">

                                    <div class="text-center p-4">

                                        <div class="mb-4">
                                            <svg class="rounded-circle avatar-lg img-thumbnail" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 512 512" xml:space="preserve" fill-rule="evenodd" class="">
                                                <g>
                                                    <circle cx="16" cy="16" r="14.5" fill="#E2E6F8" data-original="#e2e6f8" class=""></circle>
                                                    <circle cx="16" cy="16" r="10.961" fill="#47A9FB" data-original="#47a9fb"></circle>
                                                    <circle cx="16" cy="12.283" r="4.157" fill="#FEB7BD" data-original="#feb7bd"></circle>
                                                    <path fill="#3F456A" d="M8.212 23.419a.5.5 0 0 0 .146.436c1.974 1.922 4.671 3.106 7.642 3.106s5.668-1.184 7.642-3.106a.5.5 0 0 0 .146-.436 6.527 6.527 0 0 0-6.45-5.52h-2.676a6.53 6.53 0 0 0-6.45 5.52z" data-original="#3f456a" class=""></path>
                                                    <path fill="#373C5B" d="M8.564 22.097a6.527 6.527 0 0 0-.352 1.322.5.5 0 0 0 .146.436c1.974 1.922 4.671 3.106 7.642 3.106s5.668-1.184 7.642-3.106a.5.5 0 0 0 .146-.436 6.527 6.527 0 0 0-.352-1.322c-1.954 1.807-4.567 2.911-7.436 2.911s-5.482-1.104-7.436-2.911z" data-original="#373c5b" class=""></path>
                                                </g>
                                            </svg>

                                        </div>

                                        <h5 class="font-size-16 mb-1 text-truncate" id="name">...</h5>

                                    </div>
                                    <!-- End profile user -->

                                    <!-- Start User profile description -->
                                    <div class="p-4">

                                        <div id="settingprofile" class="accordion">
                                            <div class="accordion-item card border mb-2">
                                                <div class="accordion-header" id="personalinfo1">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#personalinfo" aria-expanded="false" aria-controls="personalinfo">
                                                        <h5 class="font-size-14 m-0">Personal Info</h5>
                                                    </button>
                                                </div>
                                                <div id="personalinfo" class="accordion-collapse collapse show" aria-labelledby="personalinfo1" data-bs-parent="#settingprofile">
                                                    <form class="accordion-body" id="personalInfoForm">
                                                        <div class="float-end mb-3">
                                                            <button id="cancelEdit" type="button" class="btn btn-danger btn-sm d-none"><i class="ri-close-fill ms-0 align-middle"></i> Cancel</button>
                                                            <button id="editInfo" type="button" class="btn btn-primary btn-sm"><i class="ri-edit-fill ms-0 align-middle"></i> Edit</button>
                                                            <button type="submit" id="saveInfo" type="button" class="btn btn-success btn-sm d-none"><i class="ri-save-fill ms-0 align-middle"></i> Save</button>
                                                        </div>
                                                        <div class="mt-4">
                                                            <p class="text-muted mb-1">Name</p>
                                                            <input class="font-size-14 form-control bg-white" value="..." name="name" type="text" disabled>
                                                        </div>

                                                        <div class="mt-4">
                                                            <p class="text-muted mb-1">Phone</p>
                                                            <input class="font-size-14 form-control bg-white" value="..." name="phone" type="text" disabled>
                                                        </div>

                                                        <div class="mt-4">
                                                            <p class="text-muted mb-1">Email</p>
                                                            <input class="font-size-14 form-control bg-white" value="..." name="email" type="text" disabled style="pointer-events: none; cursor:not-allowed">
                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                            <!-- end personal info card -->

                                            <div class="accordion-item card border mb-2">
                                                <div class="accordion-header" id="myservice1">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#myservice" aria-expanded="false" aria-controls="myservice">
                                                        <h5 class="font-size-14 m-0">My Services</h5>
                                                    </button>
                                                </div>
                                                <div id="myservice" class="accordion-collapse collapse p-2" aria-labelledby="myservice1" data-bs-parent="#settingprofile">

                                                    <!-- table -->
                                                    <div class="table-responsive" id="servicesTable">

                                                    </div>

                                                </div>
                                            </div>
                                            <!-- end personal info card -->

                                            <div class="accordion-item card border mb-2">
                                                <div class="accordion-header" id="security1">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#security" aria-expanded="false" aria-controls="security">
                                                        <h5 class="font-size-14 m-0"> Security</h5>
                                                    </button>
                                                </div>
                                                <div id="security" class="accordion-collapse collapse" aria-labelledby="security1" data-bs-parent="#settingprofile">
                                                    <form class="accordion-body" id="securityForm">

                                                        <div class="row">

                                                            <div class="align-items-center col-12 d-flex justify-content-between">
                                                                <p class="text-muted mb-1">Update Password</p>
                                                                <button type="submit" id="updatePassword" type="button" class="btn btn-success btn-sm"><i class="ri-save-fill ms-0 align-middle"></i> Update</button>
                                                            </div>

                                                            <div class="col-md-6">
                                                                <div class="mt-4">

                                                                    <input class="font-size-14 form-control" value="" placeholder="Current Password" name="current_password" type="password">
                                                                </div>
                                                            </div>

                                                            <div class="col-md-6">
                                                                <div class="mt-4">

                                                                    <input class="font-size-14 form-control" value="" placeholder="New Password" name="new_password" type="password">
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                            <!-- end security card -->

                                            <div class="accordion-item card border mb-2">
                                                <div class="accordion-header" id="notification1">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#notification" aria-expanded="false" aria-controls="notification">
                                                        <h5 class="font-size-14 m-0"> Notifications</h5>
                                                    </button>
                                                </div>
                                                <div id="notification" class="accordion-collapse collapse" aria-labelledby="notification1" data-bs-parent="#settingprofile">
                                                    <div class="accordion-body">

                                                        <div class="row justify-content-between align-items-center">
                                                            <div class="col-10">
                                                                <h6 class="mb-0">Push Notification</h6>
                                                                <p class="text-muted mb-0">Receive push notification for new messages</p>
                                                            </div>
                                                            <div class="col-2 col-md-1">
                                                                <div class="form-check form-switch">
                                                                    <input class="form-check-input fs-4" type="checkbox" role="switch" id="notificationSwitch">
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <!-- end notification card -->
                                        </div>
                                        <!-- end profile-setting-accordion -->
                                    </div>
                                    <!-- End User profile description -->
                                </div>
                                <!-- profile -->


                            </div>
                        </div>
                    </div>
                    <!-- end chat conversation section -->
                </div>
                <!-- End User chat -->
            </div>
        </div>
        <!-- end  layout wrapper -->
    </div>

    <!-- JAVASCRIPT CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>
    <!-- ReefJS -->
    <script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>
    <!-- idb library -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
    <!-- database init -->
    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>
    <!-- page common components -->

    <script src="<?= APP_URL ?>/public/js/PNClient.js?v=<?= APP_VER ?>"></script>
    <!-- page common components -->
    <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>

    <!-- page common functions -->
    <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>



    <script>
        let spinner = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        let getUser = JSON.parse(localStorage.getItem('user'));

        if (getUser.notification == 1) {
            $("#notificationSwitch").prop("checked", true);
        }

        try {
            setProfileInfo();
        } catch (err) {
            console.log(err);
        } finally {
            $('.loader-container').hide();
        }

        $("#editInfo").on("click", () => {

            $('input[name="name"]').attr('disabled', false);
            $('input[name="email"]').attr('disabled', false);
            $('input[name="phone"]').attr('disabled', false);

            $("#editInfo").addClass("d-none");
            $("#saveInfo").removeClass("d-none");
            $("#cancelEdit").removeClass("d-none");

        });

        $("#cancelEdit").on("click", () => {

            $('input[name="name"]').attr('disabled', true);
            $('input[name="email"]').attr('disabled', true);
            $('input[name="phone"]').attr('disabled', true);

            $("#editInfo").removeClass("d-none");
            $("#saveInfo").addClass("d-none");
            $("#cancelEdit").addClass("d-none");

        });

        //personalInfoForm submit

        $("#personalInfoForm").on("submit", (e) => {

            e.preventDefault();

            //this form data
            let data = new FormData(e.target);

            //convert form data to object
            data = Object.fromEntries(data.entries());

            //show loading
            $("#saveInfo").html(spinner + ' Saving...');

            //update profile
            updateProfile(data);

        });

        // change password
        $("#securityForm").on("submit", (e) => {

            e.preventDefault();

            if ($('input[name="current_password"]').val() == '' || $('input[name="new_password"]').val() == '') {
                toast('Please enter password.', 'danger', 1000000);
                return;
            }

            //show loading
            $("#updatePassword").html(spinner + ' Updating...');

            //this form data
            let data = new FormData(e.target);

            //convert form data to object
            data = Object.fromEntries(data.entries());

            changePassword(data);

        });

        $(document).on("change", '#notificationSwitch', async function() {
            let checkSubscription = await pnSubscribed();

            try {
                if (this.checked) {
                    await _request(APIS.PUSH_NOTIFICATION + '/subscribe', 'GET');
                    await updateNotificationStatus(1);

                    if (!checkSubscription) {
                        await pnSubscribe();
                    }

                    toast('Push Notification Enabled', 'success', 3000);

                } else {
                    await _request(APIS.PUSH_NOTIFICATION + '/unsubscribe', 'GET');
                    await updateNotificationStatus(0);

                    if (checkSubscription) {
                        await pnUnsubscribe();
                    }

                    toast('Push Notification Disabled!', 'success', 3000);
                }
            } catch (e) {
                console.log(e);
            }
        });

        //input[name="is_primary" prevent uncheck
        $(document).on("click", '.sms input[name="is_primary"]', function() {
            //if this is not checked
            if ($(this).is(':checked') == false) {
                return false;
            }
        });

        //name="is_primary" on change event uncheck all other checkboxes
        $(document).on("change", '.sms input[name="is_primary"]', function() {

            $('.sms input[name="is_primary"]').not(this).prop('checked', false);

            const service_id = $(this).val();

            try {

                //update primary number
                let response = _request(APIS.UPDATE_PRIMARY_SERVICE, 'POST', {
                    name: 'sms',
                    value: service_id
                });

                // show alert
                toast('Primary number updated successfully.', 'success', 3000);

            } catch (error) {
                console.log(error);
            }


        });

        //input[name="is_primary" prevent uncheck
        $(document).on("click", '.efax input[name="is_primary"]', function() {
            //if this is not checked
            if ($(this).is(':checked') == false) {
                return false;
            }
        });

        //name="is_primary" on change event uncheck all other checkboxes
        $(document).on("change", '.efax input[name="is_primary"]', function() {

            $('.efax input[name="is_primary"]').not(this).prop('checked', false);

            const service_id = $(this).val();

            try {

                //update primary number
                let response = _request(APIS.UPDATE_PRIMARY_SERVICE, 'POST', {
                    name: 'efax',
                    value: service_id
                });

                toast('Primary number updated successfully.', 'success', 3000);

            } catch (error) {
                console.log(error);
            }


        });

        function setProfileInfo() {

            userInfo = JSON.parse(localStorage.getItem('user'));

            //remove spinner
            $("#spinner").addClass("d-none");

            //show profile
            $("#profile").removeClass("d-none");

            $('input[name="name"]').val(userInfo.name);
            $('input[name="email"]').val(userInfo.email);
            $('input[name="phone"]').val(userInfo.phone);

            $('#name').html(userInfo.name);

            let services = userInfo.services;

            let servicesTable = '';

            //getPartySetting

            for (const serviceName in services) {
                servicesTable += `<div class="mb-3"><div class="my-2 fw-bold">${serviceName.toUpperCase()}</div>
            <table class="table table-bordered table-nowrap table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Status</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>                        
                        ${serviceName == 'efax' ? '<th scope="col">Action</th>' : ''}
                        ${serviceName == 'sms' || serviceName == 'efax' ? '<th scope="col">Primary Number</th>' : ''}
                    </tr>
                </thead>
                <tbody>`;

                // Iterate through each service
                services[serviceName].forEach(service => {
                    let status = '';
                    if (service.status == 'Active') {
                        status = '<i class="ri-checkbox-circle-fill text-success"></i>';
                    } else if (service.status == 'Terminated') {
                        status = '<i class="ri-close-circle-fill text-danger"></i>';
                    } else if (service.status == 'Suspended') {
                        status = '<i class="ri-pause-circle-fill text-warning"></i>';
                    }

                    // Append the table row for the service
                    servicesTable += `
            <tr>
                <td>${service.number}</td>
                <td>${service.status} ${status}</td>
                <td>${UTCToLocalDate(service.start, "Y-m-d")}</td>

                <td>${service.end ? UTCToLocalDate(service.end, "Y-m-d") : "-"}</td>

                ${serviceName == 'efax' ? '<td>' : ''}

                ${serviceName == 'efax' && service.status=='Active' ?
                   `<a href="/efax-settings/${service.phone_id}">
                        <i class="ri-settings-3-line"></i>
                    </a>` : ''}
                ${serviceName == 'efax' ? '</td>' : ''}

                ${serviceName == 'sms' || serviceName == 'efax' ? '<td>' : ''}     

                ${(serviceName == 'sms' || serviceName == 'efax') && service.status=='Active' ?                                
                   `
                   <div class="form-check form-switch ${serviceName}">
                        <input type="checkbox" name="is_primary" class="form-check-input me-1 is_primary" value="${service.id}" ${service.is_primary == 1 ? 'checked' : ''}>
                        <span class="text-muted">Primary</span>
                    </div>
                    
                   ` : ''}

                ${serviceName == 'sms' || serviceName == 'efax' ? '</td>' : ''}

            </tr>`;
                });

                // Close the table body and table for this service
                servicesTable += `</tbody>
                        </table></div>`;
            }

            // Set the HTML content of the "servicesTable" element
            $("#servicesTable").html(servicesTable);
        }


        async function changePassword(data) {

            try {

                let response = await _request(APIS.CHANGE_PASSWORD, 'POST', data);

                toast('Password updated successfully.', 'success', 1000000);

            } catch (error) {
                console.log(error);
            }
        }

        async function updateProfile(data) {

            let response = await _request(APIS.PROFILE, 'POST', data);

            if (response.error == 0) {
                //update name
                $('#name').html($('input[name="name"]').val());

                //reset loading
                $("#saveInfo").html('<i class="ri-save-fill ms-0 align-middle"></i> Save');

                $('input[name="name"]').attr('disabled', true);
                $('input[name="email"]').attr('disabled', true);
                $('input[name="phone"]').attr('disabled', true);

                $("#editInfo").removeClass("d-none");
                $("#saveInfo").addClass("d-none");
                $("#cancelEdit").addClass("d-none");

                //update localstorage
                let userInfo = JSON.parse(localStorage.getItem('user'));

                console.log(data);

                userInfo.name = data.name;
                userInfo.email = data.email;
                userInfo.phone = data.phone;

                localStorage.setItem('user', JSON.stringify(userInfo));

                //avatar-title set name
                $(".avatar-title").html(data.name.charAt(0).toUpperCase());

                setProfileInfo();

                toast('Profile updated successfully.', 'success', 1000000);
            } else {
                toast(response.msg, 'danger', 1000000);
            }
        }
    </script>
</body>


</html>