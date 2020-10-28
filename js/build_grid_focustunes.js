/*
 * Code for building index of tunes and searching it
 *
 * Version: 1.0
 * Date: 7 Dec 2016
 *
 * Developed as part of website for http://dev.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/dev.session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 *
 * Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
 */


    function displayFocusTunesGrid(divID, storeID) {
        var tunesGrid = document.getElementById(divID);
        
        // create table headers
        if (testForMobile()) {
            var appendString = `<div id="tunes${divID}" class="tunesArchiveLayout mobileScrolling">`;
        } else {
            var appendString = `<div id="tunes${divID}" class="tunesArchiveLayout">`;
        }

        for (var key in storeID) { // Iterate over the original data
            var item = storeID[key];
                appendString += createFocusGridRow(item);
                
        }
        appendString += '</div>';
        tunesGrid.innerHTML = appendString;
    }

    function createFocusGridRow(item) {
        var gridRow = '';

        // build the three columns
        gridRow += '<span><a href="' + item.url + '">' + item.title + '</a></span>';
        gridRow += '<span><input class="filterButton" type="button" onclick="changeTune(' + item.tuneID + ');" value="Play Now" /></span>';
        gridRow += '<span>' + item.key + ' ' + item.rhythm + '</span>';

        return gridRow;
    }
