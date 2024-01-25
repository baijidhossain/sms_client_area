/**
 * functions to support PUSH notifications (PN) on user client
 */

// VAPID appPublic key
const strAppPublicKey = 'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo';
// URL to save subscription on server via Fetch API

/**
 * encode the public key to Array buffer
 * @param {string} strBase64  -   key to encode
 * @return {Array} - UInt8Array
 */
function encodeToUint8Array(strBase64) {
    var strPadding = '='.repeat((4 - (strBase64.length % 4)) % 4);
    strBase64 = (strBase64 + strPadding).replace(/\-/g, '+').replace(/_/g, '/');
    var rawData = atob(strBase64);
    var aOutput = new Uint8Array(rawData.length);
    for (i = 0; i < rawData.length; ++i) {
        aOutput[i] = rawData.charCodeAt(i);
    }
    return aOutput;
}


/**
 * event listener to subscribe notifications and save subscription at server
 */
async function pnSaveSubscribe(swReg) {

    try {
        var appPublicKey = encodeToUint8Array(strAppPublicKey);
        var opt = {
            applicationServerKey: appPublicKey,
            userVisibleOnly: true,
        };

        swReg.pushManager.subscribe(opt)
            .then((sub) => {
                // subscription succeeded - send to server
                pnSaveSubscription(sub)
                    .then((response) => {
                        
                    }).catch((e) => {
                        // registration failed
                        console.log('SaveSubscription failed with: ' + e);
                    });
            }).catch((e) => {
                // registration failed
                console.log('Subscription failed with: ' + e);
            });

    } catch (e) {
        console.log('Error subscribing notifications: ' + e);
    }
}


/**
 * save subscription on server
 * using Fetch API to send subscription infos to the server
 * subscription is encance with the userAgent for internal use on the server
 * @param {object} sub - PushSubscription
 * @return {string} - response of the request
 */
async function pnSaveSubscription(sub) {

    try {
        // stringify and parse again to add 'custom' property
        // ... otherwise added property will be ignored when stringify subscription direct to body!
        let body = JSON.parse(JSON.stringify(sub));
        body.userAgent = navigator.userAgent;
        body.platform = navigator.platform ?? '';

        let response = await _request(APIS.PUSH_NOTIFICATION + '/addSubscription', 'POST', body);
        if (response.error !== 0) {
            throw new Error(response.statusText);
        }

        return response;

    } catch (error) {
        console.error('Error saving subscription:', error);
        throw error; // Propagate the error to the calling code if needed
    }

}

/**
 * subscribe Push notifications (PN)
 * - check, if PN's are available
 * - request users permission, if not done so far
 * - register service worker, if permisson is granted  
 */
async function pnSubscribe() {
    if (pnAvailable()) {
        // if not granted or denied so far...
        if (window.Notification.permission === "default") {
            await window.Notification.requestPermission();
        }
        if (Notification.permission === 'granted') {
            await pnAfterPermission();
        }
    }
}

// check notification permission change event
window.addEventListener('notificationpermissionchange', (event) => {
    // if not granted or denied so far...
    if (window.Notification.permission === "default") {
        window.Notification.requestPermission();
    }
    if (Notification.permission === 'granted') {
        pnAfterPermission();
    }
});

async function pnAfterPermission() {
    // register service worker
    await pnRegisterSW().then((swReg) => {
        if (swReg.active) {
            // save subscription
            pnSaveSubscribe(swReg);
        }
    }).catch((e) => {
        // registration failed
        console.log('Registration failed with: ' + e);
    });
}

/**
 * helper while testing
 * unsubscribe Push notifications
 */
async function pnUnsubscribe() {
    var swReg = null;
    if (pnAvailable()) {
        // unfortunately there is no function to reset Notification permission...
        // unregister service worker
        await pnUnregisterSW();
    }
}

/**
 * helper while testing
 * update service worker.
 * works not correct on each browser/os -> sometimes brwoser have to
 * be restarted to update service worker
 */
async function pnUpdate() {
    var swReg = null;
    if (pnAvailable()) {
        // unfortunately there is no function to reset Notification permission...
        // unregister service worker
        await pnUpdateSW();
    }
}

/**
 * helper while testing
 * check if PN already subscribed
 */
async function pnSubscribed() {
    var swReg;
    if (pnAvailable()) {
        swReg = await navigator.serviceWorker.getRegistration();
    }
    return (swReg !== undefined);
}

/**
 * checks whether all requirements for PN are met
 * 1. have to run in secure context
 *    - window.isSecureContext = true
 * 2. browser should implement at least
 *    - navigatpr.serviceWorker
 *    - window.PushManager
 *    - window.Notification
 *    
 * @returns boolen
 */
function pnAvailable() {
    var bAvailable = false;
    if (window.isSecureContext) {
        // running in secure context - check for available Push-API
        bAvailable = (('serviceWorker' in navigator) &&
            ('PushManager' in window) &&
            ('Notification' in window));
    } else {
        console.log('site have to run in secure context!');
    }
    return bAvailable;
}

/**
 * register the service worker.
 * there is no check for multiple registration necessary - browser/Push-API
 * takes care if same service-worker ist already registered
 */
async function pnRegisterSW() {

    try {
        const swReg = await navigator.serviceWorker.register('/PNServiceWorker.js')
        // registration worked
        console.log('Registration succeeded. Scope is ' + swReg.scope);

        return navigator.serviceWorker.ready.then(function (reg) {
            return reg;
        });

    } catch (error) {
        // registration failed
        console.log('Registration failed with ' + error);

        return null;
    }

}

/**
 * helper while testing
 * unregister the service worker.
 */
async function pnUnregisterSW() {
    navigator.serviceWorker.getRegistration()
        .then(function (reg) {
            reg.unregister()
                .then(async function (bOK) {
                    if (bOK) {

                        console.log('unregister service worker succeeded.');
                    } else {
                        console.log('unregister service worker failed.');
                    }
                });
        });
}

/**
 * helper while testing
 * update service worker.
 */
async function pnUpdateSW() {
    navigator.serviceWorker.getRegistration()
        .then(function (reg) {
            reg.update()
                .then(function (bOK) {
                    if (bOK) {
                        console.log('update of service worker succeeded.');
                    } else {
                        console.log('update of service worker failed.');
                    }
                });
        });
}
