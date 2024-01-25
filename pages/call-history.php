<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?> | Call History</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="<?= APP_URL ?>/public/images/favicon.ico">

    <!-- magnific-popup css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" />

    <!-- remixicon css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css">

    <!-- intlTelInput css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/css/intlTelInput.css" />

    <!-- Bootstrap Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/bootstrap.min.css" />

    <!-- App Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/app.min.css" />

    <!-- Custom Css-->
    <link rel="stylesheet" href="<?= APP_URL ?>/public/css/style.css?v=<?= APP_VER ?>" />

    <script>
        window.ipbxapi_host = "<?= base64_encode(API_HOST) ?>";
        window.ipbxapi_serviceType = "voice";
    </script>

    <style>
        /* @media (min-width: 768px) */
        .chat-leftsidebar.full {
            overflow-y: auto;
        }

        @media screen and (min-width: 768px) {
            .chat-leftsidebar.full {
                min-width: calc(100% - 75px);
                max-width: calc(100% - 75px);
            }

            .search-box.chat-search-box {
                max-width: 300px;
            }
        }

        table tr>td,
        th {
            white-space: nowrap;
        }

        table thead>tr>th {
            background-color: var(--bs-primary-bg-subtle) !important;
            --bs-text-opacity: 1;
            color: rgba(var(--bs-primary-rgb), var(--bs-text-opacity)) !important;
        }

        .btn {
            border-color: unset !important;
        }
    </style>

</head>

