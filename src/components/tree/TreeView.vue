<template>
  <div class="tree-view" :style="treeStyle">
    <tree-view-node
      :data="root"
      :parent="rootId"
      :sortable="sortable"
      :expanded-path="expanded"
      :selected-path="value"
      :invisible-node="!rootShow"
      :update-button="updateButton"
      :delete-button="deleteButton"
      :double-click-interval="doubleClickInterval"
      @expanded="recieveExpanded"
      @selected="recieveSelected"
      @update="recieveUpdate"
      @delete="recieveDelete"
      @sort="recieveSort"
      @click="recieveClick"
      @dblclick="recieveDblClick"
      >
      <template slot="actions" slot-scope="props">
        <slot name="actions" :data="props.data"></slot>
      </template>
    </tree-view-node>
  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import TreeViewNode from './TreeViewNode.vue'
import {lastElement, parentPath} from '@shared/lib/path.js'

export default {
  name: 'TreeView',
  data () {
    return {
      expanded: ''
    }
  },
  computed: {
    root () {
      return this.treefy()
    },
    selectedPath () {
      return this.value
    },
    selectedId () {
      return lastElement(this.value)
    },
    treeStyle () {
      if (this.height) {
        return {
          'maxHeight': this.height + 'px',
          'minHeight': this.height + 'px',
          'overflowY': 'scroll',
          'overflowX': 'hidden'
        }
      }
    }
  },
  mounted () {
    this.syncExpanded()
  },
  updated () {
    this.syncExpanded()
  },
  props: {
    rootText: {
      default: 'Root'
    },
    rootShow: {
      default: true
    },
    data: {
      required: true
    },
    rootId: {
      type: [String, Number],
      default: '0',
      required: false
    },
    sortable: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number]
    },
    updateButton: {
      default: false
    },
    deleteButton: {
      default: false
    },
    doubleClickInterval: {
      type: Number,
      default: 500
    },
    height: {
      default: false
    }
  },
  methods: {
    treefy () {
      const loops = 10
      let data = _.cloneDeep(this.data)
      data.forEach((e, i) => {
        e.ignored = true
        e['__$sort'] = i
      })
      let result = {
        id: this.rootId,
        text: this.rootText,
        type: 'root'
      }
      let map = {}
      map['root'] = result
      for (let loop = 0; loop < loops; loop++) {
        if (data.find(e => e.ignored)) {
          data.forEach(e => {
            if (e.ignored) {
              let parentNode
              if (String(e.parent) === String(this.rootId)) {
                parentNode = map['root']
              } else {
                parentNode = map[String(e.parent)]
              }
              if (parentNode) {
                if (!parentNode.children) {
                  parentNode.children = []
                }
                parentNode.children.push(e)
                if (parentNode.type === 'leaf') {
                  parentNode.type = 'branch'
                }
                map[String(e.id)] = e
                delete e.ignored
              }
            }
          })
        }
      }
      return result
    },
    recieveExpanded (e) {
      this.expanded = e
      this.$emit('expanded', e)
    },
    recieveUpdate (e) {
      this.$emit('update', e)
    },
    recieveDelete (e) {
      this.$emit('delete', e)
    },
    syncExpanded () {
      if (this.value && !this.expanded) {
        // Раскрывается вплоть до родителя подсвеченной записи
        this.expanded = parentPath(this.value)
      }
    },
    followSelected (path) {
      this.expanded = parentPath(path)
    },
    expand (path) {
      this.expanded = path
    },
    recieveSelected (e) {
      this.$emit('input', e)
      this.$emit('selected', e)
    },
    recieveSort (e) {
      this.$emit('sort', e)
    },
    recieveClick (e) {
      this.$emit('click', e)
    },
    recieveDblClick (e) {
      this.$emit('dblclick', e)
    }
  },
  components: {
    TreeViewNode
  }
}
</script>
<style>
  .tree-view {
    border-top: 1px solid #e5e5e5;
  }
</style>

