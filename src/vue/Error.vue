<template>
    <div class="panel">
        <p v-if="error === 'local_workers_forbidden'">
            Your browser disallows multi-thread computation when run from a local file.<br>
            Please use the online version at <a href="https://git.io/veth">git.io/veth</a>, or use a
            different
            browser.
        </p>
        <p v-else-if="error === 'workers_unsupported'">
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
        background-color: $red
        a, a:visited, a:hover
            color: $white-text
            text-decoration: underline
</style>