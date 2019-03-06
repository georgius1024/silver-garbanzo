<template lang="pug">
  v-btn(flat, icon, small, class="control-button", @click="emitClick")
    slot delete
</template>
<script>
export default {
  name: 'ControlButton',
  methods: {
    emitClick (e) {
      return this.$emit('click', e)
    }
  }
}
</script>
