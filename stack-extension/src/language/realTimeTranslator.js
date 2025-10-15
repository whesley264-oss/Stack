/**
 * Tradutor em Tempo Real para Stack Extensão
 * Traduz código entre português e inglês instantaneamente
 */

class RealTimeTranslator {
  constructor() {
    this.translations = new Map()
    this.context = new Map()
    this.autoTranslate = true
    this.language = 'portuguese'
    this.initializeTranslations()
  }

  initializeTranslations() {
    // Palavras-chave principais
    this.translations.set('funcao', 'function')
    this.translations.set('function', 'funcao')
    this.translations.set('variavel', 'var')
    this.translations.set('var', 'variavel')
    this.translations.set('constante', 'const')
    this.translations.set('const', 'constante')
    this.translations.set('se', 'if')
    this.translations.set('if', 'se')
    this.translations.set('senao', 'else')
    this.translations.set('else', 'senao')
    this.translations.set('enquanto', 'while')
    this.translations.set('while', 'enquanto')
    this.translations.set('para', 'for')
    this.translations.set('for', 'para')
    this.translations.set('retornar', 'return')
    this.translations.set('return', 'retornar')
    this.translations.set('imprimir', 'print')
    this.translations.set('print', 'imprimir')
    this.translations.set('classe', 'class')
    this.translations.set('class', 'classe')
    this.translations.set('componente', 'component')
    this.translations.set('component', 'componente')
    this.translations.set('importar', 'import')
    this.translations.set('import', 'importar')
    this.translations.set('exportar', 'export')
    this.translations.set('export', 'exportar')
    this.translations.set('de', 'from')
    this.translations.set('from', 'de')
    this.translations.set('como', 'as')
    this.translations.set('as', 'como')
    this.translations.set('novo', 'new')
    this.translations.set('new', 'novo')
    this.translations.set('isto', 'this')
    this.translations.set('this', 'isto')
    this.translations.set('verdadeiro', 'true')
    this.translations.set('true', 'verdadeiro')
    this.translations.set('falso', 'false')
    this.translations.set('false', 'falso')
    this.translations.set('nulo', 'null')
    this.translations.set('null', 'nulo')
    this.translations.set('vazio', 'undefined')
    this.translations.set('undefined', 'vazio')

    // Operadores matemáticos
    this.translations.set('mais', '+')
    this.translations.set('+', 'mais')
    this.translations.set('menos', '-')
    this.translations.set('-', 'menos')
    this.translations.set('vezes', '*')
    this.translations.set('*', 'vezes')
    this.translations.set('dividido', '/')
    this.translations.set('/', 'dividido')
    this.translations.set('elevado', '**')
    this.translations.set('**', 'elevado')
    this.translations.set('modulo', '%')
    this.translations.set('%', 'modulo')
    this.translations.set('igual', '==')
    this.translations.set('==', 'igual')
    this.translations.set('diferente', '!=')
    this.translations.set('!=', 'diferente')
    this.translations.set('maior', '>')
    this.translations.set('>', 'maior')
    this.translations.set('menor', '<')
    this.translations.set('<', 'menor')
    this.translations.set('maior_igual', '>=')
    this.translations.set('>=', 'maior_igual')
    this.translations.set('menor_igual', '<=')
    this.translations.set('<=', 'menor_igual')
    this.translations.set('e', '&&')
    this.translations.set('&&', 'e')
    this.translations.set('ou', '||')
    this.translations.set('||', 'ou')
    this.translations.set('nao', '!')
    this.translations.set('!', 'nao')

    // Funções comuns
    this.translations.set('console.log', 'imprimir')
    this.translations.set('imprimir', 'console.log')
    this.translations.set('alert', 'alerta')
    this.translations.set('alerta', 'alert')
    this.translations.set('prompt', 'solicitar')
    this.translations.set('solicitar', 'prompt')
    this.translations.set('confirm', 'confirmar')
    this.translations.set('confirmar', 'confirm')
    this.translations.set('parseInt', 'converterInteiro')
    this.translations.set('converterInteiro', 'parseInt')
    this.translations.set('parseFloat', 'converterDecimal')
    this.translations.set('converterDecimal', 'parseFloat')
    this.translations.set('toString', 'paraTexto')
    this.translations.set('paraTexto', 'toString')
    this.translations.set('length', 'tamanho')
    this.translations.set('tamanho', 'length')
    this.translations.set('push', 'adicionar')
    this.translations.set('adicionar', 'push')
    this.translations.set('pop', 'removerUltimo')
    this.translations.set('removerUltimo', 'pop')
    this.translations.set('shift', 'removerPrimeiro')
    this.translations.set('removerPrimeiro', 'shift')
    this.translations.set('unshift', 'adicionarInicio')
    this.translations.set('adicionarInicio', 'unshift')
    this.translations.set('slice', 'fatiar')
    this.translations.set('fatiar', 'slice')
    this.translations.set('splice', 'remover')
    this.translations.set('remover', 'splice')
    this.translations.set('indexOf', 'indiceDe')
    this.translations.set('indiceDe', 'indexOf')
    this.translations.set('includes', 'inclui')
    this.translations.set('inclui', 'includes')
    this.translations.set('join', 'juntar')
    this.translations.set('juntar', 'join')
    this.translations.set('split', 'dividir')
    this.translations.set('dividir', 'split')
    this.translations.set('replace', 'substituir')
    this.translations.set('substituir', 'replace')
    this.translations.set('toLowerCase', 'paraMinusculo')
    this.translations.set('paraMinusculo', 'toLowerCase')
    this.translations.set('toUpperCase', 'paraMaiusculo')
    this.translations.set('paraMaiusculo', 'toUpperCase')
    this.translations.set('trim', 'removerEspacos')
    this.translations.set('removerEspacos', 'trim')
    this.translations.set('substring', 'substring')
    this.translations.set('substr', 'substr')
    this.translations.set('charAt', 'caractereEm')
    this.translations.set('caractereEm', 'charAt')
    this.translations.set('charCodeAt', 'codigoEm')
    this.translations.set('codigoEm', 'charCodeAt')
    this.translations.set('fromCharCode', 'deCodigo')
    this.translations.set('deCodigo', 'fromCharCode')
  }

