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
                <button type="button" class="button-large" @click="save" :disabled="!password || !privateKey || loading"
                        v-text="loading ? 'Generating...' : 'Download'"></button>
            </div>
        </form>
    </div>
</template>

<script>
    import * as remodal from 'remodal/src/remodal';
    import * as randomBytes from 'randombytes';
    import * as download from 'downloadjs';

    import {v4} from 'uuid';
    import CryptoJS from 'crypto-js';
    import secp256k1 from 'secp256k1';
    import keccak from 'keccak';

    export default {
        props: {
            privateKey: String
        },
        data: function () {
            return {
                password: '',
                loading: false,
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
                    this.loading = true;

                    setTimeout(() => {
                        const wallet = this.generateWallet(this.privateKey, this.password);
                        const fileName = 'UTC--' + new Date().toISOString().replace(/:/g, '-') + '--' + wallet.address;
                        download(JSON.stringify(wallet), fileName, "application/json");
                        this.loading = false;
                    }, 20);
                }
            },

            // Generate a JSON wallet from a private key and a password
            generateWallet(privateKey, password) {
                privateKey = Buffer.from(privateKey, 'hex');
                return {
                    address: this.privateToAddress(privateKey),
                    crypto: this.encryptPrivateKey(privateKey, password),
                    id: v4(),
                    version: 3
                };
            },

            privateToAddress(privateKey) {
                const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1);
                return keccak('keccak256').update(pub).digest().slice(-20).toString('hex');
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
                    iterations: 262144
                });
                const cipher = CryptoJS.AES.encrypt(
                    CryptoJS.enc.Hex.parse(privateKey.toString('hex')),
                    this.sliceWordArray(key, 0, 4),
                    {
                        iv: iv,
                        mode: CryptoJS.mode.CTR,
                        padding: CryptoJS.pad.NoPadding
                    }
                );
                const mac = CryptoJS.SHA3(this.sliceWordArray(key, 4, 8).concat(cipher.ciphertext), {
                    outputLength: 256
                });

                return {
                    kdf: 'pbkdf2',
                    kdfparams: {c: 262144, dklen: 32, prf: 'hmac-sha256', salt: salt.toString()},
                    cipher: 'aes-128-ctr',
                    ciphertext: cipher.ciphertext.toString(),
                    cipherparams: {iv: iv.toString()},
                    mac: mac.toString()
                };
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
        color: $text
        .title
            margin-bottom: 45px
        .remodal-close
            outline: none
            &:before
                font-size: 2em
            &:hover
                color: $text
        .hidden
            display: none

</style>