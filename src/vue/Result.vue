<template>
    <div class="panel result">
        <div>Address: <span class="output" v-text="address"></span></div>
        <div>Private key: <span class="output" v-text="privateKey"></span></div>
    </div>
</template>

<script>
    export default {
        props: {
            address: String,
            privateKey: String
        }
    }
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .output
        font-family: monospace
        font-size: 1.2em
        color: $grey-text
        margin-left: 15px
        word-break: break-all
    .panel > div:not(:last-child)
        margin-bottom: 15px
</style>