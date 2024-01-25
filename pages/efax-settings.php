<?php if (empty($REQUEST) || !is_numeric($REQUEST)) {
    header('Location: /');
    exit;
} ?>

<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?> | Service Setting</title>
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
    <style>
        .upload_dropZone {
            color: #0f3c4b;
            background-color: var(--bs-body-bg);
            outline: 2px dashed rgba(var(--bs-primary-rgb), 1);
            outline-offset: -12px;
            transition: outline-offset 0.2s ease-out, outline-color 0.3s ease-in-out, background-color 0.2s ease-out;
            border-radius: 5px;
            border: 1px solid var(--bs-border-color);
            position: relative;
            background-size: cover;
            /* Ensure the background image covers the entire area */
            background-position: center;
            /* Center the background image */
            max-width: 318px;
            min-height: 142px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .upload_dropZone .close-icon {
            position: absolute;
            top: -17px;
            right: -14px;
            cursor: pointer;
            font-size: 18px;
        }
        
        .upload_dropZone_hover {
            outline-offset: -8px;
            outline-color: rgba(var(--bs-secondary-rgb), var(--bs-bg-opacity));
            background-color: var(--bs-body-hover-bg);
        }
    </style>
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

            <button class="border-0 menu-icon d-block d-md-none me-2 menu-icon" style="position: absolute; z-index: 201; top: 24px; left: 18px;">
                <i class="ri-menu-3-line"></i>
            </button>

            <div class="d-lg-flex">
                <!-- start chat conversation section -->
                <div class="w-100 position-relative">

                    <div class="align-items-center bg-pattern d-flex justify-content-center justify-content-lg-center row" style="min-height: 100vh;">
                        <div class="row w-100 justify-content-center">

                            <div class="col-xxl-6 col-md-10">
                                <!-- service setting -->
                                <div class="bg-white rounded-2 shadow p-md-4 p-0" id="profile">

                                    <div class="p-4">
                                        <h4 class="mt-5 mt-sm-0 mb-4">Service Settings</h4>
                                        <form id="serviceSettingForm" method="POST">

                                            <div class="mb-3 row">
                                                <label for="businessName" class="col-sm-3 col-form-label">Business Logo</label>
                                                <div class="col-sm-5">
                                                    <div class="mb-3 p-4 position-relative text-center upload_dropZone">
                                                        <p class="upload-icon mb-0" style="cursor:pointer">
                                                            <i class="ri-upload-cloud-2-line text-primary fs-1"></i><br>
                                                            <span class="text-primary fs-6">Select a file</span>
                                                        </p>
                                                    </div>

                                                    <input id="file" data-post-name="image_background" name="logo" class="h-100 invisible position-absolute start-0 top-0 w-100" type="file" accept="image/jpg, image/jpeg, image/png">
                                                </div>

                                                <div class="col-sm-4">
                                                    <h3 class="fs-6">Upload your business logo here</h3>
                                                    <p class="mb-1">Preferred Image Size: 750 x 205 pixels @ 96 DPI </p>
                                                    <p class="mb-0">Less than 1MB</p>
                                                </div>
                                            </div>

                                            <div class="mb-3 row">
                                                <label for="businessName" class="col-sm-3 col-form-label">Business Name</label>
                                                <div class="col-sm-9">
                                                    <input type="text" class="form-control bg-light-subtle border-light" name="business_name" id="businessName" placeholder="Enter Business Name">
                                                </div>
                                            </div>

                                            <div class="row">

                                                <label for="pageSetting" class="col-sm-3 col-form-label">Fax Settings</label>
                                                <div class="col-sm-9">
                                                    <div class="float-start mb-2">
                                                        <span class="font-size-13">Page Resolution</span>
                                                    </div>
                                                    <select name="page_resulation" class="form-control mb-3" id="PageResolution">
                                                        <option value="normal">Normal</option>
                                                        <option selected value="fine">Fine</option>
                                                        <option value="superfine">Superfine</option>
                                                    </select>
                                                    <div class="float-start mb-2">
                                                        <span class="font-size-13 mb-2">Page Size</span>
                                                    </div>
                                                    <select name="page_size" class="form-control mb-3" id="pageSize">
                                                        <option value="letter">Letter</option>
                                                        <option value="legal">Legal</option>
                                                        <option selected value="a4">A4</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <label for="LegalDisclaimer" class="col-sm-3 col-form-label">Legal Disclaimer</label>
                                                <div class="col-sm-9">
                                                    <!-- <input type="text" class="form-control bg-light-subtle border-light" id="LegalDisclaimer"> -->
                                                    <textarea class="form-control mb-3" name="legal_disclaimer" id="legalDisclaimer" cols="30" rows="4">The information contained in this facsimile is intended for the sole confidential use of the recipient(s) designated above, and may contain confidential and legally privileged information. If you are not the intended recipient, you are hereby notified that the review, disclosure, dissemination, distribution, copying, duplication in any form, and taking of any action in regards to the contents of this document - except with respect to its direct delivery to the intended recipient - is strictly prohibited.  Please notify the sender immediately and destroy this cover sheet and all attachments.  If stored or viewed electronically, please permanently delete it from your system.</textarea>

                                                    <div>
                                                        <button class="btn btn-primary w-100 waves-effect waves-light mt-3" type="submit">Update</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </form>
                                    </div>

                                </div>
                                <!-- service setting -->
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
    <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>
    <!-- page init -->
    <script src="../public/js/app.js?v=<?= APP_VER ?>"></script>


    <script>
        const spinner = `<div class="spinner-border" role="status" style="--bs-spinner-width: 1rem;--bs-spinner-height: 1rem;"><span class="visually-hidden">Loading...</span></div>`;

        $(document).ready(async function() {

            await getServiceSettingData();

            const serviceSettingForm = $('#serviceSettingForm');

            // service setting form submit
            serviceSettingForm.on('submit', updateServiceSetting);

            // Attach a click event to the element with the ID "trigger"
            $(".upload-icon").on("click", function() {
                // Trigger a click on the input field with the ID "target"
                $("#file").click();
            });

            // Handle file drop
            $(".upload_dropZone")[0].ondragover = function(e) {
                e.preventDefault();
                $(this).addClass("upload_dropZone_hover");
            };

            $(".upload_dropZone")[0].ondragleave = function(e) {
                e.preventDefault();
                $(this).removeClass("upload_dropZone_hover");
            };

            $(".upload_dropZone")[0].ondrop = async function(e) {
                e.preventDefault();
                $(this).removeClass("upload_dropZone_hover");
                var files = e.dataTransfer.files;

                // Only handle the first dropped file
                if (files.length > 0) {
                    await handleFile(files[0]);
                    $('#file')[0].files = files;
                }
            }

            $("#file").on("change", async function() {
                var input = this;

                if (input.files && input.files[0]) {
                    await handleFile(input.files[0]);
                }
            });

        });

        async function getServiceSettingData() {

            try {
                const fetchData = await _request(APIS.SERVICE_SETTINGS + "/" + <?= $REQUEST ?> + "/fax");

                let faxSettings = fetchData.data.fax;
                let businessName = faxSettings?.business_name;
                let page_resulation = faxSettings?.page_resulation;
                let page_size = faxSettings?.page_size;
                let legal_disclaimer = faxSettings?.legal_disclaimer;
                let logo = faxSettings?.logo;

                $('#businessName').val(businessName);

                $('#PageResolution option').each(function() {
                    if ($(this).val() == page_resulation) {
                        $(this).prop('selected', true);
                    }
                });

                $('#pageSize option').each(function() {
                    if ($(this).val() == page_size) {
                        $(this).prop('selected', true);
                    }
                });

                if (legal_disclaimer) {
                    $('#legalDisclaimer').val(legal_disclaimer);
                }

                if (logo) {

                    $('.upload-icon').addClass('d-none');
                    $('.upload_dropZone').css({
                        'background-image': 'url(' + logo + ')',
                        'outline': 'none',
                    });

                    // Show close icon to remove the background image
                    if ($('.upload_dropZone .close-icon').length === 0) {
                        let closeIconHtml = '<div class="close-icon"><i class="ri-close-circle-line text-danger"></i></div>';
                        $('.upload_dropZone').append(closeIconHtml);
                    }

                    $(".close-icon").on("click", function() {
                        $('.upload_dropZone').css({
                            'background-image': 'none',
                            'outline': '2px dashed rgba(var(--bs-primary-rgb), var(--bs-bg-opacity))',
                        });
                        // Show upload icon
                        $(".upload-icon").removeClass('d-none');
                        // Remove close icon
                        $(this).remove();
                    });
                }

            } catch (error) {
                // Handle error, e.g., show an error message
                console.error('Error fetching data:', error);

            } finally {
                // Hide spinner after data is fetched (success or error)
                $('.loader-container').hide();
            }

        }

        async function handleFile(file) {

            let dropZone = $(".upload_dropZone");

            let reader = new FileReader();

            reader.onload = function(e) {

                dropZone.css({
                    'background-image': 'url(' + e.target.result + ')',
                    'background-size': 'cover',
                    'background-position': 'center',
                    'outline': '0px',
                });

                // Hide upload icon
                $(".upload-icon").addClass('d-none');

                // Show close icon to remove the background image
                if ($('.upload_dropZone .close-icon').length === 0) {
                    let closeIconHtml = '<div class="close-icon"><i class="ri-close-circle-line text-danger"></i></div>';
                    $('.upload_dropZone').append(closeIconHtml);
                }

                $(".close-icon").on("click", function() {
                    dropZone.css({
                        'background-image': 'none',
                        'outline': '2px dashed rgba(var(--bs-primary-rgb), var(--bs-bg-opacity))',
                    });
                    // Show upload icon
                    $(".upload-icon").removeClass('d-none');
                    // Remove close icon
                    $(this).remove();
                    $("#file").val('');
                });
            };

            reader.readAsDataURL(file);
        }

        async function updateServiceSetting(e) {

            e.preventDefault();
            // get form data to key value pairs
            let formData = new FormData(e.target);
            const element = $(e.target);
            const btnOldVal = element.find('button[type=submit]').html();
            element.find('button[type=submit]').html(spinner).prop('disabled', true);


            //if attachment is empty
            let hasFile = true;
            if (formData.get('logo').size === 0) {
                formData.delete('logo');
                hasFile = false;
            }

            if (!hasFile) {
                formData = Object.fromEntries(formData.entries());
            }

            if (hasFile) {
                element.find('button[type=submit]').html(spinner).prop('disabled', false);
                let file = formData.get('logo');
                formData.delete('logo');
                formData.append('logo', file, file.name);
            }

            try {

                const resp = await _request(APIS.SERVICE_SETTINGS + "/" + <?= $REQUEST ?> + "/fax", 'POST', formData, hasFile);
                if (resp.error == 0) {
                    toast("Successfully service updated!", 'success', 5000);
                }

            } catch (error) {
                console.log(error);
            } finally {
                element.find('button[type=submit]').html(btnOldVal).prop('disabled', false);
            }

        }
    </script>
</body>


</html>