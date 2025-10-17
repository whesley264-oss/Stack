/**
 * Arquivo de Configuração de Exemplo - Stack Extensão
 * Copie este arquivo para stack.config.js e personalize conforme necessário
 */

module.exports = {
  // Configurações gerais
  version: "1.0.0",
  language: "pt", // pt, en, auto
  debug: false,
  
  // Configurações de compilação
  compilation: {
    target: "javascript", // javascript, python, webassembly
    minify: false,
    sourceMaps: true,
    es6: true,
    // Configurações específicas por target
    javascript: {
      target: "es2020",
      module: "esnext",
      lib: ["es2020", "dom"]
    },
    python: {
      version: "3.8",
      typeHints: true
    }
  },
  
  // Configurações bilíngues
  bilingual: {
    enabled: true,
    defaultLanguage: "portuguese",
    autoDetect: true,
    suggestions: true,
    // Palavras-chave personalizadas
    customTranslations: {
      // Adicionar traduções personalizadas
      "minha_funcao": "my_function",
      "meu_objeto": "my_object"
    }
  },
  
  // Configurações de IA
  ai: {
    enabled: true,
    models: {
      "code-completion": true,
      "code-analysis": true,
      "code-generation": true,
      "debugging": true,
      "optimization": true,
      "translation": true
    },
    autoSuggest: true,
    confidence: 0.7,
    // Configurações específicas da IA
    completion: {
      maxSuggestions: 5,
      delay: 300
    },
    analysis: {
      realTime: true,
      includeWarnings: true,
      includeSuggestions: true
    }
  },
  
  // Configurações do servidor
  server: {
    port: 3000,
    host: "localhost",
    autoReload: true,
    websocket: true,
    api: true,
    cors: true,
    // Configurações de segurança
    security: {
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100 // máximo 100 requests por IP
      },
      helmet: true
    }
  },
  
  // Configurações de templates
  templates: {
    engine: "stack", // stack, handlebars, mustache, ejs, pug
    cache: true,
    responsive: true,
    multilingual: true,
    animations: false,
    // Configurações específicas do engine
    stack: {
      autoTranslate: true,
      preserveComments: true
    }
  },
  
  // Configurações de plugins
  plugins: {
    enabled: true,
    autoLoad: false,
    repositories: [
      "https://plugins.stack-extension.com",
      "https://github.com/stack-extension/plugins"
    ],
    // Plugins para carregar automaticamente
    autoLoadPlugins: [
      "math-advanced",
      "web-components"
    ]
  },
  
  // Configurações de operadores matemáticos
  math: {
    // Operadores personalizados
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
      },
      "seno": {
        symbol: "sin",
        precedence: 7,
        associativity: "right",
        operation: (a) => Math.sin(a),
        description: "Seno"
      },
      "cosseno": {
        symbol: "cos",
        precedence: 7,
        associativity: "right",
        operation: (a) => Math.cos(a),
        description: "Cosseno"
      },
      "tangente": {
        symbol: "tan",
        precedence: 7,
        associativity: "right",
        operation: (a) => Math.tan(a),
        description: "Tangente"
      }
    },
    // Configurações de precisão
    precision: 10,
    // Usar biblioteca de matemática avançada
    advancedMath: true
  },
  
  // Configurações de web
  web: {
    components: {
      shadowDOM: false,
      webComponents: true,
      serverSideRendering: false,
      // Configurações de componentes
      autoImport: true,
      lazyLoading: true
    },
    routing: {
      mode: "hash", // hash, history
      base: "/",
      // Configurações de roteamento
      lazyRoutes: true,
      preloadRoutes: true
    },
    state: {
      persistence: false,
      encryption: false,
      compression: false,
      // Configurações de estado
      autoSave: true,
      saveInterval: 5000
    },
    // Configurações de PWA
    pwa: {
      enabled: false,
      name: "Stack Extensão App",
      shortName: "StackApp",
      themeColor: "#007acc",
      backgroundColor: "#1e1e1e"
    }
  },
  
  // Configurações de módulos
  modules: {
    autoImport: true,
    hotReload: true,
    cache: true,
    paths: [".", "./src", "./lib", "./modules"],
    // Configurações de resolução
    resolution: {
      extensions: [".stk", ".js", ".ts", ".py"],
      alias: {
        "@": "./src",
        "@components": "./src/components",
        "@utils": "./src/utils"
      }
    }
  },
  
  // Configurações de desenvolvimento
  development: {
    watch: true,
    hotReload: true,
    sourceMaps: true,
    verbose: false,
    // Configurações de debug
    debug: {
      enabled: false,
      level: "info", // error, warn, info, debug
      output: "console" // console, file, both
    }
  },
  
  // Configurações de produção
  production: {
    minify: true,
    optimize: true,
    compress: true,
    cache: true,
    // Configurações de build
    build: {
      outputDir: "dist",
      assetsDir: "assets",
      publicPath: "/"
    }
  },
  
  // Configurações de colaboração
  collaboration: {
    enabled: true,
    realTime: true,
    // Configurações de sincronização
    sync: {
      interval: 100,
      maxOperations: 1000,
      conflictResolution: "last-write-wins" // last-write-wins, manual, ai
    },
    // Configurações de permissões
    permissions: {
      canEdit: true,
      canRun: true,
      canShare: true,
      canManage: false
    }
  },
  
  // Configurações de editor
  editor: {
    theme: "dark", // dark, light, monokai, solarized
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    // Configurações de autocomplete
    autocomplete: {
      enabled: true,
      delay: 300,
      maxSuggestions: 10
    },
    // Configurações de formatação
    formatting: {
      autoFormat: true,
      onSave: true,
      rules: {
        indentSize: 2,
        useSpaces: true,
        maxLineLength: 100
      }
    }
  },
  
  // Configurações de logging
  logging: {
    level: "info", // error, warn, info, debug
    output: "console", // console, file, both
    file: {
      path: "./logs/stack-extension.log",
      maxSize: "10MB",
      maxFiles: 5
    }
  },
  
  // Configurações de métricas
  metrics: {
    enabled: true,
    // Coletar métricas de uso
    usage: {
      enabled: true,
      anonymous: true
    },
    // Coletar métricas de performance
    performance: {
      enabled: true,
      sampling: 0.1 // 10% das operações
    }
  }
}