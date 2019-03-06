<template lang="pug">
  .master-node
    .detail-node(
      :selected="nodeIsSelected"
      :expanded="nodeIsExpanded"
      @click="toggleSelected"
    )
      v-icon(
        v-if="nodeHasOpenControl"
        class="open-control"
        @click.stop="toggleExpanded"
      ) chevron_right

      img.handle-control(
        v-if="nodeHasHandleControl"
        :src="require('./drag-indicator.svg')"
      )
      v-icon.icon-element(
          v-if="nodeHasIcon"
          v-text="nodeIcon"
      )
      .node-text(
        v-html="nodeText"
      )
      .controls
        slot(
          name="controls"
          :data="data"
        )
        control-button(
          v-if="nodeHasUpdateButton"
          :disabled="!nodeIsSelected"
          @click.stop="updateAction(nodeId)"
        )
          v-icon edit
        control-button(
          v-if="nodeHasDeleteButton",
          :disabled="!nodeIsSelected",
          class="danger"
          @click.stop="deleteAction(nodeId)",
        )
          v-icon delete
    template(v-if="hasChildren")
      transition(name="slide")
        draggable.detail-nodes(
          v-if="nodeIsExpanded"
          :value="children"
          :options="sortableOptions"
          @input="sorted"
        )
          detail-node(
            v-for="(child, index) in children"
            v-show="nodeIsExpanded"
            :key="index"
            :parent-id="nodeId"
            :selected-path="selectedPath"
            :data="child"
            :idField="idField"
            :textField="textField"
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
            @click="emitClick"
            @dblclick="emitDblClick"
          )
            template(v-slot:controls="child")
              slot(name="controls" :data="child.data")
    template(v-else)
      transition(name="slide")
        draggable.detail-nodes(
          :value="children"
          v-if="nodeIsExpanded"
          :options="sortableOptions"
          @input="sorted"
        )
          .detail-node
            .node-text Node is empty. Drop items here or click to add new
</template>
<script>
import DetailNode from './detail-node'
import ControlButton from './control-button'
import ClickableNode from './clickable-node.vue'
import draggable from 'vuedraggable'
import _cloneDeep from 'lodash.clonedeep'
import './master-detail.scss'

export default {
  name: 'MasterNode',
  mixins: [ClickableNode],
  components: {
    DetailNode, draggable, ControlButton
  },
  data () {
    return {
      expanded: false
    }
  },
  props: {
    childrenField: {
      type: String,
      default: 'children'
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
    nodeHasOpenControl () {
      return true
    },
    nodeIsExpanded () {
      return this.expanded
    },
    nodePath () {
      return this.nodeId
    },
    sortableOptions () {
      return ({
        handle: '.handle-control',
        group: 'fancy-python'
      })
    }
  },
  methods: {
    toggleExpanded () {
      this.expanded = !this.expanded
    },
    sorted (sort) {
      const newData = _cloneDeep(this.data)
      newData[this.childrenField] = sort
      this.$emit('sorted', newData)
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
    }
  }
}
</script>
