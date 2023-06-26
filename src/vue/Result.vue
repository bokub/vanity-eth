<template>
    <div class="panel result">
        <div class="row">
            <div class="float-left" id="identicon"></div>
            <div class="col">
                <div>Address: <span class="output" v-text="address"></span></div>
                <div>
                    Private key:
                    <span
                        class="output"
                        v-if="privateKey"
                        v-text="reveal ? privateKey : 'Click to reveal'"
                        @click="revealKey()"
                    ></span>
                </div>
            </div>
            <div class="col-lg-2 col-12">
                <button data-remodal-target="modal" class="save button-large" :disabled="!privateKey">
                    <i class="icon-lock"></i>Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as blockies from 'blockies';

    export default {
        props: {
            address: String,
            privateKey: String,
        },
        data: function () {
            return {
                reveal: false,
            };
        },
        watch: {
            address(addr) {
                this.reveal = false;
                const id = document.getElementById('identicon');
                id.innerHTML = '';
                if (addr) {
                    id.appendChild(blockies({ seed: addr.toLocaleLowerCase(), scale: 6 }));
                }
            },
        },
        methods: {
            revealKey() {
                this.reveal = true;
            },
        },
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    #identicon
        width: 48px
        height: 48px
        margin: 0 15px
        background-color: $panel-background-alt

    .output
        font-family: $monospace-font
        color: $text-alt
        margin-left: 15px
        word-break: break-all
        font-size: 15px

    .panel > div:not(:last-child)
        margin-bottom: 15px

    .save
        margin-top: 30px
        i
          margin-right: 8px
          top: 2px
          position: relative

    @media screen and (min-width: 992px)
        .save
            margin-top: 0
</style>
