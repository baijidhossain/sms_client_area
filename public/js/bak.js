const loader = `<div class="chat-loader-section"> <div class="loader_bg bg-light" style="display: block;"> <div class="text-center"> <div class="loader"> <span></span> <span></span> </div></div></div></div>`;
const spinner = `<div class="spinner-border" role="status" style="--bs-spinner-width: 1rem;--bs-spinner-height: 1rem;"><span class="visually-hidden">Loading...</span></div>`;

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
        const localState = await loadStateFromDB();

        if (Object.keys(localState).length !== 0) {

            stateObject.threads = localState.threads;
            stateObject.messages = localState.messages;
            stateObject.phoneData = localState.phoneData;

        } else {
            const savingObj = {
                threads: stateObject.threads,
                messages: stateObject.messages,
                phoneData: stateObject.phoneData
            };

            await saveStateToDB(savingObj);
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

    const authPhones = new Set(JSON.parse(localStorage.user || []).services?.sms.map(authPhone => authPhone.phone_id));

    //if data.selectedThreadInfo.participants is empty then return
    if (!data.selectedThreadInfo.participants?.length) {
        return '';
    }

    const authPhonesArray = data.selectedThreadInfo.participants.filter(participant => authPhones.has(participant.phone_id));

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


// Threads List template
function threadsListTemplate() {


    if (data.filteredThreads !== null) {

        if (data.searchQuery.length && data.filteredThreads.length === 0) {

            return `<div class="list-unstyled chat-list chat-user-list text-center" id="empty-search"><p class="text-muted my-5">No results found</p></div>`;
        }

        return `${data.filteredThreads.map(function(thread, index) {

            let threadName = data.filteredThreads[index].name ?? generateThreadName(thread);

            if(data.filteredThreads[index].name == null) data.filteredThreads[index].name = threadName;

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

        let threadName = threads[index]?.name ?? generateThreadName(thread);

        if(threads[index]?.name == null) threads[index].name = threadName;

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

    let threadName = data.selectedThreadInfo.name ?? generateThreadName(data.selectedThreadInfo);
    // update name if null
    if (data.selectedThreadInfo.name == null)  data.selectedThreadInfo.name = threadName;

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
            <div class="col-sm-8 col-4">
                <ul class="list-inline user-chat-nav text-end mb-0">
                    <li class="list-inline-item">
                        
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
    const authPhones = new Set(JSON.parse(localStorage.user || []).services?.sms.map(authPhone => authPhone.phone_id));
    const thread = threadInfo;

    let threadName = '';

    if (thread?.participants?.length) {
        // Filter participants that match authenticated phone IDs
        const authPhonesArray = thread.participants.filter(participant => authPhones.has(participant.phone_id));

        // Filter participants that do not match authenticated phone IDs
        const withoutAuthPhonesArray = thread.participants.filter(participant => !authPhones.has(participant.phone_id));

        // if the thread has more than one participant as my auth phones
        if (authPhonesArray.length > 1) {

            // check if thread.sender phone number is one of the authPhonesArray, then the thread_name is the other participants without the sender phone
            if (authPhonesArray.some(authPhone => authPhone.number == thread.sender)) {
                // if the thread has more than one participant regardless of my auth phones
                if (withoutAuthPhonesArray.length > 1) {
                    threadName = `You and ${withoutAuthPhonesArray.length} others`;
                } else {
                    // if the thread has more than 2 of my auth phones or only 2 of my auth phones
                    if(authPhonesArray.length > 2){
                        threadName = `You and ${authPhonesArray.length - 1} others`
                    } else {
                        threadName = thread.participants.find(participant => participant.number != thread.sender)?.number 
                        ? formatPhoneNumber(
                            thread.participants.find(participant => participant.number != thread.sender).number, 
                            thread.participants.find(participant => participant.number != thread.sender).format_template
                        )
                        : formatPhoneNumber(thread.participants[0].number, thread.participants[0].format_template);
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
                ${attachments.map(attachment =>
        `<li class="list-inline-item message-img-list">
                    <div>
                        <a class="popup-img d-inline-block m-1" title="${attachment.file_name}" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}">
                            <img src="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}" class="rounded border object-fit-cover" alt="${attachment.file_name}" style="min-height: 200px; min-width: 200px">
                        </a>
                    </div>
                    <div class="message-img-link">
                        <ul class="list-inline mb-0">
                            <li class="list-inline-item">
                                <a href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token}/${attachment.id}/${attachment.file_name}" download="${attachment.file_name}"><i class="ri-download-2-line"></i></a>
                            </li>
                        </ul>
                    </div>
                </li>`
    ).join("")}
            </ul>`;
}

