<template>
    <div class="tree-node">
      <div
        v-bind:href="path"
        v-on:click="toggleSelected"
        class="tree-node-cell"
        v-bind:class="{'node-expanded': expanded, 'node-selected': selected}"
        v-if="!invisibleNode">
        <div
          v-if="!nodeIsRoot && nodeIsBranch"
          class="tree-view-node-expand-action"
          v-on:click.stop="toggleExpanded">
          <v-icon>keyboard_arrow_right</v-icon>
        </div>
        <div
          v-else
          class="tree-view-node-expand-action">
        </div>
        <div
          class="tree-view-node-handle"
          v-if="sortable && nodeIsEditable">
          <v-icon>mdi-drag</v-icon>
        </div>
        <v-icon
            v-if="hasIcon"
            class="mx-2"
            small
            v-text="nodeIcon"
        />
        <div class="tree-view-node-title">
          <span v-html="nodeText"></span>
        </div>
        <code v-if="nodeBadge" class="tree-view-node-badge" v-html="nodeBadge"></code>
        <control-button
          v-on:click.native.stop="updateAction(nodeId)"
          v-bind:disabled="!selected"
          v-if="updateButton && nodeIsEditable"
        >
          <v-icon>edit</v-icon>
        </control-button>
        <slot name="actions" :data="data"></slot>
        <control-button
          @click.native.stop="deleteAction(nodeId)"
          v-bind:disabled="!selected"
          v-if="deleteButton && nodeIsEditable"
          class="danger"
        >
          <v-icon>delete</v-icon>
        </control-button>

      </div>

      <draggable
        class="tree-view-node-children-list"
        :value="children"
        :options="sortableOptions"
        :class="{'invisible-root-node': invisibleNode}"
        @input="sorted"
        ref="sortable"
      >
        <tree-view-node
          v-for="(child, index) in children"
          v-show="expanded || nodeIsRoot"
          :key="index"
          :data="child"
          :sortable="sortable"
          :parent="path"
          :expanded-path="expandedPath"
          :selected-path="selectedPath"
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
          >
          <template slot="actions" slot-scope="props">
            <slot name="actions" :data="props.data"></slot>
          </template>

        </tree-view-node>
      </draggable>

    </div>
