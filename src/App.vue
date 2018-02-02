<template>
    <div>
        <div class="container">
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
                    <error :error="error"></error>
                </div>
            </div>

            <div class="row">
                <!--User input-->
                <div class="col-md-6">
                    <userInput :running="running" :cores="cores"
                               @start="startGen" @stop="stopGen" @input-change="setInput"></userInput>
                </div>

                <!--Statistics-->
                <div class="col-md-6">
                    <statistics :prefix="input.prefix" :checksum="input.checksum" :status="status"
                                :first-tick="firstTick"></statistics>
                </div>
            </div>

            <!--Result-->
            <div class="row">
                <div class="col-md-12">
                    <result :address="result.address" :private-key="result.privateKey"></result>
                </div>
            </div>
        </div>

        <!--Github corner-->
        <corner></corner>
    </div>
</template>

<script>
    import Worker from './js/vanity.js';

    import Headline from './vue/Headline';
    import Description from './vue/Description';
    import Err from './vue/Error';
    import Input from './vue/Input';
    import Statistics from './vue/Statistics';
    import Result from './vue/Result';
    import Corner from './vue/Corner';

    export default {
        components: {
            headline: Headline,
            description: Description,
            error: Err,
            userInput: Input,
            statistics: Statistics,
            result: Result,
            corner: Corner,
        },
        data: function () {
            return {
                running: false,
                status: 'Waiting',
                workers: [],
                threads: 4,
                cores: 0,
                result: {address: '', privateKey: ''},
                input: {prefix: '', checksum: true},
                firstTick: null,
                error: null
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
            setInput: function (inputType, value) {
                switch (inputType) {
                    case 'prefix':
                        this.input.prefix = value;
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
                        this.workers[w].onmessage = event => self.parseWorkerMessage(event.data);
                    } catch (err) {
                        this.error = 'local_workers_forbidden';
                        break;
                    }
                }
            },

            parseWorkerMessage: function (wallet) {
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
        },

        created: function () {
            this.countCores();
            this.initWorkers();
        }
    }

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
    body
        padding: 0
        font-family: 'Lato', sans-serif
        background: $background
        margin: 8em 0

    h1, h2, h3, h4, h5, h6, p, label
        margin: 0
        font-weight: normal

    a, a:visited, a:hover
        color: $grey-text
        text-decoration: underline

    a:hover
        color: $white-text

    .panel
        padding: 1.5em 3em
        background-color: $panel-background
        margin-top: 2em
        color: $white-text
        font-weight: 400

    /*-- Fonts --*/

    @font-face
        font-family: 'Lato'
        font-style: normal
        font-weight: 400
        src: local('Lato Regular'), local('Lato-Regular'), url(./assets/fonts/lato-regular.woff2) format('woff2')
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215

    @font-face
        font-family: 'Montserrat'
        font-style: normal
        font-weight: 400
        src: local('Montserrat Regular'), local('Montserrat-Regular'), url(./assets/fonts/montserrat.woff2) format('woff2')
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215

    @font-face
        font-family: 'Montserrat'
        font-style: normal
        font-weight: 700
        src: local('Montserrat Bold'), local('Montserrat-Bold'), url(./assets/fonts/montserrat-bold.woff2) format('woff2')
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215

    /*-- Responsive design --

    @media screen and (max-width: 1024px)
        body
            margin: 7em 0 5em 0

    @media screen and (max-width: 640px)
        body
            margin: 5em 0 4em 0

</style>
