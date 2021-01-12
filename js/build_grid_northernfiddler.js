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

(function () {
  function displayTunesGrid(results, store) {
    var tunesGrid = document.getElementById("tunesGrid");
    var tunesCount = document.getElementById("tunesCount");
    var tunesCounter = 0;

    // create table headers
    if (wssTools.testForMobile()) {
      var appendString =
        '<div id="tunes" class="tunes3columnLayout mobileScrolling">';
    } else {
      var appendString = '<div id="tunes" class="tunes3columnLayout">';
    }

    if (results.length) {
      // Are there any results?
      for (var i = 0; i < results.length; i++) {
        // Iterate over the results
        var item = store[results[i].ref];
        appendString += createGridRow(item);
        tunesCounter++;
      }
    } else {
      for (var key in store) {
        // Iterate over the original data
        var item = store[key];
        appendString += createGridRow(item);
        tunesCounter++;
      }
    }
    appendString += "</div";
    tunesGrid.innerHTML = appendString;
    tunesCount.innerHTML = tunesCounter;
  }

  function createGridRow(item) {
    var gridRow = "";

    // build the three columns
    gridRow += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
    gridRow += "<span>" + item.key + " " + item.rhythm + "</span>";
    gridRow += "<span>" + item.musician + " Page " + item.page + "</span>";

    return gridRow;
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
      }
    }
  }

  // create the searchTerm from the form data and reflect the values chosen in the form
  var searchTerm = "";
  var title = getQueryVariable("title");
  if (title) {
    searchTerm = title + " ";
    document.getElementById("title-box").setAttribute("value", title);
  }
  var rhythm = getQueryVariable("rhythm");
  if (rhythm) {
    searchTerm += rhythm + " ";
    var e = document.getElementById("rhythm-box");
    if (e) {
      e.value = rhythm;
    }
  }
  var musician = getQueryVariable("musician");
  if (musician) {
    searchTerm += musician + " ";
    var e = document.getElementById("musician-box");
    if (e) {
      e.value = musician;
    }
  }
  // Define the index terms for lunr search
  var tuneIndex = lunr(function () {
    this.field("id");
    this.field("title", {
      boost: 10,
    });
    this.field("rhythm");
    this.field("musician");
  });

  // Add the search items to the search index
  for (var key in window.store) {
    // Add the data to lunr
    tuneIndex.add({
      id: key,
      title: window.store[key].title,
      rhythm: window.store[key].rhythm,
      musician: window.store[key].musician,
    });
  }

  // Get results
  if (searchTerm) {
    var results = tuneIndex.search(searchTerm); // Get lunr to perform a search

    // sort the results
    results.sort((a, b) => a.ref - b.ref);

    if (results.length) {
      displayTunesGrid(results, window.store);
    } else {
      document.getElementById("tunesCount").innerHTML = 0;
    }
  } else {
    displayTunesGrid("", window.store);
  }
  return false;
})();
