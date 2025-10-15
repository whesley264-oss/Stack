/**
 * Sistema de Plugins e Extensões para Stack Extensão
 * Permite estender a linguagem com funcionalidades personalizadas
 */

class PluginSystem {
  constructor() {
    this.plugins = new Map()
    this.extensions = new Map()
    this.hooks = new Map()
    this.middleware = new Map()
    this.commands = new Map()
    this.keywords = new Map()
    this.operators = new Map()
    this.functions = new Map()
    this.types = new Map()
    this.loadedPlugins = new Set()
    this.pluginConfig = new Map()
    this.dependencies = new Map()
    this.version = '1.0.0'
  }

  // Registrar plugin
  registerPlugin(name, plugin, options = {}) {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' já está registrado`)
    }

    const pluginData = {
      name,
      version: plugin.version || '1.0.0',
      description: plugin.description || '',
      author: plugin.author || 'Unknown',
      license: plugin.license || 'MIT',
      dependencies: plugin.dependencies || [],
      keywords: plugin.keywords || [],
      // Funcionalidades
      hooks: plugin.hooks || {},
      middleware: plugin.middleware || [],
      commands: plugin.commands || {},
      keywords: plugin.keywords || {},
      operators: plugin.operators || {},
      functions: plugin.functions || {},
      types: plugin.types || {},
      // Configuração
      config: plugin.config || {},
      options: options,
      // Estado
      loaded: false,
      enabled: true,
      errors: [],
      stats: {
        loadTime: 0,
        calls: 0,
        errors: 0
      }
    }

    this.plugins.set(name, pluginData)
    this.pluginConfig.set(name, pluginData.config)
    