<body>

    <div class="loader-container" id="loader">
        <div class="bg-light">
            <div class="text-center">
                <div class="loader"> <span></span> <span></span> </div>
            </div>
        </div>
    </div>

    <div class="layout-wrapper d-md-flex overflow-hidden">

        <!-- Start left sidebar-menu -->
        <?php include_once 'layouts/sidebar.php'; ?>
        <!-- end left sidebar-menu -->

        <!-- start chat-leftsidebar -->
        <div class="chat-leftsidebar full ms-lg-0">

            <div class="px-3 pt-4">
                <div class="align-items-center d-flex justify-content-between mb-4">

                    <div class="d-flex">
                        <button class="border-0 menu-icon d-block d-md-none me-2">
                            <i class="ri-menu-3-line"></i>
                        </button>
                        <h4 class="pt-1">Call History</h4>
                    </div>

                    <div class="search-box chat-search-box">
                        <div class="input-group">
                            <button class="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#callRecordsFilterCollapse" aria-expanded="false" aria-controls="callRecordsFilterCollapse"><i class="ri-filter-3-line"></i> Filter</button>
                        </div>

                    </div>

                </div>

                <!-- End search-box -->
            </div>
            <!-- end p-4 -->


            <div class="px-3">
                <form method="POST" id="callHistoryFilterForm">
                    <div class="collapse" id="callRecordsFilterCollapse">
                        <div class="card card-body">
                            <div class="row justify-content-center">
                                <div class="col-xl-3">
                                    <div class="mb-3">
                                        <label class="form-label">Direction</label>
                                        <select class="form-control" name="direction">
                                            <option value="">-Select-</option>
                                            <option value="inbound">Incoming</option>
                                            <option value="outbound">Outgoing</option>
                                            <option value="local">Ext2Ext</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Start Range</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <input type="date" class="form-control" name="start_stamp_begin" value="" placeholder="From">
                                            </div>
                                            <div class="col-6">
                                                <input type="date" class="form-control" name="start_stamp_end" value="" placeholder="To">
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                <div class="col-xl-3">

                                    <div class="mb-3">
                                        <label class="form-label">Extension</label>
                                        <select class="form-control" name="extension" id="extension">
                                            <option value="">-Select-</option>

                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Status</label>
                                        <select class="form-control" name="status">
                                            <option value="">-Select-</option>
                                            <option value="answered">Answered</option>
                                            <option value="missed">Missed</option>
                                            <option value="voicemail">Voicemail</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>

                                </div>

                                <div class="col-xl-3">

                                    <div class="mb-3">
                                        <label class="form-label">Caller</label>
                                        <input type="text" class="form-control" name="caller" value="">
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Hangup Cause</label>
                                        <?php
                                        $status_options = array(
                                            'NORMAL_CLEARING',
                                            'ORIGINATOR_CANCEL',
                                            'BLIND_TRANSFER',
                                            'LOSE_RACE',
                                            'NO_ANSWER',
                                            'NORMAL_UNSPECIFIED',
                                            'NO_USER_RESPONSE',
                                            'NO_ROUTE_DESTINATION',
                                            'SUBSCRIBER_ABSENT',
                                            'NORMAL_TEMPORARY_FAILURE',
                                            'ATTENDED_TRANSFER',
                                            'PICKED_OFF',
                                            'USER_BUSY',
                                            'CALL_REJECTED',
                                            'INVALID_NUMBER_FORMAT',
                                            'NETWORK_OUT_OF_ORDER',
                                            'DESTINATION_OUT_OF_ORDER',
                                            'RECOVERY_ON_TIMER_EXPIRE',
                                            'MANAGER_REQUEST',
                                            'MEDIA_TIMEOUT',
                                            'UNALLOCATED_NUMBER',
                                            'NONE',
                                            'EXCHANGE_ROUTING_ERROR',
                                            'ALLOTTED_TIMEOUT',
                                            'CHAN_NOT_IMPLEMENTED',
                                            'INCOMPATIBLE_DESTINATION',
                                            'USER_NOT_REGISTERED',
                                            'SYSTEM_SHUTDOWN',
                                            'MANDATORY_IE_MISSING',
                                            'REQUESTED_CHAN_UNAVAIL'
                                        );
                                        sort($status_options);
                                        ?>
                                        <select class="form-control" name="hangup_cause">
                                            <option value="">-Select-</option>
                                            <?php
                                            foreach ($status_options as $status) :
                                                $selected = ($_GET['hangup_cause'] == $status) ? "selected='selected'" : null;
                                                $cdr_status_label = ucwords(strtolower(str_replace("_", " ", $status)));
                                                echo " <option value='" . $status . "' " . $selected . ">" . $cdr_status_label . "</option>\n";
                                            endforeach; ?>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-xl-3">
                                    <div class="mb-3">
                                        <label class="form-label">Destination</label>
                                        <input type="text" class="form-control" name="destination" value="">
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div>
                                                <label class="form-label">&nbsp;</label>
                                                <button type="submit" class="btn btn-primary w-100" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">Search</button>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">&nbsp;</label>
                                                <button id="resetBtn" type="reset" class="btn w-100 text-nowrap" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">Reset</button>
                                            </div>
                                        </div>

                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </form>

                <div class="table-responsive rounded" method="POST">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Ext.</th>
                                <th>Caller</th>
                                <th>Destination</th>
                                <th>Recording</th>
                                <th>Date Time</th>
                                <th>Ring Time</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Hangup Cause</th>
                            </tr>
                        </thead>
                        <tbody id="call-records">


                        </tbody>
                    </table>

                </div>
            </div>

        </div>
        <!-- end chat-leftsidebar -->


    </div>

    <!-- scroll to top -->
    <button class="scroll-bottom-btn me-3 me-lg-4 d-none">
        <i class="ri-arrow-down-line"></i>
    </button>
    <!-- scroll to top -->


    <div class="modal fade" id="reefModal" tabindex="-1" aria-labelledby="reefModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content" id="reefModalContent">
            </div>
        </div>
    </div>



    <!-- JAVASCRIPT CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js"></script>
    <!-- ReefJS -->
    <script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>

    <!-- intlTelInput -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/intlTelInput.min.js"></script>
    <!-- use xlsx.mini.min.js from version 0.20.1 -->
    <script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.mini.min.js"></script>

    <!-- image compressor -->
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js">
    </script>

    <!-- idb library -->
    <script src="https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.min.js"></script>
    <!-- database init -->
    <script src="<?= APP_URL ?>/public/js/database.js?v=<?= APP_VER ?>"></script>
    <!-- page common components -->
    <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>

    <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>

    <!-- page init -->
    <script src="<?= APP_URL ?>/public/js/app.js?v=<?= APP_VER ?>"></script>
    <script>
        let spinner = `<div class="spinner-border spinner-border-sm" role="status">
                             <span class="visually-hidden">Loading...</span>
                            </div>`;
    </script>

    <script>
        async function initPageData() {

            let result = await _request(APIS.CALL_DETAIL_RECORDS);

            if (result.data == null) {
                window.location.href = "/";
                return;
            }

            window.pageState = reef.signal({
                'hasMore': true,
                'records': result.data.items,
                'searchTerm': {}
            });

            reef.component('#call-records', callDetailRocordsTemplate);
            $('.loader-container').hide();


            // load more threads when scrolling threads list
            detectScrollToOffset('.chat-leftsidebar', 100, 'bottom', () => {
                loadMoreRecords();
            });

            const extensionSelect = $("#extension");

            if (result.data.extensions.length > 0) {
                // Loop through the extension data and create option tags
                $.each(result.data.extensions, function(index, extension) {

                    let ext = Number.isInteger(parseInt(extension.extension)) ? extension.extension : extension.number_alias ?? '' + " (" + extension.extension + ")";

                    const option = $("<option>")
                        .val(extension.extension_uuid)
                        .text(ext);

                    // Append the option to the select element
                    extensionSelect.append(option);
                });
            }

            $('#callHistoryFilterForm').on('submit', callHistoryFilterFormSubmit);

            $(document).on('click', '#call-records [data-downloadRecordId]', downloadRecording);

            $(document).on('click', '#call-records [data-playRecordId]', playRecording);

            $(document).on('click', '#resetBtn', async function() {
                $('#callHistoryFilterForm')[0].reset();
                window.pageState.searchTerm = {};
                let result = await _request(APIS.CALL_DETAIL_RECORDS);
                if (result.data != null && result.data.items.length > 0) {
                    window.pageState.records = result.data.items;
                }
            });

        }

        async function playRecording() {

            let recording_id = this.getAttribute('data-playRecordId');

            try {

                let audio = $("#recording_audio_" + recording_id + "")[0];

                if (audio.paused) {

                    $(this).html(spinner);

                    // Check if the audio has a stored position
                    let storedPosition = parseFloat(audio.getAttribute('data-playback-position')) || 0;

                    $('audio').each(function() {
                        if ($(this).get(0) != audio) {
                            $(this).get(0).pause(); //stop playing
                            $(this).get(0).currentTime = 0; //reset time
                            storedPosition = 0;
                            $(this).next('[data-playRecordId]').html('<i class="ri-play-fill"></i>');
                        }
                    });

                    if (storedPosition > 0) {
                        audio.currentTime = storedPosition;
                    } else {

                        if (!audio.src) {

                            const result = await _request(APIS.CALL_RECORDINGS + '/' + recording_id, "GET", {}, false, 'blob');
                            let blob = new Blob([result], {
                                type: result.type,
                            });
                            let blobUrl = window.URL.createObjectURL(blob);
                            audio.src = blobUrl;

                            $(this).html('<i class="ri-pause-fill"></i>');
                        }

                    }

                    // If audio is paused, play it
                    $(this).html('<i class="ri-pause-fill"></i>');

                    audio.play();

                } else {
                    // If audio is playing, pause it
                    audio.pause();
                    $(this).html('<i class="ri-play-fill"></i>');
                    // Store the current playback position
                    audio.setAttribute('data-playback-position', audio.currentTime);
                }

                $(audio).on('ended', function() {
                    // Update button icon to play after playback ends
                    $(this).next('[data-playRecordId]').html('<i class="ri-play-fill"></i>');
                    // Reset the stored playback position
                    audio.setAttribute('data-playback-position', 0);
                });

            } catch (e) {
                console.log(e);
            }
        }

        async function downloadRecording() {

            let recording_id = this.getAttribute('data-downloadRecordId');
            let audio = $("#recording_audio_" + recording_id + "")[0];

            try {

                $(this).html(spinner);

                let blobUrl="";

                if (!audio.src) {
                    const result = await _request(APIS.CALL_RECORDINGS + '/' + recording_id, "GET", {}, false, 'blob')

                    let blob = new Blob([result], {
                        type: result.type,
                    });

                    blobUrl = window.URL.createObjectURL(blob);
                    audio.src = blobUrl;

                }else{
                    blobUrl = audio.src
                }

                let link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', recording_id.split('/').pop());
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);

            } catch (e) {
                console.log(e);
            } finally {
                $(this).html(`<i class="ri-download-line"></i>`);
            }

        }

        async function callHistoryFilterFormSubmit(e) {

            e.preventDefault();

            const formData = new FormData(e.target);
            let formEntries = Object.fromEntries(formData.entries());

            // start_stamp_begin date not grater than start_stamp_end
            if (formEntries.start_stamp_begin && formEntries.start_stamp_end && formEntries.start_stamp_begin > formEntries.start_stamp_end) {
                toast("Invalid start range", 'danger', 5000);
                return;
            }

            formEntries.timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone

            try {

                const fetchSearchResult = await _request(APIS.CALL_DETAIL_RECORDS, 'GET', formEntries);

                window.pageState.searchTerm = formEntries;

                if (fetchSearchResult.data.items.length > 0) {
                    window.pageState.records = fetchSearchResult.data.items;
                    window.pageState.hasMore = true;
                } else {
                    window.pageState.records = [];
                }

            } catch (e) {
                console.log(e);
            }

        }

        async function loadMoreRecords() {

            let records = window.pageState.records;
            const lastEpoc = records.length > 0 ? records[records.length - 1].start_epoch : 0;
            let hasMore = window.pageState.hasMore;

            if (hasMore) {
                try {
                    const lastStartEpoc = records.length > 0 ? records[records.length - 1].start_epoch : lastEpoc;

                    let searchParams = window.pageState.searchTerm;
                    searchParams.start_epoch = lastStartEpoc;

                    const fetchRecords = await _request(APIS.CALL_DETAIL_RECORDS, 'GET', searchParams);

                    if (fetchRecords.data.items.length > 0) {
                        window.pageState.records = [...records, ...fetchRecords.data.items];
                    } else {
                        window.pageState.hasMore = false;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }

        function callDetailRocordsTemplate() {

            let html = '';

            let call_records = window.pageState.records;

            call_records.forEach(record => {

                let icon = '';

                let direction_status = record.direction + '_' + (record.status).toLowerCase();

                switch (direction_status) {
                    case "outbound_answered":
                        icon = `<i class="ri-arrow-right-up-line text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${capitalizeWords(record.direction) +': '+record.status}"></i>`;
                        break;
                    case "inbound_answered":
                        icon = `<i class="ri-arrow-right-down-line text-info" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${capitalizeWords(record.direction) +': '+record.status}"></i>`;
                        break;
                    case "inbound_voicemail":
                        icon = `<i class="ri-arrow-right-down-line text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${capitalizeWords(record.direction) +': '+record.status}"></i>`;
                        break;
                    case "local_voicemail":
                        icon = `<i class="ri-contract-left-right-fill text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${capitalizeWords(record.direction) +': '+record.status}"></i>`;
                        break;
                    case "outbound_failed":
                        icon = `<i class="ri-arrow-right-up-line text-dark" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${capitalizeWords(record.direction) +': '+record.status}"></i>`;
                        break;
                        // No default case
                }


                //set destination
                let destination = '';
                let destination_number = record.destination_number;
                let caller_destination = record.caller_destination;
                let hangup_cause = record.hangup_cause.replaceAll('_', ' ').toLowerCase();


                if (destination_number == caller_destination) {
                    destination = "<span class='fw-semibold'>" + destination_number + "</span>";
                } else if (destination_number.substring(1) == caller_destination) {
                    destination = "<span class='fw-semibold'>" + destination_number + "</span>";
                } else {
                    destination = "<span class='fw-semibold'>" + destination_number + "</span>" + (caller_destination ? " <i>(" + caller_destination + ")</i>" : '');
                }

                //set caller
                let caller = record.caller_id_name ? ("<span class='fw-semibold'>" + record.caller_id_name + "</span>") + ' <i>(' + record.caller_id_number + ')</i>' : "<span class='fw-semibold'>" + record.caller_id_number + "</span>";

                html += `<tr key="${record.xml_cdr_uuid}">
                <td>${icon}</td>
                <td>${record.extension ?? ''}</td>
                <td>${caller}</td>
                <td>${destination}</td>
                <td>${record.has_record ? `
                    <audio id="recording_audio_${record.xml_cdr_uuid}" class="d-none" preload='none'></audio>
                    <button data-playRecordId="${record.xml_cdr_uuid}" class='btn btn-sm bg-dark text-white'><i class="ri-play-fill"></i></button> 
                    <button data-downloadRecordId="${record.xml_cdr_uuid}" class='btn btn-sm bg-dark text-white'><i class="ri-download-line"></i></button>` : ''}</td>
                <td>${ UTCToLocalDate(record.start_epoch, 'M d, Y • h:i a') }</td>
                <td>${record.ring_time ?? ''}</td>
                <td>${record.seconds}</td>
                <td>${record.status ?? ''}</td>
                <td>${capitalizeWords(hangup_cause)}</td>

                </tr>`;
            });

            call_records.length == 0 ? html = `<tr><td colspan="12">
            <div class="no-data-container">
                <p class="no-data-text text-center p-1 mb-0">No Data Found</p>
            </div>
            </td></tr>` : '';


            return html;
        }

        function capitalizeWords(inputString) {
            // Split the input string into an array of words
            let words = inputString.split(' ');

            // Capitalize the first character of each word
            let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

            // Join the capitalized words back into a string
            let resultString = capitalizedWords.join(' ');

            return resultString;
        }
    </script>
</body>


</html>