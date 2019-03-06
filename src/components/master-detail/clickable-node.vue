<script>
export default {
  props: {
    parentId: {
      type: [Number, String],
      default: '0'
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
    }
  },
  computed: {
    nodeId () {
      return this.data[this.idField]
    },
    nodeText () {
      return this.data[this.textField]
    },
    nodeIsReadonly () {
      return Boolean(this.data[this.readOnlyField])
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
    nodeHasUpdateButton () {
      return !this.nodeIsReadonly && this.updateButton
    },
    nodeHasDeleteButton () {
      return !this.nodeIsReadonly && this.deleteButton
    },
    nodePath () {
      return [this.parentId, this.nodeId].join('/')
    }
  },
  methods: {
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
      }
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
  }

}
</script>
