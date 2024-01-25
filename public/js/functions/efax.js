//efax state
let efaxState;

// Selectors
const loader = $('#loader');
const sideBar = $('#sideBar');

//init page data
async function initPageData() {

    /*************************************
     * initialize app state & components *
     *************************************/

    //set state
    window.state = window.appState[window.ipbxapi_serviceType];

    //set efaxState
    efaxState = window.state;

    //loader
    efaxState.loader = false;

    //file types config
    efaxState.allowedFileTypes = ['application/pdf', 'image/tiff'];



    if (efaxState.fax.Inbox.items.length > 1 && efaxState.fax.Inbox.items.length < 30) {
        await loadMoreFax();
        console.log('load more fax');
    } else if (efaxState.fax.Inbox.items.length == 0) {
        await fetchFax();
    }

    //get initial data
    await fetchInitData();

    let { component, render } = reef;

    //set components
    component('#efaxNav', efaxNavComponent);
    component('#folderActions', folderActionComponent);
    component('#pageHeader', pageHeaderComponent);
    component('#searchBox', searchBoxComponent);
    component('#faxTable', faxTableComponent);
    component('#phoneNumber', phoneNumber);

    //hide loader
    loader.addClass('d-none');

    //create folder

    //click events
    $(document).on('click', '#folderActions [data-action]', handleFolderOperations);
    $(document).on('click', '#faxTable [data-fax-action]', handleArchiveOperations);
    $(document).on('click', '#faxTable [data-move-to]', handleFolderChange);
    $(document).on('click', '#faxTable [data-download]', handleDownloadFax);
    $(document).on('click', '#faxTable [data-fax-item]', handleFaxItemSelect);

    // $(document).on('click', '#faxTable [data-bs-target="#filePreviewModal"]', handlePreviewFax); // kaj korte hobe

    //drag and drop event
    $(document).on('dragover drop', '#folders .folder-list', handleDragAndDrop);

    //search input keyup event
    $(document).on('keyup', '#searchInput', (e) => efaxState.searchQuery = e.target.value || '');

    //newFax click event
    $(document).on('click', '#newFax', async function () {


        //show loader
        loader.removeClass('d-none');
        // #newFaxCard
        $('#newFaxCard').addClass('d-none');


        try {
            const request = await _request(APIS.EFAX_SETTINGS);
            efaxState.settings = request.data;
        }
        catch (error) {
            console.log(error);
        }

        render('#newFaxCard', newFaxCard());

        //hide loader
        loader.addClass('d-none');


        // #newFaxCard
        $('#newFaxCard').removeClass('d-none');

        efaxState.currentPage = 'New';
        efaxState.selectedFolder = '';

    });

    //data-folder-uuid click event 
    $(document).on('click', '#folders .folder-list', async function () {

        const folder = $(this).data('folder-uuid');
        efaxState.currentPage = 'Inbox';
        efaxState.selectedFolder = folder;
        efaxState.selectedFax = [];

        if (efaxState.selectedPhone) {
            await fetchServiceFax(efaxState.currentPage, efaxState.selectedFolder);
        } else {
            await fetchFax(efaxState.currentPage, efaxState.selectedFolder);
        }

    });

    //data-navigate
    $(document).on('click', '#efaxNav [data-navigate]', async function () {
        const page = $(this).data('navigate');
        //set current page
        efaxState.currentPage = page;
        efaxState.selectedFolder = '';
        efaxState.selectedFax = [];


        //if selectedPhone is empty
        if (!efaxState.selectedPhone) {

            await fetchFax(page);

        } else {

            await fetchServiceFax(page);

        }



    });

    //phone-number change event
    $(document).on('change', '#servicePhone', function () {
        //get selected phone
        const phone = $(this).val();
        //set selected phone
        efaxState.selectedPhone = phone;

        if (efaxState.selectedPhone == 'all') {
            fetchFax(efaxState.currentPage, efaxState.selectedFolder);
        } else {
            fetchServiceFax(efaxState.currentPage, efaxState.selectedFolder);
        }

    });

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

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#faxTable').length) {
            efaxState.selectedFax = [];
        }
    });

    // fax_numbers[] trim on change
    $(document).on('change', '.recipient', function () {
        $(this).val($(this).val().trim());
    });

    //"select[name=phone_id]" change event
    $(document).on('change', 'select[name=phone_id]', function () {
        //get phone id
        const phoneId = $(this).val();
        //set state
        efaxState.selectedSenderPhone = phoneId;

        render('#newFaxCard', newFaxCard());

    });

    //createFolderForm submit event
    $(document).on('submit', '#createFolderForm', handleFolderCreateSubmit);

    //renameFolderForm submit event
    $(document).on('submit', '#renameFolderForm', handleRenameFolderFormSubmit);

    //moveToFolderForm submit event
    $(document).on('submit', '#moveToFolderForm', handleMoveToFolderFormSubmit);

    //preview fax modal hide event
    $(document).on('hidden.bs.modal', '#filePreviewModal', handlePreviewModalHide);

    //addRecipientFieldBtn click event
    $(document).on('click', "#addRecipientFieldBtn", handleAppendRecipientField);

    //data-action click event
    $(document).on('click', 'Table [data-action=preview-modal]', handlePreviewFax);

    //data-action click event
    $(document).on('click', '#createFolderForm #createFolder', () => createFolderForm.submit());

    //removeRecipientField click event
    $(document).on("click", "#sendFaxForm .removeRecipientField", function () {
        $(this).parent().remove();
    });

    //includeCoverPage change event
    $(document).on('change', '#sendFaxForm #includeCoverPage', () => {
        //toggle state true or false
        efaxState.includeCoverPage = !efaxState?.includeCoverPage;
        render('#newFaxCard', newFaxCard());

    });

    //data-open="pageSettings"
    $(document).on('click', '#sendFaxForm [data-open="pageSettings"]', function () {
        //toggle state true or false
        efaxState.pageSettings = !efaxState?.pageSettings;
        render('#newFaxCard', newFaxCard());
    });

    //legal_disclaimer
    $(document).on('change', '#sendFaxForm #legal_disclaimer', () => {
        $('#legal-disclaimer').toggleClass('d-none');
    });

    //on drop event on #files add files to input
    $(document).on('dragover dragleave drop', '.upload_dropZone', handleDragAndDropFiles);
    //on click event on .remove-file
    $(document).on('click', '.remove-file', handleRemoveFile);
    //sendFaxForm submit event
    $(document).on('submit', '#sendFaxForm', handleSendFaxFormSubmit);
    //#files on input change event
    $(document).on('change input', '#files', handleInputFileChange);
    //on reset #files
    $(document).on('reset', '#sendFaxForm', () => $('#files').trigger('change'));


    //detect faxlist scroll to bottom
    detectScrollToOffset('#faxTable', 100, 'bottom', async () => {

        if (efaxState.selectedPhone) {
            await loadMoreServiceFax();
        } else {
            await loadMoreFax();
        }
    });

    //#searchInput vale more than 2
    $(document).on('input', '#searchInput', async function () {
        if ($(this).val().length > 0) {
            // show clear-search
            $('#clear-search').removeClass('d-none');
        } else {
            // hide clear-search
            $('#clear-search').addClass('d-none');
        }
    });

    //'#clear-search on click event
    $(document).on('click', '#clear-search', function () {
        //clear search input
        $('#searchInput').val('');
        //hide clear-search
        $('#clear-search').addClass('d-none');
        //trigger keyup event
        $('#searchInput').trigger('keyup');
    });

    //poling after every 5 seconds
    setInterval(async () => {
        if (efaxState.currentPage === 'Queued' || efaxState.currentPage === 'Logs') {
            await fetchPageData(efaxState.currentPage);
        }
    }, 5000);




}


