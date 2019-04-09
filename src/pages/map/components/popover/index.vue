<template>
  <div class="ds-police-pop">
    <alarm v-show="popOverData.type == 'case'" :popData="popOverData" @addAttention="addAttention"></alarm>
    <camera v-show="popOverData.type == 'camera'" :popData="popOverData"></camera>
    <car v-show="popOverData.type == 'policeCar'" :popData="popOverData" @addAttention="addAttention"></car>
    <danger v-show="popOverData.type == 'Danger'" :popData="popOverData"></danger>
    <police v-show="popOverData.type == 'policeman'" :popData="popOverData" @addAttention="addAttention">
      
    </police>
  </div>
</template>
<script>
import alarm from './alarm'
import camera from './camera'
import car from './car'
import danger from './danger'
import police from './police'
  export default {
    name: 'popover',
    components: {
      alarm,
      camera,
      car,
      danger,
      police
    },
    props: {
      popOverData: {
        Type:Object,
        default:() => {}
      }
    },
    methods: {
      addAttention(value) {
        this.$emit('addAttention', value)
      }
    }
  }
</script>

<style lang="less" scoped>
  .ds-police-pop {
    background: #ffffff;
    padding: 5px;
    z-index: 9999;
  }
</style>

