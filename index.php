<?php
include("sessionmanager.php");
initializeSession();
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title>AirAlliance</title>
        <meta name="keywords" content="itinerary, list" />
        <meta name="description" content="This page provides a list of all itineraries" />
        <link href="css/default.css" rel="stylesheet" type="text/css" />
    </head>
    
    
    <body>
        <div id="wrapper">
        <?php include 'include/header.php'; ?>
            <div id="page">
                <div id="content">
                    <div id="welcome">
                        <h1>Ласкаво просимо до AirAlliance</h1>
                        <p>
                            AirAlliance has evolved into one of the 
                            most respected travel brands around the world. 
                            We have one of the world's youngest fleet in the air,
                            a network spanning five continents.
                            Customers, investors, partners, and staff 
                            — everyone expects excellence of us. And so, in 
                            our lounges, our conferences, working relationships, 
                            and in the smallest details of flight, we rise to 
                            each occasion and deliver the AirAlliance 
                            experience. 
                        </p>
                        <p>
                            The airline operates over 370 flights daily 
                            across 44 destinations within  India and also 
                            operates flights to the United Kingdom,  United States
                            of America,  Canada, Belgium,  Singapore, Thailand, 
                            Malaysia,  Nepal, Sri Lanka,  Bangladesh,  Bahrain,  
                            Kuwait,  Oman &  Qatar on one of the youngest and 
                            best maintained fleets. AirAlliance plans to extend 
                            its international operations further in North America, 
                            Europe, Africa & Asia in the coming years with the 
                            induction of wide-body aircraft into its fleet. 
                        </p>
                        <p>
                            Feel the AirAlliance Experience!
                        </p>
                    </div>
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


