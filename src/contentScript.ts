(function () {
	const video = document.querySelector('.html5-main-video') as HTMLVideoElement;
	const audioContext = new (window.AudioContext)();
	const analyser = audioContext.createAnalyser();
	const source = audioContext.createMediaElementSource(video);
	source.connect(analyser);
	analyser.connect(audioContext.destination);

	analyser.fftSize = 256;
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	function getAverageVolume(array: Uint8Array) {
		let values = 0;
		let average;
		for (let i = 0; i < array.length; i++) {
			values += array[i];
		}
		average = values / array.length;
		return average;
	}

	chrome.runtime.onMessage.addListener((request) => {
		if (request.action === "adjustVolume") {
			const targetVolume = request.volume;
      function checkVolume() {
        analyser.getByteFrequencyData(dataArray);
        const averageVolume = getAverageVolume(dataArray);
        console.log('Average Volume:', averageVolume);
    
        if (averageVolume > targetVolume) {
          video.volume = Math.max(video.volume - 0.01, 0);
        } else if (averageVolume < targetVolume) {
          video.volume = Math.min(video.volume + 0.01, 1);
        }
    
        requestAnimationFrame(checkVolume);
      }

      if (video.paused) {
        video.addEventListener('play', () => {
          audioContext.resume().then(() => {
            checkVolume();
          });
        }, { once: true });
      } else {
        audioContext.resume().then(() => {
          checkVolume();
        });
      }
		}
	});

})();