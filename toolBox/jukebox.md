---
layout: page
title: Jukebox
permalink: /jukebox/
---
<script>

window.store = {
    {% assign tunes = site.tunes %}
    {% assign sortedtunes = tunes | sort: 'titleID' %}
    {% assign tuneID = 1 %}
    {% for tune in sortedtunes %}
        "{{ tuneID }}": {
            "title": "{{ tune.title | xml_escape }}",
            "tuneID": "{{ tuneID }}",
            "key": "{{ tune.key | xml_escape }}",
            "rhythm": "{{ tune.rhythm | xml_escape }}",
            "url": "{{ tune.url | xml_escape }}",
            "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
            "mp3_source": "{{ tune.mp3_source | strip_html | xml_escape }}",
            "repeats": "{{ tune.repeats }}",
            "parts": "{{ tune.parts }}",
            "abc": {{ tune.abc | jsonify }}
            {% assign tuneID = tuneID | plus: 1 %}
            }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    };
</script>

{% include tuneModal.html %}

{% assign tuneID = tuneID | minus: 1 %}

<p> Pick a tune at random from the archive: 
<input class="filterButton" type="button" onclick="audioPlayer.selectTune(store, wssTools.getRandomInt(1, {{ tuneID }}));" value="JukeBox">
</p>

<script>
document.addEventListener("DOMContentLoaded", function (event) {

});
</script>
