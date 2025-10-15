/**
 * Sistema de Módulos Inteligente para Stack Extensão
 * Suporte a importação automática, namespaces e hot-reload
 */

const fs = require('fs')
const path = require('path')

class ModuleSystem {
  constructor() {
    this.modules = new Map()
    this.cache = new Map()
    this.dependencies = new Map()
    this.namespaces = new Map()
    this.hotReload = new Map()
    this.watchers = new Map()
    this.importPaths = ['.', './src', './lib', './modules']
  }

  // Importar módulo
  async import(modulePath, options = {}) {
    const resolvedPath = this.resolveModule(modulePath)
    
    // Verificar cache
    if (this.cache.has(resolvedPath) && !options.force) {
      return this.cache.get(resolvedPath)
    }

    // Verificar se módulo já está carregado
    if (this.modules.has(resolvedPath)) {
      return this.modules.get(resolvedPath)
    }

    try {
      const module = await this.loadModule(resolvedPath, options)
      
      // Cache do módulo
      this.cache.set(resolvedPath, module)
      this.modules.set(resolvedPath, module)
      
      // Configurar hot-reload se habilitado
      if (options.hotReload !== false) {
        this.setupHotReload(resolvedPath)
      }
      
      return module
    } catch (error) {
      throw new Error(`Erro ao importar módulo '${modulePath}': ${error.message}`)
    }
  }

  // Resolver caminho do módulo
  resolveModule(modulePath) {
    // Verificar se é um módulo npm
    if (!modulePath.startsWith('.') && !modulePath.startsWith('/')) {
      return this.resolveNpmModule(modulePath)
    }

    // Verificar se é um caminho absoluto
    if (path.isAbsolute(modulePath)) {
      return this.resolveAbsolutePath(modulePath)
    }

    // Resolver caminho relativo
    return this.resolveRelativePath(modulePath)
  }

  resolveNpmModule(modulePath) {
    try {
      return require.resolve(modulePath)
    } catch (error) {
      throw new Error(`Módulo npm '${modulePath}' não encontrado`)
    }
  }

  resolveAbsolutePath(modulePath) {
    if (fs.existsSync(modulePath)) {
      return modulePath
    }
    
    // Tentar com extensões
    for (const ext of ['.stk', '.js', '.ts', '.py']) {
      const fullPath = modulePath + ext
      if (fs.existsSync(fullPath)) {
        return fullPath
      }
    }
    
    throw new Error(`Módulo '${modulePath}' não encontrado`)
  }

  resolveRelativePath(modulePath) {
    const currentDir = process.cwd()
    
    for (const basePath of this.importPaths) {
      const fullPath = path.resolve(currentDir, basePath, modulePath)
      
      if (fs.existsSync(fullPath)) {
        return fullPath
      }
      
      // Tentar com extensões
      for (const ext of ['.stk', '.js', '.ts', '.py']) {
        const fullPathWithExt = fullPath + ext
        if (fs.existsSync(fullPathWithExt)) {
          return fullPathWithExt
        }
      }
    }
    
    throw new Error(`Módulo '${modulePath}' não encontrado`)
  }

  // Carregar módulo
  async loadModule(modulePath, options = {}) {
    const ext = path.extname(modulePath)
    
    switch (ext) {
      case '.stk':
        return await this.loadStackModule(modulePath, options)
      case '.js':
        return await this.loadJavaScriptModule(modulePath, options)
      case '.ts':
        return await this.loadTypeScriptModule(modulePath, options)
      case '.py':
        return await this.loadPythonModule(modulePath, options)
      default:
        throw new Error(`Extensão de arquivo não suportada: ${ext}`)
    }
  }

  // Carregar módulo .stk
  async loadStackModule(modulePath, options) {
    const content = fs.readFileSync(modulePath, 'utf8')
    
    // Parse do módulo
    const ast = this.parseModule(content)
    
    // Analisar dependências
    const dependencies = this.analyzeDependencies(ast)
    this.dependencies.set(modulePath, dependencies)
    
    // Carregar dependências
    for (const dep of dependencies) {
      await this.import(dep, options)
    }
    
    // Criar namespace
    const namespace = this.createNamespace(modulePath, ast)
    
    return {
      path: modulePath,
      content,
      ast,
      namespace,
      dependencies,
      exports: namespace.exports,
      type: 'stack'
    }
  }

  // Carregar módulo JavaScript
  async loadJavaScriptModule(modulePath, options) {
    try {
      // Limpar cache do require se necessário
      if (options.force) {
        delete require.cache[require.resolve(modulePath)]
      }
      
      const module = require(modulePath)
      
      return {
        path: modulePath,
        exports: module,
        type: 'javascript'
      }
    } catch (error) {
      throw new Error(`Erro ao carregar módulo JavaScript: ${error.message}`)
    }
  }

  // Carregar módulo TypeScript
  async loadTypeScriptModule(modulePath, options) {
    // Para TypeScript, precisaríamos de um transpilador
    // Por enquanto, tratar como JavaScript
    return await this.loadJavaScriptModule(modulePath, options)
  }

  // Carregar módulo Python
  async loadPythonModule(modulePath, options) {
    // Para Python, precisaríamos de um bridge
    // Por enquanto, retornar estrutura básica
    return {
      path: modulePath,
      exports: {},
      type: 'python',
      note: 'Módulos Python precisam de bridge para funcionar'
    }
  }

