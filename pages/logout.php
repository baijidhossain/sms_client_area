<?php

session_unset();
session_destroy();

header('location: /login/' . (empty($_GET['redirect']) ? '' : '?redirect=' . $_GET['redirect']));
exit();
