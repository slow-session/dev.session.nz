---
layout: page
title: Wellington Slow Session
permalink: /slowsession/
---

## Introduction to the slow session

We meet on Tuesday nights from {{ site.slowsession_time }} at the <a href="/dragon/">
Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand.
Players who want to play traditional Irish music at a relaxed pace are welcome.

The slow session is an opportunity for players who are starting out with Irish
traditional music and want an opportunity to play tunes that they're learning
or have already learnt with others in a supportive environment.

We don't teach tunes in this session but it's a great chance to practice
playing with others. The focus is on melody instruments, but there is some scope for
accompaniment. Accompanists should read the "Advice to accompanists" section (Rewrite section in learn_by_ear page) INSTERT LINK!]

Learning by ear, and playing tunes from memory is strongly encouraged. Please read the "Learn by ear" page. INSERT LINK!

See our <a href="/slowguidelines/"><button class="filterButton">Guidelines for the Slow Session</button></a> if you need more information.

<script src="/js/build_grid_focustunes.js"></script>

## Current Focus Tunes

We have a number of tunes we're currently focusing on. We'll play
these at some point during the first hour each week. The list will change regularly.

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

## Short list of popular tunes

Here is a list of 20 tunes that are played frequently at the slow session, it is a good place to start if you are keen to learn some tunes. We'll also be happy to take requests if there is a tune you've been working on.

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
