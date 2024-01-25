
const service_type = window.ipbxapi_serviceType ? window.ipbxapi_serviceType : '';

const APIS = {
    'DASHBOARD' : '/dashboard',
    'THREAD_LIST': '/threads/list/' + service_type,
    'THREAD_CONVERSATIONS': '/threads/' + service_type,
    'THREAD_SEARCH': '/threads/search/' + service_type,
    'THREAD_CREATE': '/threads/create/' + service_type,
    'THREAD_DELETE': '/threads/action/' + service_type + '/delete',
    'THREAD_ARCHIVE': '/threads/action/' + service_type + '/archive',
    'THREAD_ADD_PARTICIPANT': '/threads/addparticipant/' + service_type,
    'THREAD_REMOVE_PARTICIPANT': '/threads/removeparticipant/' + service_type,
    'REPLY_MESSAGE': '/threads/reply/' + service_type,
    'LATEST_MESSAGE': '/threads/latest',
    'READ_MESSAGE': '/threads/ReadMessage/' + service_type,
    'MESSAGE_DELETE': '/threads/message/' + service_type + '/delete',
    'CONTACT_CREATE': '/contacts/add',
    'CONTACT_LIST': '/contacts',
    'CONTACT_DELETE': '/contacts/delete',
    'CONTACT_UPDATE': '/contacts/update',
    'CONTACT_IMPORT': '/contacts/import',
    'CONTACT_MSG': '/contacts/send',
    'CONTACT_GROUP_CREATE': '/contacts/addgroup',
    'CONTACT_GROUP_DELETE': '/contacts/deletegroup',
    'CONTACT_GROUP_UPDATE': '/contacts/updategroup',
    'GROUP_NAME_UPDATE': '/threads/UpdateGroupName/' + service_type,
    'PHONE_TYPES': '/contacts/phonetypes',
    'CALL_DETAIL_RECORDS': '/callrecords',
    'CALL_RECORDINGS': '/callrecords/recordings',
    'EFAX': '/efax',
    'EFAX_SEND': '/efax/send',
    'EFAX_ACTION': '/efax/action',
    'EFAX_RENAME_FOLDER': '/efax/renamefolder',
    'EFAX_CREATE_FOLDER': '/efax/createfolder',
    'EFAX_CHANGE_FOLDER': '/efax/changefolder',
    'EFAX_MOVE_TO_FOLDER': '/efax/movetofolder',
    'EFAX_DELETE_FOLDER': '/efax/deletefolder',
    'EFAX_SETTINGS': '/efax/settings',
    'EFAX_STORAGE': '/efax/storage/',
    'SERVICE_SETTINGS': '/service/setting/efax',
    'PROFILE': '/user/profile',
    'CHANGE_PASSWORD': '/user/password',
    'UPDATE_PRIMARY_SERVICE': '/user/UpdatePrimaryService',
    'PUSH_NOTIFICATION': '/user/Notification',    
    'LOGIN': '/user/login',
    'LOGOUT': '/user/logout',
};

const efaxPage = {
    Inbox: 'Inbox',
    Sent: 'Sent',
    Archived: 'Archived',
    Queued: 'Queued',
    Logs: 'Logs',
};

const services = localStorage.user ? JSON.parse(localStorage.user).services : {};

const activeServicesByType = {};

for (const [serviceType, serviceList] of Object.entries(services)) {
    const activeServices = serviceList.filter(service => service.status === 'Active');
    if (activeServices.length > 0) {
        activeServicesByType[serviceType] = activeServices;
    }
}

var body = $("body")[0];

//if local storage has theme set then set it
if (localStorage.getItem('theme')) {
    $(body).attr("data-bs-theme", localStorage.getItem('theme'));
}

// utility functions

