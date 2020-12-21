---
layout: page
title: Add Blackboard ABC
permalink: /addBlackboardABC/
---
This won't work for tunes with double stops for now. Check the output to make sure it's OK
and hand tweak the w: lines in the ABC if you need to.

<div class="row">
    <h3>Load an ABC file:</h3>
    <input type="file" id="files" class='filterButton' name="files[]" accept=".abc" />
    <output id="fileInfo"></output>
    <p />
</div>
<div class="row">
    <h3>Or paste your ABC here:</h3>
    <!-- Read the modified ABC and play if requested -->
    <textarea name='abc' id="textAreaABC" class="abcText" rows="13" spellcheck="false">
    </textarea>
    <!-- Show ABC errors -->
    <div id='warnings'></div>
</div>
<div class="row">
    <!-- Draw the dots -->
    <div class="output">
        <div id="abcPaper" class="abcPaper"></div>
    </div>

    <!-- Controls for ABC player -->
    <div id="ABCplayer"></div>
</div>
<!-- Group the input and controls for ABC-->
<div class="row">
<!-- Add the Blackboard ABC-->
    <h3>Add the Blackboard ABC:</h3>
    <form>
        <input value='Add Blackboard ABC' type='button' class='filterButton'
            onclick='addBlackboardABC(document.getElementById("textAreaABC").value)' />
    </form>
    <p />
</div>
<div class="row">
    <textarea name='abc' id="textAreaABCplus" class="abcText" rows="13" spellcheck="false"></textarea>
</div>
<div class="row">
    <!-- Allow the user to save their ABC-->
    <h3>Don’t forget to ‘Download ABC’ to save your work:</h3>
    <form>
        <span title="Download the ABC you've entered. Don't lose your work!">
            <input value='Download ABC' type='button' class='filterButton'
                onclick='wssTools.downloadABCFile(document.getElementById("textAreaABCplus").value)' />
        </span>
    </form>
    <p />
</div>

<script>
$(document).ready(function () {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
    
    // Display the ABC in the textbox as dots
    let abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
    
    // Create the ABC player
    ABCplayer.innerHTML = createABCplayer('textAreaABC', '1', '{{ site.defaultABCplayer }}');  
    createABCSliders("textAreaABC", '1');
 
});

function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Is ABC file valid?
            if ((getABCheaderValue("X:", this.result) == '')
                || (getABCheaderValue("T:", this.result) == '')
                || (getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }

            // Show the dots
            textAreaABC.value = this.result; 
            
            let abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
            
            // stop tune currently playing if needed
            var playButton = document.getElementById("playABC1");
            if (typeof playButton !== 'undefined'
                && playButton.className == "stopButton") {
                stopABCplayer();
                playButton.className = "";
                playButton.className = "playButton";
            }
        };
        reader.readAsText(f);
    }
}
function addBlackboardABC(abcText) {
    abcText = abcText.match(/^(?![IV]:).+$/gm).join('\n');

    textAreaABCplus.value = getHeader(abcText) + '\n';;
    
    let notes = getNotes(abcText);
    let lines = notes.split(/[\r\n]+/).map(line => line.trim());
        
    lines.forEach (addTextToLine);
}

function addTextToLine(value) {
    let wLine = value;

    if (wLine.match(/w:/)) {
        return;
    }

    // strip out the note lengths
    wLine = wLine.replace(/\d+/g, '');
    // strip out the grace notes
    wLine = wLine.replace(/{[A-Ga-g]}/g, '');
    // strip out the chords
    wLine = wLine.replace(/"[A-Ga-z]*"/g, '');
    // strip the accidentals and other meta chars
    wLine = wLine.replace(/[\^=_\/\,~:(%]/g, '');

    wLine = wLine.split('').join(' ');
    wLine = wLine.replace(/\s\s+/g, ' ');

    wLine = wLine.replace(/[a-g]/g, "$&'").toUpperCase();
    
    textAreaABCplus.value += value + '\nw: ' + wLine + '\n';
    let abc_editor = new window.ABCJS.Editor("textAreaABCplus", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
}
</script>