async function fetchPageData(Page) {
    //if current page is not new
    //fetch fax
    const latestData = await _request(APIS.EFAX + '/' + Page);

    //update or push fax
    latestData.data.items.forEach(fax => {

        //get current page
        const currentPage = efaxState.fax[Page];

        //if fax already exists in current page
        if (currentPage.items.find(faxFile => faxFile.uuid === fax.uuid)) {

            //get index
            const index = currentPage.items.findIndex(faxFile => faxFile.uuid === fax.uuid);

            //update fax
            currentPage.items[index] = fax;

        } else {
            //push fax
            currentPage.items.push(fax);

            //update count
            efaxState.faxCounts[Page].count = efaxState.faxCounts[Page].count + 1;
        }

        //sort by epoch descending
        currentPage.items.sort((a, b) => b.epoch - a.epoch);

    });

}

async function handleSendFaxFormSubmit(e) {

    e.preventDefault();

    let files = $("#files")[0].files;
    let formData = new FormData(e.target);

    // Check if at least one file is or fax_message is entered
    if (files.length === 0 && !formData.get('fax_message')) {
        toast("Please select a file or enter a fax message", 'danger');
        return;
    }


    const checkedContacts = $('input[name="contact_list"]:checked');

    if (checkedContacts.length > 0) {   

    
        formData.append("fax_numbers[]", checkedContacts.map(function () {
            return this.value;
        }).get().join(','));
        

    }
    


    for (let i = 0; i < files.length; i++) {
        formData.append("fax_files[]", files[i]);
        //append files to file_preview
    }

    formData.append("submit", e.originalEvent.submitter.value);


    if (e.originalEvent.submitter.value == "send") {
        //show loader in button 
        e.originalEvent.submitter.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    }

    if (e.originalEvent.submitter.value == "preview") {
        //show loader in button 
        e.originalEvent.submitter.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Previewing...';
    }

    //post data
    if (e.originalEvent.submitter.value == 'send') {

        try {

            //send request
            await _request(APIS.EFAX_SEND, "POST", formData, true);

            //show toast
            toast('Fax Queued Successfully');

            //reset form
            e.target.reset();

            //reset preview
            $('#files').trigger('change');

            //update fax count
            efaxState.faxCounts.Queued.count = efaxState.faxCounts.Queued.count + 1;

        } catch (error) {
            console.log(error);
        }


    } else {

        try {

            const data = await _request(APIS.EFAX_SEND, "POST", formData, true, 'blob');

            const modalObject = {
                header: '<h5 class="modal-title">Preview</h5>',
                body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                                ${modalSpinner}
                         </div>`,
                footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
            }

            //set reef modal modal-xl
            $('#reefModal .modal-dialog').addClass('modal-xl');
            //preview fax modal show event
            reef.render("#reefModalContent", dynamicModalComponent(modalObject));
            //show modal
            $('#reefModal').modal('show');


            let blob = new Blob([data], {
                type: 'application/pdf',
            });


            let blobUrl = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = blobUrl;

            modalObject.body = `<iframe src="${blobUrl}" style="width: 100%; height: 70vh; border: none;"></iframe>`;

            //preview fax modal show event
            reef.render("#reefModalContent", dynamicModalComponent(modalObject));


        } catch (error) {
            console.log(error);
        }
    }

    //reset button text
    if (e.originalEvent.submitter.value == "send") {
        //show loader in button 
        e.originalEvent.submitter.innerHTML = '<i class="ri-send-plane-fill"></i> Send';
    }
    if (e.originalEvent.submitter.value == "preview") {
        //show loader in button 
        e.originalEvent.submitter.innerHTML = '<i class="ri-eye-fill"></i> Preview';
    }
}

async function handleMoveToFolderFormSubmit(e) {

    e.preventDefault();

    //get form data
    const inputdata = new FormData(e.target);

    let formData = Object.fromEntries(inputdata.entries());

    moveToFolder({
        uuids: [formData.uuid],
        folder_uuid: formData.folder_uuid
    });

    //hide modal
    $('#reefModal').modal('hide');
}

async function handleRenameFolderFormSubmit(e) {

    e.preventDefault();

    //get form data
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    //if folder name not max 100
    if (formData.name.length > 100) {
        toast('Max 100 characters allowed', 'danger');
        return;
    }

    try {

        //send request
        const res = await _request(APIS.EFAX_RENAME_FOLDER, "POST", formData);

        //show toast
        toast(res.msg);

        //change folder name in state
        efaxState.folders.find(folder => folder.uuid == formData.uuid).name = formData.name;

        //hide modal
        $('#reefModal').modal('hide');

    } catch (error) {

        console.log(error);

    }

}

async function handleFolderCreateSubmit(e) {

    e.preventDefault();

    //get form data
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    //if folder name not max 100
    if (formData.name.length > 100) {
        toast('Max 100 characters allowed', 'danger');
        return;
    }

    try {

        //send request
        const res = await _request(APIS.EFAX_CREATE_FOLDER, "POST", formData);

        //show toast
        toast(res.msg);

        //hide modal
        $('#reefModal').modal('hide');

        const folder_uuid = res.uuid;

        let folder = {
            uuid: folder_uuid,
            name: formData.name,
        }

        //update state
        efaxState.folders.unshift(folder);

        //find index of folder
        let folderIndex = efaxState.folders.findIndex(folder => folder.uuid == folder_uuid);

        //loop services
        activeServicesByType['efax'].map(service => {
            efaxState.folders[folderIndex].countData ??= {};
            efaxState.folders[folderIndex].countData[service.number] ??= {
                total: 0,
                unread: 0
            }
        });





    } catch (error) {
        console.log(error);
    }

}

async function handleFolderOperations() {
    //get action
    const action = $(this).data('action');

    //if action is create
    if (action == 'create') {
        return createFolder();
    }

    //get uuid
    const uuid = efaxState.selectedFolder;

    //if action is rename
    if (action == 'rename') {

        //get folder name
        const folderName = efaxState.folders.find(folder => folder.uuid == uuid).name;

        return renameFolder(uuid, folderName.trim());

    } else if (action == 'delete') {
        //delete folder
        deleteFolder(uuid);
    } else if (action == 'change') {

        //reef modal
        const modalObject = {
            header: '<h5 class="modal-title">Change Folder</h5>',
            body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                        ${modalSpinner}
                 </div>`,
            footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
        }


        //preview fax modal show event
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        $('#reefModal').modal('show');

        modalObject.body = `
        <form id="changeFolderForm" method="POST">
            <div class="modal-body">
                <div class="mb-3">
                    <label for="folderName" class="col-form-label">Folder Name</label>
                    <select class="form-select" name="folder_uuid">
                        <option value="">Select Folder</option>
                        ${efaxState.folders.map(folder => `<option value="${folder.uuid}">${folder.name}</option>`)}
                    </select>
                </div>
            </div>
        </form>
    `;

        modalObject.footer = '<button type="submit" form="changeFolderForm" class="btn btn-primary">Move</button>';
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));
    }
}


