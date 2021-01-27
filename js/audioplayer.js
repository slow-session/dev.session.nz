/*
 * Audio controls for the browser audio player
 *
 * Version: 2.1
 * Date: 25 Nov 2020
 *
 * Developed as part of websites for https://dev.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/dev.session.nz/blob/master/js/audioplayer.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */
"use strict";

const audioPlayer = (function () {
    /*
     ################################################################################
     #
     # Comment out the line with "console.log" to turn off console logging
     #
     ################################################################################
    */
    function myDebug(message) {
        console.log(message);
    }

    var beginLoopTime = 0;
    var endLoopTime = 0;
    var previousPlayButton = null;
    var currentAudioSlider = null;
    var presetLoopSegments = [];
    var isIOS = testForIOS();

    function createAudioPlayer() {
        let audioPlayer = `
<!-- declare an Audio Player for this page-->
<audio id="OneAudioPlayer">
    <source id="mp3Source" type="audio/mp3"></source> 
    Your browser does not support the audio format.
</audio>`;

        return audioPlayer;
    }

    function createMP3player(tuneID, mp3url) {
        // build the MP3 player for each tune
        let mp3player = `
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
    <div id="audioPlayer-${tuneID}" class="audioParentOuter">
        <!-- Col 1 - play button -->
        <div class="playpauseButton">
            <button id="playMP3-${tuneID}" class="playButton" onclick="audioPlayer.playAudio(${tuneID}, '${mp3url}')"></button>
        </div>
        <!-- Nested row in second column -->
        <div class="audioParentInner">
            <!-- Col 2 - audio slider -->
            <div class="audioChildInner">
                <div class="audio">
                    <span title="Play the tune and then create a loop using the Start and End sliders">
                        <div id="positionMP3-${tuneID}"></div>
                    </span>
                </div>
                <div class="mp3LoopControl">
                    <span title="Play the tune and then create a loop using the Loop Start and Loop End buttons">
                        <input type="button" class="loopButton" id="LoopStart" value=" Loop Start " onclick="audioPlayer.setFromSlider()" />
                        <input type="button" class="loopButton" id="LoopEnd" value=" Loop End " onclick="audioPlayer.setToSlider()" />
                        <input type="button" class="loopButton" id="Reset" value=" Reset " onclick="audioPlayer.resetFromToSliders()" />
                    </span>
                </div>
            </div>
            <!-- Col 3 - speed slider -->
            <div class="audioChildInner">
                <div id="speedControl-${tuneID}">
                <span title="Adjust playback speed with slider">
                        <div id="speedSliderMP3-${tuneID}"></div>
                        <p class="mp3SpeedLabel"><strong>Playback Speed</strong></p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</form>`;

        return mp3player;
    }

    function createMP3Sliders(tuneID) {
        let audioSlider = document.getElementById(`positionMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

        noUiSlider.create(audioSlider, {
            start: [0, 0, 100],
            connect: [false, true, true, false],
            behaviour: "drag",
            step: 0.25,
            range: {
                min: 0,
                max: 100,
            },
        });

        noUiSlider.create(speedSlider, {
            start: [100],
            tooltips: [
                wNumb({
                    decimals: 0,
                    postfix: " %",
                }),
            ],
            range: {
                min: 51,
                max: 121,
            },
        });

        audioSlider.noUiSlider.on("change", function (values, handle) {
            if (handle === 0) {
                beginLoopTime = values[0];
                endLoopTime = assignendLoopTime(values[2]);
                saveUserLoop(values);
            } else if (handle === 2) {
                beginLoopTime = values[0];
                endLoopTime = assignendLoopTime(values[2]);
                saveUserLoop(values);
            } else if (handle === 1) {
                OneAudioPlayer.currentTime = values[1];
            }
        });
        audioSlider.noUiSlider.on("start", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.pause();
            };
        });
        audioSlider.noUiSlider.on("end", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.play();
            };
        });
        speedSlider.noUiSlider.on("change", function (value) {
            myDebug("playbackRate: " + value / 100);
            OneAudioPlayer.playbackRate = value / 100;
        });
        //How to disable handles on audioslider.
        speedSlider.noUiSlider.on("start", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.pause();
            };
        });
        speedSlider.noUiSlider.on("end", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.play();
            };
        });
    }

    function playAudio(tuneID, audioSource) {
        let playButton = document.getElementById(`playMP3-${tuneID}`);
        let playPosition = document.getElementById(`positionMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

        if (playButton.className == "playButton") {
            if (!OneAudioPlayer.src.includes(audioSource)) {
                if (OneAudioPlayer.src != null) {
                    //reset previous audio player
                    if (previousPlayButton != null) {
                        previousPlayButton.className = "playButton";
                    }
                }
                previousPlayButton = playButton;

                LoadAudio(audioSource, playPosition);
                console.log(OneAudioPlayer.defaultMuted);

                OneAudioPlayer.onloadedmetadata = function () {
                    initialiseAudioSlider();
                };
            }
            // Initialise the loop and audioSlider
            if (!endLoopTime) {
                endLoopTime = OneAudioPlayer.duration;
            }

            // This event listener keeps track of the cursor and restarts the loops
            // when needed - we don't need to set it elsewhere
            OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
            OneAudioPlayer.addEventListener("ended", restartLoop);

            OneAudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;


            let playPromise = OneAudioPlayer.play();
            if (playPromise) {
                playPromise.catch(function (error) {
                    console.error(error);
                });
            }
            playButton.className = "";
            playButton.className = "pauseButton";
        } else {
            OneAudioPlayer.pause();
            playButton.className = "";
            playButton.className = "playButton";
        }
    }

    function selectTune(storeID, tuneID) {
        let item = storeID[tuneID];

        let showPlayer = document.getElementById("showPlayer");

        let tuneInfo = document.getElementById("tuneInfo");
        if (tuneInfo) {
            tuneInfo.innerHTML = "";
        }

        // Clear the loop preset display
        let loopPresetControls = document.getElementById("loopPresetControls");
        if (loopPresetControls) {
            loopPresetControls.innerHTML = "";
        }

        let loopForm = document.getElementById("loopForm");
        if (loopForm) {
            loopForm.style.display = "none";
        }

        presetLoopSegments = [];

        let dotsForm = document.getElementById("dotsForm");
        if (dotsForm) {
            dotsForm.style.display = "block";
        }

        // If we have a modal make it visible
        let modal = document.getElementById("tuneModal");
        if (modal) {
            modal.style.display = "block";
        }

        // Add info to page if needed
        let tuneTitle = document.getElementById("tuneTitle");
        if (tuneTitle) {
            tuneTitle.innerHTML =
                "<h2>" +
                item.title +
                "<span> - " +
                item.key +
                " " +
                item.rhythm +
                "</span></h2>";
        }

        if (item.mp3.includes("mp3") && showPlayer) {
            let tuneInfo = document.getElementById("tuneInfo");
            if (tuneInfo && item.mp3_source) {
                tuneInfo.innerHTML = "Source: " + item.mp3_source;
            }

            // make the MP3 player
            showPlayer.innerHTML = audioPlayer.createMP3player(tuneID, item.mp3);
            createMP3Sliders(tuneID);

            let playPosition = document.getElementById(`positionMP3-${tuneID}`);
            LoadAudio(item.mp3, playPosition);

            // calculate presetLoopSegments and set up preset loops
            OneAudioPlayer.onloadedmetadata = function () {
                //myDebug("OneAudioPlayer.duration: " + OneAudioPlayer.duration);
                if (item.repeats && item.parts) {
                    //myDebug('setupPresetLoops: ' + OneAudioPlayer.duration);
                    buildSegments(item);
                    if (presetLoopSegments.length) {
                        document.getElementById(
                            "loopPresetControls"
                        ).innerHTML = createLoopControlsContainer();
                    }
                    if (loopForm) {
                        loopForm.style.display = "block";
                    }
                }
                initialiseAudioSlider();
            };
        } else {
            // no recording available
            if (showPlayer) {
                let recordingMessage =
                    "<fieldset><strong> \
            A recording for this tune is not available.";
                if (modal) {
                    recordingMessage +=
                        '<br /><input class="filterButton" type="button" onclick="location.href=\'' +
                        item.url +
                        '\';" value="Go to Tune Page" />';
                    if (dotsForm) {
                        dotsForm.style.display = "none";
                    }
                }
                recordingMessage += "</strong></fieldset>";

                showPlayer.style.overflow = "auto";
                showPlayer.innerHTML = recordingMessage;
            }

            if (loopForm) {
                loopForm.style.display = "none";
            }
        }

        if (item.abc) {
            let abcText = document.getElementById(`textAreaABC`);
            if (abcText) {
                abcText.innerHTML = item.abc;
            }

            // Get the current paper state
            let currentPaperState = document.getElementById("abcPaper").style.display;
            // Set the paper state to 'block'
            document.getElementById("abcPaper").style.display = "block";

            // Draw the dots
            let abcEditor = new window.ABCJS.Editor("textAreaABC", {
                paper_id: "abcPaper",
                warnings_id: "warnings",
                render_options: {
                    responsive: 'resize'
                },
                indicate_changed: "true",
                synth: {
                    el: "#abcAudio",
                    options: {
                        displayLoop: true,
                        displayRestart: true,
                        displayPlay: true,
                        displayProgress: true,
                        displayWarp: true,
                    }
                }
            });
            
            // Reset paper state to original value
            document.getElementById("abcPaper").style.display = currentPaperState;
        } else {
            document.getElementById("abcPaper").style.paddingBottom = "0px";
            document.getElementById("abcPaper").style.overflow = "auto";
            let urlSessionSearch =
                "https://thesession.org/tunes/search?type=" +
                item.rhythm +
                "&q=" +
                item.title.replace(/\s+/g, "+");
            document.getElementById("abcPaper").innerHTML =
                "<fieldset><strong> \
        <p>We don't have dots for this tune. If you find a version of the tune that's a good match, send \
        us a copy of the ABC and we'll get it added to the site. You might find it on The Session \
        at this link:</p>\
        <a href=\"" +
                urlSessionSearch +
                '">' +
                urlSessionSearch +
                "</a>\
        </strong></fieldset>";
        }
    }

    function LoadAudio(audioSource, playPosition) {
        myDebug("Loading: " + audioSource)
        OneAudioPlayer.src = audioSource;

        OneAudioPlayer.load();
        
        playPosition.noUiSlider.updateOptions({
            tooltips: [
                wNumb({
                    decimals: 1,
                }),
                wNumb({
                    decimals: 1,
                }),
                wNumb({
                    decimals: 1,
                }),
            ],
        });
        currentAudioSlider = playPosition;
    }

    function initialiseAudioSlider() {
        //myDebug('initialiseAudioSlider: ' + OneAudioPlayer.duration);
        currentAudioSlider.noUiSlider.updateOptions({
            range: {
                min: 0,
                max: OneAudioPlayer.duration,
            },
        });
        resetFromToSliders();
    }

    function positionUpdate() {
        if (OneAudioPlayer.currentTime >= endLoopTime) {
            //myDebug("Current time: " + OneAudioPlayer.currentTime);
            OneAudioPlayer.currentTime = beginLoopTime;
            //myDebug("Reset loop start to: " + OneAudioPlayer.currentTime);
        }
        currentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
    }

    function restartLoop() {
        OneAudioPlayer.currentTime = beginLoopTime;
        //myDebug("Restarting loop at: " + OneAudioPlayer.currentTime);
        OneAudioPlayer.play();
    }

    function buildSegments(item) {
        let parts = item.parts;
        let repeats = item.repeats;
        let mySegment;

        presetLoopSegments = [];

        // If tune MD file has AABB notation use that
        if (parts.toString().includes("A")) {
            let lastPart = "";
            let part_names = parts.split("");
            let repeatCount = 1;
            for (let i = 0; i < part_names.length; i++) {
                mySegment = {
                    name: 0,
                    start: 0,
                    end: 0,
                };
                if (lastPart == part_names[i]) {
                    repeatCount = 2;
                } else {
                    repeatCount = 1;
                }
                mySegment.name = part_names[i] + " Repeat " + repeatCount;
                presetLoopSegments.push(mySegment);
                lastPart = part_names[i];
            }
            // Insert the values
            let start = 0.0;
            let end = 0.0;
            let each_part =
                OneAudioPlayer.duration / repeats / presetLoopSegments.length;
            for (let key in presetLoopSegments) {
                start = each_part * key;
                end = start + each_part;
                presetLoopSegments[key].start = start.toFixed(1);
                presetLoopSegments[key].end = end.toFixed(1);
            }
        }
        // Add segment for user-defined use
        mySegment = {
            name: 0,
            start: 0,
            end: 0,
        };
        mySegment.name = "User-1";
        mySegment.end = OneAudioPlayer.duration.toFixed(1);
        presetLoopSegments.push(mySegment);
    }

    function createLoopControlsContainer() {
        document.getElementById("loopForm").style.display = "block";
        toggleLoops("Show Preset Loops");

        let loopControlsContainer = `
<div class="container loop-container"><div class="row row-title">
    <div class="small-4 columns"><strong>Select Preset Loops</strong></div>
    <div class="small-4 columns" style="text-align: center;"><strong>Start</strong></div>
    <div class="small-4 columns" style="text-align: center;"><strong>Finish</strong></div>
</div>`;

        for (let segmentNumber = 0; segmentNumber < presetLoopSegments.length; segmentNumber++) {
            // row-odd class allows row 'striping'
            if (segmentNumber % 2) {
                loopControlsContainer += '<div class="row row-odd">';
            } else {
                loopControlsContainer += '<div class="row">';
            }
            // build each row
            loopControlsContainer += `
        <!-- select loop -->
        <div class="small-4 columns"><input class="loopClass" type="checkbox" onclick="audioPlayer.applySegments()" id="check${segmentNumber}">${presetLoopSegments[segmentNumber].name}</div>
        <!-- adjust start of loop -->
        <div class="small-4 columns" style="text-align: center;">
        <a href="javascript:void(0);" class = "downButton" type="button" id= "button${segmentNumber}dn" onclick="audioPlayer.adjustDown(${segmentNumber}, 0)"> 
        <span title=" - 1/5 second">&lt;&lt;</a>
        <input class="loopClass" type="text" onchange="audioPlayer.applySegments()" id="check${segmentNumber}from" size="4" style= "height: 18px;" value=${presetLoopSegments[segmentNumber].start}> 
        <a href="javascript:void(0);" 
        class = "upButton" type="button" id= "button${segmentNumber}up" onclick="audioPlayer.adjustUp(${segmentNumber}, 0)"> 
        <span title=" + 1/5 second">&gt;&gt;</a> 
        </div>
        <!-- adjust end of loop -->
        <div class="small-4 columns" style="text-align: center;">
        <a href="javascript:void(0);" class = "downButton" type="button" id= "button${segmentNumber}dn" onclick="audioPlayer.adjustDown(${segmentNumber}, 2)">
        <span title=" - 1/5 second">&lt;&lt;</a> 
        <input class="loopClass" type="text" onchange="audioPlayer.applySegments()" id="check${segmentNumber}to" size="4" style= "height: 18px;" value=${presetLoopSegments[segmentNumber].end}> 
        <a href="javascript:void(0);" 
        class = "upButton" type="button" id= "button${segmentNumber}up" onclick="audioPlayer.adjustUp(${segmentNumber}, 2)"> 
        <span title=" + 1/5 second">&gt;&gt;</a> 
        </div>`;

            // End of row
            loopControlsContainer += "</div>";
        }
        loopControlsContainer += "</div>";

        return loopControlsContainer;
    }

    function saveUserLoop(values) {
        if (presetLoopSegments.length) {
            // Preset loop 'User-1' is always the last segment
            let lastSegment = presetLoopSegments.length - 1;

            if (document.getElementById("check" + lastSegment).checked) {
                document.getElementById("check" + lastSegment + "from").value = Number(
                    values[0]
                ).toFixed(1);
                document.getElementById("check" + lastSegment + "to").value = Number(
                    values[2]
                ).toFixed(1);
            }
        }
    }

    function applySegments() {
        let fullbeginLoopTime = parseFloat(OneAudioPlayer.duration);
        let fullendLoopTime = 0.0;
        let numCheckedBoxes = 0;
        let tempbeginLoopTime = 0.0;
        let tempendLoopTime = 0.0;
        let checkBox, fromId, toId;

        for (let i = 0; i < presetLoopSegments.length; i++) {
            checkBox = document.getElementById("check" + i);
            fromId = document.getElementById("check" + i + "from");
            toId = document.getElementById("check" + i + "to");

            if (checkBox.checked == true) {
                numCheckedBoxes++;
                tempbeginLoopTime = parseFloat(fromId.value);
                tempendLoopTime = parseFloat(toId.value);
                //myDebug("Is " + fullbeginLoopTime + " greater than " + tempbeginLoopTime);
                if (fullbeginLoopTime > tempbeginLoopTime) {
                    //myDebug("A, " + beginLoopTime + ", " + fullbeginLoopTime);
                    fullbeginLoopTime = tempbeginLoopTime;
                }
                //myDebug("Is " + fullendLoopTime + " less than " + tempendLoopTime);
                if (fullendLoopTime < tempendLoopTime) {
                    //myDebug("B, "+tempendLoopTime+", "+ fullendLoopTime);
                    fullendLoopTime = tempendLoopTime;
                }
                //myDebug(i + ", " + beginLoopTime + ", "+ endLoopTime + ", " + fullbeginLoopTime + ", " + fullendLoopTime);
            }
        }
        //myDebug(fullbeginLoopTime + ", " + fullendLoopTime);
        // do nothing unless at least one box is checked
        if (numCheckedBoxes > 0) {
            // iOS audio player workaround for initial call to OneAudioPlayer.currentTime
            if (isIOS) {
                OneAudioPlayer.oncanplaythrough = function () {
                    OneAudioPlayer.currentTime = fullbeginLoopTime;
                };
            } else {
                OneAudioPlayer.currentTime = fullbeginLoopTime; // look here
            }
            // first reset to ends, then reposition
            currentAudioSlider.noUiSlider.setHandle(0, 0);
            currentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
            currentAudioSlider.noUiSlider.setHandle(1, 0);
            // then set to positions in row
            currentAudioSlider.noUiSlider.setHandle(1, fullbeginLoopTime);
            currentAudioSlider.noUiSlider.setHandle(0, fullbeginLoopTime);
            currentAudioSlider.noUiSlider.setHandle(2, fullendLoopTime);
            beginLoopTime = fullbeginLoopTime;
            endLoopTime = assignendLoopTime(fullendLoopTime);
            if (OneAudioPlayer.paused == false) {
                // audio was  playing when they fiddled with the checkboxes
                let promise = OneAudioPlayer.play();
                // then turn it back on
                if (promise) {
                    promise.catch(function (error) {
                        console.error(error);
                    });
                }
            }
        } else {
            resetFromToSliders();
        }
    }

    function adjustUp(row, inputBox) {
        let elementName = "check" + row;
        if (document.getElementById(elementName).checked == false) {
            return;
        }
        if (inputBox == 0) {
            elementName += "from";
        } else if (inputBox == 2) {
            elementName += "to";
        }
        let checkBox = document.getElementById(elementName);
        NumValue = Number(checkBox.value);
        if (NumValue <= OneAudioPlayer.duration - 0.2) {
            checkBox.value = Number(NumValue + 0.2).toFixed(1);
            if ((endLoopTime - checkBox.value > 0.21) & (inputBox == 2)) {
                // don't change sliders if not at either end (0.21 overcomes rounding)
                return;
            }
            if ((checkBox.value - beginLoopTime > 0.21) & (inputBox == 0)) {
                // don't change sliders if not at either end
                return;
            }
            if ((inputBox == 0) & (OneAudioPlayer.currentTime < checkBox.value)) {
                OneAudioPlayer.currentTime = checkBox.value;
            }
            currentAudioSlider.noUiSlider.setHandle(inputBox, checkBox.value);
            if (inputBox == 0) {
                beginLoopTime = checkBox.value;
            } else if (inputBox == 2) {
                endLoopTime = assignendLoopTime(checkBox.value);
            }
        }
    }

    function adjustDown(row, inputBox) {
        let elementName = "check" + row;
        if (document.getElementById(elementName).checked == false) {
            return;
        }
        if (inputBox == 0) {
            elementName += "from";
        } else if (inputBox == 2) {
            elementName += "to";
        }
        let checkBox = document.getElementById(elementName);
        NumValue = Number(checkBox.value);
        if (NumValue >= 0.2) {
            checkBox.value = Number(NumValue - 0.2).toFixed(1);
            if ((endLoopTime - checkBox.value > 0.21) & (inputBox == 2)) {
                // don't change sliders if not at either end (0.21 overcomes rounding)
                return;
            }
            if ((checkBox.value - beginLoopTime > 0.21) & (inputBox == 0)) {
                // don't change sliders if not at either end
                return;
            }
            if ((inputBox == 2) & (OneAudioPlayer.currentTime > checkBox.value)) {
                OneAudioPlayer.currentTime = checkBox.value;
            }
            currentAudioSlider.noUiSlider.setHandle(inputBox, checkBox.value);
            if (inputBox == 0) {
                beginLoopTime = checkBox.value;
            } else if (inputBox == 2) {
                endLoopTime = assignendLoopTime(checkBox.value);
            }
        }
    }

    function toggleLoops(button) {
        switch (button.value) {
            case "Show Preset Loops":
                button.value = "Hide Preset Loops";
                document.getElementById("loopPresetControls").style.display = "block";
                break;
            case "Hide Preset Loops":
                button.value = "Show Preset Loops";
                document.getElementById("loopPresetControls").style.display = "none";
                break;
        }
    }

    function toggleTheDots(button) {
        switch (button.value) {
            case "Show the Dots":
                button.value = "Hide the Dots";
                document.getElementById("abcOutput").style.display = "block";
                break;
            case "Hide the Dots":
                button.value = "Show the Dots";
                document.getElementById("abcOutput").style.display = "none";
                break;
        }
    }

    function toggleABC(button) {
        switch (button.value) {
            case "Show ABC Source":
                button.value = "Hide ABC Source";
                document.getElementById("abcSource").style.display = "block";
                break;
            case "Hide ABC Source":
                button.value = "Show ABC Source";
                document.getElementById("abcSource").style.display = "none";
                break;
        }
    }

    function setFromSlider() {
        currentAudioSlider.noUiSlider.setHandle(0, OneAudioPlayer.currentTime);
        beginLoopTime = OneAudioPlayer.currentTime;
    }

    function setToSlider() {
        currentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.currentTime);
        endLoopTime = OneAudioPlayer.currentTime;
    }

    function resetFromToSliders() {
        currentAudioSlider.noUiSlider.setHandle(0, 0);
        beginLoopTime = 0;
        currentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
        endLoopTime = OneAudioPlayer.duration;
        // Uncheck all the checkboxes in the Preset Loops
        for (let i = 0; i < presetLoopSegments.length; i++) {
            document.getElementById("check" + i).checked = false;
        }
    }

    function assignendLoopTime(endLoopValue) {
        // Don't allow endLoopTime to be >= OneAudioPlayer.duration
        if (endLoopValue > OneAudioPlayer.duration) {
            endLoopValue = OneAudioPlayer.duration;
        }
        return endLoopValue;
    }

    function testForIOS() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (
            userAgent.match(/iPad/i) ||
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i)
        ) {
            return true;
        } else {
            return false;
        }
    }

    return {
        createAudioPlayer: createAudioPlayer,
        createMP3player: createMP3player,
        createMP3Sliders: createMP3Sliders,
        playAudio: playAudio,
        selectTune: selectTune,
        setFromSlider: setFromSlider,
        setToSlider: setToSlider,
        resetFromToSliders: resetFromToSliders,
        applySegments: applySegments,
        adjustUp: adjustUp,
        adjustDown: adjustDown,
        toggleABC: toggleABC,
        toggleTheDots: toggleTheDots,
        toggleLoops: toggleLoops,

    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = audioPlayer;
}