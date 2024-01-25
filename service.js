

importScripts('https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js');

self.addEventListener('message', async function (event) {

 

  if (event.data && event.data.auth_token) {

    const auth_token = event.data.auth_token;
    const api_url = event.data.api_url;

    console.log('Received authToken in service worker:', auth_token);

    //set interval to fetch the API every 5 seconds
    setInterval(async function () {

      const lastMessage = await getLastMessageId();

      // Replace 'your_api_url_here' with your actual API endpoint URL
      const apiUrl = atob(api_url) + '/threads/latest?startId=' + lastMessage ?? 0;

      // Create a request with the Bearer token in the headers
      const request = new Request(apiUrl, {
        headers: {
          'Authorization': `Bearer ${auth_token}`,
        },
      });

      // Fetch the request
      const response = await fetch(request);

      // Get the response as JSON

      const data = await response.json();

      console.log(data);

      for (const msg of data.data) {

        await updateThread(msg);
        console.log(msg);

      }

    }, 10000);

  } else {
    console.log('No authToken received in service worker');
  }

});


//get the last message id from the database
async function getLastMessageId() {
  const db = await idb.openDB("iPBXSMS");
  //get the last message id from the database
  let store = db.transaction("threads", "readwrite").objectStore("threads");
  const index = store.index("order_by_lmsg");
  const cursor = await index.openCursor(null, 'prev');
  const lastMessage = cursor.value.message_id;
  return lastMessage;
}


//update the thread in the database
async function updateThread(msg) {

    const newThread = {
      content: msg.content,
      has_attachment: msg.attachments.length > 0 ? true : false,
      last_activity: msg.updated,
      message_id: msg.id,
      participants: msg.participants,
      format_template: msg.format_template,
      sender: msg.sender,
      thread_id: msg.thread_id,
      name: msg.thread_name ?? null,
      type: msg.thread_type ?? null,
      unread: msg.unread,
    };

    const db = await idb.openDB("iPBXSMS");
    let store = db.transaction("threads", "readwrite").objectStore("threads");
    store.put(newThread);

    //post message to the client
    self.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage(newThread);
      });
    });
}



self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: 'icon.png',
    badge: 'badge.png',
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

// Function to display a notification every 10 minutes
function scheduleNotifications() {
  setInterval(function() {
    const options = {
      body: 'This is a scheduled notification',
      icon: 'icon.png',
      badge: 'badge.png',
    };

    self.registration.showNotification('Scheduled Notification', options);
  }, 10000); // 10 minutes in milliseconds
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    scheduleNotifications() // Start the notification schedule when the service worker is installed
  );
});