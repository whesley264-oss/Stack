/**
 * Sistema de Templates Inteligente para Stack Extensão
 * Templates que se adaptam automaticamente e suportam múltiplas linguagens
 */

class SmartTemplates {
  constructor() {
    this.templates = new Map()
    this.engines = new Map()
    this.partials = new Map()
    this.helpers = new Map()
    this.layouts = new Map()
    this.cache = new Map()
    this.compilers = new Map()
    
    this.initializeEngines()
    this.initializeHelpers()
  }

  // Inicializar engines de template
  initializeEngines() {
    // Engine Handlebars-like
    this.engines.set('handlebars', {
      compile: (template) => this.compileHandlebars(template),
      render: (compiled, data) => this.renderHandlebars(compiled, data)
    })
    
    // Engine Mustache-like
    this.engines.set('mustache', {
      compile: (template) => this.compileMustache(template),
      render: (compiled, data) => this.renderMustache(compiled, data)
    })
    
    // Engine EJS-like
    this.engines.set('ejs', {
      compile: (template) => this.compileEJS(template),
      render: (compiled, data) => this.renderEJS(compiled, data)
    })
    
    // Engine Pug-like
    this.engines.set('pug', {
      compile: (template) => this.compilePug(template),
      render: (compiled, data) => this.renderPug(compiled, data)
    })
    
    // Engine Stack Extensão (único)
    this.engines.set('stack', {
      compile: (template) => this.compileStack(template),
      render: (compiled, data) => this.renderStack(compiled, data)
    })
  }

  // Inicializar helpers
  initializeHelpers() {
    // Helpers de formatação
    this.helpers.set('formatDate', (date, format) => {
      const d = new Date(date)
      switch (format) {
        case 'short': return d.toLocaleDateString()
        case 'long': return d.toLocaleDateString('pt-BR', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })
        case 'time': return d.toLocaleTimeString()
        default: return d.toString()
      }
    })
    
    this.helpers.set('formatNumber', (number, decimals = 2) => {
      return Number(number).toFixed(decimals)
    })
    
