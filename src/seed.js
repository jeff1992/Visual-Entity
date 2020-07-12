import components from './components'
import objects from './db'

const TypeField = { name: 'Field' }
const Type = {}
const TypeString = {}
const TypeNumber = {}
const TypeFunction = {}
const TypeBoolean = {}
const TypeComponent = {}

const TypeList = function (type) {
  const instance = Type.create()
  instance.name = `List<${type.name}>`
  instance.isArray = true
  instance.itemType = type
  instance.component = components.TypeList
  return instance
}

const create = function () {
  if (this.isArray) {
    return []
  } else {
    const instance = {
      _type: this
    }
    if (this.fields) {
      this.fields.forEach(f => {
        instance[f.name] = (typeof f.default === 'function' && f.type !== TypeFunction) ? f.default() : f.default
      })
    }
    return instance
  }
}

for (var k in components) {
  components[k]._type = TypeComponent
}

Type._type = Type
Type.name = 'Type'
Type.isArray = false
Type.create = create
Type.component = components.Type
// Type.component = components.Default
Type.fields = [{
  _type: TypeField,
  type: TypeString,
  name: 'name',
  default: 'typeName'
}, {
  _type: TypeField,
  type: TypeBoolean,
  name: 'isArray',
  default: false
}, {
  _type: TypeField,
  type: TypeList(TypeField),
  name: 'fields',
  default: () => []
}, {
  _type: TypeField,
  name: 'create',
  type: TypeFunction,
  default: create
}, {
  _type: TypeField,
  name: 'component',
  type: TypeComponent,
  default: components.Default
}]

Object.assign(TypeField, Type.create())
TypeField.name = 'Field'
TypeField.fields.push({
  _type: TypeField,
  name: 'name',
  type: TypeString,
  default: 'fieldName'
})
TypeField.fields.push({
  _type: TypeField,
  name: 'type',
  type: Type,
  default: undefined
})
TypeField.component = components.TypeField

Object.assign(TypeBoolean, Type.create())
TypeBoolean.name = 'Boolean'
TypeBoolean.component = components.TypeBoolean

Object.assign(TypeNumber, Type.create())
TypeNumber.name = 'Number'
TypeNumber.component = components.TypeNumber

Object.assign(TypeString, Type.create())
TypeString.name = 'String'
TypeString.component = components.TypeString

Object.assign(TypeFunction, Type.create())
TypeFunction.name = 'Function'
TypeFunction.component = components.TypeFunction

Object.assign(TypeComponent, Type.create())
TypeComponent.name = 'Component'

objects.push(Type, TypeField, TypeString, TypeBoolean, TypeNumber, TypeFunction)

export {
  Type,
  TypeField,
  TypeList,
  TypeString,
  TypeBoolean,
  TypeNumber,
  TypeFunction,
  TypeComponent
}
