<template>
    <div class="panel">
        <form :class="{error: inputError}" @submit.prevent="startGen">
            <div class="error-text">Numbers and letters from A to F only</div>
            <input type="text" class="text-input-large" placeholder="Prefix" v-model="prefix" :disabled="running">
            <div class="example">
                E.g.&nbsp;<span v-text="example" class="monospace"></span>
            </div>
            <div class="check">
                <label class="checkbox">
                    <input type="checkbox" name="checkbox" checked="" v-model="checksum"
                           :disabled="running">
                    <i class="left"> </i>
                    Case-sensitive
                </label>
            </div>
            <div class="threads">
                <input type="button" class="square-btn button-large" value="-" @click="threads--"
                       :disabled="running || threads <= 1">
                <input type="button" class="square-btn arrow button-large" value="+" @click="threads++"
                       :disabled="running">
                <h4 v-text="threads"></h4>
                <span>threads</span>
                <span v-if="threads === cores">(recommended)</span>
            </div>
            <div class="row">
                <div class="col-lg-6 col-sm-12">
                    <input type="button" value="Generate" class="button-large" @click="startGen"
                           :disabled="running || inputError || error">
                </div>
                <div class="col-lg-6 col-sm-12">
                    <input type="button" value="Stop" class="button-large" @click="stopGen" :disabled="!running">
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    const isValidHex = function (hex) {
        return hex.length ? /^[0-9A-F]+$/g.test(hex.toUpperCase()) : true;
    };

    function mixCase(str) {
        let ret = '';
        for (let i of str) {
            ret += Math.random() < 0.5 ? i.toUpperCase() : i.toLowerCase();
        }
        return ret;
    }
    export default {
        props: {
            running: Boolean,
            cores: Number
        },
        data: function () {
            return {
                threads: 4,
                prefix: '',
                checksum: true,
                error: false
            };
        },
        computed: {
            inputError: function () {
                return !isValidHex(this.prefix);
            },
            example: function () {
                if (this.inputError) {
                    return 'N/A';
                }
                let text = '0x' + (this.checksum ? this.prefix : mixCase(this.prefix));
                for (let i = 0; i < 40 - this.prefix.length; i++) {
                    text += mixCase(Math.floor((Math.random() * 16)).toString(16));
                }
                return text.substr(0, 42);
            }
        },
        methods: {
            startGen: function () {
                if (!this.running && !this.inputError && !this.error) {
                    this.$emit('start');
                }
            },
            stopGen: function () {
                this.$emit('stop');
            }
        },
        watch: {
            prefix: function () {
                this.$emit('input-change', 'prefix', this.prefix);
            },
            checksum: function () {
                this.$emit('input-change', 'checksum', this.checksum);
            },
            threads: function () {
                this.$emit('input-change', 'threads', this.threads);
            }
        }
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel
        min-height: 280px

    .error-text
        display: none
        font-size: 14px
        color: $error

    .error
        input[type="text"]
            border: 1px solid $error
        .error-text
            display: block

    .example
        font-size: 14px
        text-overflow: ellipsis
        overflow-x: hidden
        .monospace
            font-family: $monospace-font
    .check
        margin: 12px 0

    .checkbox
        margin-bottom: 4px
        padding-left: 30px
        line-height: 27px
        cursor: pointer
        position: relative
        font-size: 18px
        color: $text
        font-weight: 400
        &:last-child
            margin-bottom: 0
        i
            position: absolute
            bottom: 4px
            left: 17.5em
            display: block
            width: 19px
            height: 19px
            outline: none
            border: 1px solid $border-grey
            &.left
                position: absolute
                bottom: 4px
                left: 0
                display: block
                width: 19px
                height: 19px
                outline: none
                border: 1px solid $border-grey
        input
            + i:after
                content: ''
                background: url("../assets/images/tick-mark.png") no-repeat
                top: 4px
                left: 3px
                width: 15px
                height: 15px
                position: absolute
                opacity: 0
            position: absolute
            left: -9999px
            &:checked + i:after
                opacity: 1

    .threads
        font-size: 18px
        h4
            display: inline
        input[type=button].square-btn
            display: inline-block
            width: 24px
            height: 24px
            margin: 0 5px 2px 0
            padding: 0
            line-height: 1em

</style>
