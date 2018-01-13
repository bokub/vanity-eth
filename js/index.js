/* eslint-env browser */
/* global Vue:false */

/**
 * Check if a string is valid hexadecimal
 * @param hex
 * @returns {boolean}
 */
const isValidHex = function (hex) {
	return hex.length ? /^[0-9A-F]+$/g.test(hex.toUpperCase()) : true;
};

const computeDifficulty = function (pattern, isChecksum) {
	const ret = Math.pow(16, pattern.length);
	return isChecksum ? (ret * Math.pow(2, pattern.replace(/[^a-f]/gi, '').length)) : ret;
};

const computeProbability = function (difficulty, attempts) {
	return 1 - Math.pow(1 - (1 / difficulty), attempts);
};

new Vue({
	el: '#app',
	data: {
		count: 0,
		firstTick: null,
		running: false,
		speed: 0,
		status: 'Waiting',
		workers: [],
		threads: 4,
		cores: 0,
		result: {
			address: '',
			privateKey: ''
		},
		input: {
			prefix: '',
			checksum: true
		},
		error: false
	},

	computed: {
		inputError: function () {
			return !isValidHex(this.input.prefix);
		},
		difficulty: function () {
			return this.inputError ? 'N/A' : computeDifficulty(this.input.prefix, this.input.checksum);
		},
		probability50: function () {
			return this.inputError ? 'N/A' : Math.floor(Math.log(0.5) / Math.log(1 - (1 / this.difficulty))) + ' addresses';
		},
		probability: function () {
			return Math.round(10000 * computeProbability(this.difficulty, this.count)) / 100;
		}
	},
	watch: {
		threads: function () {
			if (!this.running) {
				this.initWorkers();
			}
		}
	},
	methods: {
		incrementCounter: function (incr) {
			this.count += incr;
			this.speed = incr > 0 ? Math.floor(1000 * this.count / (performance.now() - this.firstTick)) : 0;
		},

		displayResult: function (result) {
			this.incrementCounter(result.attempts);
			this.result.address = result.address;
			this.result.privateKey = result.privKey;
			this.status = 'Address found';
		},

		clearResult: function () {
			this.result.address = '';
			this.result.privateKey = '';
			this.incrementCounter(-this.count);
		},

        /**
         * Create missing workers, remove the unwanted ones.
         */
		initWorkers: function () {
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
				try {
					this.workers[w] = new Worker('js/bundle.js');
					this.workers[w].onmessage = function (event) {
						self.parseWorkerMessage(event.data, w);
					};
				} catch (err) {
					this.error = 'local_workers_forbidden';
					break;
				}
			}
		},

		parseWorkerMessage: function (wallet, w) {
			if (wallet.error) {
				this.stopGen();
				this.error = wallet.error;
				this.status = 'Error';
				return;
			}

			if (wallet.address) {
				this.stopGen();
				return this.displayResult(wallet);
			}

			this.incrementCounter(wallet.attempts);

			this.workers[w].postMessage(this.input);
		},

		startGen: function () {
			if (!window.Worker) {
				this.error = 'workers_unsupported';
				return;
			}

			this.clearResult();
			this.running = true;

			for (let w = 0; w < this.workers.length; w++) {
				this.workers[w].postMessage(this.input);
			}

			this.status = 'Running';
			this.firstTick = performance.now();
		},

		stopGen: function () {
			this.running = false;
			this.status = 'Stopped';
			for (let i = 0; i < this.workers.length; i++) {
				this.workers[i].terminate();
			}
			this.workers = [];
			this.initWorkers();
		},

		countCores: function () {
            // Estimate number of cores on machine
			let cores = 0;
			try {
				cores = parseInt(navigator.hardwareConcurrency, 10);
			} catch (err) {
				console.error(err);
			}

			if (cores) {
				this.cores = cores;
				this.threads = this.cores;
			}
		}
	},

	created: function () {
		this.countCores();
		this.initWorkers();
	}
});
