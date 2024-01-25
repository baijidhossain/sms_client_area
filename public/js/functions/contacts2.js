let iti = {};

async function initPageData() {

    let {
        component
    } = reef;

    component("#contact-list", contactListTemplate);


    //hide loader
    $('#loader').addClass('d-none');

    //on delete contact
    $(document).on('click', '[data-delete-contact]', async function (e) {

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
}

//on click add contact
$(document).on('click', '#addContact', async function (e) {

    //rest all iti object
    iti = {};

    const groups = await _request(APIS.PHONE_TYPES);

    e.preventDefault();

    const modalObject = {
        header: '<h5 class="modal-title">Add Contact</h5>',
        footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" form="addContactForm"> Add </button>',
    }

    //set reef modal modal-xl
    $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');
    //preview fax modal show event

    modalObject.body = `<form class="p-4" id="addContactForm" method="POST">
                            <div class="mb-3">
                                <label for="contactname-input" class="form-label">Name<span class="text-danger">*</span></label>
                                <input type="text" class="form-control bg-dark-subtle" id="contactname-input" placeholder="Enter Name" name="name" required>
                            </div>

                                <div class="mb-3 d-grid">

                                <div class="d-flex justify-content-end">
                                    <input type="radio" class="form-check-input me-2" id="contactphone-checkbox" name="phone_checkbox" checked>
                                    <label for="contactphone-input" class="form-label text-body-secondary">Primary Number</label>
                                </div>

                                <div class="d-flex mb-2">                                                
                                    <div class="d-flex mb-2 me-3" style="width: 120px">
                                        <select class="form-select form-select-sm bg-light border-light" name="phone_type" required>
                                            ${groups.data.map(group => `<option value="${group.id}">${group.name}</option>`)}                                          
                                        </select>
                                    </div>

                                    <div class="d-flex mb-2 w-100">
                                        <input type="tel" class="form-control bg-light border-light number" name="number" required>
                                        <button type="button" class="btn btn-sm btn-success" id="addNumberFieldBtn"><i class="ri-add-fill fs-5"></i></button>
                                    </div>
                                </div>
                                                                    
                                <div id="numberFieldsContainer">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="contactemail-input" class="form-label">Email <span class="text-muted">(Optional)</span>
                                </label>
                                <input type="email" class="form-control bg-dark-subtle" id="contactemail-input" placeholder="Enter Email" name="email">
                            </div>                                            
                        </form>`;

    //show modal
    $('#reefModal').modal('show');

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

    // Initialize intlTelInput for the initial contact input field
    initializeIntlTelInput($('input.number')[0]);

});


$(document).on('click', '#addNumberFieldBtn', function () {

    console.log('addNumberFieldBtn clicked');

    let count = Object.keys(iti).length + 1;
    let maxFields = 10;


    if (count <= maxFields) {
        let newNumberField = `
                                <div class="additional-number">
                                <div class="d-flex justify-content-end">
                                    <input type="radio" class="form-check-input me-2" id="contactphone-checkbox" name="phone_checkbox">
                                    <label for="contactphone-input" class="form-label text-body-secondary">Primary Number</label>
                                </div>

                                <div class="d-flex mb-2 ">
                                    <div class="d-flex mb-2 me-3" style="width: 120px">
                                        <select class="form-select form-select-sm bg-light border-light" name="phone_type">
                                            <option value="1">Mobile</option>
                                            <option value="2">Home</option>
                                            <option value="3">Work</option>
                                            <option value="4">Main</option>
                                            <option value="5">Home Fax</option>

                                        </select>
                                    </div>
                                    <div class="d-flex mb-2 w-100">
                                        <input type="tel" class="form-control bg-light border-light number" name="number" required>
                                            <button type="button" class="btn btn-sm btn-danger removeNumberField"><i class="ri-close-line fs-5"></i></button>
                                    </div>
                                </div>
                                </div>`;
        $("#numberFieldsContainer").append(newNumberField);
        $("#number-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

        // Initialize intlTelInput for the newly added input field
        initializeIntlTelInput($("#numberFieldsContainer input.number").last()[0]);
    }
});


$(document).on("click", ".removeNumberField", function () {

    let count = (Object.keys(iti).length - 1);
    let maxFields = 10;

    // Remove the iti object with the corresponding id
    delete iti[$(this).prev(".iti").attr("id").replace('iti_', '')];

    $("#number-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

    $(this).closest(".additional-number").remove();
});

//addContactForm submit event
$(document).on('submit', '#addContactForm', async function (e) {

    e.preventDefault();

    let formData = new FormData($(this)[0]);
    let dataObj = Object.fromEntries(formData.entries());

    let name = dataObj.name;
    let email = dataObj.email;

    //get all phone_type values in an array
    let phone_type = [];
    $('select[name="phone_type"]').each(function () {
        phone_type.push($(this).val());
    });

    let phone_checkbox = [];
    $('input[name="phone_checkbox"]').each(function () {
        phone_checkbox.push($(this).is(':checked') ? 1 : 0);
    });


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

    const numbers = [];

    let index = 0;
    for (const key in iti) {
        numbers.push({
            number: iti[key].getNumber(),
            is_primary: phone_checkbox[index],
            phone_type: phone_type[index]
        });
        index++;
    }

    let data = {
        name,
        email,
        numbers
    }


    try {

        // set button to processing
        $('button[form="addContactForm"]').attr('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...');

        const response = await _request(APIS.CONTACT_CREATE, 'POST', data);

        //save to indexedDB
        await saveContact(response.data);

        toast('Contact added successfully', 'success');

        $('#reefModal').modal('hide');

    } catch (e) {

        console.log(e);
    }


});


//exportContacts on click show modal
// $(document).on('click', '#exportContacts', async function (e) {

//     e.preventDefault();

//     const contacts = window.appState.contacts;

//     const modalObject = {
//         header: '<h5 class="modal-title">Export Contacts</h5>',
//         footer: '<div class="ms-4 position-absolute start-0"><input type="checkbox" class= "form-check-input me-2 ms-3" id="exportContactsCheckbox" name="exportContactsCheckbox" value="1" ><label class="form-check-label" for="exportContactsCheckbox">Export all contacts</label></div >' + '<button button type="button" class= "btn btn-link" data- bs - dismiss="modal" > Close</button > ' + ' <button button type = "submit" class="btn btn-primary" form = "exportContactsForm" > Export </button > ',
//     }

//     //set reef modal modal-xl
//     $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');
//     //preview fax modal show event

//     //show all contacts with checkbox to select from indexDB

//     modalObject.body = `<form class="p-4 pe-2" id="exportContactsForm" method="POST">

//                             <div style="max-height: 400px; overflow: auto;">

//                               ${contacts.map(contact => {

//         return `

//                                 <label class="align-items-center border border-light d-flex p-3 rounded-3 mb-2 me-2" for="contactphone-checkbox-${contact.id}">

//                                     <input type="checkbox" class="form-check-input me-3" id="contactphone-checkbox-${contact.id}" name="contact_checkbox" value="${contact.id}">

//                                     <div class="flex-grow-1"> 
//                                         <h5 class="fs-6 m-0 mb-2">                                            
//                                             ${contact.name}
//                                         </h5>
//                                         <p class="text-muted mb-0">
//                                             ${contact.numbers.map(number => {
//             return `
//                                                     <span class="badge bg-primary text-light me-1 p-1 mb-1 rounded-pill">
//                                                         <i class="ri-phone-fill"></i> ${number.number}
//                                                     </span>
//                                                 `;
//         }).join('')}
//                                         </p>

//                                         <p class="text-muted mb-0">
//                                             ${contact.email ? `
//                                                     <span class="badge bg-primary text-light me-1 p-1 mb-1 rounded-pill">
//                                                         <i class="ri-mail-fill"></i> ${contact.email}
//                                                     </span>
//                                                 ` : ''}
//                                         </p>



//                                     </div>                                   
//                                 </label>

//                                 `;


//     }).join('')} 

//                             </div>

//                         </form>`;





//     //show modal
//     $('#reefModal').modal('show');

//     //preview fax modal show event
//     reef.render("#reefModalContent", dynamicModalComponent(modalObject));

// });


//exportContactsCheckbox on change event toggle all checkboxes select/deselect

$(document).on('change', '#exportContactsCheckbox', function () {
    if ($(this).is(':checked')) {
        $('input[name="contact_checkbox"]').prop('checked', true);
    } else {
        $('input[name="contact_checkbox"]').prop('checked', false);
    }

    //set selectedContacts on state
    window.appState.selectedContacts = $('input[name="contact_checkbox"]:checked').map(function () {
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
    window.appState.selectedContacts = $('input[name="contact_checkbox"]:checked').map(function () {
        return $(this).val();
    }).get();
});


//exportContactsForm submit event
$(document).on('submit', '#exportContactsForm', async function (e) {


    e.preventDefault();

    //if window.appState.selectedContacts is empty set all contacts
    if (!window.appState.selectedContacts) {
        window.appState.selectedContacts = window.appState.contacts.map(contact => contact.id);
    }

    const allContacts = cloneObjFromProxy(window.appState.contacts);

    const contactList = [];

    window.appState.selectedContacts.forEach(contactId => {


        const contact = allContacts.find(contact => contact.id == contactId);

        //comma separated numbers
        contact.numbers = contact.numbers.map(number => number.number).join(',');

        if (contact) {

            //delete id
            delete contact.id;
            delete contact.created;
            delete contact.updated;

            contactList.push(contact);
        }

    });




    const worksheet = XLSX.utils.json_to_sheet(contactList);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    XLSX.writeFile(workbook, "Contacts.xlsx", {
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
                                    <label for="contactfile-input" class="form-label">File<span class="text-danger">*</span></label>
                                    <input type="file" class="form-control bg-dark-subtle" id="contactfile-input" name="file" required>
                                </div>                                            
                        </form>`;

    //show modal
    $('#reefModal').modal('show');

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

});


//importContactsForm submit event
$(document).on('submit', '#importContactsForm', async function (e) {

    e.preventDefault();

    let formData = new FormData($(this)[0]);


    //get file
    let file = formData.get('file');

    //check file type
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        toast('Please upload a valid xlsx file', 'danger');
        return;
    }

    //read file
    let reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = async function (e) {

        let data = e.target.result;

        let workbook = XLSX.read(data, {
            type: "binary"
        });

        let first_sheet_name = workbook.SheetNames[0];

        let worksheet = workbook.Sheets[first_sheet_name];

        let contacts = XLSX.utils.sheet_to_json(worksheet);

        //check if all contacts have name and number
        let hasInvalidContact = false;

        let contactList = [];


        contacts.forEach(contact => {

            console.log(contact);

            //check if name and number is present
            if (!contact.name || !contact.numbers) {
                hasInvalidContact = true;
            }


            let numbers = [];

            // check if contact.numbers is not null, undefined, and is a string
            if (contact.numbers && typeof contact.numbers === 'string' && contact.numbers.includes(',')) {
                // split numbers by comma and trim each number
                numbers = contact.numbers.split(',').map(number => number.trim());
            } else {
                // push the single number to the array (after trimming)
                numbers.push(contact.numbers && typeof contact.numbers === 'string' ? contact.numbers.trim() : contact.numbers);
            }


            let contactObj = {
                name: contact.name,
                email: contact.email ?? '',
                numbers: numbers.map(number => {
                    console.log(number, contact.primary_number);
                    return {
                        number: number,
                        is_primary: number == contact.primary_number ? 1 : 0,
                    }
                })
            }

            contactList.push(contactObj);

        });

        //if invalid contact found
        if (hasInvalidContact) {
            toast('One or more contacts are invalid', 'danger');
            return;
        }

        window.appState.importList = contactList;
        //close modal
        $('#reefModal').modal('hide');


        //wait for 500ms
        setTimeout(() => {
            importContacts();
        }, 500);




    }

});



async function importContacts() {

    if (groupDuplicates(window.appState.importList).duplicates.length > 0) {

        //first duplicate
        const duplicate = groupDuplicates(window.appState.importList).duplicates[0];

        const modalObject = {
            header: '<h5 class="modal-title">Duplicate Contact Found</h5>',
            footer: '<button type="button" data-conflict="skip" class="btn btn-link">Skip</button>'
                + '<button type="button" data-conflict="merge" class="btn btn-primary"> Merge </button>',
        }

        //set body

        modalObject.body = `<form class="p-4 pe-2" id="duplicateForm" method="POST">

                            <input type="hidden" name="duplicate_index" value="${duplicate.index}">
                        

                                <label class="align-items-center border border-light d-flex p-3 rounded-3 mb-2">

                               
                                
                                    <div class="flex-grow-1"> 
                                        <h5 class="fs-6 m-0 mb-2">                                            
                                            ${duplicate.name} (${duplicate.index})
                                        </h5>
                                        <p class="text-muted mb-0">

                                           ${duplicate.numbers.map(number => {
            return `
                                                    <span class="badge bg-primary text-light me-1 p-1 mb-1 rounded-pill">
                                                        <i class="ri-phone-fill"></i> ${number.number}
                                                    </span>
                                                `;
        }).join('')}

                                        </p>

                                        
                                        <p class="text-muted mb-0">
                                            ${duplicate.email ? `
                                                    <span class="badge bg-primary text-light me-1 p-1 mb-1 rounded-pill">
                                                        <i class="ri-mail-fill"></i> ${duplicate.email}
                                                    </span>
                                                ` : ''}
                                        </p>
                                        
                                    </div>                                   
                                </label>

                          

                        </form>`;


        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        //show modal
        $('#reefModal').modal('show');

        console.log('show modal');


    } else {

        try {
            const response = await _request(APIS.CONTACT_IMPORT, 'POST', {
                contacts: window.appState.importList
            });

            //response.data foreach saveContact
            response.data.forEach(async contact => {
                await saveContact(contact);
            });

            //show success toast
            toast('Contacts imported successfully', 'success');
            $('#reefModal').modal('hide');

        } catch (e) {
            console.log(e);
        }

    }

}

//data-conflict on click event get form data and call duplicateAction

$(document).on('click', '[data-conflict]', function (e) {

    //close modal
    $('#reefModal').modal('hide');

    let action = $(this).data('conflict');

    let duplicateIndex = $('input[name="duplicate_index"]').val();

    console.log(duplicateIndex, action);

    duplicateAction(duplicateIndex, action);

    setTimeout(() => {
        importContacts();
    }, 500);

});


function duplicateAction(index = 0, action = 'skip') {


    console.log(index, action);

    if (action == 'skip') {
        window.appState.importList.splice(index, 1);
    } else if (action == 'merge') {

        let contact = window.appState.importList[index];

        let conflictIndex = null;

        let firstConflictingContact = window.appState.importList.find((contact, i) => {
            conflictIndex = i;
            return i !== index && contact.name === window.appState.importList[index].name;
        });

        let mergedNumbers = [...contact.numbers, ...firstConflictingContact.numbers];

        //remove duplicate numbers
        mergedNumbers = mergedNumbers.filter((number, index, self) =>
            index === self.findIndex((t) => (
                t.number === number.number
            ))
        )
        //merge state contacts and remove firstConflictingContact
        window.appState.importList[index].numbers = mergedNumbers;
        //remove firstConflictingContact
        window.appState.importList.splice(conflictIndex, 1);

    }

}


function groupDuplicates(data) {
    const groupedData = {
        duplicates: [],
        nonDuplicates: []
    };

    const uniqueEntries = new Map();

    data.forEach((entry, index) => {
        const key = `${entry.name}_${entry.email || ''}`;

        if (uniqueEntries.has(key)) {
            const duplicateEntry = { ...entry, index };
            groupedData.duplicates.push(duplicateEntry);
        } else {
            uniqueEntries.set(key, true);
            groupedData.nonDuplicates.push(entry);
        }
    });

    return groupedData;
}



//data-send-message on click
$(document).on('click', '[data-send-message]', async function (e) {




    //REEF modal
    const modalObject = {
        header: '<h5 class="modal-title">Send Message</h5>',
        footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" form="createConversation"> Send </button>',
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

    console.log('newConversationSubmit');

    e.preventDefault();

    const createConversation = $('#createConversation');
    const newConversationteModal = $('#newConversationteModal');


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
    const btnOldVal = createConversation.find('button[type=submit]').html();
    createConversation.find('button[type=submit]').html(spinner).prop('disabled', true);

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
            element.find('button[type=submit]').html(btnOldVal).prop('disabled', false);
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
    createConversation.find('button[type=submit]').html(btnOldVal).prop('disabled', false);

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

$("#file").on("change", async function () {
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