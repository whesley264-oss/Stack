/**
 * Sistema Bilíngue para Stack Extensão
 * Permite escrever código em português e inglês simultaneamente
 */

class BilingualSystem {
  constructor() {
    this.keywords = new Map()
    this.operators = new Map()
    this.functions = new Map()
    this.initializeBilingualMappings()
  }

  initializeBilingualMappings() {
    // Palavras-chave bilíngues
    this.keywords.set('if', 'se')
    this.keywords.set('se', 'if')
    this.keywords.set('else', 'senao')
    this.keywords.set('senao', 'else')
    this.keywords.set('while', 'enquanto')
    this.keywords.set('enquanto', 'while')
    this.keywords.set('for', 'para')
    this.keywords.set('para', 'for')
    this.keywords.set('function', 'funcao')
    this.keywords.set('funcao', 'function')
    this.keywords.set('class', 'classe')
    this.keywords.set('classe', 'class')
    this.keywords.set('component', 'componente')
    this.keywords.set('componente', 'component')
    this.keywords.set('import', 'importar')
    this.keywords.set('importar', 'import')
    this.keywords.set('export', 'exportar')
    this.keywords.set('exportar', 'export')
    this.keywords.set('from', 'de')
    this.keywords.set('de', 'from')
    this.keywords.set('as', 'como')
    this.keywords.set('como', 'as')
    this.keywords.set('return', 'retornar')
    this.keywords.set('retornar', 'return')
    this.keywords.set('var', 'variavel')
    this.keywords.set('variavel', 'var')
    this.keywords.set('let', 'deixar')
    this.keywords.set('deixar', 'let')
    this.keywords.set('const', 'constante')
    this.keywords.set('constante', 'const')
    this.keywords.set('true', 'verdadeiro')
    this.keywords.set('verdadeiro', 'true')
    this.keywords.set('false', 'falso')
    this.keywords.set('falso', 'false')
    this.keywords.set('null', 'nulo')
    this.keywords.set('nulo', 'null')
    this.keywords.set('undefined', 'vazio')
    this.keywords.set('vazio', 'undefined')
    this.keywords.set('try', 'tentar')
    this.keywords.set('tentar', 'try')
    this.keywords.set('catch', 'capturar')
    this.keywords.set('capturar', 'catch')
    this.keywords.set('finally', 'finalmente')
    this.keywords.set('finalmente', 'finally')
    this.keywords.set('throw', 'lancar')
    this.keywords.set('lancar', 'throw')
    this.keywords.set('new', 'novo')
    this.keywords.set('novo', 'new')
    this.keywords.set('this', 'isto')
    this.keywords.set('isto', 'this')
    this.keywords.set('super', 'super')
    this.keywords.set('static', 'estatico')
    this.keywords.set('estatico', 'static')
    this.keywords.set('public', 'publico')
    this.keywords.set('publico', 'public')
    this.keywords.set('private', 'privado')
    this.keywords.set('privado', 'private')
    this.keywords.set('protected', 'protegido')
    this.keywords.set('protegido', 'protected')

    // Operadores bilíngues
    this.operators.set('plus', 'mais')
    this.operators.set('mais', 'plus')
    this.operators.set('minus', 'menos')
    this.operators.set('menos', 'minus')
    this.operators.set('times', 'vezes')
    this.operators.set('vezes', 'times')
    this.operators.set('divided', 'dividido')
    this.operators.set('dividido', 'divided')
    this.operators.set('power', 'elevado')
    this.operators.set('elevado', 'power')
    this.operators.set('modulo', 'mod')
    this.operators.set('mod', 'modulo')
    this.operators.set('equals', 'igual')
    this.operators.set('igual', 'equals')
    this.operators.set('not_equals', 'diferente')
    this.operators.set('diferente', 'not_equals')
    this.operators.set('greater', 'maior')
    this.operators.set('maior', 'greater')
    this.operators.set('less', 'menor')
    this.operators.set('menor', 'less')
    this.operators.set('greater_equal', 'maior_igual')
    this.operators.set('maior_igual', 'greater_equal')
    this.operators.set('less_equal', 'menor_igual')
    this.operators.set('menor_igual', 'less_equal')
    this.operators.set('and', 'e')
    this.operators.set('e', 'and')
    this.operators.set('or', 'ou')
    this.operators.set('ou', 'or')
    this.operators.set('not', 'nao')
    this.operators.set('nao', 'not')

    // Funções bilíngues
    this.functions.set('print', 'imprimir')
    this.functions.set('imprimir', 'print')
    this.functions.set('log', 'registrar')
    this.functions.set('registrar', 'log')
    this.functions.set('read', 'ler')
    this.functions.set('ler', 'read')
    this.functions.set('write', 'escrever')
    this.functions.set('escrever', 'write')
    this.functions.set('open', 'abrir')
    this.functions.set('abrir', 'open')
    this.functions.set('close', 'fechar')
    this.functions.set('fechar', 'close')
    this.functions.set('save', 'salvar')
    this.functions.set('salvar', 'save')
    this.functions.set('load', 'carregar')
    this.functions.set('carregar', 'load')
    this.functions.set('create', 'criar')
    this.functions.set('criar', 'create')
    this.functions.set('delete', 'deletar')
    this.functions.set('deletar', 'delete')
    this.functions.set('update', 'atualizar')
    this.functions.set('atualizar', 'update')
    this.functions.set('find', 'encontrar')
    this.functions.set('encontrar', 'find')
    this.functions.set('search', 'buscar')
    this.functions.set('buscar', 'search')
    this.functions.set('filter', 'filtrar')
    this.functions.set('filtrar', 'filter')
    this.functions.set('map', 'mapear')
    this.functions.set('mapear', 'map')
    this.functions.set('reduce', 'reduzir')
    this.functions.set('reduzir', 'reduce')
    this.functions.set('forEach', 'paraCada')
    this.functions.set('paraCada', 'forEach')
    this.functions.set('wait', 'aguardar')
    this.functions.set('aguardar', 'wait')
    this.functions.set('sleep', 'dormir')
    this.functions.set('dormir', 'sleep')
    this.functions.set('delay', 'atrasar')
    this.functions.set('atrasar', 'delay')
  }

