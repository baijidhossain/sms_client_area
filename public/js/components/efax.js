function faxListComponent(faxData) {

    function QueuedList(data) {

        const {
            name,
            number,
            uuid,
            epoch,
            fax_status,
            fax_retry_count
        } = data;

        const isSelected = window.state.selectedFax.includes(uuid);
        return `<tr class="align-middle ${isSelected ? 'bg-primary text-white' : ''}" key="${uuid}" data-fax-item="${uuid}"> 
                            <td>${name}</td>
                            <td>${number}</td>
                            <td>${UTCToLocalDate(epoch, '_d_d h:i A')}</td>
                            <td>${fax_status}</td>
                            <td>${fax_retry_count}</td>

                            <td class="pe-5 text-end">

                            <button class="btn btn-sm btn-outline-light ms-2" 
                            data-bs-toggle="tooltip"
                            data-bs-title="View Fax"
                            data-action="preview-modal" 
                            data-modal-file="${uuid}"
                            data-modal-title="${name}" 
                            data-modal-subtitle="${number}"
                            data-modal-date="${UTCToLocalDate(epoch, '_d_d h:i A')}">
                                    <i class="ri-eye-line"></i>
                            </button>
                    
                            <a data-download="${uuid}" class="btn btn-sm btn-outline-light ms-2" data-bs-toggle="tooltip" data-bs-title="Download"> 
                                <i class="ri-download-2-line"></i>
                            </a>
                

                        </td>


                        </tr>
                    `;
    }


    function LogsList(data) {

        const {
            uuid,
            epoch,
            success,
            result_code,
            result_text,
            total_pages,
            image_size,
            destination,
        } = data;

        const isSelected = window.state.selectedFax.includes(uuid);
        return `<tr class="align-middle ${isSelected ? 'bg-primary text-white' : ''}" key="${uuid}" data-fax-item="${uuid}">
                        <td>${UTCToLocalDate(epoch, '_d_d h:i A')}</td>
                        <td>${destination}</td>
                        
                        <td>${success == 1 ? '<i class="ri-checkbox-circle-fill text-success"></i>' : '<i class="ri-close-circle-fill text-danger"></i>'}</td>
                        <td>${result_code}</td>
                        <td>${result_text}</td>
                        <td>${total_pages}</td>
                        <td>${formatBytes(image_size) ?? ''}</td>
                        

                        <td class="pe-5 text-end">
                            <button class="btn btn-sm btn-outline-light ms-2" 
                            data-bs-toggle="tooltip"
                            data-bs-title="View Fax"
                            data-action="preview-modal" 
                            data-modal-file="${uuid}"
                            data-modal-title="Preview" 
                            data-modal-subtitle="Fax File"
                            data-modal-date="${UTCToLocalDate(epoch, '_d_d h:i A')}">
                                    <i class="ri-eye-line"></i>
                            </button>
                            <a data-download="${uuid}" class="btn btn-sm btn-outline-light ms-2" data-bs-toggle="tooltip" data-bs-title="Download"> 
                                <i class="ri-download-2-line"></i>
                            </a>
                        </td>
                    </tr>
                `;
    }


    function InboxList(data) {

        const {
            name,
            number,
            uuid,
            epoch,
            is_viewed,
            folder_uuid,
        } = data;

        if (folder_uuid && window.state.selectedFolder.length === 0) return '';

        const isSelected = window.state.selectedFax.includes(uuid);

        return `<tr class="align-middle ${isSelected ? 'selected' : ''} ${is_viewed ? '' : 'fw-bold text-primary'}" ${isSelected ? 'draggable="true"' : ''} data-fax-item="${uuid}">
                        <td>${name}</td>
                        <td>${number}</td>
                        <td>${UTCToLocalDate(epoch, '_d_d h:i A')}</td>
                        <td class="pe-5 text-end">

                            <button class="btn btn-sm btn-outline-light ms-2" 
                            data-bs-toggle="tooltip"
                            data-bs-title="View Fax"
                            data-action="preview-modal" 
                            data-modal-file="${uuid}"
                            data-modal-title="${name}" 
                            data-modal-subtitle="${number}"
                            data-modal-date="${UTCToLocalDate(epoch, '_d_d h:i A')}">
                                    <i class="ri-eye-line"></i>
                            </button>
                    
                            <a data-download="${uuid}" class="btn btn-sm btn-outline-light ms-2" data-bs-toggle="tooltip" data-bs-title="Download"> 
                                <i class="ri-download-2-line"></i>
                            </a>
                    
                            <button data-move-to="${uuid}" data-bs-toggle="tooltip" data-bs-title="Move to folder"
                                    class="btn btn-sm btn-outline-light ms-2">
                                <i class="ri-folder-transfer-line"></i>
                            </button>
                    
                            <button data-fax-action="${uuid}" data-fax-action-type="archive" data-bs-toggle="tooltip" data-bs-title="Delete"
                                    class="btn btn-sm btn-outline-light ms-2">
                                    <i class="ri-delete-bin-line"></i>
                            </button>
                        </td>
                    </tr>
                `;
    }


    function SentList(data) {

        const {
            name,
            number,
            uuid,
            epoch,
        } = data;

        const isSelected = window.state.selectedFax.includes(uuid);
        return `<tr class="align-middle ${isSelected ? 'bg-primary text-white' : ''}" key="${uuid}" data-fax-item="${uuid}">
                        <td>${name}</td>
                        <td>${number}</td>
                        <td>${UTCToLocalDate(epoch, '_d_d h:i A')}</td>
                        <td class="pe-5 text-end">

                        <button class="btn btn-sm btn-outline-light ms-2" 
                        data-bs-toggle="tooltip"
                        data-bs-title="View Fax"
                        data-action="preview-modal" 
                        data-modal-file="${uuid}"
                        data-modal-title="${name}" 
                        data-modal-subtitle="${number}"
                        data-modal-date="${UTCToLocalDate(epoch, '_d_d h:i A')}">
                                <i class="ri-eye-line"></i>
                        </button>
                
                        <a data-download="${uuid}" class="btn btn-sm btn-outline-light ms-2" data-bs-toggle="tooltip" data-bs-title="Download"> 
                            <i class="ri-download-2-line"></i>
                        </a>

                    </td>
                    </tr>
                `;


    }


    function ArchivedList(data) {

        const {
            name,
            number,
            uuid,
            epoch,
            action_epoch,
        } = data;

        const isSelected = window.state.selectedFax.includes(uuid);
        return `<tr class="align-middle ${isSelected ? 'bg-primary text-white' : ''}" key="${uuid}" data-fax-item="${uuid}">
                        <td>${name}</td>
                        <td>${number}</td>

                        <td>${UTCToLocalDate(epoch, '_d_d h:i A')}</td>

                        <td>${UTCToLocalDate(action_epoch, '_d_d h:i A')}</td>

                        <td class="pe-5 text-end">
                            <button class="btn btn-sm btn-outline-light ms-2" 
                            data-bs-toggle="tooltip"
                            data-bs-title="View Fax"
                            data-action="preview-modal" 
                            data-modal-file="${uuid}"
                            data-modal-title="${name}" 
                            data-modal-subtitle="${number}"
                            data-modal-date="${UTCToLocalDate(epoch, '_d_d h:i A')}">
                                    <i class="ri-eye-line"></i>
                            </button>
                    
                            <a data-download="${uuid}" class="btn btn-sm btn-outline-light ms-2" data-bs-toggle="tooltip" data-bs-title="Download"> 
                                <i class="ri-download-2-line"></i>
                            </a>
                    
                            <button data-fax-action="${uuid}" data-fax-action-type="unarchive" data-bs-toggle="tooltip" data-bs-title="Restore"
                                    class="btn btn-sm btn-outline-light ms-2">
                                    <i class="ri-refresh-line"></i>
                            </button>                
                        </td>
                    </tr>
                `;
    }

    const Page = window.state.currentPage;

    return faxData.items.map(fax => {

        let isSeen = fax.is_viewed;

        // if Page not Archived and Inbox
        if (Page !== efaxPage.Archived && Page !== efaxPage.Inbox) {
            isSeen = true;
        }

        switch (Page) {
            case efaxPage.Inbox:
                return InboxList(fax);
            case efaxPage.Sent:
                return SentList(fax);
            case efaxPage.Queued:
                return QueuedList(fax);
            case efaxPage.Archived:
                return ArchivedList(fax);
            case efaxPage.Logs:
                return LogsList(fax);
            default:
                return '';
        }

    }).join('');
};

