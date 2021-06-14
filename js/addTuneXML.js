"use strict";

const addTuneXML = (function () {
    // Parts of the XML file - the XMLbody is empty to start with
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

    // Initialise these
    let fileInfo = document.getElementById('fileInfo');
    let infoFileUnix = '';
    let infoFileWindows = '';

    function addTuneData(data) {
        musicmetadata(data, function (err, result) {
            if (err) {
                throw err;
            }

            // Get the four parameters from the MP3 ID3 tags: title, tutor, year, instrument
            let title = null;
            if (result.title) {
                title = result.title;
            } else {
                fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Title" ID3 tag not found</p>`;
                infoFileUnix += `${data.name}: "Title" ID3 tag not found\n`;
                infoFileWindows += `${data.name}: "Title" ID3 tag not found\n`;
            }

            let tutor = null;
            if (result.artist[0]) {
                tutor = result.artist[0];
            } else {
                fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Artist" ID3 tag not found</p>`;
                infoFileUnix += `${data.name}: "Artist" ID3 tag not found\n`;
                infoFileWindows += `${data.name}: "Artist" ID3 tag not found\n`;
            }

            let year = null;
            if (result.year) {
                year = result.year;
            } else {
                fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Year" ID3 tag not found</p>`;
                infoFileUnix += `${data.name}: "Year" ID3 tag not found\n`;
                infoFileWindows += `${data.name}: "Year" ID3 tag not found\n`;
            }

            let instrument = null;
            if (result.genre[0]) {
                instrument = result.genre[0];
            } else {
                fileInfo.innerHTML += `<p>WARNING: ${data.name}: "Genre" ID3 tag not found - this tag used for the "Instrument"</p>`;
                infoFileUnix += `${data.name}: "Genre" ID3 tag not found - this tag used for the "Instrument"\n`;
                infoFileWindows += `${data.name}: "Genre" ID3 tag not found - this tag used for the "Instrument"\n`;
            }

            // If we've got the "set", then we'll add this to the XML template
            if (title && tutor && year && instrument) {
                // Get today's date
                let dateTime = new Date();
                let monthNumber = dateTime.getMonth() + 1;
                let dayNumber = dateTime.getDate();

                // Get date for year of the MP3 file so we can can get the day of the week right
                dateTime = new Date(year, monthNumber - 1, dayNumber);
                let monthName = dateTime.toLocaleString('default', {
                    month: 'short'
                });
                let dayName = dateTime.toLocaleString('default', {
                    weekday: 'short'
                });

                // Pad these with leading '0' if needed
                monthNumber = monthNumber.toString().padStart(2, 0);
                dayNumber = dayNumber.toString().padStart(2, 0);

                // Canonical names for the permalink and the MP3 file name
                let postName = slugify(title + '-' + year + '-' + instrument);
                let mp3FileName = postName + '.mp3';

                // Notes about each file processed for user
                fileInfo.innerHTML += `<p>Tags found:</p><ul><li>${title}:${tutor}:${year}:${instrument}</li></ul>`;

                // XML template details used to create the tune page on WordPress
                XMLbody += `
        <item>
            <title>${title} - ${instrument}</title>
            <pubDate>${dayName}, ${dayNumber} ${monthName} ${year} 00:00:01 +0000</pubDate>
            <dc:creator>archive</dc:creator>
            <guid isPermaLink='false'></guid>
            <description></description>
            <content:encoded>
            <![CDATA[ <!-- wp:columns --> <div class="wp-block-columns"><!-- wp:column width: 25% --> <div class="wp-block-column" style="flex-basis:25%"><!-- wp:list --> <ul><li>${tutor}</li><li>${instrument}</li><li>${year}</li></ul> <!-- /wp:list --></div> <!-- /wp:column --> <!-- wp:column width: 50% --> <div class="wp-block-column" style="flex-basis:50%"></div> <!-- /wp:column --> <!-- wp:column width: 25% --> <div class="wp-block-column" style="flex-basis:25%"><!-- wp:shortcode --> [download_mp3]/wp-content/uploads/ceol-aneas/${year}/${mp3FileName}[/download_mp3] <!-- /wp:shortcode --></div> <!-- /wp:column --></div> <!-- /wp:columns --> <!-- wp:shortcode --> [choon]/wp-content/uploads/ceol-aneas/${year}/${mp3FileName}[/choon] <!-- /wp:shortcode --> ]]>
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
                // We need the mp3FileName to match the details in the template
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

    function addSelectYears(selectID) {
        // Allow for years from 2004 up to now plus 3 more years
        let selectBox = document.getElementById(selectID);
        let chosenYear = '';

        // Get today's date
        let dateTime = new Date();
        let currentYear = dateTime.getFullYear();
        let earliestYear = 2004;
        let latestYear = currentYear + 3;

        document.getElementById("earliestYear").innerHTML = earliestYear;
        document.getElementById("latestYear").innerHTML = latestYear;

        // Populate the list of years
        for (let year = latestYear; year >= earliestYear; year--) {
            let newOption = new Option(year, year);
            selectBox.add(newOption, undefined);
        }
    }

    function downloadTopPage(chosenYear) {
        if (chosenYear == '') {
            alert("No year chosen!");
            return;
        }

        // Get today's date 
        let dateTime = new Date();
        let monthNumber = dateTime.getMonth() + 1;
        let dayNumber = dateTime.getDate();

        // Get date for year selected so we can can get the day of the week right
        dateTime = new Date(chosenYear, monthNumber - 1, dayNumber);
        let monthName = dateTime.toLocaleString('default', {
            month: 'short'
        });
        let dayName = dateTime.toLocaleString('default', {
            weekday: 'short'
        });

        // Pad these with leading '0' if needed
        monthNumber = monthNumber.toString().padStart(2, 0);
        dayNumber = dayNumber.toString().padStart(2, 0);

        XMLbody = `
                <item>
                    <title>${chosenYear}</title>
                    <pubDate>${dayName}, ${dayNumber} ${monthName} ${chosenYear} 00:00:01 +0000</pubDate>
                    <dc:creator>archive</dc:creator>
                    <guid isPermaLink='false'></guid>
                    <description></description>
                    <content:encoded>
                    <![CDATA[<!-- wp:paragraph --><p>You can listen to each tune here:</p><!-- /wp:paragraph --><!-- wp:shortcode -->[wpb_childpages]<!-- /wp:shortcode --><!-- wp:paragraph --><p>Or you can download a copy to listen to locally:</p><!-- /wp:paragraph --><!-- wp:shortcode -->[download_zip]/wp-content/uploads/ceol-aneas/${chosenYear}/Archive-${chosenYear}.zip[/download_zip]<!-- /wp:shortcode -->]]>
                    </content:encoded>
                    <wp:post_id></wp:post_id>
                    <wp:post_date>${chosenYear}-${monthNumber}-${dayNumber} 00:00:01</wp:post_date>
                    <wp:post_date_gmt>${chosenYear}-${monthNumber}-${dayNumber} 00:00:01</wp:post_date_gmt>
                    <wp:comment_status>closed</wp:comment_status>
                    <wp:ping_status>closed</wp:ping_status>
                    <wp:post_name>${chosenYear}-2</wp:post_name>
                    <wp:status>publish</wp:status>
                    <wp:post_parent></wp:post_parent>
                    <wp:menu_order>0</wp:menu_order>
                    <wp:post_type>page</wp:post_type>
                    <wp:post_password></wp:post_password>
                    <wp:is_sticky>0</wp:is_sticky>
                </item>
        `;

        downloadXML(`topLevel${chosenYear}.xml`);
    }

    function downloadXML(filename) {
        // XML file has a header, body, footer structure
        let XMLcontent = XMLheader + XMLbody + XMLfooter;
        downloadFile(filename, XMLcontent);
    }

    function downloadUnixInfo() {
        // This will contain details of files that need rename and ID3 tags that need fixed
        downloadFile("tunePagesInfoUnix.txt", infoFileUnix);
    }

    function downloadWindowsInfo() {
        // This will contain details of files that need rename and ID3 tags that need fixed
        downloadFile("tunePagesInfoWindows.txt", infoFileWindows);
    }

    function resetPage() {
        // Get ready to start again
        infoFileWindows = '';
        infoFileUnix = '';
        XMLbody = '';
        document.getElementById("files").innerHTML = '';
        fileInfo.innerHTML = 'Waiting for MP3 selection';
    }

    function downloadFile(filename, text) {
        let pom = document.createElement("a");
        pom.setAttribute(
            "href",
            "data:application/download;charset=utf-8," +
            encodeURIComponent(text)
        );
        pom.setAttribute("download", filename);

        if (document.createEvent) {
            let event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }

    // https://lucidar.me/en/web-dev/how-to-slugify-a-string-in-javascript/
    function slugify(str) {
        str = str.replace(/^\s+|\s+$/g, '');

        // Make the string lowercase
        str = str.toLowerCase();

        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        // Remove invalid chars
        str = str.replace(/[^a-z0-9 -]/g, '')
            // Collapse whitespace and replace by -
            .replace(/\s+/g, '-')
            // Collapse dashes
            .replace(/-+/g, '-');

        return str;
    }

    return {
        addTuneData: addTuneData,
        addSelectYears: addSelectYears,
        downloadTopPage: downloadTopPage,
        downloadXML: downloadXML,
        downloadWindowsInfo: downloadWindowsInfo,
        downloadUnixInfo: downloadUnixInfo,
        resetPage: resetPage,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = addTuneXML;
}
