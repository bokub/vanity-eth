<template>
    <div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false">
        <button data-remodal-action="close" class="remodal-close"></button>
        <h3 class="title">Download encrypted keystore file (UTC / JSON)</h3>
        <div>
            <input type="password" class="text-input-large" v-model="password" placeholder="Password">
        </div>
        <div>
            <button class="button-large" @click="save" :disabled="!password || !privateKey">Save</button>
        </div>
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
                const rb = randomBytes(48);
                window.keythereum.dump(this.password, this.privateKey, rb.slice(0, 32), rb.slice(32), {}, (obj) => {
                    const fileName = "UTC--" + new Date().toISOString().replace(/:/g, '-') + "--" + obj.address;
                    download(JSON.stringify(obj), fileName, "application/json");
                });
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
            &:before
                font-size: 2em
            &:hover
                color: $white-text

</style>