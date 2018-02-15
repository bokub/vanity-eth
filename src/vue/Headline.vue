<template>
    <!--Github corner-->
    <div>
        <h1>VANITY-ETH</h1>
        <p>ETH vanity address generator</p>
    </div>
</template>

<script>
    export default {}
</script>


<style lang="sass" scoped>
    @import "../css/variables"

    div
        margin-bottom: 8em
        color: $white-text
        font-family: 'Montserrat', sans-serif
        text-align: center

        h1
            font-size: 3em
            font-weight: 700
            border: 4px solid $white-text
            width: 33%
            margin: 0 auto
            padding: 1px

        p
            font-size: 1.5em
            letter-spacing: 2px
            font-weight: 400
            margin-top: 1em

    /*-- Responsive design --

    @media screen and (max-width: 1280px)
        h1
            font-size: 2.8em
            width: 35%

    @media screen and (max-width: 1024px)
        div
            margin-bottom: 4em
            h1
                font-size: 2.5em
                border: 3px solid $white-text
                width: 34%
            p
                font-size: 1.4em
                margin-top: 0.8em

    @media screen and (max-width: 768px)
        h1
            width: 43%

    @media screen and (max-width: 640px)
        div
            margin-bottom: 4em
            h1
                width: 46%
                font-size: 2.2em
                padding: 8px
            p
                font-size: 1.3em
                margin-top: 0.7em

    @media screen and (max-width: 480px)
        h1
            width: 65%
            font-size: 2em
            padding: 7px
            border: 2px solid $white-text
        p
            font-size: 1.2em

    @media screen and (max-width: 320px)
        h1
            width: 73%
            font-size: 1.6em
            padding: 6px
        p
            font-size: 1em
</style>