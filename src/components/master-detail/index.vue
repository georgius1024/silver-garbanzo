<template lang="pug">
  .master-detail
    draggable.detail-nodes(
      :value="roots"
      :options="sortableOptions"
      @input="masterSorted"
    )
      master-node(
        v-for="(root, index) in roots",
        :key="index",
        :data="root",
        parent-id=""
        :selected-path="selectedPath"
        :idField="idField"
        :textField="textField"
        :readOnlyField="readOnlyField"
        :iconField="iconField"
        :sortable="sortable"
        :update-button="updateButton"
        :delete-button="deleteButton"
        :double-click-interval="doubleClickInterval"
        @sorted="detailSorted(index, $event)"
        @selected="detailSelected"
        @update="detailUpdate"
        @delete="detailDelete"
        @click="detailClick"
        @dblclick="detailDblClick"
      )
        template(v-slot:controls="root")
          slot(name="controls" :data="root.data")
</template>
<script>
import MasterNode from './master-node'
import draggable from 'vuedraggable'
import ClickableNode from './clickable-node.vue'
import _cloneDeep from 'lodash.clonedeep'
import './master-detail.scss'

export default {
  name: 'MasterDetail',
  mixins: [ClickableNode],
  components: {
    MasterNode,
    draggable
  },
  data () {
    return {
      roots: []
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    sortableOptions () {
      return ({
        handle: '.handle-control',
        group: 'fancy-python1'
      })
    }
  },
  beforeMount () {
    this.roots = _cloneDeep(this.data)
  },
  beforeUpdate () {
    this.roots = _cloneDeep(this.data)
  },
  methods: {
    masterSorted (data) {
      this.$set(this, 'roots', data)
      this.$emit('sorted', this.roots)
    },
    detailSorted (index, detail) {
      const newData = _cloneDeep(this.roots)
      newData[index] = _cloneDeep(detail)
      this.$set(this, 'roots', newData)
      this.$emit('sorted', this.roots)
    },
    detailSelected (e) {
      this.$emit('selected', e)
    },
    detailUpdate (e) {
      this.$emit('update', e)
    },
    detailDelete (e) {
      this.$emit('delete', e)
    },
    detailClick (e) {
      this.$emit('click', e)
    },
    detailDblClick (e) {
      this.$emit('dblclick', e)
    }

    /*
    selected (path) {
      this.$set(this, 'selectedPath', path)
    },
    expanded (e) {
      consle.log(e)
    },
    click(e) {
      consle.log(e)
    },
    dblClick(e) {
      consle.log(e)
    },
    callUpdate(e) {
      consle.log(e)
    },
    callDelete(e) {
      consle.log(e)
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
    */
  }
}
</script>
