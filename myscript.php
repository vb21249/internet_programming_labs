<?php

function displaySubmittedData() {
    echo "<h2>Submitted Data:</h2>";

    $text = isset($_POST['text_field']) ? $_POST['text_field'] : '';
    echo "<p>Text Field: " . htmlspecialchars($text) . "</p>";

    $checkboxes = isset($_POST['checkboxes']) ? $_POST['checkboxes'] : [];
    echo "<p>Checkboxes: " . (!empty($checkboxes)
            ? implode(', ', array_map('htmlspecialchars', $checkboxes))
            : "None selected") . "</p>";

    $radio = isset($_POST['radio_button']) ? $_POST['radio_button'] : null;
    echo "<p>Radio Button: " . ($radio
            ? htmlspecialchars($radio)
            : "None selected") . "</p>";

    $multiSelect = isset($_POST['multi_select'])
        ? $_POST['multi_select']
        : [];

    echo "<p>Multiple Selection: " . (!empty($multiSelect)
            ?
            implode(', ', array_map('htmlspecialchars', $multiSelect))
            : "None selected") . "</p>";
}

function renderForm() {
    ?>
    <form method="POST" action="<?= htmlspecialchars($_SERVER['PHP_SELF']) ?>">
        <label for="text_field">Text Field:</label>
        <input type="text" id="text_field" name="text_field"><br><br>

        <label>Checkboxes:</label><br>
        <input type="checkbox" name="checkboxes[]" value="Option 1"> Option 1<br>
        <input type="checkbox" name="checkboxes[]" value="Option 2"> Option 2<br>
        <input type="checkbox" name="checkboxes[]" value="Option 3"> Option 3<br><br>

        <label>Radio Buttons:</label><br>
        <input type="radio" name="radio_button" value="Option A"> Option A<br>
        <input type="radio" name="radio_button" value="Option B"> Option B<br>
        <input type="radio" name="radio_button" value="Option C"> Option C<br><br>

        <label for="multi_select">Multiple Selection:</label><br>
        <select id="multi_select" name="multi_select[]" multiple>
            <option value="Choice 1">Choice 1</option>
            <option value="Choice 2">Choice 2</option>
            <option value="Choice 3">Choice 3</option>
        </select><br><br>

        <input type="submit" value="Submit">
    </form>
    <?php
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    displaySubmittedData();
} else {
    renderForm();
}
?>
