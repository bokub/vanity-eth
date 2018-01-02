/* eslint-env browser */
/* global vanity:false, Vue:false */

// eslint-disable-next-line no-new
new Vue({
	el: '#app',
	data: {
		count: 0,
		lastTick: null,
		firstTick: null,
		running: false,
		step: 250,
		speed: '0 addr/s',
		status: 'Waiting',
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
			return !vanity.isValidHex(this.input.prefix);
		},
		difficulty() {
			return this.inputError ? 'N/A' : vanity.computeDifficulty(this.input.prefix, this.input.checksum);
		},
		probability() {
			return Math.round(10000 * vanity.computeProbability(this.difficulty, this.count)) / 100;
		}
	},
	methods: {
		incrementCounter(incr) {
			this.count += incr;
			const currentTick = performance.now();
			this.speed = incr > 0 ? Math.floor(1000 * incr / (currentTick - this.lastTick)) + ' addr/s' : '0 addr/s';
			this.lastTick = currentTick;
		},

		displayResult(result) {
			this.incrementCounter(result.attempts);
			this.result.address = result.address;
			this.result.privateKey = result.privKey;
			this.status = 'Address found';
			this.speed = Math.floor(1000 * this.count / (performance.now() - this.firstTick)) + ' addr/s';
		},

		clearResult() {
			this.result.address = '';
			this.result.privateKey = '';
		},

		generate() {
			const add = vanity.getVanityWallet(this.input.prefix, this.input.checksum, this.step);
			if (add !== null) {
				this.running = false;
				return this.displayResult(add);
			}

			this.incrementCounter(this.step);

			if (!this.running) {
				this.status = 'Stopped';
				return;
			}

            // Use setTimeout to let the browser render
			setTimeout(() => this.generate(), 0);
		},

		startGen() {
			this.firstTick = performance.now();
			this.incrementCounter(-this.count);
			this.clearResult();
			this.running = true;

			setTimeout(() => this.generate(), 0);
		},

		stopGen() {
			this.running = false;
		}
	}
});
