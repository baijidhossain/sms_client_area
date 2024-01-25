function selectPhoneComponent() {
    //if window.state.selectedThreadInfo.participants is empty then return
    if (!window.state.selectedThreadInfo.participants?.length) {
        return "";
    }

    const authPhonesArray = window.state.selectedThreadInfo.participants.filter(
        (participant) => {
            return activeServicesByType[service_type].find(
                (service) => service.phone_id === participant.phone_id
            );
        }
    );

    //if authPhonesArray items are same
    if (
        authPhonesArray.every((val, i, arr) => val.phone_id === arr[0].phone_id)
    ) {
        return "";
    }

    //if authPhonesArray is empty then return
    if (authPhonesArray.length < 2) {
        return "";
    }

    return `<div class="dropup end-0 position-absolute top-0">
                <button type="button" class="btn dropdown-toggle font-size-16 px-2 waves-effect waves-light text-primary" data-bs-toggle="dropdown">
                    <i class="ri-cellphone-fill"></i> <span data-selected-number>${authPhonesArray[0].number.slice(
        -4
    )}</span>
                </button>

                <input type="hidden" data-phone-id name="phone_id" value="${authPhonesArray[0].phone_id
        }">

                <ul class="dropdown-menu dropdown-menu-end mb-2 rounded-3">
                    ${authPhonesArray
            .map(
                (phone, index) => `
                    <li class="px-2" data-select-phone-id="${phone.phone_id
                    }" data-number="${phone.number}">
                        <a class="align-items-center d-flex dropdown-item px-2 rounded-3 text-end" href="#">
                            <span class="d-grid">
                                <span class="fw-bolder">
                                    Phone ${index + 1}
                                </span>
                                ${formatPhoneNumber(
                        phone.number,
                        phone.format_template
                    )}
                            </span>
                            <span class="align-items-center avatar-xs bg-primary-subtle d-flex justify-content-center ms-2 rounded-3 text-primary">
                                <i class="ri-cellphone-line"></i>
                            </span>
                        </a>
                    </li>
                    
                    `
            )
            .join("")}
                </ul>
        </div>`;
}

function attachmentComponent() {
    let serviceAttachmentTypes = attachmentTypes[service_type];

    return `
            <div class="dropup" reef-ignore>

                <button type="button" class="btn dropdown-toggle font-size-16 px-2 p-0 text-primary me-2" data-bs-toggle="dropdown" id="attachmentn-btn">
                    <i class="ri-add-line fs-3"></i>
                </button>

                <ul class="dropdown-menu dropdown-menu-end mb-2 rounded-3">
                    ${serviceAttachmentTypes
            .map(
                (attachment) => `
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
                    `
            )
            .join("")}
                </ul>
            </div>
         `;
}

