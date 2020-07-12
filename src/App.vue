<template>
  <div id="app">
    <div class="_container">
      <div class="_tree">
        <div class="_col" v-for="(pathItem, pathIndex) in path" :key="pathIndex">
          <h5>{{pathItem.type.name}}</h5>
          <template v-if="pathItem.type.isArray">
            <div class="_field"
              v-for="(item, index) in pathItem.value"
              :key="index"
              :class="{selected: pathItem.selected === index}"
              @click="fieldSelect(pathItem, index)"
            >
              <span class="_field-name">{{index}}</span>
              <span class="_field-value"><!--{{pathItem.type.itemType.display(pathItem.value[index])}}-->
                <component :is="pathItem.type.itemType.component" v-model="pathItem.value[index]" :type="pathItem.type.itemType" />
              </span>
            </div>
            <div class="_field-add" @click="fieldAdd(pathItem)">+</div>
          </template>
          <template v-else>
            <div class="_field"
              v-for="(field, index) in pathItem.type.fields"
              :key="index"
              :class="{selected: pathItem.selected === field.name}"
              @click="fieldSelect(pathItem, field)"
            >
              <span class="_field-name">{{field.name}}</span>
              <span class="_field-value"><!--{{field.type.display(pathItem.value[field.name])}}-->
                <component v-if="field.type" :is="field.type.component" v-model="pathItem.value[field.name]" :type="field.type" />
              </span>
              <!--
              <span class="_field-help" v-if="field.type && field.type.fields && field.type.fields.length">
                <a href="javascript:;">选择</a>
                <a href="javascript:;">新建</a>
              </span>-->
            </div>
          </template>

          <div
            class="_field-table"
            v-if="pathItem.type.isArray"
          >
            <table cellspacing="1" cellpadding="0">
              <thead>
                <tr>
                  <th v-for="(field, fieldIndex) in pathItem.type.itemType.fields" :key="fieldIndex">
                    {{field.name}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowIndex) in pathItem.value"
                  :key="rowIndex"
                >
                  <td v-for="(field, fieldIndex) in pathItem.type.itemType.fields" :key="fieldIndex">
                    <component :is="field.component || field.type.component" v-model="row[field.name]" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import {
  Type,
  TypeField,
  TypeList
} from './seed'
import objects from './db'

const TypeContainer = Type.create()
TypeContainer.name = 'Container'
TypeContainer.fields.push({
  _type: TypeField,
  name: 'types',
  type: TypeList(Type),
  default: [TypeContainer]
  // default: [Type, TypeField, TypeBoolean, TypeString, TypeNumber, TypeFunction, TypeContainer]
})

const container = TypeContainer.create()

export default {
  name: 'App',
  components: {},
  data () {
    return {
      path: [{
        name: 'Container',
        value: container,
        type: container._type
      }]
    }
  },
  methods: {
    fieldAdd (pathItem) {
      if (pathItem.type.isArray) {
        const instance = pathItem.type.itemType.create()
        instance.name = 'TypeName'
        pathItem.value.push(instance)
        objects.push(instance)
      }
    },
    fieldSelect (pathItem, field) {
      if (typeof field === 'number') {
        for (var i = 0; i < this.path.length; i++) {
          if (this.path[i] === pathItem) {
            const value = pathItem.value[field]
            if (typeof value === 'object') {
              this.$set(this.path, i + 1, {
                value,
                type: value._type
              })
              pathItem.selected = field
              this.path.splice(i + 2)
            }
            break
          }
        }
      } else {
        for (i = 0; i < this.path.length; i++) {
          if (this.path[i] === pathItem) {
            const value = pathItem.value[field.name]
            if (typeof value === 'object') {
              this.$set(this.path, i + 1, {
                value,
                type: field.type
              })
              pathItem.selected = field.name
              this.path.splice(i + 2)
            }
            break
          }
        }
      }
    }
  },
  created () {
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #000;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
._tree {
  display: flex;
  height: 100%;
}
._col {
  min-width: 200px;
  background-color: #FFF;
  margin: 10px;
  position: relative;
}
h5 {
  text-align: center;
  padding: 10px;
}
._field {
  border-top: solid 1px #F0F0F0;
  padding: 10px;
  font-size: 13px;
  display: flex;
}
._field-name {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}
._field-value {
  flex: 1;
}
._field.selected {
  background-color: #F4F4F4;
}
._field:hover {
  background-color: #F4F4F4;
}
._field-add {
  border: solid 1px #F0F0F0;
  padding: 5px;
  text-align: center;
}

._field-table {
  position: absolute;
  left: 0;
  background-color: #999;
  top: 100%;
}
._field-table td, ._field-table th {
  background-color: #FFF;
  padding: 5px;
}

</style>
