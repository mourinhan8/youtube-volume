"use strict";
(function () {
    const video = document.querySelector('.html5-main-video');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(video);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const gainNode = audioContext.createGain();
    source.connect(gainNode).connect(audioContext.destination);
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "adjustVolume") {
            const targetVolume = request.volume / 100;
            function changeVolume() {
                gainNode.gain.value = targetVolume;
                requestAnimationFrame(changeVolume);
            }
            if (video.paused) {
                video.addEventListener('play', () => {
                    audioContext.resume().then(() => {
                        changeVolume();
                    });
                }, { once: true });
            }
            else {
                audioContext.resume().then(() => {
                    changeVolume();
                });
            }
        }
    });
})();
//# sourceMappingURL=contentScript.js.map