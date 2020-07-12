<template>
  <div class="_this">
    <span>[{{valueText}}]</span>
    <a href="javascript:;" @click="open" class="act">选择</a>
    <a href="javascript:;" @click="create" class="act">新建</a>
    <div class="dialog" v-if="selecting">
      <div class="item" v-for="(item, index) in objects" :key="index" @click="select(item)">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
import objects from '../../db'

export default {
  props: {
    value: {
      type: Object
    },
    type: {
      type: Object
    }
  },
  data () {
    return {
      selecting: false
    }
  },
  computed: {
    objects () {
      return objects.filter(m => m._type === this.type)
    },
    valueText () {
      if (typeof this.value === 'undefined') return 'undefined'
      if (typeof this.value === 'object') return this.value._type.name
      return this.value
    }
  },
  methods: {
    open () {
      this.selecting = true
    },
    select (item) {
      this.$emit('input', item)
      this.selecting = false
    },
    create () {
      this.$emit('input', this.type.create())
    }
  }
}
</script>

<style>
._this {
  position: relative;
}
.select {
  position: relative;
}
.dialog {
  position: absolute;
  background-color: #FFFFFF;
  border: solid 1px #000;
  z-index: 9;
}
.item {
  padding: 5px;
}
</style>
