import * as hp from './helper-js'

/**
 * [updatablePropsEvenUnbound description]
 * @param  {[type]} props [un-circular object or getter]
 * @return {[type]}       [description]
 * props eg: {
    value: {localName: 'current'},
  }
   default localName is `localProps_${name}`
 */
export function updatablePropsEvenUnbound (props) {
  if (hp.isFunction(props)) {
    props = props()
  } else {
    props = JSON.parse(JSON.stringify(props))
  }
  const component = {
    props,
    computed: {},
    watch: {}
  }
  let propNames
  const localNames = {}
  if (hp.isArray(props)) {
    propNames = props
  } else {
    propNames = []
    for (const key in props) {
      propNames.push(key)
      if (props[key].localName) {
        localNames[key] = props[key].localName
        delete props[key].localName
      }
    }
  }
  component.data = function () {
    const t = {
      localValueOfUpdatableProps: {}
    }
    for (const name of propNames) {
      t.localValueOfUpdatableProps[name] = this[name]
    }
    return t
  }
  for (const name of propNames) {
    component.watch[name] = function (value) {
      this.localValueOfUpdatableProps[name] = value
    }
    const localName = localNames[name] || `localProps_${name}`
    component.computed[localName] = {
      get () { return this.localValueOfUpdatableProps[name] },
      set (value) {
        if (name === 'value') {
          this.$emit('input', value)
        } else {
          this.$emit(`update:${name}`, value)
        }
        this.localValueOfUpdatableProps[name] = value
      }
    }
  }
  return component
}

export function isPropTrue (value) {
  return value === '' || value
}

// the dependences in getter can't be auto resolved. must use exec to include dependences
export function watchAsync (vm, getter, handler, opt) {
  let destroies = []
  let value, oldValue
  let count = -1 // updated count
  main()
  return destroy
  function destroy () {
    destroies.forEach(f => f())
    destroies = []
  }
  function exec (getter, opt) {
    let value
    let first = true
    const unwatch = vm.$watch(() => getter.call(vm, exec), value2 => {
      value = value2
      if (first) {
        first = false
      } else {
        main()
      }
    }, { immediate: true, deep: opt && opt.deep })
    destroies.push(unwatch)
    return value
  }
  function main () {
    destroy()
    const result = getter.call(vm, exec)
    count++
    const localCount = count
    oldValue = value
    const getterExecuted = (value) => {
      if (localCount !== count) {
        // expired
        return
      }
      if (localCount === 0) {
        if (opt && opt.immediate) {
          handler.call(vm, value, oldValue)
        }
      } else {
        handler.call(vm, value, oldValue)
      }
    }
    //
    if (hp.isPromise(result)) {
      result.then(getterExecuted)
    } else {
      getterExecuted(result)
    }
  }
}
// do handler first, handler return getter
export function doWatch (vm, handler) {
  let oldValue, unwatch
  const update = () => {
    const getter = handler.call(vm, oldValue)
    unwatch = vm.$watch(getter, (value) => {
      unwatch()
      oldValue = value
      update()
    })
  }
  update()
  return () => unwatch && unwatch()
}

export function * iterateObjectWithoutDollarDash (obj) {
  for (const key in obj) {
    const start = key.substr(0, 1)
    if (start !== '$' && start !== '_') {
      yield { key, value: obj[key] }
    }
  }
}

// add reactive `windowSize`
export const windowSize = {
  data () {
    return {
      windowSize: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      }
    }
  },
  methods: {
    updateWindowSize () {
      Object.assign(this.windowSize, {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      })
    }
  },
  created () {
    this._windowSize_onresize = () => {
      this.updateWindowSize()
      this.$emit('window-resize')
    }
    hp.onDOM(window, 'resize', this._windowSize_onresize)
  },
  beforeDestroy () {
    hp.offDOM(window, 'resize', this._windowSize_onresize)
  }
}