function faxTableComponent() {


    //if efaxState.loader true
    if (window.state.loader) {
        return `
        <div class="d-flex justify-content-center align-items-center" style="height: 70vh;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        `;
    }

    const Page = window.state.currentPage;

    //if selected page is new
    if (Page == 'New') return '';

    let faxData = {
        items: []
    };

    //if selected folder
    if (window.state.selectedPhone) {

        faxData.items = window.state.filteredFax.items;

    } else {

        //if selected folder
        if (window.state.selectedFolder) {
            //if selected folder is inbox
            faxData.items = window.state.fax[Page]?.folder?.[window.state.selectedFolder]?.items || [];

        } else {

            faxData.items = window.state.fax[Page].items;

        }

    }


    if (window.state.searchQuery.length >= 3) {

        const searchQuery = window.state.searchQuery.toLowerCase();

        faxData.items = faxData.items.filter(fax => {

            const { name, number, destination } = fax;

            return name?.toLowerCase().includes(searchQuery) || number?.includes(searchQuery) || destination?.includes(searchQuery);

        });
    }

    //if no fax data
    if (faxData.items.length === 0) {

        const icon = Page === efaxPage.Inbox ? 'ri-inbox-line' : Page === efaxPage.Sent ? 'ri-send-plane-2-line' : Page === efaxPage.Queued ? 'ri-time-line' : Page === efaxPage.Archived ? 'ri-archive-line' : 'ri-question-line';

        return `
            <div class="d-flex flex-column align-items-center justify-content-center text-center" style="height: 70vh;">
                <i class="${icon}" style="font-size: 40px; color: #ccc"></i>
                <p class="text-muted">No items found</p>
            </div>
        `;
    }

    return `
    <table class="table table-hover able-striped text-nowrap">
        <thead class="bg-light sticky-top z-0 top-0">
            <tr>
                ${Page === 'Inbox' ? `
                <th scope="col">Sender Name</th>
                <th scope="col">Sender Number</th>
                <th scope="col">Date</th>
                <th scope="col" class="pe-5 text-end">Actions</th>
                ` : ''}
                ${Page === 'Queued' ? `
                <th scope="col">Sender Name</th>
                <th scope="col">Sender Number</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Retry</th>
                <th scope="col" class="pe-5 text-end">Actions</th>
                ` : ''}

                ${Page === 'Logs' ? `            
                <th scope="col">Date</th>
                <th scope="col">Destination</th>
                <th scope="col">Success</th>
                <th scope="col">Code</th>
                <th scope="col">Status</th>
                <th scope="col">Total Pages</th>
                <th scope="col">Size</th>                
                <th scope="col" class="pe-5 text-end">Actions</th>
                ` : ''}
                ${Page === 'Sent' ? `
                <th scope="col">Receiver Name</th>
                <th scope="col">Receiver Number</th>
                <th scope="col">Date</th>
                <th scope="col" class="pe-5 text-end">Actions</th>
                ` : ''}
                ${Page === 'Archived' ? `
                <th scope="col">Sender Name</th>
                <th scope="col">Sender Number</th>
                <th scope="col">Date</th>
                <th scope="col">Archived Date</th>
                <th scope="col" class="pe-5 text-end">Actions</th>
                ` : ''}
            </tr>
        <tbody>
            ${faxListComponent(faxData)}
        </tbody>
    </table>
    `;

}

