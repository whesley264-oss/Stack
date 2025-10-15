# Stack Extensão (.stk)

Uma linguagem de programação super específica que combina o melhor do JavaScript e Python com funcionalidades únicas que nenhuma outra linguagem possui.

## Características Únicas

### 🧮 Operadores Matemáticos Personalizáveis
- Use palavras em português para operações matemáticas
- `mais` em vez de `+`
- `menos` em vez de `-`
- `vezes` em vez de `*`
- `dividido` em vez de `/`
- `elevado` em vez de `**`

### 🌐 Funcionalidades Web Avançadas
- Sistema de componentes web integrado
- APIs simplificadas para desenvolvimento web
- Suporte nativo para WebSockets e APIs modernas

### 📦 Sistema de Módulos Inteligente
- Importação automática de dependências
- Sistema de namespaces avançado
- Hot-reload nativo

### 🔧 Sintaxe Simplificada
- Palavras-chave em português e inglês
- Sistema de tipos dinâmico mas inteligente
- Debugging integrado

## Instalação

```bash
npm install -g stack-extension
```

## Uso Básico

```bash
stk run arquivo.stk
stk compile arquivo.stk
stk dev arquivo.stk
```

## Exemplos

### Matemática Personalizada
```stk
// Operadores em português
resultado = 10 mais 5 vezes 2
// resultado = 20

potencia = 2 elevado 8
// potencia = 256
```

### Web Components
```stk
componente MeuBotao {
  render() {
    return <button onclick={this.clique}>Clique aqui</button>
  }
  
  clique() {
    console.log("Botão clicado!")
  }
}
```

### Módulos
```stk
import { calcular, validar } from "matematica"
import { Componente } from "web"

export class MinhaClasse {
  metodo() {
    return calcular(10, 20)
  }
}
```

## Transpilação

Stack Extensão transpila para:
- JavaScript (para frontend)
- Python (para backend)
- WebAssembly (para performance)

## Contribuição

Contribuições são bem-vindas! Veja o arquivo CONTRIBUTING.md para mais detalhes.