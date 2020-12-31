---
layout: page
title: editABC
permalink: editABC-test
---
<!-- Draw the dots -->
<div class="row">
    <div id="abcPaper" class="abcPaper"></div>
    <div id="abcAudio"></div>    
</div>
<div class="row">
    <!-- Group the input and controls for ABC-->
    <h3>Open an ABC file or type your ABC below:</h3>
    <input type="file" id="files" class='filterButton' aria-label="Open ABC file" name="files[]" accept=".abc" />
    <output id="fileInfo"></output>
</div>
<div class="row">
    <textarea name='abc' id="textAreaABC" class="abcText" aria-label="textarea ABC" rows="13" spellcheck="false"></textarea>
    <!-- Show ABC errors -->
    <div id='abcWarnings' class='audio-error'></div>
</div>
<div class="row small-up-2 medium-up-2 large-up-2">
    <div class="small-3 columns">
        <input value='Save ABC file' id='save' type='button' class='filterButton' aria-label="Save ABC file" onclick='wssTools.downloadABCFile(document.getElementById("textAreaABC").value)' />
    </div>
    <div class="small-3 columns">
        <input value='Reset the page' id='reset' type='button' class='filterButton' aria-label="Reset page" onclick='resetEditABCpage()'/>
    </div>
</div>



<script>
// Get ready to read the textarea
let abcEditor = new window.ABCJS.Editor("textAreaABC", {
    paper_id: "abcPaper", 
    warnings_id:"abcWarnings", 
    render_options: {responsive: 'resize'}, 
    indicate_changed: "true", 
    synth: { el: "#abcAudio", options: {
            displayLoop: true,
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayWarp: true,
            options: {abcjsParams: {program: 27}}
        }
    }
});

document.addEventListener("DOMContentLoaded", function (event) {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
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
            if ((abcPlayer.getABCheaderValue("X:", this.result) == '')
                || (abcPlayer.getABCheaderValue("T:", this.result) == '')
                || (abcPlayer.getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }
            // Show the dots
            textAreaABC.value = this.result;
            
            // Gross hack to get the ABC to draw after file is loaded
            // The option 'drawABChack' doesn't exist and is silently ignored
            abcEditor.paramChanged({drawABChack: 1});
        };
        reader.readAsText(f);
    }
}

function resetEditABCpage () {
    document.getElementById("abcPaper").innerHTML = '';
    document.getElementById("abcPaper").style.paddingBottom = "0px";
    document.getElementById("abcPaper").style.overflow = "auto";
    textAreaABC.value = '';
    document.getElementById('abcWarnings').innerHTML = '';
    files.value = '';
}
</script>