//moveToFolderForm submit event
$(document).on('submit', '#changeFolderForm', async function (e) {


    e.preventDefault();

    //get form data
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    //folder uuid
    const to = formData.folder_uuid;
    const from = efaxState.selectedFolder;

    //request

    try {

        const res = await _request(APIS.EFAX_CHANGE_FOLDER, "POST", { to, from });

        //show toast
        toast(res.msg);

        //fetch init data
        await fetchInitData();

        //hide modal
        $('#reefModal').modal('hide');

    } catch (error) {
        console.log(error);
    }




    //hide modal
    $('#reefModal').modal('hide');


});


async function handleArchiveOperations() {

    //get uuid
    const uuid = $(this).attr('data-fax-action');
    //get action
    const action = $(this).attr('data-fax-action-type');

    //confirm
    if (!window.confirm("Are you sure you want to " + action + " this item?")) return;


    try {

        //send request
        const res = await _request(APIS.EFAX_ACTION, "POST", { uuid, action });

        //get all fax
        const allFax = efaxState.fax;

        //if action is delete
        if (action == 'archive') {


            //if phone is selected
            if (efaxState.selectedPhone) {

                filteredAction(uuid, 'delete');

            } else {

                //get current page
                const currentPage = efaxState.selectedFolder.length == 0 ? efaxState.fax[efaxState.currentPage] : efaxState.fax.Inbox.folder[efaxState.selectedFolder];

                //get fax from current page where uuid is equal to formData.uuid
                const fax = currentPage.items.find(fax => fax.uuid === uuid);

                //get index
                const index = currentPage.items.findIndex(fax => fax.uuid === uuid);

                //remove index from current page
                currentPage.items.splice(index, 1);

                allFax.Archived.items.push(fax);

                fax.type = 'Archived';
                fax.action_epoch = res.data.action_epoch;

                //push to index db
                await saveDataToDB('fax', cloneObjFromProxy(fax));

                //check efaxState.fax.Inbox.items.length
                if (efaxState.fax.Inbox.items.length > 1 && efaxState.fax.Inbox.items.length < 30) {
                    //load more fax
                    await loadMoreFax();
                }

            }


            //fetch init data
            await fetchInitData();


        }

        //if action is restore
        if (action == 'unarchive') {

            if (efaxState.selectedPhone.length) {
                //delete from filteredFax
                filteredAction(uuid, 'delete');

            } else {
                //get current page
                const fax = allFax.Archived.items.find(fax => fax.uuid === uuid);

                //find index
                const index = allFax.Archived.items.findIndex(fax => fax.uuid === uuid);

                //remove index from current page
                allFax.Archived.items.splice(index, 1);

                //add to archive
                allFax.Inbox.items.push(fax);

                //set type
                fax.type = 'Inbox';

                //push to index db
                await saveDataToDB('fax', cloneObjFromProxy(fax));
            }




            //fetch init data
            await fetchInitData();


        }

        //show toast
        toast(res.msg);

        //update count on db
        const counts = efaxState.faxCounts;

        // loop counts keys
        let = faxCountList = [];

        // loop counts keys
        for (const [key, value] of Object.entries(counts)) {
            faxCountList.push({
                type: key,
                count: value.count
            });
        }

    } catch (error) {
        console.log(error);
    }

}

