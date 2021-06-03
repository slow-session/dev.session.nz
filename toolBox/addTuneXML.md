---
layout: page
title: Add Tune Pages XML
permalink: /addTunePagesXML/
---
<input type="file" id="files" class='filterButton' name="files[]" multiple accept="audio/x-m4a, audio/mpeg, audio/ogg, audio/wav"/>

<output id="fileInfo" class="showTextInfo"></output>

<p>If there are <b>WARNING</b> messages above these Info files will provide information on how to fix things.The "Unix" version is for those running MacOS or Linux etc</p>

<div class="formParent">
    <div class="formChild">
        <input value='Download Info File (Windows)' type='button' class="filterButton" onclick='addTuneXML.downloadWindowsInfo()' />
    </div>
    <div class="formChild">
        <input value='Download Info File (Unix)' type='button' class="filterButton" onclick='addTuneXML.downloadUnixInfo()' />
    </div>
</div>

<p></p>
<p>Fix all the <b>WARNING</b> messages and reload the MP3 files before downloading the XML Template. 
Otherwise, you may not build the webpages for all the MP3 files</p>

<div class="formParent">
    <div class="formChild">
        <input value='Download XML Template' type='button' class="filterButton" onclick='addTuneXML.downloadXML()' />
    </div>
    <div class="formChild">
        <input value='Reset Page' type='button' class="filterButton" onclick='addTuneXML.resetPage()' />
    </div>
</div>

<script  src="{{ site.js_host }}/js/musicmetadata.js"></script>
<script  src="{{ site.js_host }}/js/addTuneXML.js"></script>

<script>
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('files').addEventListener('change', handleAudioFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleAudioFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let files = evt.target.files; // FileList object.
    fileInfo.innerHTML = '';

    // files is a FileList of File objects. List some properties.
    for (let i = 0, f; f = files[i]; i++) {
        let reader = new FileReader();
        reader.onload = function(e) {
            if (this.result.includes('audio')) {
                addTuneXML.addTuneData(f);
            } else {
                fileInfo.innerHTML += `<p>${f.name} - unsupported file type</p>`;
            }
        };
        reader.readAsDataURL(f);
    }
}
</script>
