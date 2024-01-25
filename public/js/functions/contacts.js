let iti = {};

const sideBar = $('#sideBar');

async function initPageData() {

    let { signal, component } = reef;

    window.state = new signal({
        selectedGroupId: 0,
        contacts: window.appState.contacts,
        groups: window.appState.contactGroups,
    });

    component("#contact-groups", contactGroupsTemplate);
    component("#contact-list", contactListTemplate);
    component("#contact-count", contactCountComponent);


    //hide loader
    $('#loader').addClass('d-none');

    //on delete contact
    $(document).on('click', '#contact-list [data-delete-contact]', async function (e) {


        e.preventDefault();

        const contactId = $(this).data('delete-contact');

        const contact = window.appState.contacts.find(contact => contact.id === contactId);

        if (contact && confirm(`Are you sure you want to delete ${contact.name}?`)) {

            try {

                await _request(APIS.CONTACT_DELETE, 'POST', {
                    id: contactId
                });

                deleteContact(contactId);

                toast('Contact deleted successfully', 'success');

            } catch (e) {

                console.log(e);
            }

        }

    });

    //searchContact
    $(document).on('keyup', '#searchContact', function (e) {

        e.preventDefault();

        const searchValue = $(this).val();

        if (searchValue.length > 0) {

            let searchQuery = searchValue.toLowerCase()

            //replace '+' to '\\+' if searchQuery contains '+' character
            if (searchQuery.includes('+')) {
                searchQuery = searchQuery.replace('+', '');
            }

            window.appState.contacts.SearchQuery = searchQuery;


            //clear-search
            $('#clear-search').removeClass('d-none');

        } else {
            window.appState.contacts.SearchQuery = '';


            //clear-search
            $('#clear-search').addClass('d-none');
        }

    });

    //clear-search
    $(document).on('click', '#clear-search', function (e) {

        e.preventDefault();

        $('#searchContact').val('');

        window.appState.contacts.SearchQuery = '';

        $(this).addClass('d-none');

    });


    //on click addGroup
    $(document).on('click', '#addGroup', async function (e) {


        e.preventDefault();


        const contacts = window.appState.contacts;

        const modalObject = {
            header: '<h5 class="modal-title">Create Group</h5>',
            footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" id="createGroup" form="createGroupForm"> Create </button>',
        }

        //set reef modal modal-xl
        $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');

        //preview fax modal show event

        modalObject.body = `
                   
                    <form class="p-4" id="createGroupForm" method="POST">

                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control bg-light border-light" name="name" required>
                        </div>

                        <div class="mb-3">
                            <label for="message-text" class="col-form-label">Description <small>(Optional)</small></label>
                            <textarea class="form-control bg-light border-light" name="description" minlength="1" maxlength="2048"></textarea>
                        </div>

                        <div class="mb-3">

                            <div class="card border mb-2">
                                <div class="card-header">
                                    <h5 class="font-size-15 mb-0">Contacts</h5>
                                </div>
                                <div class="card-body p-2">
                                    <div style="max-height: 140px;overflow-y: auto;">
                                        ${contacts.length > 0 ? contacts.map(contact => {
            return `
                                                <div class="form-check border-bottom">
                                                    <input type="checkbox" class="form-check-input" id="contactCheck${contact.id}" name="contact_list" value="${contact.id}">
                                                        <label class="form-check-label" for="contactCheck${contact.id}">${contact.name}
                                                        <div class="text-muted font-size-12 mb-1">${contact.numbers.map(number => number.number).join(',')}</div>
                                                    </label>
                                                </div>
                                            `;
        }).join('') : '<div class="text-center">No contacts found</div>'}
                                        
                                    </div>
                                </div>
                            </div>
                                
                        </div>
                    </form>

                    `;

        //preview fax modal show event
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        $('#reefModal').modal('show');

    });

    // update selectedGroupId on click
    $(document).on('click', '#contacts [data-groupId]', function (e) {
        window.state.SelectedGroupId = $(this).data('groupid');

        //uncheck all checkboxes
        $('input[name="contact_checkbox"]').prop('checked', false);
    });

    //data-delete-group on click
    $(document).on('click', '#contact-groups [data-delete-group]', async function (e) {

        e.preventDefault();

        const groupId = $(this).data('delete-group');

        const group = window.state.groups.find(group => group.id === groupId);

        if (group && confirm(`Are you sure you want to delete ${group.name}?`)) {

            console.log('delete group');

            try {

                let res = await _request(APIS.CONTACT_GROUP_DELETE, 'POST', {
                    id: groupId
                });

                if (res.error) {
                    throw new Error(res.error.message);
                }
                //delete group from state

                const index = window.state.groups.findIndex(group => group.id === groupId);

                window.state.groups.splice(index, 1);

                //delete group from indexdb
                await db.delete("contactGroups", groupId);

                toast('Group deleted successfully', 'success');

            } catch (e) {
                console.log(e);
                toast(e.message, 'danger');
            }

        }

    });


    //data-edit-group on click

    $(document).on('click', '[data-edit-group]', async function (e) {

        //get group id
        const groupId = $(this).data('edit-group');

        //get group from state
        const group = window.appState.contactGroups.find(group => group.id === groupId);

        //if group not found return
        if (!group) {
            return;
        }

        //reef modal name
        const modalObject = {
            header: '<h5 class="modal-title">Edit Group</h5>',
            footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" id="updateGroupForm" form="updateGroupForm"> Update </button>',
        }

        //set reef modal modal-xl
        $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');

        const contacts = window.appState.contacts;

        //preview fax modal show event

        modalObject.body = `

                    <form class="p-4" id="updateGroupForm" method="POST">
                    
                        <input type="hidden" name="id" value="${group.id}">

                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control bg-light border-light" name="name" value="${group.name}" required>
                        </div>

                        <div class="mb-3">
                            <label for="message-text" class="col-form-label">Description <small>(Optional)</small></label>
                            <textarea class="form-control bg-light border-light" name="description" minlength="1" maxlength="2048">${group.description}</textarea>
                        </div>

                         <div class="mb-3">

                            <div class="card border mb-2">
                                <div class="card-header">
                                    <h5 class="font-size-15 mb-0">Contacts</h5>
                                </div>
                                <div class="card-body p-2">
                                    <div style="max-height: 140px;overflow-y: auto;">

                                        ${contacts.length > 0 ? contacts.map(contact => {
                                            return `
                                                <div class="form-check border-bottom">
                                                    <input type="checkbox" class="form-check-input" id="contactCheck${contact.id}" name="contact_list" value="${contact.id}" ${group.contact_list.includes(contact.id) ? 'checked' : ''}>
                                                        <label class="form-check-label" for="contactCheck${contact.id}">${contact.name}
                                                        <div class="text-muted font-size-12 mb-1">${contact.numbers.map(number => number.number).join(',')}</div>
                                                    </label>
                                                </div>
                                            `;
                                        }).join('') : '<div class="text-center">No contacts found</div>'}
                                        
                                    </div>
                                </div>
                            </div>
                                
                        </div>

                    </form>`;
        
        //preview fax modal show event
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        $('#reefModal').modal('show');
    });


    //on updateGroupForm submit
    $(document).on('submit', '#updateGroupForm', async function (e) {

        e.preventDefault();

        const updateGroupForm = $(this);

        const formData = new FormData(updateGroupForm[0]);

        const contactList = formData.getAll('contact_list');

        const groupId = formData.get('id');

        try {

            const response = await _request(APIS.CONTACT_GROUP_UPDATE, 'POST', {
                id: parseInt(groupId),
                name: formData.get('name'),
                description: formData.get('description'),
                contact_list: contactList

            });

            if (!response.error) {

                window.appState.contactGroups = window.appState.contactGroups.map(group => {

                    if (group.id === parseInt(groupId)) {
                        group.name = response.data.name;
                        group.description = response.data.description;
                        group.contact_list = response.data.contact_list;
                    }
                    return group;
                });

                let group = window.appState.contactGroups.find(group => group.id === parseInt(groupId));

                
                //update group in indexdb
                saveDataToDB('contactGroups', cloneObjFromProxy(group));

                //close modal
                $('#reefModal').modal('hide');

                //show success toast
                toast('Group updated successfully', 'success');
                
            } else {
                throw new Error(response.error.message);
            }


        } catch (e) {
            console.log(e);
        }
    });



    //on createGroupForm submit
    $(document).on('submit', '#createGroupForm', async function (e) {

        e.preventDefault();

        const createGroupForm = $(this);

        const formData = new FormData(createGroupForm[0]);

        const contactList = formData.getAll('contact_list');

        if (contactList.length === 0) {
            toast('Please select at least one contact', 'danger');
            return;
        }

        try {

            const response = await _request(APIS.CONTACT_GROUP_CREATE, 'POST', {
                name: formData.get('name'),
                description: formData.get('description'),
                contact_list: contactList
            });


            window.appState.contactGroups ??= [];

            //add group to state
            window.appState.contactGroups.unshift(response.data);

            saveDataToDB('contactGroups', response.data);

            //close modal
            $('#reefModal').modal('hide');

            //show success toast
            toast('Group created successfully', 'success');



        } catch (e) {
            console.log(e);
        }
    });



}









