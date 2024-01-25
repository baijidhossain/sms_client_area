function contactListTemplate() {


    let state = window.state;

    let contactsState = state.contacts;

    let contacts = [];

    contacts = contactsState.map(item => {
        let primary_number = null;

        primary_number = item.numbers.filter(
            r => r.hasOwnProperty('is_primary') && r.is_primary === 1 ? r : 0
        );

        if (primary_number.length === 0) {
            primary_number = item.numbers[0].number;
        } else {
            primary_number = primary_number[0].number;
        }

        return {
            id: item.id,
            name: item.name,
            email: item.email,
            primary_number: primary_number,
            numbers: item.numbers
        };
    });

    //load contacts from filtered contacts
    if (state.contacts.SearchQuery && state.contacts.SearchQuery.length !== 0) {
        //filter contacts by search query
        contacts = contacts.filter(
            r => r.name.toLowerCase().includes(state.contacts.SearchQuery) || r?.primary_number?.includes(state.contacts.SearchQuery)
        );
    } 

    // check for selected group
    if(state.SelectedGroupId && state.SelectedGroupId !== 0) {
        let group = state.groups.find(r => r.id === state.SelectedGroupId);

        if(group) {
            let contact_ids = group.contact_list;
            contacts = contacts.filter(contact => contact_ids.includes(contact.id));
        }
    }

    //for each to contacts

    let html = '';

    contacts.forEach(item => {


        //get contact group names
        let contact_groups = state.groups.filter(group => group.contact_list.includes(item.id));


        let groups = "";
        //names array
        let contact_group_names = contact_groups.map(group => group.name);

        //take first 3
        let first_three_items = contact_group_names.slice(0, 3);

        first_three_items.forEach(name => {
            groups += `<span class="badge bg-secondary
             me-1">${name}</span>`;
        });

        //if more than 3
        if (contact_group_names.length >= 4) {
            groups += `<span class="badge text-dark
             me-1">+${contact_group_names.length - 3} more</span>`;
        }




        html += `
             <tr key="${item.id}">
             
                <th class="ps-4">
                    <input type="checkbox" class="form-check-input mt-2" name="contact_checkbox" value="${item.id}">
                </th>

                <td>
                    <a href="/contacts/${item.id}" class="text-body fw-bold">
                          <div class="avatar-xs profile-user rounded-circle bg-primary-subtle me-3">
                        <span class="avatar-title text-primary bg-transparent">
                          <i class="ri-user-line align-middle"></i>
                        </span>
                    </div>
                    ${
            //regex to highlight search query
            item.name.replace(
                new RegExp(state.contacts.SearchQuery, 'gi'),
                match => `<span class="text-primary">${match}</span>`
            )}
                    </a>
                </td>


                <td class="pt-3">
                    <a href="/contacts/${item.id}" class="text-body">
                     ${item['email'] ? item['email'] : '<small class="fst-italic text-secondary">N/A</small>'}
                    </a>
                </td>
                <td class="pt-3">
                 <a href="/contacts/${item.id}" class="text-body">

                    ${
            //shown n/a id not exist and regex to highlight search query
            item.primary_number ? item.primary_number.replace(
                new RegExp(state.contacts.SearchQuery, 'gi'),
                match => `<span class="text-primary">${match}</span>`
            ) : '<small class="fst-italic text-secondary">N/A<small>'
            }

                    </a>
                </td>

                <td class="pt-3">
                    <a href="/contacts/${item.id}" class="text-body">

                    ${groups}

                    </a>
                </td>




                <td class="text-end pe-5 pt-2">
                    <div class="d-flex justify-content-end">

                        <a href="/contacts/${item.id}" type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" data-bs-title="View Contact">
                            <i class="ri-eye-line align-middle"></i>
                        </a>
                    
                        <button type="button" class="btn btn-outline-info btn-sm ms-2" data-send-message="${item.primary_number}" data-bs-toggle="tooltip" data-bs-title="Send Message">
                            <i class="ri-message-line align-middle"></i>
                        </button>

                        <button type="button" class="btn btn-outline-primary btn-sm ms-2" data-edit-contact="${item.id}" data-bs-toggle="tooltip" data-bs-title="Edit Contact">
                            <i class="ri-edit-2-line align-middle"></i>
                        </button>

                        <button type="button" class="btn btn-outline-danger btn-sm ms-2" data-delete-contact="${item.id}" data-bs-toggle="tooltip" data-bs-title="Delete Contact">
                            <i class="ri-delete-bin-6-line align-middle"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

    });

    return html;



}

function contactGroupsTemplate() {
    // return contactGroups list
    return window.state.groups.map(item => {
        return `<div class="align-items-center btn btn-sm group mb-2 p-2 position-relative px-3 rounded-3 text-body w-100 item
        ${window.state.SelectedGroupId === item.id ? 'bg-primary-subtle' : ''}
        " key="${item.id}">

            <div class="d-flex justify-content-between" data-groupId="${item.id}">
                <span class="d-flex align-items-center">
                    <i class="ri-group-line me-2"></i>
                    <p class="fw-bold mb-0">${item.name}</p>
                </span>
                <div>
                    <span class="badge bg-primary ms-auto">${item.contact_list.length}</span>
                </div>
            </div>

            <div class="actions bg-body end-0 position-absolute rounded-5 top-0 d-block d-md-none">

                <button class="btn btn-outline-primary btn-sm rounded-5" data-edit-group="${item.id}">
                    <i class="ri-edit-line"></i>
                </button>

                <button class="btn btn-outline-danger btn-sm rounded-5" data-delete-group="${item.id}">
                    <i class="ri-delete-bin-line"></i>
                </button>

            </div>


        </div>`;
    }).join('');
}

function contactCountComponent() {

    let count = window.state.contacts.length;

    return `<span class="badge bg-primary ms-auto">${count}</span>`;

}