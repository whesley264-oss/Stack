/**
 * Tokenizer para Stack Extensão (.stk)
 * Suporta operadores matemáticos em português e sintaxe híbrida JS/Python
 */

class Tokenizer {
  constructor() {
    this.tokens = []
    this.current = 0
    this.source = ''
    
    // Operadores matemáticos em português
    this.mathOperators = {
      'mais': '+',
      'menos': '-',
      'vezes': '*',
      'dividido': '/',
      'elevado': '**',
      'modulo': '%',
      'igual': '==',
      'diferente': '!=',
      'maior': '>',
      'menor': '<',
      'maior_igual': '>=',
      'menor_igual': '<=',
      'e': '&&',
      'ou': '||',
      'nao': '!'
    }
    
    // Palavras-chave da linguagem
    this.keywords = {
      'se': 'IF',
      'senao': 'ELSE',
      'enquanto': 'WHILE',
      'para': 'FOR',
      'funcao': 'FUNCTION',
      'classe': 'CLASS',
      'componente': 'COMPONENT',
      'importar': 'IMPORT',
      'exportar': 'EXPORT',
      'de': 'FROM',
      'como': 'AS',
      'retornar': 'RETURN',
      'variavel': 'VAR',
      'constante': 'CONST',
      'verdadeiro': 'TRUE',
      'falso': 'FALSE',
      'nulo': 'NULL',
      'vazio': 'UNDEFINED',
      'tentar': 'TRY',
      'capturar': 'CATCH',
      'finalmente': 'FINALLY',
      'lançar': 'THROW',
      'novo': 'NEW',
      'isto': 'THIS',
      'super': 'SUPER',
      'estatico': 'STATIC',
      'publico': 'PUBLIC',
      'privado': 'PRIVATE',
      'protegido': 'PROTECTED'
    }
  }

  tokenize(source) {
    this.source = source
    this.tokens = []
    this.current = 0

    while (!this.isAtEnd()) {
      this.scanToken()
    }

    this.tokens.push({ type: 'EOF', value: null, line: this.line })
    return this.tokens
  }

  scanToken() {
    const char = this.advance()

    switch (char) {
      case '(': this.addToken('LEFT_PAREN'); break
      case ')': this.addToken('RIGHT_PAREN'); break
      case '{': this.addToken('LEFT_BRACE'); break
      case '}': this.addToken('RIGHT_BRACE'); break
      case '[': this.addToken('LEFT_BRACKET'); break
      case ']': this.addToken('RIGHT_BRACKET'); break
      case ',': this.addToken('COMMA'); break
      case '.': this.addToken('DOT'); break
      case ';': this.addToken('SEMICOLON'); break
      case ':': this.addToken('COLON'); break
      case '?': this.addToken('QUESTION'); break
      case '!': this.addToken('BANG'); break
      case '=': this.addToken(this.match('=') ? 'EQUAL_EQUAL' : 'EQUAL'); break
      case '<': this.addToken(this.match('=') ? 'LESS_EQUAL' : 'LESS'); break
      case '>': this.addToken(this.match('=') ? 'GREATER_EQUAL' : 'GREATER'); break
      case '+': this.addToken('PLUS'); break
      case '-': this.addToken('MINUS'); break
      case '*': this.addToken(this.match('*') ? 'STAR_STAR' : 'STAR'); break
      case '/': 
        if (this.match('/')) {
          // Comentário de linha
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance()
        } else if (this.match('*')) {
          // Comentário de bloco
          while (!this.isAtEnd()) {
            if (this.peek() === '*' && this.peekNext() === '/') {
              this.advance()
              this.advance()
              break
            }
            this.advance()
          }
        } else {
          this.addToken('SLASH')
        }
        break
      case '%': this.addToken('PERCENT'); break
      case '&': this.addToken(this.match('&') ? 'AND' : 'AMPERSAND'); break
      case '|': this.addToken(this.match('|') ? 'OR' : 'PIPE'); break
      case ' ': case '\r': case '\t': break
      case '\n': this.line++; break
      case '"': this.string('"'); break
      case "'": this.string("'"); break
      case '`': this.templateString(); break
      default:
        if (this.isDigit(char)) {
          this.number()
        } else if (this.isAlpha(char)) {
          this.identifier()
        } else {
          throw new Error(`Caractere inesperado: ${char}`)
        }
    }
  }

  identifier() {
    let text = ''
    while (this.isAlphaNumeric(this.peek())) {
      text += this.advance()
    }

    // Verificar se é uma palavra-chave
    if (this.keywords[text]) {
      this.addToken(this.keywords[text])
    } else if (this.mathOperators[text]) {
      this.addToken('MATH_OPERATOR', this.mathOperators[text])
    } else {
      this.addToken('IDENTIFIER', text)
    }
  }

  number() {
    let text = ''
    while (this.isDigit(this.peek())) {
      text += this.advance()
    }

    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      text += this.advance()
      while (this.isDigit(this.peek())) {
        text += this.advance()
      }
    }

    this.addToken('NUMBER', parseFloat(text))
  }

  string(quote) {
    let value = ''
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\\') {
        this.advance()
        switch (this.advance()) {
          case 'n': value += '\n'; break
          case 't': value += '\t'; break
          case 'r': value += '\r'; break
          case '\\': value += '\\'; break
          case '"': value += '"'; break
          case "'": value += "'"; break
          default: value += this.peek(); break
        }
      } else {
        value += this.advance()
      }
    }

    if (this.isAtEnd()) {
      throw new Error('String não terminada')
    }

    this.advance() // Consumir a aspas de fechamento
    this.addToken('STRING', value)
  }

  templateString() {
    let value = ''
    while (this.peek() !== '`' && !this.isAtEnd()) {
      if (this.peek() === '\\') {
        this.advance()
        value += this.advance()
      } else if (this.peek() === '$' && this.peekNext() === '{') {
        this.advance() // Consumir $
        this.advance() // Consumir {
        value += '${'
      } else {
        value += this.advance()
      }
    }

    if (this.isAtEnd()) {
      throw new Error('Template string não terminada')
    }

    this.advance() // Consumir `
    this.addToken('TEMPLATE_STRING', value)
  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  advance() {
    return this.source[this.current++]
  }

  peek() {
    if (this.isAtEnd()) return '\0'
    return this.source[this.current]
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0'
    return this.source[this.current + 1]
  }

  match(expected) {
    if (this.isAtEnd()) return false
    if (this.source[this.current] !== expected) return false
    this.current++
    return true
  }

  isDigit(char) {
    return char >= '0' && char <= '9'
  }

  isAlpha(char) {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z') ||
           char === '_' || char === '$'
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char)
  }

  addToken(type, value = null) {
    this.tokens.push({
      type,
      value,
      line: this.line
    })
  }
}

module.exports = Tokenizer