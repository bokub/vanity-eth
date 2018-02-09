<template>
    <div class="panel result">
        <div class="row">
            <div class="float-left" id="identicon"></div>
            <div class="col">
                <div>Address: <span class="output" v-text="address"></span></div>
                <div>Private key: <span class="output" v-text="privateKey"></span></div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as blockies from 'blockies';

    export default {
        props: {
            address: String,
            privateKey: String
        },
        watch: {
            address(addr) {
                const id = document.getElementById('identicon');
                id.innerHTML= '';
                if(addr){
                    id.appendChild(blockies({seed: addr.toLocaleLowerCase(), scale: 6}));
                }
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    #identicon
        width: 48px
        height: 48px
        margin-right: 15px
        background-color: $panel-background-clear
    .output
        font-family: monospace
        font-size: 1.2em
        color: $grey-text
        margin-left: 15px
        word-break: break-all
    .panel > div:not(:last-child)
        margin-bottom: 15px
</style>