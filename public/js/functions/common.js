function playNotificationSound() {

    const notificationSound = new Audio("../public/notifications/chat.mp3");

    if (('AudioContext' in window || 'webkitAudioContext' in window) && notificationSound) {
        var promise = notificationSound.play();
        if (promise !== undefined) {
            promise.then(function () {

            }).catch(function (error) {
                console.error('Error playing sound:', error);
            });
        }
    }
}

async function compressImage(imageFile) {
    //image configuration
    const options = {
        maxSizeMB: 3.75,
        useWebWorker: true,
    };
    try {
        return await imageCompression(imageFile, options);
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function refreshState() {
    const startIds = {};

    // loop over object and access only the key
    for (const key in activeServicesByType) {

        switch (key) {
            case 'sms':
            case 'whatsapp':
                startIds[key] = window.appState[key].threads?.items?.[0]?.message_id ?? 0
                break;

            case 'efax':
                startIds[key] = window.appState[key].fax?.Inbox.items[0]?.epoch ?? 0

            default:
                break;
        }
    }

    const req = await _request(APIS.LATEST_MESSAGE, 'GET', { startId: startIds });

    // check if data exists
    if (!req.data) {
        return;
    }

    //update state data for each service
    if (Object.keys(req.data.services)) {

        // for in loop
        for (const key in req.data.services) {
            switch (key) {
                case 'sms':
                case 'whatsapp':
                    await updateSMSData(req.data.services[key], key);
                    break;
                case 'efax':
                    await updateFaxData(req.data.services[key], key);
                default:
                    break;
            }
        }
    }


    // Taking action for events
    if (Object.keys(req.data.events)) {

        let eventsData = req.data.events;
        // for in loop
        for (const data of eventsData) {

            let event_type = data.type.replaceAll("-", "_");

            // Check if the event_type is a valid function
            if (eventFunctions[event_type] && typeof eventFunctions[event_type] === 'function') {
                await eventFunctions[event_type](JSON.parse(data.metadata));
            }

        }
    }
}

async function updateSMSData(messages, service_type) {

    let isPlaying = false;
    let readMsgIds = [];
    const state = window.appState[service_type];
    const phoneThreads = window.appState[service_type].phoneData.threads;

    messages.sort((a, b) => a.id - b.id);

    for (const msg of messages) {

        const newThread = {
            message_id: msg.id,
            thread_id: msg.thread_id,
            content: msg.content,
            participants: msg.participants,
            sender: msg.sender,
            has_attachment: msg.attachments.length > 0 ? true : false,
            last_activity: msg.updated,
            name: msg.thread_name ?? null,
            type: msg.thread_type ?? null,
            unread: msg.unread,
            service_type: msg.service_type,
            is_deleted: msg.is_deleted,
        };

        const newMessage = {
            id: msg.id,
            thread_id: msg.thread_id,
            content: msg.content,
            attachments: msg.attachments,
            sender: msg.sender,
            is_sender: msg.is_sender,
            status: msg.status,
            type: msg.type,
            unread: msg.unread,
            is_deleted: msg.is_deleted,
            created: msg.created,
            updated: msg.updated
        };

        // main threads operations
        const threadIndex = state.threads.items?.findIndex(item => item.thread_id == msg.thread_id);

        const thread = state.threads.items?.[threadIndex];

        if (thread) {

            if (state.selectedThreadId == msg.thread_id) {
                newThread.unread = 0;
                if (msg.unread) {
                    readMsgIds.push(msg.id);
                }
            }

            if (thread.message_id < msg.id) {

                if (newThread.unread) {
                    newThread.unread = (thread.unread += msg.unread);
                }
                // update thread with new message thread
                state.threads.items[threadIndex] = newThread;
                saveDataToDB("threads", newThread);

                // play sound if new message that is unread
                if (msg.unread) {
                    isPlaying ? null : (playNotificationSound(), (isPlaying = true));
                }
            }

        } else {

            // add new thread to state
            state.threads.items?.push(newThread);
            saveDataToDB("threads", newThread);
            // play sound if new message that is unread
            if (msg.unread) {
                isPlaying ? null : (playNotificationSound(), (isPlaying = true));
            }
        }

        // sort thread by message_id
        state.threads.items?.sort((a, b) => b.message_id - a.message_id);

        // service phone ids
        const authPhonesArray = newThread.participants.filter(participant => {
            return activeServicesByType[service_type]?.find(service => service.phone_id === participant.phone_id);
        });

        const dbThread = await db.get("phoneThreads", newThread.thread_id);
        newThread.phone_id = [];

        // phone threads operation
        authPhonesArray.forEach((phone, index) => {

            let service_phoneId = phone.phone_id;

            if (dbThread) {
                //check phoneId in index db thread phone_id
                if (!dbThread.phone_id.includes(service_phoneId)) {
                    dbThread.phone_id.push(service_phoneId);
                    newThread.phone_id = dbThread.phone_id;
                } else {
                    newThread.phone_id = dbThread.phone_id;
                }
            } else {

                if (!newThread.phone_id.includes(service_phoneId)) {
                    newThread.phone_id.push(service_phoneId);
                }
            }

            // check if state.phoneData.threads[phoneId].items exist
            if (!phoneThreads[service_phoneId]) {
                phoneThreads[service_phoneId] = {
                    items: []
                };
            }

            const threadIndex = phoneThreads[service_phoneId].items.findIndex(item => item.thread_id == newThread.thread_id);
            const thread = phoneThreads[service_phoneId].items?.[threadIndex];

            if (threadIndex >= 0) {

                // update thread with new message information
                if (phoneThreads[service_phoneId].items[threadIndex].message_id < msg.id) {
                    // only update necessary fields
                    phoneThreads[service_phoneId].items[threadIndex] = {
                        ...thread,
                        message_id: newThread.message_id,
                        content: newThread.content,
                        sender: newThread.sender,
                        has_attachment: newThread.has_attachment,
                        last_activity: newThread.last_activity,
                        unread: newThread.unread,
                        is_deleted: newThread.is_deleted,
                    };
                }

            } else {
                // Check if the thread_id is not already in the items array
                let existingThread = phoneThreads[service_phoneId].items.findIndex(item => item.thread_id === newThread.thread_id);

                if (existingThread < 0) {
                    phoneThreads[service_phoneId].items.unshift(newThread);
                }

            }

            // resort threads by message_id in desc order
            phoneThreads[service_phoneId].items?.sort((a, b) => b.message_id - a.message_id);

        });

        saveDataToDB("phoneThreads", cloneObjFromProxy(newThread));


        //update message state and indexDB
        const messageThread = state.messages[msg.thread_id];

        if (messageThread) {

            // find message in the thread if exists
            const messageIndex = messageThread.items.findIndex(item => item.id === msg.id);

            if (messageIndex < 0) {
                messageThread.items.unshift(newMessage);
                messageThread.items.sort((a, b) => b.id - a.id);
            }
        } else {
            state.messages[msg.thread_id] = { items: [newMessage], hasMoreMessages: true }
        }

        // finally save the message to the indexDB
        saveDataToDB("messages", newMessage);
    }

    if (readMsgIds.length > 0) {
        makeReadMessageRequest(readMsgIds.join(","));
    }

}

async function updateFaxData(faxs, service_type) {

    const state = window.appState[service_type];

    //only push unique faxs to state
    for (const fax of faxs) {

        const faxIndex = state.fax.Inbox.items.findIndex(item => item.uuid === fax.uuid);

        if (faxIndex < 0) {
            state.fax.Inbox.items.unshift(fax);
        }

    }
}

async function deleteThread(threadId, service_type) {

    try {

        const currentState = window.appState[service_type];
        currentState.selectedThreadId = 0;

        // Remove item from currentState.threads.items
        const indexToRemove = currentState.threads.items.findIndex(item => item.thread_id === threadId);
        if (indexToRemove !== -1) {
            currentState.threads.items.splice(indexToRemove, 1);
            await deleteDataFromDB("threads", threadId);
        }

        // Remove item from phone data
        for (const phoneId in currentState.phoneData.threads) {
            if (currentState.phoneData.threads.hasOwnProperty(phoneId)) {
                const statePhoneThread = currentState.phoneData.threads[phoneId];

                // Remove item from statePhoneThread.items
                const phoneIndexToRemove = statePhoneThread.items.findIndex(item => item.thread_id === threadId);
                if (phoneIndexToRemove !== -1) {
                    statePhoneThread.items.splice(phoneIndexToRemove, 1);
                    await deleteDataFromDB("phoneThreads", threadId);
                }
            }
        }

        delete currentState.messages[threadId];
        await deleteDataFromDB('messages', threadId, 'thread_id');

    } catch (error) {
        console.log(error);
    }
}

async function archiveThread(threadId, service_type) {
    await deleteThread(threadId, service_type);
}

async function deleteMessage(msg_id = 0, thread_id = 0, service_type) {

    try {

        if (msg_id && thread_id && service_type) {

            const currentState = window.appState[service_type];
            const messages = currentState.messages[thread_id]?.items ?? [];
            const threads = currentState.threads?.items ?? [];

            let message = messages.find(message => message.id == msg_id);
            if (message) {
                message.is_deleted = 1;
                saveDataToDB("messages", cloneObjFromProxy(message));
            }

            let thread = threads.find(thread => thread.message_id == msg_id);
            if (thread) {
                thread.is_deleted = 1;
                saveDataToDB("threads", cloneObjFromProxy(thread))
            }

            const indexPhoneThread = await db.get("phoneThreads", thread_id);

            if (indexPhoneThread) {
                indexPhoneThread.is_deleted = 1;
                await saveDataToDB("phoneThreads", indexPhoneThread);
            }

            for (const phoneId in currentState.phoneData.threads) {
                if (currentState.phoneData.threads.hasOwnProperty(phoneId)) {
                    const statePhoneThread = currentState.phoneData.threads[phoneId];

                    let phoneThread = statePhoneThread.items.find(item => item.thread_id === thread_id);
                    if (phoneThread) {
                        phoneThread.is_deleted = 1;
                        saveDataToDB("phoneThreads", cloneObjFromProxy(phoneThread));
                    }
                }
            }

        }

    } catch (error) {
        console.log(error);
    }
}

const eventFunctions = {

    message_failed: async ({ message_id, thread_id, service_type }) => {
        if (!message_id || !thread_id || !service_type) return;

        const currentState = window.appState[service_type];
        const messages = currentState.messages[thread_id]?.items ?? [];

        const messageToUpdate = messages.find(msg => msg.id === message_id);

        if (messageToUpdate) {
            messageToUpdate.status = 'Failed';
        }

        const indexMessage = await db.getFromIndex('messages', 'thread_id, msg_id', [thread_id, message_id]);

        if (indexMessage) {
            indexMessage.status = 'Failed';
            saveDataToDB("messages", cloneObjFromProxy(indexMessage));
        }
    },

    message_delivered: async ({ message_id, thread_id, service_type }) => {
        if (!message_id || !thread_id || !service_type) return;

        const currentState = window.appState[service_type];
        const messages = currentState.messages[thread_id]?.items ?? [];

        const messageToUpdate = messages.find(msg => msg.id === message_id);

        if (messageToUpdate) {
            messageToUpdate.status = 'Delivered';
        }

        const indexMessage = await db.getFromIndex('messages', 'thread_id, msg_id', [thread_id, message_id]);

        if (indexMessage) {
            indexMessage.status = 'Delivered';
            saveDataToDB("messages", cloneObjFromProxy(indexMessage));
        }
    },

    message_read: async ({ message_id, thread_id, service_type }) => {
        if (!message_id || !thread_id || !service_type) return;

        const { items: messages } = window.appState[service_type].messages[thread_id] || {};
        if (!messages) return;

        const { items: threads } = window.appState[service_type].threads || {};
        if (!threads || !threads.length) return;

        const messageToUpdate = messages.find(msg => msg.id == message_id);

        const indexMessage = await db.getFromIndex('messages', 'thread_id, msg_id', [thread_id, message_id]);

        const threadToUpdate = threads.find(thread => thread.thread_id == thread_id);
        const indexThread = await db.get('threads', thread_id);
        const indexPhoneThread = await db.get("phoneThreads", threadToUpdate.thread_id);

        const authPhonesArray = threadToUpdate.participants.filter(participant =>
            activeServicesByType[service_type]?.some(service => service.phone_id === participant.phone_id)
        );

        authPhonesArray.forEach(phone => {
            let phoneState = window.appState[service_type].phoneData.threads;
            // check in indexdb for updating thread with new message
            // update state if exists
            const phoneThreads = phoneState[phone.phone_id]?.items ?? [];
            const phoneThreadIndex = phoneThreads.findIndex(item => item.thread_id == threadToUpdate.thread_id);

            if (phoneThreadIndex >= 0 && phoneThreads[phoneThreadIndex].unread > 0) {
                phoneThreads[phoneThreadIndex].unread -= 1;
            }

        });

        if (indexPhoneThread && indexPhoneThread.unread > 0) {
            indexPhoneThread.unread -= 1;
            saveDataToDB("phoneThreads", indexPhoneThread);
        }

        // update state msg
        if (messageToUpdate) {
            messageToUpdate.unread = 0;
        }

        // update indexdb msg
        if (indexMessage) {

            indexMessage.unread = 0;
            saveDataToDB("messages", cloneObjFromProxy(indexMessage));

            //if (!indexMessage.is_sender) { emit this line because main thread  unread count not updated when two user in the same organization 

            // update state thread
            if (threadToUpdate && threadToUpdate.unread > 0) {
                threadToUpdate.unread -= 1;
            }

            // update indexdb thread
            if (indexThread && indexThread.unread > 0) {
                indexThread.unread -= 1;
                saveDataToDB("threads", cloneObjFromProxy(indexThread));
            }
            //}

        }

    },

    thread_archive: async ({ thread_id, service_type }) => {
        await archiveThread(thread_id, service_type);
    },

    thread_delete: async ({ thread_id, service_type }) => {
        await deleteThread(thread_id, service_type);
    },

    message_delete: async ({ message_id, thread_id, service_type }) => {
        await deleteMessage(message_id, thread_id, service_type);
    },
    contact_add: async (contactObj) => {
        await saveContact(contactObj);
    },

    add_participant: async ({ thread_id, participants, service_type, thread_type = null }) => {
        await threadParticipantAdd(thread_id, participants, service_type, thread_type);
    },

    remove_participant: async ({ thread_id, phone_id, service_type }) => {
        await threadParticipantRemove(thread_id, phone_id, service_type);
    },

    contact_update: async (contactObj) => {
        await updateContact(contactObj);
    },

    group_update: async (thread_info) => {
        await updateGroup(thread_info);
    },

    contact_delete: async ({ id }) => {
        await deleteContact(id);
    },

    contact_group_create: async (group) => {
        contactGroupCreate(group);
    },

    contact_group_update: async (group) => {
        contactGroupUpdate(group);
    },

    contact_group_delete: async (group) => {
        contactGroupDelete(group);
    },

    efax_read: async ({ service_type, fax_uuid }) => {
        await efaxRead(service_type, fax_uuid);
    },

    efax_delete: async ({ service_type, fax_uuid }) => {
        await efaxDelete(service_type, fax_uuid);
    },

    efax_move: async ({ service_type, fax_uuids, folder_uuid }) => {
        await efaxMove(service_type, fax_uuids, folder_uuid);
    },

    notification_subscribe: async ({ status }) => {
        await updateNotificationStatus(status);
    },

    notification_unsubscribe: async ({ status }) => {
        await updateNotificationStatus(status);
    },

    update_primary_service: async ({ name, primary_id }) => {
        await updatePrimaryService(name, primary_id);
    },

};


async function threadParticipantAdd(thread_id, participants, service_type, thread_type = null) {


    if (!thread_id || !participants || !service_type) return;

    let threads = (window.appState[service_type]?.threads?.items || []);

    let phoneThreads = (window.appState[service_type]?.phoneData.threads || []);

    let threadToUpdate = threads.find(thread => thread.thread_id == thread_id);

    let selectedThread = window.appState[service_type].selectedThreadInfo;

    if (selectedThread) {
        thread_type ? selectedThread.type = thread_type : null;

        //if participants not exist in selectedThread.participants then add
        participants.forEach(participant => {
            if (!selectedThread.participants.some(p => p.phone_id == participant.phone_id)) {
                selectedThread.participants.push(participant);
            }
        });
    }

    if (threadToUpdate) {
        thread_type ? threadToUpdate.type = thread_type : null;

        //if participants not exist in threadToUpdate.participants then add
        participants.forEach(participant => {
            if (!threadToUpdate.participants.some(p => p.phone_id == participant.phone_id)) {
                threadToUpdate.participants.push(participant);
            }
        });

        saveDataToDB("threads", cloneObjFromProxy(threadToUpdate));
    }


    for (const key in phoneThreads) {
        phoneThreads[key].items.forEach(pThread => {
            if (pThread.thread_id == thread_id) {

                thread_type ? pThread.type = thread_type : null;

                //if participants not exist in pThread.participants then add
                participants.forEach(participant => {
                    if (!pThread.participants.some(p => p.phone_id == participant.phone_id)) {
                        pThread.participants.push(participant);
                    }
                });

                saveDataToDB("phoneThreads", cloneObjFromProxy(pThread));
            }
        });
    }

    let indexPhoneThread = await db.get("phoneThreads", threadToUpdate.thread_id);
    if (indexPhoneThread) {

        thread_type ? indexPhoneThread.type = thread_type : null;

        //if participants not exist in indexPhoneThread.participants then add
        participants.forEach(participant => {
            if (!indexPhoneThread.participants.some(p => p.phone_id == participant.phone_id)) {
                indexPhoneThread.participants.push(participant);
            }
        });

        await saveDataToDB("phoneThreads", cloneObjFromProxy(indexPhoneThread));
    }
}

async function threadParticipantRemove(thread_id, phone_id, service_type) {

    if (!thread_id || !phone_id || !service_type) return;

    let threads = (window.appState[service_type]?.threads?.items || []);

    let phoneThreads = (window.appState[service_type]?.phoneData.threads || []);

    let threadToUpdate = threads.find(thread => thread.thread_id == thread_id);

    let selectedThread = window.appState[service_type].selectedThreadInfo;

    if (selectedThread) {    
        selectedThread.participants = selectedThread.participants.filter(p => p.phone_id != phone_id);
    }  

    if (threadToUpdate) {
        threadToUpdate.participants = threadToUpdate.participants.filter(p => p.phone_id != phone_id);
        saveDataToDB("threads", cloneObjFromProxy(threadToUpdate));
    }

    for (const key in phoneThreads) {
        phoneThreads[key].items.forEach(pThread => {

            if (pThread.thread_id == thread_id) {

                pThread.participants = pThread.participants.filter(p => p.phone_id != phone_id);
                saveDataToDB("phoneThreads", cloneObjFromProxy(pThread));
            }
        });
    }


    let indexPhoneThread = await db.get("phoneThreads", threadToUpdate.thread_id);
    if (indexPhoneThread) {
        indexPhoneThread.participants = indexPhoneThread.participants.filter(p => p.phone_id != phone_id);

        await saveDataToDB("phoneThreads", cloneObjFromProxy(indexPhoneThread));
    }


}


async function updatePrimaryService(name, primary_id) {

    let user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        //update primary service
        user.services[name].forEach(service => {
            if (service.id == primary_id) {
                service.is_primary = 1;
            } else {
                service.is_primary = 0;
            }
        });
        localStorage.setItem('user', JSON.stringify(user));
    }

}

async function efaxMove(service_type, fax_uuids, folder_uuid) {


    const currentState = window.appState[service_type];
    const faxInbox = currentState.fax.Inbox.items;

    for (const fax_uuid of fax_uuids) {

        const faxIndex = faxInbox.findIndex(item => item.uuid === fax_uuid);


        if (faxIndex >= 0) {


            faxInbox[faxIndex].folder_uuid = folder_uuid;
            saveDataToDB("fax", cloneObjFromProxy(faxInbox[faxIndex]));
        }
    }

    await fetchInitData();

}

async function efaxRead(service_type, fax_uuid) {

    const currentState = window.appState[service_type];
    const faxInbox = currentState.fax.Inbox.items;
    const faxIndex = faxInbox.findIndex(item => item.uuid === fax_uuid);


    if (faxIndex >= 0) {
        faxInbox[faxIndex].is_viewed = true;
        saveDataToDB("fax", cloneObjFromProxy(faxInbox[faxIndex]));
    }

    await fetchInitData();
}

async function efaxDelete(service_type, fax_uuid) {

    const currentState = window.appState[service_type];
    const faxInbox = currentState.fax.Inbox.items;
    const faxIndex = faxInbox.findIndex(item => item.uuid === fax_uuid);

    if (faxIndex >= 0) {
        faxInbox.splice(faxIndex, 1);
        await deleteDataFromDB("fax", fax_uuid);
    }

    await fetchInitData();
}

// async function updateContact(contactInfo) {
//     try {
//         const contactState = window.appState.contacts;
//         const indexToUpdate = contactState.findIndex(item => item.id === contactInfo.id);

//         if (indexToUpdate !== -1) {
//             contactState[indexToUpdate] = contactInfo;
//             await saveDataToDB("contacts", contactInfo);

//             //remove contact number from thread if not exist in contactInfo.numbers
//             const threads = window.appState.sms.threads.items;
//             threads.forEach(thread => {
//                 thread.participants.forEach(participant => {
//                     if (participant.contact_id == contactInfo.id) {
//                         if (!contactInfo.numbers.some(number => number.number == participant.number)) {
//                             participant.contact_id = 0;
//                             saveDataToDB("threads", cloneObjFromProxy(thread));
//                         }
//                     }
//                 });
//             });

//             const WhatsAppThreads = window.appState.whatsapp.threads.items;
//             WhatsAppThreads.forEach(thread => {
//                 thread.participants.forEach(participant => {
//                     if (participant.contact_id == contactInfo.id) {
//                         if (!contactInfo.numbers.some(number => number.number == participant.number)) {
//                             participant.contact_id = 0;
//                             saveDataToDB("threads", cloneObjFromProxy(thread));
//                         }
//                     }
//                 });
//             });


//             //update phoneData threads
//             const phoneThreads = window.appState.sms.phoneData.threads;
//             for (const key in phoneThreads) {
//                 phoneThreads[key].items.forEach(thread => {
//                     thread.participants.forEach(participant => {
//                         if (participant.contact_id == contactInfo.id) {
//                             if (!contactInfo.numbers.some(number => number.number == participant.number)) {
//                                 participant.contact_id = 0;
//                                 saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
//                             }
//                         }
//                     });
//                 });
//             }

//             const WhatsAppPhoneThreads = window.appState.whatsapp.phoneData.threads;
//             for (const key in WhatsAppPhoneThreads) {
//                 WhatsAppPhoneThreads[key].items.forEach(thread => {
//                     thread.participants.forEach(participant => {
//                         if (participant.contact_id == contactInfo.id) {
//                             if (!contactInfo.numbers.some(number => number.number == participant.number)) {
//                                 participant.contact_id = 0;
//                                 saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
//                             }
//                         }
//                     });
//                 });
//             }

//             //TODO: index db old threads not updated
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

async function updateContactInThread(contactInfo, objectStore) {

    let threadList = [];

    //get thread from indexdb
    const Threads = await db.getAll(objectStore);

    if (Threads) {
        Threads.forEach(thread => {

            thread.participants.forEach(participant => {

                if (participant.contact_id == contactInfo.id) {

                    if (!contactInfo.numbers.some(number => number.number == participant.number)) {

                        participant.contact_id = 0;

                        saveDataToDB(objectStore, cloneObjFromProxy(thread));

                        threadList.push({
                            thread_id: thread.thread_id,
                            service_type: thread.service_type,
                        });
                    }

                } else if (
                    participant.contact_id == 0 &&
                    contactInfo.numbers.some(number => number.number == participant.number)
                ){

                    participant.contact_id = contactInfo.id;

                    saveDataToDB(objectStore, cloneObjFromProxy(thread));

                    threadList.push({
                        thread_id: thread.thread_id,
                        service_type: thread.service_type,
                    });
                }
               

            });

        });
    }

    //update thread in state by threadList type

    if (objectStore == "threads") {

        //update state thread by type
        threadList.forEach(thread => {

            const threads = window.appState[thread.service_type].threads.items;
      

            const threadToUpdate = threads.find(item => item.thread_id == thread.thread_id);

            if (threadToUpdate) {

                threadToUpdate.participants.forEach(participant => {

                    if (participant.contact_id == contactInfo.id) {

                        //remove contact number from thread if not exist in contactInfo.numbers
                        if (!contactInfo.numbers.some(number => number.number == participant.number)) {
                            participant.contact_id = 0;
                        }
                        
                    }else if (
                        participant.contact_id == 0 &&
                        contactInfo.numbers.some(number => number.number == participant.number)
                    ){
                        participant.contact_id = contactInfo.id;
                    }

                    
                });

            }


        });


    } else if (objectStore == "phoneThreads") {
        //update state thread by phoneId
        threadList.forEach(thread => {
            const phoneThreads = window.appState[thread.service_type].phoneData.threads
            for (const key in phoneThreads) {
                phoneThreads[key].items.forEach(pThread => {
                    if (pThread.thread_id == thread.thread_id) {
                        pThread.participants.forEach(participant => {
                            if (participant.contact_id == contactInfo.id) {
                                //remove contact number from thread if not exist in contactInfo.numbers
                                if (!contactInfo.numbers.some(number => number.number == participant.number)) {
                                    participant.contact_id = 0;
                                }
                            }else if (
                                participant.contact_id == 0 &&
                                contactInfo.numbers.some(number => number.number == participant.number)
                            ){
                                participant.contact_id = contactInfo.id;
                            }
                        });
                    }
                });
            }
        });
    }

}


async function updateContact(contactInfo) {
    try {
        const contactState = window.appState.contacts;
        const indexToUpdate = contactState.findIndex(item => item.id === contactInfo.id);

        if (indexToUpdate !== -1) {
            contactState[indexToUpdate] = contactInfo;
            await saveDataToDB("contacts", contactInfo);
            await updateContactInThread(contactInfo, "threads");
            await updateContactInThread(contactInfo, "phoneThreads");
        }

    } catch (error) {
        console.log(error);
    }
}


async function updateGroup(threadInfo) {
    try {
        const threadState = window.appState.sms.threads.items;
        let thread = threadState.find(item => item.thread_id === threadInfo.thread_id);

        if (thread) {
            thread.name = threadInfo.name;
            await saveDataToDB("threads", cloneObjFromProxy(thread));
        }

        const indexPhoneThread = await db.get("phoneThreads", threadInfo.thread_id);

        if (indexPhoneThread) {
            indexPhoneThread.name = threadInfo.name;
            await saveDataToDB("phoneThreads", indexPhoneThread);
        }

        let phoneThreadState = window.appState.sms.phoneData.threads;

        if (phoneThreadState) {
            for (const phoneId in phoneThreadState) {
                if (phoneThreadState.hasOwnProperty(phoneId)) {
                    let phoneThreads = phoneThreadState[phoneId].items;

                    for (const pThread of phoneThreads) {
                        if (pThread.thread_id == threadInfo.thread_id) {
                            pThread.name = threadInfo.name;
                            await saveDataToDB("phoneThreads", cloneObjFromProxy(pThread));
                        }
                    }
                }
            }
        }


    } catch (error) {
        console.log(error);
    }
}

async function saveContact(contactInfo) {
    try {

        const contactState = window.appState.contacts;
        const existingIndex = contactState.findIndex(contact => contact.id === contactInfo.id);

        if (existingIndex !== -1) {
            // If contact with the same id exists, update it
            contactState[existingIndex] = contactInfo;
        } else {
            // If contact with the same id doesn't exist, push it
            contactState.push(contactInfo);
        }

        await saveDataToDB("contacts", contactInfo);

        await attachContactToThread(contactInfo);

    } catch (error) {
        console.log(error);
    }
}

async function updateNotificationStatus(status) {
    let userInfo = JSON.parse(localStorage.getItem('user')) || {};
    userInfo.notification = status;
    localStorage.setItem('user', JSON.stringify(userInfo));
}

//delete contact
async function deleteContact(contactId) {

    try {


        const contactState = window.appState.contacts;

        const indexToRemove = contactState.findIndex(item => item.id === contactId);

        let contact = contactState.find(item => item.id === contactId);

        if (indexToRemove !== -1) {

            await updateContactInThread(contact, "threads");
            await updateContactInThread(contact, "phoneThreads");

            contactState.splice(indexToRemove, 1);

            await deleteDataFromDB("contacts", contactId);

            //remove from contact_list on ContactGroup
            const contactGroups = window.appState.contactGroups;

            contactGroups.forEach(group => {
                const indexToRemove = group.contact_list.findIndex(item => item === contactId);
                if (indexToRemove !== -1) {
                    group.contact_list.splice(indexToRemove, 1);
                    contactGroupUpdate(group);
                }
            });

        }

        

    } catch (error) {
        console.log(error);
    }
}


//create contact group
async function contactGroupCreate(group) {

    try {

        const contactGroupState = window.appState.contactGroups;

        contactGroupState.push(group);

        await saveDataToDB("contactGroups", cloneObjFromProxy(group));

    } catch (error) {
        console.log(error);
    }


}

//update contact group
async function contactGroupUpdate(group) {

    try {

        const contactGroupState = window.appState.contactGroups;
        const existingIndex = contactGroupState.findIndex(item => item.id === group.id);

        if (existingIndex !== -1) {
            // If contact with the same id exists, update it
            contactGroupState[existingIndex].name = group.name;
            contactGroupState[existingIndex].description = group.description;
            contactGroupState[existingIndex].contact_list = group.contact_list;

            console.log(group.contact_list);

            let contactGroup = contactGroupState[existingIndex];

            await saveDataToDB("contactGroups", cloneObjFromProxy(contactGroup));
        }

    } catch (error) {
        console.log(error);
    }



}


//delete contact group
async function contactGroupDelete(group) {
    try {

        const contactGroupState = window.appState.contactGroups;
        const indexToRemove = contactGroupState.findIndex(item => item.id === group.id);


        if (indexToRemove !== -1) {
            contactGroupState.splice(indexToRemove, 1);
            await deleteDataFromDB("contactGroups", group.id);
        }

    } catch (error) {
        console.log(error);
    }
}





function initializeIntlTelInput(inputField, country = true) {

    const countryArray = localStorage.getItem('country_codes') ? JSON.parse(localStorage.getItem('country_codes')) : [];

    const onlyCountries = countryArray.length && countryArray[service_type]?.length ? countryArray[service_type] : [];

    let config = {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
        separateDialCode: true,
    }

    if (country && onlyCountries.length) {
        config.onlyCountries = onlyCountries;
    }

    let itiInp = intlTelInput(inputField, config);


    iti[itiInp.id] = itiInp;
    $(inputField).closest('.iti').attr('id', 'iti_' + itiInp.id);

}

async function validateNumber(number) {

    let hiddenIti = {};


    // Create a promise to handle the asynchronous initialization
    const initializePromise = new Promise((resolve) => {

        // Create input element
        const input = document.createElement('input');
        input.type = 'tel';
        input.value = number;
        input.id = 'hiddenNumber';

        // Append input element to body
        document.body.appendChild(input);

        let config = {
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
            separateDialCode: true,
        }

        let itiInp = intlTelInput($(input)[0], config);


        hiddenIti[itiInp.id] = itiInp;

        $($(input)[0]).closest('.iti').attr('id', 'iti_' + itiInp.id);

        // Initialize IntlTelInput
        initializeIntlTelInput($(input)[0], false);


        // Resolve the promise after a short delay (you can adjust the delay as needed)
        setTimeout(() => {
            resolve();
        }, 100);

    });

    return initializePromise.then(() => {

        const isNumberValid = hiddenIti[Object.keys(hiddenIti)[0]].isValidNumber();

        // Remove input element
        document.getElementById('hiddenNumber').remove();
        // Remove iti container
        document.getElementById('iti_' + Object.keys(hiddenIti)[0]).remove();



        // Empty iti
        hiddenIti = {};

        return isNumberValid;

    });

}

async function attachContactToThread(contact) {

    //const threads = window.state.threads.items;
    const threads = window.appState.sms.threads.items;

    threads.forEach(thread => {
        thread.participants.forEach(participant => {
            contact.numbers.forEach(phone => {
                if (participant.number == phone.number) {
                    participant.contact_id = contact.id;
                }
            });
        });

        saveDataToDB("threads", cloneObjFromProxy(thread));
    });

    const WhatsAppThreads = window.appState.whatsapp.threads.items;

    WhatsAppThreads.forEach(thread => {
        thread.participants.forEach(participant => {
            contact.numbers.forEach(phone => {
                if (participant.number == phone.number) {
                    participant.contact_id = contact.id;
                }
            });
        });

        saveDataToDB("threads", cloneObjFromProxy(thread));
    });

    //update indexdb phone threads
    const indexPhoneThreads = await db.getAll("phoneThreads");
    if (indexPhoneThreads) {
        indexPhoneThreads.forEach(thread => {
            thread.participants.forEach(participant => {
                contact.numbers.forEach(phone => {
                    if (participant.number == phone.number) {
                        participant.contact_id = contact.id;
                    }
                });
            });

            saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
        });
    }

    //update phoneData threads
    const phoneThreads = window.appState.sms.phoneData.threads;
    for (const key in phoneThreads) {
        phoneThreads[key].items.forEach(thread => {
            thread.participants.forEach(participant => {
                contact.numbers.forEach(phone => {
                    if (participant.number == phone.number) {
                        participant.contact_id = contact.id;
                    }
                });
            });
            saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
        });
    }


    const WhatsAppPhoneThreads = window.appState.whatsapp.phoneData.threads;
    for (const key in WhatsAppPhoneThreads) {
        WhatsAppPhoneThreads[key].items.forEach(thread => {
            thread.participants.forEach(participant => {
                contact.numbers.forEach(phone => {
                    if (participant.number == phone.number) {
                        participant.contact_id = contact.id;
                    }
                });
            });

            saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
        });
    }
}

async function detachContactFromThread(contactId) {

    const threads = window.appState.sms.threads.items;
    threads.forEach(thread => {
        thread.participants.forEach(participant => {
            if (participant.contact_id == contactId) {
                participant.contact_id = 0;
                saveDataToDB("threads", cloneObjFromProxy(thread));
            }
        });
    });

    const WhatsAppThreads = window.appState.whatsapp.threads.items;
    WhatsAppThreads.forEach(thread => {
        thread.participants.forEach(participant => {
            if (participant.contact_id == contactId) {
                participant.contact_id = 0;
                saveDataToDB("threads", cloneObjFromProxy(thread));
            }
        });
    });

    //update phoneData threads
    const phoneThreads = window.appState.sms.phoneData.threads;
    for (const key in phoneThreads) {
        phoneThreads[key].items.forEach(thread => {
            thread.participants.forEach(participant => {
                if (participant.contact_id == contactId) {
                    participant.contact_id = 0;
                    saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
                }
            });
        });
    }

    const WhatsAppPhoneThreads = window.appState.whatsapp.phoneData.threads;
    for (const key in WhatsAppPhoneThreads) {
        WhatsAppPhoneThreads[key].items.forEach(thread => {
            thread.participants.forEach(participant => {
                if (participant.contact_id == contactId) {
                    participant.contact_id = 0;
                    saveDataToDB("phoneThreads", cloneObjFromProxy(thread));
                }
            });
        });
    }

}

//on click add contact
$(document).on('click', '#addContact', async function (e) {

    //rest all iti object
    iti = {};

    const number = $(this).attr('data-add-contact') || '';

    const groups = await _request(APIS.PHONE_TYPES);

    e.preventDefault();

    const modalObject = {
        header: '<h5 class="modal-title">Add Contact</h5>',
        footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" form="addContactForm"> Add </button>',
    }

    //set reef modal modal-xl
    $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');
    //preview fax modal show event

    modalObject.body = `<form class="p-4" id="addContactForm" method="POST">
                            <div class="mb-3">
                                <label for="contactname-input" class="form-label">Name<span class="text-danger">*</span></label>
                                <input type="text" class="form-control bg-dark-subtle" id="contactname-input" placeholder="Enter Name" name="name" required>
                            </div>

                                <div class="mb-3 d-grid">

                                <div class="d-flex justify-content-end">
                                    <input type="radio" class="form-check-input me-2" id="contactphone-checkbox" name="phone_checkbox" checked>
                                    <label for="contactphone-input" class="form-label text-body-secondary">Primary Number</label>
                                </div>

                                <div class="d-flex mb-2">                                                
                                    <div class="d-flex mb-2 me-3" style="width: 120px">
                                        <select class="form-select form-select-sm bg-light border-light" name="phone_type" required>
                                            ${groups.data.map(group => `<option value="${group.id}">${group.name}</option>`)}                                          
                                        </select>
                                    </div>

                                    <div class="d-flex mb-2 w-100">
                                        <input type="tel" class="form-control bg-light border-light number" value="${number}" name="number" required>
                                        <button type="button" class="btn btn-sm btn-success" id="addNumberFieldBtn"><i class="ri-add-fill fs-5"></i></button>
                                    </div>
                                </div>
                                                                    
                                <div id="numberFieldsContainer">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="contactemail-input" class="form-label">Email <span class="text-muted">(Optional)</span>
                                </label>
                                <input type="email" class="form-control bg-dark-subtle" id="contactemail-input" placeholder="Enter Email" name="email">
                            </div>                                            
                        </form>`;

    //show modal
    $('#reefModal').modal('show');

    //preview fax modal show event
    reef.render("#reefModalContent", dynamicModalComponent(modalObject));

    // Initialize intlTelInput for the initial contact input field
    initializeIntlTelInput($('input.number')[0]);

});

$(document).on('click', '#addNumberFieldBtn', function () {

    console.log('addNumberFieldBtn clicked');

    let count = Object.keys(iti).length + 1;
    let maxFields = 10;


    if (count <= maxFields) {
        let newNumberField = `
                                <div class="additional-number">
                                <div class="d-flex justify-content-end">
                                    <input type="radio" class="form-check-input me-2" id="contactphone-checkbox" name="phone_checkbox">
                                    <label for="contactphone-input" class="form-label text-body-secondary">Primary Number</label>
                                </div>

                                <div class="d-flex mb-2 ">
                                    <div class="d-flex mb-2 me-3" style="width: 120px">
                                        <select class="form-select form-select-sm bg-light border-light" name="phone_type">
                                            <option value="1">Mobile</option>
                                            <option value="2">Home</option>
                                            <option value="3">Work</option>
                                            <option value="4">Main</option>
                                            <option value="5">Home Fax</option>

                                        </select>
                                    </div>
                                    <div class="d-flex mb-2 w-100">
                                        <input type="tel" class="form-control bg-light border-light number" name="number" required>
                                            <button type="button" class="btn btn-sm btn-danger removeNumberField"><i class="ri-close-line fs-5"></i></button>
                                    </div>
                                </div>
                                </div>`;
        $("#numberFieldsContainer").append(newNumberField);
        $("#number-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

        // Initialize intlTelInput for the newly added input field
        initializeIntlTelInput($("#numberFieldsContainer input.number").last()[0]);
    }
});

$(document).on("click", ".removeNumberField", function () {


    //if closest name="phone_checkbox" is checked then show alert
    if ($(this).closest(".additional-number").find("input[name='phone_checkbox']").is(":checked")) {
        toast("Primary number cannot be removed", 'danger');
        return;
    }

    let count = (Object.keys(iti).length - 1);
    let maxFields = 10;

    // Remove the iti object with the corresponding id
    delete iti[$(this).prev(".iti").attr("id").replace('iti_', '')];

    $("#number-label").text(`${String(count).padStart(2, '0')}/${maxFields}`);

    $(this).closest(".additional-number").remove();
});

//addContactForm submit event
$(document).on('submit', '#addContactForm', async function (e) {

    e.preventDefault();

    let formData = new FormData($(this)[0]);
    let dataObj = Object.fromEntries(formData.entries());

    let name = dataObj.name;
    let email = dataObj.email;

    //get all phone_type values in an array
    let phone_type = [];
    $('select[name="phone_type"]').each(function () {
        phone_type.push($(this).val());
    });

    let phone_checkbox = [];
    $('input[name="phone_checkbox"]').each(function () {
        phone_checkbox.push($(this).is(':checked') ? 1 : 0);
    });


    let hasInvalidNumber = false;

    for (const key in iti) {
        if (!iti[key].isValidNumber()) {
            $('#iti_' + key + ' input').addClass('error-message');
            hasInvalidNumber = true;
        } else {
            $('#iti_' + key + ' input').removeClass('error-message');
        }
    }

    if (hasInvalidNumber) {
        toast("Please enter a valid phone number", 'danger', 5000);
        return;
    }

    const numbers = [];

    let index = 0;
    for (const key in iti) {
        numbers.push({
            number: iti[key].getNumber(),
            is_primary: phone_checkbox[index],
            phone_type: phone_type[index]
        });
        index++;
    }

    let data = {
        name,
        email,
        numbers
    }


    try {

        // set button to processing
        $('button[form="addContactForm"]').attr('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...');

        const response = await _request(APIS.CONTACT_CREATE, 'POST', data);

        //save to indexedDB
        await saveContact(response.data);

        toast('Contact added successfully', 'success');

        $('#reefModal').modal('hide');

    } catch (e) {


        //reset button
        $('button[form="addContactForm"]').attr('disabled', false).html('Add');

        //log error message
        console.log(e);
    }


});

//on edit contact
$(document).on('click', '[data-edit-contact]', async function (e) {

    //rest all iti object
    iti = {};

    e.preventDefault();

    const contactId = $(this).data('edit-contact');
    const contact = window.appState.contacts.find(contact => contact.id === contactId);
    if (contact) {

        const groups = await _request(APIS.PHONE_TYPES);

        const modalObject = {
            header: '<h5 class="modal-title">Edit Contact</h5>',
            footer: '<button type="button" class="btn btn-link" data-bs-dismiss="modal">Close</button>' + '<button type="submit" class="btn btn-primary" form="updateContactForm"> Update </button>',
        }

        //set reef modal modal-xl
        $('#reefModal .modal-dialog').addClass('modal-dialog modal-dialog-centered modal-md');
        //preview fax modal show event
        modalObject.body = `<form class="p-4" id="updateContactForm" method="POST">
                    <input type="hidden" name="id" value="${contact.id}">
                    <div class="mb-3">
                        <label for="contactname-input" class="form-label">Name<span class="text-danger">*</span></label>
                        <input type="text" class="form-control bg-dark-subtle" id="contactname-input" placeholder="Enter Name" name="name" required value="${contact.name}">
                    </div>

        ${contact.numbers.map((number, index) => {

            let checked = number.is_primary ? 'checked' : '';

            return `<div class="d-grid ${index === 0 ? '' : 'additional-number'}">
            
                        <div class="d-flex justify-content-end">
                            <input type="radio" class="form-check-input me-2" id="contactphone-checkbox" name="phone_checkbox" ${checked}>
                            <label for="contactphone-input" class="form-label text-body-secondary">Primary Number</label>
                        </div>

                        <div class="d-flex mb-2">                           
                            <div class="d-flex mb-2 me-3" style="width: 120px">
                                <select class="form-select form-select-sm bg-light border-light" name="phone_type" required>
                                    ${groups.data.map(group => `<option value="${group.id}" ${number.phone_type === group.id ? 'selected' : ''}>${group.name}</option>`).join('')}                                        
                                </select>
                            </div>

                            ${index === 0 ? `<div class="d-flex mb-2 w-100">
                                <input type="tel" class="form-control bg-light border-light number" name="number" required value="${number.number}">
                                <button type="button" class="btn btn-sm btn-success" id="addNumberFieldBtn"><i class="ri-add-fill fs-5"></i></button>
                            </div>` : `<div class="d-flex mb-2 w-100">
                                <input type="tel" class="form-control bg-light border-light number" name="number" required value="${number.number}">
                                <button type="button" class="btn btn-sm btn-danger removeNumberField"><i class="ri-close-line fs-5"></i></button>
                            </div>`}
            
                        </div>                                                                   
                        
                </div>`;

        }).join('')}
    
                    <div class="mb-3">
                        <div id="numberFieldsContainer">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="contactemail-input" class="form-label">Email <span class="text-muted">(Optional)</span>
                        </label>
                        <input type="email" class="form-control bg-dark-subtle" id="contactemail-input" placeholder="Enter Email" name="email" value="${contact.email}">
                    </div>                                            
                </form>`;

        //show modal
        $('#reefModal').modal('show');

        //preview fax modal show event
        reef.render("#reefModalContent", dynamicModalComponent(modalObject));

        // Initialize intlTelInput for the initial contact input field

        contact.numbers.forEach((number, index) => {
            initializeIntlTelInput($('input.number')[index]);
        });

    }
});

//updateContactForm submit event
$(document).on('submit', '#updateContactForm', async function (e) {

    e.preventDefault();

    let formData = new FormData($(this)[0]);
    let dataObj = Object.fromEntries(formData.entries());

    let contactId = dataObj.id;
    let name = dataObj.name;
    let email = dataObj.email;

    //get all phone_type values in an array
    let phone_type = [];
    $('select[name="phone_type"]').each(function () {
        phone_type.push($(this).val());
    });

    let phone_checkbox = [];
    $('input[name="phone_checkbox"]').each(function () {
        phone_checkbox.push($(this).is(':checked') ? 1 : 0);
    });


    let hasInvalidNumber = false;

    for (const key in iti) {
        if (!iti[key].isValidNumber()) {
            $('#iti_' + key + ' input').addClass('error-message');
            hasInvalidNumber = true;
        }
    }

    if (hasInvalidNumber) {
        toast("Please enter a valid phone number", 'danger', 5000);
        return;
    }

    const numbers = [];

    let index = 0;
    for (const key in iti) {
        numbers.push({
            number: iti[key].getNumber(),
            is_primary: phone_checkbox[index],
            phone_type: phone_type[index]
        });
        index++;
    }


    //if not unique
    if (numbers.length !== new Set(numbers.map(number => number.number)).size) {
        toast("One or more phone numbers are same", 'danger', 5000);
        return;
    }

    let data = {
        name,
        email,
        numbers
    }

    try {

        // set button to processing
        $('button[form="updateContactForm"]').attr('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...');

        const response = await _request(APIS.CONTACT_UPDATE + '/' + contactId, 'POST', data);

        await updateContact(response.data);

        toast('Contact updated successfully', 'success');

        $('#reefModal').modal('hide');

    } catch (e) {

        console.log(e);
    } finally {

        // set button to normal
        $('button[form="updateContactForm"]').attr('disabled', false).html('Update');
    }

});

//reef modal
$(document).on('hidden.bs.modal', '#reefModal', () => {

    $('#reefModalContent').html('');
    //remove modal-lg , modal-sm, modal-xl
    $('#reefModal .modal-dialog').removeClass('modal-lg modal-sm modal-xl');

});