$(document).on('change', '#exportContactsCheckbox', function () {
    if ($(this).is(':checked')) {
        $('input[name="contact_checkbox"]').prop('checked', true);
    } else {
        $('input[name="contact_checkbox"]').prop('checked', false);
    }

    //set selectedContacts on state
    window.state.selectedContacts = $('input[name="contact_checkbox"]:checked').map(function () {
        return $(this).val();
    }).get();

});

// if all checkboxes are checked then check the exportContactsCheckbox
$(document).on('change', 'input[name="contact_checkbox"]', function () {
    if ($('input[name="contact_checkbox"]:checked').length === $('input[name="contact_checkbox"]').length) {
        $('#exportContactsCheckbox').prop('checked', true);
    } else {
        $('#exportContactsCheckbox').prop('checked', false);
    }

    //set selectedContacts on state
    window.state.selectedContacts = $('input[name="contact_checkbox"]:checked').map(function () {
        return $(this).val();
    }).get();
});


//exportContactsForm submit event
$(document).on('submit', '#exportContactsForm', async function (e) {


    e.preventDefault();

 

    let allContacts = cloneObjFromProxy(window.state.contacts);

    //if selected group window.state.SelectedGroupId not undefined
    if (typeof window.state.SelectedGroupId !== 'undefined' && window.state.SelectedGroupId !== 0) {

 
        const group = window.state.groups.find(group => group.id === window.state.SelectedGroupId);

        if (group) {
            const contactIds = group.contact_list;

            allContacts = allContacts.filter(contact => contactIds.includes(contact.id));
        }
    }

    let selectedContacts = window.state.selectedContacts;

    if (!window.state.selectedContacts || window.state.selectedContacts.length === 0) {
        selectedContacts = window.state.contacts.map(contact => contact.id);
    }
    const contactList = [];




    selectedContacts.forEach(contactId => {

        


        const contact = allContacts.find(contact => contact.id == contactId);

        if (contact) {

            //primary number by checking is_primary 1 else first number
            contact.primary_number = contact.numbers.find(number => number.is_primary == 1)?.number ?? contact.numbers[0].number;
            //comma separated numbers
            contact.numbers = contact.numbers.map(number => number.number).join(',');

            //delete id
            delete contact.id;
            delete contact.created;
            delete contact.updated;
            contactList.push(contact);
        }

    });




    const worksheet = XLSX.utils.json_to_sheet(contactList);

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/:/g, "-").replace(/\./g, "-");

    // Create the file name with the current date and time
    const fileName = `Contacts_${formattedDate}.xlsx`;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    // Use the created file name when writing the workbook to a file
    XLSX.writeFile(workbook, fileName, {
        compression: true
    });

    $('#reefModal').modal('hide');

});


