<template>
    <div id="app" class="remodal-bg render">
        <div class="container" id="content">
            <!--Headline-->
            <headline></headline>

            <!--Description-->
            <div class="row">
                <div class="col-md-12">
                    <description></description>
                </div>
            </div>

            <!--Error-->
            <div v-if="error" class="row">
                <div class="col-md-12">
                    <err :error="error"></err>
                </div>
            </div>

            <div class="row">
                <!--User input-->
                <div class="col-md-6">
                    <userInput
                        :running="running"
                        :cores="cores"
                        @start="startGen"
                        @stop="stopGen"
                        @input-change="setInput"
                    ></userInput>
                </div>

                <!--Statistics-->
                <div class="col-md-6">
                    <statistics
                        :prefix="input.prefix"
                        :suffix="input.suffix"
                        :checksum="input.checksum"
                        :status="status"
                        :first-tick="firstTick"
                    ></statistics>
                </div>
            </div>

            <!--Result-->
            <div class="row">
                <div class="col-md-12">
                    <result :address="result.address" :private-key="result.privateKey"></result>
                </div>
            </div>
        </div>

        <!--Save modal-->
        <save :address="result.address.toLowerCase()" :private-key="result.privateKey"></save>

        <!--Footer-->
        <foot></foot>

        <!--Github corner-->
        <corner></corner>
    </div>
</template>

<script>
    import Worker from './js/vanity.js';

    import Headline from './vue/Headline';
    import Description from './vue/Description';
    import Err from './vue/Error';
    import UserInput from './vue/Input';
    import Statistics from './vue/Statistics';
    import Result from './vue/Result';
    import Save from './vue/Save.vue';
    import Corner from './vue/Corner';
    import Foot from './vue/Footer';

    export default {
        components: { Headline, Description, Err, UserInput, Statistics, Result, Save, Corner, Foot },
        data: function () {
            return {
                running: false,
                status: 'Waiting',
                workers: [],
                threads: 4,
                cores: 0,
                result: { address: '', privateKey: '' },
                input: { prefix: '', suffix: '', checksum: true },
                firstTick: null,
                error: null,
            };
        },
        watch: {
            threads: function () {
                if (!this.running) {
                    this.initWorkers();
                }
            },
        },
        methods: {
            setInput: function (inputType, value) {
                // eslint-disable-next-line default-case
                switch (inputType) {
                    case 'prefix':
                        this.input.prefix = value;
                        break;
                    case 'suffix':
                        this.input.suffix = value;
                        break;
                    case 'checksum':
                        this.input.checksum = value;
                        break;
                    case 'threads':
                        this.threads = value;
                }
            },

            displayResult: function (result) {
                this.$emit('increment-counter', result.attempts);
                this.result.address = result.address;
                this.result.privateKey = result.privKey;
                this.status = 'Address found';
            },

            clearResult: function () {
                this.result.address = '';
                this.result.privateKey = '';
                this.$emit('increment-counter', -1);
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
                    for (let w = this.threads; w < this.workers.length; w++) {
                        this.workers[w].terminate();
                    }
                    this.workers = this.workers.slice(0, this.threads);
                    return;
                }

                // Create workers
                for (let w = this.workers.length; w < this.threads; w++) {
                    try {
                        this.workers[w] = new Worker();
                        this.workers[w].onmessage = (event) => self.parseWorkerMessage(event.data);
                    } catch (err) {
                        this.error = err;
                        this.status = 'Error';
                        console.error(this.error);
                        break;
                    }
                }
            },

            parseWorkerMessage: function (wallet) {
                if (wallet.error) {
                    this.stopGen();
                    this.error = wallet.error;
                    this.status = 'Error';
                    console.error(this.error);
                    return;
                }

                if (wallet.address) {
                    this.stopGen();
                    return this.displayResult(wallet);
                }
                this.$emit('increment-counter', wallet.attempts);
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
            },
            checkLocation() {
                try {
                    this.error = window.self !== window.top ? 'insecure_location' : this.error;
                } catch (e) {
                    this.error = 'insecure_location';
                }
                const hostname = window.location.hostname;
                if (hostname && ['localhost', '127.0.0.1', 'vanity-eth.tk'].indexOf(hostname) === -1) {
                    this.error = 'insecure_location';
                }
            },
            benchmark(max) {
                max = max || 10000;
                const step = 500;
                const worker = new Worker();
                let attempts = 0;
                const times = [];
                const durations = [];
                const timeTaken = (a, d) => Math.round((1000 * a) / d);
                worker.onmessage = () => {
                    times.push(performance.now());
                    if (times.length === 1) {
                        return;
                    }
                    durations.push(times[times.length - 1] - times[times.length - 2]);
                    attempts += step;
                    console.info(
                        attempts + '/' + max + '...' + timeTaken(step, durations[durations.length - 1]) + ' addr/s'
                    );
                    if (attempts >= max) {
                        console.info(
                            '\nSpeed range: ' +
                                timeTaken(step, Math.max(...durations)) +
                                ' - ' +
                                timeTaken(step, Math.min(...durations)) +
                                ' addr/s'
                        );
                        console.info('Average: ' + timeTaken(attempts, times[times.length - 1] - times[0]) + ' addr/s');
                        worker.terminate();
                    }
                };
                const input = { checksum: true, prefix: 'f'.repeat(5), suffix: '' };
                console.info('Starting benchmark with 1 core...');
                worker.postMessage(input);
            },
        },

        created: function () {
            this.checkLocation();
            this.countCores();
            this.initWorkers();
            window['benchmark'] = this.benchmark;
        },
    };
