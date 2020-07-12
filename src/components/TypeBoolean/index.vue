<template>
  <span><input type="checkbox" :checked="value === true ? 'checked' : ''" /></span>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean
    }
  }
}
</script>

<style>

</style>
