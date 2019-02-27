<template lang="pug">
  div.fill-height.flex
    Split.fill-height(@onDragEnd="onSplitResize", :class="mainClass")
        SplitArea(:size="position", :min-size="minLeftSize")
          slot(name="left")
            split-panel
              p Left Panel
        SplitArea(:size="100 - position", :min-size="minRightSize")
          slot(name="right")
            split-panel
              p Right Panel
    v-layout.column(:class="altClass")
      v-flex
        slot(name="left")
          split-panel
            p Left Panel
      v-flex
        slot(name="right")
          split-panel
            p Right Panel
</template>
<script>
import SplitPanel from '../components/split-panel'
export default {
  name: 'ResponsiveHorizonalSplitter',
  components: {
    SplitPanel
  },
  props: {
    storageKey: {
      type: String,
      default: 'ResponsiveHorizonalSplitter'
    },
    minLeftSize: {
      type: Number,
      default: 100
    },
    minRightSize: {
      type: Number,
      default: 100
    },
    initialPosition: {
      type: Number,
      default: 50
    },
    breakpoint: {
      type: String,
      default: 'md',
      validator: function (value) {
        return ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      position: 50
    }
  },
  computed: {
    mainClass () {
      if (this.breakpoint === 'xs') {
        return 'hidden-xs-only'
      } else {
        return `hidden-${this.breakpoint}-and-down`
      }
    },
    altClass () {
      switch (this.breakpoint) {
        case 'xs':
          return 'hidden-sm-and-up'
        case 'sm':
          return 'hidden-md-and-up'
        case 'md':
          return 'hidden-lg-and-up'
        case 'lg':
          return 'hidden-xl-and-up'
      }
      return ''
    }
  },
  mounted () {
    try {
      this.position = JSON.parse(localStorage.getItem(this.storageKey)) || this.initialPosition
    } catch (error) {
    }
  },
  methods: {
    onSplitResize (size) {
      this.position = size[0]
      localStorage.setItem(this.storageKey, JSON.stringify(this.position))
      this.$emit('resize', this.position)
    }
  }
}
</script>