  // Traduzir código em tempo real
  translateCode(code, targetLanguage = 'portuguese') {
    const lines = code.split('\n')
    const translatedLines = []
    const changes = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const translatedLine = this.translateLine(line, targetLanguage)
      
      if (translatedLine !== line) {
        changes.push({
          line: i + 1,
          original: line,
          translated: translatedLine,
          language: targetLanguage
        })
      }
      
      translatedLines.push(translatedLine)
    }

    return {
      code: translatedLines.join('\n'),
      changes: changes,
      language: targetLanguage
    }
  }

  // Traduzir linha individual
  translateLine(line, targetLanguage) {
    let translatedLine = line

    // Preservar strings e comentários
    const strings = []
    const comments = []
    
    // Extrair strings
    translatedLine = translatedLine.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, (match, quote, content) => {
      const index = strings.length
      strings.push(match)
      return `__STRING_${index}__`
    })

    // Extrair comentários
    translatedLine = translatedLine.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/g, (match) => {
      const index = comments.length
      comments.push(match)
      return `__COMMENT_${index}__`
    })

    // Traduzir palavras-chave e operadores
    for (const [original, translation] of this.translations) {
      const regex = new RegExp(`\\b${this.escapeRegex(original)}\\b`, 'g')
      translatedLine = translatedLine.replace(regex, translation)
    }

    // Restaurar strings
    strings.forEach((str, index) => {
      translatedLine = translatedLine.replace(`__STRING_${index}__`, str)
    })

    // Restaurar comentários
    comments.forEach((comment, index) => {
      translatedLine = translatedLine.replace(`__COMMENT_${index}__`, comment)
    })

    return translatedLine
  }

  // Escapar caracteres especiais para regex
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Detectar idioma do código
  detectLanguage(code) {
    const lines = code.split('\n')
    let portugueseCount = 0
    let englishCount = 0

    for (const line of lines) {
      const words = line.split(/\s+/)
      
      for (const word of words) {
        if (this.isPortuguese(word)) {
          portugueseCount++
        } else if (this.isEnglish(word)) {
          englishCount++
        }
      }
    }

    if (portugueseCount > englishCount) {
      return 'portuguese'
    } else if (englishCount > portugueseCount) {
      return 'english'
    } else {
      return 'mixed'
    }
  }

  // Verificar se palavra é portuguesa
  isPortuguese(word) {
    const portugueseWords = [
      'funcao', 'variavel', 'constante', 'se', 'senao', 'enquanto', 'para',
      'retornar', 'imprimir', 'classe', 'componente', 'importar', 'exportar',
      'de', 'como', 'novo', 'isto', 'verdadeiro', 'falso', 'nulo', 'vazio',
      'mais', 'menos', 'vezes', 'dividido', 'elevado', 'modulo', 'igual',
      'diferente', 'maior', 'menor', 'e', 'ou', 'nao', 'imprimir', 'alerta',
      'solicitar', 'confirmar', 'converterInteiro', 'converterDecimal',
      'paraTexto', 'tamanho', 'adicionar', 'removerUltimo', 'removerPrimeiro',
      'adicionarInicio', 'fatiar', 'remover', 'indiceDe', 'inclui', 'juntar',
      'dividir', 'substituir', 'paraMinusculo', 'paraMaiusculo', 'removerEspacos',
      'caractereEm', 'codigoEm', 'deCodigo'
    ]
    
    return portugueseWords.includes(word.toLowerCase())
  }

  // Verificar se palavra é inglesa
  isEnglish(word) {
    const englishWords = [
      'function', 'var', 'const', 'if', 'else', 'while', 'for', 'return',
      'print', 'class', 'component', 'import', 'export', 'from', 'as', 'new',
      'this', 'true', 'false', 'null', 'undefined', 'console', 'alert',
      'prompt', 'confirm', 'parseInt', 'parseFloat', 'toString', 'length',
      'push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'indexOf',
      'includes', 'join', 'split', 'replace', 'toLowerCase', 'toUpperCase',
      'trim', 'substring', 'substr', 'charAt', 'charCodeAt', 'fromCharCode'
    ]
    
    return englishWords.includes(word.toLowerCase())
  }

  // Traduzir em tempo real com sugestões
  translateWithSuggestions(code, targetLanguage = 'portuguese') {
    const result = this.translateCode(code, targetLanguage)
    const suggestions = []

    // Gerar sugestões baseadas no contexto
    for (const change of result.changes) {
      suggestions.push({
        line: change.line,
        original: change.original,
        suggestion: change.translated,
        confidence: this.calculateConfidence(change.original, change.translated),
        reason: this.getTranslationReason(change.original, change.translated)
      })
    }

    return {
      ...result,
      suggestions: suggestions
    }
  }

  // Calcular confiança da tradução
  calculateConfidence(original, translated) {
    const originalWords = original.split(/\s+/).length
    const translatedWords = translated.split(/\s+/).length
    const wordRatio = Math.min(originalWords, translatedWords) / Math.max(originalWords, translatedWords)
    
    return Math.round(wordRatio * 100)
  }

  // Obter razão da tradução
  getTranslationReason(original, translated) {
    if (original.includes('function') && translated.includes('funcao')) {
      return 'Tradução de palavra-chave de função'
    } else if (original.includes('var') && translated.includes('variavel')) {
      return 'Tradução de palavra-chave de variável'
    } else if (original.includes('+') && translated.includes('mais')) {
      return 'Tradução de operador matemático'
    } else if (original.includes('if') && translated.includes('se')) {
      return 'Tradução de palavra-chave condicional'
    } else {
      return 'Tradução automática de sintaxe'
    }
  }

  // Alternar idioma automaticamente
  toggleLanguage(code) {
    const currentLanguage = this.detectLanguage(code)
    
    if (currentLanguage === 'portuguese') {
      return this.translateCode(code, 'english')
    } else if (currentLanguage === 'english') {
      return this.translateCode(code, 'portuguese')
    } else {
      // Código misto - traduzir para português
      return this.translateCode(code, 'portuguese')
    }
  }

  // Traduzir com preservação de contexto
  translateWithContext(code, targetLanguage = 'portuguese', context = {}) {
    // Aplicar contexto específico
    if (context.framework === 'react') {
      this.addFrameworkTranslations('react')
    } else if (context.framework === 'vue') {
      this.addFrameworkTranslations('vue')
    }

    return this.translateCode(code, targetLanguage)
  }

  // Adicionar traduções específicas de framework
  addFrameworkTranslations(framework) {
    if (framework === 'react') {
      this.translations.set('useState', 'usarEstado')
      this.translations.set('usarEstado', 'useState')
      this.translations.set('useEffect', 'usarEfeito')
      this.translations.set('usarEfeito', 'useEffect')
      this.translations.set('useContext', 'usarContexto')
      this.translations.set('usarContexto', 'useContext')
    } else if (framework === 'vue') {
      this.translations.set('data', 'dados')
      this.translations.set('dados', 'data')
      this.translations.set('computed', 'calculado')
      this.translations.set('calculado', 'computed')
      this.translations.set('watch', 'observar')
      this.translations.set('observar', 'watch')
    }
  }

  // Obter estatísticas de tradução
  getTranslationStats(code) {
    const lines = code.split('\n')
    const stats = {
      totalLines: lines.length,
      translatedLines: 0,
      mixedLines: 0,
      portugueseLines: 0,
      englishLines: 0,
      suggestions: 0
    }

    for (const line of lines) {
      const language = this.detectLanguage(line)
      
      if (language === 'portuguese') {
        stats.portugueseLines++
      } else if (language === 'english') {
        stats.englishLines++
      } else if (language === 'mixed') {
        stats.mixedLines++
      }

      // Verificar se precisa de tradução
      const translated = this.translateLine(line, 'portuguese')
      if (translated !== line) {
        stats.translatedLines++
        stats.suggestions++
      }
    }

    return stats
  }

  // Configurar tradução automática
  setAutoTranslate(enabled) {
    this.autoTranslate = enabled
  }

  // Definir idioma padrão
  setDefaultLanguage(language) {
    this.language = language
  }

  // Obter configuração atual
  getConfig() {
    return {
      autoTranslate: this.autoTranslate,
      language: this.language,
      translations: this.translations.size
    }
  }
}

module.exports = RealTimeTranslator