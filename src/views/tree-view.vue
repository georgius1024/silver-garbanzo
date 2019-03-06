<template lang="pug">
  v-container.fill-height.align-items.fluid

    tree-view(
      :data="root",
      :update-button="true",
      :delete-button="true",
      :value="selectedPath",
      @selected="selected",
      @sorted="sorted",
      @dblclick="alert"
      @delete="alert"
      @update="alert"
    )
      template(v-slot:controls="{data}")
        span ({{'#'+data.id}})
        control-button(class="info--text", @click="alert(data.id)")
          v-icon help
</template>
<script>
import TreeView from '../components/tree-view'
import ControlButton from '../components/tree-view/control-button'
export default {
  name: 'Tree',
  components: {
    TreeView,
    ControlButton
  },
  data () {
    const populate = (parent) => this.populate(parent)
    return {
      selectedPath: '',
      root: [
      {
        id: 'root-1',
        text: 'Root A',
        type: 'branch',
        icon: 'info',
        children: [
          {
            id: 110,
            type: 'leaf',
            text: 'Folder A'
          }
        ]
      },
      {
        id: 'root-2',
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
                icon: 'alarm',
                asyncLoad: populate
              },
              {
                id: 102,
                type: 'branch',
                text: 'Folder B',
                icon: 'alarm',
                asyncLoad: populate,
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
      }]
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
    sorted (data) {
      this.$set(this, 'root', data)
    },
    alert (id) {
      this.$nextTick(() => alert(id))
    },
    populate (parent) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const items = this.buildItems('Дите', 5, parent * 10)
          resolve(items)
        }, 1000)
      })
      //return this.buildItems('Дите', 5, parent * 10)
    },
    buildItems (pre = 'item', qty = 3, base = 100) {
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
