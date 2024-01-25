<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- magnific-popup css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/css/intlTelInput.css" />

    <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">

    <!-- Bootstrap Css-->
    <link href="<?= APP_URL ?>/public/css/bootstrap.min.css" id="app-style" rel="stylesheet" type="text/css" />
    <!-- App Css-->
    <link href="<?= APP_URL ?>/public/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" />
    <!-- Custom Css-->
    <link href="<?= APP_URL ?>/public/css/style.css?v=<?= APP_VER ?>" rel="stylesheet">

    <script>
        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
    </script>

</head>

<body>
    <div class="layout-wrapper d-lg-flex">
        <!-- Start left sidebar-menu -->
        <div class="side-menu flex-lg-column me-lg-1 ms-lg-0">
            <!-- LOGO -->
            <div class="navbar-brand-box">
                <a href="/" class="logo logo-dark">
                    <span class="logo-sm">
                        <img src="/public/images/logo.svg" alt="brand" height="30">
                    </span>
                </a>
            </div>
            <!-- end navbar-brand-box -->

            <!-- Start side-menu nav -->
            <div class="flex-lg-column my-auto">
                <ul class="nav nav-pills side-menu-nav justify-content-center" role="tablist">
                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Profile">
                        <a class="nav-link" href="/profile">
                            <i class="ri-user-2-line"></i>
                        </a>
                    </li>
                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Chats">
                        <a class="nav-link active" id="pills-chat-tab" data-bs-toggle="pill" href="#pills-chat" role="tab">
                            <i class="ri-message-3-line"></i>
                        </a>
                    </li>

                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Logout">
                        <a class="nav-link" href="javascript:logOut()">
                            <i class="ri-logout-circle-r-line"></i>
                        </a>
                    </li>

                    <li class="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">

                        <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div class="avatar-xs profile-user rounded-circle bg-primary-subtle">
                                <span class="avatar-title text-primary bg-transparent">

                                </span>
                            </div>
                        </a>

                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="/profile">Profile <i class="ri-profile-line float-end text-muted"></i></a>
                            <!-- <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a> -->
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="javascript:logOut()">Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- end side-menu nav -->

            <div class="flex-lg-column d-none d-lg-block">
                <ul class="nav side-menu-nav justify-content-center">

                    <li class="nav-item">
                        <a class="nav-link light-dark-mode" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
                            <i class="ri-sun-line"></i>
                        </a>
                    </li>

                    <li class="nav-item btn-group dropup profile-user-dropdown">
                        <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div class="avatar-xs profile-user rounded-circle bg-primary-subtle">
                                <span class="avatar-title text-primary bg-transparent">

                                </span>
                            </div>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="/profile">Profile <i class="ri-profile-line float-end text-muted"></i></a>
                            <!-- <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a> -->
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="javascript:logOut()">Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- Side menu user -->
        </div>
        <!-- end left sidebar-menu -->

        <!-- start chat-leftsidebar -->
        <div class="chat-leftsidebar me-lg-1 ms-lg-0">

            <div class="tab-content">

                <!-- Start chats tab-pane -->
                <div class="tab-pane fade show active" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">
                    <!-- Start chats content -->
                    <div>
                        <div class="px-3 pt-4">
                            <div class="align-items-center d-flex justify-content-between mb-4">
                                <h4>Messages</h4>
                                <div class="d-flex">

                                    <div id="phone-number">


                                    </div>

                                    <button onclick="newConversation()" class="btn btn-primary btn-sm"> <i class="ri-chat-new-line"></i> New</button>
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


                        <!-- Start chat-message-list -->
                        <div>

                            <h5 class="mb-3 px-3 font-size-16" id="threads-title">Recent</h5>

                            <div class="chat-message-list px-2" data-simplebar>

                                <ul class="list-unstyled chat-list chat-user-list" id="threads">
                                    <div class="chat-loader-section">
                                        <div class="loader_bg" style="display: block; background-color: #f5f7fb;">
                                            <div class="text-center">
                                                <div class="loader"> <span></span> <span></span> </div>
                                            </div>
                                        </div>
                                    </div>

                                </ul>

                            </div>



                        </div>
                        <!-- End chat-message-list -->
                    </div>
                    <!-- Start chats content -->
                </div>
                <!-- End chats tab-pane -->

            </div>
            <!-- end tab content -->

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
                    <div class="chat-conversation ps-3 ps-lg-4 d-none" id="messageBody">
                        <div id="messageList" class="h-100">
                            <ul class="d-flex flex-column-reverse h-100 list-unstyled mb-0 overflow-y-auto pe-3 pt-3" id="messages__history"></ul>
                        </div>
                        <div class="fallback"></div>
                    </div>
                    <!-- end chat conversation end -->

                    <div class="chat-welcome-section" id="chat-welcome-section">
                        <div class="row w-100 justify-content-center">
                            <div class="col-xxl-5 col-md-7">
                                <div class="p-4 text-center">
                                    <div class="avatar-xl mx-auto mb-4">
                                        <div class="avatar-title bg-secondary rounded-circle"> <svg data-v-5e8ea5c2="" xmlns="http://www.w3.org/2000/svg" width="70px" height="65px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square">
                                                <path data-v-5e8ea5c2="" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z">
                                                </path>
                                            </svg></div>
                                    </div>
                                    <h4 class="d-inline px-3 py-2 rounded-pill bg-secondary text-white fs-4"> Start Conversation </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- start chat input section -->
                    <div class="chat-input-section p-3 p-lg-4 border-top mb-0 d-none" id="chat-input-section">
                        <form id="message_form" method="POST" enctype="multipart/form-data">
                            <div class="row g-0">
                                <div class="file_Upload position-absolute" style="bottom: 75px;left: 24px;" id="replyImagePreview"></div>
                                <div class="col">
                                    <input type="text" name="message" id="message" class="message_form__input form-control form-control-lg bg-light border-light" minlength="1" maxlength="204" placeholder="Enter Message...">
                                    <input type="file" name="file" id="upload_input" class="upload_input" style="display: none;" accept="image/jpg, image/jpeg, image/png, image/gif">
                                </div>
                                <div class="col-auto">
                                    <div class="chat-input-links ms-md-2 me-md-0">
                                        <ul class="list-inline mb-0">
                                            <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Attached File">
                                                <label for="upload_input" class="btn btn-link text-decoration-none font-size-16 btn-lg px-2 px-lg-3 waves-effect" id="OpenImgUpload">
                                                    <i class="ri-attachment-line"></i>
                                                </label>
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


            </div>
            <!-- End User chat -->


        </div>
        <!-- end  layout wrapper -->
    </div>

    <!-- scroll to top -->
    <button class="scroll-bottom-btn me-3 me-lg-4 d-none"><i class="ri-arrow-down-line"></i></button>
    <!-- scroll to top -->

    <!-- new message modal -->
    <div class="modal" tabindex="-1" id="newConversationteModal" tabindex="-1" aria-labelledby="newConversationteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <form id="createConversation" method="POST" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Conversation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="mb-3 d-grid">
                        <label for="recipient-name" class="col-form-label">Recipient Phone</label>
                        <input type="tel" class="form-control bg-light border-light" name="recipient" required>
                    </div>

                    <div id="new_conversation_phone" class="mb-3"></div>

                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Message</label>
                        <textarea class="form-control bg-light border-light" name="message" required minlength="1" maxlength="204"></textarea>
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



    <!-- JAVASCRIPT CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>

    <!-- Bootstrap js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>

    <!-- simplebar js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/simplebar/4.2.3/simplebar.min.js"></script>

    <!-- Waves js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.6/waves.min.js"></script>

    <!-- ReefJS -->
    <script src="https://cdn.jsdelivr.net/npm/reefjs@12/dist/reef.min.js"></script>

    <!-- Magnific Popup-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>

    <!-- image compressor -->
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js"></script>

    <!-- intlTelInput -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/intlTelInput.min.js"></script>


    <!-- database init -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>


    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>

    <!-- custom js -->
    <script src="<?= APP_URL ?>/public/js/nazrul26.js?v=<?= APP_VER ?>"></script>

    <script>
        let {
            store,
            component
        } = reef;
        const userState = new store(JSON.parse(localStorage.user || []));

        // jq short ready
        $(() => {

            // loop all instance of .profile-user element
            $('.profile-user').each((index, element) => {
                // create a new component
                component(element, () => {
                    return `<span class="avatar-title text-primary bg-transparent">${userState.name.charAt(0)}</span>`;
                });

            })
        });
    </script>

</body>


</html>