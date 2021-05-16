---
layout: page
title: Play Local ABC
permalink: /playLocalABC/
---
You can use this page to play an ABC file you've stored locally.

<input type="file" id="files" class='filterButton' name="files[]" accept="text/vnd.abc,.abc"/>
<output id="fileInfo"></output>

<textarea id="textAreaABC" class="abcSource"></textarea>

<div id="abcPaper" class="abcPaper"></div>
<div id="abcAudio"></div>

<div id="notationSave" class="notationSave">
    <span title="Download the Music Notation">
        <input value='Download Music Notation' type='button' class="filterButton" onclick='wssTools.downloadFile(abcFileName.replace("abc", "html"), document.getElementById("abcPaper").innerHTML)' />
    </span>
</div>

<script>
document.addEventListener("DOMContentLoaded", function (event) {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
});

let abcFileName = null;

function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // the ABC file should have "X:", "T:", "K:" fields to be valid
            if (this.result.match(/[XTK]:/g).length >= 3) {
                fileInfo.innerHTML = '';
                audioPlayer.stopABCplayer();
                audioPlayer.displayABC(this.result);
                notationSave.style.display = "block";
            } else {
                fileInfo.innerHTML = '<h2>Invalid ABC file - missing "X:", "T:", "K:" fields</h2>';
                abcPaper.innerHTML = '';
                abcPaper.style.paddingBottom = "0px";
                abcPaper.style.overflow = "auto";
                abcAudio.innerHTML = '';
                notationSave.style.display = "none";
            }
        };
        abcFileName = f.name;
        reader.readAsText(f);
    }
}
</script>