//importContacts on click show modal

$(document).on('click', '#importContacts', async function (e) {

    e.preventDefault();

    const modalObject = {
        header: '<h5 class="modal-title">Import Contacts</h5>',
        footer: '<button button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button button type="submit" class="btn btn-primary" form="importContactsForm"> Import </button>',
    }

    //set reef modal modal-xl
    $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');
    //preview fax modal show event

    modalObject.body = `<form class="p-4" id="importContactsForm" method="POST" enctype="multipart/form-data">
                                <div class="mb-3">
                                    <label for="contactfile-input" class="form-label">Contacts File
                                    <span class="text-danger">*</span></label>
                                    <input type="file" class="form-control bg-dark-subtle mb-2" id="contactfile-input" name="file" required accept=".xlsx,.xls,.csv">
                                    <small class="form-text text-muted">Only xlsx,xls or csv files are allowed.</small>
                                </div>                                            
                        </form>`;

    //show modal
    $('#reefModal').modal('show');

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

});

$(document).on('submit', '#importContactsForm', async function (e) {

    e.preventDefault();

    const modalObject = {
        header: '<h5 class="modal-title">Import Contacts</h5>',
        footer: '<button type="button" class="btn btn-primary"> <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Importing...</button> ',
    }

    modalObject.body = `<form class="p-4" id="importContactsForm" method="POST" enctype="multipart/form-data">
                               
                                <div class="mb-3">
                                    <label for="contactfile-input" class="form-label">Contacts File
                                    <span class="text-danger">*</span></label>
                                    <input type="file" class="form-control bg-dark-subtle mb-2" id="contactfile-input" name="file" required accept=".xlsx,.xls,.csv">
                                    <small class="form-text text-muted">Only xlsx,xls or csv files are allowed.</small>
                                </div>
                                
                        </form>`;

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));


    const formData = new FormData($(this)[0]);
    const file = formData.get('file');

    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        toast('Please upload a valid xlsx file', 'danger');
        return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const contacts = XLSX.utils.sheet_to_json(worksheet);

        const numbersInfo = {
            totalNumbers: 0,
            validNumbers: 0,
            invalidNumbers: 0,
            totalContacts: contacts.length,
            invalidContacts: 0,
            validContacts: 0,
            duplicateNumbers: 0,
        };

        const contactList = [];

        for (const contact of contacts) {
            numbersInfo.totalNumbers += contact.numbers && typeof contact.numbers === 'string' ? contact.numbers.split(',').length : 1;

            if (!contact.name) {
                numbersInfo.invalidContacts++;
                continue;
            }

            if (contact.email && !validateEmail(contact.email)) {
                numbersInfo.invalidContacts++;
                continue;
            }

            contact.name = contact.name.trim();
            contact.email = contact.email?.trim();

            const numbers = contact.numbers && typeof contact.numbers === 'string' ? contact.numbers.split(',').map(number => number.trim()) : [contact.numbers];

            const contactObj = {
                name: contact.name,
                email: contact.email ?? '',
                numbers: [],
            };


            //check mail exists
            const existingEmail = window.appState.contacts.find(contact => contact.email === contactObj.email);
            if (existingEmail) {
                contactObj.email = '';
            }

            for (const number of numbers) {
                // check if number already exists is window.appState.contacts
                const existingContact = window.appState.contacts.find(contact => contact.numbers.find(contactNumber => contactNumber.number === number));

                if (existingContact) {
                    numbersInfo.duplicateNumbers++;
                    // check if number already exists in contactObj
                    //remove duplicate numbers
                    contactObj.numbers = contactObj.numbers.filter((number, index, self) =>
                        index === self.findIndex((t) => (
                            t.number === number.number
                        ))
                    )
                }

                if (await validateNumber(number)) {

                    numbersInfo.validNumbers++;

                    if (!existingContact) {
                        contactObj.numbers.push({
                            number,
                            is_primary: number == contact.primary_number ? 1 : 0,
                        });
                    }

                } else {
                    numbersInfo.invalidNumbers++;
                }


            }

            if (contactObj.numbers.length > 0) {
                numbersInfo.validContacts++;
                contactList.push(contactObj);
            } else {
                numbersInfo.invalidContacts++;
            }
        }

        window.appState.importDetails = numbersInfo;
        window.appState.importList = contactList;

        importContacts();

    };

    reader.readAsBinaryString(file);

});


