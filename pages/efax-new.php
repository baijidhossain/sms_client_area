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
    </script>

    <style>
        .bg-disable::after {
            background: rgb(0 0 0 / 62%);
            content: "";
            height: 100%;
            left: 0;
            position: absolute !important;
            top: 0;
            width: 100%;
            z-index: 0;
        }

        .inner-bar {
            width: 100%;
        }

        @media (max-width: 767px) {
            .side-menu {
                min-width: 75px;
                max-width: 75px;
                height: 100vh;
                min-height: 570px;
                background-color: var(--bs-sidebar-bg);
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                z-index: 9;
                -webkit-box-shadow: 0 2px 4px rgba(15, 34, 58, 0.12);
                box-shadow: 0 2px 4px rgba(15, 34, 58, 0.12);
                position: relative;
            }

            #sideBar {
                position: absolute;
                transform: translateX(-100%);
                z-index: 1;
                transition: all 0.3s ease-in-out;
            }

            #sideBar.show {
                transform: translateX(0%);
            }

            .inner-bar {
                min-width: 100%;
            }

        }

        .user-chat-topbar {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            z-index: -1;
        }

        .menu-icon {
            background: var(--bs-dark-bg-subtle);
            width: 35px;
            height: 35px;
            align-items: center;
            justify-content: center;
            display: flex;
            border-radius: 3px;
            cursor: pointer;
        }

        .accordion {
            --bs-accordion-btn-bg: #e8edf7;
            --bs-accordion-active-bg: #dce2ee;
        }
    </style>

</head>

