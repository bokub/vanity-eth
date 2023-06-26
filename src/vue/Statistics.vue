<template>
    <div class="panel">
        <div>Difficulty: <span class="output" v-text="formatNum(difficulty)">1</span></div>
        <div>
            Generated:
            <span class="output" v-text="formatNum(count) + (count === 1 ? ' address' : ' addresses')"
                >0 addresses</span
            >
        </div>
        <div>50% probability: <span class="output" v-text="speed ? time50 : adresses50">0 addresses</span></div>
        <div>Speed: <span class="output" v-text="speed + ' addr/s'">0 addr/s</span></div>
        <div>Status: <span class="output" v-text="status">Waiting</span></div>

        <!--Probability-->
        <div class="probability">
            <div class="probability-bar" :style="'width:' + probability + '%'"></div>
        </div>
        <div class="percentage">
            <h4 v-text="probability + '%'">0%</h4>
            <div>Probability</div>
        </div>
    </div>
</template>

<script>
    import humanizeDuration from 'humanize-duration';

    const computeDifficulty = function (prefix, suffix, isChecksum) {
        const pattern = prefix + suffix;
        const ret = Math.pow(16, pattern.length);
        return isChecksum ? ret * Math.pow(2, pattern.replace(/[^a-f]/gi, '').length) : ret;
    };

    const computeProbability = function (difficulty, attempts) {
        return 1 - Math.pow(1 - 1 / difficulty, attempts);
    };

    const isValidHex = function (hex) {
        return hex.length ? /^[0-9A-F]+$/g.test(hex.toUpperCase()) : true;
    };

    export default {
        data: function () {
            return {
                speed: 0,
                count: 0,
            };
        },
        props: {
            prefix: String,
            suffix: String,
            checksum: Boolean,
            status: String,
            firstTick: {},
        },
        watch: {
            prefix() {
                this.count = 0;
            },
            suffix() {
                this.count = 0;
            },
            checksum() {
                this.count = 0;
            },
        },
        computed: {
            inputError: function () {
                return !isValidHex(this.prefix) || !isValidHex(this.suffix);
            },
            difficulty: function () {
                return this.inputError ? 'N/A' : computeDifficulty(this.prefix, this.suffix, this.checksum);
            },
            probability50() {
                return this.inputError ? 0 : Math.floor(Math.log(0.5) / Math.log(1 - 1 / this.difficulty));
            },
            adresses50: function () {
                if (this.probability50 === -Infinity) {
                    return 'Nearly impossible';
                }
                return this.inputError ? 'N/A' : this.formatNum(this.probability50) + ' addresses';
            },
            time50: function () {
                const seconds = this.probability50 / this.speed;
                if (seconds > 200 * 365.25 * 24 * 3600 || seconds === -Infinity) {
                    return 'Thousands of years';
                }
                return this.inputError ? 'N/A' : humanizeDuration(Math.round(seconds) * 1000, { largest: 2 });
            },
            probability: function () {
                return Math.round(10000 * computeProbability(this.difficulty, this.count)) / 100;
            },
        },
        methods: {
            formatNum: function (num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            },
        },
        created: function () {
            this.$parent.$on('increment-counter', (incr) => {
                this.count += incr > 0 ? incr : -this.count;
                this.speed = incr > 0 ? Math.floor((1000 * this.count) / (performance.now() - this.firstTick)) : 0;
            });
        },
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel > div:not(:last-child)
        margin-bottom: 17px

    .panel
        min-height: 280px
        padding-bottom: 3.2em
        > div:not(.percentage)
            clear: both

    .probability
        width: 85%
        margin: 5px 0
        height: 18px
        background: $panel-background-alt
        float: left

    .probability-bar
        height: 100%
        width: 0
        display: block
        background-color: $primary

    .percentage
        float: right
        width: 15%
        text-align: center
        position: relative
        top: -10px
        left: 15px
        div
            font-size: 12px
        h5
            color: $text
            font-weight: 500

    .output
        font-family: $monospace-font
        color: $text-alt
        margin-left: 15px
        word-break: break-all

    @media screen and (max-width: 480px)
        .percentage
            left: -5px
        .probability
            width: 80%
</style>