</template>
<script type="text/babel">
  import moment from 'moment-timezone'
  import _ from 'lodash'
  import Vue from 'vue'
  import {addTrailingSlash} from '@shared/lib/helpers.js'
  import draggable from 'vuedraggable'

  var ControlButton = Vue.component('controlButton', {
    template: `<v-btn flat icon small class="control-button">
      <slot>delete</slot>
    </v-btn>`
  })

  export default {
    name: 'TreeViewNode',
    props: {
      data: {
        type: Object,
        default: () => {
          return {
            id: 101,
            text: 'Node',
            type: 'branch',
            badge: 'over 100%',
            children: [
            ]
          }
        },
        required: false
      },
      invisibleNode: {
        type: Boolean,
        default: false
      },
      parent: {
        type: [String, Number],
        required: true
      },
      expandedPath: {
        type: String,
        required: false
      },
      selectedPath: {
        type: String,
        required: false
      },
      sortable: {
        type: Boolean,
        default: true
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
      }
    },
    computed: {
      children () {
        let children = _.get(this.data, 'children', [])
        if (_.isArray(children)) {
          return children.sort((a, b) => {
            return a['__$sort'] - b['__$sort']
          })
        } else {
          return []
        }
      },
      hasChildren () {
        return this.children.length > 0
      },
      nodeId () {
        return _.get(this.data, 'id')
      },
      nodeText () {
        return _.get(this.data, 'text')
      },
      nodeBadge () {
        return _.get(this.data, 'badge')
      },
      nodeIsLeaf () {
        return this.data.type === 'leaf'
      },
      nodeIsRoot () {
        return this.data.type === 'root'
      },
      nodeIsBranch () {
        return this.data.type === 'branch' || this.hasChildren
      },
      nodeIsEditable () {
        return !this.nodeIsRoot && !this.data.fixed
      },
      path () {
        if (this.nodeIsRoot) {
          return addTrailingSlash(this.parent)
        } else if (this.parent) {
          return addTrailingSlash(this.parent) + this.nodeId + '/'
        } else {
          return addTrailingSlash(this.nodeId)
        }
      },
      expanded () {
        return this.expandedPath.indexOf(this.path) === 0
      },
      selected () {
        return this.selectedPath === this.path
      },
      hasIcon () {
        return _.has(this.data, 'icon')
      },
      nodeIcon () {
        return _.get(this.data, 'icon')
      },
      sortableOptions () {
        return ({
          handle: '.tree-view-node-handle'
        })
      }
    },
    methods: {
      toggleSelected () {
        if (this.selectedAt) {
          let passed = moment().diff(this.selectedAt)
          if (passed < this.doubleClickInterval && this.nodeIsEditable) {
            this.emitDblClick(this.path)
          } else {
            this.emitClick(this.path)
          }
        } else {
          this.emitClick(this.path)
        }
        this.selectedAt = moment()

        if (!this.selected) {
          // Повторные клики игнорируются
          this.emitSelected(this.path)
          this.expand()
        }
      },
      emitSelected (e) {
        this.$emit('selected', e)
      },
      expand () {
        this.emitExpanded(this.path)
      },
      toggleExpanded () {
        if (this.expanded) {
          this.emitExpanded(this.parent)
        } else {
          this.emitExpanded(this.path)
        }
      },
      sorted (sort) {
        this.$emit('sort',
          {
            parent: this.nodeId,
            order: sort.map(e => e.id)
          })
      },
      updateAction (id) {
        this.$emit('update', id)
      },
      deleteAction (id) {
        this.$emit('delete', id)
      },
      emitExpanded (e) {
        this.$emit('expanded', e)
      },
      emitSort (e) {
        this.$emit('sort', e)
      },
      emitClick (e) {
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
  }
</script>
<style>
  .tree-node {

  }

  .tree-node>.tree-node-cell {
    background-color: #fff;
    display:flex;
    height: 48px;
    text-decoration: none;
    align-items: center;
    margin: 0;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    position: relative;
    user-select: none;
    cursor: pointer;
    border: 1px solid #e5e5e5;
    border-top: none;
  }

  .tree-node>.tree-node-cell>.tree-view-node-handle {
    margin-right: 16px;
    width: 24px;
    height: 24px;
  }

  .tree-node>.tree-node-cell>.tree-view-node-title {
      text-align: left;
      flex: 1 1 auto;
      overflow: hidden;
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
  }

  .tree-node>.tree-node-cell>.tree-view-node-badge {
      display: flex;
      justify-content: flex-end;
      margin-right: 12px;
      align-items: center;
  }

  .tree-node>.tree-node-cell>.tree-view-node-expand-action {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      transition: 0.3s;
      -webkit-transition-property: -webkit-transform;
      -moz-transition-property: -moz-transform;
      -o-transition-property: -o-transform;
      transition-property: transform;
      width: 24px;
      margin: 4px;
  }

  .tree-node>.tree-node-cell>.node-expanded .tree-view-node-expand-action {
     transform: rotate(90deg);
     -webkit-transform: rotate(90deg);
     -ms-transform: rotate(90deg);
  }

  .tree-view-node:hover {
    background-color: rgba(0,0,0,0.1);
  }

  .tree-view-node.node-selected {
    background-color: rgba(0,0,0,0.25) !important;
  }

  .tree-view-node-children-list {
    margin-left: 24px;
  }

  .tree-view-node-children-list.invisible-root-node {
    margin-left: 0px;
  }

  .expand-enter-active, .expand-leave-active {
    transition: all 1s ease;
  }
  .expand-enter, .expand-leave {
    height: 0;
    opacity: 0;
  }

  .table-browse-class .control-cell {
    text-align: right !important;
    white-space: nowrap !important;
  }

  .tree-view-node .control-button {
    margin: 0px !important;
    opacity: 0.25 !important;
  }

  .tree-view-node.node-selected .control-button {
    opacity: 0.8 !important;
  }

</style>