<template>
  <span>Field: {{value.name}}</span>
</template>

<script>
import objects from '../../db'

export default {
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      objects
    }
  }
}
</script>

<style>

</style>
