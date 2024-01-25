let db; // Declare db in the global scope

async function initializeDB() {
    db = await idb.openDB("iPBXSMS", 1, {
        upgrade(db) {

            //threads
            if (!db.objectStoreNames.contains("threads")) {
                const threadStore = db.createObjectStore("threads", {
                    keyPath: "thread_id",
                });

                threadStore.createIndex("service_type, msg_id", ['service_type', 'message_id']);
            }

            //phone data
            if (!db.objectStoreNames.contains("phoneThreads")) {

                const threadStore = db.createObjectStore("phoneThreads", {
                    keyPath: "thread_id",
                });

                threadStore.createIndex('phone_id', 'phone_id', {
                    multiEntry: true
                });
            }

            //messages
            if (!db.objectStoreNames.contains("messages")) {

                const messageStore = db.createObjectStore("messages", {
                    keyPath: "id",
                });
                messageStore.createIndex("thread_id", "thread_id");
                messageStore.createIndex("thread_id, msg_id", ['thread_id', 'id']);
            }

            //fax
            if (!db.objectStoreNames.contains("fax")) {

                const faxStore = db.createObjectStore("fax", {
                    keyPath: "uuid",
                });

                faxStore.createIndex("type", "type");

                faxStore.createIndex('type, epoch', ['type', 'epoch']);

            }

            //contacts
            if (!db.objectStoreNames.contains("contacts")) {

                const contactStore = db.createObjectStore("contacts", {
                    keyPath: "id",
                });

                contactStore.createIndex("number", "number", {
                    unique: false
                });
            }

            //contact groups
            if (!db.objectStoreNames.contains("contactGroups")) {

                const contactGroupStore = db.createObjectStore("contactGroups", {
                    keyPath: "id",
                });
                contactGroupStore.createIndex("name", "name");

            }

        },
    });
}

async function saveDataToDB(storeName, data, key = null) {

    var objectStore = db.transaction(storeName, 'readwrite').objectStore(storeName);

    if (Array.isArray(data)) {
        for (const item of data) {
            if (item !== undefined) {
                await objectStore.put(item);
            }
        }
    } else {
        key ? await objectStore.put(data, key) : await objectStore.put(data);
    }
}


async function deleteDataFromDB(storeName, key, indexName = '') {

    if (indexName.length > 0) {

        let messages = await db.getAllKeysFromIndex(storeName, indexName, key);
        for (const msgId of messages) {
            await db.delete(storeName, msgId);
        }

    } else {
        await db.delete(storeName, key);
    }
}

async function loadFromDB() {

    const phoneDataStore = db.transaction("phoneThreads", "readonly").objectStore("phoneThreads");
    const phoneData = await phoneDataStore.get("phoneThreads");
    let threadRange = IDBKeyRange.upperBound([service_type, Infinity]);
    let getThreads = await getItemsFromDB("threads", "service_type, msg_id", threadRange);
    let filteredPhoneData = null;

    if (phoneData && phoneData.threads) {
        filteredPhoneData = {
            ...phoneData,
            threads: Object.fromEntries(
                Object.entries(phoneData.threads).map(([key, thread]) => [
                    key,
                    {
                        ...thread,
                        items: thread.items.filter(item => item.service_type === service_type)
                    }
                ])
            )
        }
    }

    return {

        threads: {
            hasMore: true,
            //items: await loadThreadsFromDB(0, 30),
            items: getThreads.items,
        },
        messages: await getMessagesFromDB(),
        phoneData: filteredPhoneData ?? {
            selected: 0,
            threads: {},
        }
    };

}

async function getSMSStateFromDB() {

    let threadRange = IDBKeyRange.upperBound(['sms', Infinity]);

    return {
        selectedThreadId: 0,
        selectedThreadInfo: {},
        threads: {
            hasMore: true,
            //items: await loadThreadsFromDB(0, 30),
            items: (await getItemsFromDB("threads", "service_type, msg_id", threadRange)).items,
        },
        messages: await getMessagesFromDB(),
        phoneData: {
            selected: 0,
            threads: {},
        }
    };
}

async function getWhatsappStateFromDB() {

    let threadRange = IDBKeyRange.bound(['whatsapp', -Infinity], ['whatsapp', Infinity]);

    return {
        selectedThreadId: 0,
        selectedThreadInfo: {},
        threads: {
            hasMore: true,
            //items: await loadThreadsFromDB(0, 30),
            items: (await getItemsFromDB("threads", "service_type, msg_id", threadRange)).items,
        },
        messages: await getMessagesFromDB(),
        phoneData: {
            selected: 0,
            threads: {},
        }
    };
}

