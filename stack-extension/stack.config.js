/**
 * Configuração do Stack Extensão
 * Arquivo de configuração para personalizar a linguagem
 */

module.exports = {
  // Configurações gerais
  version: "1.0.0",
  language: "pt", // pt, en, auto
  debug: true,
  
  // Configurações de compilação
  compilation: {
    target: "javascript", // javascript, python, webassembly
    minify: false,
    sourceMaps: true,
    es6: true
  },
  
  // Configurações bilíngues
  bilingual: {
    enabled: true,
    defaultLanguage: "portuguese",
    autoDetect: true,
    suggestions: true
  },
  
  // Configurações de IA
  ai: {
    enabled: true,
    models: {
      "code-completion": true,
      "code-analysis": true,
      "code-generation": true,
      "debugging": true,
      "optimization": true
    },
    autoSuggest: true,
    confidence: 0.7
  },
  
  // Configurações do servidor
  server: {
    port: 3000,
    host: "localhost",
    autoReload: true,
    websocket: true,
    api: true,
    cors: true
  },
  
  // Configurações de templates
  templates: {
    engine: "stack", // stack, handlebars, mustache, ejs, pug
    cache: true,
    responsive: true,
    multilingual: true,
    animations: false
  },
  
  // Configurações de plugins
  plugins: {
    enabled: true,
    autoLoad: false,
    repositories: [
      "https://plugins.stack-extension.com"
    ]
  },
  
  // Configurações de operadores matemáticos
  math: {
    customOperators: {
      "raiz": {
        symbol: "√",
        precedence: 7,
        associativity: "right",
        operation: (a, b) => Math.pow(b, 1/a),
        description: "Raiz n-ésima"
      },
      "logaritmo": {
        symbol: "log",
        precedence: 7,
        associativity: "right",
        operation: (a, b) => Math.log(b) / Math.log(a),
        description: "Logaritmo"
      }
    }
  },
  
  // Configurações de web
  web: {
    components: {
      shadowDOM: false,
      webComponents: true,
      serverSideRendering: false
    },
    routing: {
      mode: "hash", // hash, history
      base: "/"
    },
    state: {
      persistence: false,
      encryption: false,
      compression: false
    }
  },
  
  // Configurações de módulos
  modules: {
    autoImport: true,
    hotReload: true,
    cache: true,
    paths: [".", "./src", "./lib", "./modules"]
  },
  
  // Configurações de desenvolvimento
  development: {
    watch: true,
    hotReload: true,
    sourceMaps: true,
    verbose: true
  },
  
  // Configurações de produção
  production: {
    minify: true,
    optimize: true,
    compress: true,
    cache: true
  }
}