  // Traduzir token para português
  translateToPortuguese(token) {
    if (this.keywords.has(token)) {
      return this.keywords.get(token)
    }
    if (this.operators.has(token)) {
      return this.operators.get(token)
    }
    if (this.functions.has(token)) {
      return this.functions.get(token)
    }
    return token
  }

  // Traduzir token para inglês
  translateToEnglish(token) {
    // Buscar em todas as categorias
    for (const [key, value] of this.keywords) {
      if (value === token) return key
    }
    for (const [key, value] of this.operators) {
      if (value === token) return key
    }
    for (const [key, value] of this.functions) {
      if (value === token) return key
    }
    return token
  }

  // Detectar idioma do token
  detectLanguage(token) {
    if (this.keywords.has(token)) {
      return 'english'
    }
    if (this.operators.has(token)) {
      return 'english'
    }
    if (this.functions.has(token)) {
      return 'english'
    }
    
    // Verificar se é português
    for (const [key, value] of this.keywords) {
      if (value === token) return 'portuguese'
    }
    for (const [key, value] of this.operators) {
      if (value === token) return 'portuguese'
    }
    for (const [key, value] of this.functions) {
      if (value === token) return 'portuguese'
    }
    
    return 'unknown'
  }

  // Normalizar código para um idioma específico
  normalizeCode(code, targetLanguage = 'portuguese') {
    const lines = code.split('\n')
    const normalizedLines = []

    for (const line of lines) {
      const tokens = this.tokenizeLine(line)
      const normalizedTokens = []

      for (const token of tokens) {
        if (targetLanguage === 'portuguese') {
          normalizedTokens.push(this.translateToPortuguese(token))
        } else {
          normalizedTokens.push(this.translateToEnglish(token))
        }
      }

      normalizedLines.push(normalizedTokens.join(' '))
    }

    return normalizedLines.join('\n')
  }