async function getContactsStateFromDB() {
    const contactData = await getAllItems("contacts");
    return contactData.items;
}

async function getContactsGroupsStateFromDB() {
    const contactGroupData = await getAllItems("contactGroups");
    return contactGroupData.items;
}


async function getEfaxStateFromDB() {

    const faxData = {};

    for (const [fax] of Object.entries(efaxPage)) {
        //if not inbox continue
        if (fax == 'Inbox') {

            //skip folder data
            faxData[fax] = await getItemsFromDB('fax', 'type, epoch', IDBKeyRange.bound([fax, -Infinity], [fax, Infinity], false, false), 30, (item, values) => {
                if (!item.folder_uuid) {
                    values.push(item);
                    return true;
                }
            });

        } else {

            faxData[fax] = {
                hasMore: false,
                items: []
            };
        }
    }

    return {
        currentPage: 'Inbox',
        fax: faxData,
        faxCounts: {},
        folders: {},
        selectedFax: [],
        selectedFolder: '',
        selectedPhone: '',
        searchQuery: '',
    };

}


async function closeDBConnection() {
    return db.close();
}

async function wipeDatabase() {
    await closeDBConnection();
    await idb.deleteDB("iPBXSMS");
}

async function getMessagesFromDB(limit = 30) {

    const transaction = db.transaction('messages', 'readonly');
    const index = transaction.objectStore('messages').index('thread_id');

    let values = [];

    var cursor = await index.openCursor(null, 'prev');

    while (cursor) {

        let threadID = cursor.value.thread_id;

        if (!values[threadID]) {
            values[threadID] = {
                items: [],
                thread_id: threadID,
                hasMoreMessages: true
            };
        }

        if (values[threadID].items.length < limit) {
            // Key already exists, so push the value under the existing key
            values[threadID].items.push(cursor.value);
        }

        // Advance to the next record
        cursor = await cursor.continue();
    }

    // return values;
    return values;
}

async function getItemsFromDB(storeName, indexName = null, range = null, limit = 30, callback = null) {

    // Get a read-only transaction on the 'store' object store
    const tx = await db.transaction([storeName], 'readonly');

    // Get the 'index' index from the transaction
    let index = await tx.objectStore(storeName);

    if (indexName) {
        index = index.index(indexName);
    }

    // check limit for all records
    if (limit === 0) {
        return {
            hasMore: false,
            items: await index.getAll()
        }
    }

    // Declare an array to store the record values
    const values = [];

    // Declare a counter variable
    let count = 0;

    // Get a cursor that iterates over the records within the key range in descending order by key
    var cursor = await index.openCursor(range, 'prev');

    // Use a while loop to iterate over the records
    while (cursor) {

        // Check if the counter is less than the limit parameter
        if (count < limit) {
            // Push the record value to the array

            if (callback && typeof callback === 'function') {

                if (callback(cursor.value, values)) {
                    count++;
                }

            } else {
                values.push(cursor.value);
                // Increment the counter by 1
                count++;
            }

        } else {
            // Break out of the loop
            break;
        }
        // Advance to the next record
        cursor = await cursor.continue();
    }

    // Return the values array
    return {
        hasMore: count < limit ? false : true,
        items: values
    }
}

async function getAllItems(storeName, indexName = null, key = null, orderBy = null, condition = null, limit = 0) {
    try {

        // Open a transaction on the specified store or index
        const transaction = db.transaction(storeName, 'readonly');
        const store = indexName ? transaction.store.index(indexName) : transaction.store;

        // Create a request to get all items using the key or index if provided
        let request;
        if (key !== null) {
            request = store.getAll(key);
        } else {
            request = store.getAll();
        }

        // Wait for the request to complete
        let items = await request;

        // If a condition function is provided, filter the items
        if (condition && typeof condition === 'function') {
            items = items.filter(condition);
        }

        // If orderBy is specified, sort the items in descending order
        if (orderBy) {
            items.sort((a, b) => b[orderBy] - a[orderBy]);
        }

        // Calculate hasMore based on the limit
        const hasMore = items.length > limit;

        // If limit is specified, limit the result
        if (limit > 0) {
            items = items.slice(0, limit);
        }

        return { hasMore, items };
    } catch (error) {
        console.error('Error in getAllItems:', error);
        throw error;
    }
}



