/**
 * Transpilador para Stack Extensão (.stk)
 * Converte código .stk para JavaScript e Python
 */

class Transpiler {
  constructor() {
    this.targetLanguage = 'javascript'
    this.options = {
      minify: false,
      sourceMaps: true,
      es6: true,
      pythonVersion: '3.8'
    }
  }

  // Transpilar AST para linguagem alvo
  transpile(ast, targetLanguage = 'javascript', options = {}) {
    this.targetLanguage = targetLanguage
    this.options = { ...this.options, ...options }

    switch (targetLanguage) {
      case 'javascript':
        return this.transpileToJavaScript(ast)
      case 'python':
        return this.transpileToPython(ast)
      case 'webassembly':
        return this.transpileToWebAssembly(ast)
      default:
        throw new Error(`Linguagem alvo não suportada: ${targetLanguage}`)
    }
  }

  // Transpilar para JavaScript
  transpileToJavaScript(ast) {
    const code = []
    const imports = new Set()
    
    // Processar cada declaração
    for (const statement of ast) {
      const jsCode = this.transpileStatement(statement, 'javascript')
      if (jsCode) {
        code.push(jsCode)
      }
    }

    // Adicionar imports necessários
    const importStatements = this.generateImports(imports)
    
    return {
      code: importStatements + '\n' + code.join('\n'),
      sourceMap: this.generateSourceMap(ast),
      imports: Array.from(imports)
    }
  }

  // Transpilar para Python
  transpileToPython(ast) {
    const code = []
    const imports = new Set()
    
    // Adicionar imports padrão do Python
    imports.add('import sys')
    imports.add('import os')
    imports.add('from typing import *')
    
    // Processar cada declaração
    for (const statement of ast) {
      const pyCode = this.transpileStatement(statement, 'python')
      if (pyCode) {
        code.push(pyCode)
      }
    }

    // Adicionar imports necessários
    const importStatements = Array.from(imports).join('\n')
    
    return {
      code: importStatements + '\n\n' + code.join('\n\n'),
      sourceMap: this.generateSourceMap(ast),
      imports: Array.from(imports)
    }
  }

  // Transpilar para WebAssembly
  transpileToWebAssembly(ast) {
    // WebAssembly é mais complexo, por enquanto retornar estrutura básica
    return {
      code: ';; WebAssembly transpilation not fully implemented yet',
      sourceMap: null,
      imports: []
    }
  }

  // Transpilar declaração individual
  transpileStatement(statement, targetLanguage) {
    if (!statement) return ''

    switch (statement.type) {
      case 'FunctionDeclaration':
        return this.transpileFunction(statement, targetLanguage)
      case 'ClassDeclaration':
        return this.transpileClass(statement, targetLanguage)
      case 'ComponentDeclaration':
        return this.transpileComponent(statement, targetLanguage)
      case 'VarDeclaration':
        return this.transpileVariable(statement, targetLanguage)
      case 'IfStatement':
        return this.transpileIf(statement, targetLanguage)
      case 'WhileStatement':
        return this.transpileWhile(statement, targetLanguage)
      case 'ForStatement':
        return this.transpileFor(statement, targetLanguage)
      case 'ReturnStatement':
        return this.transpileReturn(statement, targetLanguage)
      case 'ExpressionStatement':
        return this.transpileExpression(statement.expression, targetLanguage)
      case 'Block':
        return this.transpileBlock(statement, targetLanguage)
      default:
        return `// ${statement.type} not implemented`
    }
  }

  // Transpilar função
  transpileFunction(func, targetLanguage) {
    const name = func.name
    const params = func.parameters.map(p => p.value).join(', ')
    const body = this.transpileBlock(func.body, targetLanguage)

    if (targetLanguage === 'javascript') {
      if (this.options.es6) {
        return `function ${name}(${params}) {\n${this.indent(body)}\n}`
      } else {
        return `var ${name} = function(${params}) {\n${this.indent(body)}\n};`
      }
    } else if (targetLanguage === 'python') {
      return `def ${name}(${params}):\n${this.indent(body, 'python')}`
    }
  }

