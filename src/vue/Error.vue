<template>
    <div class="panel">
        <p v-if="error === 'workers_unsupported'">
            Your browser does not support multi-thread computation.<br>
            Please use a different browser.
        </p>
        <p v-else v-html="error.replace('\n', '<br>')"></p>
    </div>
</template>


<script>
    export default {
        props: {
            'error': {
                type: String,
                required: true
            },
        }
    }
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel
        background-color: $error
        color: $text-opposite
        a, a:visited, a:hover
            text-decoration: underline
</style>