    this.helpers.set('formatCurrency', (amount, currency = 'BRL') => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
      }).format(amount)
    })
    
    // Helpers de string
    this.helpers.set('capitalize', (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    })
    
    this.helpers.set('uppercase', (str) => str.toUpperCase())
    this.helpers.set('lowercase', (str) => str.toLowerCase())
    this.helpers.set('truncate', (str, length = 50) => {
      return str.length > length ? str.substring(0, length) + '...' : str
    })
    
    // Helpers de array
    this.helpers.set('length', (arr) => arr ? arr.length : 0)
    this.helpers.set('first', (arr) => arr ? arr[0] : null)
    this.helpers.set('last', (arr) => arr ? arr[arr.length - 1] : null)
    this.helpers.set('join', (arr, separator = ', ') => arr ? arr.join(separator) : '')
    
    // Helpers de condição
    this.helpers.set('if', (condition, trueValue, falseValue = '') => {
      return condition ? trueValue : falseValue
    })
    
    this.helpers.set('unless', (condition, trueValue, falseValue = '') => {
      return !condition ? trueValue : falseValue
    })
    
    // Helpers de comparação
    this.helpers.set('eq', (a, b) => a === b)
    this.helpers.set('ne', (a, b) => a !== b)
    this.helpers.set('gt', (a, b) => a > b)
    this.helpers.set('lt', (a, b) => a < b)
    this.helpers.set('gte', (a, b) => a >= b)
    this.helpers.set('lte', (a, b) => a <= b)
    
    // Helpers matemáticos
    this.helpers.set('add', (a, b) => Number(a) + Number(b))
    this.helpers.set('subtract', (a, b) => Number(a) - Number(b))
    this.helpers.set('multiply', (a, b) => Number(a) * Number(b))
    this.helpers.set('divide', (a, b) => Number(a) / Number(b))
    this.helpers.set('modulo', (a, b) => Number(a) % Number(b))
    
    // Helpers de URL
    this.helpers.set('url', (path) => {
      return path.startsWith('/') ? path : '/' + path
    })
    
    this.helpers.set('asset', (path) => {
      return '/static/' + path
    })
    
    // Helpers de tradução
    this.helpers.set('t', (key, params = {}) => {
      return this.translate(key, params)
    })
    
    // Helpers de segurança
    this.helpers.set('escape', (str) => {
      return str.replace(/[&<>"']/g, (match) => {
        const escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }
        return escapeMap[match]
      })
    })
    
    this.helpers.set('safe', (str) => str) // Para HTML seguro
  }

  // Registrar template
  registerTemplate(name, template, options = {}) {
    const templateData = {
      name,
      content: template,
      engine: options.engine || 'stack',
      cache: options.cache !== false,
      partials: options.partials || [],
      layout: options.layout || null,
      data: options.data || {},
      // Funcionalidades únicas
      responsive: options.responsive || false,
      multilingual: options.multilingual || false,
      themes: options.themes || [],
      animations: options.animations || false,
      // Estado
      compiled: null,
      lastModified: Date.now()
    }

    this.templates.set(name, templateData)
    
    // Compilar se necessário
    if (templateData.cache) {
      this.compileTemplate(name)
    }
    
    return templateData
  }

  // Compilar template
  compileTemplate(name) {
    const template = this.templates.get(name)
    if (!template) {
      throw new Error(`Template '${name}' não encontrado`)
    }

    const engine = this.engines.get(template.engine)
    if (!engine) {
      throw new Error(`Engine '${template.engine}' não encontrado`)
    }

    try {
      template.compiled = engine.compile(template.content)
      template.lastModified = Date.now()
      return template.compiled
    } catch (error) {
      throw new Error(`Erro ao compilar template '${name}': ${error.message}`)
    }
  }

  // Renderizar template
  renderTemplate(name, data = {}, options = {}) {
    const template = this.templates.get(name)
    if (!template) {
      throw new Error(`Template '${name}' não encontrado`)
    }

    // Compilar se necessário
    if (!template.compiled || !template.cache) {
      this.compileTemplate(name)
    }

    const engine = this.engines.get(template.engine)
    if (!engine) {
      throw new Error(`Engine '${template.engine}' não encontrado`)
    }

    try {
      // Mesclar dados do template com dados fornecidos
      const mergedData = { ...template.data, ...data }
      
      // Aplicar helpers
      const processedData = this.applyHelpers(mergedData)
      
      // Renderizar
      let html = engine.render(template.compiled, processedData)
      
      // Aplicar layout se necessário
      if (template.layout) {
        html = this.applyLayout(template.layout, html, processedData)
      }
      
      // Aplicar partials
      html = this.applyPartials(html, template.partials, processedData)
      
      // Aplicar funcionalidades únicas
      if (template.responsive) {
        html = this.makeResponsive(html)
      }
      
      if (template.multilingual) {
        html = this.translateTemplate(html, options.language || 'pt')
      }
      
      if (template.animations) {
        html = this.addAnimations(html)
      }
      
      return html
    } catch (error) {
      throw new Error(`Erro ao renderizar template '${name}': ${error.message}`)
    }
  }

  // Compilar Handlebars
  compileHandlebars(template) {
    // Implementação básica de Handlebars
    return template
      .replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
        return `{{${this.processExpression(expression)}}}`
      })
      .replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, condition, content) => {
        return `{{#${condition}}}${content}{{/${condition}}}`
      })
  }

  // Renderizar Handlebars
  renderHandlebars(compiled, data) {
    let html = compiled
    
    // Processar variáveis
    html = html.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      const value = this.evaluateExpression(expression, data)
      return value !== undefined ? value : ''
    })
    
    // Processar condicionais
    html = html.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, condition, content) => {
      const result = this.evaluateExpression(condition, data)
      return result ? content : ''
    })
    
    // Processar loops
    html = html.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, array, content) => {
      const arr = this.evaluateExpression(array, data)
      if (!Array.isArray(arr)) return ''
      
      return arr.map(item => {
        const itemData = { ...data, this: item }
        return this.renderHandlebars(content, itemData)
      }).join('')
    })
    
    return html
  }

  // Compilar Mustache
  compileMustache(template) {
    return template
      .replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
        return `{{${this.processExpression(expression)}}}`
      })
      .replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, condition, content) => {
        return `{{#${condition}}}${content}{{/${condition}}}`
      })
  }

  // Renderizar Mustache
  renderMustache(compiled, data) {
    let html = compiled
    
    // Processar variáveis
    html = html.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      const value = this.evaluateExpression(expression, data)
      return value !== undefined ? value : ''
    })
    
    // Processar seções
    html = html.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, condition, content) => {
      const result = this.evaluateExpression(condition, data)
      if (Array.isArray(result)) {
        return result.map(item => {
          const itemData = { ...data, this: item }
          return this.renderMustache(content, itemData)
        }).join('')
      } else if (result) {
        return this.renderMustache(content, data)
      }
      return ''
    })
    
    return html
  }

  // Compilar EJS
  compileEJS(template) {
    return template
      .replace(/<%=([^%]+)%>/g, (match, expression) => {
        return `{{${this.processExpression(expression)}}}`
      })
      .replace(/<%([^%]+)%>/g, (match, expression) => {
        return `{{${this.processExpression(expression)}}}`
      })
  }

  // Renderizar EJS
  renderEJS(compiled, data) {
    let html = compiled
    
    // Processar expressões
    html = html.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      const value = this.evaluateExpression(expression, data)
      return value !== undefined ? value : ''
    })
    
    return html
  }

  // Compilar Pug
  compilePug(template) {
    // Implementação básica de Pug
    const lines = template.split('\n')
    const compiled = []
    let indentLevel = 0
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      const indent = line.match(/^(\s*)/)[1].length
      const currentIndent = Math.floor(indent / 2)
      
      if (currentIndent < indentLevel) {
        // Fechar tags
        for (let i = indentLevel; i > currentIndent; i--) {
          compiled.push('</div>')
        }
      }
      
      if (trimmed.startsWith('//')) {
        // Comentário
        compiled.push(`<!-- ${trimmed.substring(2)} -->`)
      } else if (trimmed.includes('=')) {
        // Atributo
        const [attr, value] = trimmed.split('=')
        compiled.push(`${attr}="${value}"`)
      } else if (trimmed.startsWith('.')) {
        // Classe
        const className = trimmed.substring(1)
        compiled.push(`<div class="${className}">`)
        indentLevel++
      } else if (trimmed.startsWith('#')) {
        // ID
        const id = trimmed.substring(1)
        compiled.push(`<div id="${id}">`)
        indentLevel++
      } else {
        // Tag
        compiled.push(`<${trimmed}>`)
        indentLevel++
      }
    }
    
    // Fechar tags restantes
    for (let i = indentLevel; i > 0; i--) {
      compiled.push('</div>')
    }
    
    return compiled.join('\n')
  }

  // Renderizar Pug
  renderPug(compiled, data) {
    return this.renderHandlebars(compiled, data)
  }

  // Compilar Stack Extensão (único)
  compileStack(template) {
    return template
      .replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
        return `{{${this.processExpression(expression)}}}`
      })
      .replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, condition, content) => {
        return `{{#${condition}}}${content}{{/${condition}}}`
      })
      .replace(/\{\{@([^}]+)\}\}/g, (match, helper) => {
        return `{{@${helper}}}`
      })
  }

  // Renderizar Stack Extensão
  renderStack(compiled, data) {
    let html = compiled
    
    // Processar helpers
    html = html.replace(/\{\{@([^}]+)\}\}/g, (match, helper) => {
      return this.processHelper(helper, data)
    })
    
    // Processar variáveis
    html = html.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      const value = this.evaluateExpression(expression, data)
      return value !== undefined ? value : ''
    })
    
    // Processar condicionais
    html = html.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, condition, content) => {
      const result = this.evaluateExpression(condition, data)
      return result ? content : ''
    })
    
    return html
  }

  // Processar expressão
  processExpression(expression) {
    return expression.trim()
  }

  // Avaliar expressão
  evaluateExpression(expression, data) {
    try {
      // Criar função segura para avaliar expressão
      const func = new Function('data', 'helpers', `
        with (data) {
          return ${expression}
        }
      `)
      return func(data, this.helpers)
    } catch (error) {
      console.error('Erro ao avaliar expressão:', expression, error)
      return ''
    }
  }

  // Processar helper
  processHelper(helper, data) {
    const [name, ...args] = helper.split(' ')
    const helperFunc = this.helpers.get(name)
    
    if (helperFunc) {
      try {
        return helperFunc(...args.map(arg => this.evaluateExpression(arg, data)))
      } catch (error) {
        console.error('Erro ao processar helper:', name, error)
        return ''
      }
    }
    
    return ''
  }

  // Aplicar helpers aos dados
  applyHelpers(data) {
    const processed = { ...data }
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.includes('{{@')) {
        processed[key] = this.processHelper(value, data)
      }
    }
    
    return processed
  }

  // Aplicar layout
  applyLayout(layoutName, content, data) {
    const layout = this.layouts.get(layoutName)
    if (!layout) {
      return content
    }
    
    return layout.replace('{{content}}', content)
  }

  // Aplicar partials
  applyPartials(html, partials, data) {
    let result = html
    
    for (const partial of partials) {
      const partialContent = this.partials.get(partial)
      if (partialContent) {
        result = result.replace(new RegExp(`{{>${partial}}}`, 'g'), partialContent)
      }
    }
    
    return result
  }

  // Tornar responsivo
  makeResponsive(html) {
    // Adicionar classes responsivas
    html = html.replace(/<div/g, '<div class="responsive"')
    html = html.replace(/<img/g, '<img class="responsive-img"')
    
    // Adicionar meta viewport se não existir
    if (!html.includes('viewport')) {
      html = html.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    }
    
    return html
  }

  // Traduzir template
  translateTemplate(html, language) {
    // Implementação básica de tradução
    const translations = {
      pt: {
        'Hello': 'Olá',
        'Welcome': 'Bem-vindo',
        'Click here': 'Clique aqui'
      },
      en: {
        'Olá': 'Hello',
        'Bem-vindo': 'Welcome',
        'Clique aqui': 'Click here'
      }
    }
    
    const t = translations[language] || {}
    
    for (const [key, value] of Object.entries(t)) {
      html = html.replace(new RegExp(key, 'g'), value)
    }
    
    return html
  }

  // Adicionar animações
  addAnimations(html) {
    // Adicionar classes de animação
    html = html.replace(/<div/g, '<div class="animate-fade-in"')
    html = html.replace(/<img/g, '<img class="animate-zoom-in"')
    
    return html
  }

  // Traduzir chave
  translate(key, params = {}) {
    // Implementação básica de tradução
    const translations = {
      'welcome': 'Bem-vindo',
      'hello': 'Olá',
      'goodbye': 'Tchau'
    }
    
    let translation = translations[key] || key
    
    // Substituir parâmetros
    for (const [param, value] of Object.entries(params)) {
      translation = translation.replace(`{{${param}}}`, value)
    }
    
    return translation
  }

  // Registrar partial
  registerPartial(name, content) {
    this.partials.set(name, content)
  }

  // Registrar layout
  registerLayout(name, content) {
    this.layouts.set(name, content)
  }

  // Registrar helper personalizado
  registerHelper(name, func) {
    this.helpers.set(name, func)
  }

  // Listar templates
  listTemplates() {
    return Array.from(this.templates.keys())
  }

  // Obter estatísticas
  getStats() {
    return {
      templates: this.templates.size,
      partials: this.partials.size,
      layouts: this.layouts.size,
      helpers: this.helpers.size,
      engines: this.engines.size
    }
  }
}

module.exports = SmartTemplates