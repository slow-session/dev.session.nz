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
        <input value='Download Info File (Windows)' type='button' class="filterButton" onclick='downloadWindowsInfo()' />
    </div>
    <div class="formChild">
        <input value='Download Info File (Unix)' type='button' class="filterButton" onclick='downloadUnixInfo()' />
    </div>
</div>

<p></p>
<p>Fix all the <b>WARNING</b> messages before downloading the XML Template. 
Otherwise, you may not build the webpages for all the MP3 files</p>

<div class="formParent">
    <div class="formChild">
        <input value='Download XML Template' type='button' class="filterButton" onclick='downloadXML()' />
    </div>
</div>


<script  src="{{ site.js_host }}/js/musicmetadata.js"></script>

<script>
let XMLheader = `<?xml version='1.0' encoding='UTF-8' ?>
<rss version='2.0' xmlns:excerpt='http://wordpress.org/export/1.1/excerpt/'
    xmlns:content='http://purl.org/rss/1.0/modules/content/' xmlns:wfw='http://wellformedweb.org/CommentAPI/'
    xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:wp='http://wordpress.org/export/1.1/'>
    <channel>
        <title></title>
        <link></link>
        <description></description>
        <pubDate></pubDate>
        <language></language>
        <wp:wxr_version>1.1</wp:wxr_version>
        <wp:base_site_url></wp:base_site_url>
        <wp:base_blog_url></wp:base_blog_url>
        <generator>https://wordpress.org/?v=5.5.1</generator>
`;
let XMLbody = '';
let XMLfooter = `
    </channel>
</rss>
`;
let fileInfo = document.getElementById('fileInfo');
fileInfo.innerHTML = 'Waiting for MP3 selection';
let infoFileUnix = '';
let infoFileWindows = '';

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
                addTuneData(f);
            } else {
                fileInfo.innerHTML += `<p>${f.name} - unsupported file type</p>`;
            }
        };
        reader.readAsDataURL(f);
    }
}

function addTuneData(data) {
    musicmetadata(data, function (err, result) {
        if (err) {
            throw err;
        }
        
        let title = null;
        if (result.title) {
            title = result.title;
            console.log(title);
        } else {
            fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Title" ID3 tag not found</p>`;
            infoFileUnix += `${data.name}: "Title" ID3 tag not found\n`;
            infoFileWindows += `${data.name}: "Title" ID3 tag not found\n`;
        }

        let tutor = null;
        if (result.artist[0]) {
            tutor = result.artist[0];
            console.log(tutor);
        } else {
            fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Artist" ID3 tag not found</p>`;
            infoFileUnix +=`${data.name}: "Artist" ID3 tag not found\n`;
            infoFileWindows +=`${data.name}: "Artist" ID3 tag not found\n`;
        }

        let year = null;
        if (result.year) {
            year = result.year;
            console.log(year);
        } else {
            fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Year" ID3 tag not found</p>`;
            infoFileUnix += `${data.name}: "Year" ID3 tag not found\n`;
            infoFileWindows += `${data.name}: "Year" ID3 tag not found\n`;
        }

        let instrument = null;
        if (result.genre[0]) {
            instrument = result.genre[0];
            console.log(instrument);
        } else {
            fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Genre" ID3 tag not found - this tag used for the "Instrument"</p>`;
            infoFileUnix += `${data.name}: "Genre" ID3 tag not found - this tag used for the "Instrument"\n`;
            infoFileWindows += `${data.name}: "Genre" ID3 tag not found - this tag used for the "Instrument"\n`;
        }

        if (title && tutor && year && instrument) {
            let dateTime = new Date();
            let monthNumber = dateTime.getMonth() + 1;
            let dayNumber = dateTime.getDate();
            dateTime = new Date(year, monthNumber - 1 , dayNumber);
            monthNumber = monthNumber.toString().padStart(2,0);
            dayNumber = dayNumber.toString().padStart(2,0);
            let monthName = dateTime.toLocaleString('default', { month: 'short' })
            let dayName = dateTime.toLocaleString('default', { weekday: 'short' })

            let postName = wssTools.slugify(title + '-' + year + '-' + instrument);
            let mp3FileName = postName + '.mp3';

            fileInfo.innerHTML += `<p>Tags found:</p><ul><li>${title}:${tutor}:${year}:${instrument}</li></ul>`;

            XMLbody += `
        <item>
            <title>${title} - ${instrument}</title>
            <pubDate>${dayName}, ${dayNumber} ${monthName} ${year} 00:00:01 +0000</pubDate>
            <dc:creator>archive</dc:creator>
            <guid isPermaLink='false'></guid>
            <description></description>
            <content:encoded>
            <![CDATA[ <!-- wp:columns --> <div class="wp-block-columns"><!-- wp:column {{"width":"25%"}} --> <div class="wp-block-column" style="flex-basis:25%"><!-- wp:list --> <ul><li>${tutor}</li><li>${instrument}</li><li>${year}</li></ul> <!-- /wp:list --></div> <!-- /wp:column --> <!-- wp:column {{"width":"50%"}} --> <div class="wp-block-column" style="flex-basis:50%"></div> <!-- /wp:column --> <!-- wp:column {{"width":"25%"}} --> <div class="wp-block-column" style="flex-basis:25%"><!-- wp:shortcode --> [download_mp3]/wp-content/uploads/ceol-aneas/${year}/${mp3FileName}[/download_mp3] <!-- /wp:shortcode --></div> <!-- /wp:column --></div> <!-- /wp:columns --> <!-- wp:shortcode --> [choon]/wp-content/uploads/ceol-aneas/${year}/${mp3FileName}[/choon] <!-- /wp:shortcode --> ]]>
            </content:encoded>
            <wp:post_id></wp:post_id>
            <wp:post_date>${year}-${monthNumber}-${dayNumber} 00:00:01</wp:post_date>
            <wp:post_date_gmt>${year}-${monthNumber}-${dayNumber} 00:00:01</wp:post_date_gmt>
            <wp:comment_status>closed</wp:comment_status>
            <wp:ping_status>closed</wp:ping_status>
            <wp:post_name>${postName}</wp:post_name>
            <wp:status>publish</wp:status>
            <wp:post_parent></wp:post_parent>
            <wp:menu_order></wp:menu_order>
            <wp:post_type>page</wp:post_type>
            <wp:post_password></wp:post_password>
            <wp:is_sticky>0</wp:is_sticky>
        </item>
`;

            if (data.name != mp3FileName) {
                fileInfo.innerHTML += `<h3>WARNING</h3>
                <ul><li>Rename MP3 file '${data.name}' to '${mp3FileName}'</li></ul>`;
                infoFileUnix += `mv ${data.name} ${mp3FileName}\n`;
                infoFileWindows += `rename ${data.name} ${mp3FileName}\n`;
            }
        } else {
            fileInfo.innerHTML += "<p>WARNING: MP3 file not processed - fix missing ID3 tags</p>";
        }
    });
}

function downloadXML() {
    let XMLcontent = XMLheader + XMLbody + XMLfooter;
    wssTools.downloadFile("tunePagesTemplate.xml", XMLcontent);
    // reset things
    XMLbody = '';
    document.getElementById("files").innerHTML = '';
    fileInfo.innerHTML = 'Waiting for MP3 selection';
}

function downloadUnixInfo() {
    wssTools.downloadFile("tunePagesInfoUnix.txt", infoFileUnix);
    // reset things
    infoFileUnix = '';
}

function downloadWindowsInfo() {
    wssTools.downloadFile("tunePagesInfoWindows.txt", infoFileWindows);
    // reset things
    infoFileWindows = '';
}
</script>