</script>

<style lang="sass">
    // Bootstrap - Required
    @import "~bootstrap/scss/functions"
    @import "~bootstrap/scss/variables"
    @import "~bootstrap/scss/mixins"

    // Bootstrap - Optional
    @import "~bootstrap/scss/reboot"
    @import "~bootstrap/scss/grid"

    @import "css/variables"
    @import "css/fonts"

    body
        padding: 0
        font-family: 'Lato', sans-serif
        background: $bg-fallback
        background: linear-gradient(140deg, $bg-2 0%, $bg-1 100%)
        background-attachment: fixed
        font-size: 16px

    h1, h2, h3, h4, h5, h6, p, label
        margin: 0
        font-weight: normal

    a, a:visited, a:hover
        color: $text-alt
        text-decoration: underline

    a:hover
        color: $text

    .panel
        padding: 1.5em 3em
        background-color: $panel-background
        margin-top: 2em
        color: $text
        font-weight: 400
        box-shadow: $shadow
        transition: box-shadow 0.2s ease-in-out
        &:hover
            box-shadow: $shadow-big

    #content
        margin-top: 8em
        margin-bottom: 6em

    .text-input-large
        width: 100%
        color: $text
        background: $panel-background-alt
        outline: none
        font-size: 1.3em
        padding: 0.5em
        border: none
        margin-bottom: 10px
        -webkit-appearance: none
        &::placeholder
            color: $placeholder

    .button-large
        border: none
        outline: none
        color: $text-opposite
        padding: 8px
        font-size: 19px
        font-weight: 500
        margin: 1.3em 0 0 0
        cursor: pointer
        -webkit-appearance: none
        background: $primary
        width: 100%
        &:hover
            background: $secondary
        &:disabled
            background: $disabled
            cursor: auto

    /*-- Pre-render-specific --

    #app.render .hide-render
        display: none

    #app.prerender .hide-prerender
        display: none

    /*-- Responsive design --

    @media screen and (max-width: 1024px)
        #content
            margin-top: 7em
            margin-bottom: 5em

    @media screen and (max-width: 640px)
        #content
            margin-top: 5em
            margin-bottom: 4em

    @media screen and (max-width: 480px)
        .panel
            padding: 1em
</style>
