/**
 * Serviceworker for web push notifications
 * @package PNServer
 */

// values to be modified for own project

// default Notification Title if not pushed by server
const strDefTitle = 'IPBX SMS';
// default Notification Icon if not pushed by server
const strDefIcon = '/public/images/logo.svg';
let currentThreadId;

/**
 * event listener to show notification
 * @param {PushEvent} event
 */
function pnPushNotification(event) {
    
    var strTitle = strDefTitle;
    var oPayload = null;
    var opt = { icon: strDefIcon };
    if (event.data) {

        // PushMessageData Object containing the pushed payload
        try {
            // try to parse payload JSON-string
            oPayload = JSON.parse(event.data.text());
            

        } catch (e) {
            // if no valid JSON Data take text as it is...
            // ... comes maybe while testing directly from DevTools
            opt = {
                icon: strDefIcon,
                body: event.data.text(),
            };
        }
        if (oPayload) {
            if (oPayload.title !== undefined && oPayload.title !== '') {
                strTitle = oPayload.title;
            }
            opt = oPayload.opt;
            if (oPayload.opt.icon === undefined ||
                oPayload.opt.icon === null ||
                oPayload.icon === '') {
                // if no icon defined, use default
                opt.icon = strDefIcon;
            }
        }
    }

    // check threadId before creating notification
    if (oPayload.opt.data.threadId !== undefined && parseInt(oPayload.opt.data.threadId) == parseInt(currentThreadId)) {
        // don't create notification
        return;
    }
    
    var promise = self.registration.showNotification(strTitle, opt);
    event.waitUntil(promise);
}

/**
 * event listener to notification click
 * if URL passed, just open the window...
 * @param {NotificationClick} event
 */
function pnNotificationClick(event) {
    
    if (event.notification.data && event.notification.data.url) {
        const promise = clients.openWindow(event.notification.data.url);
        event.notification.close();
        event.waitUntil(promise);
    }
    // if (event.action !== "") {
    //     // add handler for user defined action here...
    //     // pnNotificationAction(event.action);
     
    // }
}

/**
 * event listener to notification close
 * ... if you want to do something for e.g. analytics
 * @param {NotificationClose} event
 */
function pnNotificationClose(event) {
    console.log('notificationclose event: ' + event);
}

/**=========================================================
 * add all needed event-listeners
 * - activate:  subscribe notifications and send to server
 * - push:      show push notification
 * - click:     handle click an notification and/or action 
 *              button
 * - change:    subscription has changed
 * - close:     notification was closed by the user
 *=========================================================*/

// and listen to incomming push notifications
self.addEventListener('push', pnPushNotification);
// ... and listen to the click
self.addEventListener('notificationclick', pnNotificationClick);

// notification was closed without further action
self.addEventListener('notificationclose', pnNotificationClose); 

// track conversion id for push notifications prevention
self.addEventListener('message', (event) => {
    if (event.data.action === 'updateConversationId') {
        currentThreadId = event.data.threadId;
        self.registration.getNotifications().then(function (notifications) {

            notifications.forEach(function (notification) {
              if (parseInt(notification.data.threadId) == currentThreadId) {
                notification.close();
              }

            });
          });
    } else {
        currentThreadId = 0;
    }
});
// reset conversion id for push notifications prevention
self.addEventListener('activate', (event) => {
    currentThreadId = 0; // Reset threadId here
});