  // Parse de módulo .stk
  parseModule(content) {
    // Usar o parser que criamos anteriormente
    const Tokenizer = require('../lexer/tokenizer')
    const Parser = require('../parser/parser')
    
    const tokenizer = new Tokenizer()
    const tokens = tokenizer.tokenize(content)
    
    const parser = new Parser(tokens)
    return parser.parse()
  }

  // Analisar dependências do módulo
  analyzeDependencies(ast) {
    const dependencies = new Set()
    
    const analyzeNode = (node) => {
      if (!node) return
      
      if (node.type === 'ImportDeclaration') {
        dependencies.add(node.source.value)
      }
      
      // Analisar filhos recursivamente
      for (const key in node) {
        if (typeof node[key] === 'object' && node[key] !== null) {
          if (Array.isArray(node[key])) {
            node[key].forEach(analyzeNode)
          } else {
            analyzeNode(node[key])
          }
        }
      }
    }
    
    ast.forEach(analyzeNode)
    return Array.from(dependencies)
  }

  // Criar namespace para o módulo
  createNamespace(modulePath, ast) {
    const namespace = {
      name: path.basename(modulePath, path.extname(modulePath)),
      path: modulePath,
      exports: {},
      imports: {},
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      components: new Map()
    }
    
    // Processar AST para extrair exports
    this.processExports(ast, namespace)
    
    // Registrar namespace
    this.namespaces.set(namespace.name, namespace)
    
    return namespace
  }

  // Processar exports do módulo
  processExports(ast, namespace) {
    const processNode = (node) => {
      if (!node) return
      
      switch (node.type) {
        case 'FunctionDeclaration':
          namespace.functions.set(node.name, node)
          if (node.exported) {
            namespace.exports[node.name] = node
          }
          break
          
        case 'ClassDeclaration':
          namespace.classes.set(node.name, node)
          if (node.exported) {
            namespace.exports[node.name] = node
          }
          break
          
        case 'ComponentDeclaration':
          namespace.components.set(node.name, node)
          if (node.exported) {
            namespace.exports[node.name] = node
          }
          break
          
        case 'VarDeclaration':
          namespace.variables.set(node.name, node)
          if (node.exported) {
            namespace.exports[node.name] = node
          }
          break
          
        case 'ExportDeclaration':
          if (node.declaration) {
            processNode(node.declaration)
            node.declaration.exported = true
          }
          break
      }
      
      // Processar filhos recursivamente
      for (const key in node) {
        if (typeof node[key] === 'object' && node[key] !== null) {
          if (Array.isArray(node[key])) {
            node[key].forEach(processNode)
          } else {
            processNode(node[key])
          }
        }
      }
    }
    
    ast.forEach(processNode)
  }

  // Configurar hot-reload
  setupHotReload(modulePath) {
    if (this.hotReload.has(modulePath)) {
      return
    }
    
    const watcher = fs.watchFile(modulePath, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        this.reloadModule(modulePath)
      }
    })
    
    this.hotReload.set(modulePath, watcher)
  }

  // Recarregar módulo
  async reloadModule(modulePath) {
    console.log(`Recarregando módulo: ${modulePath}`)
    
    // Limpar cache
    this.cache.delete(modulePath)
    this.modules.delete(modulePath)
    
    // Recarregar dependências
    const dependencies = this.dependencies.get(modulePath) || []
    for (const dep of dependencies) {
      await this.reloadModule(dep)
    }
    
    // Recarregar módulo
    try {
      const module = await this.import(modulePath, { force: true })
      
      // Notificar listeners de hot-reload
      this.notifyHotReload(modulePath, module)
      
      return module
    } catch (error) {
      console.error(`Erro ao recarregar módulo ${modulePath}:`, error)
    }
  }

  // Notificar hot-reload
  notifyHotReload(modulePath, module) {
    // Implementar sistema de notificação
    console.log(`Módulo ${modulePath} recarregado com sucesso`)
  }

  // Exportar módulo
  export(modulePath, exports) {
    if (this.modules.has(modulePath)) {
      const module = this.modules.get(modulePath)
      module.exports = { ...module.exports, ...exports }
    }
  }

  // Obter módulo
  getModule(modulePath) {
    return this.modules.get(modulePath)
  }

  // Listar módulos carregados
  listModules() {
    return Array.from(this.modules.keys())
  }

  // Limpar cache
  clearCache() {
    this.cache.clear()
    this.modules.clear()
    this.dependencies.clear()
  }

  // Adicionar caminho de importação
  addImportPath(path) {
    if (!this.importPaths.includes(path)) {
      this.importPaths.push(path)
    }
  }

  // Remover caminho de importação
  removeImportPath(path) {
    const index = this.importPaths.indexOf(path)
    if (index > -1) {
      this.importPaths.splice(index, 1)
    }
  }

  // Obter dependências de um módulo
  getDependencies(modulePath) {
    return this.dependencies.get(modulePath) || []
  }

  // Verificar se módulo está carregado
  isLoaded(modulePath) {
    return this.modules.has(modulePath)
  }

  // Obter estatísticas do sistema de módulos
  getStats() {
    return {
      loadedModules: this.modules.size,
      cachedModules: this.cache.size,
      namespaces: this.namespaces.size,
      hotReloadEnabled: this.hotReload.size,
      importPaths: this.importPaths
    }
  }
}

module.exports = ModuleSystem