function searchBoxComponent() {
    return `
    <div class="input-group mb-3 rounded-3" reef-ignore>
        <span class="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
            <i class="ri-search-line search-icon font-size-18"></i>
        </span>
        <input type="text" class="form-control bg-light" placeholder="Search Fax (Name/Destination)" id="searchInput">
        
        <button id="clear-search" class="bg-light border-0 rounded-end-2 text-body-secondary d-none">
            <i class="ri-close-fill font-size-18"></i>
        </button>
    </div>
    `;
}

function pageHeaderComponent() {

    const pageTitle = window.state.currentPage;

    const folderName = window.state.folders?.find(folder => folder.uuid == window.state.selectedFolder);

    let icon;
    switch (pageTitle) {
        case efaxPage.Inbox:
            icon = 'ri-inbox-line';
            break;
        case efaxPage.Sent:
            icon = 'ri-send-plane-2-line';
            break;
        case efaxPage.Queued:
            icon = 'ri-time-line';
            break;
        case efaxPage.Archived:
            icon = 'ri-archive-line';
            break;
        case efaxPage.Logs:
            icon = 'ri-file-list-2-line';
            break;
        case 'New':
            icon = 'ri-printer-line';
            break;
        default:
            icon = 'ri-question-line';
    }

    return `
                <i class="ri-menu-line menu-icon me-3 d-md-none" data-nav-button></i>                
                <h4 class="mb-0 fw-light"><i class="${icon}"></i> ${pageTitle} ${folderName ? '<small class="fs-6 text-black-50">(' + folderName.name + ')</small>' : ''}</h4>
    `;
}

