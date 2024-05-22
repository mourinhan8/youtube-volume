// import { update_display } from "./popup/popup.js";
import { handleSliderMove, isChromeUrl } from "./popup/popup.js";

async function initPopup() {
	// update_display(100);
	const slider = document.getElementById("volSlider");
	if (slider && isChromeUrl == true) {
		slider.addEventListener("input", handleSliderMove);
	}
}

document.addEventListener("DOMContentLoaded", initPopup);
