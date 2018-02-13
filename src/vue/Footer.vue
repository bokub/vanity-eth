<template>
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-6 addr">
                    Tips:
                    <span class="donation-address" v-text="tipsAddress"></span>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="row">
                        <div class="col-6 col-sm-4 no-gutter">
                            <a :href="'https://etherscan.io/address/' + tipsAddress" target="_blank">
                                <button type="button">
                                    <i class="icon-ethereum"></i>&nbsp;&nbsp;&nbsp;Donate
                                </button>
                            </a>
                        </div>
                        <div class="col-6 col-sm-4 no-gutter">
                            <a href="https://github.com/bokub/vanity-eth/stargazers" target="_blank">
                                <button type="button" id="btn-star">
                                    <i class="icon-star"></i>&nbsp;&nbsp;&nbsp;Star&nbsp;me
                                </button>
                            </a>
                        </div>
                        <div class="col-4 no-mobile no-gutter">
                            <a href="https://github.com/bokub/vanity-eth/wiki/download-Vanity-ETH" target="_blank">
                                <button type="button" id="btn-download">
                                    <i class="icon-download"></i>&nbsp;&nbsp;&nbsp;Download
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        data: function () {
            return {
                tipsAddress: '0xAceBabe64807cb045505b268ef253D8fC2FeF5Bc'
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    footer
        padding: 1.5rem 0
        background-color: $panel-background
        color: $white-text
        .addr
            margin-bottom: 20px
        .donation-address
            font-family: monospace
            font-size: 1.2em
            color: $grey-text
            margin-left: 15px
            word-break: break-all
        button
            border: none
            outline: none
            color: $white-text
            padding: 0 0.8em
            line-height: 40px
            font-weight: 500
            cursor: pointer
            -webkit-appearance: none
            background-color: $teal
            i
                font-size: 1.3em
                position: relative
                top: 2px
                color: lighten($teal, 40)
            &:hover
                background-color: $yellow
                i
                    color: lighten($yellow, 40)

    @media screen and (max-width: 576px)
        .no-mobile
            display: none
</style>