function foldersComponent(data) {

    //if selected page is not inbox
    if (window.state.currentPage !== efaxPage.Inbox) {
        return '';
    }

    const list = window.state.folders || [];

    var folders = '';

    function getCount(folder) {

        //if selected phone
        if (!window.state.selectedPhone) {

            let total = 0;
            let unread = 0;

            //loop through services
            activeServicesByType['efax'].map(service => {
                const serviceCount = folder.countData[service.number];
                total += serviceCount.total;
                unread += serviceCount.unread;
            });

            return {
                total: total,
                unread: unread
            };
        } else {
            return folder.countData[window.state.selectedPhone];
        }
    }

    //loop through folders
    list.map(folder => {

        //append to select
        folders += `<div style="cursor: pointer;" class="border-bottom ps-1 py-2 folder-list ${window.state.selectedFolder == folder.uuid ? 'bg-primary text-white' : ' text-body-secondary'}"
         data-folder-uuid="${folder.uuid}" key="${folder.uuid}">

            <div class="media px-3 d-flex align-items-center justify-content-between">
            
                <div class="chat-user-img align-self-center me-2 ms-0">
                    <div class="">
                    —  <i class="ri-folder-line"></i>
                    </div>
                </div>

                <div class="media-body overflow-hidden">

                    <p class="text-truncate font-size-15 mb-0" style="max-width: 12ch;">
                        ${folder.name} 
                    </p>

                </div>

            <smal class="badge bg-dark-subtle border rounded-pill text-body-secondary">${getCount(folder).unread} / ${getCount(folder).total}</smal>

            </div>
        </div>
        `;

    });

    return `
        <div id="${data.name}" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#${data.name}">
            <div class="accordion-body bg-light-subtle p-0" id="folders">
                ${folders}
            </div>
        </div>
    `;

}

function folderActionComponent() {

    return `<div class="d-flex justify-content-center align-items-center">
                <button
                data-bs-toggle="tooltip"
                data-bs-title="Create Folder"

                data-action="create" class="btn btn-sm btn-outline-light mx-1"  ${window.state.currentPage !== efaxPage.Inbox || window.state.selectedFolder ? 'disabled' : ''}>
                    <i class="ri-folder-add-line"></i>
                </button>

                <button
                data-bs-toggle="tooltip"
                data-bs-title="Rename Folder"                              
                data-action="rename" class="btn btn-sm btn-outline-light mx-1" ${window.state.selectedFolder ? '' : 'disabled'}>
                    <i class="ri-pencil-line"></i>
                </button>

                <button
                data-bs-toggle="tooltip"
                data-bs-title="Delete Folder"               
                data-action="delete" class="btn btn-sm btn-outline-light mx-1" ${window.state.selectedFolder ? '' : 'disabled'}>
                    <i class="ri-delete-bin-7-line"></i>
                </button>

                <button
                data-bs-toggle="tooltip"
                data-bs-title="Change Folder"
                data-action="change" class="btn btn-sm btn-outline-light mx-1" ${window.state.selectedFolder ? '' : 'disabled'}>
                    <i class="ri-folder-transfer-fill"></i>
                </button>
            </div>`;

}

