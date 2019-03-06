<template lang="pug">
  v-container.fill-height.align-items.fluid
    v-layout.column
      p {{selectedPath}}
      MasterDetail(
        :data="roots",
        :update-button="true",
        :delete-button="true",
        :selected-path="selectedPath",
        @selected="selected",
        @sorted="sorted",
        @dblclick="alert"
        @update="alert"
        @delete="alert"
      )
        template(v-slot:controls="{data}")
          span ({{'#'+data.id}})
          control-button(class="info--text", @click="alert(data.id)")
            v-icon help
</template>
<script>
import MasterDetail from '../components/master-detail'
import ControlButton from '../components/tree-view/control-button'
export default {
  name: 'MasterDetailView',
  components: {
    MasterDetail,
    ControlButton
  },
  data () {
    return {
      selectedPath: '',
      roots: [
        {
          id: 'a',
          text: 'Folder A',
          children: this.buildItems(':A', 0, 'a')
        },
        {
          id: 'b',
          text: 'Folder B',
          children: this.buildItems(':B', 2, 'b')
        },
        {
          id: 'c',
          text: 'Folder C',
          children: this.buildItems(':C', 2, 'C')
        }
      ]
    }
  },
  mounted () {
    this.selectedPath = window.localStorage.getItem('selection-path') || ''
  },
  updated () {
    window.localStorage.setItem('selection-path', this.selectedPath || '')
  },
  methods: {
    selected (path) {
      this.$set(this, 'selectedPath', path)
    },
    expanded (path) {
      // this.$set(this, 'expandedPath', path)
    },
    sorted (data) {
      console.log(JSON.stringify(data, null, 2))
      this.$set(this, 'roots', data)
    },
    alert (id) {
      this.$nextTick(() => alert(id))
    },
    buildItems (pre, qty, base) {
      let result = []
      for (let i = 0; i < qty; i++) {
        result.push({
          id: base + i,
          text: pre + ' ' + (i + 1)
        })
      }
      return result
    }
  }
}
</script>
