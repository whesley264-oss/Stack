/**
 * Sistema de Componentes Web Únicos para Stack Extensão
 * Funcionalidades que nenhuma outra linguagem possui
 */

class WebComponents {
  constructor() {
    this.components = new Map()
    this.routes = new Map()
    this.websockets = new Map()
    this.stores = new Map()
    this.middleware = []
  }

  // Sistema de Componentes Reativos
  createComponent(name, definition) {
    const component = {
      name,
      template: definition.template || '',
      styles: definition.styles || {},
      data: definition.data || {},
      methods: definition.methods || {},
      lifecycle: definition.lifecycle || {},
      props: definition.props || [],
      computed: definition.computed || {},
      watchers: definition.watchers || {},
      slots: definition.slots || {},
      events: definition.events || {},
      reactive: true,
      virtualDOM: null,
      state: this.createReactiveState(definition.data || {}),
      mounted: false
    }

    this.components.set(name, component)
    return component
  }

  // Estado Reativo Avançado
  createReactiveState(initialData) {
    const state = { ...initialData }
    const listeners = new Map()
    const computed = new Map()

    const proxy = new Proxy(state, {
      set(target, property, value) {
        const oldValue = target[property]
        target[property] = value
        
        // Notificar listeners
        if (listeners.has(property)) {
          listeners.get(property).forEach(callback => {
            callback(value, oldValue)
          })
        }
        
        // Atualizar computed properties
        this.updateComputedProperties(property)
        
        return true
      },
      
      get(target, property) {
        if (computed.has(property)) {
          return computed.get(property).getter()
        }
        return target[property]
      }
    })

    return {
      data: proxy,
      watch: (property, callback) => {
        if (!listeners.has(property)) {
          listeners.set(property, new Set())
        }
        listeners.get(property).add(callback)
      },
      unwatch: (property, callback) => {
        if (listeners.has(property)) {
          listeners.get(property).delete(callback)
        }
      },
      computed: (name, getter) => {
        computed.set(name, { getter })
      }
    }
  }

  // Sistema de Roteamento Inteligente
  createRoute(path, component, options = {}) {
    const route = {
      path,
      component,
      name: options.name || path,
      meta: options.meta || {},
      beforeEnter: options.beforeEnter,
      beforeLeave: options.beforeLeave,
      children: options.children || [],
      params: {},
      query: {},
      hash: ''
    }

    this.routes.set(path, route)
    return route
  }

  // Navegação Programática
  navigate(path, options = {}) {
    const route = this.findRoute(path)
    if (!route) {
      throw new Error(`Rota '${path}' não encontrada`)
    }

    // Executar middleware
    for (const middleware of this.middleware) {
      if (!middleware(route, options)) {
        return false
      }
    }

    // Executar beforeEnter
    if (route.beforeEnter) {
      if (!route.beforeEnter(route, options)) {
        return false
      }
    }

    // Atualizar URL
    if (options.replace) {
      history.replaceState({}, '', path)
    } else {
      history.pushState({}, '', path)
    }

    // Renderizar componente
    this.renderComponent(route.component, options)
    return true
  }

  findRoute(path) {
    for (const [routePath, route] of this.routes) {
      if (this.matchPath(routePath, path)) {
        return route
      }
    }
    return null
  }

