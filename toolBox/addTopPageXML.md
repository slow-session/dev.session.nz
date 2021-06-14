---
layout: page
title: Add Top Page XML
permalink: /addTopPageXML/
---
<div>
<p>You can use this page to make a "Top Level Index" page.</p>
</div>

<div><p>Choose any year from <span id="earliestYear"></span> up to <span id="latestYear"></span>:
<select id="chosenYear" name="chosenYear">
    <option value="">Choose a year</option>
</select>
</p>
</div>

<div class="formParent">
    <div class="formChild">
        <input value='Download XML Template' type='button' class="filterButton" onclick='addTuneXML.downloadTopPage(chosenYear);' />
    </div>
</div>

<script  src="{{ site.js_host }}/js/addTuneXML.js"></script>

<script>
let selectBox = document.getElementById("chosenYear");
let chosenYear = '';

addTuneXML.addSelectYears("chosenYear");

selectBox.onchange = function () {
    let selIndex = selectBox.selectedIndex;
    chosenYear = selectBox.options[selIndex].value;
}
</script>
