<template>
  <input :value="value" @change="onChange" />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    onChange (e) {
      this.value = e.target.value
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style>

</style>