  // Tokenizar linha
  tokenizeLine(line) {
    // Regex para capturar palavras, operadores e strings
    const regex = /(\w+)|([+\-*/=<>!&|]+)|("[^"]*"|'[^']*')|(\s+)/g
    const tokens = []
    let match

    while ((match = regex.exec(line)) !== null) {
      if (match[1]) { // Palavra
        tokens.push(match[1])
      } else if (match[2]) { // Operador
        tokens.push(match[2])
      } else if (match[3]) { // String
        tokens.push(match[3])
      } else if (match[4]) { // Espaço
        tokens.push(match[4])
      }
    }

    return tokens
  }

  // Adicionar mapeamento personalizado
  addMapping(english, portuguese, category = 'custom') {
    if (category === 'keyword') {
      this.keywords.set(english, portuguese)
      this.keywords.set(portuguese, english)
    } else if (category === 'operator') {
      this.operators.set(english, portuguese)
      this.operators.set(portuguese, english)
    } else if (category === 'function') {
      this.functions.set(english, portuguese)
      this.functions.set(portuguese, english)
    } else {
      // Categoria customizada
      if (!this[category]) {
        this[category] = new Map()
      }
      this[category].set(english, portuguese)
      this[category].set(portuguese, english)
    }
  }

  // Obter estatísticas de uso de idiomas
  getLanguageStats(code) {
    const lines = code.split('\n')
    let englishCount = 0
    let portugueseCount = 0
    let mixedCount = 0

    for (const line of lines) {
      const tokens = this.tokenizeLine(line)
      let hasEnglish = false
      let hasPortuguese = false

      for (const token of tokens) {
        const language = this.detectLanguage(token)
        if (language === 'english') hasEnglish = true
        if (language === 'portuguese') hasPortuguese = true
      }

      if (hasEnglish && hasPortuguese) {
        mixedCount++
      } else if (hasEnglish) {
        englishCount++
      } else if (hasPortuguese) {
        portugueseCount++
      }
    }

    return {
      totalLines: lines.length,
      englishLines: englishCount,
      portugueseLines: portugueseCount,
      mixedLines: mixedCount,
      englishPercentage: (englishCount / lines.length) * 100,
      portuguesePercentage: (portugueseCount / lines.length) * 100,
      mixedPercentage: (mixedCount / lines.length) * 100
    }
  }

  // Sugerir traduções para código
  suggestTranslations(code, targetLanguage = 'portuguese') {
    const suggestions = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const tokens = this.tokenizeLine(line)
      const lineSuggestions = []

      for (const token of tokens) {
        const currentLanguage = this.detectLanguage(token)
        if (currentLanguage !== targetLanguage && currentLanguage !== 'unknown') {
          const translation = targetLanguage === 'portuguese' 
            ? this.translateToPortuguese(token)
            : this.translateToEnglish(token)
          
          if (translation !== token) {
            lineSuggestions.push({
              original: token,
              translated: translation,
              position: line.indexOf(token)
            })
          }
        }
      }

      if (lineSuggestions.length > 0) {
        suggestions.push({
          line: i + 1,
          content: line,
          suggestions: lineSuggestions
        })
      }
    }

    return suggestions
  }

  // Converter código para modo bilíngue (manter ambos os idiomas)
  convertToBilingual(code) {
    const lines = code.split('\n')
    const bilingualLines = []

    for (const line of lines) {
      const tokens = this.tokenizeLine(line)
      const bilingualTokens = []

      for (const token of tokens) {
        const language = this.detectLanguage(token)
        if (language === 'english') {
          const portuguese = this.translateToPortuguese(token)
          if (portuguese !== token) {
            bilingualTokens.push(`${token}/*${portuguese}*/`)
          } else {
            bilingualTokens.push(token)
          }
        } else if (language === 'portuguese') {
          const english = this.translateToEnglish(token)
          if (english !== token) {
            bilingualTokens.push(`${token}/*${english}*/`)
          } else {
            bilingualTokens.push(token)
          }
        } else {
          bilingualTokens.push(token)
        }
      }

      bilingualLines.push(bilingualTokens.join(' '))
    }

    return bilingualLines.join('\n')
  }
}

module.exports = BilingualSystem