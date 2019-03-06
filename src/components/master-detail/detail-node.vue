<template lang="pug">
  .detail-node(
    :selected="nodeIsSelected"
    @click="toggleSelected"
  )
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
</template>
<script type="text/babel">
import ControlButton from './control-button'
import ClickableNode from './clickable-node.vue'
import './master-detail.scss'

export default {
  name: 'DetailNode',
  mixins: [ClickableNode],
  components: {
    ControlButton
  }
}
</script>
