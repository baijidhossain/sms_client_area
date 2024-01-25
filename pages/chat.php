<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                        <a class="nav-link" href="/logout/">
                            <i class="ri-logout-circle-r-line"></i>
                        </a>
                    </li>

                    <li class="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div class="avatar-xs profile-user rounded-circle bg-primary-subtle">
                                <span class="avatar-title text-primary bg-transparent">
                                    <?= substr($_SESSION['name'], 0, 1) ?>
                                </span>
                            </div>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="/profile">Profile <i class="ri-profile-line float-end text-muted"></i></a>
                            <!-- <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a> -->
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/logout">Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- end side-menu nav -->

            <div class="flex-lg-column d-none d-lg-block">
                <ul class="nav side-menu-nav justify-content-center">
                    <li class="nav-item">
                        <a class="nav-link light-dark-mode" href="#" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
                            <i class="ri-sun-line"></i>
                        </a>
                    </li>

                    <li class="nav-item btn-group dropup profile-user-dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div class="avatar-xs profile-user rounded-circle bg-primary-subtle">
                                <span class="avatar-title text-primary bg-transparent">
                                    <?= substr($_SESSION['name'], 0, 1) ?>
                                </span>
                            </div>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="/profile">Profile <i class="ri-profile-line float-end text-muted"></i></a>
                            <!-- <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a> -->
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/logout">Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
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
                                <button onclick="newConversation()" class="btn btn-primary btn-sm"> <i class="ri-chat-new-line"></i> New</button>
                            </div>
                            <div class="search-box chat-search-box">
                                <div class="input-group mb-3 rounded-3">
                                    <span class="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                        <i class="ri-search-line search-icon font-size-18"></i>
                                    </span>
                                    <input type="text" class="form-control bg-light" placeholder="Search conversations" aria-label="Search Threads" aria-describedby="basic-addon1">
                                </div>
                            </div> <!-- Search Box-->
                        </div> <!-- .p-4 -->


                        <!-- Start chat-message-list -->
                        <div>

                            <h5 class="mb-3 px-3 font-size-16">Recent</h5>

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
                                    <input type="text" name="message" id="message" class="message_form__input form-control form-control-lg bg-light border-light" placeholder="Enter Message...">
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

    <!-- new message modal -->
    <div class="modal" tabindex="-1" id="newConversationteModal" tabindex="-1" aria-labelledby="newConversationteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form id="createConversation" method="POST" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Conversation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="mb-3">
                        <label for="recipient-name" class="col-form-label">Recipient Phone</label>
                        <input type="tel" class="form-control bg-light border-light" name="recipient" required pattern="^\+1[0-9]{10,13}$" title="A US phone number with country code and 10 to 13 digits" maxlength=" 15">
                    </div>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Message</label>
                        <textarea class="form-control bg-light border-light" name="message" required minlength="1"></textarea>
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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/simplebar/4.2.3/simplebar.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.6/waves.min.js"></script>
    <!-- ReefJS -->
    <script src="https://cdn.jsdelivr.net/npm/reefjs@12/dist/reef.min.js"></script>

    <!-- Magnific Popup-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>

    <!-- page init -->
    <script src="../public/js/app.js?v=<?= APP_VER ?>"></script>

    <script>
        const loader = `<div class="chat-loader-section"> <div class="loader_bg" style="display: block; background-color: #f5f7fb;"> <div class="text-center"> <div class="loader"> <span></span> <span></span> </div></div></div></div>`;
        const spinner = `<div class="spinner-border" role="status" style="--bs-spinner-width: 1rem;--bs-spinner-height: 1rem;"><span class="visually-hidden">Loading...</span></div>`;

        const msgHistoryContainer = $('#messages__history');
        const newConversationteModal = $('#newConversationteModal');
        const createConversation = $('#createConversation');
        const msgReplyInput = $('#upload_input');
        const replyImagePreview = $('#replyImagePreview');
        const msgReplyForm = $('#message_form');
        const fileInput = $("#upload_input");

        // Allowing file type
        const allowedExtensions = /(.jpg|.jpeg|.png)$/i;


        let {
            store,
            component
        } = reef;

        // Create a reactive store
        let state = {
            threads: [],
            hasMoreThreads: true,
            messages: [],
            selectedThreadId: 0,
            selectedThreadInfo: {},
            processing: false
        };

        const localState = localStorage.getItem('state');

        if (localState) {
            state = JSON.parse(localState);
        } else {
            localStorage.setItem('state', JSON.stringify(state));
        }

        // set selectedThreadId to 0 on refresh
        state.selectedThreadId = 0;
        const data = new store(state);

        function saveStateToLocalStorage() {
            const dataString = JSON.stringify(data);
            localStorage.setItem('state', dataString);
        }

        // Threads List template
        function threadsListTemplate() {
            return `${data.threads.map((thread) => 
                    `<li class="thread ${data.selectedThreadId == thread.thread_id ? 'active' : ''}" id="thread_${thread.thread_id}">
                        <a data-threadid="${thread.thread_id}" style="cursor: pointer;">
                            <div class="media">
                                <div class="chat-user-img align-self-center me-3 ms-0">
                                    <div class="avatar-xs">
                                        <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                            <i class="ri-user-3-line"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="media-body overflow-hidden">
                                
                                    <h5 class="text-truncate font-size-15 mb-1">${thread.receiver}</h5>
                                    <p class="chat-user-message text-truncate mb-0 ${thread.unread ? 'text-dark fw-bold' : ''}"> ${thread.has_attachment ? `<i class="ri-attachment-line"></i> Attachment` : thread.content}</p>                                    
                                   
                                </div>
                                <div class="font-size-11">${formatDate(thread.last_activity)}</div>
                            </div>
                        </a>
                    </li>`
                ).join("")}`;
        }


        // Thread Conversation template
        function conversationTemplate() {

            //date string (2023-08-14) to today yesterday date 
            function getDateString(inputDateString) {
                const inputDate = new Date(inputDateString);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                if (inputDate.toDateString() === today.toDateString()) return "Today";
                if (inputDate.toDateString() === yesterday.toDateString()) return "Yesterday";

                return inputDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            const messages = data.messages.find(message => message.thread.id == data.selectedThreadId);
            // Group messages by date
            const groupedMessages = {};

            if (data.selectedThreadId != 0) {

                messages.items.forEach(message => {
                    const date = message.created.substring(0, 10); // Extract YYYY-MM-DD
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
                html += '<li><div class="chat-day-title"><span class="title">' + getDateString(date) + '</span></div></li>';
            });

            return html;
        }


        // Thread header template
        function conversationHeadTemplate() {
            return (data.selectedThreadId != 0 ?
                `<div class="row align-items-center">
                    <div class="col-sm-4 col-8">
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
                                    <a href="#" class="text-reset user-profile-show user-profile-number">${data.selectedThreadInfo.recipient}</a>
                                    <i class="ri-record-circle-fill font-size-10 d-inline-block ms-1 user_status"></i>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-8 col-4">
                        <ul class="list-inline user-chat-nav text-end mb-0">
                            <li class="list-inline-item">
                                <div class="dropdown">
                                    <button class="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="ri-search-line"></i>
                                    </button>
                                    <div class="dropdown-menu p-0 dropdown-menu-end dropdown-menu-md">
                                        <div class="search-box p-2">
                                            <input type="text" class="form-control bg-light border-0" placeholder="Search..">
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li class="list-inline-item">
                                <div class="dropdown">
                                    <button class="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="ri-more-fill"></i>
                                    </button>
                                    <!-- <div class="dropdown-menu dropdown-menu-end">
                                    <a class="dropdown-item d-block d-lg-none user-profile-show" href="#">View profile <i class="ri-user-2-line float-end text-muted"></i></a>
                                    <a class="dropdown-item d-block d-lg-none" href="#" data-bs-toggle="modal" data-bs-target="#audiocallModal">Audio <i class="ri-phone-line float-end text-muted"></i></a>
                                    <a class="dropdown-item d-block d-lg-none" href="#" data-bs-toggle="modal" data-bs-target="#videocallModal">Video <i class="ri-vidicon-line float-end text-muted"></i></a>
                                    <a class="dropdown-item" href="#">Archive <i class="ri-archive-line float-end text-muted"></i></a>
                                    <a class="dropdown-item" href="#">Muted <i class="ri-volume-mute-line float-end text-muted"></i></a>
                                    <a class="dropdown-item" href="#">Delete <i class="ri-delete-bin-line float-end text-muted"></i></a>
                                </div> -->
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>` :
                '');
        }

        // message history template
        function messageItemTemplate(msg) {
            let status = '';

            switch (msg.status) {
                case 'Delivered':
                    status = `<i class='ri-check-double-line data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delivered to phone!"></i>'></i>`;
                    break;

                case 'Pending':
                case 'Processing':
                    status = `<i class='ri-check-line' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Processing!"></i></i>`;
                    break;

                case 'Failed':
                    status = `<i class="text-danger ri-error-warning-fill" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Not delivered to phone!"></i>`;
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
                                        ${msg.attachments !== undefined ? messageAttachmentTemplate(JSON.parse(msg.attachments)) : ''}

                                        <p class="mb-0">${msg.content}</p>
                                        <p class="chat-time mb-0">
                                            <span class="align-middle">${msg.is_sender ? status: ''}  ${formatDate(msg.created, 'timeOnly')}</span>
                                        </p>
                                    </div>

                                    <div class="dropdown align-self-start">
                                        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="ri-more-2-fill"></i>
                                        </a>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="#">Copy <i class="ri-file-copy-line float-end text-muted"></i></a>
                                            <a class="dropdown-item" href="#">Delete <i class="ri-delete-bin-line float-end text-muted"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="conversation-name">${msg.sender}</div>
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
                        <li class="list-inline-item message-img-list">
                            <div>
                                <a class="popup-img d-inline-block m-1" title="${attachments[0].file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachments[0].id}/${attachments[0].file_name}">
                                    <img src="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachments[0].id}/${attachments[0].file_name}" class="rounded border object-fit-cover" alt="chat-image" style="min-height: 200px; min-width: 200px">
                                </a>
                            </div>

                            <div class="message-img-link">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item">
                                        <a href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachments[0].id}/${attachments[0].file_name}" download="${attachments[0].file_name}"><i class="ri-download-2-line"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>`;
        }

        // fetch inital threads
        async function fetchThreads() {
            if (!data.threads.length) {
                let fetchData = await _request("/threads/list");
                data.threads = fetchData.data.items;
            }
        }

        // fetch pagination threads
        async function loadMoreThreads() {

            // check if there are more threads to fetch
            if (!data.hasMoreThreads) {
                return;
            }

            const lastMsgId = data.threads.length > 0 ? data.threads[data.threads.length - 1].last_message_id : 0;

            // is already fetching
            if (data.processing) {
                return;
            }

            data.processing = true;

            let fetchData = await _request("/threads/list", 'GET', {
                action: 'messages',
                startId: lastMsgId
            });

            data.processing = false;

            // update hasMoreThreads
            data.hasMoreThreads = (fetchData.data.items.length < fetchData.data.item_limit) ? false : true;

            const threadIds = data.threads.map(item => item.thread_id);
            const newData = fetchData.data.items.filter(thread => !threadIds.includes(thread.thread_id));

            data.threads = data.threads.concat(newData);
        }

        // fetch inital thread conversations
        async function fetchConversations(threadId) {

            // check selected thread messages exist
            const threadExist = data.messages.find(item => item.thread.id == threadId);
            let thread = null;

            if (!threadExist) {
                let fetchData = await _request("/threads/" + threadId);

                // add thread information
                fetchData.data.messages['thread'] = fetchData.data.thread;

                // flag hasMoreMessages
                fetchData.data.messages['hasMoreMessages'] = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

                data.messages.push(fetchData.data.messages);

                thread = fetchData.data.thread;

            } else {
                thread = threadExist.thread;
            }

            return thread;

        }

        // fetch pagination conversation history
        async function loadMoreConversations() {

            const threadId = data.selectedThreadId;

            const threadExist = data.messages.find(item => item.thread.id == threadId);
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
            const fetchData = await _request("/threads/" + threadId, 'GET', {
                startId: lastMsgId,
                action: 'messages'
            });

            data.processing = false;

            // find this thread in state messages
            const thread = data.messages.find(item => item.thread.id == fetchData.data.thread.id);
            // update thread hasMoreMessages
            thread.hasMoreMessages = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

            // push new data to state
            thread.items.push(...fetchData.data.messages.items);

        }

        // fetch new/updated messages
        async function fetchLatestMessages() {

            const mergedItems = data.messages.reduce((acc, cur) => {
                // Concatenate the current items array to the accumulator array
                return acc.concat(cur.items);
            }, []);

            // if no message is found then fetch the last thread message
            if (!mergedItems.length) {
                return data.threads.length ? await fetchConversations(data.threads[0].thread_id) : null;
            }

            // sort the array by id value in desc order and find the last id of where the object status is failed or delivered
            const lastId = mergedItems.sort((a, b) => b.id - a.id).find(item => item.status === "Failed" || item.status === "Delivered")?.id ?? 0;

            const resp = await _request("/threads/latest", 'GET', {
                startId: lastId
            });

            // loop resp.data and push to latest threads state and messages state according to the thread_id

            updateMessages(resp.data);

        }

        // open single chat
        async function openSingleChat(id) {
            const thread = await fetchConversations(id);
            data.selectedThreadId = id;
            data.selectedThreadInfo = thread;

            // set unread = false for openned thread
            data.threads[data.threads.findIndex(item => item.thread_id == id)].unread = false;

            messages__history.scrollTop = messages__history.scrollHeight;
        }

        // new conversation
        function newConversation() {
            newConversationteModal.modal('show');
        }

        async function newConversationSubmit(e) {
            e.preventDefault();

            const btnOldVal = createConversation.find('button[type=submit]').find("i")[0];
            createConversation.find('button[type=submit]').html(spinner).prop('disabled', true);

            // get form data to key value pairs
            const formData = new FormData(createConversation[0]);

            const dataObj = Object.fromEntries(formData.entries());

            const resp = await _request('/threads/create', 'POST', dataObj);

            const thread = {
                thread_id: resp.data.thread_id,
                last_message_id: resp.data.msg_id,
                content: resp.data.content,
                receiver: resp.data.recipient,
                last_activity: resp.data.last_activity
            };

            // add new thread to state or update existing
            if (data.threads.find(item => item.thread_id == thread.thread_id)) {
                data.threads[data.threads.findIndex(item => item.thread_id == thread.thread_id)] = thread;
            } else {
                data.threads.unshift(thread);
            }

            // add latest message to the messages state list if the thread already exist
            if (data.messages.find(item => item.thread.id == thread.thread_id)) {
                data.messages[data.messages.findIndex(item => item.thread.id == thread.thread_id)].items.unshift({
                    id: thread.last_message_id,
                    content: thread.content,
                    attachments: thread.attachments,
                    created: thread.last_activity,
                    updated: thread.last_activity,
                    is_sender: 1,
                    sender: '',
                    status: 'Pending',
                    thread_id: thread.thread_id,
                    type: 'sms'
                });
            }

            // close modal
            newConversationteModal.modal('hide');

            // clear
            createConversation[0].reset();
            createConversation.find('button[type=submit]').html(btnOldVal).prop('disabled', false);

            // open single chat
            openSingleChat(resp.data.thread_id);
        }

        // attachment file validation check
        function fileValidation() {
            let file = fileInput[0].files[0]; // Use [0] to access the DOM element
            const filePath = fileInput.val(); // Use val() to get the value of an input

            const fileSize = file.size;
            if (!allowedExtensions.test(filePath)) { // Use test() to check a regex
                toast("Please select only valid jpg, jpeg, png image file.", 'danger', 5000);
                fileInput.val(""); // Use val("") to clear the input
                return false;
            } else {
                // Image preview
                if (fileInput[0].files && fileInput[0].files[0]) {
                    if (fileSize > 3932160) {
                        toast("Please select file less than 3.75MB", 'danger', 5000);
                        fileInput.val("");
                        return false;
                    }
                }
            }

            return true;
        }

        // preview image of reply message
        function previewReplyImage(e) {

            const validation = fileValidation();

            if (!validation) {
                return;
            }

            const file = e.target.files[0];

            if (!allowedExtensions.test(file.name)) {
                toast("Please select only valid jpg, jpeg, png image file.", 'error', 5000);
                return;
            }

            // create object url of image
            const url = URL.createObjectURL(file);

            // show image
            const pImage = `<div class="image_pre d-inline-block position-relative"><img src='${url}' class='attachment-preview border border-light bg-white rounded' height="150" width="150" style="object-fit: cover"><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i></div>`;

            replyImagePreview.html(pImage).show();
        }

        // remove preview image
        function deleteImage(e) {
            e.parentElement.parentElement.remove();
            replyImagePreview.hide().html('');

            fileInput.val("");
        }

        // reply message process
        async function replyMessage(e) {

            e.preventDefault();

            const selectedThreadId = data.selectedThreadId;

            // get form data to key value pairs
            let formData = new FormData(e.target);

            const last_msg_id = data.messages.find(item => item.thread.id == selectedThreadId).items[0].id;

            //add element last_msg_id to form data
            formData.append('last_msg_id', last_msg_id);

            //if attachment is empty
            let hasFile = true;
            if (formData.get('file').size === 0) {
                formData.delete('file');
                hasFile = false;
            }

            if (!hasFile) {
                formData = Object.fromEntries(formData.entries());
            }

            const element = $(e.target);
            const btnOldVal = element.find('button[type=submit]').find("i")[0];
            element.find('button[type=submit]').html(spinner).prop('disabled', true);

            try {
                const resp = await _request(`/threads/reply/${selectedThreadId}`, 'POST', formData, hasFile);

                // update thread message
                const thread = data.messages.find(item => item.thread.id == selectedThreadId);

                thread.items.unshift({
                    id: resp.data.new_message.msg_id,
                    content: resp.data.new_message.content,
                    attachments: resp.data.new_message.attachments,
                    created: resp.data.new_message.last_activity,
                    updated: resp.data.new_message.last_activity,
                    is_sender: 1,
                    sender: resp.data.new_message.phone_number,
                    status: 'Pending',
                    thread_id: selectedThreadId
                });

                // update latest message thread
                const selectedThread = data.threads[data.threads.findIndex(item => item.thread_id == selectedThreadId)];
                selectedThread.last_message_id = resp.data.new_message.msg_id;
                selectedThread.content = resp.data.new_message.content;
                selectedThread.has_attachment = resp.data.new_message.has_attachment;
                selectedThread.last_activity = resp.data.new_message.last_activity;

                // update thread new message
                updateMessages(resp.data.messages);

                messages__history.scrollTop = messages__history.scrollHeight;

            } catch (error) {
                console.log(error);
            }

            // clear form
            e.target.reset();
            replyImagePreview.hide().html('');
            fileInput.val("");
            element.find('button[type=submit]').html(btnOldVal).prop('disabled', false);

        }


        function updateMessages(messages) {

            messages.forEach(msg => {

                // thread calculation
                const thread = data.threads.find(item => item.thread_id == msg.thread_id);

                const newThread = {
                    thread_id: msg.thread_id,
                    last_message_id: msg.id,
                    receiver: msg.thread_name,
                    content: msg.content,
                    has_attachment: JSON.parse(msg.attachments).length > 0 ? true : false,
                    last_activity: msg.updated,
                    unread: data.selectedThreadId == msg.thread_id ? false : true
                };

                if (thread) {
                    // update thread with new message thread
                    if (thread.last_message_id < msg.id) {
                        data.threads[data.threads.findIndex(item => item.thread_id == thread.thread_id)] = newThread;
                    }


                } else {
                    // add new thread to state
                    data.threads.push(newThread);
                }

                // sort thread by last_message_id
                data.threads.sort((a, b) => b.last_message_id - a.last_message_id);

                // messages updating
                const messageThread = data.messages.find(item => item.thread.id == msg.thread_id);

                const newMessage = {
                    id: msg.id,
                    content: msg.content,
                    attachments: msg.attachments,
                    sender: msg.sender,
                    is_sender: msg.is_sender,
                    status: msg.status,
                    thread_id: msg.thread_id,
                    type: msg.type,
                    created: msg.created,
                    updated: msg.updated
                };

                if (messageThread) {
                    // check if message exist
                    const message = messageThread.items.find(item => item.id == msg.id);

                    if (message) {
                        // update message
                        messageThread.items[messageThread.items.findIndex(item => item.id == message.id)] = newMessage;
                    } else {
                        // add new message
                        messageThread.items.unshift(newMessage);
                    }

                    // sort messages by id
                    messageThread.items.sort((a, b) => b.id - a.id);

                } else {
                    // if any messages avilable in the state
                    if (data.messages.length) {
                        fetchConversations(msg.thread_id);
                    }
                }
            });
        }

        // jq short Ready
        $(function() {
            // initial threads
            fetchThreads();
            component('#threads', threadsListTemplate);

            // inital conversations
            component('#conversation-chat-head', conversationHeadTemplate);
            component('#messages__history', conversationTemplate);

            //polling threads
            setTimeout(() => {
                pollWithDelay(8000, fetchLatestMessages);
            }, 10000);

            ScrollTrigger('#messages__history', 300, () => {
                loadMoreConversations();
            });

            // load more threads when scrolling threads list
            detectScrollToOffset('.chat-message-list .simplebar-content-wrapper', 100, 'bottom', () => {
                loadMoreThreads();
            });

            // show conversations on thread click
            $(document).on('click', '#threads [data-threadid]', function() {
                openSingleChat($(this).data("threadid"));
            });

            // responsive hide conversation
            $(document).on('click', '.user-chat-remove', function() {
                $(this).closest('.user-chat').removeClass("user-chat-show");
                // update state
                data.selectedThreadId = 0;
            });

            // initial page setup for conversations
            $(document).on('reef:render', function(event) {

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

                // save state in local storage
                saveStateToLocalStorage();

                $(".popup-img").magnificPopup({
                    type: "image",
                    closeOnContentClick: !0,
                    mainClass: "mfp-img-mobile",
                    image: {
                        verticalFit: !0
                    }
                });

                //initialise tooltip
                let tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

            });

            // new conversation form submit
            createConversation.on('submit', newConversationSubmit);
            // Image Upload add message form
            msgReplyInput.on('change', previewReplyImage);
            // thread reply form submit
            msgReplyForm.on('submit', replyMessage);

        });
    </script>
</body>


</html>