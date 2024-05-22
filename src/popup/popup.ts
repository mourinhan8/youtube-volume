export let isChromeUrl: boolean; // global state whether the current tab is a chrome:// URL

// Updates the numbers and slider according to the retrieved value
export function update_display(volume_value: number): void {
	const display_number = document.getElementById("volDisplay");		// maybe use spanId instead?

	if (display_number != null) {
		if (volume_value == 0 || volume_value == null)
			display_number.innerHTML = "MUTED";
		else
			display_number.innerHTML = "VOLUME: " + volume_value;
	}

	const display_slider = document.getElementById("volSlider");
	if (display_slider && display_slider instanceof HTMLInputElement) {
		display_slider.value = volume_value.toString();
	}
}

export async function handleSliderMove(this: HTMLInputElement) {
	const newVolume = Number(this.value); // gets input from slider 
	update_display(newVolume);
	return (null);
}
