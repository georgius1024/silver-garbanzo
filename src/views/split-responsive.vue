<template lang="pug">
  responsive-horizonal-splitter(
    storage-key="archnofobia",
    :initial-position="30",
    :min-right-size="400",
    breakpoint="md"
    )
    template(v-slot:left)
      split-panel
        p Tree panel
    template(v-slot:right)
      responsive-vertical-splitter(
        storage-key="archnofobia-sick",
        :initial-position="75",
        :min-top-size="400",
        breakpoint="md"
      )
        template(v-slot:top)
          split-panel
            p Table panel
        template(v-slot:bottom)
          split-panel
            p Details bottom

</template>
<script>
import ResponsiveHorizonalSplitter from '../components/responsive-horizontal-splitter'
import ResponsiveVerticalSplitter from '../components/responsive-vertical-splitter'
import SplitPanel from '../components/split-panel'
export default {
  name: 'split-responsive',
  components: {
    SplitPanel,
    ResponsiveHorizonalSplitter,
    ResponsiveVerticalSplitter
  },
  data () {
    return {
    }
  }
}
</script>
