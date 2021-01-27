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

    function loadABCAudio(textAreaABC, tuneID) {
        let showPlayer = document.getElementById('showPlayer');

        console.log("loading...");

        let visualObj = ABCJS.renderAbc("*", textAreaABC.value)[0];
        let synth = new ABCJS.synth.CreateSynth();

        synth.init({
            visualObj: visualObj,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            debugCallback: function (message) {
                console.log("synth: " + message)
            },
        }).then(function (response) {
            //console.log(response);
            synth.prime().then(function (response) {
                showPlayer.innerHTML = audioPlayer.createMP3player(tuneID, synth.download());
                audioPlayer.createMP3Sliders(tuneID);
            });
        }).catch(function (error) {
            console.warn("Audio problem:", error);
        });
    }

    function isABCfile(tuneABC) {
        if ((getABCheaderValue("X:", tuneABC) == '') ||
            (getABCheaderValue("T:", tuneABC) == '') ||
            (getABCheaderValue("K:", tuneABC) == '')) {
            return (false);
        } else {
            return (true);
        }
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

    return {
        loadABCAudio: loadABCAudio,
        isABCfile: isABCfile,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = abcPlayer;
}