<body>

    <div class="layout-wrapper d-md-flex">

        <div class="d-flex" id="sideBar">
            <!-- Start left sidebar-menu -->
            <div class="side-menu flex-column px-lg-1 ms-lg-0">
                <!-- LOGO -->
                <div class="pt-3 text-center">
                    <a href="/" class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="/public/images/logo.svg" alt="brand" height="30">
                        </span>
                    </a>
                </div>
                <!-- end navbar-brand-box -->

                <!-- Start side-menu nav -->
                <div class="flex-md-column my-auto">
                    <ul class="nav nav-pills side-menu-nav justify-content-center" role="tablist">


                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Chats" data-bs-original-title="Chats" role="presentation">
                            <a class="nav-link" href="/messages">
                                <i class="ri-message-3-line"></i>
                            </a>
                        </li>

                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="E-Fax"" data-bs-original-title=" E-Fax" role="presentation">
                            <a class="nav-link active" href="/efax" aria-selected="false" tabindex="-1" role="tab">
                                <i class="ri-printer-line"></i>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link light-dark-mode" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" aria-label="Dark / Light Mode" data-bs-original-title="Dark / Light Mode">
                                <i class="ri-sun-line"></i>
                            </a>
                        </li>

                        <li class="nav-item btn-group dropup profile-user-dropdown">
                            <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="avatar-xs profile-user rounded-circle bg-primary-subtle"><span class="avatar-title text-primary bg-transparent">M</span></div>
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

            </div>
            <!-- end left sidebar-menu -->

            <div class="chat-leftsidebar ms-lg-0 px-2" style="max-width: 3px;min-width: 290px;">

                <div class="tab-content">

                    <!-- Start chats tab-pane -->
                    <div class="tab-pane fade show active" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">
                        <div class="pt-4 px-2">
                            <div class="align-items-center d-flex justify-content-between mb-3">
                                <h4 class="mb-0">E-Fax</h4>
                                <div class="d-flex">

                                    <div id="phone-number"><select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
                                            <option value="0">All Numbers</option>
                                            <option selected="" value="5">+18143008709</option>
                                            <option value="2">+17862928609</option>
                                        </select></div>


                                </div>

                                <i class="ri-close-line menu-icon rounded-circle
                                d-md-none 
                                "></i>

                            </div>

                            <div class="search-box chat-search-box">

                            </div> <!-- Search Box-->
                        </div> <!-- .p-4 -->


                        <!-- Start chat-message-list -->
                        <div class="chat-message-list px-2" data-simplebar="init">
                            <div class="simplebar-wrapper" style="margin: 0px -8px;">
                                <div class="simplebar-height-auto-observer-wrapper">
                                    <div class="simplebar-height-auto-observer"></div>
                                </div>
                                <div class="simplebar-mask">
                                    <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
                                        <div class="simplebar-content-wrapper" style="height: 100%; overflow: hidden;">
                                            <div class="simplebar-content" style="padding: 0px 8px;">

                                                <ul class="list-unstyled chat-list chat-user-list" id="threads">
                                                    <li class="thread mb-3" style=" width: 114px;">
                                                        <a data-threadid="3" style="cursor: pointer;background: #7269ef;color: #fff;" class="py-2">
                                                            <div class="media">
                                                                <div class="chat-user-img align-self-center me-2 ms-0">
                                                                    <div class="">
                                                                        <span class="">
                                                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                                                                <path d="M9.58 15.168a.743.743 0 01-.72-.94l.8-2.99c.03-.13.1-.24.19-.34l6.68-6.68c.29-.29.77-.29 1.06 0l2.19 2.19c.29.29.29.77 0 1.06l-6.68 6.68c-.09.09-.21.16-.34.19l-2.99.8c-.06.02-.12.03-.19.03zm1.48-3.35l-.42 1.54 1.54-.41 6.01-6-1.13-1.13-6 6z" fill="currentColor"></path>
                                                                                <path d="M16.08 15.967v-2.94c0-.41.34-.75.75-.75s.75.34.75.75v2.94c0 2.22-1.81 4.03-4.03 4.03H8.03c-2.22 0-4.03-1.81-4.03-4.03v-5.52c0-2.22 1.81-4.03 4.03-4.03h2.94c.41 0 .75.34.75.75s-.34.75-.75.75H8.03c-1.4 0-2.53 1.13-2.53 2.53v5.52c0 1.4 1.13 2.53 2.53 2.53h5.52c1.4 0 2.53-1.14 2.53-2.53z" fill="currentColor"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body overflow-hidden">
                                                                    <span class="text-truncate font-size-15 mb-1">New</span>

                                                                </div>

                                                            </div>
                                                        </a>
                                                    </li>

                                                    <li class="active">
                                                        <a href="/efax" style="cursor: pointer;">
                                                            <div class="media">
                                                                <div class="chat-user-img align-self-center me-3 ms-0">
                                                                    <div class="">
                                                                        <span class="">
                                                                            <i class="ri-mail-line"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body overflow-hidden">
                                                                    <span class="text-truncate font-size-15 mb-1">Inbox</span>

                                                                </div>

                                                            </div>
                                                        </a>
                                                    </li>

                                                    <li class="thread">
                                                        <a data-threadid="3" style="cursor: pointer;">
                                                            <div class="media">
                                                                <div class="chat-user-img align-self-center me-3 ms-0">
                                                                    <div class="">
                                                                        <span class="">
                                                                            <i class="ri-mail-check-line"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body overflow-hidden">
                                                                    <span class="text-truncate font-size-15 mb-1">Sent</span>

                                                                </div>

                                                            </div>
                                                        </a>
                                                    </li>


                                                    <li class="thread">
                                                        <a data-threadid="3" style="cursor: pointer;">
                                                            <div class="media">
                                                                <div class="chat-user-img align-self-center me-3 ms-0">
                                                                    <div class="">
                                                                        <span class="">
                                                                            <i class="ri-archive-line"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body overflow-hidden">
                                                                    <span class="text-truncate font-size-15 mb-1">Archive</span>

                                                                </div>

                                                            </div>
                                                        </a>
                                                    </li>


                                                </ul>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="simplebar-placeholder" style="width: auto; height: 314px;"></div>
                            </div>
                            <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
                                <div class="simplebar-scrollbar" style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                            </div>
                            <div class="simplebar-track simplebar-vertical" style="visibility: hidden;">
                                <div class="simplebar-scrollbar" style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                            </div>
                        </div>
                        <!-- End chat-message-list -->
                    </div>
                    <!-- End chats tab-pane -->

                </div>
                <!-- end tab content -->

            </div>
        </div>


        <div class="bg-body ms-lg-0 px-2 shadow vh-100 inner-bar">

            <div class="row justify-content-center w-100 g-0">
                <div class="pt-4 px-2 col-md-6">

                    <div class="align-items-center d-flex mb-4">
                        <i class="ri-menu-line menu-icon me-3 d-md-none"></i>
                        <h4 class="mb-0">New</h4>
                    </div>

                    <form action="">

                        <div class="accordion" id="accordionExample">

                            <div class="accordion-item mb-2">
                                <h2 class="accordion-header" id="headingTwo">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Cover Page
                                    </button>
                                </h2>
                                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <div class="mb-3">
                                            <label for="fax-number" class="form-label">From</label>
                                            <input type="email" class="form-control" placeholder="From">
                                        </div>

                                        <div class="mb-3">
                                            <label for="fax-number" class="form-label">To</label>
                                            <input type="email" class="form-control" placeholder="To">
                                        </div>

                                        <div class="mb-3">
                                            <label for="fax-number" class="form-label">Header</label>
                                            <input type="email" class="form-control" placeholder="Header">
                                        </div>

                                        <div class="mb-3">
                                            <label for="fax-number" class="form-label">Subject</label>
                                            <input type="email" class="form-control" placeholder="Subject">
                                        </div>

                                        <div class="mb-3">
                                            <label for="fax-number" class="form-label">Message</label>
                                            <textarea class="form-control" placeholder="Message"></textarea>
                                        </div>

                                        <div class="mb-3">
                                            <label for="fax-number" class="form-label">Footer</label>
                                            <textarea class="form-control" placeholder="Footer"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="accordion-item mb-2">
                                <h2 class="accordion-header" id="headingOne">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Fax <small class="text-danger">*</small>
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <form>
                                            <div class="mb-3">
                                                <label for="fax-number" class="form-label">Fax Number(s)</label>
                                                <input type="email" class="form-control" placeholder="">
                                            </div>

                                            <div class="mb-3">
                                                <label for="fax-number" class="form-label">File(s)</label>
                                                <div class="input-group">
                                                    <input type="file" class="form-control" name="file[]">
                                                </div>

                                            </div>


                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div class="accordion-item mb-2">
                                <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Page Settings
                                    </button>
                                </h2>
                                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">

                                        <div class="input-group mb-3">
                                            <label class="input-group-text" for="resolution">Resolution</label>
                                            <select class="form-select" id="resolution">
                                                <option value="1">Normal</option>
                                                <option value="2">Fine</option>
                                                <option value="3">Super Fine</option>
                                            </select>
                                        </div>

                                        <div class="input-group mb-3">
                                            <label class="input-group-text" for="page-sixe">Page Size</label>
                                            <select class="form-select" id="page-sixe">
                                                <option value="1">Letter</option>
                                                <option value="2">Legal</option>
                                                <option value="3">A4</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary float-end mt-4"> <i class="ri-send-plane-fill"></i> Send</button>

                    </form>



                </div>

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
    <script src="https://cdn.jsdelivr.net/npm/reefjs@12/dist/reef.min.js"></script>

    <!-- Magnific Popup-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>

    <!-- image compressor -->
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js"></script>

    <!-- intlTelInput -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/intlTelInput.min.js"></script>

    <!-- database init -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>

    <script>
        //.menu-icon on toggle
        $('.menu-icon').on('click', function() {
            $('#sideBar').toggleClass('show');
            $('.inner-bar').toggleClass('bg-disable');
        });

        //if not clicked in sideBar close it
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#sideBar').length && !$(e.target).closest('.menu-icon').length) {
                $('#sideBar').removeClass('show');
                $('.inner-bar').removeClass('bg-disable');
            }
        });
    </script>


</body>


</html>