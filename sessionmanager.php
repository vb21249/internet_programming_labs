<?php
function initializeSession() {
    if (!isset($_SESSION['sectors'])) {
        session_start();
        include("conf/conf.php");
        $dbConf = new AAConf();
        $databaseURL = $dbConf->get_databaseURL();
        $databaseUName = $dbConf->get_databaseUName();
        $databasePWord = $dbConf->get_databasePWord();
        $databaseName = $dbConf->get_databaseName();

        // Set DB Info. in-session
        $_SESSION['databaseURL'] = $databaseURL;
        $_SESSION['databaseUName'] = $databaseUName;
        $_SESSION['databasePWord'] = $databasePWord;
        $_SESSION['databaseName'] = $databaseName;

        $mysqli = new mysqli($databaseURL, $databaseUName, $databasePWord, $databaseName);

        if ($mysqli->connect_error) {
            die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
        }

        $rowArray = [];
        $rowID = 1;
        $query = "SELECT * FROM Sectors";
        $result = mysqli_query($mysqli, $query);

        while ($row = mysqli_fetch_array($result)) {
            $rowArray[$rowID] = $row['Sector'];
            $rowID++;
        }

        // Update the session with the sectors
        $_SESSION['sectors'] = $rowArray;

        mysqli_close($mysqli);
    }
}

function getSessionSectors() {
    return isset($_SESSION['sectors']) ? $_SESSION['sectors'] : [];
}
?>