// Threads List template
function threadsListTemplate() {
    if (window.state.filteredThreads !== null) {
        if (
            window.state.searchQuery.length &&
            window.state.filteredThreads.length === 0
        ) {
            return `<div class="list-unstyled chat-list chat-user-list text-center" id="empty-search"><p class="text-muted my-5">No results found</p></div>`;
        }

        return `${window.state.filteredThreads
            .map(function (thread, index) {
                let threadName =
                    formatPhoneNumber(window.state.filteredThreads[index].name, window.state.filteredThreads[index].format_template)
                    ??
                    generateThreadName(thread);

          

                return `<li class="thread ${window.state.selectedThreadId == thread.thread_id ? "active" : ""
                    }" id="thread_${thread.thread_id}">
                    <a data-threadid="${thread.thread_id
                    }" style="cursor: pointer;">
                        <div class="align-items-center media">
                            <div class="chat-user-img align-self-center me-3 ms-0">
                                <div class="avatar-xs">
                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        <i class="ri-user-3-line"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="media-body overflow-hidden">                                
                                <h5 class="text-truncate font-size-15 mb-0">${threadName}</h5>
                            </div>            
                        </div>
                    </a>
                </li>`;
            })
            .join("")}`;
    }

    const threads =
        window.state.phoneData.selected !== 0
            ? window.state.phoneData.threads[window.state.phoneData.selected]
                ?.items ?? []
            : window.state.threads.items;

    if (!threads || threads.length === 0) {
        return `<div class="no-leatest-message text-center">
                        <div class="icon" style="font-size: 40px; color: #ccc;"><i class="ri-chat-3-line"></i></div>
                        <p class="text-muted">Once you start a new conversation<br> you'll see it listed here</p>
                </div>`;
    }

    return `${threads
        .map(function (thread, index) {
            let unreadBadge =
                thread.unread > 0
                    ? `<span class="badge badge-soft-danger rounded-pill">${thread.unread}</span>`
                    : "";

            let threadName = threads[index]?.name ?? generateThreadName(thread);

            let lastActivity;

            switch (UTCToLocalDate(thread.last_activity, "_d_d")) {
                case "Today":
                    lastActivity = UTCToLocalDate(thread.last_activity, "h:i A");
                    break;
                case "Yesterday":
                    lastActivity = UTCToLocalDate(thread.last_activity, "_d_d");
                    break;
                default:
                    lastActivity = UTCToLocalDate(thread.last_activity, "d/m/Y");
            }

            //if (threads[index]?.name == null) threads[index].name = threadName;

            return `<li class="thread ${window.state.selectedThreadId == thread.thread_id ? "active" : ""
                }" id="thread_${thread.thread_id}">
                    <a data-threadid="${thread.thread_id
                }" style="cursor: pointer;">
                        <div class="media">

                            <div class="chat-user-img align-self-center me-3 ms-0">
                                <div class="avatar-xs">
                                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        <i class="${thread.type == "group"
                    ? "ri-group-line"
                    : "ri-user-3-line"
                }"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="media-body overflow-hidden">
                                <h5 class="text-truncate font-size-15 mb-1">${threadName}</h5>
                                <p class="chat-user-message text-truncate mb-0 ${thread.unread ? "text-dark fw-bold" : ""
                }">
                                    ${thread.is_deleted
                    ? `<i class="ri-prohibited-line"></i> Message deleted!</span>`
                    : !thread.has_attachment
                        ? thread.content
                        : `<i class="ri-attachment-line"></i> Attachment`
                }
                                </p>                                    
                            </div>

                            <div class="font-size-11">${lastActivity}</div>
                            <div class="unread-message">
                            ${unreadBadge}
                            </div>
                        </div>
                    </a>
                </li>`;
        })
        .join("")}`;
}

// Thread Conversation template
function conversationTemplate() {
    //const messages = window.state.messages.find(message => message.thread.id == window.state.selectedThreadId);
    const messages =
        window.state.selectedThreadId == 0
            ? []
            : window.state.messages[window.state.selectedThreadId];

    // Group messages by date
    const groupedMessages = {};

    if (window.state.selectedThreadId != 0) {
        messages?.items.forEach((message) => {
            //const convertedDate = UTCToLocalDate(message.created);

            const date = UTCToLocalDate(message.created, "Y-m-d");

            if (!groupedMessages[date]) {
                groupedMessages[date] = [];
            }
            groupedMessages[date].push(message);
        });
    }

    //Create chat interface
    const sortedDates = Object.keys(groupedMessages).sort().reverse();

    let html = "";

    sortedDates.forEach((date) => {
        const messages = groupedMessages[date];

        messages.forEach((message) => {
            if (message.type == 'system') {
                html += `<li>
            <div class="text-center text-muted mb-4" style="max-width: 60%;word-wrap: break-word; margin: 0 auto;">
                <small class="text-muted">${message.content}</small>
            </div>
            </li>`;
            } else {
                html += messageItemTemplate(message);
            }

        });

        let lastMessageCreated = messages[messages.length - 1].created;

        switch (UTCToLocalDate(lastMessageCreated, "_d_d")) {
            case "Today":
                lastMessageCreated = UTCToLocalDate(lastMessageCreated, "_d_d");
                break;
            case "Yesterday":
                lastMessageCreated = UTCToLocalDate(lastMessageCreated, "_d_d");
                break;
            default:
                lastMessageCreated = UTCToLocalDate(lastMessageCreated, "M d, Y");
        }

        html +=
            '<li><div class="chat-day-title"><span class="title">' +
            lastMessageCreated +
            "</span></div></li>";
    });

    return html;
}

