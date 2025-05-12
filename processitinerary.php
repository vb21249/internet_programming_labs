<?php
include("sessionmanager.php");

initializeSession();
$rowArray2 = getSessionSectors();
?>

<?php
include("itinerarymanager.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <title>Process Itinerary</title>
    <meta name="keywords" content="itinerary, list"/>




    <meta name="description" content="This page provides a list of all itineraries"/>
    <link href="css/default.css" rel="stylesheet" type="text/css"/>
</head>


<body>
<div id="wrapper">
    <?php include 'include/header.php'; ?>

    <?php
    $fname;
    $lname;
    $sourcelist;
    $destlist;

    if (isset($_REQUEST["fname"])) {
        $fname = $_REQUEST["fname"];
    }
    if (isset($_REQUEST["lname"])) {
        $lname = $_REQUEST["lname"];
    }
    if (isset($_REQUEST["sourcelist"])) {
        $sourcelist = $_REQUEST["sourcelist"];
    }
    if (isset($_REQUEST["destlist"])) {
        $destlist = $_REQUEST["destlist"];
    }
    if (isset($_REQUEST["sdate"])) {
        $sdate = $_REQUEST["sdate"];
    }

    ?>
    <div id="page">
        <div id="content">

            <h1>Встановити деталі рейсу</h1>
            <?php
            if (isset($_REQUEST["fname"]) && !isset($_REQUEST["confirmed"])) {
                ?>
                <form action="processitinerary.php" method="POST">

                <?php
                $flightsArray = [];
                $flightsArray = getAvailableFlights($sourcelist, $destlist);
                if (count($flightsArray) < 1 && $flightsArray != null) {
                    echo "<h3>Немає доступних рейсів</h3>";
                    echo "<h4>Немає доступних рейсів для вибраного напрямку. Будь ласка, спробуйте ще.</h4><br><br><a href='processitinerary.php'>Go Back</a> | <a href='flightinfo.php'>Available Flights</a><br>";

                } else {
                    echo "<form action='processitinerary.php' method='POST'>";
                    echo "<h3>Доступні рейси</h3>";
                    echo "<h4>Наступні рейси доступні для вибораних напрямків. Будь ласка, виберіть рейс і продовжіть.</h4><br>";
                    for ($index = 0; $index < count($flightsArray); $index++) {

                        //Display flights list and ask for confirmation
                        echo "<input class='form_tfield' type='radio' name='flight' value='" . $flightsArray[$index + 1] . "' /> " . $flightsArray[$index + 1] . "<br>";

                    }
                    echo "<br>";
                    //Forward the itinerary data
                    echo "<input type='hidden' name='fname' value='" . $fname . "'>";
                    echo "<input type='hidden' name='lname' value='" . $lname . "'>";
                    echo "<input type='hidden' name='sourcelist' value='" . $sourcelist . "'>";
                    echo "<input type='hidden' name='destlist' value='" . $destlist . "'>";
                    echo "<input type='hidden' name='sdate' value='" . $sdate . "'>";
                    echo "<input type='hidden' name='confirmed' value='yes'>";
                    ?>

                    <input class="form_submitb" type="submit" value="Обробка маршруту"/>
                    </form>


                    <?php
                }
            } elseif (isset($_REQUEST["confirmed"])) {
                //Got itinerary confirmation
                $flight;
                if (isset($_REQUEST["flight"])) {
                    $flight = $_REQUEST["flight"];
                }
                $IID = processReservation($fname, $lname, $sourcelist, $destlist, $flight, $sdate);
                if ($IID != -1) {
                    echo "<h2>Підтверджено</h2>";
                    echo "<p>Ваш маршрут був успішно оброблений.<br>";
                    echo "<p>ID вашого маршруту " . $IID . ". Використовуйте цей ID для всіх подальших спілкувань.";
                    echo "<br><br><a href='listitinerary.php'>Переглянути всі маршрути</a>";
                } else {
                    echo "<h2>Маршрут відхилений</h2>";
                    echo "<p>Ваш маршрут був відхилений.<br>";
                    echo "<p>Існує схожий маршрут, присутній в наших записах, з тим же ім'ям гостя, номером рейсу і датою подорожі.";
                    echo "<br><br><a href='listitinerary.php'>Переглянути всі маршрути</a>";
                }
            } else {

                ?>
                <form action="processitinerary.php">
                    <div id="UILabel">Ім'я</div>
                    <input class="form_tfield" type="text" name="fname" value=""/><br><br>
                    <div id="UILabel">Призвище</div>
                    <input class="form_tfield" type="text" name="lname" value=""/><br><br>
                    <div id="UILabel">Оберіть пункт відльоту</div>
                    <select class="form_tfield" name="sourcelist"><br><br>
                        <?php
                        echo "<option selected>" . $rowArray2[1] . "</option>";
                        for ($index = 2; $index < count($rowArray2) + 1; $index++) {
                            echo "<option>" . $rowArray2[$index] . "</option>";
                        }
                        ?>
                    </select>
                    <br><br>
                    <div id="UILabel">Оберіть пункт призначення</div>
                    <select class="form_tfield" name="destlist">
                        <?php
                        echo "<option selected>" . $rowArray2[1] . "</option>";
                        for ($index = 2; $index < count($rowArray2) + 1; $index++) {
                            echo "<option>" . $rowArray2[$index] . "</option>";
                        }
                        ?>
                    </select>
                    <br><br>
                    <div id="UILabel">Дата початку</div>
                    <input class="form_tfield" type="text" name="sdate" value=""/><br>
                    <div id="note">
                        <p>Введіть дату початку подорожі у форматі рррр-мм-дд</p>
                    </div>
                    <input class="form_submitb" type="submit" value="Обробка маршруту"/>
                </form>
                <?php
            }
            ?>

        </div>
        <div id="sidebar">
            <ul>
                <?php include 'include/nav.php'; ?>
                <?php include 'include/updates.php'; ?>
            </ul>
        </div>
        <div style="clear: both; height: 1px"></div>
    </div>
    <?php include 'include/footer.php'; ?>
</div>
</body>
</html>


