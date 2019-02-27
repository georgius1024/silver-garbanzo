<template lang="pug">
  .split-panel.fill-height
    slot
</template>
<style>
.split-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  border: 1px solid #eee;
}
</style>
