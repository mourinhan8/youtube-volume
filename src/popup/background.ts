let slider = document.getElementById("volSlider") as HTMLInputElement; // id for slider
let volume = document.getElementById("volumeValue") as HTMLElement;     // number_displayed

// Set the default slider value
//volume.innerHTML = "100";


slider.addEventListener("input", function ()
{
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
	if (tabs[0] && tabs[0].url && (tabs[0].url.startsWith("chrome://") || tabs[0].url.startsWith("https://chromewebstore.google.com/")))
		return ;
	volume.innerHTML = this.value;
	const finalValue = Number(this.value) / 100;
	
    const myTabId = tabs[0].id;

    if (myTabId !== undefined) {
      chrome.scripting.executeScript({
          target: { tabId: myTabId },
          func: changeVolume,
          args: [finalValue],
        },
      );
    }
  });

	const videoElement = document.querySelector('.html5-main-video') as HTMLVideoElement;
	const audioContext = new (window.AudioContext)();
	const analyser = audioContext.createAnalyser();
	const source = audioContext.createMediaElementSource(videoElement);
	source.connect(analyser);
	analyser.connect(audioContext.destination);
	analyser.fftSize = 256;
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	function changeVolume(volume: number)
	{

		if (videoElement != null)
		{
			if(videoElement.muted == true)
			{
				videoElement.muted = false;

				const volumeClass = document.querySelector(".ytp-volume-panel") as HTMLElement;
				let vol_text = volumeClass?.getAttribute("aria-valuetext");
				if(vol_text?.includes("muted") == true)
				{
					vol_text = vol_text.replace("muted", "");
					volumeClass?.setAttribute("aria-valuetext", vol_text);
					
					toggleYouTubeMute(); 	// Calls the function to simulate a click on the YouTube mute button
				}
			}
			analyser.getByteFrequencyData(dataArray);
      const averageVolume = getAverageVolume(dataArray);
      // Check the threshold
      if (averageVolume > volume) {
        videoElement.volume = Math.max(videoElement.volume - 0.1, 0); // down volume
      } else if (averageVolume < volume) { // Giá trị ngưỡng ví dụ
        videoElement.volume = Math.min(videoElement.volume + 0.1, 1); // up volume
      }
			requestAnimationFrame(changeVolume);
		}
		
		// Function to simulate a click on the YouTube mute button
	}

	function getAverageVolume (array: Uint8Array) {
		let values = 0;
		let average;

		for (let i = 0; i < array.length; i++) {
			values += array[i];
		}

		average = values / array.length;
		return average;
	}

	function toggleYouTubeMute() {
		// The selector for the mute button; this might change and needs to be verified
		const muteButtonSelector = '.ytp-mute-button';

		// Select the mute button element
		const muteButton = document.querySelector(muteButtonSelector);

		// Check if the mute button element is found
		if (muteButton)
		{
			// Create a new click event
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			});

			// Dispatch the event to the mute button
			muteButton.dispatchEvent(clickEvent);
		}
		else
		{
			//console.log('Mute button not found');
		}
	}
});



