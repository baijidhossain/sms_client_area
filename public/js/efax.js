

const faxTemplate = (fax) => {

    const dateTime = new Date(fax.date);
    const year = dateTime.getUTCFullYear();
    const month = String(dateTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getUTCDate()).padStart(2, '0');
    const hours = String(dateTime.getUTCHours()).padStart(2, '0');
    const minutes = String(dateTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateTime.getUTCSeconds()).padStart(2, '0');
    const date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const downloadFile = atob(window.ipbxapi_host) + '/efax/storage/' + fax.file_url;

    return `
    <tr>
        <td>
            <div class="d-flex">
                <div class="chat-user-img align-self-center me-3 ms-0">
                    <div class="avatar-xs">
                        <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                            <i class="ri-printer-line"></i>
                        </span>
                    </div>
                </div>
                <div style="min-width: 200px;">
                    <h5 class="font-size-15 mb-1">
                        ${fax.name}
                    </h5>
                    <p class="chat-user-message text-truncate mb-0 ">
                        ${fax.number}
                    </p>
                </div>
            </div>
        </td>
        <td>
            <a href="javascript:void(0)" style="min-width: 200px;" data-bs-target="#exampleModal" data-modal-file="${atob(window.ipbxapi_host) + '/efax/storage/' + fax.file_url}" data-modal-title="${fax.file}">
                <h5 class="font-size-15 mb-1"> <i class="ri-file-pdf-line"></i>
                ${fax.file}
                </h5>
                <p class="chat-user-message text-truncate mb-0 text-dark">
                    ${getDateString(date)} ${formatDate(date, 'timeOnly')}
                </p>
            </a>
        </td>
        <td>
            <div style="min-width: 200px;" class="float-end mt-2">
                <a href="${downloadFile}" class="btn btn-sm btn-outline-light ms-2">
                    <i class="ri-download-2-line"></i>
                </a>

                <button 
                onclick="action('${fax.fax_file_uuid}', 'delete')"
                class="btn btn-sm btn-outline-light ms-2">
                    <i class="ri-delete-bin-line"></i>
                </button>

                <button onclick="action('${fax.fax_file_uuid}', 'archive')" class="btn btn-sm btn-outline-light ms-2">
                    <i class="ri-archive-line"></i>
                </button>

                <button onclick="moveToFolder('${fax.fax_file_uuid}')" class="btn btn-sm btn-outline-light ms-2">
                    <i class="ri-folder-transfer-fill"></i>
                </button>

            </div>
        </td>
    </tr>
    `
}

const fetchData = async () => {

    let Inbox = await _request("/efax/inbox");

    let html = '';

    Inbox.data.forEach(fax => {
        html += faxTemplate(fax);
    });

    $('#loader').hide();

    $('#fax').html(html);

}

const loadFolders = async () => {

    const list = await fetchFolders();

    var folders = '';

    //loop through folders
    list.forEach(folder => {
        //append to select
        folders += `
            <div style="cursor: pointer;" class="border-0 border-1 border-bottom ps-3 py-2 folder-list">
                <div class="media ps-3">
                    <div class="chat-user-img align-self-center me-2 ms-0">
                        <div class="">
                            <i class="ri-folder-line"></i>
                        </div>
                    </div>
                    <div class="media-body overflow-hidden d-flex justify-content-between align-items-center">
                        <span class="text-truncate font-size-15 mb-1">
                            ${folder.name} 
                        </span>

                        <span class="folder-actions font-size-12 d-block d-md-none pe-3">
                            <button class="btn btn-sm btn-outline-light folder-action-btn" onclick="renameFolder('${folder.uuid}')" data-folder-name="${folder.name}">
                                <i class="ri-text"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-light folder-action-btn" onclick="deleteFolder('${folder.uuid}')">
                                <i class="ri-delete-bin-7-line"></i>
                            </button>
                        </span>

                    </div>
                </div>
            </div>
            `;
    });

    $('#folders').html(folders);
}

const fetchFolders = async () => {

    let res = await _request("/efax/folders");

    if (res.data) {
        return res.data;
    }
    return [];

}


