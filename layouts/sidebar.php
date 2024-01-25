<div class="side-menu msg-side-menu flex-column px-lg-1 ms-lg-0">
    <!-- LOGO -->
    <div class="navbar-brand-box">
        <div class="nav-item btn-group dropup profile-user-dropdown mt-4">
            <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div class="avatar-xs profile-user rounded-circle bg-primary-subtle">
                    <span class="avatar-title text-primary bg-transparent">

                    </span>
                </div>
            </a>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="/">Home <i class="ri-home-line float-end text-muted"></i></a>
                <a class="dropdown-item" href="/contacts">Contacts <i class="ri-contacts-line float-end text-muted"></i></a>
                <a class="dropdown-item" href="/profile">Profile <i class="ri-profile-line float-end text-muted"></i></a>

                <!-- <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a> -->
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="javascript:logOut()">Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
            </div>
        </div>
    </div>
    <!-- end navbar-brand-box -->

    <!-- Start side-menu nav -->
    <div class="flex-md-column my-auto">
        <ul class="nav nav-pills side-menu-nav justify-content-center" role="tablist" id="side_menu_serviceList">

        </ul>
    </div>
    <!-- end side-menu nav -->

    <div class="flex-md-column">
        <ul class="nav side-menu-nav justify-content-center">
            <li class="nav-item">
                <a class="nav-link light-dark-mode" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
                    <i class="ri-sun-line"></i>
                </a>
            </li>
        </ul>
    </div>
    <!-- Side menu user -->
</div>