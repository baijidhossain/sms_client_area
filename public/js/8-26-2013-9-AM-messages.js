const loader = `<div class="chat-loader-section"> <div class="loader_bg" style="display: block; background-color: #f5f7fb;"> <div class="text-center"> <div class="loader"> <span></span> <span></span> </div></div></div></div>`;
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
        
        hasMoreThreads: true,
        messages: [],
        selectedThreadId: 0,
        selectedThreadInfo: {},
        processing: false,
        filteredThreads: null,
        searchQuery: '',
        phoneData: {
            hasMore: true,
            selected: 0,
            threads: [],
        },


    };

    try {
        // Get a timestamp before the code
        var start = performance.now();

        await initializeDB();
        const localState = await loadStateFromDB();

        if (Object.keys(localState).length !== 0) {

            stateObject = localState;

        } else {
            await saveStateToDB(stateObject);
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

// Threads List template
function threadsListTemplate() {


    if (data.filteredThreads !== null) {
        return `${data.filteredThreads.map((thread) =>
            `<li class="thread ${data.selectedThreadId == thread.thread_id ? 'active' : ''}" id="thread_${thread.thread_id}">
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
                            <h5 class="text-truncate font-size-15 mb-0">${formatPhoneNumber(thread.receiver, thread.number_format)}</h5>
                        </div>            
                    </div>
                </a>
            </li>`
        ).join("")}`;
    }

    const threads = data.phoneData.selected !== 0 ? data.phoneData.threads[data.phoneData.selected] : data.threads.items;


    if (!threads || threads.length === 0) {
        return `<div class="no-leatest-message text-center">
                        <div class="icon" style="font-size: 40px; color: #ccc;"><i class="ri-chat-3-line"></i></div>
                        <p class="text-muted">Once you start a new conversation<br> you'll see it listed here</p>
                </div>`;
    }


    return `${threads.map((thread) =>
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

                        <h5 class="text-truncate font-size-15 mb-1">${formatPhoneNumber(thread.receiver, thread.number_format)}</h5>
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
                                ${msg.attachments !== undefined ? messageAttachmentTemplate(JSON.parse(msg.attachments)) : ''}

                                <p class="mb-0 chat-content">${msg.content}</p>
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

function phoneNumberTemplate(){

let smsService = JSON.parse(localStorage.user || [])?.services?.sms

if (smsService.length > 1) {

         return `<select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
             <option value="0">All Numbers</option>
             ${smsService.map(sms => `<option value="${sms.phone_id}">${sms.number}</option>`)}
         </select>`;   
  
  }

      return '';
  

}

// fetch inital threads
async function fetchThreads() {

    if (!data.threads.items.length) {
        try {
            let fetchData = await _request("/threads/list");
            fetchData.data ? data.threads.items = fetchData.data.items : false;

        } catch (error) {
            console.log(error);
        }
    }
}


async function makeReadMessageRequest(id) {

    try {
        const resp = await _request("/threads/ReadMessage/", 'POST', {
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

    if (phoneId && !data.phoneData.hasMore) {
        return;
    }

    let threads = phoneId !== 0 ? data.phoneData.threads[data.phoneData.selected] : data.threads.items;

    const lastMsgId = threads.length > 0 ? threads[threads.length - 1].message_id : 0;


    // is already fetching
    if (data.processing) {
        return;
    }

    data.processing = true;

    try {

        let fetchData = await _request("/threads/list/" + phoneId, 'GET', {
            action: 'messages',
            startId: lastMsgId
        });

        data.processing = false;

        // update hasMoreThreads
        const status = (fetchData.data.items.length < fetchData.data.item_limit) ? false : true;

        phoneId ? data.phoneData.hasMore = status : data.threads.hasMore = status;

        const threadIds = threads.map(item => item.thread_id);

        const newData = fetchData.data.items.filter(thread => !threadIds.includes(thread.thread_id));

        threads = threads.concat(newData);

        phoneId ? data.phoneData.threads[data.phoneData.selected] = threads : data.threads.items = threads;

    } catch (error) {
        console.log(error);

    }
}


// fetch inital thread conversations
async function fetchConversations(threadId) {

    // check selected thread messages exist
    const threadExist = data.messages.find(item => item.thread.id == threadId);

    let thread = null;

    if (!threadExist) {

        try {

            let fetchData = await _request("/threads/" + threadId);

            // add thread information
            fetchData.data.messages['thread'] = fetchData.data.thread;

            // flag hasMoreMessages
            fetchData.data.messages['hasMoreMessages'] = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

            data.messages.push(fetchData.data.messages);

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

    try {

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

        const resp = await _request("/threads/latest", 'GET', {
            startId: lastId
        });

        if (data.selectedThreadId) {

            const filteredMessages = resp.data.filter(item => item.thread_id === data.selectedThreadId && item.unread == true);
            const msg_ids = filteredMessages.map(item => item.id).join(',');

            // update original resp.data message of current thread unread status
            resp.data.forEach(item => {
                resp.data[resp.data.indexOf(item)].unread = false;
            })

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
    let conversation = data.threads.items[data.threads.items.findIndex(item => item.thread_id == id)];
    if (conversation) {
        conversation.unread = false;
    }

    messages__history.scrollTop = messages__history.scrollHeight;
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

    const btnOldVal = createConversation.find('button[type=submit]').find("i")[0];
    createConversation.find('button[type=submit]').html(spinner).prop('disabled', true);

    // get form data to key value pairs
    const formData = new FormData(createConversation[0]);

    //replace recipient with international format
    formData.set('recipient', iti.getNumber());

    const dataObj = Object.fromEntries(formData.entries());

    //trim content
    dataObj.message = dataObj.message.trim();


    try {
        const resp = await _request('/threads/create', 'POST', dataObj);

        const thread = {
            thread_id: resp.data.thread_id,
            message_id: resp.data.msg_id,
            content: resp.data.content,
            receiver: resp.data.recipient,
            number_format: resp.data.number_format,
            last_activity: resp.data.last_activity
        };

        // add new thread to state or update existing
        if (data.threads.items.find(item => item.thread_id == thread.thread_id)) {
            data.threads.items[data.threads.items.findIndex(item => item.thread_id == thread.thread_id)] = thread;
        } else {
            data.threads.items.unshift(thread);
        }

        // add latest message to the messages state list if the thread already exist
        if (data.messages.find(item => item.thread.id == thread.thread_id)) {
            data.messages[data.messages.findIndex(item => item.thread.id == thread.thread_id)].items.unshift({
                id: thread.message_id,
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
        const selectedThread = data.threads.items[data.threads.items.findIndex(item => item.thread_id == selectedThreadId)];

        selectedThread.message_id = resp.data.new_message.msg_id;
        selectedThread.content = resp.data.new_message.content;
        selectedThread.has_attachment = resp.data.new_message.has_attachment;
        selectedThread.last_activity = resp.data.new_message.last_activity;

        // sort thread by message_id
        data.threads.items.sort((a, b) => b.message_id - a.message_id);


        if (data.phoneData.selected !== 0) {
            // add new thread to phoneData state
            const selectedPhoneThread = data.phoneData.threads[data.phoneData.selected][data.phoneData.threads[data.phoneData.selected].findIndex(item => item.thread_id == selectedThreadId)];
            selectedPhoneThread.message_id = resp.data.new_message.msg_id;
            selectedPhoneThread.content = resp.data.new_message.content;
            selectedPhoneThread.has_attachment = resp.data.new_message.has_attachment;
            selectedPhoneThread.last_activity = resp.data.new_message.last_activity;
            data.phoneData.threads[data.phoneData.selected].sort((a, b) => b.message_id - a.message_id);


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
        // thread calculation
        const thread = data.threads.items.find(item => item.thread_id == msg.thread_id);


        const newThread = {
            thread_id: msg.thread_id,
            message_id: msg.id,
            receiver: msg.receiver,
            number_format: msg.number_format,
            content: msg.content,
            has_attachment: JSON.parse(msg.attachments).length > 0 ? true : false,
            last_activity: msg.updated,
            unread: msg.unread,
        };

        if (thread) {
            // update thread with new message thread
            if (thread.message_id < msg.id) {

                data.threads.items[data.threads.items.findIndex(item => item.thread_id == thread.thread_id)] = newThread;

                //if phoneData.selected is not 0
                if (data.phoneData.selected !== 0) {
                    // update phoneData state
                    data.phoneData.threads[data.phoneData.selected][data.phoneData.threads[data.phoneData.selected].findIndex(item => item.thread_id == thread.thread_id)] = newThread;
                }

                if (!isPlaying) {
                    playNotificationSound();
                    isPlaying = true;
                }
            }



        } else {

            // add new thread to state
            data.threads.items.push(newThread);

            //if phoneData.selected is not 0
            if (data.phoneData.selected !== 0) {
                // add new thread to phoneData state
                data.phoneData.threads[data.phoneData.selected].push(newThread);
            }

        }

        // sort thread by message_id
        data.threads.items.sort((a, b) => b.message_id - a.message_id);

        // sort phoneData by message_id
        if (data.phoneData.selected !== 0) {
            data.phoneData.threads[data.phoneData.selected].sort((a, b) => b.message_id - a.message_id);
        }

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
                await fetchConversations(msg.thread_id);
            }
        }


    }

    isPlaying = false;
}


async function searchThreads(term) {

    //replace all special characters without + and numbers

    term = term.replace(/[^0-9a-zA-Z+]/g, '');

    const phoneId = data.phoneData.selected;

    const response = await _request("/threads/search/" + phoneId, 'GET', {
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

async function getphoneData() {
    const threads = await _request("/threads/list/" + data.phoneData.selected, 'GET');
    data.phoneData.threads[data.phoneData.selected] = threads.data.items;
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

    // inital conversations
    component('#conversation-chat-head', conversationHeadTemplate);
    component('#messages__history', conversationTemplate);

    //polling threads
    setTimeout(() => {
        pollWithDelay(5000, fetchLatestMessages);
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
   

    $(document).on("change", "#threadsPhone", function () {

        let phoneSelected = parseInt($(this).val());
        
        data.phoneData.hasMore = true;

        if (phoneSelected !== 0) {

            data.phoneData.selected = phoneSelected;
            getphoneData();
            return;
        }

        data.phoneData.selected = 0;
        //scroll threads to top
        $('.chat-message-list .simplebar-content-wrapper').scrollTop(0);

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

    // show conversations on thread click
    $(document).on('click', '#threads [data-threadid]', function () {
        openSingleChat($(this).data("threadid"));
        console.log($('#message'));
        $('#message').val('').focus();
    });

    // responsive hide conversation
    $(document).on('click', '.user-chat-remove', function () {
        $(this).closest('.user-chat').removeClass("user-chat-show");
        // update state
        data.selectedThreadId = 0;
    });

    // initial page setup for conversations
    $(document).on('reef:render', function (event) {

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
        saveStateToDB(cloneObjFromProxy(data));

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



    $('#searchInput').on('input', (event) => {

        $('#clear-search').removeClass('d-none');

        $('#threads-title').text('Search Results');

        let searchQuery = event.target.value.trim();

        const threadsData = data.phoneData.selected !== 0 ? data.phoneData.threads[data.phoneData.selected] : data.threads.items;

        //filter threads
        data.filteredThreads = threadsData.filter(thread => thread.receiver.toLowerCase().includes(searchQuery));

        // api call after 500ms
        setTimeout(() => {

            data.searchQuery = event.target.value.trim();

            if (!data.searchQuery || data.searchQuery.length < 3) {
                return;
            }

            searchThreads(data.searchQuery);

        }, 500);

    });


    $('#clear-search').on('click', (event) => {
        clearSearch();
    });

    //on reef state change
    if (data.searchQuery === '') {
        clearSearch();
    }

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

    //on messages__history scroll 2000px from top
    detectScrollToOffset('#messages__history', 2000, 'top', () => {
        $('.scroll-bottom-btn').removeClass('d-none');
    });


    //show scroll-bottom-btn if messages__history scrollTop is 0
    messages__history.addEventListener('scroll', function () {
        if (messages__history.scrollTop == 0) {
            $('.scroll-bottom-btn').addClass('d-none');
        }
    });

    //newConversationteModal.modal on close reset form
    newConversationteModal.on('hidden.bs.modal', function (e) {
        createConversation[0].reset();
    });
});

