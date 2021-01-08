---
layout: page
title: Full Synth
permalink: full-synth
---
<link rel="stylesheet" type="text/css" href="../abcjs-audio.css">
<style>
    main {
        max-width: 770px;
        margin: 0 auto;
    }

    .feedback {
        height: 600px;
        font-family: Arial, "sans-serif";
    }

    .highlight {
        fill: #0a9ecc;
    }

    .abcjs-cursor {
        stroke: red;
    }

    .audio-error {
        color: red;
        border: 2px solid red;
        padding: 10px;
    }

    .click-explanation {
        color: red;
        font-style: italic;
    }

    .beat {
        font-weight: bold;
    }

    .label {
        color: #888888;
    }
</style>

<script type="text/javascript">
    var cursorControl = null;

    var abc = [
        "T: Cooley's\n" +
        "M: 4/4\n" +
        "L: 1/8\n" +
        "R: reel\n" +
        "K: Emin\n" +
        "|:{E}D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\n" +
        "EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\n" +
        "|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\n" +
        "eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|",

        "X:1\n" +
        "T:Bill Bailey\n" +
        "M:4/4\n" +
        "L:1/4\n" +
        "Q:1/4=210\n" +
        "K:C\n" +
        "\"C\"GA2c|e3/2^d/2eg|GA2c|e4|GA2c|e2g2|\"G7\"(gB3-|B4)|\n" +
        "GB2d|fefg|GB2d|f4|GB2d|g2\"G+\"a2|\"C\"(ae3-|e4)|\n" +
        "GA2c|e3/2^d/2eg|GA2c|e3G|GGce|g2_b2|\"F\"a2-a2-|a3c|\n" +
        "cc2c|\"F#dim7\"d2c2|\"C\"gg2a|\"A7\"e3e|\"D7\"ed^cd|\"G7\"f2e2|\"C\"c4-|czz2|]",

        "X:1\n" +
        "T:All Notes On Piano\n" +
        "M:4/4\n" +
        "Q:120\n" +
        "L:1/4\n" +
        "K:C clef=bass\n" +
        "A,,,,^A,,,,B,,,,C,,,|^C,,,D,,,^D,,,E,,,|F,,,^F,,,G,,,^G,,,|A,,,^A,,,B,,,C,,|\n" +
        "^C,,D,,^D,,E,,|F,,^F,,G,,^G,,|A,,^A,,B,,C,|^C,D,^D,E,|\n" +
        "K:C clef=treble\n" +
        "F,^F,G,^G,|A,^A,B,C|^CD^DE|F^FG^G|\n" +
        "A^ABc|^cd^de|f^fg^g|a^abc'|\n" +
        "^c'd'^d'e'|f'^f'g'^g'|a'^a'b'c''|^c''d''^d''e''|\n" +
        "f''^f''g''^g''|a''^a''b''c'''|^c'''4|]"
    ];

    var tuneNames = ["Cooleys", "Bill Bailey", "All Notes On Piano"];

    var currentTune = 0;

    var synthControl;

    var abcOptions = {
        add_classes: true,
        responsive: "resize"
    };

    function load() {
        document.querySelector(".next").addEventListener("click", next);
        document.querySelector(".start").addEventListener("click", start);

        if (ABCJS.synth.supportsAudio()) {
            synthControl = new ABCJS.synth.SynthController();
            synthControl.load("#audio", cursorControl, {
                displayLoop: true,
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayWarp: true
            });
        } else {
            document.querySelector("#audio").innerHTML =
                "<div class='audio-error'>Audio is not supported in this browser.</div>";
        }
        setTune(false);
    }

    function download() {
        if (synthControl)
            synthControl.download(tuneNames[currentTune] + ".wav");
    }

    function start() {
        if (synthControl)
            synthControl.play();
    }

    function setTune(userAction) {
        var visualObj = ABCJS.renderAbc("paper", abc[currentTune], abcOptions)[0];

        window.AudioContext = window.AudioContext ||
            window.webkitAudioContext ||
            navigator.mozAudioContext ||
            navigator.msAudioContext;
        var audioContext = new window.AudioContext();
        if (audioContext.state !== 'running') {
            audioContext.resume();
        }
        var midiBuffer = new ABCJS.synth.CreateSynth();
        console.log(visualObj);
        midiBuffer.init({
            visualObj: visualObj,
            audioContext: audioContext,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            debugCallback: function (message) { console.log(message) },
            soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/",
            options: {
                    program: 21
            }
        }).then(function (response) {
            console.log(response);
            if (synthControl) {
                synthControl.setTune(visualObj, userAction).then(function (response) {
                    console.log("Audio successfully loaded.")
                }).catch(function (error) {
                    console.warn("Audio problem:", error);
                });
            }
        }).catch(function (error) {
            console.warn("Audio problem:", error);
        });
    }

    function next() {
        currentTune++;
        if (currentTune >= abc.length) {
            currentTune = 0;
        }
        setTune(true);
    }
</script>

<h1>Demo of abcjs audio capabilities</h1>

<p>You are in control of the look of the cursor. Two different techniques are demonstrated: highlighting the note being
    played and putting a cursor on the page. The class CursorControl must be supplied by your program.</p>
<p>As the piece is playing, there are callbacks when the note changes. The info returned in the callback is printed to
    the page as it is received.</p>
<p>The visual control for playing music can look different. In this example, the abcjs-audio.css file has been loaded.
    You can supply your own css.</p>
<button class="next">Next Tune</button>
<button class="start">Start/Pause</button>
<button class="download" style="display: none;">Download</button>
<div id="paper"></div>
<div id="audio"></div>
<p class="beat"></p>


<script>
    load();
</script>