async function handleFolderChange() {

    //reef modal
    const modalObject = {
        header: '<h5 class="modal-title">Move to Folder</h5>',
        body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                        ${modalSpinner}
                 </div>`,
        footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    }


    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

    $('#reefModal').modal('show');

    //get uuid
    const uuid = $(this).attr('data-move-to');

    modalObject.body = `
        <form id="moveToFolderForm" method="POST">
            <div class="modal-body">
                <div class="mb-3">
                    <label for="folderName" class="col-form-label">Folder Name</label>
                    <select class="form-select" name="folder_uuid">
                        <option value="">Select Folder</option>
                        ${efaxState.folders.map(folder => `<option value="${folder.uuid}">${folder.name}</option>`)}
                    </select>
                    <input type="hidden" name="uuid" value="${uuid}">
                </div>
            </div>
        </form>
    `;

    modalObject.footer = '<button type="submit" form="moveToFolderForm" class="btn btn-primary">Move</button>';

    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

}

async function moveToFolder(files) {

    try {

        let res = await _request(APIS.EFAX_MOVE_TO_FOLDER, "POST", {
            uuid: files.uuids,
            folder_uuid: files.folder_uuid
        });

        const selectedPhone = efaxState.selectedPhone.length;

        //get current page
        const currentPage = efaxState.selectedFolder.length == 0 ? efaxState.fax[efaxState.currentPage] : (selectedPhone ? efaxState.filteredFax :
            efaxState.fax[efaxState.currentPage].folder[efaxState.selectedFolder]);

        //foreach folders.uuids
        files.uuids.forEach(async (uuid) => {

            let fax = currentPage.items.find(fax => fax.uuid === uuid);
            //if fax not exists in current page

            if (fax) {

                //get id from res.data
                fax.id = res.data[uuid];

                //set folder_uuid
                fax.folder_uuid = files.folder_uuid;


                //remove fax from current page
                const index = currentPage.items.findIndex(fax => fax.uuid === uuid);
                currentPage.items.splice(index, 1);

                //if phone is selected
                if (efaxState.selectedPhone.length) {
                    filteredAction(uuid, 'delete');
                    //set hasMore to true
                    efaxState.filteredFax.hasMore = true;
                }

                //add a key value pair to data
                currentPage.folder ??= {};

                currentPage.folder[files.folder_uuid] ??= {
                    items: []
                };

                //delete fax from index db
                await db.delete('fax', uuid);

                //add to selected folder
                currentPage.folder[files.folder_uuid].items.push(fax);

                //check efaxState.fax.Inbox.items.length
                if (efaxState.fax.Inbox.items.length > 1 && efaxState.fax.Inbox.items.length < 30) {
                    //load more fax
                    await loadMoreFax();
                }




            }

        });

        //sort by id descending
        currentPage.folder[files.folder_uuid].items.sort((a, b) => b.id - a.id);

        fetchInitData();

        toast(res.msg);

    } catch (error) {
        console.log(error);
    }
}


async function fetchFax(type = 'Inbox', folder = '') {

    //return if selectedPage is New
    if (efaxState.currentPage == 'New') return;

    if (folder.length) {

        efaxState.fax[type].folder ??= {};

        efaxState.fax[type].folder[folder] ??= {
            items: [],
            hasMore: false
        }

    }

    // Get fax data
    const faxData = folder.length ? efaxState.fax[type].folder[folder] : efaxState.fax[type];

    if (type !== efaxPage.Queued && type !== efaxPage.Logs && folder.length === 0) {

        if (faxData.items.length >= 30 && faxData.hasMore) {
            return;
        }
    }

    if (folder.length && faxData.items.length >= 30) {
        return;
    }

    // Get url
    let url = '/efax/' + (folder ? 'folder/' + folder : type);

    //loader true
    efaxState.loader = true;
    // Send request

    try {
        const response = await _request(url);
        //loader false
        efaxState.loader = false;

        // Push or replace data
        response.data?.items.forEach((fax) => {

            //if folder is selected

            if (type == 'Queued' || type == 'Logs') {

                //replace fax if exists or push fax
                const faxIndex = faxData.items.findIndex(faxFile => faxFile.uuid === fax.uuid);
                if (faxIndex === -1) {
                    faxData.items.push(fax);
                } else {
                    faxData.items[faxIndex] = fax;
                }

            } else {
                //if fax already not exists in folder
                if (!faxData.items.find(faxFile => faxFile.uuid === fax.uuid)) {
                    faxData.items.push(fax);
                }
            }


            if (efaxState.currentPage == 'Archived') {
                // sort by epoch descending
                faxData.items.sort((a, b) => b.action_epoch - a.action_epoch);
            } else {
                // sort by epoch descending
                faxData.items.sort((a, b) => b.epoch - a.epoch);
            }

        });

        // Set hasMore
        faxData.hasMore = response.data?.item_count > response.data?.item_limit;


    } catch (error) {
        console.log(error);
    }

}


async function fetchServiceFax(type = 'Inbox', folder = '') {

    // Get url
    let url = '/efax/' + (folder ? 'folder/' + folder : type) + '/' + efaxState.selectedPhone;

    //loader true
    efaxState.loader = true;
    // Send request

    try {

        const response = await _request(url);
        //loader false
        efaxState.loader = false;

        if (efaxState.currentPage == 'Archived') {
            // sort by epoch descending
            response.data.items.sort((a, b) => b.action_epoch - a.action_epoch);

        } else {
            // sort by epoch descending
            response.data.items.sort((a, b) => b.epoch - a.epoch);
        }

        // Push or replace data
        efaxState.filteredFax = {
            items: response.data.items,
            hasMore: response.data?.item_count > response.data?.item_limit
        };

    } catch (error) {
        console.log(error);
    }

}

async function fetchInitData() {

    try {

        //send request
        const response = await _request(APIS.EFAX);

        //stateFolders concat folders
        efaxState.folders = response.data?.folders;

        //set fax counts
        const counts = response.data?.counts;

        let countState = {};

        //phone Active Service
        for (let key in counts) {
            countState[key] = counts[key];
        }

        //set counts
        efaxState.faxCounts = countState;


    } catch (error) {
        console.log(error);
    }

}

async function loadMoreFax() {

    const selectedFolder = efaxState.selectedFolder;
    const currentPage = efaxState.currentPage;

    // Check if folder is selected
    const isFolder = selectedFolder.length > 0;

    // Get fax data
    const faxData = isFolder
        ? efaxState.fax[currentPage].folder[selectedFolder]
        : efaxState.fax[currentPage];

    // Get last item
    let lastItem = faxData.items[faxData.items.length - 1];

    // Set hasMore to true
    faxData.hasMore = true;

    await fetchMoreFax(efaxState.currentPage == 'Archived' ? lastItem.action_epoch : lastItem.epoch);

}

async function fetchMoreFax(lastItem) {

    const selectedFolder = efaxState.selectedFolder;
    const currentPage = efaxState.currentPage;

    const faxData = selectedFolder.length === 0
        ? efaxState.fax[currentPage]
        : efaxState.fax[currentPage].folder[selectedFolder];

    if (!faxData.hasMore) {
        return;
    }

    const folderPath = selectedFolder.length === 0 ? currentPage : `folder/${selectedFolder}`;
    const url = `/efax/${folderPath}?before=${lastItem}`;

    try {

        // Send request
        const response = await _request(url);

        // Push or replace data
        response.data?.items.forEach((fax) => {
            const faxIndex = faxData.items.findIndex(faxFile => faxFile.uuid === fax.uuid);
            if (faxIndex === -1) {
                faxData.items.push(fax);
            }
        });

        // Save data
        faxData.items.forEach((fax) => {
            fax.type = currentPage;
            fax.epoch = parseInt(fax.epoch);
        });

        if (efaxState.currentPage == 'Archived') {
            // sort by epoch descending
            faxData.items.sort((a, b) => b.action_epoch - a.action_epoch);

        } else {
            // sort by epoch descending
            faxData.items.sort((a, b) => b.epoch - a.epoch);
        }

        // Update hasMore
        faxData.hasMore = response.data?.item_count > response.data?.item_limit;

    } catch (error) {
        console.log(error);
    }


}

async function loadMoreServiceFax() {

    const lastItem = efaxState.filteredFax.items[efaxState.filteredFax.items.length - 1];

    const selectedFolder = efaxState.selectedFolder;

    const currentPage = efaxState.currentPage;

    const faxData = efaxState.filteredFax;

    if (!faxData.hasMore) {
        return;
    }

    const folderPath = selectedFolder.length === 0 ? currentPage : `folder/${selectedFolder}`;

    const servicePhone = efaxState.selectedPhone ? '/' + efaxState.selectedPhone : '';

    const url = `/efax/${folderPath + servicePhone}?before=${efaxState.currentPage == 'Archived' ? lastItem.action_epoch : lastItem.epoch}`;


    try {

        // Send request
        const response = await _request(url);

        // Push or replace data
        response.data?.items.forEach((fax) => {
            const faxIndex = faxData.items.findIndex(faxFile => faxFile.uuid === fax.uuid);
            if (faxIndex === -1) {
                faxData.items.push(fax);
            }
        });


        if (efaxState.currentPage == 'Archived') {
            // sort by epoch descending
            faxData.items.sort((a, b) => b.action_epoch - a.action_epoch);

        } else {
            // sort by epoch descending
            faxData.items.sort((a, b) => b.epoch - a.epoch);
        }


        //set hasMore
        faxData.hasMore = response.data?.item_count > response.data?.item_limit;


    } catch (error) {
        console.log(error);
    }


}


async function deleteFolder(uuid) {

    //confirm
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
        //send request
        const res = await _request(APIS.EFAX_DELETE_FOLDER, "POST", { uuid });
        //show toast
        toast(res.msg);
        //clear selected folder
        efaxState.selectedFolder = '';
        // Use the findIndex() method to get the index of the folder that matches the uuid
        var index = efaxState.folders.findIndex(folder => folder.uuid === uuid);
        // Use the splice() method to remove that folder from the array
        efaxState.folders.splice(index, 1);
        //fetch folders
        await fetchInitData();
    } catch (error) {
        console.log(error);
    }

}

function createFolder() {

    const modalObject = {
        header: '<h5 class="modal-title">Create Folder</h5>',
        body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                        ${modalSpinner}
                 </div>`,
        footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    }

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));



    $('#reefModal').modal('show');

    //set #reefModal as form
    modalObject.body = `
                <form class="mb-3 p-3" id="createFolderForm">
                    <label for="folderName" class="col-form-label">Folder Name</label>
                    <input class="form-control bg-light border-light" name="name" placeholder="Folder Name" maxlength="100">
                </form>
                    `;

    modalObject.footer = `
            <button form="createFolderForm" class="btn btn-primary">Create</button>
    `;

    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

}