function detectScrollToOffset(selector, offset, direction, callback) {
    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Element not found for selector: ${selector}`);
        return;
    }

    let inOffsetRange = false;
    let previousScrollTop = element.scrollTop;

    element.addEventListener('scroll', () => {

        const distanceFromBottom = element.scrollHeight - (element.scrollTop + element.clientHeight);

        if (direction === 'bottom') {
            if (distanceFromBottom <= offset && element.scrollTop > previousScrollTop) {
                if (!inOffsetRange) {
                    inOffsetRange = true;
                    callback();
                }
            } else {
                inOffsetRange = false;
            }
        } else if (direction === 'top') {

            if (element.scrollTop <= offset && element.scrollTop < previousScrollTop) {
                if (!inOffsetRange) {
                    inOffsetRange = true;
                    callback();
                }
            } else {
                inOffsetRange = false;
            }
        }

        previousScrollTop = element.scrollTop;
    });
}


function ScrollTrigger(selector, offset, callback) {
    var element = document.querySelector(selector);
    let trigger = true;

    if (!element) {
        console.error(`Element not found for selector: ${selector}`);
        return;
    }

    element.addEventListener('scroll', () => {
        var elementHeight = element.scrollHeight;
        var currentPosition = element.clientHeight - Math.floor(element.scrollTop);
        currentPosition = currentPosition - elementHeight;
        currentPosition = Math.abs(currentPosition);
        if (currentPosition < offset) {
            if (trigger) {
                trigger = false;
                callback();
                //console.log('loading more messages.');
            }
        } else {
            trigger = true;
        }
    });
}

//  Scrolls to the bottom of the message body.
function scrollToBottomMessage(offsetHeight = 0) {
    let simpleBar = $("#messageBody .simplebar-content-wrapper");

    if (!offsetHeight) {
        offsetHeight = $("#messages__history")[0] ? $("#messages__history")[0].scrollHeight - $(window).innerHeight() + 250 : 0;
    }

    if (simpleBar && offsetHeight) {
        simpleBar.scrollTop(offsetHeight);
    }
}

function UTCToLocalDate(input, format) {

    const utcDate = typeof input === 'string' ? new Date(input) : new Date(input * 1000);

    if (isNaN(utcDate)) {
        return 'Invalid date input';
    }

    const localDate = typeof input === 'string' ? new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000) : utcDate;


    const formattedDate = format.replace(/(d|D|F|m|M|Y|a|A|h|H|i|s|_d_d)/g, (match) => {
        switch (match) {
            case 'd':
                return localDate.getDate().toString().padStart(2, '0');
            case 'D':
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return daysOfWeek[localDate.getDay()];
            case 'F':
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return months[localDate.getMonth()];
            case 'm':
                return (localDate.getMonth() + 1).toString().padStart(2, '0');
            case 'M':
                const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return shortMonths[localDate.getMonth()];
            case 'Y':
                return localDate.getFullYear();
            case 'a':
                return localDate.getHours() < 12 ? 'am' : 'pm';
            case 'A':
                return localDate.getHours() < 12 ? 'AM' : 'PM';
            case 'h':
                const hour12 = localDate.getHours() % 12 || 12;
                return hour12.toString().padStart(2, '0');
            case 'H':
                return localDate.getHours().toString().padStart(2, '0');
            case 'i':
                return localDate.getMinutes().toString().padStart(2, '0');
            case 's':
                return localDate.getSeconds().toString().padStart(2, '0');
            case '_d_d':
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                const date = localDate.getDate();
                if (
                    date === today.getDate() &&
                    localDate.getMonth() === today.getMonth() &&
                    localDate.getFullYear() === today.getFullYear()
                ) {
                    return 'Today';
                } else if (
                    date === yesterday.getDate() &&
                    localDate.getMonth() === yesterday.getMonth() &&
                    localDate.getFullYear() === yesterday.getFullYear()
                ) {
                    return 'Yesterday';
                }
                return UTCToLocalDate(input, "M d, Y");
            default:
                return match;
        }
    });

    return formattedDate;
}

// Function to handle API requests with a delay
async function poolWithDelay(interval, callback) {
    while (true) {
        try {
            if (callback instanceof Function) {
                if (callback.constructor.name === 'AsyncFunction') {
                    await callback(); // Execute the async callback with await
                } else {
                    callback(); // Execute the regular callback
                }
            }
        } catch (error) {
            console.error('Error in callback:', error);
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}


function _request(action, method = 'GET', data = {}, hasFile = false, type = 'json') {

    const endpoint = atob(window.ipbxapi_host) + action;

    return new Promise(function (resolve, reject) {

        const ajaxOptions = {

            type: method,
            url: endpoint,
            data: method === 'GET' ? data : (hasFile ? data : JSON.stringify(data)),
            cache: hasFile ? false : true,
            contentType: hasFile ? false : 'application/json',
            processData: hasFile ? false : true,

            beforeSend: function (xhr) {
                if (localStorage.auth_token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.auth_token);
                }
            },

            success: function (response, status, xhr) {

                //if xhr application/json
                if (xhr.getResponseHeader('content-type') !== 'application/json; charset=utf-8' && type === 'blob') {

                    resolve(response);
                    return;
                }

                if (response.error === 405) {
                    window.stop();
                    location.replace(`/logout/?redirect=${location.pathname}`);

                } if (response.error === 406) {
                    resolve(response); // Resolve promise and go to then()

                } else if (response.error === 0) {
                    resolve(response);
                } else {
                    toast(response.msg, 'danger');
                    reject(response); // Reject the promise and go to catch()
                }
            },

            error: function (jqXHR, exception) {

                let msg = 'Uncaught Error.';

                if (type === 'blob' && jqXHR.status === 200) {
                    msg = 'Failed to load the resource';
                } else if (jqXHR.status === 0) {
                    msg = 'Not connected.\nVerify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested resource not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                }

                toast('Error: ' + msg, 'danger');

                reject(jqXHR, exception); // Reject the promise and go to catch()
            },

        };

        if (type === 'blob') {
            ajaxOptions.xhrFields = {
                responseType: 'blob',
            };
        }

        //console.log(ajaxOptions);
        $.ajax(ajaxOptions);
    });
}


// Toasrer
function toast(message, type = 'success', duration = 3000) {

    function toastTemplate(message, type) {
        return `
        <div class="toast-container position-fixed top-0 end-0 p-3">
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${type === 'danger' ? '<i class="ri-alert-fill me-2"></i>' : '<i class="ri-check-line me-2"></i>'}
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>`;
    }


    //remove previous toast if any
    if ($('.toast-container').length) {

        $('.toast-container').remove();
    }

    //append to body
    $('body').prepend(toastTemplate(message, type));


    //toast instance
    var toast = new bootstrap.Toast($('.toast'));

    //show toast
    toast.show();

    //remove toast after 3sec
    setTimeout(function () {

        //hide toast
        toast.hide();

        //remove toast from DOM
        $('.toast-container').remove();

    }, duration);

}

function formatPhoneNumber(input, template) {

    if (!template) return input;

    const cleanedInput = input.replace(/\D/g, '');
    let templateIndex = 0;
    return template.replace(/0/g, () => cleanedInput.charAt(templateIndex++) || '');
}

let attempt = true;

function logOut() {

    if (attempt) {
        _request('/user/logout', 'POST');
        attempt = false;
        return location.replace(`/logout/?redirect=${location.pathname}`);
    }
}

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


function hasActiveServices(name) {
    if (activeServicesByType.hasOwnProperty(name)) {
        return true;
    }
}

async function fetchDataAndSaveData(service, endpoint, dataKey) {
    let localDb = await getItemsFromDB(dataKey, null, null, 1);

    let checkItems = false;

    if (localDb.items?.length) {
        checkItems = true;
    }

    if (hasActiveServices(service) && !checkItems) {
        let fetchData = await _request(endpoint);
        if (fetchData.data && fetchData.data.items) {
            saveDataToDB(dataKey, fetchData.data.items);
        }
    }
}

async function fetchDataAndSaveContacts(endpoint, dataKey) {

    let contactData = await getAllItems("contacts");

    let localDb = contactData.items;

    let checkItems = false;

    if (localDb?.length) {
        checkItems = true;
    }

    if (!checkItems) {
        let fetchData = await _request(endpoint);
        if (fetchData.data) {
            saveDataToDB(dataKey, fetchData.data);
        }
    }
}

//contact groups
async function fetchDataAndSaveContactGroups(endpoint, dataKey) {

    let contactData = await getAllItems("contactGroups");

    let localDb = contactData.items;

    let checkItems = false;

    if (localDb?.length) {
        checkItems = true;
    }

    if (!checkItems) {
        let fetchData = await _request(endpoint);
        if (fetchData.data) {
            saveDataToDB(dataKey, fetchData.data);
        }
    }
}





async function subscribePushNotification() {

    let user = JSON.parse(localStorage.getItem('user'));

    let checkSubscription = await pnSubscribed();
    if (!checkSubscription && user.notification == 1) {
        await pnSubscribe();
    } else if (checkSubscription && user.notification == 0) {
        await pnUnsubscribe();
    }
}

const initAppState = async () => {

    await _request(APIS.PROFILE);

    if (typeof reef !== 'undefined' && typeof getSMSStateFromDB === 'function' && typeof getEfaxStateFromDB === 'function' && typeof getWhatsappStateFromDB === 'function' && typeof getContactsStateFromDB === 'function') {

        // profile setup
        const userState = new reef.signal(JSON.parse(localStorage.user || '{}'));

        if (userState?.name) {
            // loop all instance of .profile-user element
            $('.profile-user').each((index, element) => {
                // create a new component
                reef.component(element, () => `<span class="avatar-title text-primary bg-transparent">${userState.name?.charAt(0)}</span>`);
            });

        }

        // init db
        await initializeDB();

        // fetch initial data
        await Promise.all([

            // fetch SMS, eFax and WhatsApp threads
            fetchDataAndSaveData("sms", "/threads/list/sms", "threads"),
            fetchDataAndSaveData("efax", "/efax/inbox", "fax"),
            fetchDataAndSaveData("whatsapp", "/threads/list/whatsapp", "threads"),
            // fetch contacts
            fetchDataAndSaveContacts("/contacts", "contacts"),
            // fetch contact groups
            fetchDataAndSaveContactGroups("/contacts/groups", "contactGroups"),

        ]);

        window.appState = {
            "sms": new reef.signal(await getSMSStateFromDB()),
            "efax": new reef.signal(await getEfaxStateFromDB()),
            "whatsapp": new reef.signal(await getWhatsappStateFromDB()),
            "contacts": new reef.signal(await getContactsStateFromDB()),
            "contactGroups": new reef.signal(await getContactsGroupsStateFromDB()),
            "components": new reef.signal({
                sidebarOpen: false,
            }),
        };

        if (typeof sideMenuServiceListTemplate === 'function') {
            reef.component('#side_menu_serviceList', sideMenuServiceListTemplate);
        }

        if (typeof initPageData === 'function') {
            await initPageData();
        }

        // init tooltips for all elements on reef render
        $(document).on('reef:render', function (event) {
            $("body").tooltip({
                selector: '[data-bs-toggle="tooltip"]'
            });
            // $('[data-bs-toggle="tooltip"]').each(function () {
            //     new bootstrap.Tooltip(this);
            // });
        });

    } else {
        console.warn('no state store found');
    }

}

function getContact(id) {

    const contacts = window.appState.contacts;
    const contact = contacts.find(contact => contact.id === id);

    if (contact) {
        return contact;
    }

    return null;
}

$(document).ready(async function () {

    "use strict";

    // Handle dropdown menus
    $(".dropdown-menu a.dropdown-toggle").on("click", function (event) {
        // Close other open dropdowns within the same container
        if (!$(this).next().hasClass("show")) {
            $(this).parents(".dropdown-menu").first().find(".show").removeClass("show");
        }

        // Toggle the clicked dropdown menu
        $(this).next(".dropdown-menu").toggleClass("show");

        // Prevent default click behavior and event propagation
        return false;
    });

    // Initialize Bootstrap tooltips
    $('[data-bs-toggle="tooltip"]').each(function () {
        new bootstrap.Tooltip(this);
    });

    // Initialize Bootstrap popovers
    $('[data-bs-toggle="popover"]').each(function () {
        new bootstrap.Popover(this);
    });

    // Handle light-dark mode switch

    var lightDarkModeButtons = $(".light-dark-mode");

    if (lightDarkModeButtons.length) {

        lightDarkModeButtons.on("click", function () {
            if ($(body).attr("data-bs-theme") === "dark") {

                $(body).attr("data-bs-theme", "light");

                //set to local storage
                localStorage.setItem('theme', 'light');

            } else {

                $(body).attr("data-bs-theme", "dark");

                //set to local storage
                localStorage.setItem('theme', 'dark');

            }
        });
    }

    // Initialize Waves library if available
    if (typeof Waves !== "undefined") {
        Waves.init();
    }

    if (typeof $.fn.magnificPopup !== 'undefined') {

        $(".popup-img").magnificPopup({
            type: "image",
            closeOnContentClick: !0,
            mainClass: "mfp-img-mobile",
            image: {
                verticalFit: !0
            }
        }), $("#user-profile-hide").click(function () {
            $(".user-profile-sidebar").hide()
        }), $(".user-profile-show").click(function () {
            $(".user-profile-sidebar").show()
        }), $(".chat-user-list li a").click(function () {
            $(".user-chat").addClass("user-chat-show")
        }), $(".user-chat-remove").click(function () {
            $(".user-chat").removeClass("user-chat-show")
        });
    }


    $('.menu-icon').on('click', function () {
        $('.side-menu').toggleClass('show');
    });

    await initAppState();


    if (typeof refreshState === 'function') {
        //polling threads
        setTimeout(() => {
            poolWithDelay(5000, refreshState);
        }, 2000);
    }

    if (typeof pnSubscribed === 'function') {
        await subscribePushNotification();
    }

});

// update conversation id in service worker
window.addEventListener('beforeunload', async (event) => {
    await navigator.serviceWorker.getRegistration().then(sw => {
        
          sw && sw.active.postMessage({ action: 'updateConversationId', threadId: 0 });
        
    });
});
