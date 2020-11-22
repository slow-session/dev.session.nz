/*
 * Controls for the abc  player
 *
 * Version: 1.0
 * Date: 7 Dec 2016
 *
 * Developed as part of websites for https://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/wellington.session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */

var playingNow = 0;
var abcStopped = 0;
var ABCheader = /^([A-Za-z]):\s*(.*)$/;
var ABCPosition = {
    Ptr: 0
};
var lastplayButton;
var ABCCurrentTime = 0;
var ABCduration = 0;
var IntervalHandle;

// Select a timbre that sounds like an electric piano.
var instrument;


function createABCplayer(textArea, tuneID, timbre) {
    /*
     * Generate the HTML needed to play ABC tunes
     */
    instrument = makeInstrument(timbre);

    var abcPlayer = `
<form onsubmit="return false" oninput="level.value=flevel.valueAsNumber">
    <div class="audioParentOuter" id="ABC${tuneID}">
        <!-- Col 1 -->
        <div class="playpauseButton">
            <button id="playABC${tuneID}" class="playButton" onclick="playABC(${textArea}.value, playABC${tuneID}, positionABC${tuneID}, speedSliderABC${tuneID}.value)"></button>
        </div>
        <!-- Nested row in second column -->
        <div class="audioChildOuter">
            <div class="abcParentInner">
                <!-- Col 2 -->
                <div class="audioChildInner">
                    <input name="positionABC${tuneID}" id="positionABC${tuneID}" type="range" class="abcAudioControl slider" min="0" max="500" value="0" oninput="setABCPosition(value/100)" />
                    <p class="audioLabel">Playing the <i>dots</i>!</p>
                </div>
                <!-- Col 3 -->
                <div class="audioChildInner">
                    <span title="Adjust playback speed with slider">
                        <input name="flevel" id="speedSliderABC${tuneID}" class="abcSpeedControl slider" type="range" min="50" max="120" value="100" onchange="changeABCspeed(${textArea}.value, playABC${tuneID}, value)">
                        <p class="audioLabel">Speed - <strong><output name="level">100</output>%</strong></p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</form>`;

    return (abcPlayer);
}

function makeInstrument(timbre) {
    /*
     * Some old iPads break badly running more recent Javascript
     * We abstract this out into a separate function so that when it fails
     * the rest of the code continues on working - Arghh!
     */
    var tempInstrument = new Instrument(timbre);
    return (tempInstrument);
}

/*
 * Play an ABC tune when the button gets pushed
 */
function playABC(tuneABC, playButton, playPosition, bpm) {
    /*
     * Stop any current player
     */
    stopABC();        
    
    /* If we have multiple ABC tunes on a page and we start a second one,
     * close the previous one cleanly
     *
     * Do we still have multiple ABC players on a page ??
     *
     */
    if (lastplayButton && lastplayButton != playButton) {
        lastplayButton.className = "";
        lastplayButton.className = "playButton";
        setABCPosition(0);
    }
    lastplayButton = playButton;
    ABCPosition.Ptr = playPosition;

    if (playButton.className == "playButton") {
        let ticks = calculateTicks(tuneABC, bpm);
        
        // calculate tune length
        ABCduration = calculateTuneDuration(tuneABC, bpm);
                
        startABC(tuneABC, ticks);
        playButton.className = "";
        playButton.className = "stopButton";
    } else {
        playButton.className = "";
        playButton.className = "playButton";
    }
}

function changeABCspeed(tuneABC, playButton, bpm) {
    /*
     * stop any current player
     */
    stopABC();
    
    // if there's an active player, restart it at the new speed
    if (playButton.className == "stopButton") {
        let ticks = calculateTicks(tuneABC, bpm);
        
        // Change the speed of playback
        ABCduration = calculateTuneDuration(tuneABC, bpm);
        
        startABC(tuneABC, ticks);
    } 
}

function calculateTuneDuration(tuneABC, bpm) {
    // calculate number of bars
    var bars;
    bars = tuneABC.split("|").length;
    bars = Math.round(bars / 8) * 8;

    // Get the meter from the ABC
    var meterStr = getABCheaderValue("M:", tuneABC);
    if (meterStr == "C") {
        meterStr = "4/4";
    }
    if (meterStr == "C|") {
        meterStr = "2/2";
    }
    var noteLenStr = getABCheaderValue("L:", tuneABC);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }

    // calculate the length of the tune
    return (bars * eval(meterStr) * 16 * eval(noteLenStr) * 60 / bpm);
}

function calculateTicks(tuneABC, bpm) {
    // The ABC L: value scales the ticks value!
    var noteLenStr = getABCheaderValue("L:", tuneABC);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }

    return (bpm / (2 * eval(noteLenStr)));
}

function getABCheaderValue(key, tuneABC) {
    // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
    var regex = new RegExp(key);
    var lines = tuneABC.split("\n");
    var ABCvalue = '';
    var i;

    for (i = 0; i < lines.length; i += 1) {
        if (lines[i].match(regex)) {
            ABCvalue = lines[i].replace(regex, '')
            ABCvalue = ABCvalue.replace(/^\s+|\s+$/g, "");
            break;
        }
    }
    return ABCvalue;
}

function startABC(tuneABC, ticks) {
    playingNow = 1;
    abcStopped = 0;
    instrument.silence();
    instrument.play({
        tempo: ticks
    }, tuneABC, function () {
        playingNow = 0;
        loopABCTune(tuneABC, ticks);
    });
    setABCPosition(0);
    ABCCurrentTime = 0;

    IntervalHandle = setInterval(nudgeABCSlider, 100);
}

function stopABC() {
    clearInterval(IntervalHandle);
    abcStopped = 1;
    instrument.silence();
    setABCPosition(0);
}

function loopABCTune(tuneABC, ticks) {
    instrument.silence();
    clearInterval(IntervalHandle);
    if ((playingNow == 0) && (abcStopped == 0)) {
        startABC(tuneABC, ticks);
        setABCPosition(0);
        ABCCurrentTime = 0;
    }
}

function nudgeABCSlider() {
    ABCCurrentTime += 0.1;
    let floatTime = (ABCCurrentTime / ABCduration) * 500;
    ABCPosition.Ptr.value = floatTime;
}

function setABCPosition(ticks) {
    // move position of ABC tune via the slider
    ABCPosition.Ptr.value = ticks;
}
