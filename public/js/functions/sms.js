const loader = `<div class="chat-loader-section"> <div class="loader_bg bg-light" style="display: block;"> <div class="text-center"> <div class="loader"> <span></span> <span></span> </div></div></div></div>`;
const spinner = `<div class="spinner-border" role="status" style="--bs-spinner-width: 1rem;--bs-spinner-height: 1rem;"><span class="visually-hidden">Loading...</span></div>`;

// Allowing file type
// const allowedExtensions = /(.jpg|.jpeg|.png)$/i;

const attachmentTypes = {
    'sms': [
        {
            icon: 'ri-image-fill',
            title: 'Image',
            type: 'image/jpg, image/jpeg, image/png',
        }
    ],
    'whatsapp': [
        {
            icon: 'ri-image-fill',
            title: 'Image',
            type: 'image/jpg, image/jpeg, image/png',
        },
        // {
        //     icon: 'ri-video-fill',
        //     title: 'Video',
        //     type: 'video/*',
        // },
        // {
        //     icon: 'ri-file-pdf-2-line',
        //     title: 'Document',
        //     type: 'application/pdf',
        // }
    ]
};

let iti = {};

let selPhoneCom = null;

async function initPageData() {

    const newConversationteModal = $('#newConversationteModal');
    const createConversation = $('#createConversation');
    const msgReplyInput = $('#upload_input');
    const msgReplyForm = $('#message_form');

    let { component, render } = reef;

    $('.loader-container').hide();

    // data from db

    window.state = window.appState[window.ipbxapi_serviceType];

    // initial threads
    await fetchThreads();

    // initialize components
    component('#threads', threadsListTemplate);
    component('#phone-number', phoneNumberTemplate);

    const numTemplate = component('#new_conversation_phone', ConversationNumberTemplate);
    numTemplate.stop();

    component('#participants-sidebar', participantSidebarTemplate);

    // inital conversations
    conversationChatHead = component('#conversation-chat-head', conversationHeadTemplate);
    component('#messages__history', conversationTemplate);

    selPhoneCom = component('#selectPhoneComponent', selectPhoneComponent);
    component('#attachmentComponent', attachmentComponent);
    selPhoneCom.stop();


    //polling threads
    // setTimeout(() => {
    //     poolWithDelay(10000, fetchLatestMessages);
    // }, 2000);

    // Clear prvious search
    clearSearch();


    $(document).on('click', '#addRecipientFieldBtn', function () {

        console.log(iti);

        let count = Object.keys(iti).length + 1;
        let maxFields = 10;

        if (count <= maxFields) {
            let newRecipientField = `<div class="d-flex mb-2">
            <input type="tel" class="form-control bg-light border-light mb-2 recipient" name="recipient" required>
            <button type="button" class="btn btn-sm btn-danger removeRecipientField"><i class="ri-close-line fs-5"></i></button>
            </div>`;
            $("#recipientFieldsContainer").append(newRecipientField);
            $("#recipient-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

            // Initialize intlTelInput for the newly added input field
            initializeIntlTelInput(
                //$("#recipientFieldsContainer input.recipient").last()[0]
                $(document).find("#recipientFieldsContainer input.recipient").last()[0]
            );
        }

    });

    $(document).on("click", ".removeRecipientField", function () {

        let count = (Object.keys(iti).length - 1);
        let maxFields = 10;

        // Remove the iti object with the corresponding id
        delete iti[$(this).prev(".iti").attr("id").replace('iti_', '')];

        $("#recipient-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

        $(this).closest(".d-flex").remove();
    });


    $(document).on("change", "#threadsPhone", async function () {

        let phoneSelected = parseInt($(this).val());
        numTemplate.render();

        let phoneThreads = window.state.phoneData.threads;
        window.state.phoneData.selected = phoneSelected ?? 0;

        if (phoneSelected !== 0 && (!phoneThreads[window.state.phoneData.selected]?.items || phoneThreads[window.state.phoneData.selected]?.items?.length < 30)) {
            $("#threads").html(loader);
            await fetchPhoneThreads(window.state.phoneData.selected);
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

    // data-attachment on click
    $(document).on('click', '[data-attachment]', function () {
        //set accept attribute
        $('#upload_input').attr('accept', $(this).data('attachment'));
        //click msgReplyInput
        msgReplyInput.click();
    });


    msgReplyInput.on('change', function (e) {
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
    $(document).on('click', '.user-chat-remove', function () {
        $(this).closest('.user-chat').removeClass("user-chat-show");
        // update state
        window.state.selectedThreadId = 0;
    });


    // initial page setup for conversations
    $(document).on('reef:render', function (e) {

        // toogle chat-welcome-section
        if (window.state.selectedThreadId == 0) {
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
    $(document).on('click', '#threads [data-threadid]', async function () {

        await openSingleChat($(this).data("threadid"));

        isPoolingRender = false;

        $(document).on('reef:render', function (event) {

            if (!isPoolingRender) {
                $('#message').val('').focus();
            }
            isPoolingRender = true;
        });

    });

    $(document).on('click', '.user-profile-show', function () {
        window.appState.components.sidebarOpen = true;
    });


    $(document).on('click', '#user-profile-hide', function () {
        window.appState.components.sidebarOpen = false;
    });


    $('#searchInput').on('keyup', (event) => {

        $('#clear-search').removeClass('d-none');

        $('#threads-title').text('Search Results');

        let searchQuery = event.target.value.trim();

        if (searchQuery == '') {
            clearSearch();
            return false;
        }

        const threadsData = window.state.phoneData.selected !== 0 ? (window.state.phoneData.threads[window.state.phoneData.selected]?.items ?? []) : window.state.threads.items;

        //filter threads
        window.state.filteredThreads = threadsData.filter(thread => thread.name?.toLowerCase().replace(/[^0-9a-zA-Z+]/g, '').includes(searchQuery.toLowerCase().replace(/[^0-9a-zA-Z+]/g, '')));

        // api call after 500ms
        setTimeout(() => {

            window.state.searchQuery = event.target.value.trim();

            if (!window.state.searchQuery || window.state.searchQuery.length < 3) {
                return;
            }

            searchThreads(window.state.searchQuery);

        }, 500);

    });


    $('#clear-search').on('click', (e) => {
        clearSearch();
    });


    $(document).on('click', '.copy-btn', function () {

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

                setTimeout(function () {
                    cbody.tooltip('hide');
                }, 2000);
            })
            .catch(err => {
                // Failure
                console.error('Could not copy text: ', err);
            });

    });

    $(document).on('click', '#threadDelete', async function () {
        await handleDeleteThread(service_type);
    });

    $(document).on('click', '#threadArchive', async function () {
        await handleArchiveThread(service_type);
    });

    $(document).on('click', '#messageDelete', async function () {
        let msgId = $(this).data('msgid');
        await handleDeleteMessage(msgId, service_type);
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

        //reset form
        createConversation[0].reset();

        $('.upload_dropZone').css({
            'background-image': 'none',
            'outline': '2px dashed rgba(var(--bs-primary-rgb), 1)',
        });
        $(".upload-icon").removeClass('d-none');
        $(".close-icon").addClass('d-none');

        //recipients fields reset
        $('#recipientFieldsContainer').html('');

        $('#iti_' + 0 + ' input').removeClass('error-message');

        iti = {};

        $("#recipient-label").text('01/10');
    });


    $(document).on('show.bs.dropdown', '#attachmentn-btn', function () {
        $(this).addClass('rotate');
    });

    $(document).on('hide.bs.dropdown', '#attachmentn-btn', function () {
        $(this).removeClass('rotate');
    });

    //data-add-contact attribute on click

    //Group edit and update
    $(document).on('click', '#group_edit', function () {

        $('#group_edit').addClass('d-none');
        $('#receiver_name').addClass('d-none');
        $('#edit-group-name').removeClass('visually-hidden');
        $('#receiverInputname').val($('#receiver_name').text());

    });

    $(document).on('click', '#receiverSave', function () {
        $('#group_edit').removeClass('d-none');
        $('#receiver_name').removeClass('d-none');
        $('#edit-group-name').addClass('visually-hidden');
    });

    $(document).on('submit', '#groupNameForm', async function (e) {

        e.preventDefault();
        //this form data
        let data = new FormData(e.target);

        //convert form data to object
        data = Object.fromEntries(data.entries());
        data.thread_id = window.state.selectedThreadInfo.thread_id;

        try {
            let thread = window.state.threads.items.find(thread => thread.thread_id == data.thread_id);

            if (data.name != thread.name) {
                let resp = await _request(APIS.GROUP_NAME_UPDATE, 'POST', data);
                if (resp.error == 0) {
                    await updateGroup(resp.data);
                }
            }
            toast("Successfully name updated!", 'success', 5000);

        } catch (error) {
            console.log(error);
        }

    });

    //add-participant on click create conversation modal
    $(document).on('click', '.add-participant', function () {

        iti = {};

        //reef modal
        const modalObject = {
            header: '<h5 class="modal-title">Add Participants</h5>',
            body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                        ${modalSpinner}
                 </div>`,
            footer: '<button type="submit" class="btn btn-primary" form="addParticipantForm">Add</button>'
        }

        //preview fax modal show event
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        $('#reefModal').modal('show');

        modalObject.body = `
        <form id="addParticipantForm" method="POST" class="p-4">
               
            <div class="d-grid">
                <div class="d-flex justify-content-between">
                    <label for="recipient-name" class="col-form-label">Recipient</label>
                    <label id="recipient-label" for="recipient-name" class="col-form-label">01/10</label>
                </div>
                <div class="d-flex mb-2">
                    <input type="tel" class="form-control bg-light border-light recipient" name="recipient">
                    <button type="button" class="btn btn-sm btn-success" id="addRecipientFieldBtnReef"><i class="ri-add-fill fs-5"></i></button>
                </div>

                <div id="recipientFieldsContainerReef"></div>

                <div class="mb-2">
                    <button class="btn btn-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#groupmembercollapse" aria-expanded="false" aria-controls="groupmembercollapse">
                        Select Contacts
                    </button>
                </div>
                <div class="collapse" id="groupmembercollapse">
                    <div class="card border mb-2">
                        <div class="card-header">
                            <h5 class="font-size-15 mb-0" id="contacts_count"></h5>
                        </div>
                        <div class="card-body p-2">
                            <div data-simplebar style="max-height: 150px;">
                                <div>
                                    <ul class="list-unstyled participant-contact-lists contactGroup">
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;

        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        // Initialize intlTelInput for the initial recipient input field
        initializeIntlTelInput($('#reefModal input[name="recipient"]')[0]);


        let contactState = window.appState.contacts;
        let participants = window.state.selectedThreadInfo?.participants;

        contactState = contactState.filter(contact => {
            for (const participant of participants) {
                if (participant.contact_id == contact.id) {
                    return false;
                }
            }
            return true;
        });


        //contact_list append from contactState
        let contactList = $('.participant-contact-lists');

        var contacts = [];

        $.each(contactState, function (index, entry) {

            var name = entry.name;
            var numbers = entry.numbers;

            $.each(numbers, function (index, numberEntry) {
                contacts.push({
                    "name": name,
                    "number": numberEntry.number,
                    "format_template": numberEntry.format_template
                });
            });

        });

        contacts.sort(function (a, b) {
            var nameA = a.name.toUpperCase().charAt(0); // get the first letter and convert to uppercase
            var nameB = b.name.toUpperCase().charAt(0); // get the first letter and convert to uppercase

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0; // names have the same first letter
        });

        $('#reefModal #contacts_count').text(contactState.length + ' contacts with phone numbers');

        contacts.forEach(function (contact, index) {
            //append contact list
            contactList.append(`
            <li class="form-check border-bottom" key="${index + 1}">
                
                <input type="checkbox" class="form-check-input" id="contactInfoCheck${index + 1}" name="contacts" value="${contact.number}">

                <label class="form-check-label" for="contactInfoCheck${index + 1}">
                     ${contact.name} 
                    <div class="text-muted font-size-12 mb-1">
                     ${formatPhoneNumber(contact.number, contact.format_template)}
                    </div>
                </label>
               
            </li>`
            );

        });
    });


    //addParticipantForm on submit
    $(document).on('submit', '#addParticipantForm', async function (e) {

        e.preventDefault();

        const recipientNumbers = [];

        for (const key in iti) {
            if (iti[key].getNumber() != '') {
                recipientNumbers.push(iti[key].getNumber());
            }
        }

        //get checked contact_list values
        let checkedContacts = [];
        $.each($("input[name='contacts']:checked"), function () {
            checkedContacts.push($(this).val());
        });

        //merge recipientNumbers and checkedContacts
        let recipients = recipientNumbers.concat(checkedContacts);

        //remove duplicate recipients
        recipients = [...new Set(recipients)];


        try {

            //alert if recipients is empty
            if (recipients.length == 0) {
                throw new Error('Please add at least one recipient');
            }

            let threadParticipant = window.state.selectedThreadInfo?.participants;

            if ((recipients.length + threadParticipant.length) > 10) {
                throw new Error('Maximum 10 participants allowed in thread');
            }

            let resp = await _request(APIS.THREAD_ADD_PARTICIPANT + '/' + window.state.selectedThreadId, 'POST', {
                numbers: recipients
            });

            if (resp.error === 0) {

                if (resp.data.type == 'add-participant') {
                    await threadParticipantAdd(window.state.selectedThreadId, resp.data.participants, resp.data.service_type, resp.data.thread_type ?? null);
                }

                toast(resp.msg, 'success');
            }

            //close reef modal
            $('#reefModal').modal('hide');

        } catch (error) {
            let errorMsg = error.msg || error.message || error;
            toast(errorMsg, 'danger');
        }

    });


    $(document).on('click', '#remove-participant-btn', removeParticipant);


    //if url has parameter thread open that thread
    let urlParams = new URLSearchParams(window.location.search);
    let threadId = urlParams.get('thread');

    if (threadId) {
        await openSingleChat(parseInt(threadId));
        //remove thread parameter from url
        window.history.replaceState({}, document.title, window.location.pathname);
    }


    //show contact list in create conversation modal
    let contactState = window.appState.contacts;

    const contactList = $('#contact_list');
    $('#contact_count').text(contactState.length + ' contacts with phone numbers');

    var contacts = [];

    $.each(contactState, function (index, entry) {
        var name = entry.name;
        var numbers = entry.numbers;

        $.each(numbers, function (index, numberEntry) {
            contacts.push({
                "name": name,
                "number": numberEntry.number,
                "format_template": numberEntry.format_template
            });
        });
    });

    contacts.sort(function (a, b) {
        var nameA = a.name.toUpperCase().charAt(0); // get the first letter and convert to uppercase
        var nameB = b.name.toUpperCase().charAt(0); // get the first letter and convert to uppercase

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // names have the same first letter
    });

    contacts.forEach(function (contact, index) {
        // Create the form-check div
        var formCheckDiv = $('<div>').addClass('form-check border-bottom');

        // Create the checkbox input
        var checkboxInput = $('<input>').attr({
            type: 'checkbox',
            class: 'form-check-input',
            id: 'contactCheck' + (index + 1),
            name: 'contact_list',
            value: contact.number
        });

        // Create the label
        var label = $('<label>').addClass('form-check-label').attr({
            for: 'contactCheck' + (index + 1)
        }).text(contact.name + ' ');

        // Create the number div 
        var numberDiv = $('<div>').addClass('text-muted font-size-12 mb-1').text(formatPhoneNumber(contact.number, contact.format_template));

        // Append number elements to form-check div
        formCheckDiv.append(checkboxInput, label.append(numberDiv));

        // Append form-check div to contact list
        contactList.append(formCheckDiv);
    });

}


$(document).on('click', '#addRecipientFieldBtnReef', function () {

    console.log(iti);

    let count = Object.keys(iti).length;
    let maxFields = 10;

    if (count <= maxFields) {
        let newRecipientField = `<div class="d-flex mb-2">
            <input type="tel" class="form-control bg-light border-light mb-2 recipient" name="recipient" required>
            <button type="button" class="btn btn-sm btn-danger removeRecipientFieldReef"><i class="ri-close-line fs-5"></i></button>
            </div>`;
        $("#recipientFieldsContainerReef").append(newRecipientField);

        $("#reefModal #recipient-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

        // Initialize intlTelInput for the newly added input field
        initializeIntlTelInput($('#reefModal input[name="recipient"]').last()[0]);
    }
});

$(document).on('click', '.removeRecipientFieldReef', function () {

    let count = (Object.keys(iti).length - 1);

    let maxFields = 10;
    // Remove the iti object with the corresponding id
    delete iti[$(this).prev(".iti").attr("id").replace('iti_', '')];

    $("#reefModal #recipient-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

    $(this).closest(".d-flex").remove();
});


async function removeParticipant() {

    let participant = this.getAttribute('data-ParticipantNumber');

    try {

        if (!window.state.selectedThreadId) {
            throw new Error('No thread selected');
        }

        if (window.state.selectedThreadInfo.type == 'single') {
            throw new Error('Can not remove participant from single thread');
        }

        if (!participant) {
            throw new Error('No participant selected');
        }

        var isConfirmed = window.confirm("Are you sure want to remove this?");

        if (isConfirmed) {

            let resp = await _request(APIS.THREAD_REMOVE_PARTICIPANT + '/' + window.state.selectedThreadId, 'POST', {
                number: participant
            });

            if (resp.error === 0) {

                if (resp.data.type == 'remove-participant') {
                    await threadParticipantRemove(window.state.selectedThreadId, resp.data.phone_id, resp.data.service_type);
                }

                toast(resp.msg, 'success');
            }

        }

    } catch (error) {
        let errorMsg = error.msg || error.message || error;
        toast(errorMsg, 'danger');
    }

}


// thread name generate
function generateThreadName(threadInfo) {

    const thread = threadInfo;

    let threadName = '';

    if (thread?.participants?.length) {
        // Filter participants that match authenticated phone IDs
        const authPhonesArray = thread.participants.filter(participant => {
            return activeServicesByType[service_type].find(service => service.phone_id === participant.phone_id);
        });

        // Filter participants that do not match authenticated phone IDs
        const withoutAuthPhonesArray = thread.participants.filter(participant => {
            return !activeServicesByType[service_type].find(service => service.phone_id === participant.phone_id);
        });

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
                            (
                                getContact(thread.participants.find(participant => participant.number != thread.sender).contact_id) ? getContact(thread.participants.find(participant => participant.number != thread.sender).contact_id).name :
                                    formatPhoneNumber(
                                        thread.participants.find(participant => participant.number != thread.sender).number,
                                        thread.participants.find(participant => participant.number != thread.sender).format_template
                                    )) :
                            (
                                getContact(thread.participants[0].contact_id) ? getContact(thread.participants[0].contact_id).name :
                                    formatPhoneNumber(thread.participants[0].number, thread.participants[0].format_template)
                            );
                    }
                }

            } else {
                // if the thread has more than one participant regardless of my auth phones
                threadName = withoutAuthPhonesArray.length > 1 ? `You and ${withoutAuthPhonesArray.length} others` : (
                    getContact(withoutAuthPhonesArray[0].contact_id) ? getContact(withoutAuthPhonesArray[0].contact_id).name :
                        formatPhoneNumber(withoutAuthPhonesArray[0].number, withoutAuthPhonesArray[0].format_template)
                );
            }

        } else {
            // if the thread has more than one participant regardless of my auth phones
            threadName = withoutAuthPhonesArray.length > 1 ?
                `You and ${withoutAuthPhonesArray.length} others` :
                (
                    (getContact(withoutAuthPhonesArray[0]?.contact_id) ? getContact(withoutAuthPhonesArray[0].contact_id).name : formatPhoneNumber(withoutAuthPhonesArray[0]?.number, withoutAuthPhonesArray[0]?.format_template))
                ) ?? `Myself`;

        }
    }

    return threadName;
}

// show short file name
function showFileName(name) {
    //return first 5 characters of the name and ... then the last 5 characters
    return name.slice(0, 5) + '...' + name.slice(-5);
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

// fetch inital threads
async function fetchThreads() {

    if (!window.state.threads.items?.length) {
        try {

            let fetchData = await _request(APIS.THREAD_LIST);

            if (fetchData.data) {

                window.state.threads.items = fetchData.data.items

                window.state.threads.hasMore = fetchData.data.item_limit == fetchData.data.items.length;

                saveDataToDB("threads", cloneObjFromProxy(fetchData.data.items));


                fetchData.data.items.forEach(thread => {

                    const authPhonesArray = thread.participants.filter(participant => {
                        return activeServicesByType[service_type].find(service => service.phone_id === participant.phone_id);
                    });

                    authPhonesArray.forEach(authPhone => {
                        if (!window.state.phoneData.threads[authPhone.phone_id]) {
                            window.state.phoneData.threads[authPhone.phone_id] = {
                                items: [],
                                hasMore: true
                            };
                        }

                        // Check if the thread with the same thread_id already exists
                        const existingThread = window.state.phoneData.threads[authPhone.phone_id].items.find(item => item.thread_id === thread.thread_id);

                        if (!existingThread) {
                            // If the thread doesn't exist, push it to items
                            window.state.phoneData.threads[authPhone.phone_id].items.push(thread);

                        } else {
                            const threadIndex = window.state.phoneData.threads[authPhone.phone_id].items.findIndex(item => item.thread_id === thread.thread_id);
                            window.state.phoneData.threads[authPhone.phone_id].items[threadIndex] = thread;
                        }

                        // Sort by message_id
                        window.state.phoneData.threads[authPhone.phone_id].items.sort((a, b) => b.message_id - a.message_id);
                    });
                });

            }


        } catch (error) {
            console.log(error);
        }
    }
}

//fetch pagination threads
async function loadMoreThreads() {

    const phoneId = window.state.phoneData.selected;

    if (!phoneId && !window.state.threads.hasMore) {
        return;
    }

    if (phoneId && !window.state.phoneData.threads[phoneId].hasMore) {
        return;
    }

    let threads = phoneId !== 0 ? window.state.phoneData.threads[phoneId].items : window.state.threads.items;

    const lastMsgId = threads.length > 0 ? threads[threads.length - 1].message_id : 0;

    // is already fetching
    if (window.state.processing) {
        return;
    }

    window.state.processing = true;

    try {

        const limit = 30;

        //if phoneId is 0 then fetch all threads
        if (phoneId === 0) {

            let range = IDBKeyRange.bound([service_type, -Infinity], [service_type, lastMsgId], false, true);
            let getThreads = await getItemsFromDB("threads", "service_type, msg_id", range);

            fetchData = {
                data: {
                    items: getThreads.items,
                    item_limit: limit,
                }
            }

            if (!getThreads.hasMore) {

                const lastMessageId = getThreads.items.length > 0 ? getThreads.items[getThreads.items.length - 1].message_id : lastMsgId;

                const fetchApiThreads = await _request(APIS.THREAD_LIST, 'GET', {
                    action: 'messages',
                    startId: lastMessageId
                });

                // merged last indexDB threads with api threads
                let mergedThreads = getThreads.items.concat(fetchApiThreads.data.items)

                // threads stored in state
                threads = threads.concat(mergedThreads);

                fetchData.data.items = fetchData.data.items.concat(fetchApiThreads.data.items);
                fetchData.data.item_limit = fetchApiThreads.data.item_limit;

                saveDataToDB("threads", cloneObjFromProxy(fetchApiThreads.data.items));
            }

        } else {

            const dbPhoneThreads = await getAllItems("phoneThreads", 'phone_id', phoneId, 'message_id', (item) => item.service_type == service_type && item.message_id < lastMsgId, limit);

            fetchData = {
                data: {
                    items: dbPhoneThreads.items,
                    item_limit: limit
                }
            }

            if (!dbPhoneThreads.hasMore) {

                const lastMessageId = dbPhoneThreads.items.length > 0 ? dbPhoneThreads.items[dbPhoneThreads.items.length - 1].message_id : lastMsgId;
                const apiThreads = await _request(APIS.THREAD_LIST + "/" + phoneId, 'GET', {
                    action: 'messages',
                    startId: lastMessageId
                });

                for (const thread of apiThreads.data.items) {

                    let dbThread = await db.get("phoneThreads", thread.thread_id);
                    if (dbThread) {
                        //check phoneId in index db thread phone_id
                        if (!dbThread.phone_id.includes(phoneId)) {
                            dbThread.phone_id.push(phoneId);
                            thread.phone_id = dbThread.phone_id;
                        }
                    } else {
                        thread.phone_id = [phoneId];
                    }
                }

                saveDataToDB("phoneThreads", cloneObjFromProxy(apiThreads.data.items));

                fetchData.data.items = fetchData.data.items.concat(apiThreads.data.items);
                fetchData.data.item_limit = apiThreads.data.item_limit;
            }
        }


        window.state.processing = false;

        // update hasMoreThreads
        const hasMore = (fetchData.data.items.length < fetchData.data.item_limit) ? false : true;

        phoneId !== 0 ? window.state.phoneData.threads[phoneId].hasMore = hasMore : window.state.threads.hasMore = hasMore;

        const threadIds = threads.map(item => item.thread_id);

        const newData = fetchData.data.items.filter(thread => !threadIds.includes(thread.thread_id));

        threads = threads.concat(newData);

        phoneId !== 0 ? window.state.phoneData.threads[phoneId].items = threads : window.state.threads.items = threads;


    } catch (error) {
        console.log(error);

    }
}


// fetch inital thread conversations
async function fetchConversations(threadId) {

    const threadExist = window.state.messages[threadId];
    const selectedPhoneId = window.state.phoneData.selected;


    let thread = null;
    let threadInfo = null;
    let checkThreadIndex = null;

    if (selectedPhoneId) {
        checkThreadIndex = window.state.phoneData.threads[selectedPhoneId].items.findIndex(thread => thread.thread_id == threadId);
    } else {
        checkThreadIndex = window.state.threads.items.findIndex(thread => thread.thread_id == threadId);
    }

    try {

        if (!threadExist || checkThreadIndex === -1) {

            const fetchData = await _request(APIS.THREAD_CONVERSATIONS + "/" + threadId);

            //flag hasMoreMessages
            fetchData.data.messages['hasMoreMessages'] = (fetchData.data.messages.items.length < fetchData.data.messages.item_limit) ? false : true;

            if (fetchData.data.messages.items.length) {

                window.state.messages[fetchData.data.thread_id] = fetchData.data.messages;
                window.state.messages[fetchData.data.thread_id]['thread_id'] = fetchData.data.thread_id;

                saveDataToDB("messages", cloneObjFromProxy(fetchData.data.messages.items));

            }
            if (fetchData.data.threadInfo) {
                threadInfo = fetchData.data.threadInfo;
            }

        } else {
            await loadMoreConversations(threadId);
        }

        const selectedKey = window.state.phoneData.selected;

        const selectedItems = selectedKey ? window.state.phoneData.threads[selectedKey]?.items : window.state.threads.items;

        thread = selectedItems?.find((item) => item.thread_id === threadId);

    } catch (error) {
        console.log(error);
    }

    thread = thread ? thread : threadInfo;
    return thread;

}

// fetch pagination conversation history
async function loadMoreConversations(thread_id = 0) {

    const threadId = (window.state.selectedThreadId == 0) ? thread_id : window.state.selectedThreadId;
    const threadExist = window.state.messages[threadId];
    const hasMoreMessages = threadExist ? threadExist.hasMoreMessages : false;

    if (!hasMoreMessages) {
        return;
    }

    // is already fetching
    if (window.state.processing) {
        return;
    }

    window.state.processing = true;

    const lastMsgId = threadExist.items[threadExist.items.length - 1].id ?? 0;

    try {

        let range = IDBKeyRange.bound([threadId, -Infinity], [threadId, lastMsgId], false, true);
        let getMessages = await getItemsFromDB('messages', 'thread_id, msg_id', range);

        fetchData = {
            data: {
                messages: {
                    items: getMessages.items,

                },
                thread_id: threadId
            }
        }

        if (fetchData.data.messages.items.length < 30) {

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

        window.state.processing = false;

        // push new data to state
        threadExist.items.push(...fetchData.data.messages.items);

    } catch (error) {
        console.log(error);
    }

}

// open single chat
async function openSingleChat(id) {

    const thread = await fetchConversations(id);
    window.state.selectedThreadId = id;

    window.state.selectedThreadInfo = thread;

    const unreadMessages = window.state.messages[id]?.items.filter(message => message.thread_id == id && message.unread > 0);

    if (unreadMessages?.length > 0) {

        let msg_ids = unreadMessages.map(item => item.id).join(',');
        await makeReadMessageRequest(msg_ids);

        unreadMessages.forEach(msg => msg.unread = 0);
        saveDataToDB("messages", cloneObjFromProxy(unreadMessages));
    }

    // set unread = false for openned thread
    let mainThread = window.state.threads.items[window.state.threads.items.findIndex(item => item.thread_id == id)];
    if (mainThread) {
        mainThread.unread = 0;
        saveDataToDB("threads", cloneObjFromProxy(mainThread));
    }

    // set unread = false for openned thread in phoneData

    const authPhonesArray = thread.participants.filter(participant => {
        return activeServicesByType[service_type].find(service => service.phone_id === participant.phone_id);
    });

    authPhonesArray.forEach(async (phone) => {

        const threadIndex = window.state.phoneData.threads[phone.phone_id]?.items.findIndex(item => item.thread_id == thread.thread_id);

        if (threadIndex >= 0) {

            window.state.phoneData.threads[phone.phone_id].items[threadIndex].unread = 0;
            saveDataToDB("phoneThreads", cloneObjFromProxy(window.state.phoneData.threads[phone.phone_id].items[threadIndex]))

        } else {
            let dbThread = await db.get("phoneThreads", id);
            if (dbThread && dbThread.unread > 0) {
                dbThread = {
                    ...dbThread,
                    unread: 0,
                }
                saveDataToDB("phoneThreads", dbThread);
            }
        }
    });

    messages__history.scrollTop = messages__history.scrollHeight;

    $("#participants-sidebar").find(".user-profile-sidebar").hide();

    selPhoneCom.render();

    //update conversation id in service worker
    navigator.serviceWorker.getRegistration().then(sw => {
        sw && sw.active.postMessage({ action: 'updateConversationId', threadId: id });
    });
}

// new conversation
function newConversation() {
    // Initialize intlTelInput for the initial recipient input field
    initializeIntlTelInput($('input.recipient')[0]);
    $('#newConversationteModal').modal('show');
}

async function newConversationSubmit(e) {

    e.preventDefault();

    const createConversation = $('#createConversation');
    const newConversationteModal = $('#newConversationteModal');

    const element = $(e.target);
    const btnOldVal = createConversation.find('button[type=submit]').html();
    createConversation.find('button[type=submit]').html(spinner).prop('disabled', true);

    try {

        let hasInvalidNumber = false;

        for (const key in iti) {

            if (!iti[key].isValidNumber()) {
                $('#iti_' + key + ' input').addClass('error-message');
                hasInvalidNumber = iti[key].getNumber() == '' ? false : true;
            } else {
                $('#iti_' + key + ' input').removeClass('error-message');
            }

        }

        if (hasInvalidNumber) {
            throw new Error('Please enter a valid phone number');
        }

        // get form data to key value pairs
        let formData = new FormData(createConversation[0]);
        let formEntries = Object.fromEntries(formData.entries());

        //if attachment is empty
        let hasFile = true;
        if (formData.get('file').size === 0) {
            formData.delete('file');
            hasFile = false;
        }

        if (hasFile) {
            element.find('button[type=submit]').html(spinner).prop('disabled', false);
            let compressedFile = null;

            if (formData.get('file').type == 'image/png' || formData.get('file').type == 'image/jpeg' || formData.get('file').type == 'image/jpg') {
                compressedFile = await compressImage(formData.get('file'));
            } else {
                compressedFile = formData.get('file');
            }

            formData.delete('file');
            formData.append('file', compressedFile, compressedFile.name);
        }

        const recipientNumbers = [];

        for (const key in iti) {
            if (iti[key].getNumber() != '') {
                recipientNumbers.push(iti[key].getNumber());
            }
        }

        formData.getAll("contact_list").forEach(function (number) {
            recipientNumbers.push(number);
        });

        if (recipientNumbers.length < 1) {
            throw new Error('Minimum 1 recipients or contacts required!');
        }

        if (recipientNumbers.length > 10) {
            throw new Error('Maximum 10 recipients or contacts required!');
        }

        if (hasFile) {
            formData.append('recipients', JSON.stringify(recipientNumbers));
        } else {
            formEntries.recipients = recipientNumbers;
        }


        //if formData has no attachment and formData.message is empty after trim
        if (!hasFile && formEntries.message.trim() === '') {
            throw new Error('Message or attachment is required!');
        }

        const resp = await _request(APIS.THREAD_CREATE, 'POST', hasFile ? formData : formEntries, hasFile);

        if (resp.error == 0) {

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
                service_type: resp.data.service_type,
                last_activity: resp.data.last_activity
            };

            // add new thread to state or update existing thread
            const threadIndex = window.state.threads.items.findIndex(item => item.thread_id == thread.thread_id);
            if (threadIndex >= 0) {
                window.state.threads.items[threadIndex] = thread;
            } else {
                window.state.threads.items.unshift(thread);
            }
            saveDataToDB("threads", thread);

            // also update thread list of phoneData
            const authPhonesArray = thread.participants.filter(participant => {
                return activeServicesByType[service_type].find(service => service.phone_id === participant.phone_id);
            });

            const dbThread = await db.get("phoneThreads", thread.thread_id);
            thread.phone_id = [];

            authPhonesArray.forEach((phone, index) => {

                if (dbThread) {
                    //check phoneId in index db thread phone_id
                    if (!dbThread.phone_id.includes(phone.phone_id)) {
                        // borrowing phone_id array from indexdb thread
                        dbThread.phone_id.push(phone.phone_id);
                        thread.phone_id = dbThread.phone_id;
                    } else {
                        thread.phone_id = dbThread.phone_id;
                    }

                } else {

                    // thread not found in indexdb
                    if (!thread.phone_id.includes(phone.phone_id)) {
                        thread.phone_id.push(phone.phone_id);
                    }

                }

                // check if window.state.phoneData.threads[phoneId].items exist
                if (!window.state.phoneData.threads[phone.phone_id]) {
                    window.state.phoneData.threads[phone.phone_id] = {
                        items: []
                    };
                }

                const threadIndex = window.state.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == thread.thread_id);

                if (threadIndex >= 0) {
                    window.state.phoneData.threads[phone.phone_id].items[threadIndex] = thread;
                } else {
                    window.state.phoneData.threads[phone.phone_id].items.unshift(thread);
                }

                // resort threads by message_id in desc order
                window.state.phoneData.threads[phone.phone_id].items.sort((a, b) => b.message_id - a.message_id);
            });

            saveDataToDB("phoneThreads", cloneObjFromProxy(thread));

            // add latest message to the messages state list if the thread already exist
            if (window.state.messages[thread.thread_id]?.items?.length) {

                window.state.messages[thread.thread_id].items.unshift({
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
            window.state.threads.items.sort((a, b) => b.message_id - a.message_id);

            // open single chat
            createConversation[0].reset();

            // close modal
            newConversationteModal.modal('hide');

            //open single chat
            openSingleChat(thread.thread_id);
        }

    } catch (error) {
        if (error.msg) {
            toast(error.msg, 'danger', 5000);
        } else {
            toast(error, 'danger', 5000);
        }
    } finally {
        createConversation.find('button[type=submit]').html(btnOldVal).prop('disabled', false);
    }

}


//modal close event
// $(document).on('#newConversationteModal', 'hidden.bs.modal', function () {

//     console.log('closed');
// })

// attachment file validation check
function fileValidation() {

    let fileInput = $("#upload_input");

    const fileTypes = attachmentTypes[service_type]; // array of attachment types
    let allowedExtensions = new RegExp(fileTypes.map(item => {
        return item.type.split(',').map(type => type.trim()).join('|');
    }).join("|")); // Use RegExp to create a regex from an array

    if (!fileInput[0].files[0]) {
        toast("Please select a file.", 'danger', 5000);
        fileInput.val("");
        return false;
    }

    if (!fileInput[0].files[0].name) {
        toast("Please select a file.", 'danger', 5000);
        fileInput.val("");
        return false;
    }

    // test allowedExtensions with file types
    if (!allowedExtensions.test(fileInput[0].files[0].type)) {
        toast("Please select only " + fileTypes.map(item => item.type).join(", ") + " file.", 'danger', 5000);
        fileInput.val("");
        return false;
    }

    return true;
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

    // generate image url
    const url = URL.createObjectURL(file);

    // show image
    // const pImage = `<div class="image_pre d-inline-block position-relative"><img src='${url}' class='attachment-preview border border-light bg-white rounded' height="150" width="150" style="object-fit: cover"><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i></div>`;
    let previewContainer = `<div class="image_pre d-inline-block position-relative">`;

    let parts = file.name.split('.');
    let ext = parts[parts.length - 1].toLowerCase();

    switch (ext) {
        case 'pdf':
            previewContainer += `<div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px"><i class="ri-file-pdf-2-line"></i><small class="fs-6">${showFileName(file.name)}</small></div><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i>`;
            break;
        case 'doc':
        case 'docx':
            previewContainer += `<div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px"><i class="ri-file-word-line"></i><small class="fs-6">${showFileName(file.name)}</small></div><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i>`;
            break;
        case 'xls':
        case 'xlsx':
            previewContainer += `<div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px"><i class="ri-file-excel-line"></i><small class="fs-6">${showFileName(file.name)}</small></div><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i>`;
            break;
        case 'mp4':
            previewContainer += `<div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px"><i class="ri-film-line"></i><small class="fs-6">${showFileName(file.name)}</small></div><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i>`;
            break;
        case 'jpeg':
        case 'jpg':
        case 'png':
            previewContainer += `<div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px"><img src='${url}' class='attachment-preview border border-light bg-white rounded' height="150" width="150" style="object-fit: cover"></div><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i>
                                `;
            break;
        default:
            previewContainer += `<div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px"><i class="ri-file-line"></i><small class="fs-6">File.....webp</small></div><i class="ri-close-line image-remove position-absolute" onclick="deleteImage(this)"></i>`;
            break;
    }

    previewContainer += `</div>`;

    $('#replyImagePreview').html(previewContainer).show();

}

// remove preview image
function deleteImage(e) {

    $('#replyImagePreview').hide().html('');

    $("#upload_input").val("");
}

// reply message process
async function replyMessage(e) {

    e.preventDefault();

    const selectedThreadId = window.state.selectedThreadId;

    // get form data to key value pairs
    let formData = new FormData(e.target);

    //add phone_id to form data if phone selected
    window.state.phoneData.selected ? formData.append('phone_id', window.state.phoneData.selected) : false;

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
        let compressedFile = null;

        if (formData.get('file').type == 'image/png' || formData.get('file').type == 'image/jpeg' || formData.get('file').type == 'image/jpg') {
            compressedFile = await compressImage(formData.get('file'));
        } else {
            compressedFile = formData.get('file');
        }

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

        const msg = resp.data.message;

        let threadInfo = window.state.selectedThreadInfo;
        const threadCheck = window.state.threads.items.find(item => item.thread_id == threadInfo.thread_id);

        if (!threadCheck) {
            window.state.threads.items.unshift(threadInfo);
        }

        // update thread with new message information
        await updateThread(window.state.threads.items, msg);

        const thread = window.state.threads.items.find(item => item.thread_id == msg.thread_id);

        // Update phone threads in state and indexDB
        const authPhonesArray = thread.participants.filter(participant =>
            activeServicesByType[service_type]?.some(service => service.phone_id === participant.phone_id)
        );

        thread.phone_id = [];

        authPhonesArray.forEach(async phone => {

            if (!window.state.phoneData.threads[phone.phone_id]) {
                window.state.phoneData.threads[phone.phone_id] = {
                    hasMore: true,
                    items: []
                }
            }

            let phoneThreadIndex = window.state.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == msg.thread_id);

            if (phoneThreadIndex === -1) {
                thread.phone_id.push(phone.phone_id);
                window.state.phoneData.threads[phone.phone_id].items.unshift(thread);
                saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
            }

            await updatePhoneThread(
                window.state.phoneData.threads,
                msg,
                phone.phone_id
            );
        });

        //update message in state and indexDB here
        if (!window.state.messages[msg.thread_id]) {
            window.state.messages[msg.thread_id] = {
                hasMoreMessages: true,
                items: []
            };
            window.state.messages[msg.thread_id].items.unshift(msg);
            saveDataToDB("messages", msg);

        } else {

            const threadMessages = window.state.messages[msg.thread_id];
            let messageIndex = threadMessages.items.findIndex(item => item.id == msg.id);

            if (messageIndex < 0) {
                threadMessages.items.unshift(msg);
                saveDataToDB("messages", msg);
                threadMessages.items.sort((a, b) => b.id - a.id);
            }
        }

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

// Updates a thread with a new message.
async function updateThread(threadState, msg) {

    const threadIndex = threadState.findIndex(item => item.thread_id == msg.thread_id);
    const thread = threadState[threadIndex];

    if (thread.message_id < msg.id) {
        // Only update necessary fields
        const updatedThread = {
            ...thread,
            message_id: msg.id,
            content: msg.content,
            sender: msg.sender,
            has_attachment: msg.has_attachment,
            last_activity: msg.created,
            unread: msg.unread,
            is_deleted: msg.is_deleted,
        };

        saveDataToDB("threads", cloneObjFromProxy(updatedThread));

        // update state thread
        threadState[threadIndex] = updatedThread;

        // sorting
        threadState.sort((a, b) => b.message_id - a.message_id);
    }
}

// Updates phoneThreads with a new message
async function updatePhoneThread(phoneState, msg, phoneId) {

    // check if state.phoneData.threads[phoneId].items exist
    if (!phoneState[phoneId]) {
        phoneState[phoneId] = {
            hasMore: true,
            items: []
        };
    }

    // check in indexdb for updating thread with new message
    let dbThread = await db.get("phoneThreads", msg.thread_id);

    if (dbThread) {
        dbThread = {
            ...dbThread,
            message_id: msg.id,
            content: msg.content,
            sender: msg.sender,
            has_attachment: msg.has_attachment,
            last_activity: msg.created,
            unread: msg.unread,
            is_deleted: msg.is_deleted,
        }

        saveDataToDB("phoneThreads", dbThread);

        // update state if exists
        const phoneThreads = phoneState[phoneId].items;
        const phoneThreadIndex = phoneThreads.findIndex(item => item.thread_id == msg.thread_id);

        if (phoneThreadIndex >= 0) {
            phoneThreads[phoneThreadIndex] = dbThread;

            // sorting
            phoneThreads.sort((a, b) => b.message_id - a.message_id);
        }
    }

}

async function searchThreads(term) {

    //replace all special characters without + and numbers

    if (!/[a-zA-Z]/.test(term)) {
        term = term.replace(/[^0-9a-zA-Z+]/g, '');
    }

    const phoneId = window.state.phoneData.selected;

    const response = await _request(APIS.THREAD_SEARCH + "/" + phoneId, 'GET', {
        query: term
    });

    window.state.filteredThreads = response.data;
}

function clearSearch() {
    $('#clear-search').addClass('d-none');
    $('#threads-title').text('Recent');
    $('#searchInput').val('');
    window.state.filteredThreads = null;
    window.state.searchQuery = '';
}

async function fetchPhoneThreads(phoneId) {

    const limit = 30;
    const dbPhoneThreads = await getAllItems("phoneThreads", 'phone_id', phoneId, 'message_id', (item) => item.service_type == service_type, limit);

    const threads = {
        data: {
            items: dbPhoneThreads.items,
            item_limit: limit
        }
    }

    if (!dbPhoneThreads.hasMore) {

        const lastMessageId = dbPhoneThreads.items.length > 0 ? dbPhoneThreads.items[dbPhoneThreads.items.length - 1].message_id : 0;

        const apiThreads = await _request(APIS.THREAD_LIST + "/" + phoneId, 'GET', {
            action: 'messages',
            startId: lastMessageId
        });

        for (const thread of apiThreads.data.items) {

            let dbThread = await db.get("phoneThreads", thread.thread_id);
            if (dbThread) {
                //check phoneId in index db thread phone_id
                if (!dbThread.phone_id.includes(phoneId)) {
                    dbThread.phone_id.push(phoneId);
                    thread.phone_id = dbThread.phone_id;
                }
            } else {
                thread.phone_id = [phoneId];
            }
        }

        saveDataToDB("phoneThreads", cloneObjFromProxy(apiThreads.data.items));


        threads.data.items = threads.data.items.concat(apiThreads.data.items);
        threads.data.item_limit = apiThreads.data.item_limit;
    }

    // check if window.state.phoneData.threads[phoneId].items exist
    if (!window.state.phoneData.threads[phoneId]) {
        window.state.phoneData.threads[phoneId] = {
            items: []
        };
    }

    window.state.phoneData.threads[phoneId].items = threads.data.items;

    // add hasMore flag for phoneId
    window.state.phoneData.threads[phoneId]['hasMore'] = (threads.data.items.length < threads.data.item_limit) ? false : true;

    window.state.phoneData.threads[phoneId]?.items?.sort((a, b) => b.message_id - a.message_id);

}

async function handleDeleteThread(service_type, thread_id = 0) {

    try {
        var isConfirmed = window.confirm("Are you sure want to delete this?");
        if (isConfirmed) {
            const currentState = window.appState[service_type];
            const threadId = (currentState.selectedThreadId == 0) ? thread_id : currentState.selectedThreadId;
            let resp = await _request(APIS.THREAD_DELETE + "/" + threadId, 'GET');

            if (resp.error == 0) {
                await deleteThread(resp.data.thread_id, resp.data.service_type);
            }
        }
    } catch (error) {
        console.log(error);
    }

}

async function handleArchiveThread(service_type, thread_id = 0) {
    try {
        var isConfirmed = window.confirm("Are you sure want to archive this?");
        if (isConfirmed) {
            const currentState = window.appState[service_type];
            const threadId = (currentState.selectedThreadId == 0) ? thread_id : currentState.selectedThreadId;
            let resp = await _request(APIS.THREAD_ARCHIVE + "/" + threadId, 'GET');

            if (resp.error == 0) {
                await archiveThread(resp.data.thread_id, resp.data.service_type);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function handleDeleteMessage(msg_id = 0, service_type) {

    try {
        let isConfirmed = window.confirm("Are you sure want to delete this?");
        if (isConfirmed) {

            if (msg_id) {

                let resp = await _request(APIS.MESSAGE_DELETE + "/" + msg_id, 'GET');
                if (resp.error == 0) {

                    let threadId = resp.data.thread_id;
                    await deleteMessage(resp.data.message_id, threadId, service_type);

                }
            }
        }
    } catch (error) {
        console.log(error);
    }

}