async function importContacts() {



    let totalImported = 0;


    try {

        if (window.appState.importList.length === 0) {
            //throw error
            throw new Error('No valid contacts to import');
        }

        const response = await _request(APIS.CONTACT_IMPORT, 'POST', {
            contacts: window.appState.importList
        });

        //response.data foreach saveContact
        response.data.forEach(async contact => {
            await saveContact(contact);
        });

        //update totalImported
        totalImported = response.data.length;

        //show success toast
        toast('Contacts imported successfully', 'success');

    } catch (e) {
        console.log(e);
    }


    const modalObject = {
        header: `<h5 class="modal-title">${totalImported > 0 ? '<i class="ri-check-line text-success"></i> ' + totalImported : '<i class="ri-error-warning-line text-danger"></i> No'} contacts imported</h5>`,
        //close button
        footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>',

        body: `
                <div class="p-4">

                    <div>
                        <i class="ri-information-line text-info"></i> ${window.appState.importDetails.totalContacts} total contacts
                    </div>

                    <div>
                        <i class="ri-information-line text-info"></i> ${window.appState.importDetails.totalNumbers} total numbers
                    </div>

                    <div>
                        <i class="ri-error-warning-line text-danger"></i> ${window.appState.importDetails.invalidContacts} invalid contacts
                    </div>

                    <div>
                        <i class="ri-error-warning-line text-danger"></i> ${window.appState.importDetails.invalidNumbers} invalid numbers
                    </div>

                    <div>
                        <i class="ri-error-warning-line text-danger"></i> ${window.appState.importDetails.duplicateNumbers} duplicate numbers
                    </div>

                    <div>
                        <i class="ri-check-line text-success"></i> ${window.appState.importDetails.validContacts} valid contacts
                    </div>

                    <div>
                        <i class="ri-check-line text-success"></i> ${window.appState.importDetails.validNumbers} valid numbers
                    </div>

                </div>
            `
    }

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

}


