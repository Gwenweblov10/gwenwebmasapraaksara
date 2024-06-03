document.addEventListener('DOMContentLoaded', function() {
	class Cell {
		DOM = {
			el: null
		};
		row;
		column;

		constructor(row, column) {
			this.DOM.el = document.createElement('div');
			gsap.set(this.DOM.el, {
				willChange: 'opacity, transform'
			});
			this.row = row;
			this.column = column;
		}
	}

	class Overlay {
		DOM = {
			el: null
		};
		cells = [];
		options = {
			rows: 10,
			columns: 10,
		};

		constructor(DOM_el, customOptions) {
			this.DOM.el = DOM_el;
			this.options = Object.assign({}, this.options, customOptions);
			this.DOM.el.style.setProperty('--columns', this.options.columns);
			this.cells = new Array(this.options.rows);
			for (let i = 0; i < this.options.rows; ++i) {
				this.cells[i] = new Array(this.options.columns);
			}
			for (let i = 0; i < this.options.rows; ++i) {
				for (let j = 0; j < this.options.columns; ++j) {
					const cell = new Cell(i, j);
					this.cells[i][j] = cell;
					this.DOM.el.appendChild(cell.DOM.el);
				}
			}
		}

		show(customConfig = {}) {
			return new Promise((resolve) => {
				const defaultConfig = {
					transformOrigin: '50% 50%',
					duration: 0.5,
					ease: 'none',
					stagger: {
						grid: [this.options.rows, this.options.columns],
						from: 0,
						each: 0.05,
						ease: 'none'
					}
				};
				const config = Object.assign({}, defaultConfig, customConfig);
				gsap.set(this.DOM.el, {
					opacity: 1
				});
				gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), {
					scale: 0,
					opacity: 0,
					transformOrigin: config.transformOrigin
				}, {
					duration: config.duration,
					ease: config.ease,
					scale: 1.01,
					opacity: 1,
					stagger: config.stagger,
					onComplete: resolve
				});
			});
		}

		hide(customConfig = {}) {
			return new Promise((resolve) => {
				const defaultConfig = {
					transformOrigin: '50% 50%',
					duration: 0.5,
					ease: 'none',
					stagger: {
						grid: [this.options.rows, this.options.columns],
						from: 0,
						each: 0.05,
						ease: 'none'
					}
				};
				const config = Object.assign({}, defaultConfig, customConfig);
				gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), {
					transformOrigin: config.transformOrigin
				}, {
					duration: config.duration,
					ease: config.ease,
					scale: 0,
					opacity: 0,
					stagger: config.stagger,
					onComplete: resolve
				});
			});
		}
	}

	const overlayEl = document.querySelector('.overlay');
	const intro = document.querySelector('.intro');
	const images = [...intro.querySelectorAll('.intro__image')];
	const contentElements = [...document.querySelectorAll('.content-wrap > .content')];
	const overlay = new Overlay(overlayEl, {
		rows: 8,
		columns: 14
	});

	let isAnimating = false;

	images.forEach((image, position) => {
		image.addEventListener('click', () => {
			if (isAnimating) return;
			isAnimating = true;

			gsap.to(intro, {
				duration: 0.8,
				ease: 'power3.inOut',
				yPercent: 15,
				opacity: 0
			});

			overlay.show({
					transformOrigin: '50% 0%',
					duration: 0.4,
					ease: 'power3.inOut',
					stagger: index => 0.03 * (overlay.cells.flat()[index].row + gsap.utils.random(0, 5))
				})
				.then(() => {
					intro.classList.add('intro--closed');
					contentElements[position].classList.add('content--open');
					overlay.hide({
						transformOrigin: '50% 100%',
						duration: 0.4,
						ease: 'power2',
						stagger: index => 0.03 * (overlay.cells.flat()[index].row + gsap.utils.random(0, 5))
					}).then(() => isAnimating = false);

					gsap.fromTo(contentElements[position].querySelector('.content__img'), {
						yPercent: -25,
						opacity: 0
					}, {
						duration: 0.8,
						ease: 'power3',
						yPercent: 0,
						opacity: 1
					});
				});
		});
	});

	contentElements.forEach((content, position) => {
		content.querySelector('.content__back').addEventListener('click', () => {
			if (isAnimating) return;
			isAnimating = true;

			gsap.to(content.querySelector('.content__img'), {
				duration: 0.8,
				ease: 'power3.inOut',
				yPercent: -15,
				opacity: 0
			});

			overlay.show({
					transformOrigin: '50% 100%',
					duration: 0.4,
					ease: 'power3.inOut',
					stagger: (index, _, array) => 0.03 * (overlay.cells.flat()[array.length - index - 1].row + gsap.utils.random(0, 5))
				})
				.then(() => {
					intro.classList.remove('intro--closed');
					content.classList.remove('content--open');
					overlay.hide({
						transformOrigin: '50% 0%',
						duration: 0.4,
						ease: 'power2',
						stagger: (index, _, array) => 0.03 * (overlay.cells.flat()[array.length - index - 1].row + gsap.utils.random(0, 5))
					}).then(() => isAnimating = false);

					gsap.to(intro, {
						duration: 0.8,
						ease: 'power3',
						yPercent: 0,
						opacity: 1
					});
				});
		});
	});
});