<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">

    <!-- remixicon css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css">

    <!-- Bootstrap Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/bootstrap.min.css" />

    <!-- App Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/app.min.css" />

    <!-- Custom Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/style.css?v=<?= APP_VER ?>" />

    <!-- Efax Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/efax.css?v=<?= APP_VER ?>" />


    <script>
        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
        window.ipbxapi_serviceType = 'contacts';
    </script>

    <style>
        .menu-active {
            font-weight: 900 !important;
            color: #7269ef !important;
        }

        @media (max-width: 767px) {
            #sideBar .side-menu.show+.chat-leftsidebar {
                transform: translateX(0px);
            }

            #sideBar .msg-side-menu {
                transform: translateX(0px);
            }
        }

        .selected>td {
            background-color: #7269ef2e !important;
            cursor: move;
        }

        #efaxNav .badge {
            min-width: 30px;
        }

        .accordion-button {
            cursor: pointer;
        }

        .chat-leftsidebar .accordion-button::after {
            content: unset !important;
        }

        #newFaxCard .accordion {
            --bs-accordion-btn-bg: #e8edf7;
            --bs-accordion-active-bg: #dce2ee;
        }

        #Inbox {
            max-height: 25vh;
            overflow-y: auto;
        }

        .remove-file {
            width: 15px;
            height: 15px;
            border-radius: 15px;
            margin: 5px;
            position: relative;
        }

        .remove-file:hover {
            background-color: #495057 !important;
            cursor: pointer;
        }

        .remove-file i {
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
        }

        .accordion-body .input-group-text {
            min-width: 105px;
        }

        #faxTable .table td {
            color: unset;
        }
    </style>

</head>

<body>

    <div class="layout-wrapper d-md-flex">

        <div class="d-flex" id="sideBar">

            <!-- Start left sidebar-menu -->
            <?php include_once 'layouts/sidebar.php'; ?>
            <!-- end left sidebar-menu -->

            <div class="chat-leftsidebar ms-lg-0 px-2 position-relative" style="max-width: 3px;min-width: 290px;">

                <div class="tab-content">

                    <!-- Start chats tab-pane -->
                    <div class="tab-pane fade show active" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">
                        <div class="pt-4 px-2">
                            <div class="align-items-center d-flex justify-content-between mb-3">
                                <h4 class="mb-0">Contacts</h4>
                                <div class="d-flex">
                                    <div id="phoneNumber">
                                    </div>
                                </div>

                                <i class="ri-close-line menu-icon rounded-circle 
                                d-md-none 
                                " data-nav-button></i>

                            </div>

                            <div class="search-box chat-search-box"></div>

                            <btn class="btn btn-primary mb-3" id="newFax">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.58 15.168a.743.743 0 01-.72-.94l.8-2.99c.03-.13.1-.24.19-.34l6.68-6.68c.29-.29.77-.29 1.06 0l2.19 2.19c.29.29.29.77 0 1.06l-6.68 6.68c-.09.09-.21.16-.34.19l-2.99.8c-.06.02-.12.03-.19.03zm1.48-3.35l-.42 1.54 1.54-.41 6.01-6-1.13-1.13-6 6z" fill="currentColor"></path>
                                    <path d="M16.08 15.967v-2.94c0-.41.34-.75.75-.75s.75.34.75.75v2.94c0 2.22-1.81 4.03-4.03 4.03H8.03c-2.22 0-4.03-1.81-4.03-4.03v-5.52c0-2.22 1.81-4.03 4.03-4.03h2.94c.41 0 .75.34.75.75s-.34.75-.75.75H8.03c-1.4 0-2.53 1.13-2.53 2.53v5.52c0 1.4 1.13 2.53 2.53 2.53h5.52c1.4 0 2.53-1.14 2.53-2.53z" fill="currentColor"></path>
                                </svg>
                                <span class="text-truncate font-size-15 mb-1">New</span>
                            </btn>

                            <div class="accordion" id="efaxNav"></div>

                        </div> <!-- .p-4 -->

                        <!-- End chat-message-list -->
                    </div>
                    <!-- End chats tab-pane -->

                </div>
                <!-- end tab content -->
                <div id="folderActions" class="bg-dark-subtle p-2 shadow position-absolute bottom-0 start-0 end-0" style="width: 100%;">
                </div>

            </div>

        </div>

        <div class="bg-body ms-lg-0 shadow vh-100 w-100  position-relative">

            <div class="pt-4 d-flex flex-column h-100">


                <div class="align-items-center d-flex mb-4 px-4" id="pageHeader">
                </div>

                <div class="d-none row justify-content-center w-100 g-0 vh-100 overflow-y-auto bg-white
                " id="newFaxCard">
                </div>

                <div class="search-box chat-search-box px-4" id="searchBox">
                </div>

                <div class="position-relative px-4 table-responsive" id="faxTable">
                </div>

            </div>

            <div class="spinner" id="loader">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

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

    <!-- Waves js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.6/waves.min.js"></script>

    <!-- ReefJS -->
    <script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>

    <!-- database init -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>

    <!-- database init -->
    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>

    <!-- page components -->
    <script src="<?= APP_URL ?>/public/js/components/contacts.js?v=<?= APP_VER ?>"></script>

    <!-- page common components -->
    <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>

    <script src="<?= APP_URL ?>/public/js/PNClient.js?v=<?= APP_VER ?>"></script>

    <!-- page common functions -->
    <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>

    <!-- page functions -->
    <script src="<?= APP_URL ?>/public/js/functions/contacts.js?v=<?= APP_VER ?>"></script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>

</body>


</html>