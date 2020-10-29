---
layout: page
title: Wellington Slow Session - Archive
permalink: /slow-archive/
---

These are the previous <span id='tunesCount'></span> tunes we've been focussing on.

<script src="/js/build_grid_focustunes.js"></script>
<<<<<<< HEAD
=======

## Current Focus Tunes

We have a number of tunes we're currently focusing on. These might be new tunes
or tunes we've decided to reprise. These will change at some stage. We'll play
these at some point during the first hour.

{% assign focustunecount = 4 %}
{% assign legend="Current Focus Tunes" %}
{% assign tuneID = 100 %}
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tune = sortedtunes.first %}
{% if tune.slowtuneoftheweek %}


<script>
window.currentFocusTunes = {
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tune_count = 0 %}
{% assign tuneID = 100 %}
{% for tune in sortedtunes %}
    {% if tune_count > 0 %}
        {% if tune.slowtuneoftheweek %}
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
        }{% if tune_count < 4 %},{% else %}{% break %}{% endif %}
        {% endif %}
    {% endif %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneID = tuneID | plus: 1 %}
{% endfor %}
};

</script>

{% include focustunes.html divID="gridCurrentFocusTunes" storeName="window.currentFocusTunes" %}

{% endif %}

## Recent Slow Session Focus Tunes

These are the {{ site.slow_tunes_max }} tunes we've been focussing on over the last few months.

>>>>>>> ba3506da78db126bb666b75f87379b0f8ed117b9
<script>
window.currentTunes = {
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tune_count = 0 %}
{% assign tuneID = 200 %}
{% for tune in sortedtunes %}
    {% if tune_count > 0 %}
        {% if tune.slowtuneoftheweek %}
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
        }{% if tune_count < 200 %},{% else %}{% break %}{% endif %}
        {% endif %}
    {% endif %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneID = tuneID | plus: 1 %}
{% endfor %}

};

</script>

{% include focustunes.html divID="gridCurrentTunes" storeName="window.currentTunes" %}

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
