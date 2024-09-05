<?php

    header('Content-Type: application/json');


$inp = file_get_contents('urls.json');

    echo $inp;
?>