//data-send-message on click
$(document).on('click', '[data-send-message]', async function (e) {

    //REEF modal
    const modalObject = {
        header: '<h5 class="modal-title">Send Message</h5>',
        footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" id="sendMessage" form="createConversation"> Send </button>',
    }

    //set reef modal modal-xl
    $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');

    //preview fax modal show event

    modalObject.body = `
                   
                    <form class="p-4" id="createConversation" method="POST" enctype="multipart/form-data">

                      <div id="new_conversation_phone"></div>
                      
                        <div class="mb-3 d-grid">
                            <label for="recipient-name" class="col-form-label">Recipient</label>
                            <input type="tel" class="form-control bg-light border-light recipient" name="recipient" required>
                        </div>

                        <div class="mb-3">
                            <label for="message-text" class="col-form-label">Message</label>
                            <textarea class="form-control bg-light border-light" name="message" required minlength="1" maxlength="2048"></textarea>
                        </div>

                          <div class="row justify-content-center">
                                <div class="col-sm-7">
                                    <div class="p-4 position-relative text-center upload_dropZone">
                                        <p class="upload-icon mb-0" style="cursor:pointer">
                                            <i class="ri-upload-cloud-2-line text-primary fs-1"></i><br>
                                            <span class="text-primary fs-6">Select a file</span>
                                        </p>
                                    </div>
                                    <input id="file" data-post-name="image_background" name="file" class="h-100 invisible position-absolute start-0 top-0 w-100" type="file" accept="image/jpg, image/jpeg, image/png">
                                </div>
                            </div>
                    </form>

                    `;



    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

    $('#reefModal').modal('show');
    //set primary number to input
    $('#reefModal input[name="recipient"]').val($(this).data('send-message'));


    //initialize intlTelInput
    initializeIntlTelInput($('#reefModal input[name="recipient"]')[0]);


});

//on modal close
$('#reefModal').on('hidden.bs.modal', function (e) {
    iti = {};
    //reset form
});