    return pluginData
  }

  // Carregar plugin
  async loadPlugin(name, options = {}) {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin '${name}' não encontrado`)
    }

    if (plugin.loaded) {
      console.warn(`Plugin '${name}' já está carregado`)
      return plugin
    }

    const startTime = Date.now()

    try {
      // Verificar dependências
      await this.checkDependencies(plugin.dependencies)

      // Carregar hooks
      for (const [hookName, hookFunc] of Object.entries(plugin.hooks)) {
        this.registerHook(hookName, hookFunc, name)
      }

      // Carregar middleware
      for (const middleware of plugin.middleware) {
        this.registerMiddleware(name, middleware)
      }

      // Carregar comandos
      for (const [commandName, commandFunc] of Object.entries(plugin.commands)) {
        this.registerCommand(commandName, commandFunc, name)
      }

      // Carregar palavras-chave
      for (const [keyword, definition] of Object.entries(plugin.keywords)) {
        this.registerKeyword(keyword, definition, name)
      }

      // Carregar operadores
      for (const [operator, definition] of Object.entries(plugin.operators)) {
        this.registerOperator(operator, definition, name)
      }

      // Carregar funções
      for (const [funcName, funcDef] of Object.entries(plugin.functions)) {
        this.registerFunction(funcName, funcDef, name)
      }

      // Carregar tipos
      for (const [typeName, typeDef] of Object.entries(plugin.types)) {
        this.registerType(typeName, typeDef, name)
      }

      // Executar hook de inicialização
      if (plugin.hooks.init) {
        await plugin.hooks.init(options)
      }

      plugin.loaded = true
      plugin.stats.loadTime = Date.now() - startTime
      this.loadedPlugins.add(name)

      console.log(`✅ Plugin '${name}' carregado com sucesso`)
      return plugin

    } catch (error) {
      plugin.errors.push(error.message)
      plugin.stats.errors++
      console.error(`❌ Erro ao carregar plugin '${name}':`, error.message)
      throw error
    }
  }

  // Descarregar plugin
  async unloadPlugin(name) {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin '${name}' não encontrado`)
    }

    if (!plugin.loaded) {
      console.warn(`Plugin '${name}' não está carregado`)
      return
    }

    try {
      // Executar hook de limpeza
      if (plugin.hooks.cleanup) {
        await plugin.hooks.cleanup()
      }

      // Remover hooks
      this.removeHooksByPlugin(name)

      // Remover middleware
      this.removeMiddlewareByPlugin(name)

      // Remover comandos
      this.removeCommandsByPlugin(name)

      // Remover palavras-chave
      this.removeKeywordsByPlugin(name)

      // Remover operadores
      this.removeOperatorsByPlugin(name)

      // Remover funções
      this.removeFunctionsByPlugin(name)

      // Remover tipos
      this.removeTypesByPlugin(name)

      plugin.loaded = false
      this.loadedPlugins.delete(name)

      console.log(`✅ Plugin '${name}' descarregado com sucesso`)

    } catch (error) {
      plugin.errors.push(error.message)
      plugin.stats.errors++
      console.error(`❌ Erro ao descarregar plugin '${name}':`, error.message)
      throw error
    }
  }

  // Verificar dependências
  async checkDependencies(dependencies) {
    for (const dep of dependencies) {
      if (!this.loadedPlugins.has(dep)) {
        throw new Error(`Dependência '${dep}' não está carregada`)
      }
    }
  }

  // Registrar hook
  registerHook(name, func, pluginName) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, [])
    }
    
    this.hooks.get(name).push({
      func,
      plugin: pluginName
    })
  }

  // Executar hook
  async executeHook(name, ...args) {
    const hooks = this.hooks.get(name)
    if (!hooks) return

    for (const hook of hooks) {
      try {
        await hook.func(...args)
        hook.plugin && this.plugins.get(hook.plugin)?.stats.calls++
      } catch (error) {
        console.error(`Erro no hook '${name}':`, error.message)
        hook.plugin && this.plugins.get(hook.plugin)?.stats.errors++
      }
    }
  }

  // Remover hooks por plugin
  removeHooksByPlugin(pluginName) {
    for (const [hookName, hooks] of this.hooks) {
      const filtered = hooks.filter(hook => hook.plugin !== pluginName)
      this.hooks.set(hookName, filtered)
    }
  }

  // Registrar middleware
  registerMiddleware(pluginName, middleware) {
    if (!this.middleware.has(pluginName)) {
      this.middleware.set(pluginName, [])
    }
    
    this.middleware.get(pluginName).push(middleware)
  }

  // Executar middleware
  async executeMiddleware(input, context = {}) {
    let result = input

    for (const [pluginName, middlewares] of this.middleware) {
      for (const middleware of middlewares) {
        try {
          result = await middleware(result, context)
        } catch (error) {
          console.error(`Erro no middleware do plugin '${pluginName}':`, error.message)
        }
      }
    }

    return result
  }

  // Remover middleware por plugin
  removeMiddlewareByPlugin(pluginName) {
    this.middleware.delete(pluginName)
  }

  // Registrar comando
  registerCommand(name, func, pluginName) {
    this.commands.set(name, {
      func,
      plugin: pluginName
    })
  }

  // Executar comando
  async executeCommand(name, ...args) {
    const command = this.commands.get(name)
    if (!command) {
      throw new Error(`Comando '${name}' não encontrado`)
    }

    try {
      const result = await command.func(...args)
      command.plugin && this.plugins.get(command.plugin)?.stats.calls++
      return result
    } catch (error) {
      command.plugin && this.plugins.get(command.plugin)?.stats.errors++
      throw error
    }
  }

  // Remover comandos por plugin
  removeCommandsByPlugin(pluginName) {
    for (const [commandName, command] of this.commands) {
      if (command.plugin === pluginName) {
        this.commands.delete(commandName)
      }
    }
  }

  // Registrar palavra-chave
  registerKeyword(keyword, definition, pluginName) {
    this.keywords.set(keyword, {
      ...definition,
      plugin: pluginName
    })
  }

  // Obter palavra-chave
  getKeyword(keyword) {
    return this.keywords.get(keyword)
  }

  // Remover palavras-chave por plugin
  removeKeywordsByPlugin(pluginName) {
    for (const [keyword, definition] of this.keywords) {
      if (definition.plugin === pluginName) {
        this.keywords.delete(keyword)
      }
    }
  }

  // Registrar operador
  registerOperator(operator, definition, pluginName) {
    this.operators.set(operator, {
      ...definition,
      plugin: pluginName
    })
  }

  // Obter operador
  getOperator(operator) {
    return this.operators.get(operator)
  }

  // Remover operadores por plugin
  removeOperatorsByPlugin(pluginName) {
    for (const [operator, definition] of this.operators) {
      if (definition.plugin === pluginName) {
        this.operators.delete(operator)
      }
    }
  }

  // Registrar função
  registerFunction(name, definition, pluginName) {
    this.functions.set(name, {
      ...definition,
      plugin: pluginName
    })
  }

  // Obter função
  getFunction(name) {
    return this.functions.get(name)
  }

  // Executar função
  async executeFunction(name, ...args) {
    const func = this.functions.get(name)
    if (!func) {
      throw new Error(`Função '${name}' não encontrada`)
    }

    try {
      const result = await func.func(...args)
      func.plugin && this.plugins.get(func.plugin)?.stats.calls++
      return result
    } catch (error) {
      func.plugin && this.plugins.get(func.plugin)?.stats.errors++
      throw error
    }
  }

  // Remover funções por plugin
  removeFunctionsByPlugin(pluginName) {
    for (const [funcName, func] of this.functions) {
      if (func.plugin === pluginName) {
        this.functions.delete(funcName)
      }
    }
  }

  // Registrar tipo
  registerType(name, definition, pluginName) {
    this.types.set(name, {
      ...definition,
      plugin: pluginName
    })
  }

  // Obter tipo
  getType(name) {
    return this.types.get(name)
  }

  // Remover tipos por plugin
  removeTypesByPlugin(pluginName) {
    for (const [typeName, type] of this.types) {
      if (type.plugin === pluginName) {
        this.types.delete(typeName)
      }
    }
  }

  // Listar plugins
  listPlugins() {
    return Array.from(this.plugins.keys())
  }

  // Listar plugins carregados
  listLoadedPlugins() {
    return Array.from(this.loadedPlugins)
  }

  // Obter informações do plugin
  getPluginInfo(name) {
    return this.plugins.get(name)
  }

  // Habilitar/desabilitar plugin
  togglePlugin(name, enabled) {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin '${name}' não encontrado`)
    }

    plugin.enabled = enabled
    return plugin
  }

  // Obter configuração do plugin
  getPluginConfig(name) {
    return this.pluginConfig.get(name)
  }

  // Atualizar configuração do plugin
  updatePluginConfig(name, config) {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin '${name}' não encontrado`)
    }

    plugin.config = { ...plugin.config, ...config }
    this.pluginConfig.set(name, plugin.config)
    
    return plugin.config
  }

  // Obter estatísticas
  getStats() {
    const stats = {
      totalPlugins: this.plugins.size,
      loadedPlugins: this.loadedPlugins.size,
      totalHooks: this.hooks.size,
      totalMiddleware: this.middleware.size,
      totalCommands: this.commands.size,
      totalKeywords: this.keywords.size,
      totalOperators: this.operators.size,
      totalFunctions: this.functions.size,
      totalTypes: this.types.size
    }

    // Adicionar estatísticas por plugin
    stats.plugins = {}
    for (const [name, plugin] of this.plugins) {
      stats.plugins[name] = {
        loaded: plugin.loaded,
        enabled: plugin.enabled,
        errors: plugin.errors.length,
        stats: plugin.stats
      }
    }

    return stats
  }

  // Limpar todos os plugins
  clearAll() {
    this.plugins.clear()
    this.extensions.clear()
    this.hooks.clear()
    this.middleware.clear()
    this.commands.clear()
    this.keywords.clear()
    this.operators.clear()
    this.functions.clear()
    this.types.clear()
    this.loadedPlugins.clear()
    this.pluginConfig.clear()
    this.dependencies.clear()
  }

  // Validar plugin
  validatePlugin(plugin) {
    const errors = []

    if (!plugin.name) {
      errors.push('Plugin deve ter um nome')
    }

    if (!plugin.version) {
      errors.push('Plugin deve ter uma versão')
    }

    if (!plugin.description) {
      errors.push('Plugin deve ter uma descrição')
    }

    if (plugin.dependencies && !Array.isArray(plugin.dependencies)) {
      errors.push('Dependências devem ser um array')
    }

    if (plugin.hooks && typeof plugin.hooks !== 'object') {
      errors.push('Hooks devem ser um objeto')
    }

    if (plugin.middleware && !Array.isArray(plugin.middleware)) {
      errors.push('Middleware deve ser um array')
    }

    if (plugin.commands && typeof plugin.commands !== 'object') {
      errors.push('Comandos devem ser um objeto')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Instalar plugin do repositório
  async installPlugin(repository, options = {}) {
    try {
      // Simular download do plugin
      console.log(`📦 Instalando plugin de ${repository}...`)
      
      // Aqui seria feita a instalação real
      // const plugin = await this.downloadPlugin(repository)
      
      // Por enquanto, retornar plugin de exemplo
      const plugin = {
        name: 'example-plugin',
        version: '1.0.0',
        description: 'Plugin de exemplo',
        author: 'Stack Extensão Team',
        license: 'MIT',
        dependencies: [],
        hooks: {},
        middleware: [],
        commands: {},
        keywords: {},
        operators: {},
        functions: {},
        types: {}
      }

      this.registerPlugin(plugin.name, plugin, options)
      await this.loadPlugin(plugin.name, options)

      console.log(`✅ Plugin instalado com sucesso`)
      return plugin

    } catch (error) {
      console.error(`❌ Erro ao instalar plugin:`, error.message)
      throw error
    }
  }

  // Desinstalar plugin
  async uninstallPlugin(name) {
    try {
      if (this.loadedPlugins.has(name)) {
        await this.unloadPlugin(name)
      }

      this.plugins.delete(name)
      this.pluginConfig.delete(name)

      console.log(`✅ Plugin '${name}' desinstalado com sucesso`)

    } catch (error) {
      console.error(`❌ Erro ao desinstalar plugin:`, error.message)
      throw error
    }
  }
}

module.exports = PluginSystem