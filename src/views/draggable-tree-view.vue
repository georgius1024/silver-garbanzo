<!-- this is an example -->
<template lang="pug">
div
  v-container.fill-height.align-items.fluid
    Tree(:data="originalData" opdraggable crossTree ref="tree1" @change="tree1Change")
      div(slot-scope="{data, store}")
        b(v-if="data.children && data.children.length" @click="store.toggleOpen(data)") {{data.open ? '-' : '+'}}&nbsp;
        span {{data.text}}
</template>
<style>
.he-tree.tree {
  background-color: #fff;
  border: 1px solid #aaa;
  padding: 16px;
  display: flex;
  flex-grow: 1;
}

.tree .tree-node-inner {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  display: flex;
  padding: 12px 4px;
}

.tree-node {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.tree-node-children {
  flex-grow: 1;
}

.tree-node-inner-back {
  flex-grow: 1;
}

.tree .active .tree-node-inner {
  background-color: #ddd;
}

.tree .tree-node-inner .handle {
  border: 1px solid #aaa;
  background-color: #aaa;
  cursor: pointer;
  width: 16px;
  height: 16px;
  min-width: 16px;;
  margin: 0 8px;
}

.tree .dragging .handdle {
  visibility: hidden !important;
}

.tree .tree-node-inner .text {

}

.tree .tree-node-inner .controls {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  margin: 0 8px;
}

.draggable-placeholder-inner {
  border: 1px dashed #333;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.09);
  color: #0088f9;
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
}

</style>
<script>
import Tree from '../components/vue-draggable-nested/DraggableTree'
export default {
  components: { Tree },
  data () {
    return {
      originalData: [
        { text: 'node 1' },
        { text: 'node 2' },
        { text: 'node 3' },
        { text: 'node 4' },
        { text: 'node 4 undroppable', droppable: false },
        { text: 'node 5',
          children: [
            { text: 'node 1' },
            { text: 'node 2',
              children: [
                { text: 'node 3' },
                { text: 'node 4' }
              ] },
            { text: 'node 2 undroppable',
              droppable: false,
              children: [
                { text: 'node 3' },
                { text: 'node 4' }
              ] },
            { text: 'node 2',
              children: [
                { text: 'node 3' },
                { text: 'node 4 undroppable', droppable: false }
              ] },
            { text: 'node 3' },
            { text: 'node 4' },
            { text: 'node 3' },
            { text: 'node 4' },
            { text: 'node 3' },
            { text: 'node 4' },
            { text: 'node 3' },
            { text: 'node 4' }
          ] }
      ],
      data: null
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    tree1Change (node, targetTree) {
      this.data = targetTree.getPureData()
    }
  }
  // created() {},
  // mounted() {},
}
</script>

<style>
</style>