$(document).on('submit', '#createConversation', async function (e) {

    const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';


    e.preventDefault();

    const createConversation = $('#createConversation');
    const newConversationteModal = $('#newConversationteModal');
    const submitBtn = $('#sendMessage');


    let hasInvalidNumber = false;

    for (const key in iti) {
        if (!iti[key].isValidNumber()) {
            $('#iti_' + key + ' input').addClass('error-message');
            hasInvalidNumber = true;
        } else {
            $('#iti_' + key + ' input').removeClass('error-message');
        }
    }

    if (hasInvalidNumber) {
        toast("Please enter a valid phone number", 'danger', 5000);
        return;
    }

    const element = $(e.target);



    const btnOldVal = submitBtn.html();
    submitBtn.html(spinner).prop('disabled', true);


    // get form data to key value pairs
    let formData = new FormData(createConversation[0]);

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

        submitBtn.html(spinner).prop('disabled', false);


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
        recipientNumbers.push(iti[key].getNumber());
    }

    if (hasFile) {
        formData.append('recipients', JSON.stringify(recipientNumbers));
    } else {
        formData.recipients = recipientNumbers;
    }

    try {
        //if formData has no attachment and formData.message is empty after trim
        if (!hasFile && formData.message.trim() === '') {
            toast("Message or attachment is required!", 'danger', 5000);
            submitBtn.html(btnOldVal).prop('disabled', false);
            return;
        }

        const resp = await _request('/threads/create/sms', 'POST', formData, hasFile);

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
        const threadIndex = window.appState.sms.threads.items.findIndex(item => item.thread_id == thread.thread_id);
        if (threadIndex >= 0) {

            window.appState.sms.threads.items[threadIndex] = thread;

        } else {

            window.appState.sms.threads.items.unshift(thread);

        }

        saveDataToDB("threads", thread);

        // also update thread list of phoneData

        const authPhonesArray = thread.participants.filter(participant => {
            return activeServicesByType['sms'].find(service => service.phone_id === participant.phone_id);
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

            // check if window.appState.sms.phoneData.threads[phoneId].items exist
            if (!window.appState.sms.phoneData.threads[phone.phone_id]) {
                window.appState.sms.phoneData.threads[phone.phone_id] = {
                    items: []
                };
            }

            const threadIndex = window.appState.sms.phoneData.threads[phone.phone_id].items.findIndex(item => item.thread_id == thread.thread_id);

            if (threadIndex >= 0) {
                window.appState.sms.phoneData.threads[phone.phone_id].items[threadIndex] = thread;
            } else {
                window.appState.sms.phoneData.threads[phone.phone_id].items.unshift(thread);
            }

            // resort threads by message_id in desc order
            window.appState.sms.phoneData.threads[phone.phone_id].items.sort((a, b) => b.message_id - a.message_id);
        });

        saveDataToDB("phoneThreads", cloneObjFromProxy(thread));

        // add latest message to the messages state list if the thread already exist
        if (window.appState.sms.messages[thread.thread_id]?.items?.length) {

            window.appState.sms.messages[thread.thread_id].items.unshift({
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
        window.appState.sms.threads.items.sort((a, b) => b.message_id - a.message_id);

        // open single chat
        window.location.replace(`/messages/?thread=${thread.thread_id}`);

    }
    // catch error
    catch (error) {
        console.log(error);
    }

    // close modal
    newConversationteModal.modal('hide');

    // clear
    createConversation[0].reset();
    submitBtn.html(btnOldVal).prop('disabled', false);


});




// Attach a click event to the element with the ID "trigger"
$(document).on("click", ".upload-icon", function () {
    // Trigger a click on the input field with the ID "target"
    $("#file").click();
});


$(document).on("dragover", ".upload_dropZone", function (e) {
    e.preventDefault();
    $(this).addClass("upload_dropZone_hover");
});



$(document).on("dragleave", ".upload_dropZone", function (e) {
    e.preventDefault();
    $(this).removeClass("upload_dropZone_hover");
});




$(document).on("drop", ".upload_dropZone", async function (e) {
    e.preventDefault();
    $(this).removeClass("upload_dropZone_hover");
    var files = e.originalEvent.dataTransfer.files;

    // Only handle the first dropped file
    if (files.length > 0) {
        await handleFile(files[0]);
        $('#file')[0].files = files;
    }
});



$(document).on("change", "#file", async function () {
    var input = this;
    if (input.files && input.files[0]) {
        await handleFile(input.files[0]);
    }
});



async function handleFile(file) {

    let dropZone = $(".upload_dropZone");

    let reader = new FileReader();

    reader.onload = function (e) {

        dropZone.css({
            'background-image': 'url(' + e.target.result + ')',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'outline': '0px',
        });

        $(".close-icon").removeClass('d-none');

        // Hide upload icon
        $(".upload-icon").addClass('d-none');

        // Show close icon to remove the background image
        if ($('.upload_dropZone .close-icon').length === 0) {
            let closeIconHtml = '<div class="close-icon"><i class="ri-close-circle-line text-danger"></i></div>';
            $('.upload_dropZone').append(closeIconHtml);
        }

        $(".close-icon").on("click", function () {
            dropZone.css({
                'background-image': 'none',
                'outline': '2px dashed rgba(var(--bs-primary-rgb), 1)',
            });
            // Show upload icon
            $(".upload-icon").removeClass('d-none');
            // Remove close icon
            $(this).remove();
            $("#file").val('');
        });
    };

    reader.readAsDataURL(file);
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

//data-nav-button
$(document).on('click', 'body [data-nav-button]', function () {
    sideBar.toggleClass('show');
    $('.inner-bar').toggleClass('bg-disable');
});

//if not clicked in sideBar close it
$(document).on('click', function (e) {
    if (!$(e.target).closest('#sideBar').length && !$(e.target).closest('.menu-icon').length) {
        sideBar.removeClass('show');
        $('.inner-bar').removeClass('bg-disable');
    }
});