function efaxNavComponent() {

    function getCount(Page) {

        //if selected phone
        if (window.state.selectedPhone) {
            return window.state.faxCounts[Page][window.state.selectedPhone];
        } else {

            let total = 0;
            let unread = 0;

            let services = activeServicesByType['efax'] ?? [];

            //loop through services
            services.map(service => {

                const serviceCount = window.state.faxCounts[Page][service.number];

                total += serviceCount.total;

                unread += serviceCount.unread;

            });

            return {
                total: total,
                unread: unread
            }
        }

    }



    const navItems = [

        {
            name: 'Inbox',
            icon: 'ri-inbox-line',
            count: getCount('Inbox').total,
            unread: getCount('Inbox').unread,
            selected: window.state.currentPage === efaxPage.Inbox
        },
        {
            name: 'Sent',
            icon: 'ri-send-plane-2-line',
            count: getCount('Sent').total,
            selected: window.state.currentPage === efaxPage.Sent
        },
        {
            name: 'Queued',
            icon: 'ri-time-line',
            count: getCount('Queued').total,
            selected: window.state.currentPage === efaxPage.Queued
        },
        {
            name: 'Archived',
            icon: 'ri-archive-line',
            count: getCount('Archived').total,
            selected: window.state.currentPage === efaxPage.Archived
        },

        {
            name: 'Logs',
            icon: 'ri-file-list-2-line',
            count: getCount('Logs').total,
            selected: window.state.currentPage === efaxPage.Logs
        }

    ];

    return navItems.map(item => {

        return `
            <div class="accordion-item mb-2 overflow-hidden rounded-3">

                <h2 class="accordion-header d-flex">
                                     
                    <a class="accordion-button pe-3 ${item.selected ? 'text-primary' : 'text-body-secondary fw-light'}" href="javascript:void(0)" data-navigate="${item.name}">
                        <i class="${item.icon} me-2"></i>                        

                        ${item.name}

                        <span class="badge bg-white border rounded-pill text-body-secondary ms-auto float-end">${item.unread ? (item.unread + '/' ) : ''} ${item.count}</span>
                    </a>
                </h2>

                ${item.name === efaxPage.Inbox ? foldersComponent(item) : ''}

            </div>

            `;
    }).join('');

}

function phoneNumber() {

    //get active services by type
    const faxService = activeServicesByType['efax'] ?? [];


    //if only one service return ''
    if (faxService.length === 1) {
        return `
            <span>${faxService[0].number}</span>
        `;
    }


    return `
        <select class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;" id="servicePhone">
            <option value="">All Numbers</option>
            ${faxService.map(service => {
        return `<option value="${service.number}">${service.number}</option>`;
    }).join('')}
        </select>`
        ;
}

