
function sideMenuServiceListTemplate() {

    const menuItems = [{
        label: 'Home',
        iconClass: 'ri-home-line',
        href: '/',
        service: '',
        count: 0,
    },
    {
        label: 'SMS',
        iconClass: 'ri-message-3-line',
        href: '/messages',
        service: 'sms',
        count: window.appState.sms.threads.items.reduce((count, sms) => count + (sms.unread > 0 ? sms.unread : 0), 0)
    },
    {
        label: 'WhatsApp',
        iconClass: 'ri-whatsapp-line',
        href: '/whatsapp',
        service: 'whatsapp',
        count: window.appState.whatsapp.threads.items.reduce((count, sms) => count + (sms.unread > 0 ? sms.unread : 0), 0)
    },
    {
        label: 'E-Fax',
        iconClass: 'ri-printer-line',
        href: '/efax',
        service: 'efax',
        count: window.appState.efax.fax.Inbox.items.filter(fax => !fax.is_viewed).length
    },
    {
        label: 'Call History',
        iconClass: 'ri-history-line',
        href: '/call-history',
        service: 'voice',
    },
    ];

    return menuItems.map(item => {

        if (item.service !== '' && !activeServicesByType.hasOwnProperty(item.service)) {
            return;
        }

        var currentUrl = window.location.href;

        // Remove the protocol and domain part
        var currentPath = currentUrl.split("/").slice(3);

        // Replace empty strings with "/"
        currentPath = currentPath.map(function (segment) {
            return segment === "" ? "/" : segment;
        });


        return `
                <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="${item.label}" data-bs-original-title="${item.label}" role="presentation">
                    <a class="nav-link border ${item.count > 0 ? 'position-relative' : ''} ${(service_type == item.service) ? 'active' : ''}" href="${item.href}">
                        <i class="${item.iconClass}"></i>
                        ${item.count > 0 ? `<span class="position-absolute top-0 start-100 translate-middle badge font-size-10 rounded-pill bg-danger">${item.count}</span>` : ''}
                    </a>
                </li>
                `;

    }).join('');
}


const dynamicModalComponent = (data) => {

    const {
        header,
        body,
        footer
    } = data;

    return `

            <div class="modal-header">
                    ${header}                        
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body p-0">${body}</div>

            ${footer ? `

            <div class="modal-footer">
                ${footer}
            </div>
                
            ` : ''}
           
        `;
}

const modalSpinner = `
    <div class="spinner" id="modal-spinner">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `;

