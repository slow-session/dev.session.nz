/*
 * Controls for the abc  player
 *
 * Version: 2.1
 * Date: 25 Nov 2020
 *
 * Developed as part of websites for https://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/wellington.session.nz/blob/master/js/abcplayer.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */

"use strict";

const abcPlayer = (function () {

    let audioLoaded = false;
    let intervalHandle;
    let audioSlider = null;
    let audioDuration = 0;
    let sliderPosition = 0;
    //let midiBuffer = null;

    function createABCplayer(tuneID) {
        /*
         * Generate the HTML needed to play ABC tunes
         */

        let abcPlayer = `
    <form onsubmit="return false" oninput="level.value=flevel.valueAsNumber">
        <div class="audioParentOuter" id="ABC${tuneID}">
            <!-- Col 1 -->
            <div id="abcPlay${tuneID}" class="playpauseButton">
                <button id="playButton${tuneID}" class="playButton" onclick="abcPlayer.playPauseABC(${tuneID})"></button>
            </div>
            <!-- Nested row in second column -->
            <div class="audioParentInner">
                <!-- Col 2 -->
                <div class="audioChildInner">
                    <div id="audioSliderABC${tuneID}" class="abcAudioControl"></div>
                </div>
                <!-- Col 3 -->
                <div class="audioChildInner">
                    <span title="Adjust playback speed with slider">
                        <div id="speedSliderABC${tuneID}" class="abcSpeedControl"></div>
                        <p class="mp3SpeedLabel"><strong>Playback Speed</strong></p>
                    </span>
                </div>
            </div>
        </div>
    </form>`;

        return abcPlayer;
    }

    function createABCsliders(tuneID) {
        audioSlider = document.getElementById(`audioSliderABC${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderABC${tuneID}`);

        noUiSlider.create(audioSlider, {
            start: [0],
            tooltips: [
                wNumb({
                    decimals: 1,
                }),
            ],
            range: {
                min: [0],
                max: [100],
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

        speedSlider.noUiSlider.on("change", function (value) {
            sliderPosition = 0;
            audioDuration = midiBuffer.duration * 100 / value;
            setAudioSlider(audioDuration);
            synthControl.setWarp(value);
            synthControl.restart();
        });
    }

    function loadAudio(textAreaABC, tuneID) {
        let visualObj = ABCJS.renderAbc("*", textAreaABC.value)[0];

        midiBuffer.init({
            visualObj: visualObj,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            debugCallback: function (message) {
                console.log(message)
            },
            options: {
                program: 21,
                chordsOff: true,
                defaultQpm: 100,
            }
        }).then(function (response) {
            console.log(response);
            midiBuffer.prime().then(function (response) {
                audioDuration = midiBuffer.duration;
                setAudioSlider(audioDuration);
            });
        }).catch(function (error) {
            console.warn("Audio problem:", error);
        });
        
        synthControl.setTune(visualObj, false, {
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
        });

        let playButton = document.getElementById(`playButton${tuneID}`);
        playButton.className = "";
        playButton.className = "playButton";

        clearInterval(intervalHandle);
        sliderPosition = 0;
        audioSlider.noUiSlider.set(sliderPosition);
    
        audioLoaded = true;
        console.log(synthControl);
        console.log(midiBuffer);

        console.log(synthControl.isStarted);
    }

    /*
     * Play an ABC tune when the button gets pushed
     */
    function playPauseABC(tuneID) {
        let playButton = document.getElementById(`playButton${tuneID}`);

        if (!audioLoaded) {
            alert("No ABC loaded!");
            return;
        }
        if (playButton.className == "playButton") {
            playButton.className = "";
            playButton.className = "pauseButton";
            intervalHandle = setInterval(setSpeedSlider, 200);

        } else {
            playButton.className = "";
            playButton.className = "playButton";
            clearInterval(intervalHandle);
        }
        synthControl.play();
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

    function setAudioSlider(duration) {
        audioSlider.noUiSlider.updateOptions({
            range: {
                min: 0,
                max: duration,
            },
        });
    }

    function setSpeedSlider() {
        if (sliderPosition >= audioDuration) {
            console.log(sliderPosition);
            //midiBuffer.stop();
            //midiBuffer.start();
            synthControl.play();
            sliderPosition = 0;
        } else {
            sliderPosition += 0.2;
        }
        audioSlider.noUiSlider.set(sliderPosition);
    }

    return {
        createABCplayer: createABCplayer,
        createABCsliders: createABCsliders,
        loadAudio: loadAudio,
        playPauseABC: playPauseABC,
        getABCheaderValue: getABCheaderValue,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = abcPlayer;
}