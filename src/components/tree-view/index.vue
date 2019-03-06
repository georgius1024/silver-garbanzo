<template lang="pug">
  .tree-view  
    draggable()
      class="node-children"
      :value="children"
      :options="sortableOptions"
      @input="sorted"
      ref="sortable"
    )
      tree-view-node(
        v-for="(node, index) in roots"
        :key="index"
        :data="child"
        :parentPath="nodePath"
        :selected-path="selectedPath"
        :expanded-path="expandedPath"
        :idField="idField"
        :textField="textField"
        :childrenField="childrenField"
        :nodeTypeField="nodeTypeField"
        :readOnlyField="readOnlyField"
        :iconField="iconField"
        :sortable="sortable"
        :update-button="updateButton"
        :delete-button="deleteButton"
        :double-click-interval="doubleClickInterval"
        @expanded="emitExpanded"
        @selected="emitSelected"
        @update="emitUpdate"
        @delete="emitDelete"
        @sort="emitSort"
        @click="emitClick"
        @dblclick="emitDblClick"
      )
        template( v-slot:controls="node")
          slot(name="controls" :data="node.data")
</template>

<script type="text/babel">
import _cloneDeep from 'lodash.clonedeep'
import TreeViewNode from './tree-view-node.vue'
import './tree-view.scss'

export default {
  name: 'TreeView',
  data () {
    return {
      expanded: ''
    }
  },
  props: {
    data: {
      required: true
    },
    idField: {
      type: String,
      default: 'id'
    },
    parentField: {
      type: String,
      default: 'parent'
    },
    textField: {
      type: String,
      default: 'text'
    },
    nodeTypeField: {
      type: String,
      default: 'type'
    },
    readOnlyField: {
      type: String,
      default: 'readOnly'
    },
    iconField: {
      type: String,
      default: 'icon'
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
  computed: {
    roots () {
      return this.treefy()
    },
    selectedPath () {
      return this.value
    },
    treeStyle () {
      if (this.height) {
        return {
          'maxHeight': this.height + 'px',
          'minHeight': this.height + 'px',
          'overflowY': 'scroll',
          'overflowX': 'hidden'
        }
      } else {
        return {}
      }
    }
  },
  mounted () {
    this.syncExpanded()
  },
  updated () {
    this.syncExpanded()
  },
  methods: {
    /*
    treefy () {
      const loops = 10
      let data = _cloneDeep(this.data)
      data.forEach((e, i) => {
        e.ignored = true
        e['__$sort'] = i
      })
      let root = {
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
    */
    emitExpanded (e) {
      this.expanded = e
      this.$emit('expanded', e)
    },
    emitUpdate (e) {
      this.$emit('update', e)
    },
    emitDelete (e) {
      this.$emit('delete', e)
    },
    emitSelected (e) {
      this.$emit('input', e)
      this.$emit('selected', e)
    },
    emitSort (e) {
      this.$emit('sort', e)
    },
    emitClick (e) {
      this.$emit('click', e)
    },
    emitDblClick (e) {
      this.$emit('dblclick', e)
    },
    sorted (sort) {
      const newData = _cloneDeep(this.roots)
      newData[this.childrenField] = sort
      this.$emit('sort', newData)
    },
    syncExpanded () {
    },

    expand (path) {
      this.expanded = path
    },
  },
  components: {
    TreeViewNode
  }
}
</script>
