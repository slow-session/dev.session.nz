---
layout: page
title: Play Local ABC
permalink: /playLocalABC/
---
You can use this page to play an ABC file you've stored locally.


<textarea id="textAreaABC" style="display:none;"></textarea>

<div class="output">
    <div id="abcPaper" class="abcPaper"></div>
</div>

<div class="player">
<!-- hide the player until we've loaded some dots -->
<div id="ABCplayer" style="display:none;"></div>
</div>

<input type="file" id="files" class='filterButton' name="files[]" accept="text/vnd.abc,.abc"/>

<output id="fileInfo"></output>

<script>
$(document).ready(function()
{
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
	// Create the ABC player
    document.getElementById('ABCplayer').innerHTML = abcPlayer.createABCplayer('textAreaABC', 1, '{{ site.defaultABCplayer }}');
    abcPlayer.createABCsliders("textAreaABC", '1');

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
            
            // Display the ABC in the textbox as dots
            abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
            
            // stop tune currently playing if needed
            var playButton = document.getElementById("playABC1");
            if (typeof playButton !== 'undefined'
                && playButton.className == "stopButton") {
                abcPlayer.stopABCplayer();
                playButton.className = "";
                playButton.className = "playButton";
            }
            
            // Show the player when we've loaded some dots
            document.getElementById("abcPlayer").style.display = 'block';

        };
        reader.readAsText(f);
    }
}
</script>
