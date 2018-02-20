<template>
    <div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false">
        <button data-remodal-action="close" class="remodal-close"></button>
        <h3 class="title">Create encrypted keystore file (UTC / JSON)</h3>
        <form v-on:submit.prevent="save">
            <div>
                <input class="hidden" type="text" autocomplete="username">
                <input type="password" autocomplete="new-password" class="text-input-large" v-model="password"
                       placeholder="Password">
            </div>
            <div>
                <button type="button" class="button-large" @click="save" :disabled="!password || !privateKey">
                    Download
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    import * as remodal from 'remodal/src/remodal';
    import * as keythereum from '../js/keythereum.min';
    import * as randomBytes from 'randombytes';
    import * as download from 'downloadjs';

    export default {
        props: {
            privateKey: String
        },
        data: function () {
            return {
                password: '',
            }
        },
        watch: {
            privateKey: function () {
                this.password = ''; // Reset password when new address is generated
            }
        },
        methods: {
            save() {
                if (this.password) {
                    const rb = randomBytes(48);
                    window.keythereum.dump(this.password, this.privateKey, rb.slice(0, 32), rb.slice(32), {}, (obj) => {
                        const fileName = "UTC--" + new Date().toISOString().replace(/:/g, '-') + "--" + obj.address;
                        download(JSON.stringify(obj), fileName, "application/json");
                    });
                }
            },
        }
    }
</script>

<style lang="sass">
    @import "~remodal/src/remodal.css"
    @import "~remodal/src/remodal-default-theme.css"
    @import "../css/variables"
    .remodal-overlay
        background: rgba(0, 0, 0, 0.85)

    .remodal
        background-color: $panel-background
        color: $white-text
        .title
            margin-bottom: 45px
        .remodal-close
            outline: none
            &:before
                font-size: 2em
            &:hover
                color: $white-text
        .hidden
            display: none

</style>