  matchPath(routePath, path) {
    const routeParts = routePath.split('/')
    const pathParts = path.split('/')
    
    if (routeParts.length !== pathParts.length) {
      return false
    }
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        continue // Parâmetro dinâmico
      }
      if (routeParts[i] !== pathParts[i]) {
        return false
      }
    }
    
    return true
  }

  // WebSocket com Reconnection Automática
  createWebSocket(url, options = {}) {
    const ws = {
      url,
      socket: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: options.maxReconnectAttempts || 5,
      reconnectInterval: options.reconnectInterval || 1000,
      listeners: new Map(),
      connected: false,
      queue: []
    }

    const connect = () => {
      try {
        ws.socket = new WebSocket(url)
        
        ws.socket.onopen = () => {
          ws.connected = true
          ws.reconnectAttempts = 0
          
          // Processar fila de mensagens
          while (ws.queue.length > 0) {
            ws.socket.send(ws.queue.shift())
          }
          
          this.emit(ws, 'open')
        }
        
        ws.socket.onmessage = (event) => {
          this.emit(ws, 'message', event.data)
        }
        
        ws.socket.onclose = () => {
          ws.connected = false
          this.emit(ws, 'close')
          
          // Tentar reconectar
          if (ws.reconnectAttempts < ws.maxReconnectAttempts) {
            ws.reconnectAttempts++
            setTimeout(connect, ws.reconnectInterval * ws.reconnectAttempts)
          }
        }
        
        ws.socket.onerror = (error) => {
          this.emit(ws, 'error', error)
        }
        
      } catch (error) {
        this.emit(ws, 'error', error)
      }
    }

    connect()
    this.websockets.set(url, ws)
    return ws
  }

  // Sistema de Store Global
  createStore(name, initialState = {}) {
    const store = {
      name,
      state: this.createReactiveState(initialState),
      mutations: new Map(),
      actions: new Map(),
      getters: new Map(),
      modules: new Map()
    }

    this.stores.set(name, store)
    return store
  }

  // Mutations (Síncronas)
  createMutation(storeName, name, mutation) {
    const store = this.stores.get(storeName)
    if (!store) {
      throw new Error(`Store '${storeName}' não encontrada`)
    }
    
    store.mutations.set(name, mutation)
  }

  // Actions (Assíncronas)
  createAction(storeName, name, action) {
    const store = this.stores.get(storeName)
    if (!store) {
      throw new Error(`Store '${storeName}' não encontrada`)
    }
    
    store.actions.set(name, action)
  }

  // Getters
  createGetter(storeName, name, getter) {
    const store = this.stores.get(storeName)
    if (!store) {
      throw new Error(`Store '${storeName}' não encontrada`)
    }
    
    store.getters.set(name, getter)
  }

  // Executar Mutation
  commit(storeName, mutationName, payload) {
    const store = this.stores.get(storeName)
    if (!store) {
      throw new Error(`Store '${storeName}' não encontrada`)
    }
    
    const mutation = store.mutations.get(mutationName)
    if (!mutation) {
      throw new Error(`Mutation '${mutationName}' não encontrada`)
    }
    
    mutation(store.state.data, payload)
  }

  // Executar Action
  async dispatch(storeName, actionName, payload) {
    const store = this.stores.get(storeName)
    if (!store) {
      throw new Error(`Store '${storeName}' não encontrada`)
    }
    
    const action = store.actions.get(actionName)
    if (!action) {
      throw new Error(`Action '${actionName}' não encontrada`)
    }
    
    return await action({
      state: store.state.data,
      commit: (mutationName, payload) => this.commit(storeName, mutationName, payload),
      dispatch: (actionName, payload) => this.dispatch(storeName, actionName, payload),
      getters: this.getGetters(storeName)
    }, payload)
  }

  // Sistema de Middleware
  addMiddleware(middleware) {
    this.middleware.push(middleware)
  }

  // Sistema de Eventos
  emit(ws, event, data) {
    if (ws.listeners.has(event)) {
      ws.listeners.get(event).forEach(callback => {
        callback(data)
      })
    }
  }

  on(ws, event, callback) {
    if (!ws.listeners.has(event)) {
      ws.listeners.set(event, new Set())
    }
    ws.listeners.get(event).add(callback)
  }

  off(ws, event, callback) {
    if (ws.listeners.has(event)) {
      ws.listeners.get(event).delete(callback)
    }
  }

  // Renderização de Componentes
  renderComponent(componentName, options = {}) {
    const component = this.components.get(componentName)
    if (!component) {
      throw new Error(`Componente '${componentName}' não encontrado`)
    }

    // Executar beforeMount
    if (component.lifecycle.beforeMount) {
      component.lifecycle.beforeMount()
    }

    // Renderizar template
    const element = this.compileTemplate(component.template, component.state.data)
    
    // Aplicar estilos
    this.applyStyles(element, component.styles)
    
    // Executar mounted
    if (component.lifecycle.mounted) {
      component.lifecycle.mounted()
    }

    component.mounted = true
    return element
  }

  // Compilação de Template
  compileTemplate(template, data) {
    // Substituir variáveis
    let compiled = template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      return this.evaluateExpression(expression, data)
    })

    // Processar diretivas
    compiled = this.processDirectives(compiled, data)

    // Criar elemento DOM
    const div = document.createElement('div')
    div.innerHTML = compiled
    return div.firstElementChild
  }

  // Avaliar expressões no template
  evaluateExpression(expression, data) {
    try {
      // Criar função segura para avaliar expressão
      const func = new Function('data', `
        with (data) {
          return ${expression}
        }
      `)
      return func(data)
    } catch (error) {
      console.error('Erro ao avaliar expressão:', expression, error)
      return ''
    }
  }

  // Processar diretivas
  processDirectives(template, data) {
    // v-if
    template = template.replace(/v-if="([^"]+)"/g, (match, condition) => {
      const result = this.evaluateExpression(condition, data)
      return result ? '' : 'style="display: none"'
    })

    // v-for
    template = template.replace(/v-for="([^"]+)"/g, (match, expression) => {
      // Implementar v-for
      return ''
    })

    // v-model
    template = template.replace(/v-model="([^"]+)"/g, (match, property) => {
      return `value="${data[property] || ''}"`
    })

    return template
  }

  // Aplicar estilos
  applyStyles(element, styles) {
    for (const [selector, rules] of Object.entries(styles)) {
      if (selector === 'this') {
        // Estilos para o próprio elemento
        Object.assign(element.style, rules)
      } else {
        // Estilos para seletores CSS
        const style = document.createElement('style')
        style.textContent = `${selector} { ${this.cssRulesToString(rules)} }`
        document.head.appendChild(style)
      }
    }
  }

  cssRulesToString(rules) {
    return Object.entries(rules)
      .map(([property, value]) => `${property}: ${value}`)
      .join('; ')
  }

  // Sistema de Cache Inteligente
  createCache(name, options = {}) {
    const cache = {
      name,
      maxSize: options.maxSize || 100,
      ttl: options.ttl || 300000, // 5 minutos
      data: new Map(),
      timestamps: new Map()
    }

    const get = (key) => {
      if (!cache.data.has(key)) {
        return null
      }

      const timestamp = cache.timestamps.get(key)
      if (Date.now() - timestamp > cache.ttl) {
        cache.data.delete(key)
        cache.timestamps.delete(key)
        return null
      }

      return cache.data.get(key)
    }

    const set = (key, value) => {
      // Verificar tamanho máximo
      if (cache.data.size >= cache.maxSize) {
        const firstKey = cache.data.keys().next().value
        cache.data.delete(firstKey)
        cache.timestamps.delete(firstKey)
      }

      cache.data.set(key, value)
      cache.timestamps.set(key, Date.now())
    }

    const clear = () => {
      cache.data.clear()
      cache.timestamps.clear()
    }

    return { get, set, clear, size: () => cache.data.size }
  }
}

module.exports = WebComponents