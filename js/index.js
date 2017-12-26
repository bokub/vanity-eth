/* eslint-env node, browser */

const vanity = require('./vanity');

let count = 0;
let stop = false;
let lastTick = null;
let difficulty = 0;
const step = 250;
const elements = {};
const ids = {
	counter: 'counter',
	speed: 'speed',
	probability: 'probability',
	probabilityBar: 'probability-bar',
	status: 'status',
	genBtn: 'gen',
	stopBtn: 'stop',
	form: 'form'
};

const parseInput = () => {
	const input = {
		prefix: document.getElementById('prefix').value,
		checksum: document.getElementById('checksum').checked
	};

	if (!vanity.isValidHex(input.prefix)) {
		elements.form.className = 'error';
		return;
	}

	elements.form.className = '';
	difficulty = vanity.computeDifficulty(input.prefix, input.checksum);
	document.getElementById('difficulty').innerText = difficulty.toString();
	return input;
};

const incrementCounter = incr => {
	count += incr;
	elements.counter.innerText = count.toString() + (count === 1 ? ' address' : ' addresses');

	const currentTick = performance.now();
	elements.speed.innerText = Math.floor(1000 * incr / (currentTick - lastTick)) + ' addr/s';
	lastTick = currentTick;
};

const updateStats = () => {
	const prob = Math.round(10000 * vanity.computeProbability(difficulty, count)) / 100;
	elements.probability.innerText = prob + '%';
	elements.probabilityBar.style.width = prob + '%';
};

const displayResult = result => {
	incrementCounter(result ? result.attempts : 0);
	updateStats();
	document.getElementById('address').innerText = result ? result.address : '';
	document.getElementById('private-key').innerText = result ? result.privKey : '';
	elements.status.innerText = result ? 'Address found' : 'Running';
};

const toggleButtons = genBtn => {
	const enabled = genBtn ? elements.genBtn : elements.stopBtn;
	const disabled = genBtn ? elements.stopBtn : elements.genBtn;
	enabled.removeAttribute('disabled');
	disabled.setAttribute('disabled', '');
};

const generate = input => {
	const add = vanity.getVanityWallet(input.prefix, input.checksum, step);
	if (add !== null) {
		toggleButtons(true);
		return displayResult(add);
	}

	incrementCounter(step);
	updateStats();

	if (stop) {
		elements.status.innerText = 'Stopped';
		return;
	}

    // Use setTimeout to let the browser render
	setTimeout(() => generate(input), 0);
};

for (const e in ids) { // eslint-disable-line guard-for-in
	elements[e] = document.getElementById(ids[e]);
}

// Add event listeners on buttons
elements.genBtn.addEventListener('click', () => {
	incrementCounter(-count);
	displayResult(null);
	stop = false;

	const input = parseInput();
	toggleButtons(false);

	setTimeout(() => generate(input), 0);
});

elements.stopBtn.addEventListener('click', () => {
	toggleButtons(true);
	stop = true;
});

elements.form.addEventListener('change', () => parseInput());
elements.form.addEventListener('keyup', () => parseInput());
