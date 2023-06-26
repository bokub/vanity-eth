<template>
    <div class="panel" id="input-panel">
        <form @submit.prevent="startGen">
            <div class="error-text" v-if="inputError">Numbers and letters from A to F only</div>

            <div class="row">
                <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                    <input
                        :class="{ error: prefixError }"
                        type="text"
                        class="text-input-large"
                        id="input"
                        placeholder="Prefix"
                        v-model="prefix"
                        :disabled="running"
                    />
                </div>
                <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                    <input
                        :class="{ error: suffixError }"
                        type="text"
                        class="text-input-large"
                        id="input"
                        placeholder="Suffix"
                        v-model="suffix"
                        :disabled="running"
                    />
                </div>
            </div>
            <div class="row justify-content-center hide-render">
                <div class="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="example hide-prerender">
                E.g.&nbsp;
                <span v-if="inputError" class="monospace">N/A</span>
                <span v-else class="monospace">
                    0x<!--
                    --><b v-if="example.prefix" v-text="example.prefix"></b
                    ><!--
                    --><span v-text="example.random"></span
                    ><!--
                    --><b v-if="example.suffix" v-text="example.suffix"></b>
                </span>
            </div>
            <div class="controls hide-prerender">
                <label class="checkbox">
                    <input type="checkbox" name="checkbox" checked="" v-model="checksum" :disabled="running" />
                    <i class="left"> </i>
                    Case-sensitive
                </label>
            </div>
            <div class="threads hide-prerender">
                <input
                    type="button"
                    class="square-btn button-large"
                    value="-"
                    @click="threads--"
                    :disabled="running || threads <= 1"
                />
                <input
                    type="button"
                    class="square-btn arrow button-large"
                    value="+"
                    @click="threads++"
                    :disabled="running"
                />
                <h4 v-text="threads"></h4>
                <span>&nbsp;threads</span>
                <span v-if="threads === cores"> (recommended)</span>
            </div>
            <div class="row">
                <div class="col-lg-6 col-sm-12">
                    <input type="button" value="Generate" class="button-large hide-render" disabled />
                    <input
                        type="button"
                        value="Generate"
                        class="button-large hide-prerender"
                        @click="startGen"
                        :disabled="running || inputError || error"
                    />
                </div>
                <div class="col-lg-6 col-sm-12">
                    <input type="button" value="Stop" class="button-large" @click="stopGen" :disabled="!running" />
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
        for (let i = 0; i < str.length; i++) {
            const l = str.substr(i, 1);
            ret += Math.random() < 0.5 ? l.toUpperCase() : l.toLowerCase();
        }
        return ret;
    }
    export default {
        props: {
            running: Boolean,
            cores: Number,
        },
        data: function () {
            return {
                threads: this.$props.cores || 4,
                prefix: '',
                suffix: '',
                checksum: true,
                error: false,
            };
        },
        computed: {
            prefixError: function () {
                return !isValidHex(this.prefix);
            },
            suffixError: function () {
                return !isValidHex(this.suffix);
            },
            inputError: function () {
                return this.prefixError || this.suffixError;
            },
            example: function () {
                if (this.inputError) {
                    return null;
                }
                const prefix = this.checksum ? this.prefix : mixCase(this.prefix);
                const suffix = this.checksum ? this.suffix : mixCase(this.suffix);
                let random = '';
                for (let i = 0; i < 40 - this.prefix.length - this.suffix.length; i++) {
                    random += mixCase(Math.floor(Math.random() * 16).toString(16));
                }
                return { random, prefix, suffix };
            },
        },
        methods: {
            startGen: function () {
                if (!this.running && !this.inputError && !this.error) {
                    this.$emit('start');
                }
            },
            stopGen: function () {
                this.$emit('stop');
            },
        },
        watch: {
            prefix: function () {
                this.$emit('input-change', 'prefix', this.prefix);
            },
            suffix: function () {
                this.$emit('input-change', 'suffix', this.suffix);
            },
            checksum: function () {
                this.$emit('input-change', 'checksum', this.checksum);
            },
            threads: function () {
                this.$emit('input-change', 'threads', this.threads);
            },
        },
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel
        min-height: 280px

    .error-text
        font-size: 14px
        color: $error

    input.error
        border: 1px solid $error

    .example
        font-size: 14px
        word-break: break-all
        color: $text-alt
        b
            color: $text
        .monospace
            font-family: $monospace-font
    .controls
        margin: 12px 0
        > div
            padding: 5px 0

        .checkbox
            margin-bottom: 4px
            padding-left: 30px
            line-height: 27px
            cursor: pointer
            position: relative
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

        .switch
            position: relative
            width: 40px
            height: 24px
            margin: 0 5px
            input
                visibility: hidden

        .slider
            position: absolute
            cursor: pointer
            top: 0
            left: 0
            right: 0
            bottom: 0
            background-color: $primary
            transition: .2s
            &:before
                position: absolute
                content: ""
                height: 16px
                width: 16px
                left: 4px
                bottom: 4px
                background-color: white
                transition: .2s

    input
        &:checked + .slider
            background-color: $primary
        &:focus + .slider
            box-shadow: 0 0 1px $primary
        &:checked + .slider:before
            transform: translateX(16px)

    .threads
        h4
            display: inline
        input[type=button].square-btn
            display: inline-block
            width: 24px
            height: 24px
            margin: 0 5px 2px 0
            padding: 0
            line-height: 1em

    .justify-content-center
        justify-content: center

    .spinner
        width: 64px
        height: 64px
        margin: 18px
        & > div
            position: absolute
            width: 51px
            height: 51px
            margin: 6px
            border: 6px solid $primary
            border-radius: 50%
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
            border-color: $primary transparent transparent transparent
            &:nth-child(1)
                animation-delay: -0.45s
            &:nth-child(2)
                animation-delay: -0.3s
            &:nth-child(3)
                animation-delay: -0.15s

    @keyframes lds-ring
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
