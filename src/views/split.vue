<template lang="pug">
  v-container.fill-height.align-items.fluid
    Split.fill-height(@onDragEnd="onVertSplitResize")
        SplitArea(:size="VerticalSplit", :min-size="200")
          split-panel
            p panel left
        SplitArea(:size="100 - VerticalSplit", :min-size="200")
          Split.fill-height(direction="vertical", @onDragEnd="onHorizSplitResize")
              SplitArea(:size="HorizontalSplit", :min-size="100")
                split-panel
                  p panel left
              SplitArea(:size="100 - HorizontalSplit", :min-size="100")
                split-panel
                  p panel center
</template>

<!--
<template>
  <v-container class="fill-height" align-items fluid>
    <Split class="fill-height">
        <SplitArea :size="25">
            panel left
        </SplitArea>
        <SplitArea :size="75">
          <Split class="fill-height" direction="vertical">
              <SplitArea>
                  panel left
              </SplitArea>
              <SplitArea>
                  panel center
              </SplitArea>
          </Split>
        </SplitArea>
    </Split>
  </v-container>
</template>
-->
<!--
<template lang="pug">
  v-container.fill-height.align-items.fluid

    Split.fill-height(@onDragEnd="onVertSplitResize", direction="verical")
      SplitArea(:size="VerticalSplit.left", :min-size="200")
        split-panel
            p left
      SplitArea(:size="VerticalSplit.right", :min-size="200")
        split-panel
          Split(direction="verical")
            SplitArea(:size="50", :min-size="200")
              split-panel
                p top
            SplitArea(:size="50", :min-size="200")
              split-panel
                p bottom
</template>
-->
<!--
<template lang="pug">
  v-container.fill-height.align-items.fluid

    Split.fill-height(@onDragEnd="onVertSplitResize")
      SplitArea(:size="VerticalSplit.left", :min-size="200")
        p left
      SplitArea(:size="VerticalSplit.right", :min-size="200")
        Split(direction="verical")
          SplitArea
            p top
          SplitArea
            p bottom
</template>
-->
<script>
import SplitPanel from '../components/split-panel'
export default {
  name: 'split',
  components: {
    SplitPanel
  },
  data () {
    return {
      VerticalSplit: 50,
      HorizontalSplit: 50
    }
  },
  mounted () {
    try {
      this.VerticalSplit = JSON.parse(localStorage.getItem('split-vert'))
    } catch (error) {

    }
    try {
      this.HorizontalSplit = JSON.parse(localStorage.getItem('split-horiz'))
    } catch (error) {

    }
  },
  methods: {
    onVertSplitResize (size) {
      localStorage.setItem('split-vert', JSON.stringify(size[0]))
    },
    onHorizSplitResize (size) {
      localStorage.setItem('split-horiz', JSON.stringify(size[0]))
    }
  }
}
</script>
