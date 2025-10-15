/**
 * Stack Extensão - Linguagem de Programação
 * Ponto de entrada principal
 */

const Tokenizer = require('./lexer/tokenizer')
const Parser = require('./parser/parser')
const Transpiler = require('./transpiler/transpiler')
const ModuleSystem = require('./modules/moduleSystem')
const MathOperators = require('./math/operators')
const WebComponents = require('./web/components')
const fs = require('fs')
const path = require('path')

class StackExtension {
  constructor() {
    this.tokenizer = new Tokenizer()
    this.parser = new Parser([])
    this.transpiler = new Transpiler()
    this.moduleSystem = new ModuleSystem()
    this.mathOperators = new MathOperators()
    this.webComponents = new WebComponents()
    
    this.version = '1.0.0'
    this.runtime = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      components: new Map()
    }
  }

  // Compilar arquivo .stk
  async compile(filePath, options = {}) {
    try {
      console.log(`Compilando arquivo: ${filePath}`)
      
      // Ler arquivo
      const content = fs.readFileSync(filePath, 'utf8')
      
      // Tokenizar
      const tokens = this.tokenizer.tokenize(content)
      console.log(`Tokens gerados: ${tokens.length}`)
      
      // Parse
      this.parser = new Parser(tokens)
      const ast = this.parser.parse()
      console.log(`AST gerado com ${ast.length} declarações`)
      
      // Transpilar
      const result = this.transpiler.transpile(ast, options.target || 'javascript', options)
      
      // Salvar arquivo compilado
      const outputPath = options.output || this.getOutputPath(filePath, options.target)
      fs.writeFileSync(outputPath, result.code)
      
      console.log(`Arquivo compilado salvo em: ${outputPath}`)
      
      return {
        success: true,
        outputPath,
        ast,
        code: result.code,
        sourceMap: result.sourceMap
      }
      
    } catch (error) {
      console.error('Erro na compilação:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Executar arquivo .stk
  async run(filePath, options = {}) {
    try {
      console.log(`Executando arquivo: ${filePath}`)
      
      // Compilar primeiro
      const compileResult = await this.compile(filePath, {
        ...options,
        target: 'javascript'
      })
      
      if (!compileResult.success) {
        throw new Error(compileResult.error)
      }
      
      // Executar código JavaScript gerado
      const vm = require('vm')
      const context = this.createExecutionContext()
      
      const script = new vm.Script(compileResult.code)
      const result = script.runInNewContext(context)
      
      console.log('Execução concluída com sucesso')
      return {
        success: true,
        result
      }
      
    } catch (error) {
      console.error('Erro na execução:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Modo desenvolvimento com hot-reload
  async dev(filePath, options = {}) {
    console.log(`Modo desenvolvimento iniciado para: ${filePath}`)
    
    // Compilar inicial
    await this.compile(filePath, options)
    
    // Configurar watcher
    const chokidar = require('chokidar')
    const watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: true
    })
    
    watcher.on('change', async () => {
      console.log('Arquivo alterado, recompilando...')
      await this.compile(filePath, options)
    })
    
    console.log('Modo desenvolvimento ativo. Pressione Ctrl+C para sair.')
  }

  // Criar contexto de execução
  createExecutionContext() {
    const context = {
      console,
      require,
      module,
      exports,
      __dirname: process.cwd(),
      __filename: process.cwd(),
      
      // Operadores matemáticos
      mais: (a, b) => this.mathOperators.executeOperation('mais', a, b),
      menos: (a, b) => this.mathOperators.executeOperation('menos', a, b),
      vezes: (a, b) => this.mathOperators.executeOperation('vezes', a, b),
      dividido: (a, b) => this.mathOperators.executeOperation('dividido', a, b),
      elevado: (a, b) => this.mathOperators.executeOperation('elevado', a, b),
      
      // Funções web
      criarComponente: (name, definition) => this.webComponents.createComponent(name, definition),
      criarRota: (path, component, options) => this.webComponents.createRoute(path, component, options),
      navegar: (path, options) => this.webComponents.navigate(path, options),
      
      // Sistema de módulos
      importar: (modulePath, options) => this.moduleSystem.import(modulePath, options),
      exportar: (modulePath, exports) => this.moduleSystem.export(modulePath, exports),
      
      // Funções utilitárias
      imprimir: console.log,
      ler: require('readline-sync').question,
      aguardar: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
      
      // Constantes
      verdadeiro: true,
      falso: false,
      nulo: null,
      vazio: undefined
    }
    
    return context
  }

  // Obter caminho de saída
  getOutputPath(inputPath, target) {
    const ext = path.extname(inputPath)
    const baseName = path.basename(inputPath, ext)
    const dir = path.dirname(inputPath)
    
    const extensions = {
      javascript: '.js',
      python: '.py',
      webassembly: '.wasm'
    }
    
    const outputExt = extensions[target] || '.js'
    return path.join(dir, `${baseName}${outputExt}`)
  }

  // Adicionar operador matemático personalizado
  addMathOperator(name, config) {
    return this.mathOperators.addCustomOperator(name, config)
  }

  // Listar operadores disponíveis
  listMathOperators() {
    return this.mathOperators.listOperators()
  }

  // Validar expressão matemática
  validateMathExpression(expression) {
    return this.mathOperators.validateExpression(expression)
  }

  // Obter estatísticas
  getStats() {
    return {
      version: this.version,
      modules: this.moduleSystem.getStats(),
      operators: this.listMathOperators().size,
      runtime: {
        variables: this.runtime.variables.size,
        functions: this.runtime.functions.size,
        classes: this.runtime.classes.size,
        components: this.runtime.components.size
      }
    }
  }

  // Limpar cache
  clearCache() {
    this.moduleSystem.clearCache()
    this.runtime.variables.clear()
    this.runtime.functions.clear()
    this.runtime.classes.clear()
    this.runtime.components.clear()
  }
}

// CLI
if (require.main === module) {
  const program = require('commander')
  
  program
    .version('1.0.0')
    .description('Stack Extensão - Linguagem de Programação')
  
  program
    .command('compile <file>')
    .description('Compilar arquivo .stk')
    .option('-t, --target <language>', 'Linguagem alvo (javascript, python)', 'javascript')
    .option('-o, --output <file>', 'Arquivo de saída')
    .option('--minify', 'Minificar código')
    .action(async (file, options) => {
      const stack = new StackExtension()
      const result = await stack.compile(file, options)
      
      if (result.success) {
        console.log('Compilação concluída com sucesso!')
      } else {
        console.error('Erro na compilação:', result.error)
        process.exit(1)
      }
    })
  
  program
    .command('run <file>')
    .description('Executar arquivo .stk')
    .action(async (file) => {
      const stack = new StackExtension()
      const result = await stack.run(file)
      
      if (!result.success) {
        console.error('Erro na execução:', result.error)
        process.exit(1)
      }
    })
  
  program
    .command('dev <file>')
    .description('Modo desenvolvimento com hot-reload')
    .action(async (file) => {
      const stack = new StackExtension()
      await stack.dev(file)
    })
  
  program
    .command('operators')
    .description('Listar operadores matemáticos disponíveis')
    .action(() => {
      const stack = new StackExtension()
      const operators = stack.listMathOperators()
      
      console.log('Operadores matemáticos disponíveis:')
      for (const [name, op] of operators) {
        console.log(`  ${name} (${op.symbol}) - ${op.description}`)
      }
    })
  
  program.parse(process.argv)
}

module.exports = StackExtension