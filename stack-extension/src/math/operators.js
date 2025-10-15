/**
 * Sistema de Operadores Matemáticos Personalizáveis
 * Permite usar palavras em português para operações matemáticas
 */

class MathOperators {
  constructor() {
    this.operators = new Map()
    this.customOperators = new Map()
    this.initializeDefaultOperators()
  }

  initializeDefaultOperators() {
    // Operadores básicos em português
    this.operators.set('mais', {
      symbol: '+',
      precedence: 4,
      associativity: 'left',
      operation: (a, b) => a + b,
      description: 'Adição'
    })

    this.operators.set('menos', {
      symbol: '-',
      precedence: 4,
      associativity: 'left',
      operation: (a, b) => a - b,
      description: 'Subtração'
    })

    this.operators.set('vezes', {
      symbol: '*',
      precedence: 5,
      associativity: 'left',
      operation: (a, b) => a * b,
      description: 'Multiplicação'
    })

    this.operators.set('dividido', {
      symbol: '/',
      precedence: 5,
      associativity: 'left',
      operation: (a, b) => {
        if (b === 0) throw new Error('Divisão por zero')
        return a / b
      },
      description: 'Divisão'
    })

    this.operators.set('elevado', {
      symbol: '**',
      precedence: 6,
      associativity: 'right',
      operation: (a, b) => Math.pow(a, b),
      description: 'Exponenciação'
    })

    this.operators.set('modulo', {
      symbol: '%',
      precedence: 5,
      associativity: 'left',
      operation: (a, b) => {
        if (b === 0) throw new Error('Módulo por zero')
        return a % b
      },
      description: 'Módulo'
    })

    // Operadores de comparação
    this.operators.set('igual', {
      symbol: '==',
      precedence: 3,
      associativity: 'left',
      operation: (a, b) => a == b,
      description: 'Igualdade'
    })

    this.operators.set('diferente', {
      symbol: '!=',
      precedence: 3,
      associativity: 'left',
      operation: (a, b) => a != b,
      description: 'Diferença'
    })

    this.operators.set('maior', {
      symbol: '>',
      precedence: 3,
      associativity: 'left',
      operation: (a, b) => a > b,
      description: 'Maior que'
    })

    this.operators.set('menor', {
      symbol: '<',
      precedence: 3,
      associativity: 'left',
      operation: (a, b) => a < b,
      description: 'Menor que'
    })

    this.operators.set('maior_igual', {
      symbol: '>=',
      precedence: 3,
      associativity: 'left',
      operation: (a, b) => a >= b,
      description: 'Maior ou igual'
    })

    this.operators.set('menor_igual', {
      symbol: '<=',
      precedence: 3,
      associativity: 'left',
      operation: (a, b) => a <= b,
      description: 'Menor ou igual'
    })

    // Operadores lógicos
    this.operators.set('e', {
      symbol: '&&',
      precedence: 2,
      associativity: 'left',
      operation: (a, b) => a && b,
      description: 'E lógico'
    })

    this.operators.set('ou', {
      symbol: '||',
      precedence: 1,
      associativity: 'left',
      operation: (a, b) => a || b,
      description: 'OU lógico'
    })

    this.operators.set('nao', {
      symbol: '!',
      precedence: 7,
      associativity: 'right',
      operation: (a) => !a,
      description: 'NÃO lógico',
      unary: true
    })

    // Operadores matemáticos avançados
    this.operators.set('raiz', {
      symbol: '√',
      precedence: 7,
      associativity: 'right',
      operation: (a, b) => Math.pow(b, 1/a),
      description: 'Raiz n-ésima',
      unary: false
    })

    this.operators.set('logaritmo', {
      symbol: 'log',
      precedence: 7,
      associativity: 'right',
      operation: (a, b) => Math.log(b) / Math.log(a),
      description: 'Logaritmo'
    })

    this.operators.set('seno', {
      symbol: 'sin',
      precedence: 7,
      associativity: 'right',
      operation: (a) => Math.sin(a),
      description: 'Seno',
      unary: true
    })

    this.operators.set('cosseno', {
      symbol: 'cos',
      precedence: 7,
      associativity: 'right',
      operation: (a) => Math.cos(a),
      description: 'Cosseno',
      unary: true
    })

    this.operators.set('tangente', {
      symbol: 'tan',
      precedence: 7,
      associativity: 'right',
      operation: (a) => Math.tan(a),
      description: 'Tangente',
      unary: true
    })
  }

