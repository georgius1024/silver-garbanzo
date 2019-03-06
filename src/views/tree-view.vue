<template lang="pug">
  v-container.fill-height.align-items.fluid
    tree-view-node(
      :data="root",
      :update-button="true",
      :delete-button="true",
      :selected-path="selectedPath",
      :expanded-path="expandedPath"
      @selected="selected",
      @expanded="expanded",
      @sort="sorted",
      @dblclick="alert"
    )
      template(v-slot:controls="{data}")
        span ({{'#'+data.id}})
        control-button(class="info--text", @click="alert(data.id)")
          v-icon help
</template>
<script>
import TreeViewNode from '../components/tree/tree-view-node'
import ControlButton from '../components/tree/control-button'
export default {
  name: 'Tree',
  components: {
    TreeViewNode,
    ControlButton
  },
  data () {
    return {
      selectedPath: '',
      expandedPath: '',
      root: {
        id: 'root',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        type: 'root',
        icon: 'home',
        children: [
          {
            id: 2,
            type: 'branch',
            text: 'Your root',
            children: [
              {
                id: 101,
                type: 'leaf',
                text: 'Object A'
              },
              {
                id: 102,
                type: 'leaf',
                text: 'Object B'
              }
            ]
          },
          {
            id: 3,
            type: 'branch',
            text: 'Our root',
            icon: 'accessibility',
            children: [
              {
                id: 101,
                type: 'branch',
                text: 'Folder A',
                icon: 'alarm'
              },
              {
                id: 102,
                type: 'branch',
                text: 'Folder B',
                icon: 'alarm',
                readOnly: true
              }
            ]
          },
          {
            id: 4,
            type: 'branch',
            text: 'Benchmarks',
            icon: 'polymer',
            children: this.buildItems()
          }
        ]
      }
    }
  },
  mounted () {
    this.selectedPath = window.localStorage.getItem('selection-path') || ''
    this.expandedPath = window.localStorage.getItem('expansion-path') || ''
  },
  updated () {
    window.localStorage.setItem('selection-path', this.selectedPath || '')
    window.localStorage.setItem('expansion-path', this.expandedPath || '')
  },
  methods: {
    selected (path) {
      this.$set(this, 'selectedPath', path)
    },
    expanded (path) {
      this.$set(this, 'expandedPath', path)
    },
    sorted (data) {
      // console.log(data)
      this.$set(this, 'root', data)
    },
    alert (id) {
      this.$nextTick(() => alert(id))
    },
    buildItems () {
      let result = []
      for (let i = 0; i < 30; i++) {
        result.push({
          id: 1000 + i,
          text: i
        })
      }
      return result
    }
  }
}
</script>