$('#renameFolderForm').submit(async function (e) {

    e.preventDefault();

    let data = {
        uuid: $(this).find('[name="uuid"]').val(),
        name: $(this).find('[name="name"]').val()
    }

    let res = await _request("/efax/renamefolder", "POST", data);

    if (!res.error) {
        toast(res.msg);
        loadFolders();
        $('#renameFolder').modal('hide');
        //clear input
        $(this).find('[name="name"]').val('');
        $(this).find('[name="uuid"]').val('');
    } else {
        toast('Something went wrong', 'danger');
    }

});


const renameFolder = async (uuid) => {

    //show rename folder modal
    $('#renameFolder').modal('show');

    let folderName = $(`[onclick="renameFolder('${uuid}')"]`).data('folder-name');

    //set folder name
    $('#renameFolderForm').find('[name="name"]').val(folderName.trim());

    //find name="uuid" and set attribute value to uuid
    $('#renameFolderForm').find('[name="uuid"]').val(uuid);

}

const deleteFolder = async (uuid) => {
    let res = await _request("/efax/deletefolder", "POST", {
        uuid: uuid
    });
    if (!res.error) {
        toast(res.msg);
        //refresh page
        fetchData();
        loadFolders();

    } else {
        toast('Something went wrong', 'danger');
    }
}

//on ready
$(document).ready(function () {
    fetchData();
    loadFolders();
});

async function action(fax_file_uuid, action) {

    let res = await _request("/efax/action", "POST", {
        uuid: fax_file_uuid,
        action: action
    });

    if (!res.error) {
        toast(res.msg);
        fetchData();
    } else {
        toast('Something went wrong', 'danger');
    }

}

//create folder
$('#createFolderForm').submit(async function (e) {

    e.preventDefault();

    let data = {
        name: $(this).find('[name="name"]').val()
    }

    let res = await _request("/efax/createfolder", "POST", data);

    if (!res.error) {
        toast(res.msg);
        loadFolders();
        $('#createFolder').modal('hide');
        //clear input
        $(this).find('[name="name"]').val('');
    } else {
        toast('Something went wrong', 'danger');
    }

});

//moveToFolder on click

const moveToFolder = async (uuid) => {
    //show rename folder modal
    $('#moveToFolder').modal('show');
    //find name="uuid" and set attribute value to uuid
    $('#moveToFolderForm').find('[name="uuid"]').val(uuid);

    const data = await fetchFolders();

    //set options
    $('#moveToFolderForm').find('[name="folder_uuid"]').html(`
        <option value="0">Select Folder</option>
        ${data.map(folder => `<option value="${folder.uuid}">${folder.name}</option>`)}
    `);
}


//moveToFolderForm on submit
$('#moveToFolderForm').submit(async function (e) {

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
        fetchData();
    } else {
        toast('Something went wrong', 'danger');
    }
});

//.menu-icon on toggle
$('.menu-icon').on('click', function () {
    $('#sideBar').toggleClass('show');
    $('.inner-bar').toggleClass('bg-disable');
});

//if not clicked in sideBar close it
$(document).on('click', function (e) {
    if (!$(e.target).closest('#sideBar').length && !$(e.target).closest('.menu-icon').length) {
        $('#sideBar').removeClass('show');
        $('.inner-bar').removeClass('bg-disable');
    }
});

//on click modal data-bs-target="#exampleModal"
$(document).on('click', '[data-bs-target="#exampleModal"]', function () {

    //show modal
    $('#canvas-loader').show();

    let file = $(this).data('modal-file');
    let title = $(this).data('modal-title');

    //set title
    $('#exampleModalLabel').html(title);



    $('#canvas').html('');

    Tiff.initialize({
        TOTAL_MEMORY: 16777216 * 10
    });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
        var buffer = xhr.response;
        var tiff = new Tiff({
            buffer: buffer
        });
        for (var i = 0, len = tiff.countDirectory(); i < len; ++i) {
            tiff.setDirectory(i);
            var canvas = tiff.toCanvas();
            canvas.style.width = '100%';

            //hide loader
            $('#canvas-loader').hide();
            $('#canvas').append(canvas);
        }
    };

    xhr.send();

    $('#exampleModal').modal('show');

});