function newFaxCard() {

    const includeCoverPage = window.state?.includeCoverPage ?? false;

    const pageSettings = window.state?.pageSettings ?? false;

    const userInfo = JSON.parse(localStorage.getItem('user'));

    const allowedFileTypes = efaxState.allowedFileTypes;

    const phoneId = window.state.selectedSenderPhone ?? (activeServicesByType['efax']?.[0].phone_id ?? '');

    const fillData = efaxState.settings[phoneId];

    //get contacts where numbers[]  phone_type 4
    const contacts = window.appState.contacts.filter(contact => contact.numbers?.find(number => number.phone_type == 4));

    let contactList = [];

    contacts.map(contact => {
        const numbers = contact.numbers.filter(number => number.phone_type == 4);
        numbers.map(number => {
            contactList.push({
                name: contact.name,
                number: number.number,
                phone_id: number.phone_id
            });
        });
    });

    console.log(contactList);

    return ` 
        <div class="px-4 col-lg-7 col-md-10 py-4">
            <form id="sendFaxForm" method="POST" enctype="multipart/form-data">
                <div class="mb-3">
                    <label class="form-label">From</label>
                    <select class="form-select" name="phone_id" required>
                        ${activeServicesByType['efax']?.map(service => {
        return `<option value="${service.phone_id}" ${service.is_primary == 1 ? 'selected' : ''}
                            >${window.state.settings?.[service.phone_id]?.business_name || userInfo.name} (${service.number})</option>`;
    }).join('')}
                    </select>
                </div>
                <div class="mb-3 d-grid" reef-ignore>
                        <label for="recipient-name" class="col-form-label">Fax Number(s)<span class="text-danger">*</span></label>
                        <div class="d-flex mb-2">
                            <input type="text" class="form-control recipient" name="fax_numbers[]" required>
                            <button type="button" class="btn btn-sm btn-success ms-2" id="addRecipientFieldBtn"><i class="ri-add-fill fs-5"></i></button>
                        </div>
                        <div id="recipientFieldsContainer">
                        </div>
                    </div>

                    <div class="mb-3">
                            <button class="btn btn-light btn-sm mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#groupmembercollapse" aria-expanded="true" aria-controls="groupmembercollapse">
                                Select Contacts
                            </button>

                            <div class="collapse" id="groupmembercollapse" style="">
                            <div class="card border mb-2">
                                <div class="card-header">
                                    <h5 class="font-size-15 mb-0" id="contact_count">${contactList.length} contacts with fax numbers</h5>
                                </div>


                                <div class="card-body p-2">
                                    <div style="max-height: 140px;overflow-y: auto;">

                                     ${contactList.map(contact => {
                                         
                                       

                                         return `
                                         
                                          <div class="form-check border-bottom">
                                                    <input type="checkbox" class="form-check-input" id="contactCheck${contact.phone_id}" name="contact_list" value="${contact.number}">
                                                        <label class="form-check-label" for="contactCheck${contact.phone_id}"> ${contact.name}
                                                        <div class="text-muted font-size-12 mb-1">${contact.number}</div>
                                                </label>
                                            </div>
                                         
                                         `;

                                     }).join('')}
                                        
                                               
                                               
                                            
                                        
                                    </div>
                                </div>






                              
                            </div>
                        </div>
                        </div>


                        




                <style>
                    :root {
                        --colorPrimaryNormal: #00b3bb;
                        --colorPrimaryDark: #00979f;
                        --colorPrimaryGlare: #00cdd7;
                        --colorPrimaryHalf: #80d9dd;
                        --colorPrimaryQuarter: #bfecee;
                        --colorPrimaryEighth: #dff5f7;
                        --colorPrimaryPale: #f3f5f7;
                        --colorPrimarySeparator: #f3f5f7;
                        --colorPrimaryOutline: #dff5f7;
                        --colorButtonNormal: #00b3bb;
                        --colorButtonHover: #00cdd7;
                        --colorLinkNormal: #00979f;
                        --colorLinkHover: #00cdd7;
                    }

                    .upload_dropZone {
                        color: #0f3c4b;
                        background-color: var(--bs-body-bg);
                        outline: 2px dashed rgba(var(--bs-primary-rgb), var(--bs-bg-opacity));
                        outline-offset: -12px;
                        transition:
                            outline-offset 0.2s ease-out,
                            outline-color 0.3s ease-in-out,
                            background-color 0.2s ease-out;
                        border-radius: 5px;
                        border: 1px solid var(--bs-border-color);
                    }

                    .upload_dropZone.highlight {
                        outline-offset: -4px;
                        outline-color: var(--colorPrimaryNormal, #0576bd);
                        background-color: var(--colorPrimaryEighth, #c8dadf);
                    }
                </style>

                <label class="form-label" id="fax_files_label">Fax Files  ${includeCoverPage ? '' : '<span class="text-danger">*</span>'}
                </label>

                <fieldset class="mb-4 p-4 position-relative text-center upload_dropZone" reef-ignore>

                    <legend class="visually-hidden">Image uploader</legend>

                    <p class="small my-2">Drag &amp; Drop Files inside dashed region<br><i>or</i></p>

                    <input id="files" data-post-name="image_background" name="fax_files[]" class="h-100 invisible position-absolute start-0 top-0 w-100" type="file" multiple="" accept="${allowedFileTypes.join(', ')}">

                    <label class="btn btn-sm btn-primary mb-3" for="files">Choose file(s)</label>

                    <div class="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0"></div>

                </fieldset>

                <div class="row" id="file_preview" reef-ignore></div>
            
                <div class="form-check form-switch  mb-3">
                    <input class="form-check-input" type="checkbox" role="switch" id="includeCoverPage" name="cover_page" ${includeCoverPage ? 'checked' : ''}>
                    <label class="form-check-label" for="includeCoverPage">Include Cover Page</label>
                </div>

                <div id="coverPage" class="${includeCoverPage ? '' : 'd-none'}">

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Fax From</label>
                                <textarea type="text" class="form-control" placeholder="Your Business Name" name="fax_sender" rows="1" style="resize:none">${fillData?.business_name ?? ''}</textarea>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Fax To</label>
                                <input type="text" class="form-control" placeholder="Their Business Name" name="fax_recipient">
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Header</label>
                        <input type="text" class="form-control" placeholder="Displayed beneath the logo in the header of the cover sheet (optional). " name="fax_header">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Subject</label>
                        <input type="text" class="form-control" placeholder="Enter a subject for the cover sheet (optional)." name="fax_subject">
                    </div>

                    <div class="mb-3">
                        <label class="form-label" id="fax_message_label">Message <span class="text-danger">*</span></label>
                        <textarea class="form-control" rows="4" placeholder="Enter a message for the cover sheet." name="fax_message"></textarea>
                    </div>

                    
                    <div class="form-check form-switch  mb-3">
                        <input class="form-check-input" type="checkbox" role="switch" id="legal_disclaimer" name="legal_disclaimer" value="1" checked>
                        <label class="form-check-label" for="legal_disclaimer">Legal Disclaimer</label>
                    </div>

                    <div id="legal-disclaimer" class="mb-3">
                        <label class="form-label">Legal Notice</label>
                        <textarea class="form-control" placeholder="Displayed in the footer of the cover sheet (optional)." name="fax_footer">${fillData?.legal_disclaimer ?? ''}</textarea>
                    </div>
                </div>
                
                <div class="accordion border overflow-hidden rounded-3" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                        <button class="accordion-button px-3 collapsed" type="button" data-open="pageSettings">
                            <i class="ri-settings-3-line me-1"></i> Page Settings
                        </button>
                        </h2>
                        <div id="pageSettings" class="accordion-collapse collapse ${pageSettings ? 'show' : ''}">
                            <div class="accordion-body">

                                <div class="input-group mb-3">
                                    <label class="input-group-text" for="resolution">Resolution</label>
                                    <select class="form-select" id="resolution" name="fax_resolution" value="${fillData?.page_resulation ?? ''}">
                                        <option value="normal">Normal</option>
                                        <option value="fine" selected="">Fine</option>
                                        <option value="superfine">Superfine</option>
                                    </select>
                                </div>

                                <div class="input-group mb-3">
                                    <label class="input-group-text" for="page-sixe">Page Size</label>
                                    <select class="form-select" id="page-sixe" name="fax_page_size" value="${fillData?.page_size ?? ''}">
                                        <option value="letter">Letter</option>
                                        <option value="legal">Legal</option>
                                        <option value="a4" selected="">A4</option>
                                    </select>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-between mt-4">

                    <button class="btn btn-light" type="reset">
                        <i class="ri-refresh-line"></i>
                        Reset
                    </button>

                    <div>
                        <button class="btn btn-dark ms-2" type="submit" name="submit" value="preview">
                            <i class="ri-eye-fill"></i>
                            Preview
                        </button>

                        <button class="btn btn-primary ms-2" type="submit" name="submit" value="send">
                            <i class="ri-send-plane-fill"></i>
                            Send
                        </button>
                    </div>

                </div>

            </form>

        </div>


    `;
}



