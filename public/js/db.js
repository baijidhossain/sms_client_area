let db; // Declare db in the global scope

async function initializeDB() {
    db = await idb.openDB("iPBXSMS", 1, {
        upgrade(db) {


            //init
            if (!db.objectStoreNames.contains("threadConfig")) {
                db.createObjectStore("threadConfig");
            }

            //threads
            if (!db.objectStoreNames.contains("threads")) {
                const threadStore = db.createObjectStore("threads", {
                    keyPath: "thread_id",
                });
                threadStore.createIndex("order_by_lmsg", "message_id");
            }

            //phone data
            if (!db.objectStoreNames.contains("phoneData")) {
                db.createObjectStore("phoneData");
            }

            //messages
            if (!db.objectStoreNames.contains("messages")) {

                db.createObjectStore("messages", {
                    keyPath: "thread_id",
                });

            }

        },
    });
}

async function savePhoneDataToDB(phoneData) {
    // Save phone data
    const phoneDataStore = db.transaction("phoneData", "readwrite").objectStore("phoneData");
    await phoneDataStore.put(phoneData, "phoneData");
}

async function saveMessagesToDB(messages) {
    //Save messages thread_id as key from state.messages[].thread.id
    const messageStore = db.transaction("messages", "readwrite").objectStore("messages");
    for (const message of messages) {

        if (message !== undefined) {
            await messageStore.put(message);
        }

    }
}

async function saveThreadToDB(threads, hasMoreThreads = true) {
    //set hasMoreThreads to true initially
    const threadConfigStore = db.transaction("threadConfig", "readwrite").objectStore("threadConfig");
    await threadConfigStore.put(hasMoreThreads, "hasMoreThreads");

    //Save threads
    const store = db.transaction("threads", "readwrite").objectStore("threads");
    for (const thread of threads) {
        await store.put(thread);
    }
}

async function updateThread(thread) {

    const store = db.transaction("threads", "readwrite").objectStore("threads");
    await store.put(thread);

}

async function loadFromDB() {

    const threadConfigStore = db.transaction("threadConfig", "readonly").objectStore("threadConfig");
    const hasMoreThreads = await threadConfigStore.get("hasMoreThreads");

    const phoneDataStore = db.transaction("phoneData", "readonly").objectStore("phoneData");
    const phoneData = await phoneDataStore.get("phoneData");

    const messagesDataStore = db.transaction("messages", "readonly").objectStore("messages");

    //get all with keys
    const messages = await messagesDataStore.getAll();

    return {
        threads: {
            hasMore: hasMoreThreads,
            //items: await loadThreadsFromDB(0, 30),
            items: await getItemsFromDB("threads", "order_by_lmsg", 0),
        },
        messages: messages,
        phoneData: phoneData ?? {
            selected: 0,
            threads: {},
        }
    };

}

async function closeDBConnection() {
    db.close();
}

async function wipeDatabase() {
    await closeDBConnection();
    await idb.deleteDB("iPBXSMS");
}


async function getItemsFromDB(storeName, indexName, upper, limit = 20) {

    // Get a read-only transaction on the 'store' object store
    const tx = db.transaction([storeName], 'readonly');

    // Get the 'index' index from the transaction
    const index = tx.objectStore(storeName).index(indexName);

    // Declare an array to store the record values
    const values = [];

    // Declare a counter variable
    let count = 0;

    // Check if the upper parameter is zero or not
    if (upper === 0) {
        // If zero, get a cursor that iterates over all records in descending order by key
        var cursor = await index.openCursor(null, 'prev');
    } else {
        // If not zero, create a key range object with an upper bound of the upper parameter
        var range = IDBKeyRange.upperBound(upper, true);
        // Get a cursor that iterates over the records within the key range in descending order by key
        var cursor = await index.openCursor(range, 'prev');
    }

    // Use a while loop to iterate over the records
    while (cursor) {
        // Check if the counter is less than the limit parameter
        if (count < limit) {
            // Push the record value to the array
            values.push(cursor.value);
            // Increment the counter by 1
            count++;
        } else {
            // Break out of the loop
            break;
        }
        // Advance to the next record
        cursor = await cursor.continue();
    }

    // Return the values array
    return values;
}