  // Transpilar classe
  transpileClass(cls, targetLanguage) {
    const name = cls.name
    const superclass = cls.superclass ? ` extends ${cls.superclass.value}` : ''
    const methods = cls.methods.map(method => 
      this.transpileStatement(method, targetLanguage)
    ).join('\n\n')

    if (targetLanguage === 'javascript') {
      if (this.options.es6) {
        return `class ${name}${superclass} {\n${this.indent(methods)}\n}`
      } else {
        // ES5 style
        return `function ${name}() {\n${this.indent('// Constructor')}\n}\n${methods}`
      }
    } else if (targetLanguage === 'python') {
      const superclassPy = cls.superclass ? `(${cls.superclass.value})` : ''
      return `class ${name}${superclassPy}:\n${this.indent(methods, 'python')}`
    }
  }

  // Transpilar componente
  transpileComponent(component, targetLanguage) {
    const name = component.name
    const methods = component.methods.map(method => 
      this.transpileStatement(method, targetLanguage)
    ).join('\n\n')

    if (targetLanguage === 'javascript') {
      // Usar React-like syntax
      return `class ${name} extends React.Component {\n${this.indent(methods)}\n}`
    } else if (targetLanguage === 'python') {
      // Usar framework web Python (Flask/Django)
      return `class ${name}:\n${this.indent(methods, 'python')}`
    }
  }

  // Transpilar variável
  transpileVariable(varDecl, targetLanguage) {
    const name = varDecl.name
    const isConst = varDecl.isConst
    const initializer = varDecl.initializer ? 
      ` = ${this.transpileExpression(varDecl.initializer, targetLanguage)}` : ''

    if (targetLanguage === 'javascript') {
      const keyword = isConst ? 'const' : 'let'
      return `${keyword} ${name}${initializer};`
    } else if (targetLanguage === 'python') {
      return `${name}${initializer}`
    }
  }

  // Transpilar if
  transpileIf(ifStmt, targetLanguage) {
    const condition = this.transpileExpression(ifStmt.condition, targetLanguage)
    const thenBranch = this.transpileStatement(ifStmt.thenBranch, targetLanguage)
    const elseBranch = ifStmt.elseBranch ? 
      this.transpileStatement(ifStmt.elseBranch, targetLanguage) : null

    if (targetLanguage === 'javascript') {
      let code = `if (${condition}) {\n${this.indent(thenBranch)}\n}`
      if (elseBranch) {
        code += ` else {\n${this.indent(elseBranch)}\n}`
      }
      return code
    } else if (targetLanguage === 'python') {
      let code = `if ${condition}:\n${this.indent(thenBranch, 'python')}`
      if (elseBranch) {
        code += `\nelse:\n${this.indent(elseBranch, 'python')}`
      }
      return code
    }
  }

  // Transpilar while
  transpileWhile(whileStmt, targetLanguage) {
    const condition = this.transpileExpression(whileStmt.condition, targetLanguage)
    const body = this.transpileStatement(whileStmt.body, targetLanguage)

    if (targetLanguage === 'javascript') {
      return `while (${condition}) {\n${this.indent(body)}\n}`
    } else if (targetLanguage === 'python') {
      return `while ${condition}:\n${this.indent(body, 'python')}`
    }
  }

  // Transpilar for
  transpileFor(forStmt, targetLanguage) {
    const initializer = forStmt.initializer ? 
      this.transpileStatement(forStmt.initializer, targetLanguage) : ''
    const condition = forStmt.condition ? 
      this.transpileExpression(forStmt.condition, targetLanguage) : ''
    const increment = forStmt.increment ? 
      this.transpileExpression(forStmt.increment, targetLanguage) : ''
    const body = this.transpileStatement(forStmt.body, targetLanguage)

    if (targetLanguage === 'javascript') {
      return `for (${initializer}; ${condition}; ${increment}) {\n${this.indent(body)}\n}`
    } else if (targetLanguage === 'python') {
      // Python for é diferente, assumir que é um range
      return `for i in range(${condition}):\n${this.indent(body, 'python')}`
    }
  }

  // Transpilar return
  transpileReturn(returnStmt, targetLanguage) {
    const value = returnStmt.value ? 
      this.transpileExpression(returnStmt.value, targetLanguage) : ''

    if (targetLanguage === 'javascript') {
      return `return ${value};`
    } else if (targetLanguage === 'python') {
      return `return ${value}`
    }
  }

  // Transpilar bloco
  transpileBlock(block, targetLanguage) {
    const statements = block.statements.map(stmt => 
      this.transpileStatement(stmt, targetLanguage)
    ).filter(stmt => stmt).join('\n')

    return statements
  }

  // Transpilar expressão
  transpileExpression(expr, targetLanguage) {
    if (!expr) return ''

    switch (expr.type) {
      case 'Literal':
        return this.transpileLiteral(expr, targetLanguage)
      case 'Variable':
        return expr.name
      case 'Binary':
        return this.transpileBinary(expr, targetLanguage)
      case 'Unary':
        return this.transpileUnary(expr, targetLanguage)
      case 'Call':
        return this.transpileCall(expr, targetLanguage)
      case 'Grouping':
        return `(${this.transpileExpression(expr.expression, targetLanguage)})`
      case 'Assign':
        return this.transpileAssign(expr, targetLanguage)
      case 'Logical':
        return this.transpileLogical(expr, targetLanguage)
      default:
        return `/* ${expr.type} not implemented */`
    }
  }

  // Transpilar literal
  transpileLiteral(literal, targetLanguage) {
    if (typeof literal.value === 'string') {
      return `"${literal.value}"`
    } else if (typeof literal.value === 'boolean') {
      return targetLanguage === 'python' ? 
        (literal.value ? 'True' : 'False') : 
        literal.value.toString()
    } else if (literal.value === null) {
      return targetLanguage === 'python' ? 'None' : 'null'
    } else {
      return literal.value.toString()
    }
  }

  // Transpilar operação binária
  transpileBinary(binary, targetLanguage) {
    const left = this.transpileExpression(binary.left, targetLanguage)
    const right = this.transpileExpression(binary.right, targetLanguage)
    const operator = this.transpileOperator(binary.operator, targetLanguage)

    return `${left} ${operator} ${right}`
  }

  // Transpilar operação unária
  transpileUnary(unary, targetLanguage) {
    const right = this.transpileExpression(unary.right, targetLanguage)
    const operator = this.transpileOperator(unary.operator, targetLanguage)

    return `${operator}${right}`
  }

  // Transpilar chamada de função
  transpileCall(call, targetLanguage) {
    const callee = this.transpileExpression(call.callee, targetLanguage)
    const args = call.arguments.map(arg => 
      this.transpileExpression(arg, targetLanguage)
    ).join(', ')

    return `${callee}(${args})`
  }

  // Transpilar atribuição
  transpileAssign(assign, targetLanguage) {
    const value = this.transpileExpression(assign.value, targetLanguage)
    return `${assign.name} = ${value}`
  }

  // Transpilar operação lógica
  transpileLogical(logical, targetLanguage) {
    const left = this.transpileExpression(logical.left, targetLanguage)
    const right = this.transpileExpression(logical.right, targetLanguage)
    const operator = this.transpileOperator(logical.operator, targetLanguage)

    return `${left} ${operator} ${right}`
  }

  // Transpilar operador
  transpileOperator(operator, targetLanguage) {
    const opValue = operator.value || operator.type

    // Mapear operadores matemáticos em português
    const operatorMap = {
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
      'e': targetLanguage === 'python' ? 'and' : '&&',
      'ou': targetLanguage === 'python' ? 'or' : '||',
      'nao': targetLanguage === 'python' ? 'not' : '!'
    }

    return operatorMap[opValue] || opValue
  }

  // Gerar imports
  generateImports(imports) {
    if (imports.size === 0) return ''

    const importList = Array.from(imports).map(imp => {
      if (this.targetLanguage === 'javascript') {
        return `import ${imp};`
      } else if (this.targetLanguage === 'python') {
        return `import ${imp}`
      }
    }).join('\n')

    return importList + '\n'
  }

  // Gerar source map
  generateSourceMap(ast) {
    // Implementação básica de source map
    return {
      version: 3,
      sources: ['input.stk'],
      names: [],
      mappings: 'AAAA'
    }
  }

  // Indentação
  indent(code, targetLanguage = 'javascript') {
    const indent = targetLanguage === 'python' ? '    ' : '  '
    return code.split('\n').map(line => indent + line).join('\n')
  }

  // Minificar código
  minify(code) {
    if (!this.options.minify) return code

    // Implementação básica de minificação
    return code
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/{\s*/g, '{')
      .replace(/\s*}/g, '}')
      .trim()
  }
}

module.exports = Transpiler