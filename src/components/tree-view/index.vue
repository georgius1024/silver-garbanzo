<template lang="pug">
  .tree-view  
    draggable(
      class="node-children"
      :value="roots"
      :options="sortableOptions"
      @input="sorted"
      ref="sortable"
    )
      tree-view-node(
        v-for="(node, index) in roots"
        :key="index"
        :data="node"
        :selected-path="selectedPath"
        :expanded-path="expandedPath"
        :id-field="idField"
        :text-field="textField"
        :children-field="childrenField"
        :node-type-field="nodeTypeField"
        :read-only-field="readOnlyField"
        :icon-field="iconField"
        :async-load-field="asyncLoadField"
        :sortable="sortable"
        :update-button="updateButton"
        :delete-button="deleteButton"
        :double-click-interval="doubleClickInterval"
        @expanded="emitExpanded"
        @selected="emitSelected"
        @update="emitUpdate"
        @delete="emitDelete"
        @sort="childSorted(index, $event)"
        @click="emitClick"
        @dblclick="emitDblClick"
      )
        template( v-slot:controls="node")
          slot(name="controls" :data="node.data")
</template>

<script type="text/babel">
import _cloneDeep from 'lodash.clonedeep'
import draggable from 'vuedraggable'
import TreeViewNode from './tree-view-node.vue'
import './tree-view.scss'

export default {
  name: 'TreeView',
  components: {
    TreeViewNode, draggable
  },
  data () {
    return {
      expandedPath: ''
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    idField: {
      type: String,
      default: 'id'
    },
    textField: {
      type: String,
      default: 'text'
    },
    childrenField: {
      type: String,
      default: 'children'
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
    asyncLoadField: {
      type: String,
      default: 'asyncLoad'
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
      return this.data
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
    },
    sortableOptions () {
      return ({
        handle: '.handle-control'
      })
    }
  },
  watch: {
    value: function (newValue) {
      this.follow(newValue)  
    }
  },
  mounted () {
    this.follow(this.selectedPath)
  },
  methods: {
    emitExpanded (e) {
      this.expandedPath = e
      console.log(this.expandedPath)
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
      this.follow(this.selectedPath)
    },
    childSorted (index, child) {
      const newData = _cloneDeep(this.data)
      newData[index] = _cloneDeep(child)
      this.$emit('sorted', newData)
    },
    emitClick (e) {
      this.$emit('click', e)
    },
    emitDblClick (e) {
      this.$emit('dblclick', e)
    },
    sorted (sort) {
      this.$emit('sorted', sort)
    },
    follow (path) {
      this.expandedPath = path.split('/').slice(0, -1).join('/')
    },
  }
}
</script>
