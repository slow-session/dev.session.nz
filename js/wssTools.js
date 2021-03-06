"use strict";

const wssTools = (function () {
    function downloadABCFile(text) {
        // set the filename for downloading
        let filename = slugify(getABCheaderValue("T:", text)) + ".abc";

        downloadFile(filename, text);
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
    function slugify(str)
    {
        str = str.replace(/^\s+|\s+$/g, '');
    
        // Make the string lowercase
        str = str.toLowerCase();
    
        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i=0, l=from.length ; i<l ; i++) {
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

    function getCheckedCheckboxesFor(checkboxName) {
        let checkboxes = document.querySelectorAll(
            'input[name="' + checkboxName + '"]:checked'
        );
        let values = [];
        Array.prototype.forEach.call(checkboxes, function (el) {
            values.push(el.value);
        });
        return values;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function show_iframe(url) {
        // Add other sources as needed
        if (url.startsWith("https://www.youtube.com/")) {
            let myURL = url.replace("&t=", "?start=").split("v=")[1];

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing youtube video" src="https://www.youtube.com/embed/${myURL}" frameborder="0" allowfullscreen></iframe></div>`;

        } else if (url.startsWith("https://www.facebook.com/")) {
            let myURL = encodeURI(url);

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing facebook video" src="https://www.facebook.com/plugins/video.php?href=${myURL}&show_text=0&mute=0"  style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="false"></iframe></div>`;

        } else if (url.startsWith("https://vimeo.com/")) {
            let myURL = url.split("vimeo.com/")[1];

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing vimeo video" src="https://player.vimeo.com/video/${myURL}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`;
        } else if (url.startsWith("https://soundcloud.com/")) {
            let myURL = encodeURI(url);

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing soundcloud video" src="https://w.soundcloud.com/player/?url=${myURL}&hide_related=true" width="100%"></iframe></div>`;

        } else if (url.startsWith("https://media.comhaltas.ie/video/")) {
            let myURL = encodeURI(url);

            return `<div class="container-iframe"><video class="responsive-iframe" aria-label="iframe showing comhaltas video" controls><source src="${myURL}" type="video/mp4"></video></div>`;

        } else {
            // Don't recognize this URL
            return "";
        }
    }

    function getABCheaderValue(key, tuneABC) {
        // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
        const KEYWORD_PATTERN = new RegExp(`^\\s*${key}`);

        const lines = tuneABC.split(/[\r\n]+/).map(line => line.trim());
        const keyIdx = lines.findIndex(line => line.match(KEYWORD_PATTERN));
        if (keyIdx < 0) {
            return '';
        } else {
            return lines[keyIdx].split(":")[1].trim();
        }
    }

    function enterSearch(searchBox, submitSearch) {
        let enterSearch = document.getElementById(searchBox);
        enterSearch.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById(submitSearch).click();
            }
        });
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };      

    return {
        downloadABCFile: downloadABCFile,
        downloadFile: downloadFile,
        slugify: slugify,
        getCheckedCheckboxesFor: getCheckedCheckboxesFor,
        toTitleCase: toTitleCase,
        show_iframe: show_iframe,
        enterSearch: enterSearch,
        getRandomInt: getRandomInt,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = wssTools;
}
