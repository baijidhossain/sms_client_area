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




                <div class="row" id="graphComponent">
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
        async function initPageData() {

            let {
                component,
                render
            } = reef;

            //hide loader

            function graphComponent() {

                let html = '';

                for (const serviceType in activeServicesByType) {

                    if (activeServicesByType.hasOwnProperty(serviceType)) {

                        if (serviceType === 'sms') {


                            html += ` <div class="col-md-9">

                            <div class="card">
                                    <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">
                            
                                    
                                    <div>
                                            <i class="ri-message-3-fill text-primary"></i> Sms Graph
                                        </div>

                                        <div class="d-flex fs-5">

                                    
                                            <button class="btn btn-sm">
                                                <i class="ri-loop-left-line"></i>
                                            </button>

                                            

                                            <button class="btn btn-sm">
                                                <i class="ri-arrow-down-s-line"></i>
                                            </button>

                                            <button class="btn btn-sm">
                                                <i class="ri-close-fill"></i>
                                            </button>


                                        </div>
                                    
                                    </h5>
                                    <div class="card-body">
                                      
                                    <div class="d-flex justify-content-end mb-4">
                                        
                                        <div class="me-2">

                                            <select id="smsLogService" class="form-select form-select-sm me-2" style="max-width: 150px;">
                                            <option value="0">All Service</option>
                                            ${activeServicesByType[serviceType].map(service => `<option value="${service.id}">${service.number}</option>`).join('')}
                                            </select>

                                        </div>

                                        <div>
                                           <select id="smsLogViewPeriod" class="form-select form-select-sm" style="max-width: 120px;">
                                            <option value="24-hour">24 Hours</option>
                                            <option value="1-day">1 Day</option>
                                            <option value="7-days">7 Days</option>
                                            <option value="30-days">30 Days</option>
                                            <option value="90-days">90 Days</option>
                                            <option value="this-month">This Month</option>
                                            <option value="last-month">Last Month</option>
                                            <option value="this-year">This Year</option>
                                            <option value="last-year">Last Year</option>
                                        </select>
                                        </div>
                                    </div>

                                    <div style="height: 317px">
                                        <canvas id="smsChart"></canvas>
                                    </div>

                                    
                                       
                                    </div>
                                </div>


                              
                            </div>

                            <div class="col-md-3">

                            <div class="card">
                            <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">
                                <div>
                                    <i class="ri-message-3-fill text-primary"></i>
                                     Messages
                                </div>
                                <div class="d-flex fs-5">
                                    <button class="btn btn-sm">
                                        <i class="ri-loop-left-line"></i>
                                    </button>
                                    <button class="btn btn-sm">
                                        <i class="ri-arrow-down-s-line"></i>
                                    </button>
                                    <button class="btn btn-sm">
                                        <i class="ri-close-fill"></i>
                                    </button>
                                </div>
                            </h5>
                            <div class="card-body">

                                <div class="mb-4 fw-bold">
                                    <i class="ri-arrow-down-line"></i> Inbound
                                </div>

                                <div class="mb-4">
                                    <div class="row">
                                        <div class="col-6">

                                            <div class="bg-body-secondary p-4 rounded-4">
                                                <h2>
                                                    0
                                                </h2>

                                                <p class="mb-0">
                                                    Today
                                                </p>
                                            </div>

                                        </div>

                                        <div class="col-6">

                                            <div class="bg-body-secondary p-4 rounded-4">
                                                <h2>
                                                    0
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
                                        <i class="ri-arrow-up-line"></i> Outbound
                                    </div>

                                    <div class="row">
                                        <div class="col-6">

                                            <div class="bg-body-secondary p-4 rounded-4">
                                                <h2>
                                                    0
                                                </h2>

                                                <p class="mb-0">
                                                    Today
                                                </p>
                                            </div>

                                        </div>

                                        <div class="col-6">

                                            <div class="bg-body-secondary p-4 rounded-4">
                                                <h2>
                                                    0
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
                            
                            
                            
                            `;
                        }

                        if (serviceType === 'voice') {
                            html += ` <div class="col-md-9">

                                <div class="card">
                                    <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">

                                        <div>
                                            <i class="ri-phone-fill text-primary"></i> Call Summary
                                        </div>

                                        <div class="d-flex fs-5">

                                    
                                            <button class="btn btn-sm">
                                                <i class="ri-loop-left-line"></i>
                                            </button>

                                            

                                            <button class="btn btn-sm">
                                                <i class="ri-arrow-down-s-line"></i>
                                            </button>

                                            <button class="btn btn-sm">
                                                <i class="ri-close-fill"></i>
                                            </button>


                                        </div>
                                    </h5>
                                    <div class="card-body">
                                      
                                    <div class="d-flex justify-content-end mb-4">
                                            <div class="me-2">
                                                <select id="callLogService" class="form-select form-select-sm" style="max-width: 150px;">
                                                <option value="0">All Service</option>
                                                ${activeServicesByType[serviceType].map(service => `<option value="${service.id}">${service.number}</option>`).join('')}
                                                </select>
                                            </div>
                                            <div>
                                                <select id="callLogViewPeriod" class="form-select form-select-sm" style="max-width: 120px;">
                                                <option value="24-hour">24 Hours</option>
                                                <option value="1-day">1 Day</option>
                                                <option value="7-days">7 Days</option>
                                                <option value="30-days">30 Days</option>
                                                <option value="90-days">90 Days</option>
                                                <option value="this-month">This Month</option>
                                                <option value="last-month">Last Month</option>
                                                <option value="this-year">This Year</option>
                                                <option value="last-year">Last Year</option>
                                            </select>
                                            </div>
                                        </div>


                                    <div style="height: 317px">
                                        <canvas id="callLogChart"></canvas>
                                    </div>

                                       
                                    </div>
                                </div>


                               
                            </div>


                            <div class="col-md-3">


                                    <div class="card">
                                    <h5 class="card-header d-flex justify-content-between align-items-center fw-normal">

                                        <div>
                                            <i class="ri-phone-fill text-primary"></i> Calls by Status
                                        </div>

                                        <div class="d-flex fs-5">

                                    
                                            <button class="btn btn-sm">
                                                <i class="ri-loop-left-line"></i>
                                            </button>

                                            

                                            <button class="btn btn-sm">
                                                <i class="ri-arrow-down-s-line"></i>
                                            </button>

                                            <button class="btn btn-sm">
                                                <i class="ri-close-fill"></i>
                                            </button>


                                        </div>
                                    </h5>
                                    <div class="card-body">
                                      
                                    <div class="d-flex justify-content-end mb-4">
                                            <div class="me-2">
                                                <select id="callLogService" class="form-select form-select-sm" style="max-width: 150px;">
                                                <option value="0">All Service</option>
                                                ${activeServicesByType[serviceType].map(service => `<option value="${service.id}">${service.number}</option>`).join('')}
                                                </select>
                                            </div>
                                            <div>
                                                <select id="callLogViewPeriod" class="form-select form-select-sm" style="max-width: 120px;">
                                                <option value="24-hour">24 Hours</option>
                                                <option value="1-day">1 Day</option>
                                                <option value="7-days">7 Days</option>
                                                <option value="30-days">30 Days</option>
                                                <option value="90-days">90 Days</option>
                                                <option value="this-month">This Month</option>
                                                <option value="last-month">Last Month</option>
                                                <option value="this-year">This Year</option>
                                                <option value="last-year">Last Year</option>
                                            </select>
                                            </div>
                                        </div>

                                    <div style="height: 317px">
                                        <canvas id="callStatusChart"></canvas>
                                    </div>
                                       
                                    </div>
                                </div>


                            </div>
                            
                            
                            
                          
                            
                            
                            
                            `;
                        }
                    }
                }
                return html;
            }


            function countsComponent(data = {}) {

                let html = '';


                html += ` <div class="col-lg-3 col-sm-6">
                        <div class="coun-box mb-4">
                            <div class="align-items-center d-flex me-3">

                                <i class="ri-contacts-book-line"></i>

                                <h4 class="mb-4 ms-3">Total Contacts</h4>

                            </div>
                            <div class="ms-auto">
                                <h2 class="mb-4" id="totalContacts">${data?.total_contacts || 0}</h2>
                            </div>
                        </div>
                    </div>`;

                html += `<div class="col-lg-3 col-sm-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-settings-3-line"></i>

                                    <h4 class="mb-4 ms-3">Active Services</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4" id="activeServices">${data?.active_service || 0}</h2>
                                </div>
                            </div>
                        </div>`;

                html += `<div class="col-lg-3 col-sm-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-group-line"></i>

                                    <h4 class="mb-4 ms-3">Total Users</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4" id="totalUsers">${data?.total_users || 0}</h2>
                                </div>
                            </div>
                        </div>`;

                html += `<div class="col-lg-3 col-sm-6">
                            <div class="coun-box mb-4">
                                <div class="align-items-center d-flex me-3">

                                    <i class="ri-user-follow-line"></i>

                                    <h4 class="mb-4 ms-3">Active Users</h4>

                                </div>
                                <div class="ms-auto">
                                    <h2 class="mb-4" id="activeUsers">${data?.active_users || 0}</h2>
                                </div>
                            </div>
                        </div>`;

                return html;

            }

            component('#graphComponent', graphComponent);

            try {

                res = await _request(APIS.DASHBOARD);


                const graphData = res.data.graph;

                const countData = res.data.counts;

                render('#countsComponent', countsComponent(countData));

                for (const serviceType in activeServicesByType) {

                    if (activeServicesByType.hasOwnProperty(serviceType)) {

                        if (serviceType === 'voice') {

                            try {

                                const callData = graphData[serviceType];

                                // Extract data for the chart
                                var uniqueDates = Array.from(new Set(callData.map(entry => entry.date_time)));

                                var receivedCallsData = uniqueDates.map(date => {
                                    return callData
                                        .filter(entry => entry.type === 'received' && entry.date_time === date)
                                        .reduce((sum, entry) => sum + entry.count, 0);
                                });

                                var missedCallsData = uniqueDates.map(date => {
                                    return callData
                                        .filter(entry => entry.type === 'missed' && entry.date_time === date)
                                        .reduce((sum, entry) => sum + entry.count, 0);
                                });

                                var madeCallsData = uniqueDates.map(date => {
                                    return callData
                                        .filter(entry => entry.type === 'made' && entry.date_time === date)
                                        .reduce((sum, entry) => sum + entry.count, 0);
                                });

                                // Create a line chart
                                var ctx = document.getElementById('callLogChart').getContext('2d');

                                var background1 = ctx.createLinearGradient(0, 350, 0, 0);
                                background1.addColorStop(0, 'rgba(220, 53, 69, 0)');
                                background1.addColorStop(1, 'rgba(220, 53, 69, .6)');

                                var background2 = ctx.createLinearGradient(0, 280, 0, 0);
                                background2.addColorStop(0, 'rgba(114, 105, 239, 0)');
                                background2.addColorStop(1, 'rgba(114, 105, 239, .6)');

                                var background3 = ctx.createLinearGradient(0, 280, 0, 0);
                                background3.addColorStop(0, 'rgba(40, 167, 69, 0)');
                                background3.addColorStop(1, 'rgba(40, 167, 69, .6)');

                                var callHistoryChart = new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: uniqueDates,
                                        datasets: [{
                                                label: 'Received Calls',
                                                borderColor: '#7269ef',
                                                backgroundColor: background2,
                                                borderWidth: 1,
                                                data: receivedCallsData,
                                                fill: true,

                                                lineTension: 0.2,
                                                pointRadius: 4,
                                            },
                                            {
                                                label: 'Missed Calls',
                                                borderColor: 'red',
                                                backgroundColor: background1,
                                                borderWidth: 1,
                                                data: missedCallsData,
                                                fill: true,

                                                lineTension: 0.2,
                                                pointRadius: 4,
                                            },
                                            {
                                                label: 'Calls Made',
                                                borderColor: 'green',
                                                backgroundColor: background3,
                                                borderWidth: 1,
                                                data: madeCallsData,
                                                fill: true,

                                                lineTension: 0.2,
                                                pointRadius: 4,
                                            }
                                        ]
                                    },
                                    options: {
                                        title: {
                                            display: true,
                                            text: 'Call History'
                                        },
                                        responsive: true,
                                        maintainAspectRatio: false

                                    }
                                });

                            } catch (error) {
                                console.log(error);
                            }


                        } else if (serviceType === 'sms') {

                            // last 7 days sms logs
                            try {


                                const smsData = graphData[serviceType];

                                // Create a bar chart
                                const ctx2 = document.getElementById('smsChart').getContext('2d');

                                const smsChart = new Chart(ctx2, {
                                    type: 'bar',
                                    data: {
                                        labels: smsData.map(entry => entry.date),
                                        datasets: [{
                                                label: 'Inbound',
                                                backgroundColor: '#7269ef50',
                                                borderColor: '#7269ef',
                                                borderWidth: 1,
                                                data: smsData.map(entry => entry.inbound),
                                            },
                                            {
                                                label: 'Outbound',
                                                backgroundColor: '#dc354550',
                                                borderColor: '#dc3545',
                                                borderWidth: 1,
                                                data: smsData.map(entry => entry.outbound),
                                            },
                                        ],
                                    },
                                    options: {
                                        scales: {
                                            x: {
                                                stacked: false
                                            },
                                            y: {
                                                stacked: false
                                            },
                                        },

                                        responsive: true,
                                        maintainAspectRatio: false
                                    },
                                });

                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }





            } catch (error) {

                console.log(error);

            }



            const callStatusData = [{
                    status: 'Answered',
                    count: 50
                },
                {
                    status: 'Busy',
                    count: 52
                },
                {
                    status: 'Failed',
                    count: 12
                },
                {
                    status: 'No Answer',
                    count: 19
                },
                {
                    status: 'Rejected',
                    count: 5
                }
            ];



            //callstatus pie chart
            const ctx3 = document.getElementById('callStatusChart').getContext('2d');

            const callStatusChart = new Chart(ctx3, {
                type: 'pie',
                data: {
                    labels: callStatusData.map(entry => entry.status),
                    datasets: [{
                        label: 'Call Status',
                        backgroundColor: ['#7269ef50', '#dc354550', '#28a74550', '#ffc10750', '#6c757d50'],
                        borderColor: ['#7269ef', '#dc3545', '#28a745', '#ffc107', '#6c757d'],
                        borderWidth: 1,
                        data: callStatusData.map(entry => entry.count),
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                    }
                },
            });







            $('#loader').hide();
        }
    </script>

</body>


</html>