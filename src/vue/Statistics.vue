<template>
    <div class="panel">
        <div>Difficulty: <span class="output" v-text="formatNum(difficulty)">1</span></div>
        <div>Generated: <span class="output"
                              v-text="formatNum(count) + (count === 1 ? ' address' : ' addresses')">0 addresses</span>
        </div>
        <div>50% probability: <span class="output" v-text="probability50">0 addresses</span></div>
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
    export default {
        data: function () {
            return {
                speed: 0,
                count: 0,
            }
        },
        props: {
            prefix: String,
            checksum: Boolean,
            status: String,
            firstTick: {},
        },
        computed: {
            difficulty: function () {
                return this.inputError ? 'N/A' : computeDifficulty(this.prefix, this.checksum);
            },
            probability50: function () {
                return this.inputError ? 'N/A' : this.formatNum(Math.floor(Math.log(0.5) / Math.log(1 - (1 / this.difficulty)))) + ' addresses';
            },
            probability: function () {
                return Math.round(10000 * computeProbability(this.difficulty, this.count)) / 100;
            }
        },
        methods: {
            formatNum: function (num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }
        },
        created: function () {
            this.$parent.$on('increment-counter', incr => {
                this.count += (incr > 0 ? incr : -this.count);
                this.speed = incr > 0 ? Math.floor(1000 * this.count / (performance.now() - this.firstTick)) : 0;
            });
        }
    }

    const computeDifficulty = function (pattern, isChecksum) {
        const ret = Math.pow(16, pattern.length);
        return isChecksum ? (ret * Math.pow(2, pattern.replace(/[^a-f]/gi, '').length)) : ret;
    };

    const computeProbability = function (difficulty, attempts) {
        return 1 - Math.pow(1 - (1 / difficulty), attempts);
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel > div:not(:last-child)
        margin-bottom: 15px

    .panel
        padding-bottom: 3.2em
        > div:not(.percentage)
            clear: both

    .probability
        width: 85%
        margin: 5px 0
        height: 18px
        background: $panel-background-clear
        float: left

    .probability-bar
        height: 100%
        width: 0
        display: block
        background-color: #d78716

    .percentage
        float: right
        width: 15%
        text-align: center
        position: relative
        top: -10px
        left: 15px
        div
            font-size: 0.75em
        h5
            color: $white-text
            font-weight: 500

    .output
        font-family: monospace
        font-size: 1.2em
        color: $grey-text
        margin-left: 15px
        word-break: break-all
</style>