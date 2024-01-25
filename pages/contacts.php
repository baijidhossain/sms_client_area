<?php if (empty($REQUEST)) : ?>


    <!doctype html>
    <html lang="en">

    <head>

        <meta charset="utf-8" />
        <title><?= SITE_TITLE ?> | Contacts</title>
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
            window.ipbxapi_serviceType = "contacts";
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
                min-width: 360px
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
                    z-index: 2;
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

            @media (max-width: 991.98px) {
                .chat-message-list {
                    height: calc(100vh - 145px);
                }
            }

            .chat-message-list {
                height: calc(100vh - 145px);
            }

            .chat-group-list {
                height: calc(100vh - 160px);
            }

            .btn-outline-light {
                border-color: #0000001c !important;
            }

            .btn-outline-light:hover {
                color: #ffffff;
                text-decoration: none;
                background-color: #7269ef;
            }

            .spinner {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(var(--bs-body-bg-rgb), var(--bs-bg-opacity));
            }

            .table {
                --bs-table-hover-bg: rgb(var(--bs-light-rgb)) !important;
            }

            .chat-list li a {
                padding: 0.75em 20px;
                border-radius: unset;
                border-top: unset;
            }

            .accordion {
                --bs-accordion-border-radius: unset !important;
                --bs-accordion-inner-border-radius: unset !important;
            }

            .accordion-button:not(.collapsed) {
                color: var(--bs-secondary-color);
            }

            [data-bs-theme="dark"] .accordion-button:not(.collapsed) {
                color: var(--bs-secondary-color);
            }

            .folder-action-btn {

                padding: 2px;
                width: 20px;
                height: 20px;
                font-size: 10px;

            }

            .folder-list {
                transition: all 0.3s ease-in-out;
            }

            .folder-list:hover .folder-actions {
                display: block !important;
            }

            .btn.disabled,
            .btn:disabled,
            fieldset:disabled .btn {
                color: #bbbbbb;
            }


            .menu-active {
                font-weight: 900 !important;
                color: #7269ef !important;
            }

            .search-box {
                max-width: 400px;
            }


            @media (max-width: 767px) {
                #sideBar .side-menu.show+.chat-leftsidebar {
                    transform: translateX(0px);
                }

                #sideBar .msg-side-menu {
                    transform: translateX(0px);
                }

                .search-box {
                    max-width: 100%;
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

            .groups .group:hover .actions {
                display: block !important;
            }

            .groups .group .actions {
                display: none;
                right: 10px !important;
                top: 3px !important;
            }

            #exportContactsForm .btn {
                border-color: unset !important;
            }

            .groups {
                max-height: calc(100vh - 135px);
                overflow-y: auto;
            }

            .groups::-webkit-scrollbar {
                display: none;
            }

            .groups:hover::-webkit-scrollbar {
                display: block;
            }

            .groups .item {
                width: 264px !important;
            }
        </style>
    </head>

    <body>

        <div class="loader-container" id="loader">
            <div class="bg-light">
                <div class="text-center">
                    <div class="loader"> <span></span> <span></span> </div>
                </div>
            </div>
        </div>


        <div class="layout-wrapper d-md-flex">

            <div class="d-flex" id="sideBar">

                <!-- Start left sidebar-menu -->
                <?php include_once 'layouts/sidebar.php'; ?>
                <!-- end left sidebar-menu -->

                <div class="chat-leftsidebar ms-lg-0 px-2 position-relative" style="max-width: 3px;min-width: 290px;">

                    <div class="tab-content">

                        <!-- Start chats tab-pane -->
                        <div class="tab-pane fade show active" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
                            <div class="pt-3 px-2">

                                <div class="align-items-center d-flex justify-content-between">
                                    <i class="ri-close-line menu-icon rounded-circle 
                                d-md-none 
                                " data-nav-button=""></i>
                                </div>

                                <div class="align-items-center btn btn-sm d-flex p-2 px-3 rounded-3 text-body w-100 justify-content-between" data-groupId="0">
                                    <span class="align-items-center d-flex">
                                        <i class="fs-4 me-2 ri-contacts-book-line"></i>
                                        <p class="fs-5 fw-bold mb-0">
                                            Contacts
                                        </p>
                                    </span>
                                    <div id="contact-count">
                                    </div>
                                </div>

                                <div class="align-items-center d-flex justify-content-between my-1">

                                    <p class="mb-0 ms-3 fw-bold">Groups</p>
                                    <!-- plus button -->
                                    <button class="btn btn-sm fs-3" id="addGroup">
                                        <i class="ri-add-line align-middle me-1"></i>
                                    </button>

                                </div>

                            </div>

                            <div class="groups pb-4" id="contact-groups"></div>

                            <!-- End chat-message-list -->
                        </div>
                        <!-- End chats tab-pane -->

                    </div>


                </div>

            </div>

            <!-- start chat-leftsidebar -->
            <div class="bg-white ms-lg-0 shadow vh-100 w-100  position-relative">

                <div class="pt-4 d-flex flex-column h-100">
                    <div class="align-items-center d-flex justify-content-between mb-4 px-4">

                        <div class="d-flex">
                            <button class="border-0 menu-icon d-block d-md-none me-2" data-nav-button>
                                <i class="ri-menu-3-line"></i>
                            </button>

                            <span class="align-items-center d-flex d-md-none">

                                <p class="fs-5 fw-bold mb-0">
                                    Contacts
                                </p>
                            </span>

                        </div>

                    </div>

                    <div class=" px-4">
                        <div class="row justify-content-between align-items-center">

                            <div class="col-md-6">
                                <div class="search-box chat-search-box">
                                    <div class="input-group mb-3 rounded-3">
                                        <span class="input-group-text text-muted bg-light pe-1 ps-3">
                                            <i class="ri-search-line search-icon font-size-18"></i>
                                        </span>
                                        <input type="text" class="form-control bg-light" placeholder="Search contacts..." id="searchContact">

                                        <button id="clear-search" class="bg-light border-0 rounded-end-3 text-body-secondary d-none">
                                            <i class="ri-close-fill font-size-18"></i>
                                        </button>

                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">

                                <div class="d-flex justify-content-end align-items-center mb-3">
                                    <button type="submit" class="btn btn-success btn-rounded btn-sm ms-2 px-3" form="exportContactsForm">
                                        <i class="ri-upload-2-line align-middle me-1"></i> Export XLSX
                                    </button>

                                    <button type="button" class="btn btn-primary btn-rounded btn-sm ms-2 px-3" id="importContacts">
                                        <i class="ri-download-2-line align-middle me-1"></i> Import
                                    </button>

                                    <button type="button" class="btn btn-primary btn-rounded btn-sm ms-2 px-3" id="addContact">
                                        <i class="ri-user-add-line align-middle me-1"></i> Add
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>



                    <form class="position-relative px-4 table-responsive" id="exportContactsForm" method="POST">

                        <table class="table table-hover able-striped text-nowrap">
                            <thead class="bg-light sticky-top z-1 top-0">
                                <tr>
                                    <th width="50" class="ps-4">
                                        <input type="checkbox" class="form-check-input" id="exportContactsCheckbox">
                                    </th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Primary Number</th>
                                    <th>Group</th>
                                    <th class="text-end pe-5">Action</th>
                                </tr>
                            </thead>
                            <tbody id="contact-list">
                            </tbody>
                        </table>

                    </form>
                    <!-- End search-box -->
                </div>

                <!-- end p-4 -->




            </div>
            <!-- end chat-leftsidebar -->


        </div>

        <!-- scroll to top -->
        <button class="scroll-bottom-btn me-3 me-lg-4 d-none">
            <i class="ri-arrow-down-line"></i>
        </button>
        <!-- scroll to top -->


        <div class="modal fade" id="reefModal" tabindex="-1" aria-labelledby="reefModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content" id="reefModalContent">
                </div>
            </div>
        </div>



        <!-- JAVASCRIPT CDN -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>
        <!-- ReefJS -->
        <script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>

        <!-- intlTelInput -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/intlTelInput.min.js"></script>
        <!-- use xlsx.mini.min.js from version 0.20.1 -->
        <script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.mini.min.js"></script>

        <!-- image compressor -->
        <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js">
        </script>

        <!-- idb library -->
        <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
        <!-- database init -->
        <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>
        <!-- page common components -->
        <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>
        <script src="<?= APP_URL ?>/public/js/components/contacts.js?v=<?= APP_VER ?>"></script>

        <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>
        <script src="<?= APP_URL ?>/public/js/functions/contacts.js?v=<?= APP_VER ?>"></script>

        <!-- page init -->
        <script src="../public/js/app.js?v=<?= APP_VER ?>"></script>

    </body>


    </html>


