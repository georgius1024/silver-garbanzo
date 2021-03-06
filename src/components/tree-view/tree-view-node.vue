<template lang="pug">
  .tree-view-node
    .node-elements(
      :selected="nodeIsSelected"
      :expanded="nodeIsExpanded"
      @click="toggleSelected"
    )
      template(v-if="nodeHasOpenControl")
        template(v-if="loading")
          v-progress-circular(indeterminate, size="24", width="2")
        template(v-else)
          v-icon(
            class="open-control"
            @click.stop="toggleExpanded"
          ) chevron_right
      img(
        v-if="nodeHasHandleControl"
        class="handle-control"
        :src="require('./drag-indicator.svg')"
      )
      v-icon(
        v-if="nodeHasIcon"
        class="icon-element"
        v-text="nodeIcon"
      )
      .node-text(v-html="nodeText")
      .controls
        slot(name="controls" :data="data")
        control-button(
          v-if="nodeHasUpdateButton"
          :disabled="!nodeIsSelected"
          @click.stop="updateAction(nodeId)"
        )
          v-icon edit
        control-button(
          v-if="nodeHasDeleteButton"
          :disabled="!nodeIsSelected"
          @click.native.stop="deleteAction(nodeId)"
          class="danger"
        )
          v-icon delete
    transition(name="slide")
      draggable(
        v-if="nodeIsExpanded"
        class="node-children"
        :value="children"
        :options="sortableOptions"
        @input="sorted"
        ref="sortable"
      )
        tree-view-node(
          v-for="(child, index) in children"
          v-show="nodeIsExpanded"
          :key="index"
          :data="child"
          :parentPath="nodePath"
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
          @sort="emitSort"
          @click="emitClick"
          @dblclick="emitDblClick"
        )
          template(v-slot:controls="child")
            slot(name="controls" :data="child.data")
  
</template>

<script type="text/babel">
import Vue from 'vue'
import draggable from 'vuedraggable'
import ControlButton from './control-button'
import _cloneDeep from 'lodash.clonedeep'
import './tree-view.scss'
export default Vue.extend({
  name: 'TreeViewNode',
  data () {
    return {
      loading: false
    }
  },
  props: {
    parentPath: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {
        return {
          id: 101,
          text: 'Node',
          type: 'root',
          children: [
          ]
        }
      },
      required: false
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
      required: false
    },
    sortable: {
      type: Boolean,
      default: true
    },
    updateButton: {
      type: Boolean,
      default: false
    },
    deleteButton: {
      type: Boolean,
      default: false
    },
    doubleClickInterval: {
      type: Number,
      default: 500
    },
    selectedPath: {
      type: String,
      required: false
    },
    expandedPath: {
      type: String,
      required: false
    }
  },
  computed: {
    children () {
      if (Array.isArray(this.data[this.childrenField])) {
        return this.data[this.childrenField]
      } else {
        return []
      }
    },
    hasChildren () {
      return this.children.length > 0
    },
    nodeId () {
      return this.data[this.idField]
    },
    nodeText () {
      return this.data[this.textField]
    },
    nodeType () {
      return this.data[this.nodeTypeField] || 'leaf'
    },
    nodeIsLeaf () {
      return this.nodeType === 'leaf'
    },
    nodeIsRoot () {
      return this.nodeType === 'root'
    },
    nodeIsBranch () {
      return this.nodeType === 'branch' || this.hasChildren
    },
    nodeIsReadonly () {
      return this.nodeIsRoot || Boolean(this.data[this.readOnlyField])
    },
    nodeHasOpenControl () {
      return this.nodeIsBranch && !this.nodeIsRoot
    },
    nodeHasHandleControl () {
      return this.sortable && !this.nodeIsReadonly
    },
    nodeHasIcon () {
      return Boolean(this.data[this.iconField])
    },
    nodeIcon () {
      return this.data[this.iconField]
    },
    nodeIsSelected () {
      return this.selectedPath === this.nodePath
    },
    nodeIsExpanded () {
      return String(this.expandedPath).indexOf(this.nodePath) === 0 || this.nodeIsRoot
    },
    nodeHasUpdateButton () {
      return !this.nodeIsReadonly && this.updateButton
    },
    nodeHasDeleteButton () {
      return !this.nodeIsReadonly && this.deleteButton
    },
    nodeHasAsyncLoad () {
      return this.asyncLoadField && typeof this.data[this.asyncLoadField] === 'function'
    },
    nodePath () {
      return [this.parentPath, this.nodeId].filter(e => !!e).join('/')
    },
    sortableOptions () {
      return ({
        handle: '.handle-control'
      })
    }
  },
  methods: {
    async toggleExpanded () {
      if (this.nodeIsExpanded) {
        this.emitExpanded(this.parentPath)
      } else {
        if (this.nodeHasAsyncLoad) {
          try {
            this.loading = true
            this.data[this.childrenField] = this.data[this.childrenField] || await this.data[this.asyncLoadField](this.nodeId)
          } finally {
            this.$set(this, 'loading', false)
            this.emitExpanded(this.nodePath)
          }
        } else {
          this.emitExpanded(this.nodePath)
        }
      }
    },

    toggleSelected () {
      if (this.selectedAt) {
        const now = new Date().valueOf()
        let passed = now - this.selectedAt
        if (passed < this.doubleClickInterval) {
          this.emitDblClick(this.nodeId)
        } else {
          this.emitClick(this.nodeId)
        }
      } else {
        this.emitClick(this.nodeId)
      }
      this.selectedAt = new Date().valueOf()

      if (!this.selected) {
        // Повторные клики игнорируются
        this.emitSelected(this.nodePath)
        this.toggleExpanded()
      }
    },
    sorted (sort) {
      const newData = _cloneDeep(this.data)
      newData[this.childrenField] = sort
      this.$emit('sort', newData)
    },
    updateAction (id) {
      this.$emit('update', id)
    },
    deleteAction (id) {
      this.$emit('delete', id)
    },
    emitSelected (e) {
      this.$emit('selected', e)
    },
    emitExpanded (e) {
      this.$emit('expanded', e)
    },
    emitSort (e) {
      const newData = _cloneDeep(this.data)
      newData.children = newData.children.map(child => {
        if (e.id === child.id) {
          return e
        } else {
          return child
        }
      })
      this.$emit('sort', newData)
    },
    emitClick (e) {
      this.$emit('click', e)
    },
    emitDblClick (e) {
      this.$emit('dblclick', e)
    },
    emitUpdate (e) {
      this.$emit('update', e)
    },
    emitDelete (e) {
      this.$emit('delete', e)
    }
  },
  components: {
    ControlButton, draggable
  }
})
</script>