// Thread header template
function conversationHeadTemplate() {
    let threadName =
        window.state.selectedThreadInfo.name ??
        generateThreadName(window.state.selectedThreadInfo);

    let myNumber =
        window.state.selectedThreadInfo.type == "single"
            ? window.state.selectedThreadInfo.participants?.find((participant) => {
                return activeServicesByType[service_type].find(
                    (service) => service.phone_id === participant.phone_id
                );
            })?.number
            : "";

    let recipients = window.state.selectedThreadInfo.participants;

    let allRecipients = recipients == undefined ? [] : recipients;

    allRecipients = allRecipients.filter((participant) => {
        return !activeServicesByType[service_type].find(
            (service) => service.phone_id === participant.phone_id
        );
    });


    allRecipients = allRecipients.length == 0 ? recipients : allRecipients;

    let addToContact = allRecipients?.find((participant) => {
        return participant.contact_id === 0 && window.state.selectedThreadInfo.type === 'single';
    });

    return window.state.selectedThreadId != 0
        ? `<div class="row align-items-center">
            <div class="col">
                <div class="d-flex align-items-center">
                    <div class="d-block d-lg-none me-2 ms-0">
                        <a href="#" class="user-chat-remove text-muted font-size-16 p-2"><i class="ri-arrow-left-s-line"></i></a>
                    </div>
                    <div class="me-3 ms-0">

                        <div class="avatar-xs rounded-circle">
                            <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                <i class="${window.state.selectedThreadInfo.type ==
            "group"
            ? "ri-group-line"
            : "ri-user-3-line"
        }"></i>
                            </span>
                        </div>
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                        <div class="d-flex">
                        <h5 class="font-size-16 mb-0 text-truncate me-2">
                            <a href="#" class="text-reset user-profile-show user-profile-number">${threadName}</a>
                        </h5>
                        ${addToContact ? `<i class="ri-user-add-line cursor-pointer" id="addContact" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Add Contact" data-bs-original-title="Add Contact" data-add-contact="${formatPhoneNumber(addToContact.number, addToContact.format_template)}"></i>` : ''}

                       </div>

                    </div>
                </div>
            </div>
            <div class="col">
                <ul class="list-inline user-chat-nav text-end mb-0 d-flex justify-content-end">
                    <li class="align-items-center d-flex justify-content-end list-inline-item">

                        <h5 class="font-size-16 mb-0 text-truncate d-none d-sm-block">
                            <span class="text-reset user-profile-number">${myNumber}</span>                            
                        </h5>
                        
                        <button class="btn nav-btn user-profile-show text-primary" type="button">
                            <i class="ri-information-fill"></i>
                        </button>

        
                        
                    </li>

                    <li class="list-inline-item">
                    <div class="dropdown" reef-ignore>
                        <button class="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-fill"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end" style="">
                            <button class="dropdown-item" id="threadArchive">Archive <i class="ri-archive-line float-end text-muted"></i></button>
                            <button class="dropdown-item deleteConversation" id="threadDelete">Delete <i class="ri-delete-bin-line float-end text-muted"></i></button>
                        </div>
                    </div>
                </li>

                </ul>
            </div>
        </div>`
        : "";
}

// message history template
function messageItemTemplate(msg) {
    let status = "";

    switch (msg.status) {
        case "Delivered":
            status = `<i class='ri-check-double-line' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Sent'></i></i>`;
            break;

        case "Pending":
        case "Processing":
            status = `<i class='ri-check-line' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Processing'></i></i>`;
            break;

        case "Failed":
            status = `<i class='text-danger ri-error-warning-fill' key='${msg.id}' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Failed to process'></i>`;
            break;

        default:
            break;
    }
    return `<li class="${msg.is_sender ? "right" : "left"}" id="msg_${msg.id}" key="${msg.id}">
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

                                ${!msg.is_deleted && msg.attachments.length > 0
            ? messageAttachmentTemplate(msg.attachments)
            : ""
        }

                                <p class="mb-0 chat-content text-break ">${!msg.is_deleted
            ? msg.content
            : `<span class='fst-italic mb-0 ${msg.is_sender
                ? "text-muted"
                : "text-white-50"
            } '><i class='ri-prohibited-line'></i> Message deleted!</span>`
        }</p>
                                <p class="chat-time mb-0">
                                    <span class="align-middle">${msg.is_sender ? status : ""
        }  ${UTCToLocalDate(
            msg.created,
            "h:i A"
        )}</span>
                                </p>
                            </div>

                           ${!msg.is_deleted
            ? `<div class="dropdown align-self-start">
                                <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                   <i class="ri-more-2-fill"></i>
                                </a>
                                <div class="dropdown-menu">
                                    ${msg.content
                ? `<button class="dropdown-item copy-btn">Copy <i class="ri-file-copy-line float-end text-muted"></i></button>`
                : ""
            }
                                    <button class="dropdown-item" data-msgId="${msg.id
            }" id="messageDelete">Delete <i class="ri-delete-bin-line float-end text-muted"></i></button>
                                </div>
                            </div>`
            : ""
        }

                        </div>
                        
                        ${window.state.selectedThreadInfo.type == "group"
            ? `<div class="conversation-name">${msg.sender}</div>`
            : ""
        }

                    </div>
                </div>
            </li>`;
}

// message attachment template
function messageAttachmentTemplate(attachments) {
    if (attachments.length === 0) {
        return "";
    }
    return `<ul class="list-inline message-img  mb-0">
                ${attachments
            .map(
                (attachment) =>
                    `<li class="list-inline-item message-img-list mb-2">
                    <div>
                        ${attachmentTypeTemplate(attachment)}
                    </div>
                    <div class="message-img-link">
                        <ul class="list-inline mb-0">
                            <li class="list-inline-item">
                                <a href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token
                    }/${attachment.id}/${attachment.file_name
                    }?download=true" download="${attachment.file_name
                    }"><i class="ri-download-2-line"></i></a>
                            </li>
                        </ul>
                    </div>
                </li>`
            )
            .join("")}
            </ul>`;
}

function attachmentTypeTemplate(attachment) {
    var parts = attachment.file_name.split(".");

    var ext = parts[parts.length - 1].toLowerCase();

    if (ext == "pdf") {
        return `
                  
                        <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px">
                            <i class="ri-file-pdf-line"></i>
                            <small class="fs-6">
                            ${showFileName(attachment.file_name)}
                            </small>                           
                        </div>
                  
                    `;
    } else if (ext == "doc" || ext == "docx") {
        return `
                   
                        <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px">
                            <i class="ri-file-word-line"></i>
                        </div>
                   
                    `;
    } else if (ext == "xls" || ext == "xlsx") {
        return `
                   
                        <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px">
                            <i class="ri-file-excel-line"></i>
                            <small class="fs-6">
                                ${showFileName(attachment.file_name)}
                                            </small>  
                        </div>
                 
                    
                    `;
    } else if (ext == "mp4") {
        return `
                    <a class="popup-vid d-inline-block m-1" title="${attachment.file_name
            }" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token
            }/${attachment.id}/${attachment.file_name}">
                        <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3" style="height: 150px; width: 150px">
                            <i class="ri-file-video-line"></i>
                            <small class="fs-6">
                            ${showFileName(attachment.file_name)}
                                            </small>  
                        </div>
                    </a>
                    
                    `;
    } else if (ext == "jpg" || ext == "jpeg" || ext == "png") {
        return `
                    <a class="popup-img d-inline-block m-1" title="${attachment.file_name
            }" href="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token
            }/${attachment.id}/${attachment.file_name}">
                        <img src="${atob(window.ipbxapi_host)}/storage/${localStorage.auth_token
            }/${attachment.id}/${attachment.file_name
            }" class="rounded border object-fit-cover" alt="${attachment.file_name
            }" style="height: 150px; width: 150px">
                    </a>
                    `;
    } else {
        return `
                    
                        <div class="align-items-center bg-body-tertiary d-flex flex-column fs-1 justify-content-center rounded-3 text-body" style="height: 150px; width: 150px">
                            <i class="ri-file-line"></i>
                            <small class="fs-6">
                                                ${showFileName(
            attachment.file_name
        )}
                                                
                                            </small>  
                        </div>
                                     
                    `;
    }
}

//phone number template
function phoneNumberTemplate() {
    let services = activeServicesByType[service_type] ?? [];

    if (services.length > 1) {
        return `<select id="threadsPhone" class="bg-dark-subtle form-select form-select-sm me-2" style="width: auto; background-position: right 0.35rem center;">
             <option value="0">All Numbers</option>
             ${services
                .map(
                    (service) =>
                        `<option ${service.phone_id == window.state.phoneData.selected
                            ? "selected"
                            : ""
                        } value="${service.phone_id}">${service.number}</option>`
                )
                .join("")}
         </select>`;
    }

    return services[0]
        ? '<div class="me-2 p-1 rounded-2">' + services[0]?.number + "</div>"
        : "";
}

function ConversationNumberTemplate() {
    const selectedPhone = window.state.phoneData.selected;

    let services = activeServicesByType[service_type] ?? [];

    if (services.length > 1) {
        return `<label for="recipient-name" class="col-form-label">Sender</label>
          <select class="bg-dark-subtle form-select mb-3" name="phone_id" required>
             ${services
                .map(
                    (service) => `<option value="${service.phone_id}" @selected=${service.phone_id == selectedPhone ? true : false || service.is_primary == 1 ? true : false}>${service.number}</option>`
                )
                .join("")}
         </select>`;
    }

    return "";
}

function participantSidebarTemplate() {
    let threadName =
        window.state.selectedThreadInfo.name ??
        generateThreadName(window.state.selectedThreadInfo);

    let recipients = window.state.selectedThreadInfo.participants;

    let allRecipients = recipients == undefined ? [] : recipients;

    allRecipients = allRecipients.filter((participant) => {
        return !activeServicesByType[service_type].find((service) => service.phone_id == participant.phone_id);
    });

    allRecipients = allRecipients.length == 0 ? [] : allRecipients;
 
    let recipients_contact = allRecipients?.find((participant) => {
        return participant.contact_id !== 0 && window.state.selectedThreadInfo.type === 'single';
    });

    let contact_info = window.appState.contacts.find(contact => contact.id == recipients_contact?.contact_id);

    return window.state.selectedThreadId != 0
        ? `<div class="user-profile-sidebar ${window.appState.components.sidebarOpen == true ? "d-block" : "d-none"
        }" id="user-profile-sidebar">
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
                                <i class="${window.state.selectedThreadInfo.type ==
            "group"
            ? "ri-group-line"
            : "ri-user-3-line"
        }"></i>
                            </span>
                        </div>
                    </div>

                    

                    <h5 class="font-size-16 mb-1">${threadName}</h5>

                    ${getContact(
            window.state.selectedThreadInfo.participants[0]
                .contact_id
        )
            ? `<p class="font-size-14 mb-1 text-truncate">${formatPhoneNumber(
                window.state.selectedThreadInfo.participants[0]
                    .number,
                window.state.selectedThreadInfo.participants[0]
                    .format_template
            )}</p>`
            : ""
        }

                </div>
                <!-- End profile user -->

                <!-- Start user-profile-desc -->
                
                <div class="p-4 user-profile-desc" data-simplebar style="overflow: hidden scroll;">
                
                    <div class="accordion" id="receipients">

                    ${window.state.selectedThreadInfo.type === 'group' || contact_info ?
            `<div class="accordion-item card border mb-2">
                    <div class="accordion-header" id="about2">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#about" aria-expanded="true" aria-controls="about">
                            <h5 class="font-size-14 m-0">
                                <i class="ri-user-2-line me-2 ms-0 ms-0 align-middle d-inline-block"></i> About
                            </h5>
                        </button>
                    </div>
                    <div id="about" class="accordion-collapse collapse show" aria-labelledby="about2" data-bs-parent="#tabprofile">
            
                    ${contact_info ? `<div class="accordion-body">
                        <div class="float-end">
                        <button type="button" class="btn btn-light btn-sm" data-edit-contact="${contact_info.id}" key="${contact_info.id}"><i class="ri-edit-fill me-1 ms-0 align-middle"></i> Edit</button>
                        </div>
                        <div>
                        <p class="text-muted mb-1">Name</p>
                        <h5 class="font-size-14 user_name">${contact_info.name ? contact_info.name : `<small class="fst-italic text-secondary">N/A</small>`}</h5>
                        </div>
                
                        <div class="mt-4">
                        <p class="text-muted mb-1">Email</p>
                        <h5 class="font-size-14 user_email">${contact_info.email ? contact_info.email : `<small class="fst-italic text-secondary">N/A</small>`}</h5>
                        </div>
                
                        <div class="mt-4">
                        <p class="text-muted mb-1">Created</p>
                        <h5 class="font-size-14 user_time">${contact_info.created ? UTCToLocalDate(contact_info.created, "M d, Y h:i A") : `<small class="fst-italic text-secondary">N/A</small>`}</h5>
                        </div>
                        </div>` : ''}

                        ${window.state.selectedThreadInfo.type == 'group' ? `
                        <form class="accordion-body group_receiverData" id="groupNameForm">
                        <div class="float-end">
                            <button type="button" class="btn btn-light btn-sm" id="group_edit"><i class="ri-edit-fill me-1 ms-0 align-middle"></i> Edit</button>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Name</p>
                            <h5 class="font-size-14 receiver_name" id="receiver_name">${threadName}</h5>
                            <div id="edit-group-name" class="d-flex justify-content-between visually-hidden">
                            <input type="text" name="name" id="receiverInputname" class="form-control bg-soft-light border-light">
                            <div class="float-right">
                                <button type="submit" id="receiverSave" class="btn btn-primary btn-block waves-effect waves-light" style="display: block;">
                                Save</button>
                            </div>
                            </div>
                        </div>
                       </form>
                        ` : ''}
                    </div>
                </div>`
            : ''}


                        <div class="accordion-item card border">
                            <div class="accordion-header" id="attachfile3">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#receipient-list" aria-expanded="true" aria-controls="receipient-list">
                                    <h5 class="font-size-14 m-0">
                                        <i class="ri-group-line"></i> Recipients
                                    </h5>
                                </button>
                            </div>
                            <div id="receipient-list" class="accordion-collapse collapse show" aria-labelledby="attachfile3" data-bs-parent="#receipients">
                                <div class="accordion-body">

                                    <ul class="list-unstyled chat-list group_list online_contactList">

                                        <li>
                                          <a class="border-top-0 add-participant cursor-pointer">
                                            <div class="d-flex align-items-center">
                                                <div class="chat-user-img me-3 ms-0">
                                                <div class="avatar-xs">

                                                <span class="avatar-title bg-primary-subtle rounded-circle text-primary">
                                                    <i class="ri-add-line"></i>
                                                </span>

                                                </div>
                                                </div>

                                                <div class="flex-grow-1 overflow-hidden">
                                                    <h5 class="font-size-14 mb-0">Add Participants</h5>
                                                </div>

                                                </div>
                                            </a>
                                        </li>
                                   

                                ${allRecipients.map((participant, key) => `                   
                                    <li key="${participant.number}">
                                            <a href="javascript:void(0);" class="${key == 0 ? "border-top-0" : ""}">
                                                <div class="d-flex align-items-center">
                                                    <div class="chat-user-img me-3 ms-0">
                                                        <div class="avatar-xs">
                                                            <span class="avatar-title bg-primary-subtle rounded-circle text-primary">
                                                                <i class="ri-user-3-line"></i>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div class="flex-grow-1 overflow-hidden">
                                                        <h5 class="font-size-14 mb-0 text-truncate">${getContact(participant.contact_id) ? getContact(participant.contact_id).name : formatPhoneNumber(participant.number, participant.format_template)}</h5>
                                                            
                                                        ${getContact(participant.contact_id)
                                                            ? `<small class="font-size-12">${formatPhoneNumber(
                                                                participant.number,
                                                                participant.format_template
                                                            )}</small>` : ""}
                                                    </div>

                                                    ${getContact(participant.contact_id) == null
                                                        ? `<i class="ri-user-add-line cursor-pointer" id="addContact" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Add Contact" data-bs-original-title="Add Contact" data-add-contact="${formatPhoneNumber(
                                                            participant.number,
                                                            participant.format_template
                                                        )}"></i>` :  ""
                                                    }

                                                    <div class="dropdown">
                                                        <div class="ms-2 text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="cursor: pointer">
                                                            <i class="ri-more-2-fill"></i>
                                                        </div>
                                                        <div class="dropdown-menu dropdown-menu-end">
                                                            <button class="dropdown-item" data-ParticipantNumber="${participant.number}" id="remove-participant-btn">Remove <i class="ri-delete-bin-line float-end text-muted"></i></button>
                                                        </div>
                                                   </div>

                                                    </div>
                                                </a>
                                               
                                            </li>`
                                         ).join("")}
                                    </ul>



                                </div>
                            </div>
                        </div>
                        <!-- end profile-user-accordion -->
                    </div>
                    <!-- end user-profile-desc -->
                </div>

            </div>`
        : "";
}
