(function () {

	const video = document.querySelector('.html5-main-video') as HTMLVideoElement;
	const audioContext = new (window.AudioContext)();
	const analyser = audioContext.createAnalyser();
	const source = audioContext.createMediaElementSource(video);
	source.connect(analyser);
	analyser.connect(audioContext.destination);

	analyser.fftSize = 256;
	// const bufferLength = analyser.frequencyBinCount;
	// const dataArray = new Uint8Array(bufferLength);
	const gainNode = audioContext.createGain();
	source.connect(gainNode).connect(audioContext.destination);

  // function initAudioContext() {
  //   if (!audioContext) {
  //     audioContext = new (window.AudioContext)();
	// 		analyser = audioContext.createAnalyser()
	// 		analyser.fftSize = 256;
	// 		const bufferLength = analyser.frequencyBinCount;
	// 		dataArray = new Uint8Array(bufferLength);
  //     video = document.querySelector('.html5-main-video') as HTMLVideoElement;
	// 		source = audioContext.createMediaElementSource(video);
	// 		source.connect(analyser);
  //     if (video) {
  //       sourceNode = audioContext.createMediaElementSource(video);
  //       gainNode = audioContext.createGain();
  //       sourceNode.connect(gainNode).connect(audioContext.destination);
  //     }
  //   }
  // }

	// function getAverageVolume(array: Uint8Array) {
	// 	let values = 0;
	// 	let average;
	// 	for (let i = 0; i < array.length; i++) {
	// 		values += array[i];
	// 	}
	// 	average = values / array.length;
	// 	return average;
	// }

	chrome.runtime.onMessage.addListener((request) => {
		if (request.action === "adjustVolume") {
			const targetVolume = request.volume / 100;
      function changeVolume() {
        // analyser.getByteFrequencyData(dataArray);
        // const averageVolume = getAverageVolume(dataArray);
        // console.log('Average Volume:', averageVolume);
    
        // if (averageVolume > targetVolume) {
				// 	gainNode.gain.value = 0.2;
        //   // video.volume = Math.max(video.volume - 0.01, 0);
        // } else if (averageVolume < targetVolume) {
				// 	gainNode.gain.value = 0.2;
        //   // video.volume = Math.min(video.volume + 0.01, 1);
        // }
				gainNode.gain.value = targetVolume;
    
        requestAnimationFrame(changeVolume);
      }

      if (video.paused) {
        video.addEventListener('play', () => {
          audioContext.resume().then(() => {
            changeVolume();
          });
        }, { once: true });
      } else {
        audioContext.resume().then(() => {
          changeVolume();
        });
      }
		}
	});

	// document.addEventListener('DOMContentLoaded', initAudioContext);
  // video.addEventListener('play', initAudioContext, true);
})();