function renameFolder(uuid, folderName) {

    const modalObject = {
        header: '<h5 class="modal-title">Rename Folder</h5>',
        body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                            ${modalSpinner}
                    </div>`,
        footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    }

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

    $('#reefModal').modal('show');

    //set #reefModal as form
    modalObject.body = `
                    <form class="mb-3 p-3" id="renameFolderForm">
                        <label for="folderName" class="col-form-label">Folder Name</label>
                        <input class="form-control bg-light border-light" name="name" placeholder="Folder Name" maxlength="100" value="${folderName}">
                        <input type="hidden" name="uuid" value="${uuid}">
                    </form>
                        `;

    modalObject.footer = `
                <button form="renameFolderForm" class="btn btn-primary">Rename</button>
        `;

    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

}



//handle input file change
function handleInputFileChange(e) {

    //clear file_preview
    const files = e.target.files;

    $('#file_preview').html('');

    for (let i = 0; i < files.length; i++) {

        //add file name to #files
        $('#file_preview').append(`
        <div class="col-6 col-md-4 col-xl-3 mb-4" data-file-name="${files[i].name}">
            <div class="bg-body rounded-3 text-center py-4 border position-relative">
                <div class="bg-danger end-0 position-absolute text-light top-0 remove-file">
                    <i class="ri-close-line"></i>
                </div>
                <div>
                    <i class="ri-file-pdf-2-fill fs-1"></i>
                </div>
                <div class="d-flex justify-content-center">
                    <p class="text-truncate mb-0">${showFileName(files[i].name)}</p>
                </div>
            </div>
        </div>            
        `);
    }
}

function handlePreviewModalHide() {
    $('#filePreviewModalIframe').attr('src', '');
    $('#filePreviewModalIframe').addClass('d-none');
    $('#canvas-loader').show();
}

function handleAppendRecipientField() {
    $("#recipientFieldsContainer").append(`
        <div class="d-flex mb-2">
            <input type="text" class="form-control recipient" name="fax_numbers[]" required>
            <button type="button" class="btn btn-sm btn-danger removeRecipientField ms-2"><i class="ri-close-line fs-5"></i></button>
        </div>
    `);
}

//handle remove file
function handleRemoveFile(e) {

    const fileName = $(this).closest('[data-file-name]').data('file-name');

    const inputElement = $('#files')[0];


    const fileList = new DataTransfer();

    for (let i = 0; i < inputElement.files.length; i++) {

        if (inputElement.files[i].name !== fileName) {

            fileList.items.add(inputElement.files[i]);
        }
    }

    inputElement.files = fileList.files;


    $(this).closest('[data-file-name]').remove();
}

// Drag and drop files
function handleDragAndDropFiles(event) {

    // event is dragover
    if (event.type === 'dragover') {

        event.preventDefault();
        //change background color
        $(this).addClass('bg-light');
    }

    //remove background color on dragleave
    if (event.type === 'dragleave') {
        event.preventDefault();
        //change background color
        $(this).removeClass('bg-light');
    }

    // event is drop
    if (event.type === 'drop') {

        //prevent default
        event.preventDefault();
        //get files
        //remove background color
        $(this).removeClass('bg-light');
        //check file type of all files
        for (let i = 0; i < event.originalEvent.dataTransfer.files.length; i++) {

            //if file type is not pdf or tiff
            if (!efaxState.allowedFileTypes.includes(event.originalEvent.dataTransfer.files[i].type)) {
                //show toast
                toast('Only PDF and TIFF files are allowed', 'danger');
                return;
            }
        }
        //get files
        const files = event.originalEvent.dataTransfer.files;

        //add files to input
        $('#files').prop('files', files);

        //trigger change event on #files
        $('#files').trigger('change');

    }

}

// show short file name
function showFileName(name) {
    //return first 5 characters of the name and ... then the last 5 characters
    return name.slice(0, 5) + '...' + name.slice(-5);
}

async function handlePreviewFax(e) {


    let file = $(this).attr('data-modal-file');
    let title = $(this).attr('data-modal-title');
    let subtitle = $(this).attr('data-modal-subtitle');
    let date = $(this).attr('data-modal-date');

    const modalObject = {
        header: `
            <div>
                <div class="d-flex align-items-center">
                    <h1 class="modal-title fs-6">${title}</h1>
                    <small class="ms-2"><span> (${subtitle})</span></small>
                </div>
                <small><span>${date}</span></small>
            </div>
        `,
        body: `<div class="d-flex justify-content-center align-items-center" style="height: 10rem;">
                        ${modalSpinner}
                    </div>`,
        footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    }

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

    //set reef modal modal-xl
    $('#reefModal .modal-dialog').addClass('modal-xl');

    $('#reefModal').modal('show');

    const param = new URLSearchParams({
        page: efaxState.currentPage,
        download: false,
    });


    try {

        const data = await _request(APIS.EFAX_STORAGE + file, "GET", {
            page: efaxState.currentPage,
            download: false,
        }, false, 'blob')

        let blob = new Blob([data], {
            type: 'application/pdf',
        });

        //update window state is_viewed in current page or folder
        const currentPage = efaxState.selectedFolder.length == 0 ? efaxState.fax[efaxState.currentPage] : (
            efaxState.selectedPhone ? efaxState.filteredFax : efaxState.fax[efaxState.currentPage].folder[efaxState.selectedFolder]
        );

        const fax = currentPage.items.find(fax => fax.uuid === file);
        fax.is_viewed = true;

        //update fax count
        efaxState.faxCounts.Inbox.unread = efaxState.fax.Inbox.items.filter(fax => fax.is_viewed == false).length;

        //if phone is selected
        if (efaxState.selectedPhone) {
            filteredAction(file, 'view');
        }

        //update index db
        saveDataToDB('fax', cloneObjFromProxy(fax));

        let blobUrl = window.URL.createObjectURL(blob);

        modalObject.body = `<iframe src="${blobUrl}" style="width: 100%; height: 70vh; border: none;"></iframe>`;

        //preview fax modal show event
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        //increase fax count and 
        fetchInitData();

    } catch (error) {
        console.log(error);

    }


}

async function handleDownloadFax() {

    const file = $(this).attr('data-download');

    try {

        const data = await _request(APIS.EFAX_STORAGE + file, "GET", {
            page: efaxState.currentPage,
            download: true,
        }, false, 'blob')

        let blob = new Blob([data], {
            type: 'application/pdf',
        });

        //browser specific code only for chromium based browsers
        if ('showSaveFilePicker' in window) {

            const options = {
                suggestedName: file.split('/').pop(),
                types: [{
                    description: 'PDF Files',
                    accept: {
                        "application/pdf": [".pdf"],
                    },
                },],
            };
            // Call the showSaveFilePicker() method
            let handle = await showSaveFilePicker(options);


            // Get a writable stream from the handle
            let writable = await handle.createWritable();

            // Write the blob to the stream
            await writable.write(blob);

            // Close the stream
            await writable.close();

        } else {

            let blobUrl = window.URL.createObjectURL(blob);

            let link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', file.split('/').pop());
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }

    } catch (error) {

        console.log(error);

    }

    //update window state is_viewed in current page or folder
    const currentPage = efaxState.selectedFolder.length == 0 ? efaxState.fax[efaxState.currentPage] : efaxState.fax[efaxState.currentPage].folder[efaxState.selectedFolder];
    const fax = currentPage.items.find(fax => fax.uuid === file);
    fax.is_viewed = true;

    //update fax count
    efaxState.faxCounts.Inbox.unread = efaxState.fax.Inbox.items.filter(fax => fax.is_viewed == false).length;

    //if phone is selected
    if (efaxState.selectedPhone) {
        filteredAction(file, 'view');
    }

    //update index db
    saveDataToDB('fax', cloneObjFromProxy(fax));


}

function handleFaxItemSelect(event) {

    const target = $(this);

    const uuid = target.attr('data-fax-item');

    let selectedFax = efaxState.selectedFax;

    if (event.ctrlKey) {
        // Toggle selection (add or remove from selectedRows)
        if (!selectedFax.includes(uuid)) {

            //push to selectedFax
            selectedFax.push(uuid);

        } else {

            //remove from selectedFax

            const index = selectedFax.findIndex(item => item === uuid);

            //remove index from
            selectedFax.splice(index, 1);

            //old code
            //efaxState.selectedFax = selectedFax.filter(item => item !== uuid);

        }
    } else {
        selectedFax = [];
    }

}

function handleDragAndDrop(event) {

    event.preventDefault();

    let selectedFax = efaxState.selectedFax;

    if (event.type === 'drop') {
        const selectedDragItems = selectedFax.map(uuid => {
            return {
                uuid: uuid,
            };
        });

        const tableRow = $(event.target).closest('[data-folder-uuid]');

        // uuid array from data
        const uuids = selectedDragItems.map(uuid => uuid.uuid);

        moveToFolder({
            folder_uuid: tableRow.attr('data-folder-uuid'),
            uuids: uuids
        });

        selectedFax = [];
    }

}

document.addEventListener('reef:signal', function (event) {
    if (event.detail.action == 'set' && event.detail.prop == 'currentPage' && event.detail.value == 'New') {
        $('#newFaxCard').removeClass('d-none');

        //hide searchBox
        $('#searchBox').addClass('d-none');
        //hide faxTable
        $('#faxTable').addClass('d-none');

    } else if (event.detail.action == 'set' && event.detail.prop == 'currentPage') {
        //hide newFaxCard
        $('#newFaxCard').html('');
        $('#newFaxCard').addClass('d-none');

        //show searchBox
        $('#searchBox').removeClass('d-none');
        //show faxTable
        $('#faxTable').removeClass('d-none');

    }
});

function filteredAction(uuid, action) {

    //find index of filtered fax
    const index = efaxState.filteredFax.items.findIndex(fax => fax.uuid === uuid);

    if (action == "delete") {
        //remove fax from filtered fax
        efaxState.filteredFax.items.splice(index, 1);
    }

    if (action == "view") {
        //update is_viewed
        efaxState.filteredFax.items[index].is_viewed = true;

    }

}

//function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

function formatBytes(bytes, dm = 2) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
      sizes = [`${bytes <= 1 ? "Byte" : "Bytes"}`, 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }