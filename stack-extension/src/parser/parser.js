/**
 * Parser para Stack Extensão (.stk)
 * Constrói uma AST (Abstract Syntax Tree) a partir dos tokens
 */

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.current = 0
  }

  parse() {
    const statements = []
    while (!this.isAtEnd()) {
      statements.push(this.declaration())
    }
    return statements
  }

  declaration() {
    try {
      if (this.match('FUNCTION')) return this.functionDeclaration()
      if (this.match('CLASS')) return this.classDeclaration()
      if (this.match('COMPONENT')) return this.componentDeclaration()
      if (this.match('VAR', 'CONST')) return this.varDeclaration()
      return this.statement()
    } catch (error) {
      this.synchronize()
      return null
    }
  }

  functionDeclaration() {
    const name = this.consume('IDENTIFIER', 'Esperado nome da função')
    this.consume('LEFT_PAREN', 'Esperado "(" após nome da função')
    
    const parameters = []
    if (!this.check('RIGHT_PAREN')) {
      do {
        if (parameters.length >= 255) {
          throw new Error('Não pode ter mais de 255 parâmetros')
        }
        parameters.push(this.consume('IDENTIFIER', 'Esperado nome do parâmetro'))
      } while (this.match('COMMA'))
    }
    
    this.consume('RIGHT_PAREN', 'Esperado ")" após parâmetros')
    this.consume('LEFT_BRACE', 'Esperado "{" antes do corpo da função')
    
    const body = this.block()
    
    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      body
    }
  }

  classDeclaration() {
    const name = this.consume('IDENTIFIER', 'Esperado nome da classe')
    
    let superclass = null
    if (this.match('LESS')) {
      this.consume('IDENTIFIER', 'Esperado nome da superclasse')
      superclass = this.previous()
    }
    
    this.consume('LEFT_BRACE', 'Esperado "{" antes do corpo da classe')
    
    const methods = []
    while (!this.check('RIGHT_BRACE') && !this.isAtEnd()) {
      methods.push(this.functionDeclaration())
    }
    
    this.consume('RIGHT_BRACE', 'Esperado "}" após corpo da classe')
    
    return {
      type: 'ClassDeclaration',
      name,
      superclass,
      methods
    }
  }

  componentDeclaration() {
    const name = this.consume('IDENTIFIER', 'Esperado nome do componente')
    this.consume('LEFT_BRACE', 'Esperado "{" antes do corpo do componente')
    
    const methods = []
    while (!this.check('RIGHT_BRACE') && !this.isAtEnd()) {
      if (this.check('IDENTIFIER') && this.peekNext().value === 'LEFT_PAREN') {
        methods.push(this.functionDeclaration())
      } else {
        this.advance()
      }
    }
    
    this.consume('RIGHT_BRACE', 'Esperado "}" após corpo do componente')
    
    return {
      type: 'ComponentDeclaration',
      name,
      methods
    }
  }

  varDeclaration() {
    const isConst = this.previous().type === 'CONST'
    const name = this.consume('IDENTIFIER', 'Esperado nome da variável')
    
    let initializer = null
    if (this.match('EQUAL')) {
      initializer = this.expression()
    }
    
    this.consume('SEMICOLON', 'Esperado ";" após declaração de variável')
    
    return {
      type: 'VarDeclaration',
      name,
      initializer,
      isConst
    }
  }

  statement() {
    if (this.match('IF')) return this.ifStatement()
    if (this.match('WHILE')) return this.whileStatement()
    if (this.match('FOR')) return this.forStatement()
    if (this.match('RETURN')) return this.returnStatement()
    if (this.match('LEFT_BRACE')) return this.block()
    if (this.match('TRY')) return this.tryStatement()
    return this.expressionStatement()
  }

  ifStatement() {
    this.consume('LEFT_PAREN', 'Esperado "(" após if')
    const condition = this.expression()
    this.consume('RIGHT_PAREN', 'Esperado ")" após condição do if')
    
    const thenBranch = this.statement()
    let elseBranch = null
    if (this.match('ELSE')) {
      elseBranch = this.statement()
    }
    
    return {
      type: 'IfStatement',
      condition,
      thenBranch,
      elseBranch
    }
  }

  whileStatement() {
    this.consume('LEFT_PAREN', 'Esperado "(" após while')
    const condition = this.expression()
    this.consume('RIGHT_PAREN', 'Esperado ")" após condição do while')
    
    const body = this.statement()
    
    return {
      type: 'WhileStatement',
      condition,
      body
    }
  }

  forStatement() {
    this.consume('LEFT_PAREN', 'Esperado "(" após for')
    
    let initializer = null
    if (!this.match('SEMICOLON')) {
      if (this.match('VAR', 'CONST')) {
        initializer = this.varDeclaration()
      } else {
        initializer = this.expressionStatement()
      }
    }
    
    let condition = null
    if (!this.check('SEMICOLON')) {
      condition = this.expression()
    }
    this.consume('SEMICOLON', 'Esperado ";" após condição do for')
    
    let increment = null
    if (!this.check('RIGHT_PAREN')) {
      increment = this.expression()
    }
    this.consume('RIGHT_PAREN', 'Esperado ")" após cláusulas do for')
    
    const body = this.statement()
    
    return {
      type: 'ForStatement',
      initializer,
      condition,
      increment,
      body
    }
  }

  returnStatement() {
    const value = !this.check('SEMICOLON') ? this.expression() : null
    this.consume('SEMICOLON', 'Esperado ";" após return')
    
    return {
      type: 'ReturnStatement',
      value
    }
  }

  tryStatement() {
    this.consume('LEFT_BRACE', 'Esperado "{" após try')
    const tryBlock = this.block()
    
    let catchBlock = null
    if (this.match('CATCH')) {
      this.consume('LEFT_PAREN', 'Esperado "(" após catch')
      const error = this.consume('IDENTIFIER', 'Esperado nome do erro')
      this.consume('RIGHT_PAREN', 'Esperado ")" após nome do erro')
      this.consume('LEFT_BRACE', 'Esperado "{" após catch')
      catchBlock = this.block()
    }
    
    let finallyBlock = null
    if (this.match('FINALLY')) {
      this.consume('LEFT_BRACE', 'Esperado "{" após finally')
      finallyBlock = this.block()
    }
    
    return {
      type: 'TryStatement',
      tryBlock,
      catchBlock,
      finallyBlock
    }
  }

  block() {
    const statements = []
    
    while (!this.check('RIGHT_BRACE') && !this.isAtEnd()) {
      statements.push(this.declaration())
    }
    
    this.consume('RIGHT_BRACE', 'Esperado "}" após bloco')
    
    return {
      type: 'Block',
      statements
    }
  }

  expressionStatement() {
    const expr = this.expression()
    this.consume('SEMICOLON', 'Esperado ";" após expressão')
    
    return {
      type: 'ExpressionStatement',
      expression: expr
    }
  }

  expression() {
    return this.assignment()
  }

  assignment() {
    const expr = this.or()
    
    if (this.match('EQUAL')) {
      const value = this.assignment()
      
      if (expr.type === 'Variable') {
        return {
          type: 'Assign',
          name: expr.name,
          value
        }
      }
      
      throw new Error('Alvo de atribuição inválido')
    }
    
    return expr
  }

  or() {
    let expr = this.and()
    
    while (this.match('OR', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.and()
      expr = {
        type: 'Logical',
        left: expr,
        operator,
        right
      }
    }
    
    return expr
  }

  and() {
    let expr = this.equality()
    
    while (this.match('AND', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.equality()
      expr = {
        type: 'Logical',
        left: expr,
        operator,
        right
      }
    }
    
    return expr
  }

  equality() {
    let expr = this.comparison()
    
    while (this.match('BANG_EQUAL', 'EQUAL_EQUAL', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.comparison()
      expr = {
        type: 'Binary',
        left: expr,
        operator,
        right
      }
    }
    
    return expr
  }

  comparison() {
    let expr = this.term()
    
    while (this.match('GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.term()
      expr = {
        type: 'Binary',
        left: expr,
        operator,
        right
      }
    }
    
    return expr
  }

  term() {
    let expr = this.factor()
    
    while (this.match('MINUS', 'PLUS', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.factor()
      expr = {
        type: 'Binary',
        left: expr,
        operator,
        right
      }
    }
    
    return expr
  }

  factor() {
    let expr = this.unary()
    
    while (this.match('SLASH', 'STAR', 'STAR_STAR', 'PERCENT', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.unary()
      expr = {
        type: 'Binary',
        left: expr,
        operator,
        right
      }
    }
    
    return expr
  }

  unary() {
    if (this.match('BANG', 'MINUS', 'MATH_OPERATOR')) {
      const operator = this.previous()
      const right = this.unary()
      return {
        type: 'Unary',
        operator,
        right
      }
    }
    
    return this.call()
  }

  call() {
    let expr = this.primary()
    
    while (true) {
      if (this.match('LEFT_PAREN')) {
        expr = this.finishCall(expr)
      } else if (this.match('DOT')) {
        const name = this.consume('IDENTIFIER', 'Esperado nome da propriedade')
        expr = {
          type: 'Get',
          object: expr,
          name
        }
      } else {
        break
      }
    }
    
    return expr
  }

  finishCall(callee) {
    const arguments = []
    
    if (!this.check('RIGHT_PAREN')) {
      do {
        if (arguments.length >= 255) {
          throw new Error('Não pode ter mais de 255 argumentos')
        }
        arguments.push(this.expression())
      } while (this.match('COMMA'))
    }
    
    const paren = this.consume('RIGHT_PAREN', 'Esperado ")" após argumentos')
    
    return {
      type: 'Call',
      callee,
      arguments
    }
  }

  primary() {
    if (this.match('FALSE')) return { type: 'Literal', value: false }
    if (this.match('TRUE')) return { type: 'Literal', value: true }
    if (this.match('NULL')) return { type: 'Literal', value: null }
    if (this.match('UNDEFINED')) return { type: 'Literal', value: undefined }
    
    if (this.match('NUMBER', 'STRING', 'TEMPLATE_STRING')) {
      return {
        type: 'Literal',
        value: this.previous().value
      }
    }
    
    if (this.match('IDENTIFIER')) {
      return {
        type: 'Variable',
        name: this.previous().value
      }
    }
    
    if (this.match('LEFT_PAREN')) {
      const expr = this.expression()
      this.consume('RIGHT_PAREN', 'Esperado ")" após expressão')
      return {
        type: 'Grouping',
        expression: expr
      }
    }
    
    throw new Error('Esperado expressão')
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }
    return false
  }

  check(type) {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  advance() {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  isAtEnd() {
    return this.peek().type === 'EOF'
  }

  peek() {
    return this.tokens[this.current]
  }

  previous() {
    return this.tokens[this.current - 1]
  }

  consume(type, message) {
    if (this.check(type)) return this.advance()
    throw new Error(message)
  }

  synchronize() {
    this.advance()
    
    while (!this.isAtEnd()) {
      if (this.previous().type === 'SEMICOLON') return
      
      switch (this.peek().type) {
        case 'CLASS':
        case 'FUNCTION':
        case 'VAR':
        case 'CONST':
        case 'IF':
        case 'WHILE':
        case 'FOR':
        case 'RETURN':
          return
      }
      
      this.advance()
    }
  }
}

module.exports = Parser