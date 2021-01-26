---
layout: page
title: Play ABC Audio
permalink: /playABCAudio/
---

<!-- Draw the dots -->
<div class="row">
    <div id="abcPaper" class="abcPaper"></div>
    <!-- Show ABC errors -->
    <div id='abcWarnings' class='abcWarnings'></div>
    
</div>


<div class="player">
<div id="pageAudioPlayer"></div>
<div id="showPlayer"></div>
</div>

<!-- Group the input and controls for ABC-->
<input type="file" id="files" class='filterButton' aria-label="Open ABC file" name="files[]" accept=".abc" />
<output id="fileInfo"></output>


<div class="row">
    <textarea name='abc' id="textAreaABC" class="abcText" aria-label="textarea ABC" rows="13" spellcheck="false" oninput="abcPlayer.loadAudio(textAreaABC, '1')"></textarea>
</div>


<script>
let abcEditor = null;

document.addEventListener("DOMContentLoaded", function (event) {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }

    let pageAudioPlayer = document.getElementById('pageAudioPlayer');

    pageAudioPlayer.innerHTML = audioPlayer.createAudioPlayer();

    // For drawing the dots
    abcEditor = new window.ABCJS.Editor("textAreaABC", {
        paper_id: "abcPaper", 
        /*
        warnings_id:"abcWarnings", 
        */
        render_options: {responsive: 'resize'}, 
        indicate_changed: "true",
    });
});


function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        resetEditABCpage();

        reader.onload = function(e) {

            // Is ABC file valid?
            if (abcPlayer.isABCfile(this.result) == false) {
                fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }
            // Copy the file into the textarea
            textAreaABC.value = this.result + '\n';

            // Gross hack to get the ABC to draw after file is loaded
            // The option 'drawABChack' doesn't exist and is silently ignored
            // but this forces a redraw
            abcEditor.paramChanged({drawABChack: 1});
            
            // Load the tune            
            abcPlayer.loadAudio(textAreaABC, '1');
        };
        reader.readAsText(f);
    }
}

function resetEditABCpage() {
    document.getElementById("abcPaper").innerHTML = '';
    document.getElementById("abcPaper").style.paddingBottom = "0px";
    document.getElementById("abcPaper").style.overflow = "auto";
    textAreaABC.value = "";
    //document.getElementById('abcWarnings').innerHTML = 'No errors';
    document.getElementById('fileInfo').innerHTML = '';
}

        

</script>
