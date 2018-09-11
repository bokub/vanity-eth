<template>
    <!--Github corner-->
    <div>
        <h1>VANITY-ETH</h1>
        <p>ETH vanity address generator</p>
    </div>
</template>

<script>
    export default {};
</script>

<style lang="sass" scoped>
    @import "../css/variables"

    div
        margin-bottom: 8em
        color: $logo
        font-family: 'Montserrat', sans-serif
        text-align: center

        h1
            font-size: 3em
            font-weight: 700
            border: 4px solid $logo
            width: 7.8em
            margin: 0 auto

        p
            font-size: 1.5em
            letter-spacing: 2px
            font-weight: 400
            margin-top: 1em

    /*-- Responsive design --

    @media screen and (max-width: 1280px)
        h1
            font-size: 2.8em

    @media screen and (max-width: 1024px)
        div
            margin-bottom: 4em
            h1
                font-size: 2.5em
                border-width: 3px
            p
                font-size: 1.4em
                margin-top: 0.8em

    @media screen and (max-width: 640px)
        div
            margin-bottom: 4em
            h1
                font-size: 2.2em
            p
                font-size: 1.3em
                margin-top: 0.7em

    @media screen and (max-width: 480px)
        h1
            font-size: 2em
            border-width: 2px
        p
            font-size: 1.2em

    @media screen and (max-width: 320px)
        h1
            font-size: 1.6em
        p
            font-size: 1em
</style>