  // Adicionar operador personalizado
  addCustomOperator(name, config) {
    if (this.operators.has(name) || this.customOperators.has(name)) {
      throw new Error(`Operador '${name}' já existe`)
    }

    const operator = {
      symbol: config.symbol || name,
      precedence: config.precedence || 4,
      associativity: config.associativity || 'left',
      operation: config.operation,
      description: config.description || `Operador personalizado: ${name}`,
      unary: config.unary || false
    }

    this.customOperators.set(name, operator)
    return operator
  }

  // Remover operador personalizado
  removeCustomOperator(name) {
    return this.customOperators.delete(name)
  }

  // Obter operador
  getOperator(name) {
    return this.operators.get(name) || this.customOperators.get(name)
  }

  // Verificar se operador existe
  hasOperator(name) {
    return this.operators.has(name) || this.customOperators.has(name)
  }

  // Obter símbolo do operador
  getSymbol(name) {
    const operator = this.getOperator(name)
    return operator ? operator.symbol : name
  }

  // Executar operação
  executeOperation(operatorName, ...args) {
    const operator = this.getOperator(operatorName)
    if (!operator) {
      throw new Error(`Operador '${operatorName}' não encontrado`)
    }

    if (operator.unary && args.length !== 1) {
      throw new Error(`Operador '${operatorName}' é unário e requer exatamente 1 argumento`)
    }

    if (!operator.unary && args.length !== 2) {
      throw new Error(`Operador '${operatorName}' requer exatamente 2 argumentos`)
    }

    try {
      return operator.operation(...args)
    } catch (error) {
      throw new Error(`Erro ao executar operação '${operatorName}': ${error.message}`)
    }
  }

  // Listar todos os operadores
  listOperators() {
    const allOperators = new Map()
    
    // Adicionar operadores padrão
    for (const [name, op] of this.operators) {
      allOperators.set(name, { ...op, custom: false })
    }
    
    // Adicionar operadores personalizados
    for (const [name, op] of this.customOperators) {
      allOperators.set(name, { ...op, custom: true })
    }
    
    return allOperators
  }

  // Configurar operadores a partir de arquivo JSON
  loadOperatorsFromConfig(config) {
    if (config.customOperators) {
      for (const [name, opConfig] of Object.entries(config.customOperators)) {
        this.addCustomOperator(name, opConfig)
      }
    }
  }

  // Salvar configuração de operadores
  saveOperatorsToConfig() {
    const config = {
      customOperators: {}
    }

    for (const [name, operator] of this.customOperators) {
      config.customOperators[name] = {
        symbol: operator.symbol,
        precedence: operator.precedence,
        associativity: operator.associativity,
        description: operator.description,
        unary: operator.unary
      }
    }

    return config
  }

  // Validar expressão matemática
  validateExpression(expression) {
    const tokens = this.tokenizeExpression(expression)
    return this.validateTokens(tokens)
  }

  tokenizeExpression(expression) {
    const tokens = []
    const words = expression.split(/\s+/)
    
    for (const word of words) {
      if (this.hasOperator(word)) {
        tokens.push({ type: 'operator', value: word })
      } else if (!isNaN(word)) {
        tokens.push({ type: 'number', value: parseFloat(word) })
      } else if (word.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
        tokens.push({ type: 'variable', value: word })
      } else {
        tokens.push({ type: 'unknown', value: word })
      }
    }
    
    return tokens
  }

  validateTokens(tokens) {
    let expectedType = 'operand'
    let parenCount = 0
    
    for (const token of tokens) {
      if (token.type === 'unknown') {
        return { valid: false, error: `Token desconhecido: ${token.value}` }
      }
      
      if (expectedType === 'operand') {
        if (token.type === 'number' || token.type === 'variable') {
          expectedType = 'operator'
        } else if (token.value === '(') {
          parenCount++
        } else {
          return { valid: false, error: 'Esperado operando' }
        }
      } else if (expectedType === 'operator') {
        if (token.type === 'operator') {
          expectedType = 'operand'
        } else if (token.value === ')') {
          if (parenCount === 0) {
            return { valid: false, error: 'Parênteses desbalanceados' }
          }
          parenCount--
        } else {
          return { valid: false, error: 'Esperado operador' }
        }
      }
    }
    
    if (parenCount !== 0) {
      return { valid: false, error: 'Parênteses desbalanceados' }
    }
    
    return { valid: true }
  }
}

module.exports = MathOperators