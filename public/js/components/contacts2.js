function contactListTemplate() {

    let state = window.appState;

    let contacts = [];

    //load contacts from filtered contacts
    if (state.contacts.SearchQuery && state.contacts.SearchQuery.length !== 0) {

        contacts = state.contacts.filter(
            r => r.name.toLowerCase().includes(state.contacts.SearchQuery) || r.primary_number.toLowerCase().includes(state.contacts.SearchQuery)
        );

    } else {
        contacts = state.contacts;
    }

    //for each to contacts

    let html = '';


    contacts.forEach(item => {



        html += `
             <tr>
             
                <th class="ps-4">
                    <input type="checkbox" class="form-check-input" name="contact_checkbox" value="${item.id}">
                </th>

                <td>
                    <div class="avatar-xs profile-user rounded-circle bg-primary-subtle me-3">
                        <span class="avatar-title text-primary bg-transparent">
                            <i class="ri-phone-line"></i>
                        </span>
                    </div>
                    ${
            //regex to highlight search query
            item.name.replace(
                new RegExp(state.contacts.SearchQuery, 'gi'),
                match => `<span class="text-primary">${match}</span>`
            )}
                </td>
                <td>
                    ${item['email'] ? item['email'] : 'N/A'}
                </td>
                <td>
                   ${
            //regex to highlight search query

            //get the primary number from multiple numbers where is_primary is 1
            item.primary_number = item.numbers.filter(
                r => r.is_primary === 1
            )[0].number,

            item.primary_number.replace(
                new RegExp(state.contacts.SearchQuery, 'gi'),
                match => `<span class="text-primary">${match}</span>`
            )

            }
                </td>
                <td class="text-end pe-5">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-outline-info btn-sm ms-2" data-send-message="${item.primary_number}">
                            <i class="ri-message-line align-middle"></i>
                        </button>

                        <button type="button" class="btn btn-outline-primary btn-sm ms-2" data-edit-contact="${item.id}">
                            <i class="ri-edit-2-line align-middle"></i>
                        </button>

                        <button type="button" class="btn btn-outline-danger btn-sm ms-2" data-delete-contact="${item.id}">
                            <i class="ri-delete-bin-6-line align-middle"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

    });

    return html;



}