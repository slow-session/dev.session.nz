---
layout: page
title: Wellington Slow Session
permalink: /slowsession/
---

We meet on Tuesday nights from {{ site.slowsession_time }} at the <a href="/dragon/">
Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand.
Players who want to play traditional Irish music at a relaxed pace are welcome.

The slow session is an opportunity for players who are starting out with Irish
traditional music and want an opportunity to play tunes that they're learning
or have already learnt with others in a supportive environment.
We don't teach tunes directly in this session but it's a great chance to practice
playing with others. There's some scope for accompaniment but the focus is on the
melody instruments.

See our <a href="/slowguidelines/"><button class="filterButton">Guidelines for the Slow Session</button></a> if you need more information.

<script src="/js/build_grid_focustunes.js"></script>

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

{% include focustunes.html divID="currentFocusTunes" storeID="window.currentFocusTunes" %}

<script>
window.currentFocusTunes = {
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
    },
};

</script>

{% endif %}

## Recent Slow Session Focus Tunes

These are the <span id="tunesCount"></span> tunes we've been focussing on over the last few months.

<script>
window.store = {
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
        }{% if tune_count < site.slow_tunes_max %},{% else %}{% break %}{% endif %}
        {% endif %}
    {% endif %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneID = tuneID | plus: 1 %}
{% endfor %}
};

</script>

{% include tunesArchiveGrid.html%}

## Latest Tunes

We add new tunes to the archive reasonably often.
You can check those out in our <a href="/latest/"><button class="filterButton"> Latest Tunes</button></a> page.

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
