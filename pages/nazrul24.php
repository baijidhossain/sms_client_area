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

</head>

<body>

    <div class="loader-container">
        <div class="bg-light">
            <div class="text-center">
                <div class="loader"> <span></span> <span></span> </div>
            </div>
        </div>
    </div>

    <div class="layout-wrapper d-md-flex">
        <!-- Start left sidebar-menu -->
        <div class="side-menu msg-side-menu flex-md-column px-lg-1 ms-lg-0">
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

            <div class="flex-md-column d-none d-md-block">
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
        <div class="chat-leftsidebar ms-lg-0">

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
                                        <div class="bg-light" style="display: block; ">
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
                                        <h4 class="d-inline px-3 py-2 rounded-pill bg-secondary text-white fs-4">Start Conversation</h4>
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
    <div class="modal" tabindex="-1" id="newConversationteModal" tabindex="-1" aria-labelledby="newConversationteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <form id="createConversation" method="POST" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Conversation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div id="new_conversation_phone"></div>

                    <div class="mb-3 d-grid">
                        <label for="recipient-name" class="col-form-label">Recipient Phone</label>
                        <input type="tel" class="form-control bg-light border-light" name="recipient" required>
                    </div>

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

    <!-- database init -->
    <script>
        let db; // Declare db in the global scope

        async function initializeDB() {
            db = await idb.openDB("iPBXSMS", 1, {
                upgrade(db) {


                    //threads
                    if (!db.objectStoreNames.contains("threads")) {
                        const threadStore = db.createObjectStore("threads", {
                            keyPath: "thread_id",
                        });
                        threadStore.createIndex("order_by_lmsg", "message_id");
                    }

                    //phone data
                    if (!db.objectStoreNames.contains("phoneThreads")) {

                        const threadStore = db.createObjectStore("phoneThreads", {
                            keyPath: "thread_id",
                        });

                        threadStore.createIndex("message_id", "message_id");

                        threadStore.createIndex('phone_id', 'phone_id', {
                            multiEntry: true
                        });

                    }

                    if (!db.objectStoreNames.contains("track_lastId")) {

                        db.createObjectStore("track_lastId", {
                            autoIncrement: true
                        });
                    }

                    //messages
                    if (!db.objectStoreNames.contains("messages")) {

                        const messageStore = db.createObjectStore("messages", {
                            keyPath: "id",
                        });
                        messageStore.createIndex("thread_id", "thread_id");
                        messageStore.createIndex("thread_id, msg_id", ['thread_id', 'id']);
                    }

                },
            });
        }


        async function savePhoneDataToDB(phoneData) {

            // Save phone threads
            const phoneThreadsStore = db.transaction("phoneThreads", "readwrite").objectStore("phoneThreads");

            //foreach with key and value
            let phoneIds = Object.keys(phoneData.threads).map(key => parseInt(key));

            for (const [key, value] of Object.entries(phoneData.threads)) {

                for (const thread of value.items) {

                    thread.phone_id = []; // Initialize an empty array

                    for (const participant of thread.participants) {

                        if (phoneIds.includes(participant.phone_id)) {

                            // Add participant.phone_id to thread.phone_id
                            thread.phone_id.push(participant.phone_id);

                        }
                    }

                    // Save the modified thread
                    phoneThreadsStore.put(thread);
                }
            }
        }

        async function saveTrackLastIdToDB(data) {

            console.log(data);
            const lastTrackIdStore = db.transaction("track_lastId", "readwrite").objectStore("track_lastId");

        }


        // async function saveMessagesToDB(messages) {
        //     //Save messages thread_id as key from state.messages[].thread.id
        //     const messageStore = db.transaction("messages", "readwrite").objectStore("messages");
        //     for (const message of messages) {

        //         if (message !== undefined) {
        //             await messageStore.put(message);
        //         }
        //     }
        // }

        // async function saveThreadToDB(threads) {

        //     //Save threads
        //     const store = db.transaction("threads", "readwrite").objectStore("threads");
        //     for (const thread of threads) {
        //         await store.put(thread);
        //     }
        // }

        async function saveDataToDB(storeName, data) {

            var objectStore = db.transaction(storeName, 'readwrite').objectStore(storeName);

            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item !== undefined) {
                        await objectStore.put(item);
                    }
                }
            } else {
                await objectStore.put(data);
            }
        }

        async function updateThread(thread) {

            const store = db.transaction("threads", "readwrite").objectStore("threads");
            await store.put(thread);

        }

        async function updateMessagesToDB(message) {

            const store = db.transaction("messages", "readwrite").objectStore("messages");
            await store.put(message);

        }

        async function loadFromDB() {

            // get phone threads from indexDB
            let phoneData = {
                selected: 0,
                threads: []
            };

            for (const phoneId of userPhoneServices) {

                if (!phoneData.threads[phoneId]) {
                    phoneData.threads[phoneId] = [];
                }

                let phoneThreads = await getPhoneThreadFromDB(phoneId);
                phoneData.threads[phoneId] = phoneThreads;

            }

            return {

                threads: {
                    hasMore: true,
                    //items: await loadThreadsFromDB(0, 30),
                    items: await getItemsFromDB("threads", "order_by_lmsg", null, 20),
                },
                messages: await getMessagesFromDB(),
                phoneData: phoneData ?? {
                    selected: 0,
                    threads: {},
                }
            };

        }

        async function closeDBConnection() {
            db.close();
        }

        async function wipeDatabase() {
            await closeDBConnection();
            await idb.deleteDB("iPBXSMS");
        }

        async function getPhoneThreadFromDB(phoneId, upper = 0, limit = 30) {

            const tx = db.transaction(['phoneThreads'], 'readonly');
            const index = tx.objectStore('phoneThreads').index('message_id');

            const values = {
                items: [],
                hasMore: true,
                item_limit: 30
            };

            if (upper === 0) {
                var cursor = await index.openCursor(null, 'prev');

            } else {
                var range = IDBKeyRange.upperBound(upper, true);
                var cursor = await index.openCursor(range, 'prev');
            }

            // Use a while loop to iterate over the records
            while (cursor) {
                cursor.value.phone_id.forEach(phone_id => {

                    if (phone_id == phoneId) {
                        if (values.items.length < limit) {
                            // Push the record value to the array
                            values.items.push(cursor.value);
                        }
                    }
                });
                // Advance to the next record
                cursor = await cursor.continue();
            }
            // Return the values array
            return values;

        }

        async function getMessagesFromDB(limit = 30) {

            const transaction = db.transaction('messages', 'readonly');
            const index = transaction.objectStore('messages').index('thread_id');

            let values = [];

            var cursor = await index.openCursor(null, 'prev');

            while (cursor) {

                let threadID = cursor.value.thread_id;

                if (!values[threadID]) {
                    values[threadID] = {
                        items: [],
                        thread_id: threadID,
                        hasMoreMessages: true
                    };
                }

                if (values[threadID].items.length < limit) {
                    // Key already exists, so push the value under the existing key
                    values[threadID].items.push(cursor.value);
                }

                // Advance to the next record
                cursor = await cursor.continue();
            }

            // return values;
            return values;
        }


        async function getItemsFromDB(storeName, indexName = null, range = null, limit = 30) {

            // Get a read-only transaction on the 'store' object store
            const tx = db.transaction([storeName], 'readonly');

            // Get the 'index' index from the transaction
            let index = tx.objectStore(storeName);

            if (indexName) {
                index = index.index(indexName);
            }

            // Declare an array to store the record values
            const values = [];

            // Declare a counter variable
            let count = 0;

            // Get a cursor that iterates over the records within the key range in descending order by key
            var cursor = await index.openCursor(range, 'prev');

            // Use a while loop to iterate over the records
            while (cursor) {
                // Check if the counter is less than the limit parameter
                if (count < limit) {
                    // Push the record value to the array
                    values.push(cursor.value);
                    // Increment the counter by 1
                    count++;
                } else {
                    // Break out of the loop
                    break;
                }
                // Advance to the next record
                cursor = await cursor.continue();
            }

            // Return the values array
            return values;
        }


        // async function getItemsFromDB(storeName, indexName, upper, limit = 20) {

        //     // Get a read-only transaction on the 'store' object store
        //     const tx = db.transaction([storeName], 'readonly');

        //     // Get the 'index' index from the transaction
        //     const index = tx.objectStore(storeName).index(indexName);

        //     // Declare an array to store the record values
        //     const values = [];

        //     // Declare a counter variable
        //     let count = 0;

        //     // Check if the upper parameter is zero or not
        //     if (upper === 0) {
        //         // If zero, get a cursor that iterates over all records in descending order by key
        //         var cursor = await index.openCursor(null, 'prev');
        //     } else {
        //         // If not zero, create a key range object with an upper bound of the upper parameter
        //         var range = IDBKeyRange.upperBound(upper, true);
        //         // Get a cursor that iterates over the records within the key range in descending order by key
        //         var cursor = await index.openCursor(range, 'prev');
        //     }

        //     // Use a while loop to iterate over the records
        //     while (cursor) {
        //         // Check if the counter is less than the limit parameter
        //         if (count < limit) {
        //             // Push the record value to the array
        //             values.push(cursor.value);
        //             // Increment the counter by 1
        //             count++;
        //         } else {
        //             // Break out of the loop
        //             break;
        //         }
        //         // Advance to the next record
        //         cursor = await cursor.continue();
        //     }

        //     // Return the values array
        //     return values;
        // }
    </script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>

    <!-- custom js -->
    <script>
        const loader = `<div class="chat-loader-section"> <div class="loader_bg bg-light" style="display: block;"> <div class="text-center"> <div class="loader"> <span></span> <span></span> </div></div></div></div>`;
        const spinner = `<div class="spinner-border" role="status" style="--bs-spinner-width: 1rem;--bs-spinner-height: 1rem;"><span class="visually-hidden">Loading...</span></div>`;

        // const userPhoneServices = new Set(JSON.parse(localStorage.user || '{}').services?.sms.map(authPhone => authPhone.phone_id));
        const userPhoneServices = new Set(JSON.parse(localStorage.user || '{}').services?.sms?.filter(authPhone => authPhone.status == 'Active').map(authPhone => authPhone.phone_id));

        // Allowing file type
        const allowedExtensions = /(.jpg|.jpeg|.png)$/i;


        function cloneObjFromProxy(val, visited = new WeakMap()) {
            if (visited.has(val)) {
                return visited.get(val);
            }

            if (val instanceof Array) {
                const newArray = val.map(item => cloneObjFromProxy(item, visited));
                visited.set(val, newArray);
                return newArray;
            }

            if (val instanceof Object) {
                const keys = Object.getOwnPropertyNames(val);
                const newObj = {};

                visited.set(val, newObj);

                for (const key of keys) {
                    newObj[key] = cloneObjFromProxy(val[key], visited);
                }

                return newObj;
            }

            return val;
        }

        // Create a reactive store
        async function loadAndInitializeState() {

            let stateObject = {
                threads: {
                    hasMore: true,
                    items: [],
                },
                messages: [],
                selectedThreadId: 0,
                selectedThreadInfo: {},
                processing: false,
                filteredThreads: null,
                searchQuery: '',
                phoneData: {
                    selected: 0,
                    threads: {},
                }
            };

            try {
                // Get a timestamp before the code
                var start = performance.now();

                await initializeDB();
                const localState = await loadFromDB();

                if (Object.keys(localState).length !== 0) {

                    stateObject.threads = localState.threads;
                    stateObject.messages = localState.messages;
                    stateObject.phoneData = localState.phoneData;

                }

                // Get another timestamp after the code
                var end = performance.now();

                // Calculate the difference in milliseconds
                var timeTaken = end - start;

                // Log the result
                console.log(`Time taken to execute = ${timeTaken} milliseconds`);

                return stateObject;

            } catch (error) {
                console.error("Error:", error);
            }
        }


        function selectPhoneComponent() {

            //if data.selectedThreadInfo.participants is empty then return
            if (!data.selectedThreadInfo.participants?.length) {
                return '';
            }

            const authPhonesArray = data.selectedThreadInfo.participants.filter(participant => userPhoneServices.has(participant.phone_id));

            //if authPhonesArray items are same
            if (authPhonesArray.every((val, i, arr) => val.phone_id === arr[0].phone_id)) {
                return '';
            }

            //if authPhonesArray is empty then return
            if (authPhonesArray.length < 2) {
                return '';
            }

            return `<div class="dropup end-0 position-absolute top-0">
                <button type="button" class="btn dropdown-toggle font-size-16 px-2 waves-effect waves-light text-primary" data-bs-toggle="dropdown">
                    <i class="ri-cellphone-fill"></i> <span data-selected-number>${authPhonesArray[0].number.slice(-4)}</span>
                </button>

                <input type="hidden" data-phone-id name="phone_id" value="${authPhonesArray[0].phone_id}">

                <ul class="dropdown-menu dropdown-menu-end mb-2 rounded-3">
                    ${authPhonesArray.map((phone, index) => `
                    <li class="px-2" data-select-phone-id="${phone.phone_id}" data-number="${phone.number}">
                        <a class="align-items-center d-flex dropdown-item px-2 rounded-3 text-end" href="#">
                            <span class="d-grid">
                                <span class="fw-bolder">
                                    Phone ${index + 1}
                                </span>
                                ${formatPhoneNumber(phone.number, phone.format_template)}
                            </span>
                            <span class="align-items-center avatar-xs bg-primary-subtle d-flex justify-content-center ms-2 rounded-3 text-primary">
                                <i class="ri-cellphone-line"></i>
                            </span>
                        </a>
                    </li>
                    
                    `).join("")}
                </ul>
            </div>`;
        }


        function attachmentComponent() {


            let attachmentTypes = [{
                    icon: 'ri-image-fill',
                    title: 'Image',
                    type: 'image/*',
                },
                // {
                //     icon: 'ri-video-fill',
                //     title: 'Video',
                //     type: 'video/*',
                // },
                // {
                //     icon: 'ri-file-text-fill',
                //     title: 'Document',
                //     type: 'application/pdf',
                // }
            ];

            return `
            <div class="dropup">

                <button type="button" class="btn dropdown-toggle font-size-16 px-2 p-0 text-primary me-2" data-bs-toggle="dropdown" id="attachmentn-btn">
                    <i class="ri-add-line fs-3"></i>
                </button>

                <ul class="dropdown-menu dropdown-menu-end mb-2 rounded-3">
                    ${attachmentTypes.map((attachment) => `
                    <li class="px-2" id="upload_input">
                        <button class="align-items-center d-flex dropdown-item px-2 rounded-3 text-end" data-attachment="${attachment.type}" type="button">

                        <span class="align-items-center avatar-xs bg-primary-subtle d-flex justify-content-center me-2 rounded-3 text-primary">
                            <i class="${attachment.icon}"></i>
                        </span>
                        <span class="fw-bolder">
                            ${attachment.title}
                        </span>
                        </button>
                    </li>
                    `).join("")}
                </ul>
            </div>
         `;
        }

        $(document).on('show.bs.dropdown', '#attachmentn-btn', function() {
            $(this).addClass('rotate');
        });

        $(document).on('hide.bs.dropdown', '#attachmentn-btn', function() {
            $(this).removeClass('rotate');
        });


        // Threads List template
        function threadsListTemplate() {


            if (data.filteredThreads !== null) {

                if (data.searchQuery.length && data.filteredThreads.length === 0) {

                    return `<div class="list-unstyled chat-list chat-user-list text-center" id="empty-search"><p class="text-muted my-5">No results found</p></div>`;
                }

                return `${data.filteredThreads.map(function (thread, index) {

            let threadName = data.filteredThreads[index].name ?? generateThreadName(thread);

            if (data.filteredThreads[index].name == null) data.filteredThreads[index].name = threadName;

            return `<li class="thread ${data.selectedThreadId == thread.thread_id ? 'active' : ''}" id="thread_${thread.thread_id}">
                    <a data-threadid="${thread.thread_id}" style="cursor: pointer;">
                        <div class="align-items-center media">
                            <div class="chat-user-img align-self-center me-3 ms-0">
                                <div class="avatar-xs">
                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        <i class="ri-user-3-line"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="media-body overflow-hidden">                                
                                <h5 class="text-truncate font-size-15 mb-0">${formatPhoneNumber(threadName, thread.format_template)}</h5>
                            </div>            
                        </div>
                    </a>
                </li>`
        }).join("")}`;
            }

            const threads = data.phoneData.selected !== 0 ? (data.phoneData.threads[data.phoneData.selected]?.items ?? []) : data.threads.items;


            if (!threads || threads.length === 0) {
                return `<div class="no-leatest-message text-center">
                        <div class="icon" style="font-size: 40px; color: #ccc;"><i class="ri-chat-3-line"></i></div>
                        <p class="text-muted">Once you start a new conversation<br> you'll see it listed here</p>
                </div>`;
            }


            return `${threads.map(function (thread, index) {

        let unreadBadge = thread.unread > 0 ? `<span class="badge badge-soft-danger rounded-pill">${thread.unread}</span>` : "";

        let threadName = threads[index]?.name ?? generateThreadName(thread);

        if (threads[index]?.name == null) threads[index].name = threadName;

        return `<li class="thread ${data.selectedThreadId == thread.thread_id ? 'active' : ''}" id="thread_${thread.thread_id}">
                        <a data-threadid="${thread.thread_id}" style="cursor: pointer;">
                            <div class="media">
                                <div class="chat-user-img align-self-center me-3 ms-0">
                                    <div class="avatar-xs">
                                        <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                            <i class="${thread.type == 'group' ? 'ri-group-line' : 'ri-user-3-line'}"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="media-body overflow-hidden">
                                    <h5 class="text-truncate font-size-15 mb-1">${threadName}</h5>
                                    <p class="chat-user-message text-truncate mb-0 ${thread.unread ? 'text-dark fw-bold' : ''}"> ${thread.has_attachment ? `<i class="ri-attachment-line"></i> Attachment` : thread.content}</p>                                    
                                </div>
                                <div class="font-size-11">${formatDate(thread.last_activity)}</div>
                                <div class="unread-message">
                                ${unreadBadge}
                                </div>
                            </div>
                        </a>
                    </li>`;
    }).join("")}`;
        }

        // Thread Conversation template
        function conversationTemplate() {

            //const messages = data.messages.find(message => message.thread.id == data.selectedThreadId);
            const messages = data.selectedThreadId == 0 ? [] : data.messages[data.selectedThreadId];

            // Group messages by date
            const groupedMessages = {};

            if (data.selectedThreadId != 0) {

                messages.items.forEach(message => {

                    const convertedDate = CurrentZone(message.created);
                    const date = convertedDate.substring(0, 10); // Extract YYYY-MM-DD

                    if (!groupedMessages[date]) {
                        groupedMessages[date] = [];
                    }
                    groupedMessages[date].push(message);
                });

            }

            //Create chat interface
            const sortedDates = Object.keys(groupedMessages).sort().reverse();


            let html = '';

            sortedDates.forEach(date => {
                const messages = groupedMessages[date];

                messages.forEach(message => {
                    html += messageItemTemplate(message);
                });

                let lastMessageCreated = messages[messages.length - 1].created;

                html += '<li><div class="chat-day-title"><span class="title">' + getDateString(lastMessageCreated) + '</span></div></li>';
            });

            return html;
        }


        // Thread header template
        function conversationHeadTemplate() {

            let threadName = data.selectedThreadInfo.name ?? generateThreadName(data.selectedThreadInfo);
            let myNumber = data.selectedThreadInfo.type == 'single' ? data.selectedThreadInfo.participants?.find(participant => userPhoneServices.has(participant.phone_id))?.number : '';

            // update name if null
            if (data.selectedThreadInfo.name == null) data.selectedThreadInfo.name = threadName;

            return (data.selectedThreadId != 0 ?
                `<div class="row align-items-center">
            <div class="col">
                <div class="d-flex align-items-center">
                    <div class="d-block d-lg-none me-2 ms-0">
                        <a href="#" class="user-chat-remove text-muted font-size-16 p-2"><i class="ri-arrow-left-s-line"></i></a>
                    </div>
                    <div class="me-3 ms-0">

                        <div class="avatar-xs rounded-circle">
                            <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                <i class="${data.selectedThreadInfo.type == 'group' ? 'ri-group-line' : 'ri-user-3-line'}"></i>
                            </span>
                        </div>
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                        <h5 class="font-size-16 mb-0 text-truncate">
                            <a href="#" class="text-reset user-profile-show user-profile-number">${threadName}</a>
                            <i class="ri-record-circle-fill font-size-10 d-inline-block ms-1 user_status"></i>
                        </h5>
                    </div>
                </div>
            </div>
            <div class="col">
                <ul class="list-inline user-chat-nav text-end mb-0">
                    <li class="align-items-center d-flex justify-content-end list-inline-item">

                        <h5 class="font-size-16 mb-0 text-truncate d-none d-sm-block">
                            <span class="text-reset user-profile-number">${myNumber}</span>                            
                        </h5>
                        
                        <button class="btn nav-btn user-profile-show text-primary" type="button">
                            <i class="ri-information-fill"></i>
                        </button>
                        
                    </li>

                </ul>
            </div>
        </div>` :
                '');
        }


        // thread name generate
        function generateThreadName(threadInfo) {

            const thread = threadInfo;

            let threadName = '';

            if (thread?.participants?.length) {
                // Filter participants that match authenticated phone IDs
                const authPhonesArray = thread.participants.filter(participant => userPhoneServices.has(participant.phone_id));

                // Filter participants that do not match authenticated phone IDs
                const withoutAuthPhonesArray = thread.participants.filter(participant => !userPhoneServices.has(participant.phone_id));

                // if the thread has more than one participant as my auth phones
                if (authPhonesArray.length > 1) {

                    // check if thread.sender phone number is one of the authPhonesArray, then the thread_name is the other participants without the sender phone
                    if (authPhonesArray.some(authPhone => authPhone.number == thread.sender)) {
                        // if the thread has more than one participant regardless of my auth phones
                        if (withoutAuthPhonesArray.length > 1) {
                            threadName = `You and ${withoutAuthPhonesArray.length} others`;
                        } else {
                            // if the thread has more than 2 of my auth phones or only 2 of my auth phones
                            if (authPhonesArray.length > 2) {
                                threadName = `You and ${authPhonesArray.length - 1} others`
                            } else {
                                threadName = thread.participants.find(participant => participant.number != thread.sender)?.number ?
                                    formatPhoneNumber(
                                        thread.participants.find(participant => participant.number != thread.sender).number,
                                        thread.participants.find(participant => participant.number != thread.sender).format_template
                                    ) :
                                    formatPhoneNumber(thread.participants[0].number, thread.participants[0].format_template);
                            }
                        }

                    } else {
                        // if the thread has more than one participant regardless of my auth phones
                        threadName = withoutAuthPhonesArray.length > 1 ? `You and ${withoutAuthPhonesArray.length} others` : formatPhoneNumber(withoutAuthPhonesArray[0].number, withoutAuthPhonesArray[0].format_template);
                    }

                } else {
                    // if the thread has more than one participant regardless of my auth phones
                    threadName = withoutAuthPhonesArray.length > 1 ? `You and ${withoutAuthPhonesArray.length} others` : formatPhoneNumber(withoutAuthPhonesArray[0].number, withoutAuthPhonesArray[0].format_template);

                }
            }

            return threadName;
        }


        // message history template
        function messageItemTemplate(msg) {

            let status = '';

            switch (msg.status) {
                case 'Delivered':
                    status = `<i class='ri-check-double-line' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Delivered to phone'></i></i>`;
                    break;

                case 'Pending':
                case 'Processing':
                    status = `<i class='ri-check-line' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Processing'></i></i>`;
                    break;

                case 'Failed':
                    status = `<i class='text-danger ri-error-warning-fill' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Not delivered to phone !'></i>`;
                    break;

                default:
                    break;
            }
            return `<li class="${msg.is_sender ? 'right' : 'left'}" id="msg_${msg.id}">
                <div class="conversation-list">
                    <div class="chat-avatar">
                        <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                            <i class="ri-user-3-line"></i>
                            </span>
                        </div>
                    </div>

                    <div class="user-chat-content">
                        <div class="ctext-wrap">
                        
                            <div class="ctext-wrap-content">

                                ${msg.attachments.length > 0 ? messageAttachmentTemplate(msg.attachments) : ''}

                                <p class="mb-0 chat-content text-break">${msg.content}</p>
                                <p class="chat-time mb-0">
                                    <span class="align-middle">${msg.is_sender ? status : ''}  ${formatDate(msg.created, 'timeOnly')}</span>
                                </p>
                            </div>

                            <div class="dropdown align-self-start ${msg.content ? '' : 'd-none'}">
                                <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="ri-more-2-fill"></i>
                                </a>
                                <div class="dropdown-menu">
                                    ${msg.content ? `<a class="dropdown-item copy-btn" href="#">Copy <i class="ri-file-copy-line float-end text-muted"></i></a>` : ''}
                                    <a class="dropdown-item d-none" href="#">Delete <i class="ri-delete-bin-line float-end text-muted"></i></a>
                                </div>
                            </div>


                        </div>
                        
                        ${data.selectedThreadInfo.type == 'group' ? `<div class="conversation-name">${msg.sender}</div>` : ''}

                    </div>
                </div>
            </li>`;
        }

        // message attachment template
        function messageAttachmentTemplate(attachments) {
            if (attachments.length === 0) {
                return '';
            }
            return `<ul class="list-inline message-img  mb-0">
                ${attachments.map(attachment =>
        `<li class="list-inline-item message-img-list mb-2">
                    <div>
                        ${attachmentTypeTemplate(attachment)}
                    </div>
                    <div class="message-img-link">
                        <ul class="list-inline mb-0">
                            <li class="list-inline-item">
                                <a href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}?download=true" download="${attachment.file_name}"><i class="ri-download-2-line"></i></a>
                            </li>
                        </ul>
                    </div>
                </li>`
    ).join("")}
            </ul>`;
        }

        function attachmentTypeTemplate(attachment) {

            var parts = attachment.file_name.split('.');

            var ext = parts[parts.length - 1];

            if (ext == 'pdf') {
                return `
                <a target="_blank" class="d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                    <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3" style="height: 150px; width: 150px">
                        <i class="ri-file-pdf-line"></i>
                        <small class="fs-6">
                        ${showFileName(attachment.file_name)}
                        </small>                           
                    </div>
                </a>
                `;
            } else if (ext == 'doc' || ext == 'docx') {
                return `
                <a class="d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                    <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3" style="height: 150px; width: 150px">
                        <i class="ri-file-word-line"></i>
                    </div>
                </a>
                `;

            } else if (ext == 'xls' || ext == 'xlsx') {
                return `
                <a class="d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                    <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3" style="height: 150px; width: 150px">
                        <i class="ri-file-excel-line"></i>
                        <small class="fs-6">
                            ${showFileName(attachment.file_name)}
                                        </small>  
                    </div>
                </a>
                
                `;
            } else if (ext == 'mp4') {
                return `
                <a class="popup-vid d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                    <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3" style="height: 150px; width: 150px">
                        <i class="ri-file-video-line"></i>
                        <small class="fs-6">
                        ${showFileName(attachment.file_name)}
                                        </small>  
                    </div>
                </a>
                
                `;
            } else if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
                return `
                <a class="popup-img d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                    <img src="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}" class="rounded border object-fit-cover" alt="${attachment.file_name}" style="height: 150px; width: 150px">
                </a>
                `;
            } else {
                return `
                <a class="d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                    <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3" style="height: 150px; width: 150px">
                        <i class="ri-file-line"></i>
                        <small class="fs-6">
                                            ${showFileName(attachment.file_name)}
                                            
                                        </small>  
                    </div>
                </a>                    
                `;
            }

        }

        function showFileName(name) {
            //return first 5 characters of the name and ... then the last 5 characters
            return name.slice(0, 5) + '...' + name.slice(-5);
        }


        //phone number template

        function phoneNumberTemplate() {


            // let smsService = JSON.parse(localStorage.user || [])?.services?.sms active
            let smsService = JSON.parse(localStorage.user || '{}').services?.sms?.filter(authPhone => authPhone.status == 'Active')

            if (smsService.length > 1) {

                return `<select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
             <option value="0">All Numbers</option>
             ${smsService.map(sms => `<option ${sms.phone_id == data.phoneData.selected ? 'selected' : ''} value="${sms.phone_id}">${sms.number}</option>`).join('')}
         </select>`;

            }

            return '<div class="me-2 p-1 rounded-2">' + smsService[0].number + '</div>';

        }

        function ConversationNumberTemplate() {


            const selectedPhone = data.phoneData.selected;

            let smsService = JSON.parse(localStorage.user || [])?.services?.sms
            smsService = smsService.filter(authPhone => authPhone.status == 'Active')

            if (smsService.length > 1) {

                return `<label for="recipient-name" class="col-form-label">Sender Phone</label>
          <select class="bg-dark-subtle form-select mb-3" name="phone_id" required>
             ${smsService.map(sms => `<option value="${sms.phone_id}"
                @selected=${sms.phone_id == selectedPhone ? true : false}
             >${sms.number}</option>`).join('')}
         </select>`;
            }

            return '';

        }

        function participantSidebarTemplate() {

            let threadName = data.selectedThreadInfo.name ?? generateThreadName(data.selectedThreadInfo);

            let recipients = data.selectedThreadInfo.participants;

            let allRecipients = recipients == undefined ? [] : recipients

            allRecipients = allRecipients.filter(participant => !userPhoneServices.has(participant.phone_id));

            allRecipients = allRecipients.length == 0 ? recipients : allRecipients;

            return (data.selectedThreadId != 0 ? `<div class="user-profile-sidebar">
                <div class="px-3 px-lg-4 pt-3 pt-lg-4">
                    <div class="user-chat-nav text-end">
                        <button type="button" class="btn nav-btn" id="user-profile-hide">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                </div>

                <div class="text-center p-4 border-bottom">
                    <div class="mb-2">

                        <div class="avatar-xs mx-auto">
                            <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                <i class="${data.selectedThreadInfo.type == 'group' ? 'ri-group-line' : 'ri-user-3-line'}"></i>
                            </span>
                        </div>
                    </div>

                    <h5 class="font-size-16 mb-1 text-truncate">${threadName}</h5>
                </div>
                <!-- End profile user -->

                <!-- Start user-profile-desc -->
                
                <div class="p-4 user-profile-desc" data-simplebar>

                    <div class="accordion" id="myprofile">

                        <div class="accordion-item card border">
                            <div class="accordion-header" id="attachfile3">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#attachprofile" aria-expanded="true" aria-controls="attachprofile">
                                    <h5 class="font-size-14 m-0">
                                        <i class="ri-group-line"></i> Recipients
                                    </h5>
                                </button>
                            </div>
                            <div id="attachprofile" class="accordion-collapse collapse show" aria-labelledby="attachfile3" data-bs-parent="#myprofile">
                                <div class="accordion-body">
                                ${allRecipients.map(participant => `
                                    <div class="card p-2 mb-1">
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-xs me-2 ms-0">
                                                <div class="avatar-title bg-primary-subtle text-primary rounded font-size-20">
                                                <i class="ri-cellphone-line"></i>
                                                </div>
                                            </div>
                                            <div class="flex-grow-1">
                                                <div class="text-start">
                                                    <h5 class="font-size-14 mb-1">${formatPhoneNumber(participant.number, participant.format_template)}</h5>

                                                </div>
                                            </div>

                                        </div>
                                    </div>`
    ).join("")}
                                </div>
                            </div>
                        </div>
                        <!-- end profile-user-accordion -->
                    </div>
                    <!-- end user-profile-desc -->
                </div>

            </div>` : '');
        }

        // fetch inital threads
        async function fetchThreads() {

            if (!data.threads.items.length) {
                try {

                    let fetchData = await _request(APIS.THREAD_LIST);

                    if (fetchData.data) {

                        data.threads.items = fetchData.data.items

                        data.threads.hasMore = fetchData.data.item_limit == fetchData.data.items.length;

                        saveDataToDB("threads", cloneObjFromProxy(fetchData.data.items));

                        fetchData.data.items.forEach(thread => {
                            const authPhonesArray = thread.participants.filter(participant => userPhoneServices.has(participant.phone_id));

                            authPhonesArray.forEach(authPhone => {
                                if (!data.phoneData.threads[authPhone.phone_id]) {
                                    data.phoneData.threads[authPhone.phone_id] = {
                                        items: [],
                                        hasMore: true
                                    };
                                }

                                // Check if the thread with the same thread_id already exists
                                const existingThread = data.phoneData.threads[authPhone.phone_id].items.find(item => item.thread_id === thread.thread_id);

                                if (!existingThread) {
                                    // If the thread doesn't exist, push it to items
                                    data.phoneData.threads[authPhone.phone_id].items.push(thread);

                                } else {
                                    const threadIndex = data.phoneData.threads[authPhone.phone_id].items.findIndex(item => item.thread_id === thread.thread_id);
                                    data.phoneData.threads[authPhone.phone_id].items[threadIndex] = thread;
                                }

                                // Sort by message_id
                                data.phoneData.threads[authPhone.phone_id].items.sort((a, b) => b.message_id - a.message_id);

                            });

                        });

                        savePhoneDataToDB(cloneObjFromProxy(data.phoneData));


                    }


                } catch (error) {
                    console.log(error);
                }
            }
        }


        async function makeReadMessageRequest(id) {

            try {
                const resp = await _request(APIS.READ_MESSAGE, 'POST', {
                    msg_id: id
                });
            } catch (error) {
                console.log(error);
            }

        }


        //fetch pagination threads
        async function loadMoreThreads() {

            const phoneId = data.phoneData.selected;

            if (!phoneId && !data.threads.hasMore) {
                return;
            }

            if (phoneId && !data.phoneData.threads[phoneId].hasMore) {
                return;
            }

            let threads = phoneId !== 0 ? data.phoneData.threads[phoneId].items : data.threads.items;

            let lastMsgId = threads.length > 0 ? threads[threads.length - 1].message_id : 0;

            // is already fetching
            if (data.processing) {
                return;
            }

            data.processing = true;

            try {

                //if phoneId is 0 then fetch all threads
                if (phoneId === 0) {

                    let range = IDBKeyRange.upperBound(lastMsgId, true);

                    fetchData = {
                        data: {
                            items: await getItemsFromDB("threads", "order_by_lmsg", range, 20),
                        }
                    }

                    if (fetchData.data.items.length === 0) {

                        fetchData = await _request(APIS.THREAD_LIST, 'GET', {
                            action: 'messages',
                            startId: lastMsgId
                        });

                        saveDataToDB("threads", cloneObjFromProxy(fetchData.data.items));
                    }
                }

                if (phoneId) {

                    fetchData = {
                        data: await getPhoneThreadFromDB(phoneId, lastMsgId),
                    }

                    if (fetchData.data.items.length === 0 || fetchData.data.items.length < 30) {

                        // let lastMessageIds = await getLastIdFromDB('track_lastId');

                        // for (const key in lastMessageIds) {
                        //     if (key == 'phoneId_' + phoneId) {
                        //         lastMsgId = lastMessageIds[key];
                        //     }
                        // }

                        fetchData = await _request(APIS.THREAD_LIST + "/" + phoneId, 'GET', {
                            action: 'messages',
                            startId: lastMsgId
                        });

                        saveTrackLastIdToDB(fetchData);
                    }
                }

                data.processing = false;

                // update hasMoreThreads
                const hasMore = (fetchData.data.items.length < fetchData.data.item_limit) ? false : true;

                phoneId !== 0 ? data.phoneData.threads[phoneId].hasMore = hasMore : data.threads.hasMore = hasMore;

                const threadIds = threads.map(item => item.thread_id);

                const newData = fetchData.data.items.filter(thread => !threadIds.includes(thread.thread_id));

                threads = threads.concat(newData);

                phoneId !== 0 ? data.phoneData.threads[phoneId].items = threads : data.threads.items = threads;

                savePhoneDataToDB(cloneObjFromProxy(data.phoneData));

            } catch (error) {
                console.log(error);

            }
        }


        // fetch inital thread conversations
        async function fetchConversations(threadId) {

            // check selected thread messages exist
            //const threadExist = data.messages.find(item => item.thread.id == threadId);
            const threadExist = data.messages[threadId];

            let thread = null;

            try {
                if (!threadExist) {

                    const fetchData = await _request(APIS.THREAD_CONVERSATIONS + "/" + threadId);

                    //flag hasMoreMessages
                    fetchData.data.messages['hasMoreMessages'] = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

                    if (fetchData.data.messages.items.length) {

                        data.messages[fetchData.data.thread_id] = fetchData.data.messages;
                        data.messages[fetchData.data.thread_id]['thread_id'] = fetchData.data.thread_id;

                        saveDataToDB("messages", cloneObjFromProxy(fetchData.data.messages.items));

                    }
                }

                const selectedKey = data.phoneData.selected;

                const selectedItems = selectedKey ? data.phoneData.threads[selectedKey]?.items : data.threads.items;

                thread = selectedItems?.find((item) => item.thread_id === threadId);

            } catch (error) {
                console.log(error);
            }

            return thread;

        }


        // fetch pagination conversation history
        async function loadMoreConversations() {

            const threadId = data.selectedThreadId;

            const threadExist = data.messages[threadId];
            const hasMoreMessages = threadExist ? threadExist.hasMoreMessages : false;

            if (!hasMoreMessages) {
                return;
            }

            // is already fetching
            if (data.processing) {
                return;
            }

            data.processing = true;

            const lastMsgId = threadExist.items[threadExist.items.length - 1].id ?? 0;

            try {

                let range = IDBKeyRange.bound([threadId, -Infinity], [threadId, lastMsgId], false, true);

                fetchData = {
                    data: {
                        messages: {
                            items: await getItemsFromDB('messages', 'thread_id, msg_id', range),
                        },
                        thread_id: threadId
                    }
                }

                if (fetchData.data.messages.items.length === 0) {

                    fetchData = await _request(APIS.THREAD_CONVERSATIONS + "/" + threadId, 'GET', {
                        startId: lastMsgId,
                        action: 'messages'
                    });

                    let unreadMessages = fetchData.data.messages.items.filter(item => item.thread_id === threadId && item.unread > 0);
                    let ids = unreadMessages.map(item => item.id).join(',');

                    if (ids) {
                        makeReadMessageRequest(ids);
                    }

                    saveDataToDB("messages", cloneObjFromProxy(fetchData.data.messages.items));

                    //update thread hasMoreMessages
                    threadExist.hasMoreMessages = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;
                }

                data.processing = false;

                // push new data to state
                threadExist.items.push(...fetchData.data.messages.items);

            } catch (error) {
                console.log(error);
            }

        }

        // fetch new/updated messages
        async function fetchLatestMessages() {

            const mergedItems = data.messages.reduce((acc, cur) => {
                // Concatenate the current items array to the accumulator array
                return acc.concat(cur.items);
            }, []);

            // if no message is found then fetch the last thread message
            if (!mergedItems.length && data.threads.items.length) {
                return await fetchConversations(data.threads.items[0].thread_id);
            }

            // sort the array by id value in desc order and find the last id of where the object status is failed or delivered
            const lastId = mergedItems.sort((a, b) => b.id - a.id).find(item => item.status === "Failed" || item.status === "Delivered")?.id ?? 0;

            try {

                const resp = await _request(APIS.LATEST_MESSAGE, 'GET', {
                    startId: lastId
                });

                if (data.selectedThreadId) {

                    const filteredMessages = resp.data.filter(item => item.thread_id === data.selectedThreadId && item.unread > 0);
                    const msg_ids = filteredMessages.map(item => item.id).join(',');

                    // update original resp.data message of current thread unread status
                    resp.data.forEach((item, index) => {
                        if (item.thread_id == data.selectedThreadId) {
                            // update message
                            resp.data[index].unread = 0;
                        }
                    });

                    if (msg_ids) {
                        makeReadMessageRequest(msg_ids);

                    }
                }

                updateMessages(resp.data);


            } catch (error) {
                console.log(error);
            }

        }

        // open single chat
        async function openSingleChat(id) {

            const thread = await fetchConversations(id);
            data.selectedThreadId = id;
            data.selectedThreadInfo = thread;

            const filteredMessages = data.messages[id].items.filter(message => message.thread_id == id && message.unread > 0);

            if (filteredMessages.length > 0) {
                let msg_ids = filteredMessages.map(item => item.id).join(',');
                makeReadMessageRequest(msg_ids);
            }

            // set unread = false for openned thread
            let mainThread = data.threads.items[data.threads.items.findIndex(item => item.thread_id == id)];
            if (mainThread) {
                mainThread.unread = 0;
            }

            // set unread = false for openned thread in phoneData

            const authPhonesArray = thread.participants.filter(participant => userPhoneServices.has(participant.phone_id));

            authPhonesArray.forEach((phone) => {

                const threadIndex = data.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == thread.thread_id);

                if (threadIndex >= 0) {
                    data.phoneData.threads[phone.phone_id].items[threadIndex].unread = 0;
                }

            });

            updateThread(cloneObjFromProxy(thread));

            messages__history.scrollTop = messages__history.scrollHeight;

            $("#participants-sidebar").find(".user-profile-sidebar").hide();
            userProfileSideber.render();
            selPhoneCom.render();
        }

        // new conversation
        function newConversation() {
            $('#newConversationteModal').modal('show');
        }

        async function newConversationSubmit(e) {

            e.preventDefault();

            const createConversation = $('#createConversation');
            const newConversationteModal = $('#newConversationteModal');

            if (iti.isValidNumber() == false) {
                toast("Please enter a valid phone number", 'danger', 5000);
                return;
            }

            const btnOldVal = createConversation.find('button[type=submit]').html();
            createConversation.find('button[type=submit]').html(spinner).prop('disabled', true);

            // get form data to key value pairs
            const formData = new FormData(createConversation[0]);

            //replace recipient with international format
            formData.set('recipient', iti.getNumber());

            const dataObj = Object.fromEntries(formData.entries());

            //trim content
            dataObj.message = dataObj.message.trim();

            try {
                const resp = await _request(APIS.THREAD_CREATE, 'POST', dataObj);

                const thread = {
                    thread_id: resp.data.thread_id,
                    name: resp.data.name,
                    message_id: resp.data.message_id,
                    sender: resp.data.sender,
                    participants: resp.data.participants,
                    content: resp.data.content,
                    has_attachment: resp.data.has_attachment,
                    type: resp.data.thread_type,
                    unread: resp.data.unread,
                    last_activity: resp.data.last_activity
                };

                // add new thread to state or update existing thread
                const threadIndex = data.threads.items.findIndex(item => item.thread_id == thread.thread_id);
                if (threadIndex >= 0) {

                    data.threads.items[threadIndex] = thread;

                } else {

                    data.threads.items.unshift(thread);

                }

                updateThread(thread);

                // also update thread list of phoneData

                const authPhonesArray = thread.participants.filter(participant => userPhoneServices.has(participant.phone_id));

                authPhonesArray.forEach((phone, index) => {

                    // check if data.phoneData.threads[phoneId].items exist
                    if (!data.phoneData.threads[phone.phone_id]) {
                        data.phoneData.threads[phone.phone_id] = {
                            items: []
                        };
                    }

                    const threadIndex = data.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == thread.thread_id);

                    if (threadIndex >= 0) {
                        data.phoneData.threads[phone.phone_id].items[threadIndex] = thread;
                    } else {
                        data.phoneData.threads[phone.phone_id].items.unshift(thread);
                    }

                    // resort threads by message_id in desc order
                    data.phoneData.threads[phone.phone_id].items.sort((a, b) => b.message_id - a.message_id);
                });


                // add latest message to the messages state list if the thread already exist
                if (data.messages[thread.thread_id]?.items?.length) {

                    data.messages[thread.thread_id].items.unshift({
                        id: resp.data.message_id,
                        content: resp.data.content,
                        attachments: resp.data.attachments,
                        created: resp.data.last_activity,
                        updated: resp.data.last_activity,
                        is_sender: 1,
                        sender: resp.data.sender,
                        status: 'Pending',
                        thread_id: resp.data.thread_id,
                        type: resp.data.type
                    });

                }

                // sort thread by message_id in desc order to show latest message first
                data.threads.items.sort((a, b) => b.message_id - a.message_id);


                // open single chat
                createConversation[0].reset();

                //open single chat
                openSingleChat(thread.thread_id);

            }
            // catch error
            catch (error) {
                console.log(error);
            }

            // close modal
            newConversationteModal.modal('hide');

            // clear
            createConversation[0].reset();
            createConversation.find('button[type=submit]').html(btnOldVal).prop('disabled', false);

        }

        // attachment file validation check
        function fileValidation() {


            let fileInput = $("#upload_input");



            const filePath = fileInput.val(); // Use val() to get the value of an input
            if (!allowedExtensions.test(filePath)) { // Use test() to check a regex
                toast("Please select only valid jpg, jpeg, png image file.", 'danger', 5000);
                fileInput.val(""); // Use val("") to clear the input
                return false;
            }

            return true;
        }

        async function compressImage(imageFile) {

            //image configuration
            const options = {
                maxSizeMB: 3.75,
                useWebWorker: true,
            };

            try {
                return await imageCompression(imageFile, options);
            } catch (error) {
                console.log(error);
                return false;
            }

        }

        // preview image of reply message
        async function previewReplyImage(e) {

            const validation = fileValidation();

            if (!validation) {
                $('#replyImagePreview').html('').hide();
                return;
            }

            const file = e.target.files[0];

            if (!file) {
                $('#replyImagePreview').html('').hide();
                return;
            }

            if (!allowedExtensions.test(file.name)) {
                toast("Please select only valid jpg, jpeg, png image file.", 'error', 5000);
                return;
            }

            // generate image url
            const url = URL.createObjectURL(file);

            // show image
            const pImage = `<div class="image_pre d-inline-block position-relative"><img src='${url}' class='attachment-preview border border-light bg-white rounded' height="150" width="150" style="object-fit: cover"><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i></div>`;

            $('#replyImagePreview').html(pImage).show();

        }



        // remove preview image
        function deleteImage(e) {

            $('#replyImagePreview').hide().html('');

            $("#upload_input").val("");
        }

        // reply message process
        async function replyMessage(e) {

            e.preventDefault();

            const selectedThreadId = data.selectedThreadId;

            // get form data to key value pairs
            let formData = new FormData(e.target);

            const mergedItems = data.messages.reduce((acc, cur) => {
                // Concatenate the current items array to the accumulator array
                return acc.concat(cur.items);
            }, []);

            // sort the array by id value in desc order and find the last id of where the object status is failed or delivered
            const last_msg_id = mergedItems.sort((a, b) => b.id - a.id).find(item => item.status === "Failed" || item.status === "Delivered")?.id ?? 0;

            //add element last_msg_id to form data
            formData.append('last_msg_id', last_msg_id);

            //add phone_id to form data if phone selected
            data.phoneData.selected ? formData.append('phone_id', data.phoneData.selected) : false;

            const element = $(e.target);
            const btnOldVal = element.find('button[type=submit]').find("i")[0];
            element.find('button[type=submit]').html(spinner).prop('disabled', true);

            //if attachment is empty
            let hasFile = true;
            if (formData.get('file').size === 0) {
                formData.delete('file');
                hasFile = false;
            }

            if (!hasFile) {
                formData = Object.fromEntries(formData.entries());
            }

            if (hasFile) {
                element.find('button[type=submit]').html(spinner).prop('disabled', false);
                const compressedFile = await compressImage(formData.get('file'));
                formData.delete('file');
                formData.append('file', compressedFile, compressedFile.name);
            }


            try {

                //if formData has no attachment and formData.message is empty after trim
                if (!hasFile && formData.message.trim() === '') {
                    toast("Message or attachment is required!", 'danger', 5000);
                    element.find('button[type=submit]').html(btnOldVal).prop('disabled', false);
                    return;
                }

                const resp = await _request(APIS.REPLY_MESSAGE + "/" + selectedThreadId, 'POST', formData, hasFile);

                // update thread new message
                updateMessages(resp.data.messages);


            } catch (error) {
                console.log(error);
            }

            // clear form
            e.target.reset();
            $('#replyImagePreview').hide().html('');
            $("#upload_input").val("");
            element.find('button[type=submit]').html(btnOldVal).prop('disabled', false);

            //delay 50ms
            setTimeout(() => {
                messages__history.scrollTop = messages__history.scrollHeight;
            }, 50);

            $('.chat-message-list .simplebar-content-wrapper').scrollTop(0);

        }


        async function updateMessages(messages) {

            let isPlaying = false;

            messages.sort((a, b) => a.id - b.id)

            for (const msg of messages) {

                const newThread = {
                    content: msg.content,
                    has_attachment: msg.attachments.length > 0 ? true : false,
                    last_activity: msg.updated,
                    message_id: msg.id,
                    participants: msg.participants,
                    format_template: msg.format_template,
                    sender: msg.sender,
                    thread_id: msg.thread_id,
                    name: msg.thread_name ?? null,
                    type: msg.thread_type ?? null,
                    unread: msg.unread,
                };

                const newMessage = {
                    id: msg.id,
                    thread_id: msg.thread_id,
                    content: msg.content,
                    attachments: msg.attachments,
                    sender: msg.sender,
                    is_sender: msg.is_sender,
                    status: msg.status,
                    type: msg.type,
                    unread: msg.unread,
                    created: msg.created,
                    updated: msg.updated
                };

                // main thread list update
                const thread = data.threads.items.find(item => item.thread_id == msg.thread_id);
                const threadIndex = data.threads.items.findIndex(item => item.thread_id == msg.thread_id);

                if (thread) {

                    let unreadCount = thread ? thread.unread : 0;

                    if (data.selectedThreadId == msg.thread_id) {
                        newThread.unread = 0;
                    } else {
                        newThread.unread = (unreadCount += 1);
                    }

                    if (thread.message_id < msg.id) {

                        thread.unread += 1;

                        // update thread with new message thread
                        data.threads.items[threadIndex] = newThread;
                        updateThread(newThread);

                        // play sound if new message that is unread
                        if (msg.unread) {
                            isPlaying ? null : (playNotificationSound(), (isPlaying = true));
                        }

                    }

                } else {

                    // add new thread to state
                    data.threads.items.push(newThread);
                    updateThread(newThread);
                    // play sound if new message that is unread
                    if (msg.unread) {
                        isPlaying ? null : (playNotificationSound(), (isPlaying = true));
                    }
                }


                // sort thread by message_id
                data.threads.items.sort((a, b) => b.message_id - a.message_id);

                // individual phoneData thread list update

                const authPhonesArray = newThread.participants.filter(participant => userPhoneServices.has(participant.phone_id));

                authPhonesArray.forEach((phone, index) => {

                    // check if data.phoneData.threads[phoneId].items exist
                    if (!data.phoneData.threads[phone.phone_id]) {
                        data.phoneData.threads[phone.phone_id] = {
                            items: []
                        };
                    }

                    const threadIndex = data.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == newThread.thread_id);
                    if (threadIndex >= 0) {
                        // check message_id of thread
                        if (data.phoneData.threads[phone.phone_id].items[threadIndex].message_id < msg.id) {
                            data.phoneData.threads[phone.phone_id].items[threadIndex] = newThread;
                        }
                    } else {
                        // Check if the thread_id is not already in the items array
                        let existingThread = data.phoneData.threads[phone.phone_id].items.find(item => item.thread_id === newThread.thread_id);
                        if (!existingThread) {
                            data.phoneData.threads[phone.phone_id].items.unshift(newThread);
                            savePhoneDataToDB(cloneObjFromProxy(data.phoneData));
                        }
                    }



                    // resort threads by message_id in desc order
                    data.phoneData.threads[phone.phone_id].items?.sort((a, b) => b.message_id - a.message_id);
                });


                const messageThread = data.messages[msg.thread_id];

                if (messageThread) {
                    // check if message exist
                    const message = messageThread.items.find(item => item.id == msg.id);

                    if (message) {

                        // update message
                        messageThread.items[messageThread.items.findIndex(item => item.id == message.id)] = newMessage;
                        updateMessagesToDB(newMessage);

                    } else {
                        // add new message
                        messageThread.items.unshift(newMessage);
                    }

                    // sort messages by id
                    messageThread.items.sort((a, b) => b.id - a.id);

                } else {

                    // if any messages avilable in the state
                    if (data.messages.length) {
                        await fetchConversations(msg.thread_id);
                    }
                }


            }

        }


        async function searchThreads(term) {

            //replace all special characters without + and numbers

            if (!/[a-zA-Z]/.test(term)) {
                term = term.replace(/[^0-9a-zA-Z+]/g, '');
            }

            const phoneId = data.phoneData.selected;

            const response = await _request(APIS.THREAD_SEARCH + "/" + phoneId, 'GET', {
                query: term
            });

            data.filteredThreads = response.data;
        }

        function clearSearch() {
            $('#clear-search').addClass('d-none');
            $('#threads-title').text('Recent');
            $('#searchInput').val('');
            data.filteredThreads = null;
            data.searchQuery = '';
        }

        async function fetchPhoneThreads(phoneId) {

            if (data.phoneData.threads[phoneId] && !data.phoneData.threads[phoneId]?.hasMore) {
                return;
            }

            const threads = await _request(APIS.THREAD_LIST + "/" + phoneId, 'GET');

            // check if data.phoneData.threads[phoneId].items exist
            if (!data.phoneData.threads[phoneId]) {
                data.phoneData.threads[phoneId] = {
                    items: []
                };
            }

            data.phoneData.threads[phoneId].items.push(...threads.data.items);

            // add hasMore flag for phoneId
            data.phoneData.threads[phoneId]['hasMore'] = (threads.data.items.length < threads.data.item_limit) ? false : true;

            data.phoneData.threads[phoneId]?.items?.sort((a, b) => b.message_id - a.message_id);

            savePhoneDataToDB(cloneObjFromProxy(data.phoneData));
            saveTrackLastIdToDB(cloneObjFromProxy(data.phoneData));
        }

        function playNotificationSound() {

            const notificationSound = new Audio("../public/notifications/chat.mp3");

            if (('AudioContext' in window || 'webkitAudioContext' in window) && notificationSound) {
                var promise = notificationSound.play();
                if (promise !== undefined) {
                    promise.then(function() {

                    }).catch(function(error) {
                        console.error('Error playing sound:', error);
                    });
                }
            }
        }

        // jq short Ready
        let data = {};
        let iti = null;

        let userProfileSideber = null;
        let selectedPhone = null;


        $(async function() {

            const newConversationteModal = $('#newConversationteModal');
            const createConversation = $('#createConversation');
            const msgReplyInput = $('#upload_input');
            const msgReplyForm = $('#message_form');

            let {
                store,
                component
            } = reef;

            // initial page req

            await _request(APIS.PROFILE);

            $('.loader-container').hide();

            // data from db
            let stateData = await loadAndInitializeState();

            // set selectedThreadId to 0 on refresh
            stateData.selectedThreadId = 0;

            // make the data variable reactive
            data = new store(stateData);

            // initial threads
            fetchThreads();
            component('#threads', threadsListTemplate);
            component('#phone-number', phoneNumberTemplate);

            const numTemplate = component('#new_conversation_phone', ConversationNumberTemplate);
            numTemplate.stop();

            userProfileSideber = component('#participants-sidebar', participantSidebarTemplate);
            userProfileSideber.stop();

            // inital conversations
            component('#conversation-chat-head', conversationHeadTemplate);
            component('#messages__history', conversationTemplate);

            selPhoneCom = component('#selectPhoneComponent', selectPhoneComponent);
            component('#attachmentComponent', attachmentComponent);

            selPhoneCom.stop();

            //polling threads
            setTimeout(() => {
                poolWithDelay(10000, fetchLatestMessages);
            }, 2000);

            // Clear prvious search
            clearSearch();

            iti = intlTelInput($('[name="recipient"]')[0], {
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
                initialCountry: "us",
                separateDialCode: true,
                //only country
                onlyCountries: localStorage.getItem('country_codes') ? JSON.parse(localStorage.getItem('country_codes')) : [],
            });


            $(document).on("change", "#threadsPhone", async function() {

                let phoneSelected = parseInt($(this).val());

                numTemplate.render();
                data.phoneData.selected = phoneSelected ?? 0;

                if (phoneSelected !== 0 && data.phoneData.threads[phoneSelected].items.length === 0) {

                    $("#threads").html(loader);
                    await fetchPhoneThreads(data.phoneData.selected);
                    return;
                }

                if (data.phoneData.threads[data.phoneData.selected]?.items?.length < 30) {

                    $("#threads").html(loader);
                    await loadMoreThreads();
                    return;
                }

                //scroll threads to top
                $('.chat-message-list .simplebar-content-wrapper').scrollTop(0);

            });

            //jquery data-select-phone-id click
            $(document).on('click', '#selectPhoneComponent [data-select-phone-id]', function(e) {

                //get this phone id
                let phoneId = $(this).data('select-phone-id');
                let number = $(this).data('number');

                //set this phone id to hidden input
                $('#selectPhoneComponent [data-phone-id]').val(phoneId);
                $('#selectPhoneComponent [data-selected-number]').html(number.slice(-4));

            });

            // new conversation form submit
            createConversation.on('submit', newConversationSubmit);

            // Image Upload add message form

            // data-attachment on click
            $(document).on('click', '[data-attachment]', function() {
                //set accept attribute
                $('#upload_input').attr('accept', $(this).data('attachment'));
                //click msgReplyInput
                msgReplyInput.click();
            });


            msgReplyInput.on('change', function(e) {
                previewReplyImage(e);
            });

            // thread reply form submit
            msgReplyForm.on('submit', replyMessage);

            ScrollTrigger('#messages__history', 300, () => {
                loadMoreConversations();
            });

            // load more threads when scrolling threads list
            detectScrollToOffset('.chat-message-list .simplebar-content-wrapper', 100, 'bottom', () => {
                loadMoreThreads();
            });


            // responsive hide conversation
            $(document).on('click', '.user-chat-remove', function() {
                $(this).closest('.user-chat').removeClass("user-chat-show");
                // update state
                data.selectedThreadId = 0;
            });


            // initial page setup for conversations
            $(document).on('reef:render', function(e) {

                // toogle chat-welcome-section
                if (data.selectedThreadId == 0) {
                    $('#chat-welcome-section').removeClass('d-none');
                    $('#chat-input-section').addClass('d-none');
                    $('#conversation-chat-head').addClass('d-none');
                    $('#messageBody').addClass('d-none');
                } else {
                    $('#chat-welcome-section').addClass('d-none');
                    $('#chat-input-section').removeClass('d-none');
                    $('#conversation-chat-head').removeClass('d-none');
                    $('#messageBody').removeClass('d-none');
                    $('.user-chat').addClass('user-chat-show');
                }


                $(".popup-img").magnificPopup({
                    type: "image",
                    closeOnContentClick: !0,
                    mainClass: "mfp-img-mobile",
                    image: {
                        verticalFit: !0
                    }
                });

                $(".popup-vid").magnificPopup({
                    type: "iframe",
                    closeOnContentClick: !0,
                    mainClass: "mfp-img-mobile",

                });

                // destroy tooltip
                // $("[data-toggle='tooltip']").tooltip();

            });


            // show conversations on thread click
            $(document).on('click', '#threads [data-threadid]', async function() {

                await openSingleChat($(this).data("threadid"));

                isPoolingRender = false;

                $(document).on('reef:render', function(event) {

                    if (!isPoolingRender) {
                        $('#message').val('').focus();
                    }
                    isPoolingRender = true;
                });

            });

            $(document).on('click', '.user-profile-show', function() {

                if ($("#participants-sidebar").find(".user-profile-sidebar").is(":hidden")) {
                    userProfileSideber.render();
                    setTimeout(() => {
                        // Show the user-profile-sidebar
                        $("#participants-sidebar").find(".user-profile-sidebar").show()
                    }, 0);
                }
            });


            $(document).on('click', '#user-profile-hide', function() {
                $("#participants-sidebar").find(".user-profile-sidebar").hide();
            });


            $('#searchInput').on('keyup', (event) => {

                $('#clear-search').removeClass('d-none');

                $('#threads-title').text('Search Results');

                let searchQuery = event.target.value.trim();

                if (searchQuery == '') {
                    clearSearch();
                    return false;
                }

                const threadsData = data.phoneData.selected !== 0 ? (data.phoneData.threads[data.phoneData.selected]?.items ?? []) : data.threads.items;

                //filter threads
                data.filteredThreads = threadsData.filter(thread => thread.name?.toLowerCase().replace(/[^0-9a-zA-Z+]/g, '').includes(searchQuery.toLowerCase().replace(/[^0-9a-zA-Z+]/g, '')));

                // api call after 500ms
                setTimeout(() => {

                    data.searchQuery = event.target.value.trim();

                    if (!data.searchQuery || data.searchQuery.length < 3) {
                        return;
                    }

                    searchThreads(data.searchQuery);

                }, 500);

            });


            $('#clear-search').on('click', (e) => {
                clearSearch();
            });


            $(document).on('click', '.copy-btn', function() {

                var cbody = $(this).closest('.user-chat-content');
                var chatContent = cbody.find('.chat-content').text();

                // Use navigator.clipboard.writeText() to copy text to clipboard
                navigator.clipboard.writeText(chatContent)
                    .then(() => {
                        // Show the tooltip
                        cbody.tooltip({
                            title: 'Copied!',
                            trigger: 'manual'
                        }).tooltip('show');

                        setTimeout(function() {
                            cbody.tooltip('hide');
                        }, 2000);
                    })
                    .catch(err => {
                        // Failure
                        console.error('Could not copy text: ', err);
                    });

            });


            //.scroll-bottom-btn on click scroll to bottom and hide
            $(document).on('click', '.scroll-bottom-btn', function() {
                $(this).addClass('d-none');
                messages__history.scrollTop = messages__history.scrollHeight;
            });


            //show scroll-bottom-btn if messages__history scrollTop is 0
            messages__history.addEventListener('scroll', function() {

                //set min height
                let minHeight = 400;

                //show hide scroll-bottom-btn
                Math.abs(messages__history.scrollTop) < minHeight ? $('.scroll-bottom-btn').addClass('d-none') : $('.scroll-bottom-btn').removeClass('d-none');

            });

            //newConversationteModal.modal on close reset form
            newConversationteModal.on('hidden.bs.modal', function(e) {
                createConversation[0].reset();
            });
        });
    </script>

</body>


</html>