<?php else : ?>

    <!doctype html>
    <html lang="en">

    <head>

        <meta charset="utf-8" />
        <title><?= SITE_TITLE ?> | Contacts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">
        <!-- magnific-popup css -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css">


        <!-- intlTelInput css -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/css/intlTelInput.css" />

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

        <div class="loader-container" id="loader">
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

                                    <div class="bg-white rounded-2 shadow p-md-4 p-0 position-relative">

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

                                            <div id="contact" class="accordion">

                                            </div>
                                            <!-- end profile-setting-accordion -->
                                        </div>
                                        <!-- End User profile description -->
                                    </div>
                                    <!-- profile -->


                                    <div class="d-flex justify-content-end mt-4">
                                        <a class="btn btn-secondary btn-sm" href="<?= APP_URL ?>/contacts">
                                            <i class="ri-arrow-left-line"></i> Contacts List
                                        </a>
                                    </div>


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


        <div class="modal fade" id="reefModal" tabindex="-1" aria-labelledby="reefModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content" id="reefModalContent">
                </div>
            </div>
        </div>

        <!-- JAVASCRIPT CDN -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>
        <!-- ReefJS -->
        <script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>
        <!-- idb library -->
        <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
        <!-- database init -->

        <!-- image compressor -->
        <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js">
        </script>


        <!-- intlTelInput -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/intlTelInput.min.js"></script>
        <!-- use xlsx.mini.min.js from version 0.20.1 -->
        <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>
        <!-- page common components -->
        <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>

        <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>

        <!-- page init -->
        <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>

        <script>
            async function initPageData() {

                let {
                    component,
                    render
                } = reef;


                const phoneTypes = await _request(APIS.PHONE_TYPES);

                window.appState.phoneTypes = phoneTypes.data;

                // Function to get group name by ID
                function phoneType(id) {

                    var type = window.appState.phoneTypes.find(function(item) {
                        return item.id == id;
                    });

                    console.log(type.name);

                    return type.name;
                }

                component('#contact', contactDetailsTemplate);


                function contactDetailsTemplate() {


                    const contactId = '<?= $REQUEST ?>';

                    const contact = window.appState.contacts.find(contact => contact.id == contactId);

                    //SET NAME
                    document.getElementById('name').innerHTML = contact.name;


                    const html = `


                                <div class="accordion-item card border mb-2">
                                    <div class="accordion-header" id="personalinfo1">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#personalinfo" aria-expanded="false" aria-controls="personalinfo">
                                            <h5 class="font-size-14 m-0">Contact Information</h5>
                                        </button>
                                    </div>
                                    <div id="personalinfo" class="accordion-collapse collapse show" aria-labelledby="personalinfo1" data-bs-parent="#settingprofile">
                                        <form class="accordion-body" id="personalInfoForm">
                                            <div class="float-end mb-3">
                                                
                                                <button data-edit-contact="${contact.id}" type="button" class="btn btn-light text-dark btn-sm"><i class="ri-edit-fill ms-0 align-middle"></i> Edit</button>
                                                
                                            </div>
                                            <div class="mt-4">
                                                <p class="text-muted mb-1">Name</p>
                                                <p>${contact.name}</p>
                                            </div>

                                            <div class="mt-4">
                                                <p class="text-muted mb-1">Phone</p>                                          
                                                ${ sortByIsPrimary(contact.numbers).map(number => `
                                                    <p class="mb-1"> <span class="${number.is_primary ? 'fw-bold' : ''}">${number.number}</span> • <small>${phoneType(number.phone_type)}</small></p>
                                                `).join('')}
                                            </div>

                                            <div class="mt-4">
                                                <p class="text-muted mb-1">Email</p>
                                                <p>${contact.email ? contact.email : 'N/A'}</p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                
                                
                     `;

                    return html;

                }

                //hide loader
                document.getElementById('loader').classList.add('d-none');
            }

            function sortByIsPrimary(array) {
                return array.sort((a, b) => b.is_primary - a.is_primary);
            }
        </script>



    </body>


    </html>
<?php endif; ?>