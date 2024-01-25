<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">

    <!-- magnific-popup css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" />

    <!-- remixicon css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css">

    <!-- intlTelInput css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/css/intlTelInput.css" />

    <!-- Bootstrap Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/bootstrap.min.css" />

    <!-- App Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/app.min.css" />

    <!-- Custom Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/style.css?v=<?= APP_VER ?>" />

    <script>
        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
        window.ipbxapi_serviceType = "sms";
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
            min-height: 130px;
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

        <!-- start chat-leftsidebar -->
        <div class="chat-leftsidebar ms-lg-0">

            <div class="px-3 pt-4">
                <div class="align-items-center d-flex justify-content-between mb-4">

                    <div class="d-flex">
                        <button class="border-0 menu-icon d-block d-md-none me-2">
                            <i class="ri-menu-3-line"></i>
                        </button>
                        <h4 class="pt-1">Messages</h4>
                    </div>
                    <div class="d-flex">

                        <div id="phone-number">
                        </div>

                        <button onclick="newConversation()" class="btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Send New Message"> <i class="ri-chat-new-line"></i>
                            New</button>
                    </div>
                </div>

                <div class="search-box chat-search-box">
                    <div class="input-group mb-3 rounded-3">
                        <span class="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                            <i class="ri-search-line search-icon font-size-18"></i>
                        </span>
                        <input type="text" class="form-control bg-light" placeholder="Search conversations" id="searchInput">

                        <button id="clear-search" class="bg-light border-0 rounded-end-2 text-body-secondary d-none">
                            <i class="ri-close-fill font-size-18"></i>
                        </button>

                    </div>
                </div> <!-- Search Box-->
            </div> <!-- .p-4 -->


            <h5 class="mb-3 px-3 font-size-16" id="threads-title">Recent</h5>

            <div class="chat-message-list
             px-2" data-simplebar data-simplebar-auto-hide="false">

                <ul class="list-unstyled chat-list chat-user-list" id="threads">
                    <div class="chat-loader-section">
                        <div class="bg-light" style="display: block; ">
                            <div class="text-center">
                                <div class="loader"> <span></span> <span></span> </div>
                            </div>
                        </div>
                    </div>

                </ul>

            </div>

        </div>
        <!-- end chat-leftsidebar -->

        <!-- Start User chat -->
        <div class="user-chat w-100 overflow-hidden">

            <div class="d-lg-flex">

                <!-- start chat conversation section -->
                <div class="w-100 overflow-hidden position-relative">

                    <!-- start chat user head -->
                    <div class="p-3 p-lg-4 border-bottom user-chat-topbar d-none" id="conversation-chat-head"></div>
                    <!-- end chat user head -->

                    <!-- start chat conversation -->
                    <div class="chat-conversation bg-pattern ps-3 ps-lg-4 d-none" id="messageBody">
                        <div id="messageList" class="h-100">
                            <ul class="d-flex flex-column-reverse h-100 list-unstyled mb-0 overflow-y-auto pe-3 pt-3" id="messages__history"></ul>
                        </div>
                        <div class="fallback"></div>
                    </div>
                    <!-- end chat conversation end -->

                    <div class="chat-welcome-section" id="chat-welcome-section">
                        <div class="row w-100 justify-content-center">
                            <div class="col-xl-5 col-md-10">
                                <a href="javascript:newConversation()">
                                    <div class="p-4 text-center">
                                        <div class="avatar-xl mx-auto mb-4">
                                            <div class="avatar-title bg-secondary rounded-circle"> <svg data-v-5e8ea5c2="" xmlns="http://www.w3.org/2000/svg" width="70px" height="65px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square">
                                                    <path data-v-5e8ea5c2="" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z">
                                                    </path>
                                                </svg></div>
                                        </div>
                                        <h4 class="d-inline px-3 py-2 rounded-pill bg-secondary text-white fs-4">Start
                                            Conversation</h4>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- start chat input section -->
                    <div class="chat-input-section p-3 p-lg-4 border-top mb-0 d-none" id="chat-input-section">
                        <form id="message_form" method="POST" enctype="multipart/form-data">
                            <div class="row g-0">
                                <div class="file_Upload position-absolute" style="bottom: 75px;left: 24px;" id="replyImagePreview"></div>
                                <div class="col position-relative">
                                    <input type="text" name="message" id="message" class="message_form__input form-control form-control-lg bg-light border-light" minlength="1" maxlength="2048" placeholder="Enter Message..." style="padding-right:80px">
                                    <!-- Default dropup button -->
                                    <input type="file" name="file" id="upload_input" class="upload_input" style="display: none;" accept="image/jpg, image/jpeg, image/png, image/gif">
                                    <div id="selectPhoneComponent"></div>
                                </div>
                                <div class="col-auto">

                                    <div class="chat-input-links ms-md-2 me-md-0">
                                        <ul class="list-inline mb-0 d-flex">

                                            <li class="list-inline-item" id="attachmentComponent">

                                            </li>
                                            <li class="list-inline-item">
                                                <button type="submit" class="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light">
                                                    <i class="ri-send-plane-2-fill"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- end chat input section -->
                </div>
                <!-- end chat conversation section -->

                <div id="participants-sidebar">



                </div>
                <!-- end User profile detail sidebar -->
            </div>
            <!-- End User chat -->


        </div>
        <!-- end  layout wrapper -->
    </div>

    <!-- scroll to top -->
    <button class="scroll-bottom-btn me-3 me-lg-4 d-none"><i class="ri-arrow-down-line"></i></button>
    <!-- scroll to top -->

    <!-- new message modal -->
    <div class="modal fade" tabindex="-1" id="newConversationteModal" tabindex="-1" aria-labelledby="newConversationteModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class=" modal-dialog modal-dialog-centered">
            <form id="createConversation" method="POST" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Conversation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div id="new_conversation_phone"></div>

                    <div class="d-grid">
                        <div class="d-flex justify-content-between">
                            <label for="recipient-name" class="col-form-label">Recipient</label>
                            <label id="recipient-label" for="recipient-name" class="col-form-label">01/10</label>
                        </div>
                        <div class="d-flex mb-2">
                            <input type="tel" class="form-control bg-light border-light recipient" name="recipient">
                            <button type="button" class="btn btn-sm btn-success" id="addRecipientFieldBtn"><i class="ri-add-fill fs-5"></i></button>
                        </div>
                        <div id="recipientFieldsContainer"></div>
                        <div class="mb-2">
                            <button class="btn btn-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#groupmembercollapse" aria-expanded="false" aria-controls="groupmembercollapse">
                                Select Contacts
                            </button>
                        </div>
                        <div class="collapse" id="groupmembercollapse">
                            <div class="card border mb-2">
                                <div class="card-header">
                                    <h5 class="font-size-15 mb-0" id="contact_count"></h5>
                                </div>
                                <div class="card-body p-2">
                                    <div data-simplebar style="max-height: 150px;">
                                        <div>
                                            <ul class="list-unstyled contact-list contactGroup">
                                                <li id="contact_list">

                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Message</label>
                        <textarea class="form-control bg-light border-light" name="message" minlength="1" maxlength="2048"></textarea>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-sm-6">
                            <div class="p-4 position-relative text-center upload_dropZone">
                                <p class="upload-icon mb-0" style="cursor:pointer">
                                    <i class="ri-upload-cloud-2-line text-primary fs-1"></i><br>
                                    <span class="text-primary fs-6">Select a file</span>
                                </p>
                            </div>
                            <input id="file" data-post-name="image_background" name="file" class="h-100 invisible position-absolute start-0 top-0 w-100" type="file" accept="image/jpg, image/jpeg, image/png">
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">
                        Send <i class="ri-send-plane-fill"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>


    <div class="modal fade" id="reefModal" tabindex="-1" aria-labelledby="reefModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content" id="reefModalContent">
            </div>
        </div>
    </div>


    <!-- JAVASCRIPT CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>

    <!-- Bootstrap js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>

    <!-- simplebar js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/simplebar/4.2.3/simplebar.min.js"></script>

    <!-- Waves js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.6/waves.min.js"></script>

    <!-- ReefJS -->
    <script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>

    <!-- Magnific Popup-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>

    <!-- image compressor -->
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js">
    </script>

    <!-- intlTelInput -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/intlTelInput.min.js"></script>

    <!-- database init -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>

    <!-- database init -->
    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>

    <!-- page components -->
    <script src="<?= APP_URL ?>/public/js/components/sms.js?v=<?= APP_VER ?>"></script>

    <!-- page common components -->
    <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>
    
    <script src="<?= APP_URL ?>/public/js/PNClient.js?v=<?= APP_VER ?>"></script>
    
    <!-- page common functions -->
    <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>

    <!-- page functions -->
    <script src="<?= APP_URL ?>/public/js/functions/sms.js?v=<?= APP_VER ?>"></script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>

    <script>
        $(document).ready(async function() {

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

        async function handleFile(file) {

            let dropZone = $(".upload_dropZone");

            let reader = new FileReader();

            reader.onload = function(e) {

                dropZone.css({
                    'background-image': 'url(' + e.target.result + ')',
                    'background-size': 'contain',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'outline': '0px',
                });

                $(".close-icon").removeClass('d-none');

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
                        'outline': '2px dashed rgba(var(--bs-primary-rgb), 1)',
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
    </script>

</body>


</html>