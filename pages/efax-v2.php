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
        @media (max-width: 767px) {
            .side-menu {
                min-width: 75px;
                max-width: 75px;
                height: 100vh;
                min-height: 570px;
                display: flex;
                z-index: 9;
                position: absolute;
                transform: translateX(-100%);
                transition: all 0.3s ease-in-out;
            }

            .chat-leftsidebar {
                transform: translateX(0);
                transition: all 0.3s ease-in-out;
            }

            /* if #sideBar.show is show .chat-leftsidebar translateX(0); */

            .side-menu.show {
                transform: translateX(0);
            }

            .side-menu.show+.chat-leftsidebar {
                transform: translateX(72px);
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
    </style>

</head>

<body>

    <div class="layout-wrapper d-md-flex overflow-hidden">

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

                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Chats" data-bs-original-title="Chats" role="presentation">
                        <a class="nav-link" href="/messages">
                            <i class="ri-whatsapp-line"></i>
                        </a>
                    </li>

                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Chats" data-bs-original-title="Chats" role="presentation">
                        <a class="nav-link" href="/messages">
                            <i class="ri-messenger-line"></i>
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


        <div class="chat-leftsidebar position-relative">

            <div class="px-3 pt-4">
                <div class="align-items-center d-flex justify-content-between mb-4">

                    <div class="d-flex">
                        <button class="border-0 menu-icon d-block d-md-none me-2">
                            <i class="ri-menu-3-line"></i>
                        </button>
                        <h4 class="pt-1">Inbox</h4>
                    </div>


                    <div class="d-flex">

                        <div id="phone-number"><select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
                                <option value="0">All Numbers</option>
                                <option value="5">+18143008709</option>
                                <option value="2">+17862928609</option>
                            </select></div>

                        
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
            </div>


            <ul class="nav nav-tabs d-flex
            justify-content-around
            mx-3 mb-2" id="myTab" role="tablist">
                <li class="nav-item col" role="presentation">
                    <button class="nav-link rounded-0 w-100 active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Inbox</button>
                </li>
                <li class="nav-item col" role="presentation">
                    <button class="nav-link rounded-0 w-100" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Sent</button>
                </li>
                <li class="nav-item col" role="presentation">
                    <button class="nav-link rounded-0 w-100" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Archived</button>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
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



                                                <li class="thread ">
                                                    <a data-threadid="3" style="cursor: pointer;">
                                                        <div class="media align-items-center">
                                                            <div class="chat-user-img align-self-center me-3 ms-0">
                                                                <div class="avatar-xs">
                                                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                        <i class="ri-mail-open-line"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="media-body overflow-hidden">
                                                                <h5 class="text-truncate font-size-15 mb-1">+1 786 292-8609</h5>
                                                                <p class="chat-user-message text-truncate mb-0 "> hello</p>
                                                            </div>
                                                            <div class="font-size-11">12:02 PM</div>
                                                        </div>
                                                    </a>
                                                </li>






                                                <li class="thread ">
                                                    <a data-threadid="3" style="cursor: pointer;">
                                                        <div class="media align-items-center">
                                                            <div class="chat-user-img align-self-center me-3 ms-0">
                                                                <div class="avatar-xs">
                                                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                        <i class="ri-mail-open-line"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="media-body overflow-hidden">
                                                                <h5 class="text-truncate font-size-15 mb-1">+1 786 292-8609</h5>
                                                                <p class="chat-user-message text-truncate mb-0 "> hello</p>
                                                            </div>
                                                            <div class="font-size-11">12:02 PM</div>
                                                        </div>
                                                    </a>
                                                </li>




                                                <li class="thread active">
                                                    <a data-threadid="3" style="cursor: pointer;">
                                                        <div class="media align-items-center">
                                                            <div class="chat-user-img align-self-center me-3 ms-0">
                                                                <div class="avatar-xs">
                                                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                        <i class="ri-mail-open-line"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="media-body overflow-hidden">
                                                                <h5 class="text-truncate font-size-15 mb-1">+1 786 292-8609</h5>
                                                                <p class="chat-user-message text-truncate mb-0 "> hello</p>
                                                            </div>
                                                            <div class="font-size-11">12:02 PM</div>
                                                        </div>
                                                    </a>
                                                </li>


                                                <li class="thread ">
                                                    <a data-threadid="3" style="cursor: pointer;">
                                                        <div class="media align-items-center">
                                                            <div class="chat-user-img align-self-center me-3 ms-0">
                                                                <div class="avatar-xs">
                                                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                        <i class="ri-mail-open-line"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="media-body overflow-hidden">
                                                                <h5 class="text-truncate font-size-15 mb-1">+1 786 292-8609</h5>
                                                                <p class="chat-user-message text-truncate mb-0 "> hello</p>
                                                            </div>
                                                            <div class="font-size-11">12:02 PM</div>
                                                        </div>
                                                    </a>
                                                </li>


                                            </ul>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="simplebar-placeholder" style="width: auto; height: 295px;"></div>
                        </div>
                        <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
                            <div class="simplebar-scrollbar" style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                        </div>
                        <div class="simplebar-track simplebar-vertical" style="visibility: hidden;">
                            <div class="simplebar-scrollbar" style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">...</div>
                <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">...</div>
            </div>

            <style>
                .nav-tabs .nav-item.show .nav-link,
                .nav-tabs .nav-link.active {
                    color: #fff !important;
                    background-color: #7269ef;
                    border-color: #7269ef;
                }

                .nav-tabs .nav-link,
                .nav-tabs .nav-link:hover,
                .nav-tabs .nav-link:focus {
                    border-color: var(--bs-dark-border-subtle);
                    color: var(--bs-dark-text);
                }
            </style>

            <button style="bottom: 20px; left: 20px; width: 50px; height: 50px;" onclick="newConversation()" class="btn btn-primary btn-sm position-absolute rounded-circle fs-4"> <i class="ri-chat-new-line"></i></button>

        </div>


        <div class="user-chat bg-white ms-lg-0 shadow w-100">
            <div class="d-flex flex-column h-100">
                <div class="p-3 p-lg-4 border-bottom">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="d-flex align-items-center">
                                <div class="d-block d-lg-none me-2 ms-0">
                                    <a href="#" class="user-chat-remove text-muted font-size-16 p-2"><i class="ri-arrow-left-s-line"></i></a>
                                </div>
                                <div class="me-3 ms-0">

                                    <div class="avatar-xs rounded-circle">
                                        <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                            <i class="ri-user-3-line"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="flex-grow-1 overflow-hidden">
                                    <h5 class="font-size-16 mb-0 text-truncate">
                                        <a href="#" class="text-reset user-profile-show user-profile-number">+1 616 319-3851</a>

                                    </h5>
                                </div>
                            </div>
                        </div>


                        <div class="col">
                <ul class="list-inline user-chat-nav text-end mb-0">

              

                    <li class="align-items-center d-flex justify-content-end list-inline-item">

                    <button class="btn nav-btn user-profile-show text-primary" type="button">
                            <i class="ri-archive-line"></i>
                        </button>
                        
                        <button class="btn nav-btn user-profile-show text-primary" type="button">
                            <i class="ri-information-fill"></i>
                        </button>
                        
                    </li>

                </ul>
            </div>

                    </div>
                </div>

                <!-- iframe of pdf -->
                <iframe src="https://www.africau.edu/images/default/sample.pdf" class="w-100 h-100"></iframe>

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
            $('.side-menu').toggleClass('show');
        });
    </script>


</body>


</html>