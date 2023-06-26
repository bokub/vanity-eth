<template>
    <div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false">
        <button data-remodal-action="close" class="remodal-close"></button>
        <h3 class="title">Create encrypted keystore file (UTC / JSON)</h3>
        <form @submit.prevent="save">
            <div>
                <input class="hidden" type="text" autocomplete="username" />
                <input
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    class="text-input-large"
                    v-model="password"
                    placeholder="Password"
                />
                <button type="button" class="show-password" @click="showPassword = !showPassword">
                    <i :class="showPassword ? 'icon-eye-off' : 'icon-eye-on'"></i>
                </button>
            </div>
            <div>
                <button
                    type="button"
                    class="button-large"
                    @click="save"
                    :disabled="!password || !privateKey || loading"
                    v-text="loading ? 'Generating...' : 'Download'"
                ></button>
            </div>
        </form>
    </div>
</template>

<script>
    import 'remodal/src/remodal';
    import 'randombytes';
    import * as download from 'downloadjs';

    import { v4 } from 'uuid';
    import CryptoJS from 'crypto-js';

    export default {
        props: {
            privateKey: String,
            address: String,
        },
        data: function () {
            return {
                showPassword: false,
                password: '',
                loading: false,
            };
        },
        watch: {
            privateKey: function () {
                this.password = ''; // Reset password when new address is generated
            },
        },
        methods: {
            save() {
                if (this.password) {
                    this.loading = true;
                    setTimeout(() => {
                        const wallet = this.generateWallet(this.privateKey, this.password);
                        const fileName = 'UTC--' + new Date().toISOString().replace(/:/g, '-') + '--' + this.address;
                        download(JSON.stringify(wallet), fileName, 'application/json');
                        this.loading = false;
                    }, 20);
                }
            },

            // Generate a JSON wallet from a private key and a password
            generateWallet(privateKey, password) {
                privateKey = Buffer.from(privateKey, 'hex');
                return {
                    address: this.address,
                    crypto: this.encryptPrivateKey(privateKey, password),
                    id: v4(),
                    version: 3,
                };
            },

            sliceWordArray(wordArray, start, end) {
                const newArray = wordArray.clone();
                newArray.words = newArray.words.slice(start, end);
                newArray.sigBytes = (end - start) * 4;
                return newArray;
            },

            encryptPrivateKey(privateKey, password) {
                const iv = CryptoJS.lib.WordArray.random(16);
                const salt = CryptoJS.lib.WordArray.random(32);
                const key = CryptoJS.PBKDF2(password, salt, {
                    keySize: 8,
                    hasher: CryptoJS.algo.SHA256,
                    iterations: 262144,
                });
                const cipher = CryptoJS.AES.encrypt(
                    CryptoJS.enc.Hex.parse(privateKey.toString('hex')),
                    this.sliceWordArray(key, 0, 4),
                    {
                        iv: iv,
                        mode: CryptoJS.mode.CTR,
                        padding: CryptoJS.pad.NoPadding,
                    }
                );
                // eslint-disable-next-line new-cap
                const mac = CryptoJS.SHA3(this.sliceWordArray(key, 4, 8).concat(cipher.ciphertext), {
                    outputLength: 256,
                });

                return {
                    kdf: 'pbkdf2',
                    kdfparams: { c: 262144, dklen: 32, prf: 'hmac-sha256', salt: salt.toString() },
                    cipher: 'aes-128-ctr',
                    ciphertext: cipher.ciphertext.toString(),
                    cipherparams: { iv: iv.toString() },
                    mac: mac.toString(),
                };
            },
        },
    };
</script>

<style lang="sass">
    @import "~remodal/src/remodal.css"
    @import "~remodal/src/remodal-default-theme.css"
    @import "../css/variables"
    .remodal-overlay
        background: rgba(0, 0, 0, 0.85)

    .remodal
        background-color: $panel-background
        color: $text
        .title
            margin-bottom: 45px
        .remodal-close
            outline: none
            margin: 8px
            &:before
                font-size: 2em
            &:hover
                color: $text
        .hidden
            display: none
    .show-password
        position: absolute
        border: none
        font-size: 24px
        background: rgba(0,0,0,0)
        color: $text
        transform: translate(-50px, 12px)
        outline: none !important
        box-shadow: none !important
        -webkit-appearance: none
</style>
