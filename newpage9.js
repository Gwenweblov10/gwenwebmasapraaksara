const galleryWrapper = document.querySelector("#gallery-wrapper");
const gallery = galleryWrapper.querySelector("#gallery-images");
const images = gallery.querySelectorAll("img");
const dotsContainer = galleryWrapper.querySelector("#dots");
const galleryNav = galleryWrapper.querySelector("nav");
const galleryButtons = galleryNav.querySelectorAll("button");
const animation = document.getElementById("animation");

let currentIndex = 0;
const FADE_DURATION = 2000; // this needs to be the same as in the CSS. I should update this to get it dynamically (to do)

galleryButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		const direction = btn.getAttribute("nav-btn");
		let newIndex;
		if (direction === "prev") {
			newIndex = (currentIndex - 1 + images.length) % images.length;
		} else {
			newIndex = (currentIndex + 1 + images.length) % images.length;
		}
		changeImage(newIndex);
	});
});

// toggle gallery buttons disabled state (true or false)
function toggleGalleryButtons(state) {
	galleryNav
		.querySelectorAll("button")
		.forEach((btn) => (btn.disabled = state ? true : false));
}

function changeImage(newIndex) {
	//if (isTransitioning) return;
	toggleGalleryButtons(true);

	//console.log(newIndex, images.length)
	const currentImg = images[currentIndex];

	if (newIndex >= 0 && newIndex < images.length) {
		// fade out current image
		currentImg.classList.remove("current");

		const nextImage = images[newIndex];

		// add filter and fade in
		nextImage.classList.add("current");

		// set new current index
		currentIndex = newIndex;

		// Start ripple animation
		animation.beginElement();

		// after image swap has finished, stop animation, enable buttons & update current iamge dot indicator
		setTimeout(() => {
			animation.endElement();
			toggleGalleryButtons(false);
			setActiveDot(newIndex);
		}, FADE_DURATION);
		duration;
	}
}

// update dot buttons
function setActiveDot(newIndex) {
	dotsContainer.querySelectorAll("button").forEach((btn, idx) => {
		if (idx == newIndex) btn.classList.add("current");
		else btn.classList.remove("current");
	});
}

// Function to create buttons for each image
function createDotButtons() {
	images.forEach((image, index) => {
		const button = document.createElement("button");
		// Set the button's text content to the index + 1
		button.setAttribute("aria-label", `Image ${index + 1}`);
		if (index == 0) button.classList.add("current");

		button.addEventListener("click", () => {
			dotsContainer.querySelectorAll("button").forEach((btn) => {
				btn.disabled = false;
				btn.classList.remove("current");
			});
			button.disabled = true;
			button.classList.add("current");
			changeImage(index);
		});
		dotsContainer.appendChild(button);
	});
}

// create dot buttons
createDotButtons();

// set initial image
//images[currentIndex].style.opacity = 1;