<!doctype html>
<html lang="en">

<head>

    <meta charset="utf-8" />
    <title><?= SITE_TITLE ?></title>
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

        /* laptop */
        @media screen and (min-width: 1400px) and (max-width: 1599px) {
            /* data-widget="Messages" */



            .coun-box h2 {
                font-size: 19px;
            }

            .coun-box h4 {
                font-size: 15px;
            }

        }

        @media screen and (max-width: 1399px) {
            /* data-widget="Messages" */

            .card h5.card-header {
                font-size: 0.9rem !important;
            }

            [data-widget="Messages"] h2 {
                font-size: 2.03rem;
            }

            [data-widget="Messages"] p {
                font-size: 0.8rem;
            }

            .card .card-header h5 {
                font-size: 1rem !important;
            }

            .coun-box h2 {
                font-size: 19px;
            }

            .coun-box h4 {
                font-size: 14px;
            }

        }


        @media screen and (max-width: 1199px) {

            /* data-widget="Messages" */
            [data-widget="Messages"] h2 {
                font-size: 1.5rem !important;
            }
        }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

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
                        <h4 class="pt-1">Dashboard</h4>
                    </div>
                </div>
            </div>



            <div class="px-3">


                <section class="row" id="countsComponent">

                </section>

                <div class="row">
                    <div class="col-xl-9 col-lg-12">

                        <div class="card d-none" data-widget="Sms">
                            <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">
                                <div>
                                    <i class="ri-message-3-fill text-primary"></i> SMS Graph
                                </div>

                                <div class="d-flex fs-5">
                                    <button class="btn btn-sm" data-action="refresh" data-bs-toggle="tooltip" data-bs-title="Refresh">
                                        <i class="ri-loop-left-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#SmsGraph" aria-expanded="true">
                                        <i class="ri-arrow-down-s-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-action="remove" data-bs-toggle="tooltip" data-bs-title="Remove">
                                        <i class="ri-close-fill"></i>
                                    </button>
                                </div>

                            </h5>
                            <div class="card-body collapse show" id="SmsGraph">

                                <div class="d-flex justify-content-end mb-4 mb-md-0">

                                    <div class="me-2" style="width: 130px;">

                                        <select class="form-select form-select-sm me-2" data-select="service">
                                            <option value="0">All Service</option>
                                        </select>

                                    </div>

                                    <div style="width: 130px;">
                                        <select class="form-select form-select-sm" data-select="period"></select>
                                    </div>
                                </div>

                                <div style="height: 341px">
                                    <canvas id="smsChart"></canvas>
                                </div>



                            </div>
                        </div>
                    </div>


                    <div class="col-xl-3 col-lg-12">
                        <div class="card d-none" data-widget="Messages">
                            <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">
                                <div>
                                    <i class="ri-message-3-fill text-primary"></i>
                                    Messages
                                </div>
                                <div class="d-flex fs-5">
                                    <button class="btn btn-sm" data-action="refresh" data-bs-toggle="tooltip" data-bs-title="Refresh">
                                        <i class="ri-loop-left-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#Messages" aria-expanded="true">
                                        <i class="ri-arrow-down-s-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-action="remove" data-bs-toggle="tooltip" data-bs-title="Remove">
                                        <i class="ri-close-fill"></i>
                                    </button>
                                </div>
                            </h5>
                            <div class="card-body collapse show" id="Messages">

                                <div class="mb-4 fw-bold">
                                    <i class="ri-arrow-down-line"></i> Incoming
                                </div>

                                <div class="mb-4">
                                    <div class="row">
                                        <div class="col-6">

                                            <div class="bg-body-secondary ps-4 ps-xl-3  ps-xxl-4 py-4 rounded-4">
                                                <h2>
                                                    <span id="inboundToday">0</span>
                                                </h2>

                                                <p class="mb-0">
                                                    Today
                                                </p>
                                            </div>

                                        </div>

                                        <div class="col-6">

                                            <div class="bg-body-secondary ps-4 ps-xl-3  ps-xxl-4 py-4 rounded-4">
                                                <h2>
                                                    <span id="inboundThisMonth">0</span>
                                                </h2>

                                                <p class="mb-0">
                                                    This Month
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div class="mb-4">
                                    <div class="mb-4 fw-bold">
                                        <i class="ri-arrow-up-line"></i> Outgoing
                                    </div>

                                    <div class="row">
                                        <div class="col-6">

                                            <div class="bg-body-secondary ps-4 ps-xl-3  ps-xxl-4 py-4 rounded-4">
                                                <h2>
                                                    <span id="outboundToday">0</span>
                                                </h2>

                                                <p class="mb-0">
                                                    Today
                                                </p>
                                            </div>

                                        </div>

                                        <div class="col-6">

                                            <div class="bg-body-secondary ps-4 ps-xl-3  ps-xxl-4 py-4 rounded-4">
                                                <h2>
                                                    <span id="outboundThisMonth">0</span>
                                                </h2>

                                                <p class="mb-0">
                                                    This Month
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>


                <section class="row d-none" id="voiceStatistics">

                </section>

                <div class="row d-none" id="callLogRow">

                    <div class="col-xl-9 col-lg-12">

                        <div class="card" data-widget="CallSummary">
                            <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">

                                <div>
                                    <i class="ri-phone-fill text-primary"></i> Call Summary
                                </div>

                                <div class="d-flex fs-5">
                                    <button class="btn btn-sm" data-action="refresh" data-bs-toggle="tooltip" data-bs-title="Refresh">
                                        <i class="ri-loop-left-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#CallSummary" aria-expanded="true">
                                        <i class="ri-arrow-down-s-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-action="remove" data-bs-toggle="tooltip" data-bs-title="Remove">
                                        <i class="ri-close-fill"></i>
                                    </button>
                                </div>
                            </h5>
                            <div class="card-body collapse show" id="CallSummary">

                                <div class="d-flex justify-content-end mb-4 mb-md-0">
                                    <div class="me-2" style="width: 130px;">
                                        <select class="form-select form-select-sm" data-select="service">
                                            <option value="0">All Service</option>
                                        </select>
                                    </div>
                                    <div style="width: 130px;">
                                        <select class="form-select form-select-sm" data-select="period"></select>
                                    </div>
                                </div>


                                <div style="height: 341px">
                                    <canvas id="callLogChart"></canvas>
                                </div>


                            </div>
                        </div>



                    </div>


                    <div class="col-xl-3 col-lg-12">


                        <div class="card" data-widget="CallStatus">
                            <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">

                                <div>
                                    <i class="ri-phone-fill text-primary"></i> Calls by Status
                                </div>

                                <div class="d-flex fs-5">
                                    <button class="btn btn-sm" data-action="refresh" data-bs-toggle="tooltip" data-bs-title="Refresh">
                                        <i class="ri-loop-left-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#CallStatus" aria-expanded="true">
                                        <i class="ri-arrow-down-s-line"></i>
                                    </button>
                                    <button class="btn btn-sm" data-action="remove" data-bs-toggle="tooltip" data-bs-title="Remove">
                                        <i class="ri-close-fill"></i>
                                    </button>
                                </div>

                            </h5>
                            <div class="card-body collapse show" id="CallStatus">

                                <div class="d-flex justify-content-end mb-4 mb-md-0">
                                    <div class="me-2">
                                        <select class="form-select form-select-sm" data-select="service" style="width: 130px;">
                                            <option value="0">All Service</option>
                                        </select>
                                    </div>
                                    <div style="width: 130px;">
                                        <select class="form-select form-select-sm" data-select="period"></select>
                                    </div>
                                </div>

                                <div style="height: 341px">
                                    <canvas id="callStatusChart"></canvas>
                                </div>

                            </div>
                        </div>


                    </div>

                </div>

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

    <script src="<?= APP_URL ?>/public/js/PNClient.js?v=<?= APP_VER ?>"></script>

    <!-- page common components -->
    <script src="<?= APP_URL ?>/public/js/components/common.js?v=<?= APP_VER ?>"></script>
    <script src="<?= APP_URL ?>/public/js/functions/common.js?v=<?= APP_VER ?>"></script>
    <!-- page init -->
    <script src="../public/js/app.js?v=<?= APP_VER ?>"></script>



    <script>
        const timePeriods = {
            '24-hour': 'Last 24 Hours',
            '7-days': 'Last 7 Days',
            '30-days': 'Last 30 Days',
            '90-days': 'Last 90 Days',
            'this-month': 'This Month',
            'last-month': 'Last Month',
            'this-year': 'This Year',
            'last-year': 'Last Year',
        };

        //populate data-select="period"
        $('[data-select="period"]').each(function() {
            const select = $(this);
            const selected = select.attr('data-selected');
            const options = timePeriods;

            Object.keys(options).forEach(key => {
                select.append(`<option value="${key}" ${selected === key ? 'selected' : ''}>${options[key]}</option>`);
            });

        });

        function countsComponent(data = {}) {

            let html = '';


            html += ` <div class="col-xl-3 col-md-6">
                        <div class="coun-box mb-4">
                            <div class="align-items-center d-flex me-3">

                                <i class="ri-contacts-book-line"></i>

                                <h4 class="mb-4 ms-3">Total Contacts</h4>

                            </div>
                            <div class="ms-auto">
                                <h2 class="mb-4">${data?.total_contacts || 0}</h2>
                            </div>
                        </div>
                    </div>`;

            html += `<div class="col-xl-3 col-md-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-settings-3-line"></i>

                                    <h4 class="mb-4 ms-3">Active Services</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4">${data?.active_service || 0}</h2>
                                </div>
                            </div>
                        </div>`;

            html += `<div class="col-xl-3 col-md-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-group-line"></i>

                                    <h4 class="mb-4 ms-3">Total Users</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4">${data?.total_users || 0}</h2>
                                </div>
                            </div>
                        </div>`;

            html += `<div class="col-xl-3 col-md-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-user-follow-line"></i>

                                    <h4 class="mb-4 ms-3">Active Users</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4">${data?.active_users || 0}</h2>
                                </div>
                            </div>
                        </div>`;

            return html;

        }

        function voiceStatistics(data = {}) {

            let html = '';


            html += ` <div class="col-xl-3 col-md-6">
                        <div class="coun-box mb-4">
                            <div class="align-items-center d-flex me-3">

                                <i class="ri-record-mail-line"></i>

                                <h4 class="mb-4 ms-3">Voice Mail</h4>

                            </div>
                            <div class="ms-auto">
                                <h2 class="mb-4">${data?.VoiceMail || 0}</h2>
                            </div>
                        </div>
                    </div>`;

            html += `<div class="col-xl-3 col-md-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-timer-line"></i>

                                    <h4 class="mb-4 ms-3">Average Call Duration</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4">${secondsToHms(data?.CallDuration || 0)}</h2>
                                </div>
                            </div>
                        </div>`;

            html += `<div class="col-xl-3 col-md-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                <i class="ri-rest-time-line"></i>

                                    

                                    <h4 class="mb-4 ms-3">Average Waiting Time</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4">${secondsToHms(data?.AverageWaiting || 0)}</h2>
                                </div>
                            </div>
                        </div>`;

            html += `<div class="col-xl-3 col-md-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-hourglass-line"></i>

                                    <h4 class="mb-4 ms-3">Average Response Time</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4">${secondsToHms(data?.AverageResponse || 0)}</h2>
                                </div>
                            </div>
                        </div>`;

            return html;

        }

        async function initPageData() {


            let {
                component,
                render
            } = reef;




            // light blue
            var ctx = document.getElementById('callLogChart').getContext('2d');

            var background1 = ctx.createLinearGradient(0, 280, 0, 0);
            background1.addColorStop(0, 'rgba(52, 152, 219, 0)');
            background1.addColorStop(1, 'rgba(52, 152, 219, .6)');

            // light red
            var background2 = ctx.createLinearGradient(0, 280, 0, 0);
            background2.addColorStop(0, 'rgba(220, 53, 69, 0)');
            background2.addColorStop(1, 'rgba(220, 53, 69, .6)');

            var background3 = ctx.createLinearGradient(0, 280, 0, 0);
            background3.addColorStop(0, 'rgba(40, 167, 69, 0)');
            background3.addColorStop(1, 'rgba(40, 167, 69, .6)');

            var background4 = ctx.createLinearGradient(0, 280, 0, 0);
            background4.addColorStop(0, 'rgba(255, 193, 7, 0)');
            background4.addColorStop(1, 'rgba(255, 193, 7, .6)');

            var background5 = ctx.createLinearGradient(0, 280, 0, 0);
            background5.addColorStop(0, 'rgba(108, 117, 125, 0)');
            background5.addColorStop(1, 'rgba(108, 117, 125, .6)');

            var callHistoryChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                            label: 'Incoming',
                            borderColor: 'blue',
                            backgroundColor: background1,
                            borderWidth: 1,
                            data: [],
                            fill: true,
                            lineTension: 0.2,
                            pointRadius: 4,
                        },
                        {
                            label: 'Missed',
                            borderColor: 'red',
                            backgroundColor: background2,
                            borderWidth: 1,
                            data: [],
                            fill: true,
                            lineTension: 0.2,
                            pointRadius: 4,
                        },
                        {
                            label: 'Outgoing',
                            borderColor: 'green',
                            backgroundColor: background3,
                            borderWidth: 1,
                            data: [],
                            fill: true,
                            lineTension: 0.2,
                            pointRadius: 4,
                        },
                        {
                            label: 'Rejected',
                            borderColor: 'orange',
                            backgroundColor: background4,
                            borderWidth: 1,
                            data: [],
                            fill: true,
                            lineTension: 0.2,
                            pointRadius: 4,
                        },
                        {
                            label: 'Ext2Ext',
                            borderColor: '#6c757d',
                            backgroundColor: background5,
                            borderWidth: 1,
                            data: [],
                            fill: true,
                            lineTension: 0.2,
                            pointRadius: 4,
                        }
                    ]
                },
                options: {

                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                        x: {
                            ticks: {
                                autoSkip: false,
                            }
                        },
                    },

                    title: {
                        display: true,
                        text: 'Call History'
                    },
                    responsive: true,
                    maintainAspectRatio: false

                }
            });

            // Create a bar chart
            const ctx2 = document.getElementById('smsChart').getContext('2d');

            const smsChart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                            label: 'Incoming',
                            backgroundColor: '#7269ef50',
                            borderColor: '#7269ef',
                            borderWidth: 1,
                            data: [],
                        },
                        {
                            label: 'Outgoing',
                            backgroundColor: '#dc354550',
                            borderColor: '#dc3545',
                            borderWidth: 1,
                            data: [],
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            stacked: false,
                            ticks: {
                                autoSkip: false,
                            }
                        },
                        y: {
                            stacked: false
                        },
                    },

                    responsive: true,
                    maintainAspectRatio: false
                },
            });




            //callstatus pie chart
            const ctx3 = document.getElementById('callStatusChart').getContext('2d');

            const callStatusChart = new Chart(ctx3, {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Call Status',
                        backgroundColor: ['#7269ef50', '#dc354550', '#28a74550', '#ffc10750', '#6c757d50'],
                        borderColor: ['#7269ef', '#dc3545', '#28a745', '#ffc107', '#6c757d'],
                        borderWidth: 1,
                        data: [],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,


                    plugins: {
                        legend: {
                            position: 'bottom',
                        },

                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    var label = context.label || '';
                                    var value = context.formattedValue;
                                    return label + ': ' + value + '%';
                                }
                            }
                        }
                    }

                },
            });




            try {

                res = await _request(APIS.DASHBOARD, 'GET', {
                    timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone
                });

                const widget = res.data;

                render('#countsComponent', countsComponent(widget));
                render('#voiceStatistics', voiceStatistics(widget));

                //voice
                if (typeof activeServicesByType.voice !== 'undefined') {

                    //show voiceStatistics
                    $('#voiceStatistics').removeClass('d-none');
                    //show callLogRow
                    $('#callLogRow').removeClass('d-none');

                    let services = activeServicesByType.voice;

                    const callData = widget['Voice'];

                    //populate data-select="service"
                    $('[data-widget="CallSummary"] [data-select="service"]').each(function() {
                        const select = $(this);
                        const selected = select.attr('data-selected');

                        services.forEach(service => {
                            select.append(`<option value="${service.id}" ${selected === service.id ? 'selected' : ''}>${service.number}</option>`);
                        });
                    });

                    // Extract data for the chart
                    var uniqueDates = Array.from(new Set(callData.map(entry => entry.date_time)));

                    var incomingCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'incoming' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });


                    var missedCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'missed' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var ext2extCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'ext2ext' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var outgoingCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'outgoing' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var rejectedCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'rejected' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    // Update the chart
                    callHistoryChart.data.labels = uniqueDates;
                    callHistoryChart.data.datasets[0].data = incomingCallsData;
                    callHistoryChart.data.datasets[1].data = missedCallsData;
                    callHistoryChart.data.datasets[2].data = rejectedCallsData;
                    callHistoryChart.data.datasets[3].data = outgoingCallsData;
                    callHistoryChart.data.datasets[4].data = ext2extCallsData;
                    callHistoryChart.update();

                    //callstatus pie chart
                    const callStatusData = widget['CallStatus'];


                    //populate data-select="service"
                    $('[data-widget="CallStatus"] [data-select="service"]').each(function() {
                        const select = $(this);
                        const selected = select.attr('data-selected');

                        services.forEach(service => {
                            select.append(`<option value="${service.id}" ${selected === service.id ? 'selected' : ''}>${service.number}</option>`);
                        });
                    });

                    // Update the chart
                    callStatusChart.data.labels = callStatusData.map(entry => entry.status);
                    callStatusChart.data.datasets[0].data = callStatusData.map(entry => entry.count);
                    callStatusChart.update();
                }

                //sms
                if (typeof activeServicesByType.sms !== 'undefined') {

                    //show sms
                    $('[data-widget="Sms"]').removeClass('d-none');
                    //show messages
                    $('[data-widget="Messages"]').removeClass('d-none');

                    let services = activeServicesByType.sms;

                    //populate data-select="service"
                    $('[data-widget="Sms"] [data-select="service"]').each(function() {
                        const select = $(this);
                        const selected = select.attr('data-selected');

                        services.forEach(service => {
                            select.append(`<option value="${service.id}" ${selected === service.id ? 'selected' : ''}>${service.number}</option>`);
                        });
                    });

                    const smsData = widget['Sms'];
                    // Update the chart
                    smsChart.data.labels = smsData.map(entry => entry.date);
                    smsChart.data.datasets[0].data = smsData.map(entry => entry.inbound);
                    smsChart.data.datasets[1].data = smsData.map(entry => entry.outbound);
                    smsChart.update();

                    const msgData = widget['Messages'];

                    //update inbound and outbound
                    $('#inboundToday').text(msgData['Incoming']['Today']);
                    $('#inboundThisMonth').text(msgData['Incoming']['ThisMonth']);
                    $('#outboundToday').text(msgData['Outgoing']['Today']);
                    $('#outboundThisMonth').text(msgData['Outgoing']['ThisMonth']);
                }

            } catch (error) {
                console.log(error);
            }


            //hide loader
            $('#loader').hide();

            //on refresh
            $('[data-action="refresh"]').on('click', async function() {

                //fet closest data-widget value
                const widget = $(this).closest('[data-widget]');
                const widgetValue = widget.attr('data-widget');
                const period = widget.find('[data-select="period"]').val();
                const service = widget.find('[data-select="service"]').val();
                const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

                //add class loading-state
                widget.addClass('loading-state');

                try {

                    let res = await _request('/dashboard/', 'GET', {
                        widget: widgetValue,
                        period: period,
                        service: service,
                        timezone: timezone
                    });

                    if (res) {
                        const functionName = 'update' + widgetValue;

                        if (typeof window[functionName] === 'function') {
                            window[functionName](res.data);

                        } else {
                            console.error('Function does not exist:', functionName);
                        }
                    }

                } catch (error) {
                    console.log(error);
                }

                //remove class loading-state
                widget.removeClass('loading-state');

            });


            //data-select="period" change event
            $('[data-select="period"]').on('change', async function() {

                //fet closest data-widget value
                const widget = $(this).closest('[data-widget]');
                const widgetValue = widget.attr('data-widget');
                const period = widget.find('[data-select="period"]').val();
                const service = widget.find('[data-select="service"]').val();
                const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;


                //add class loading-state
                widget.addClass('loading-state');

                try {

                    let res = await _request('/dashboard/', 'GET', {
                        widget: widgetValue,
                        period: period,
                        service: service,
                        timezone: timezone
                    });

                    if (res) {
                        const functionName = 'update' + widgetValue;

                        if (typeof window[functionName] === 'function') {
                            window[functionName](res.data);

                        } else {
                            console.error('Function does not exist:', functionName);
                        }
                    }


                } catch (error) {

                    console.log(error);


                }

                //remove class loading-state
                widget.removeClass('loading-state');

            });


            //data-select="service" change event
            $('[data-select="service"]').on('change', async function() {

                //fet closest data-widget value
                const widget = $(this).closest('[data-widget]');
                const widgetValue = widget.attr('data-widget');
                const period = widget.find('[data-select="period"]').val();
                const service = widget.find('[data-select="service"]').val();
                const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;


                //add class loading-state
                widget.addClass('loading-state');

                try {

                    let res = await _request('/dashboard/', 'GET', {
                        widget: widgetValue,
                        period: period,
                        service: service,
                        timezone: timezone
                    });

                    if (res) {
                        const functionName = 'update' + widgetValue;

                        if (typeof window[functionName] === 'function') {
                            window[functionName](res.data);

                        } else {
                            console.error('Function does not exist:', functionName);
                        }
                    }


                } catch (error) {

                    console.log(error);

                }

                //remove class loading-state
                widget.removeClass('loading-state');
            });


            window.updateSms = function(data) {
                const smsData = data['Sms'];

                // Update the chart if smsChart and its data are defined
                if (smsChart && smsChart.data) {
                    smsChart.data.labels = smsData.map(entry => entry.date);
                    smsChart.data.datasets[0].data = smsData.map(entry => entry.inbound);
                    smsChart.data.datasets[1].data = smsData.map(entry => entry.outbound);
                    smsChart.update();
                } else {
                    console.error('smsChart is not properly initialized or is missing properties.');
                }
            };

            window.updateCallSummary = function(data) {
                const callData = data['CallSummary'];
                // Update the chart if callHistoryChart and its data are defined
                if (callHistoryChart && callHistoryChart.data) {

                    // Extract data for the chart
                    var uniqueDates = Array.from(new Set(callData.map(entry => entry.date_time)));

                    var incomingCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'incoming' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var missedCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'missed' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var ext2extCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'ext2ext' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var outgoingCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'outgoing' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    var rejectedCallsData = uniqueDates.map(date => {
                        return callData
                            .filter(entry => entry.type === 'rejected' && entry.date_time === date)
                            .reduce((sum, entry) => sum + entry.count, 0);
                    });

                    // Update the chart

                    callHistoryChart.data.labels = uniqueDates;
                    callHistoryChart.data.datasets[0].data = incomingCallsData;
                    callHistoryChart.data.datasets[1].data = missedCallsData;
                    callHistoryChart.data.datasets[2].data = outgoingCallsData;
                    callHistoryChart.data.datasets[3].data = rejectedCallsData;
                    callHistoryChart.data.datasets[4].data = ext2extCallsData;
                    callHistoryChart.update();

                } else {
                    console.error('callHistoryChart is not properly initialized or is missing properties.');
                }
            };

            window.updateCallStatus = function(data) {
                const callStatusData = data['CallStatus'];

                // Update the chart if callStatusChart and its data are defined
                if (callStatusChart && callStatusChart.data) {
                    callStatusChart.data.labels = callStatusData.map(entry => entry.status);
                    callStatusChart.data.datasets[0].data = callStatusData.map(entry => entry.count);
                    callStatusChart.update();
                } else {
                    console.error('callStatusChart is not properly initialized or is missing properties.');
                }
            };


            window.updateMessages = function(data) {
                const msgData = data['Messages'];

                //update inbound and outbound
                $('#inboundToday').text(msgData['Incoming']['Today']);
                $('#inboundThisMonth').text(msgData['Incoming']['ThisMonth']);
                $('#outboundToday').text(msgData['Outgoing']['Today']);
                $('#outboundThisMonth').text(msgData['Outgoing']['ThisMonth']);
            };

            //[data-action="remove"] click event
            $('[data-action="remove"]').on('click', function() {
                const widget = $(this).closest('[data-widget]');
                widget.remove();
            });



        }

        function secondsToHms(seconds) {

            //output 1h 2m 3s or 2m 3s if hours is 0
            if (seconds > 0) {

                let h = Math.floor(seconds / 3600);
                let m = Math.floor(seconds % 3600 / 60);
                let s = Math.floor(seconds % 3600 % 60);

                let hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
                let mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
                let sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";

                return hDisplay + mDisplay + sDisplay;

            } else {
                return '0s';
            }
        }
    </script>

</body>


</html>