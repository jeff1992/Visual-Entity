<template>
  <div id="app">
    <div class="_container">
      <div class="_tree">
        <div class="_col" v-for="(pathItem, pathIndex) in path" :key="pathIndex">
          <h5>{{pathItem.name}}</h5>
          <template v-if="pathItem.type.isArray">
            <div class="_field"
              v-for="(item, index) in pathItem.type.value"
              :key="index"
              :class="{selected: pathItem.selected === field.name}"
              @click="fieldSelect(pathItem, field)"
            >
              <span class="_field-name">{{field.name}}</span>
              <span class="_field-value">{{getFieldValue(pathItem.value[field.name])}}</span>
            </div>
          </template>
          <template v-else>
            <div class="_field"
              v-for="(field, fieldIndex) in pathItem.type.fields"
              :key="fieldIndex"
              :class="{selected: pathItem.selected === field.name}"
              @click="fieldSelect(pathItem, field)"
            >
              <span class="_field-name">{{field.name}}</span>
              <span class="_field-value">{{getFieldValue(pathItem.value[field.name])}}</span>
            </div>
          </template>
          <div class="_field-add" v-if="Array.isArray(pathItem.value)" @click="fieldAdd(pathItem.value)">+</div>
          <div
            class="_field-table"
            v-if="Array.isArray(pathItem.value) && pathItem.value.length"
          >
            <table cellspacing="1" cellpadding="0">
              <thead>
                <tr>
                  <th v-for="(field, fieldKey, fieldIndex) in pathItem.value[0]" :key="fieldIndex">
                    {{fieldKey}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowIndex) in pathItem.value"
                  :key="rowIndex"
                >
                  <td v-for="(field, fieldKey, fieldIndex) in pathItem.value[0]" :key="fieldIndex">
                    {{getFieldValue(row[fieldKey])}}
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
import HelloWorld from './components/HelloWorld'

const Field = {
  _type: 'Type',
  name: 'Field',
  fields: [{
    _type: 'Field',
    name: 'name',
    isArray: false
  }, {
    _type: 'Field',
    name: 'isArray',
    isArray: false
  }]
}

const Type = {
  _type: 'Type',
  name: 'Type',
  fields: [{
    _type: Field,
    name: 'fields',
    isArray: true
  }]
}

const Container = {
  _type: Type,
  name: 'Container',
  fields: [{
    _type: Type,
    name: 'types',
    isArray: true
  }]
}

Field._type = Type
Field.fields[0]._type = Field
Field.fields[1]._type = Field
Type._type = Type

const CreateInstance = function (type) {
  const instance = {
    _type: type
  }
  type.fields.forEach(f => {
    if (f.isArray) {
      instance[f.name] = []
    } else {
      instance[f.name] = null
    }
  })
  return instance
}

const container = CreateInstance(Container)
container.types.push(Type)
container.types.push(Container)

export default {
  name: 'App',
  components: {
    HelloWorld
  },
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
    fieldAdd (obj) {
      if (Array.isArray(obj)) {
        obj.push({})
      } else if (typeof obj === 'object') {
        this.$set(obj, 'unknow', '')
      }
    },
    fieldSelect (pathItem, field) {
      for (var i = 0; i < this.path.length; i++) {
        if (this.path[i] === pathItem) {
          const value = pathItem.value[field.name]
          if (typeof value === 'object') {
            this.$set(this.path, i + 1, {
              name: field.name,
              value,
              selected: '',
              type: field._type
            })
            pathItem.selected = field.name
            this.path.splice(i + 2)
          }
          break
        }
      }
    },
    getFieldValue (obj) {
      if (Array.isArray(obj)) {
        return '(×' + obj.length + ')'
      }
      if (typeof obj === 'object') {
        if (obj._type === Type) {
          return `<${obj.name}>`
        }
        if (obj._type === Field) {
          return '<Field>'
        }
        return 'object'
      }
      return obj
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
}
._field {
  border-top: solid 1px #F0F0F0;
  padding: 10px;
  font-size: 13px;
}
._field-name {
  display: inline-block;
  width: 50px;
  font-weight: bold;
}
._field.selected {
  background-color: #F4F4F4;
}
._field:hover {
  background-color: #F4F4F4;
}
._field-add {
  border: solid 1px #F0F0F0;
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
