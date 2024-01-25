importScripts('https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js');

// Open or create an IndexedDB database
const dbPromise = idb.openDB('chuck-norris-jokes', 1, {
    upgrade(upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains('jokes')) {
            const jokesStore = upgradeDb.createObjectStore('jokes', { keyPath: 'id' });
            jokesStore.createIndex('timestamp', 'timestamp');
        }
    }
});

// Function to fetch and store a Chuck Norris joke
function fetchAndStoreJoke() {
    return fetch('https://api.chucknorris.io/jokes/random')
        .then((response) => response.json())
        .then((jokeData) => {

            sendDemoNotification(jokeData.value);

            return dbPromise.then((db) => {
                const tx = db.transaction('jokes', 'readwrite');
                const store = tx.objectStore('jokes');

                // Add the joke to the object store
                store.put({
                    id: jokeData.id,
                    joke: jokeData.value,
                    timestamp: Date.now(),
                });

                // Limit the number of stored jokes (optional)
                const maxJokes = 50;
                return store.index('timestamp').openCursor(null, 'prev').then((cursor) => {
                    return cursor.advance(maxJokes);
                }).then(function deleteRest(cursor) {
                    if (!cursor) return;
                    cursor.delete();
                    return cursor.continue().then(deleteRest);
                });
            });
        })
        .catch((error) => {
            console.error('Failed to fetch and store joke:', error);
        });
}

// Event listener for background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'syncJokes') {
        event.waitUntil(fetchAndStoreJoke());

        // Schedule the next sync after 10 seconds
        setTimeout(() => {
            self.registration.sync.register('syncJokes');
        }, 10000); // 10 seconds in milliseconds
    }
});

function sendDemoNotification(value) {
    self.registration.showNotification('Service Worker Notification', {
        body: value,
        icon: 'https://sms.mdriaz.com/public/images/favicon.ico',
    });

}

