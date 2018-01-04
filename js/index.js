/* eslint-env browser */
/* global Vue:false */

/**
 * Check if a string is valid hexadecimal
 * @param hex
 * @returns {boolean}
 */
const isValidHex = hex => hex.length ? /^[0-9A-F]+$/g.test(hex.toUpperCase()) : true;

const computeDifficulty = (pattern, isChecksum) => {
	const ret = Math.pow(16, pattern.length);
	return isChecksum ? (ret * Math.pow(2, pattern.replace(/[^a-f]/gi, '').length)) : ret;
};

const computeProbability = (difficulty, attempts) => {
	return 1 - Math.pow((difficulty - 1) / difficulty, attempts);
};

// eslint-disable-next-line no-new
new Vue({
	el: '#app',
	data: {
		count: 0,
		firstTick: null,
		running: false,
		step: 500,
		speed: '0 addr/s',
		status: 'Waiting',
		workers: [],
		threads: 4,
		result: {
			address: '',
			privateKey: ''
		},
		input: {
			prefix: '',
			checksum: true
		}
	},

	computed: {
		inputError() {
			return !isValidHex(this.input.prefix);
		},
		difficulty() {
			return this.inputError ? 'N/A' : computeDifficulty(this.input.prefix, this.input.checksum);
		},
		probability() {
			return Math.round(10000 * computeProbability(this.difficulty, this.count)) / 100;
		}
	},
	watch: {
		threads() {
			if (!this.running) {
				this.initWorkers();
			}
		}
	},
	methods: {
		incrementCounter(incr) {
			this.count += incr;
			this.speed = incr > 0 ? Math.floor(1000 * this.count / (performance.now() - this.firstTick)) + ' addr/s' : '0 addr/s';
		},

		displayResult(result) {
			this.incrementCounter(result.attempts);
			this.result.address = result.address;
			this.result.privateKey = result.privKey;
			this.status = 'Address found';
		},

		clearResult() {
			this.result.address = '';
			this.result.privateKey = '';
		},

        /**
		 * Create missing workers, remove the unwanted ones.
         */
		initWorkers() {
			const self = this;
			if (this.workers.length === this.threads) {
				return;
			}

			// Remove unwanted workers
			if (this.workers.length > this.threads) {
				for (let w = this.threads - 1; w < this.workers.length; w++) {
					this.workers[w].terminate();
				}
				this.workers = this.workers.slice(0, this.threads);
				return;
			}

			// Create workers
			for (let w = this.workers.length; w < this.threads; w++) {
				this.workers[w] = new Worker('js/bundle.js');
				this.workers[w].onmessage = function (event) {
					self.parseWorkerMessage(event.data, w);
				};
			}
		},

		parseWorkerMessage(add, w) {
			if (add !== null) {
				this.stopGen();
				return this.displayResult(add);
			}

			this.incrementCounter(this.step);

			this.workers[w].postMessage({input: this.input, step: this.step});
		},

		startGen() {
			if (!window.Worker) {
				console.error('Web workers are not supported');
				return;
			}

			this.incrementCounter(-this.count);
			this.clearResult();
			this.running = true;

			for (let w = 0; w < this.workers.length; w++) {
				this.workers[w].postMessage({input: this.input, step: this.step});
			}

			this.status = 'Running';
			this.firstTick = performance.now();
		},

		stopGen() {
			this.running = false;
			this.status = 'Stopped';
			for (let i = 0; i < this.workers.length; i++) {
				this.workers[i].terminate();
			}
			this.workers = [];
			this.initWorkers();
		}
	},

	created() {
		this.initWorkers();
	}
});
