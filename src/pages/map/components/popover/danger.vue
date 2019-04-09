<template>
	<div class="popover">
    <address>位置:{{popData.address}}</address>
    <p>风险提示:{{popData.content}}</p>
  </div>
</template>
<script>
  export default {
    name: 'popover-danger',
    data() {
      return {
      }
    },
    props: {
      popData: {
        Type:Object,
        default:() => {}
      }
    }
  }
</script>