//phone number template

function phoneNumberTemplate() {

    let smsService = JSON.parse(localStorage.user || [])?.services?.sms

    if (smsService.length > 1) {

        return `<select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
             <option value="0">All Numbers</option>
             ${smsService.map(sms => `<option ${sms.phone_id == data.phoneData.selected ? 'selected' : ''} value="${sms.phone_id}">${sms.number}</option>`).join('')}
         </select>`;

    }

    return '';

}

function ConversationNumberTemplate() {


    const selectedPhone = data.phoneData.selected;

    let smsService = JSON.parse(localStorage.user || [])?.services?.sms

    if (smsService.length > 1) {

        return `<label for="recipient-name" class="col-form-label">Sender Phone</label>
          <select class="bg-dark-subtle form-select" name="phone_id" required>
             ${smsService.map(sms => `<option value="${sms.phone_id}"
                @selected=${sms.phone_id == selectedPhone ? true : false}
             >${sms.number}</option>`).join('')}
         </select>`;
    }

    return '';

}

function participantSidebarTemplate() {

    let threadName = data.selectedThreadInfo.name ?? generateThreadName(data.selectedThreadInfo);

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
                                        <i class="ri-group-line"></i> Participants
                                    </h5>
                                </button>
                            </div>
                            <div id="attachprofile" class="accordion-collapse collapse show" aria-labelledby="attachfile3" data-bs-parent="#myprofile">
                                <div class="accordion-body">
                                ${data.selectedThreadInfo.participants.map(participant => `
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

            if(fetchData.data){
                data.threads.items = fetchData.data.items
                data.threads.hasMore = fetchData.data.item_limit == fetchData.data.items.length

                const authPhones = new Set(JSON.parse(localStorage.user || []).services?.sms?.map(authPhone => authPhone.phone_id));
                
                // loop through threads and copy threads to individual phoneData
                fetchData.data.items.forEach(thread => {
                    const authPhonesArray = thread.participants.filter(participant => authPhones.has(participant.phone_id));

                    authPhonesArray.forEach(authPhone => {
                        if (!data.phoneData.threads[authPhone.phone_id]) {
                            data.phoneData.threads[authPhone.phone_id] = {
                                items: [],
                                hasMore: true
                            };
                        }

                        data.phoneData.threads[authPhone.phone_id].items.push(thread);

                        data.phoneData.threads[authPhone.phone_id].items.sort((a, b) => b.message_id - a.message_id);
                    });
                });
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

    const lastMsgId = threads.length > 0 ? threads[threads.length - 1].message_id : 0;

    // is already fetching
    if (data.processing) {
        return;
    }

    data.processing = true;

    try {

        let fetchData = await _request(APIS.THREAD_LIST + "/" + phoneId, 'GET', {
            action: 'messages',
            startId: lastMsgId
        });

        data.processing = false;

        // update hasMoreThreads
        const hasMore = (fetchData.data.items.length < fetchData.data.item_limit) ? false : true;

        phoneId !== 0 ? data.phoneData.threads[phoneId].hasMore = hasMore : data.threads.hasMore = hasMore;

        const threadIds = threads.map(item => item.thread_id);

        const newData = fetchData.data.items.filter(thread => !threadIds.includes(thread.thread_id));

        threads = threads.concat(newData);

        phoneId !== 0 ? data.phoneData.threads[phoneId].items = threads : data.threads.items = threads;

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

    if (!threadExist) {

        try {

            let fetchData = await _request(APIS.THREAD_CONVERSATIONS + "/" + threadId);

            // add thread information
            fetchData.data.messages['thread'] = fetchData.data.thread;

            // flag hasMoreMessages
            fetchData.data.messages['hasMoreMessages'] = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

            if(fetchData.data.messages.items.length){
                data.messages[fetchData.data.messages.thread.id] = fetchData.data.messages;
            }

            thread = fetchData.data.thread;

        } catch (error) {
            console.log(error);
        }

    } else {
        thread = threadExist.thread;
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

        const fetchData = await _request(APIS.THREAD_CONVERSATIONS + "/" + threadId, 'GET', {
            startId: lastMsgId,
            action: 'messages'
        });

        data.processing = false;

        // find this thread in state messages
        const thread = data.messages[fetchData.data.thread.id];
        // update thread hasMoreMessages
        thread.hasMoreMessages = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

        // push new data to state
        thread.items.push(...fetchData.data.messages.items);

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
    if (!mergedItems.length) {
        return data.threads.items.length ? await fetchConversations(data.threads.items[0].thread_id) : null;
    }

    // sort the array by id value in desc order and find the last id of where the object status is failed or delivered
    const lastId = mergedItems.sort((a, b) => b.id - a.id).find(item => item.status === "Failed" || item.status === "Delivered")?.id ?? 0;

    try {

        const resp = await _request(APIS.LATEST_MESSAGE, 'GET', {
            startId: lastId
        });

        if (data.selectedThreadId) {

            const filteredMessages = resp.data.filter(item => item.thread_id === data.selectedThreadId && item.unread == true);
            const msg_ids = filteredMessages.map(item => item.id).join(',');

            // update original resp.data message of current thread unread status
            resp.data.forEach((item, index) => {
                if(item.thread_id == data.selectedThreadId){
                    // update message
                    resp.data[index].unread = false;
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

    const filteredMessages = data.threads.items.filter(threads => threads.thread_id == id && threads.unread == true);
    if (filteredMessages.length > 0) {
        makeReadMessageRequest(filteredMessages[0].message_id);
    }

    // set unread = false for openned thread
    let mainThread = data.threads.items[data.threads.items.findIndex(item => item.thread_id == id)];
    if (mainThread) {
        mainThread.unread = false;
    }

    // set unread = false for openned thread in phoneData
    const authPhones = new Set(JSON.parse(localStorage.user || []).services?.sms.map(authPhone => authPhone.phone_id));
    const authPhonesArray = thread.participants.filter(participant => authPhones.has(participant.phone_id));

    authPhonesArray.forEach((phone) => {

        const threadIndex = data.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == thread.thread_id);

        if (threadIndex >= 0) {
            data.phoneData.threads[phone.phone_id].items[threadIndex].unread = false;
        }

    });


    messages__history.scrollTop = messages__history.scrollHeight;

    $("#participants-sidebar").find(".user-profile-sidebar").hide();
    userProfileSideber.render();
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

        // also update thread list of phoneData
        const authPhones = new Set(JSON.parse(localStorage.user || []).services?.sms.map(authPhone => authPhone.phone_id));
        const authPhonesArray = thread.participants.filter(participant => authPhones.has(participant.phone_id));

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
        return;
    }

    const file = e.target.files[0];

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


        // update thread message
        const thread = data.messages[selectedThreadId];

        thread.items.unshift({
            id: resp.data.new_message.message_id,
            content: resp.data.new_message.content,
            attachments: resp.data.new_message.attachments,
            created: resp.data.new_message.last_activity,
            updated: resp.data.new_message.last_activity,
            is_sender: 1,
            sender: resp.data.new_message.sender,
            status: 'Pending',
            thread_id: selectedThreadId
        });

        // update latest message thread
        const selectedThread = data.threads.items[data.threads.items.findIndex(item => item.thread_id == selectedThreadId)];

        selectedThread.message_id = resp.data.new_message.message_id;
        selectedThread.content = resp.data.new_message.content;
        selectedThread.has_attachment = resp.data.new_message.has_attachment;
        selectedThread.last_activity = resp.data.new_message.last_activity;

        // sort thread by message_id
        data.threads.items.sort((a, b) => b.message_id - a.message_id);


        if (data.phoneData.selected !== 0) {
            // add new thread to phoneData state
            const selectedPhoneThread = data.phoneData.threads[data.phoneData.selected][selectedThreadId];
            selectedPhoneThread.message_id = resp.data.new_message.message_id;
            selectedPhoneThread.content = resp.data.new_message.content;
            selectedPhoneThread.has_attachment = resp.data.new_message.has_attachment;
            selectedPhoneThread.last_activity = resp.data.new_message.last_activity;

            // sort thread by message_id
            data.phoneData.threads[data.phoneData.selected]?.items?.sort((a, b) => b.message_id - a.message_id);
        }

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

}


async function updateMessages(messages) {

    let isPlaying = false;

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
            created: msg.created,
            updated: msg.updated
        };

        // main thread list update
        const thread = data.threads.items.find(item => item.thread_id == msg.thread_id);
        const threadIndex = data.threads.items.findIndex(item => item.thread_id == msg.thread_id);

        if (thread) {
            
            if(thread.message_id < msg.id) {
                // update thread with new message thread
                data.threads.items[threadIndex] = newThread;

                isPlaying ? null : (playNotificationSound(), isPlaying = true);
            }

        } else {

            // add new thread to state
            data.threads.items.push(newThread);
            
            isPlaying ? null : (playNotificationSound(), isPlaying = true);

        }

        // sort thread by message_id
        data.threads.items.sort((a, b) => b.message_id - a.message_id);

        // individual phoneData thread list update
        const authPhones = new Set(JSON.parse(localStorage.user || []).services?.sms.map(authPhone => authPhone.phone_id));
        const authPhonesArray = newThread.participants.filter(participant => authPhones.has(participant.phone_id));

        authPhonesArray.forEach((phone, index) => {

            // check if data.phoneData.threads[phoneId].items exist
            if (!data.phoneData.threads[phone.phone_id]) {
                data.phoneData.threads[phone.phone_id] = {
                    items: []
                };
            }

            const threadIndex = data.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == newThread.thread_id);

            if (threadIndex >= 0) {
                data.phoneData.threads[phone.phone_id].items[threadIndex] = newThread;
            } else {
                data.phoneData.threads[phone.phone_id].items.unshift(newThread);
            }

            
            // resort threads by message_id in desc order
            data.phoneData.threads[phone.phone_id].items.sort((a, b) => b.message_id - a.message_id);
        });


        // messages updating
        // const messageThread = data.messages.find(item => item.thread.id == msg.thread_id);
        const messageThread = data.messages[msg.thread_id];


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
    const threads = await _request(APIS.THREAD_LIST + "/" + phoneId, 'GET', {
        action: 'messages',
        startId: data.phoneData.threads[phoneId]?.items[data.phoneData.threads[phoneId]?.items.length - 1]?.message_id ?? 0
    });

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
}

function playNotificationSound() {

    const notificationSound = new Audio("../public/notifications/chat.mp3");

    if (('AudioContext' in window || 'webkitAudioContext' in window) && notificationSound) {
        var promise = notificationSound.play();
        if (promise !== undefined) {
            promise.then(function () {

            }).catch(function (error) {
                console.error('Error playing sound:', error);
            });
        }
    }
}

// jq short Ready
let data = {};
let iti = null;
let userProfileSideber = null;
$(async function () {

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

    let selPhoneCom = component('#selectPhoneComponent', selectPhoneComponent);
    selPhoneCom.stop();

    //polling threads
    setTimeout(() => {
        poolWithDelay(5000, fetchLatestMessages);
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


    $(document).on("change", "#threadsPhone", async function () {

        let phoneSelected = parseInt($(this).val());
        
        numTemplate.render();
        data.phoneData.selected = phoneSelected ?? 0;

        if (phoneSelected !== 0 && data.phoneData.threads[data.phoneData.selected]?.items?.length < 30) {
            $("#threads").html(loader);
            await fetchPhoneThreads(data.phoneData.selected);
            return;
        }

        //scroll threads to top
        $('.chat-message-list .simplebar-content-wrapper').scrollTop(0);

    });

    //jquery data-select-phone-id click
    $(document).on('click', '#selectPhoneComponent [data-select-phone-id]', function (e) {

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
    msgReplyInput.on('change', previewReplyImage);
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
    $(document).on('click', '.user-chat-remove', function () {
        $(this).closest('.user-chat').removeClass("user-chat-show");
        // update state
        data.selectedThreadId = 0;
    });


    // initial page setup for conversations
    $(document).on('reef:render', function (e) {

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
        const savingObj = {
            threads: cloneObjFromProxy(data.threads),
            messages: cloneObjFromProxy(data.messages),
            phoneData: cloneObjFromProxy(data.phoneData)
        };

        saveStateToDB(savingObj);

        $(".popup-img").magnificPopup({
            type: "image",
            closeOnContentClick: !0,
            mainClass: "mfp-img-mobile",
            image: {
                verticalFit: !0
            }
        });

        // destroy tooltip
        // $("[data-toggle='tooltip']").tooltip();

    });


    // show conversations on thread click
    $(document).on('click', '#threads [data-threadid]', async function () {

        await openSingleChat($(this).data("threadid"));

        isPoolingRender = false;

        selPhoneCom.render();

        $(document).on('reef:render', function(event) {

            if (!isPoolingRender) {
                $('#message').val('').focus();
            }
            isPoolingRender = true;
        });

    });

    $(document).on('click', '.user-profile-show', function() {
        userProfileSideber.render();
        setTimeout(() => {

            if ($("#participants-sidebar").find(".user-profile-sidebar").is(":hidden")) {
                $("#participants-sidebar").find(".user-profile-sidebar").show()
            }
            
        }, 0);
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
    

    //Copy to clipboard
    $(document).on('click', '.copy-btn', function () {

        var cbody = $(this).closest('.user-chat-content');
        var chatContent = cbody.find('.chat-content').text();

        var tempTextarea = $('<textarea>');
        tempTextarea.val(chatContent).appendTo('body').select();

        document.execCommand('copy');
        tempTextarea.remove();

        // Show the tooltip
        cbody.tooltip({
            title: 'Copied!',
            trigger: 'manual'
        }).tooltip('show');

        setTimeout(function () {
            cbody.tooltip('hide');
        }, 2000);

    });

    //.scroll-bottom-btn on click scroll to bottom and hide
    $(document).on('click', '.scroll-bottom-btn', function () {
        $(this).addClass('d-none');
        messages__history.scrollTop = messages__history.scrollHeight;
    });


    //show scroll-bottom-btn if messages__history scrollTop is 0
    messages__history.addEventListener('scroll', function () {

        //set min height
        let minHeight = 400;

        //show hide scroll-bottom-btn
        Math.abs(messages__history.scrollTop) < minHeight ? $('.scroll-bottom-btn').addClass('d-none') : $('.scroll-bottom-btn').removeClass('d-none');

    });

    //newConversationteModal.modal on close reset form
    newConversationteModal.on('hidden.bs.modal', function (e) {
        createConversation[0].reset();
    });
});
