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
    </style>

</head>

<body>

    <div class="layout-wrapper d-md-flex">

        <div class="d-flex" id="sideBar">

            <!-- Start left sidebar-menu -->
            <div class="side-menu msg-side-menu flex-column px-lg-1 ms-lg-0">
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
                <div class="flex-md-column my-auto">
                    <ul class="nav nav-pills side-menu-nav justify-content-center" role="tablist">

                        <li class="nav-item d-none" id="sms-icon" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Chats" data-bs-original-title="Chats" role="presentation">
                            <a class="nav-link" href="/messages">
                                <i class="ri-message-3-line"></i>
                            </a>
                        </li>

                        <li class="nav-item d-none" id="whatsup-icon" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Chats" data-bs-original-title="Chats" role="presentation">
                            <a class="nav-link" href="/messages">
                                <i class="ri-whatsapp-line"></i>
                            </a>
                        </li>

                        <li class="nav-item d-none" id="messanger-icon" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Chats" data-bs-original-title="Chats" role="presentation">
                            <a class="nav-link" href="/messages">
                                <i class="ri-messenger-line"></i>
                            </a>
                        </li>

                        <li class="nav-item d-none" id="efax-icon" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="E-Fax" data-bs-original-title=" E-Fax" role="presentation">
                            <a class="nav-link active" href="/efax" aria-selected="false" tabindex="-1" role="tab">
                                <i class="ri-printer-line"></i>
                            </a>
                        </li>

                    </ul>
                </div>
                <!-- end side-menu nav -->



                <div class="flex-md-column">
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

            <div class="chat-leftsidebar ms-lg-0 px-2 position-relative" style="max-width: 3px;min-width: 290px;">

                <div class="tab-content">

                    <!-- Start chats tab-pane -->
                    <div class="tab-pane fade show active" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">
                        <div class="pt-4 px-2">
                            <div class="align-items-center d-flex justify-content-between mb-3">
                                <h4 class="mb-0">E-Fax</h4>
                                <div class="d-flex">

                                    <div id="phone-number">
                                        <select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
                                            <option value="">All Numbers</option>
                                        </select>
                                    </div>


                                </div>

                                <i class="ri-close-line menu-icon rounded-circle 
                                d-md-none 
                                " data-nav-button></i>

                            </div>

                            <div class="search-box chat-search-box">

                            </div> <!-- Search Box-->
                        </div> <!-- .p-4 -->


                        <!-- Start chat-message-list -->
                        <div class="chat-message-list px-2">

                            <ul class="list-unstyled chat-list chat-user-list" id="threads">


                                <li class="thread mb-3" style=" width: 114px;">
                                    <a href="/efax-new" style="cursor: pointer;background: var(--bs-primary); color: #fff;" class="py-2">
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


                                <li>
                                    <div class="accordion" id="accordionExample">
                                        <?php
                                        $menu = [
                                            [
                                                'name' => 'Inbox',
                                                'link' => '/efax',
                                                'icon' => 'ri-mail-line',
                                                'sub' => [
                                                    [
                                                        'name' => 'School Assignments',
                                                        'icon' => 'ri-folder-line',
                                                    ],
                                                    [
                                                        'name' => 'Office Files',
                                                        'icon' => 'ri-folder-line',
                                                    ],
                                                ]
                                            ],
                                            [
                                                'name' => 'Sent',
                                                'link' => '/efax-sent',
                                                'icon' => 'ri-mail-send-line',
                                                'sub' => []
                                            ],
                                            [
                                                'name' => 'Archived',
                                                'link' => '/efax-archive',
                                                'icon' => 'ri-file-edit-line',
                                                'sub' => []
                                            ],
                                            [
                                                'name' => 'Queued',
                                                'link' => '/efax-queued',
                                                'icon' => 'ri-hourglass-fill',
                                                'sub' => []
                                            ],
                                        ]

                                        ?>

                                        <?php foreach ($menu as $key => $value) : ?>

                                            <div class="accordion-item mb-2">

                                                <h2 class="accordion-header d-flex">
                                                    <?php if (empty($value['sub'])) : ?>
                                                        <a class="accordion-button
                                                        fw-light
                                                        " href="javascript:void(0)" data-navigate="<?= $value['name'] ?>">
                                                            <i class="<?= $value['icon'] ?> me-2"></i>
                                                            <?= $value['name'] ?>
                                                        </a>
                                                    <?php else : ?>

                                                        <a href="javascript:void(0)" data-navigate="<?= $value['name'] ?>" class="bg-dark-subtle d-flex fs-6 fw-lighter" style="width:80%">
                                                            <i class="<?= $value['icon'] ?> me-2"></i>
                                                            <?= $value['name'] ?>
                                                        </a>

                                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#<?= $value['name'] ?>" style="width:20%"></button>
                                                    <?php endif; ?>
                                                </h2>


                                                <div id="<?= $value['name'] ?>" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#<?= $value['name'] ?>">
                                                    <div class="accordion-body bg-light-subtle p-0" id="folders">
                                                    </div>
                                                </div>
                                            </div>

                                        <?php endforeach; ?>

                                    </div>
                                </li>

                            </ul>

                        </div>
                        <!-- End chat-message-list -->
                    </div>
                    <!-- End chats tab-pane -->

                </div>
                <!-- end tab content -->
                <div id="folder-actions" class="bg-dark-subtle p-2 shadow position-absolute bottom-0 start-0 end-0" style="width: 100%;">
                </div>
            </div>






        </div>


        <div class="bg-body ms-lg-0 shadow vh-100 w-100  position-relative" id="page">
            <div class="spinner" id="loader">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

    </div>

    <!-- Modal -->
    <div class="modal fade" id="filePreviewModal" tabindex="-1" aria-labelledby="filePreviewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-lg-down">
            <div class="modal-content">
                <div class="modal-header">

                    <div class="d-flex align-items-center">
                        <h1 class="modal-title fs-5" id="filePreviewModalLabel"></h1> <small class="ms-2">(<span id="filePreviewModalDate"></span>)</small>
                    </div>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">

                    <div class="spinner" id="canvas-loader">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <div style="width: 100%; height: 75vh;">
                        <iframe id="filePreviewModalIframe" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>

                </div>

            </div>
        </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="createFolder" tabindex="-1" aria-labelledby="createFolder" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="createFolderForm" method="POST">

                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="createFolder">Create Folder</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="folderName" class="col-form-label">Folder Name</label>
                            <input class="form-control bg-light border-light" name="name" placeholder="Folder Name">
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- modal rename folder-->
    <div class="modal fade" id="renameFolder" tabindex="-1" aria-labelledby="renameFolder" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="renameFolderForm" method="POST">

                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="renameFolder">Rename Folder</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="folderName" class="col-form-label">Folder Name</label>
                            <input class="form-control bg-light border-light" name="name" placeholder="Folder Name">
                        </div>
                    </div>

                    <div class="modal-footer">

                        <button type="submit" name="uuid" class="btn btn-primary">Rename</button>

                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- modal rename folder-->
    <div class="modal fade" id="moveToFolder" tabindex="-1" aria-labelledby="moveToFolder" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="moveToFolderForm" method="POST">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="moveToFolder">Move to Folder</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="folderName" class="col-form-label">Folder Name</label>
                            <select class="form-select" name="folder_uuid">
                                <option value="">Select Folder</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" name="uuid" class="btn btn-primary">Move</button>
                    </div>
                </form>
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
    <script src="https://cdn.jsdelivr.net/npm/reefjs@12/dist/reef.min.js"></script>

    <!-- TIff JS-->
    <script src="https://cdn.jsdelivr.net/gh/seikichi/tiff.js@master/tiff.min.js"></script>

    <!-- database init -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>


    <!-- EFax -->
    <!-- <script src="<= APP_URL ?>/public/js/efax.js?v=<= APP_VER ?>"></script> -->

    <script>
        //components


        const faxListComponent = (Page) => {

            let faxData = {
                items: []
            };

            faxData.items = cloneObjFromProxy(data.fax[Page].items);

            if (data.selectedPhone) {
                faxData.items = faxData.items.filter(fax => fax.service_phone === data.selectedPhone);
            }

            return faxData.items.map(fax => {

                const {
                    name,
                    number,
                    uuid,
                    file,
                    date
                } = fax;

                const downloadFile = `${atob(window.ipbxapi_host)}/efax/storage/${fax.file_url}`;
                const isQueuedPage = data.currentPage === 'Queued';
                const dateString = utcToPlainDate(date);

                return `
                        <tr class="align-middle">


                            <td>
                                ${name}
                            </td>
                            <td>    
                                ${number}
                            </td>
                            <td>
                                ${formatDate(dateString)} - ${formatDate(dateString, 'timeOnly')}
                            </td>
                            ${isQueuedPage ? `<td>${fax.fax_status}</td><td>${fax.fax_retry_count}</td>` : ''}
                            <td>
                            
                                <a href="javascript:void(0)" class="btn btn-sm btn-outline-light ms-2"
                                data-bs-target="#filePreviewModal" data-modal-file="${uuid}" data-modal-title="${number}" data-modal-date="${formatDate(dateString)} - ${formatDate(dateString, 'timeOnly')}">
                                        <i class="ri-eye-line"></i>
                                </a>

                                    <a data-download="${uuid}" class="btn btn-sm btn-outline-light ms-2">
                                        <i class="ri-download-2-line"></i>
                                    </a>


                                    <button data-fax-action="${uuid}" data-fax-action-type="unarchive"
                                            class="btn btn-sm btn-outline-light ms-2 ${Page !== 'Archived' ? 'd-none' : ''}">
                                            <i class="ri-refresh-line"></i>
                                    </button>

                                    <button data-fax-action="${uuid}" data-fax-action-type="archive"
                                            class="btn btn-sm btn-outline-light ms-2 ${Page !== 'Inbox' ? 'd-none' : ''}">
                                            <i class="ri-delete-bin-line"></i>
                                    </button>


                                    <button data-move-to="${uuid}" 
                                            class="btn btn-sm btn-outline-light ms-2 ${Page !== 'Inbox' ? 'd-none' : ''}">
                                        <i class="ri-folder-transfer-line"></i>
                                    </button>
                                
                            </td>
                        </tr>
                    `;
            }).join('');
        };


        let pageComponent = () => {

            const pageTitle = data.currentPage;

            const folderName = data.folders.find(folder => folder.uuid == data.selectedFolder);

            return `
        <div class="pt-4 d-flex flex-column h-100">

            <div class="align-items-center d-flex mb-4 px-4">
                <i class="ri-menu-line menu-icon me-3 d-md-none" data-nav-button></i>
                <h4 class="mb-0">${pageTitle} ${folderName ? '<small class="fs-6 fw-light text-black-50">(' + folderName.name + ')</small>' : ''}</h4>
            </div>

            <div class="search-box chat-search-box px-4">
                <div class="input-group mb-3 rounded-3">
                    <span class="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                        <i class="ri-search-line search-icon font-size-18"></i>
                    </span>
                    <input type="text" class="form-control bg-light" placeholder="Search Fax" id="searchInput">

                    <button id="clear-search" class="bg-light border-0 rounded-end-2 text-body-secondary d-none">
                        <i class="ri-close-fill font-size-18"></i>
                    </button>
                </div>
            </div>

            <div class="position-relative px-4 table-responsive" id="faxList">
            <table class="table table-hover able-striped text-nowrap">
                <thead class="bg-light sticky-top top-0">
                    <tr>

                        <th scope="col">${pageTitle === 'Sent' ? 'Receiver Name' : pageTitle === 'Archived' ? 'Name' : 'Sender Name'}</th>
                        <th scope="col">${pageTitle === 'Sent' ? 'Receiver Number' : pageTitle === 'Archived' ? 'Number' : 'Sender Number'}</th>

                        <th scope="col">Date</th>
                        ${pageTitle === 'Queued' ? `
                        <th scope="col">Status</th>
                        <th scope="col">Retry</th>
                        ` : ''}
                        <th scope="col">Actions</th>
                    </tr>
                <tbody>
                    ${faxListComponent(pageTitle)}
                </tbody>
            </table>
        </div>



        </div>

        

        `
        }

        let foldersComponent = () => {

            const list = data.folders;

            var folders = '';

            //loop through folders
            list.forEach(folder => {
                //append to select
                folders += `
        <div style="cursor: pointer;" class="border-0 border-1 border-bottom ps-3 py-2 folder-list ${data.selectedFolder == folder.uuid ? 'bg-primary text-white' : ''}
        " data-open-folder="${folder.uuid}">
            <div class="media ps-3">
                <div class="chat-user-img align-self-center me-2 ms-0">
                    <div class="">
                        <i class="ri-folder-line"></i>
                    </div>
                </div>
                <div class="media-body overflow-hidden">

                    <span class="text-truncate font-size-15 mb-1">
                        ${folder.name} 
                    </span>
                

                </div>
            </div>
        </div>
        `;

            });

            return folders;

        }

        let folderActionComponent = () => {

            return `

            <div class="d-flex justify-content-center align-items-center">

                <button class="btn btn-sm btn-outline-light mx-1" data-bs-toggle="modal" data-bs-target="#createFolder" ${data.currentPage !== 'Inbox' || data.selectedFolder ? 'disabled' : ''}>
                    <i class="ri-folder-add-line"></i>
                </button>

                <button data-action="rename" class="btn btn-sm btn-outline-light mx-1" ${data.selectedFolder ? '' : 'disabled'}>
                    <i class="ri-pencil-line"></i>
                </button>

                <button data-action="delete" class="btn btn-sm btn-outline-light mx-1" ${data.selectedFolder ? '' : 'disabled'}>
                    <i class="ri-delete-bin-7-line"></i>
                </button>

                <button data-action="move" class="btn btn-sm btn-outline-light mx-1" ${data.selectedFolder ? '' : 'disabled'}>
                    <i class="ri-folder-transfer-fill"></i>
                </button>

            </div>

            `;

        }



        let db; // Declare db in the global scope

        async function initializeDB() {
            db = await idb.openDB("eFAX", 1, {
                upgrade(db) {

                    //threads
                    if (!db.objectStoreNames.contains("fax")) {

                        const faxStore = db.createObjectStore("fax", {
                            keyPath: "uuid",
                        });

                        faxStore.createIndex("type", "type", {
                            unique: false,
                        });

                        faxStore.createIndex("service_phone", "service_phone", {
                            unique: false,
                        });

                        faxStore.createIndex('compound', ['service_phone', 'type', 'epoch']);

                    }

                    //folders
                    if (!db.objectStoreNames.contains("folders")) {

                        const foldersStore = db.createObjectStore("folders", {
                            keyPath: "uuid",
                        });

                        foldersStore.createIndex("name", "name", {
                            unique: false,
                        });
                    }

                },
            });
        }

        initializeDB();

        async function saveData(state) {

            const faxData = state.fax;

            //loop through fax keys 

            for (const [fax] of Object.entries(faxData)) {
                //loop through fax types

                faxData[fax].items.forEach((faxFile) => {
                    faxFile.type = fax;
                    const idb = db.transaction("fax", "readwrite").objectStore("fax");
                    idb.put(cloneObjFromProxy(faxFile));
                });


            }


           

            
        }

        // async function saveData(state) {

        //     const phoneData = state.fax;

        //     for (const [phone, fax] of Object.entries(phoneData)) {

        //         for (const [type, typeData] of Object.entries(fax)) {

        //             typeData.items.forEach((faxFile) => {

        //                 faxFile.type = type;

        //                 faxFile.phone_id = phone;

        //                 const idb = db.transaction("fax", "readwrite").objectStore("fax");

        //                 idb.put(cloneObjFromProxy(faxFile));
        //             });

        //         }

        //     }
        // }


        async function getObject() {

            const faxService = activeServicesByType['efax'];

            const data = {
                currentPage: 'Inbox',
                fax: {},
                folders: [],
                selectedFolder: null,
                selectedPhone: '',
            };

            faxService.forEach(async service => {

                data.fax[service.phone_id] = {

                    Inbox: {
                        hasMore: true,
                        items: await getDataFromDB(service.phone_id, 'Inbox', 0, 30),
                    },
                    Sent: {
                        hasMore: true,
                        items: await getDataFromDB(service.phone_id, 'Sent', 0, 30),
                    },
                    Archived: {
                        hasMore: true,
                        items: await getDataFromDB(service.phone_id, 'Archived', 0, 30),
                    },
                    Queued: {
                        hasMore: true,
                        items: await getDataFromDB(service.phone_id, 'Queued', 0, 30),
                    }

                };

            });

            return data;

        }

        async function getDataFromDB(phoneId, type, epoch = 0, maxData = 30) {

            const items = [];
            const transaction = db.transaction('fax', 'readonly');
            const messageStore = transaction.objectStore('fax');
            const compoundIndex = messageStore.index('compound');

            let range = IDBKeyRange.bound([phoneId, type, -Infinity], [phoneId, type, epoch ? epoch : Infinity], false, false);

            let cursor = await compoundIndex.openCursor(range, 'prev');

            while (cursor && items.length < maxData) {
                items.push(cursor.value);
                // Advance to the next record
                cursor = await cursor.continue();
            }

            return items;
        }


        // async function getData(type, phone_service = 0, epoch = 0, limit = 30) {

        //     // Get a read-only transaction on the 'store' object store
        //     const tx = await db.transaction(["fax"], 'readonly');

        //     // Get a reference to the 'store' object store
        //     const index = await tx.objectStore("fax").index("type");

        //     // Declare an array to store the record values
        //     const values = [];

        //     // Declare a counter variable
        //     let count = 0;

        //     // Declare a range variable
        //     var range = IDBKeyRange.only(type, true);

        //     // Get a cursor that iterates over the records within the key range in descending order by key
        //     var cursor = await index.openCursor(range, 'prev');


        //     // Iterate over the cursor
        //     while (cursor) {

        //         let phon_condition = phone_service ? cursor.value.phone_id == phone_service : true;

        //         // Check if the epoch value of the current record is greater than or equal to the provided epoch
        //         if (cursor.value.epoch > epoch && phon_condition) {
        //             // Push the current record's value to the values array
        //             values.push(cursor.value);
        //             // If the limit is not zero and the counter is equal to the limit, break out of the loop
        //             if (limit !== 0 && ++count === limit) {
        //                 break;
        //             }
        //         }

        //         // Continue to the next record in the cursor
        //         cursor = await cursor.continue();
        //     }

        //     // Return the values array
        //     return values;
        // }


        // Create a reactive store
        function loadAndInitializeState() {

            const faxService = activeServicesByType['efax'];

            let stateObject = {

                currentPage: 'Inbox',

                fax: {
                    Inbox: {
                        hasMore: true,
                        items: [],
                    },
                    Sent: {
                        hasMore: true,
                        items: [],
                    },
                    Archived: {
                        hasMore: true,
                        items: [],
                    },
                    Queued: {
                        hasMore: true,
                        items: [],
                    }
                },

                folders: [],

                selectedFolder: null,
                selectedPhone: '',
            }

            return stateObject;

        }

        async function loadApiFax(type = 'Inbox', folder = '') {

            let url = '/efax/' + (folder ? 'folder/' + folder : type);

            const response = await _request(url);

            data.fax[type].items = response.data;

            await saveData(data);

        }

        async function fetchFolders() {

            const res = await _request("/efax/folders");
            if (res.data) {
                data.folders = res.data;
            } else {
                data.folders = [];
            }
            return data.folders; // Add a return statement

        }


        $(async function() {

            const faxService = activeServicesByType['efax'];

            faxService.forEach(service => {
                //POPULATE SELECT
                $('#threadsPhone').append(`<option value="${service.number}">${service.number}</option>`);
            });

            let {
                store,
                component
            } = reef;

            let stateData = await loadAndInitializeState();

            data = new store(stateData);

            component('#page', pageComponent);
            component('#folders', foldersComponent);
            component('#folder-actions', folderActionComponent);

            //load folders
            await fetchFolders();

            //load fax
            await loadApiFax();


            detectScrollToOffset('#faxList', 100, 'bottom', async () => {

                if (data.selectedPhone.length === 0) {

                    const faxData = data.fax[data.currentPage];

                    //find last item
                    const lastItem = faxData.items[faxData.items.length - 1];

                    let url = '/efax/' + (data.selectedFolder ? 'folder/' + data.selectedFolder : data.currentPage) + '?before=' + lastItem.epoch + '&limit=15';

                    const response = await _request(url);

                    data.fax[data.currentPage].items.push(...response.data);

                    //save data
                    await saveData(data);

                }

            });

        });


        //data-open-folder click event 
        $(document).on('click', '[data-open-folder]', async function() {

            const folder = $(this).data('open-folder');

            data.currentPage = 'Inbox';
            data.selectedFolder = folder;


            //loop through all data-navigate
            $('[data-navigate]').each(function() {
                $(this).removeClass('menu-active');
            });

            await loadApiFax(data.currentPage, data.selectedFolder);

        });

        //data-navigate
        $(document).on('click', '[data-navigate]', async function() {

            const page = $(this).data('navigate');

            //set current page
            data.currentPage = page;
            data.selectedFolder = null;


            //loop through all data-navigate
            $('[data-navigate]').each(function() {
                $(this).removeClass('menu-active');
            });

            //data-open-folder
            $('[data-open-folder]').each(function() {
                $(this).removeClass('menu-active');
            });

            if (page == data.currentPage) {
                $(this).addClass('menu-active');
            }
            await loadApiFax(page);

        });

        //phone-number change event
        $(document).on('change', '#threadsPhone', function() {

            const phone = $(this).val();
            data.selectedPhone = phone;

        });


        //create folder
        $('#createFolderForm').submit(async function(e) {

            e.preventDefault();

            let data = {
                name: $(this).find('[name="name"]').val()
            }

            let res = await _request("/efax/createfolder", "POST", data);

            if (!res.error) {

                toast(res.msg);

                $('#createFolder').modal('hide');
                //clear input
                $(this).find('[name="name"]').val('');

            } else {
                toast('Something went wrong', 'danger');
            }

            await fetchFolders();

        });

        //data-action click event
        $(document).on('click', '[data-action]', function() {

            const action = $(this).data('action');
            const uuid = data.selectedFolder;
            const folderName = data.folders.find(folder => folder.uuid == uuid).name;

            if (action == 'rename') {
                $('#renameFolder').modal('show');
                $('#renameFolderForm').find('[name="uuid"]').val(uuid);
                $('#renameFolderForm').find('[name="name"]').val(folderName.trim());
            } else if (action == 'delete') {
                deleteFolder(uuid);
            } else if (action == 'move') {
                moveToFolder(uuid);
            }
        });


        const renameFolderForm = $('#renameFolderForm');
        const nameInput = renameFolderForm.find('[name="name"]');
        const uuidInput = renameFolderForm.find('[name="uuid"]');

        renameFolderForm.submit(async function(e) {
            e.preventDefault();

            const data = {
                uuid: uuidInput.val(),
                name: nameInput.val()
            };


            const res = await _request("/efax/renamefolder", "POST", data);

            if (!res.error) {
                toast(res.msg);
                await fetchFolders();
                $('#renameFolder').modal('hide');
                nameInput.val('');
                uuidInput.val('');
            } else {
                toast('Something went wrong', 'danger');
            }

        });


        const deleteFolder = async (uuid) => {

            const res = await _request("/efax/deletefolder", "POST", {
                uuid
            });

            if (!res.error) {
                toast(res.msg);
                loadApiFax(data.currentPage, data.selectedFolder ?? '');
                await fetchFolders();
            } else {
                toast('Something went wrong', 'danger');
            }

        };

        $(document).on('click', '[data-fax-action]', async function() {
            const uuid = $(this).attr('data-fax-action');
            const action = $(this).attr('data-fax-action-type');


            const res = await _request("/efax/action", "POST", {
                uuid,
                action
            });

            if (!res.error) {
                toast(res.msg);
                loadApiFax(data.currentPage, data.selectedFolder ?? '');
            } else {
                toast('Something went wrong', 'danger');
            }

        });



        //data-move-to click event
        $(document).on('click', '[data-move-to]', async function() {

            const uuid = $(this).data('move-to');

            //show rename folder modal
            $('#moveToFolder').modal('show');
            //find name="uuid" and set attribute value to uuid
            $('#moveToFolderForm').find('[name="uuid"]').val(uuid);

            await fetchFolders();

            //set options
            $('#moveToFolderForm').find('[name="folder_uuid"]').html(`
                <option value="0">Select Folder</option>
                ${data.folders.map(folder => `<option value="${folder.uuid}">${folder.name}</option>`)}
                
            `);

        });


        //moveToFolderForm on submit
        $('#moveToFolderForm').submit(async function(e) {

            e.preventDefault();

            let data = {
                uuid: $(this).find('[name="uuid"]').val(),
                folder_uuid: $(this).find('[name="folder_uuid"]').val()
            }

            $('#moveToFolder').modal('hide');

            //clear input
            $(this).find('[name="uuid"]').val('');
            $(this).find('[name="folder_uuid"]').val('');

            let res = await _request("/efax/movetofolder", "POST", data);

            if (!res.error) {
                toast(res.msg);
                loadApiFax();
            } else {
                toast('Something went wrong', 'danger');
            }

        });

        //data-nav-button
        $(document).on('click', '[data-nav-button]', function() {
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

        // show file preview modal
        $(document).on('click', '[data-bs-target="#filePreviewModal"]', function() {
            // Show modal
            $('#canvas-loader').show();

            let file = $(this).attr('data-modal-file');
            let title = $(this).attr('data-modal-title');
            let date = $(this).attr('data-modal-date');

            // Set title
            $('#filePreviewModalLabel').html(title);
            $('#filePreviewModalDate').html(date);

            // Hide
            $('#filePreviewModalIframe').addClass('d-none');


            Tiff.initialize({
                TOTAL_MEMORY: 16777216 * 10
            });

            const param = data.currentPage == 'Queued' ? '?queued' : '';

            $.ajax({

                type: 'GET',
                url: atob(window.ipbxapi_host) + '/efax/storage/' + file + param,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('auth_token'));
                },
                xhrFields: {
                    responseType: 'blob'
                },

                //filePreviewModalIframe
                success: function(data) {

                    var blob = new Blob([data], {
                        type: 'application/pdf'
                    });

                    var url = window.URL.createObjectURL(blob);

                    $('#filePreviewModalIframe').attr('src', url);
                    $('#filePreviewModalIframe').removeClass('d-none');

                    $('#canvas-loader').hide();

                }

            });

            $('#filePreviewModal').modal('show');
        });



        //data-download click event
        $(document).on('click', '[data-download]', function() {
            const url = $(this).attr('data-download');
            const param = data.currentPage == 'Queued' ? '?download&&queued' : '?download';
            const apiUrl = atob(window.ipbxapi_host) + '/efax/storage/' + url + param;

            $.ajax({
                type: 'GET',
                url: apiUrl,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('auth_token'));
                },
                xhrFields: {
                    responseType: 'blob'
                },
                success: function(data) {
                    var blob = new Blob([data], {
                        type: 'application/pdf'
                    });
                    var url = window.URL.createObjectURL(blob);

                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'fax.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                }
            });
        });
    </script>


</body>


</html>