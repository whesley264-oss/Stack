# 🚀 Stack Extensão

<div align="center">

![Stack Extensão Logo](https://img.shields.io/badge/Stack%20Extensão-1.0.0-blue?style=for-the-badge&logo=javascript&logoColor=white)

**A super linguagem de programação única que combina o melhor do JavaScript e Python com funcionalidades revolucionárias!**

[![Instalação](https://img.shields.io/badge/Instalação-3%20passos-green?style=for-the-badge)](#-instalação-rápida)
[![Tutorial](https://img.shields.io/badge/Tutorial-Completo-orange?style=for-the-badge)](#-tutorial-completo)
[![Exemplos](https://img.shields.io/badge/Exemplos-Práticos-purple?style=for-the-badge)](#-exemplos-práticos)

</div>

---

## ✨ Funcionalidades Únicas

### 🌍 **Código Bilíngue**
Escreva código em português e inglês simultaneamente - a única linguagem que permite isso!

```stk
// Misture português e inglês naturalmente
funcao calculateSum(numeros) {
    se (numeros.length igual 0) {
        retornar 0
    }
    
    variavel soma = 0
    for (let i = 0; i < numeros.length; i++) {
        soma = soma + numeros[i]
    }
    
    return soma
}
```

### 🧮 **Operadores Matemáticos em Português**
Use palavras em português para operações matemáticas:

```stk
variavel resultado = 10 mais 5 vezes 2        // 20
variavel potencia = 2 elevado 8                // 256
variavel divisao = 100 dividido 4              // 25
variavel resto = 15 modulo 4                   // 3
```

### 🤖 **IA Integrada Nativa**
IA nativa para desenvolvimento, debugging e otimização:

```stk
// Completamento automático
funcao calcular( // IA sugere: a, b) {
    // IA sugere: retornar a mais b
    retornar a mais b
}

// Análise automática de bugs
variavel x = 10
variavel y = 0
variavel resultado = x dividido y // IA detecta: divisão por zero
```

### 🌐 **Editor Web Completo**
Desenvolvimento completo no navegador com hot-reload:

```bash
stk web  # Inicia editor web em http://localhost:3000
```

### 👥 **Colaboração em Tempo Real**
Trabalhe em equipe com sincronização instantânea:

```bash
stk share  # Compartilhar projeto
stk join projeto-abc123  # Entrar em projeto
```

---

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone https://github.com/stack-extension/stack-extension.git
cd stack-extension
```

### 2. Execute o Instalador Automático
```bash
./install.sh
```

### 3. Pronto! 🎉
```bash
stk run examples/hello-world.stk
```

**Ou use o instalador manual:**
```bash
npm install
npm install -g .
```

---

## 🎯 Primeiro Programa

Crie um arquivo `meu-programa.stk`:

```stk
// Meu primeiro programa Stack Extensão
imprimir("Olá, Stack Extensão!")

variavel nome = "Desenvolvedor"
variavel resultado = 10 mais 5 vezes 2

imprimir("Bem-vindo, " + nome + "!")
imprimir("Resultado: " + resultado)

// Função em português
funcao calcularMedia(numeros) {
    se (numeros.length igual 0) {
        retornar 0
    }
    
    variavel soma = 0
    para (variavel i = 0; i menor numeros.length; i = i mais 1) {
        soma = soma mais numeros[i]
    }
    
    retornar soma dividido numeros.length
}

// Usar a função
variavel notas = [8.5, 7.0, 9.0, 6.5]
variavel media = calcularMedia(notas)
imprimir("Média: " + media)
```

Execute:
```bash
stk run meu-programa.stk
```

---

## 📚 Comandos Essenciais

```bash
# Executar arquivo
stk run arquivo.stk

# Modo desenvolvimento com hot-reload
stk dev arquivo.stk

# Editor web completo
stk web

# Compilar para JavaScript
stk compile arquivo.stk

# Traduzir código
stk translate arquivo.stk --to english

# Analisar com IA
stk analyze arquivo.stk

# Compartilhar projeto
stk share

# Ajuda completa
stk --help
```

---

## 🌐 Editor Web

Inicie o editor web completo com todas as funcionalidades:

```bash
stk web
```

**Funcionalidades do Editor:**
- ✅ Syntax highlighting para Stack Extensão
- ✅ Auto-complete inteligente
- ✅ Tradução em tempo real (PT ↔ EN)
- ✅ Execução instantânea (Ctrl+Enter)
- ✅ Hot-reload automático
- ✅ Terminal integrado
- ✅ Gerenciador de arquivos
- ✅ Temas personalizáveis
- ✅ Colaboração em tempo real

---

## 👥 Colaboração e Compartilhamento

### Compartilhar Projeto
```bash
stk share
# Gera link: https://stack-extension.com/share/abc123
```

### Colaboração em Tempo Real
```bash
stk join projeto-abc123
stk collaborators  # Ver colaboradores online
```

**Funcionalidades de Colaboração:**
- 🔄 Código sincronizado em tempo real
- 👀 Cursor compartilhado
- 💬 Chat integrado
- 📝 Histórico de mudanças
- 🤖 Resolução de conflitos com IA
- 🔐 Controle de permissões

---

## 🧮 Operadores Matemáticos

### Operações Básicas
```stk
variavel a = 10
variavel b = 5

// Adição
variavel soma = a mais b        // 15

// Subtração  
variavel sub = a menos b        // 5

// Multiplicação
variavel mult = a vezes b       // 50

// Divisão
variavel div = a dividido b     // 2

// Exponenciação
variavel pot = a elevado b      // 100000

// Módulo
variavel mod = a modulo b       // 0
```

### Comparações e Lógicos
```stk
// Comparações
variavel maior = a maior b      // verdadeiro
variavel igual = a igual b      // falso
variavel dif = a diferente b    // verdadeiro

// Lógicos
variavel e = verdadeiro e falso // falso
variavel ou = verdadeiro ou falso // verdadeiro
variavel nao = nao verdadeiro   // falso
```

---

## 🤖 IA Integrada

### Completamento de Código
```stk
// Digite "funcao calcular(" e a IA sugere:
funcao calcular(a, b) {
    // IA sugere: retornar a mais b
    retornar a mais b
}
```

### Análise de Código
```bash
# Análise completa
stk analyze meu-codigo.stk

# Análise de performance
stk analyze meu-codigo.stk --performance

# Análise de segurança
stk analyze meu-codigo.stk --security
```

### Geração de Código
```bash
# Gerar função a partir de descrição
stk generate "criar função que calcula fatorial"
```

---

## 📁 Estrutura de Projeto

```
meu-projeto/
├── src/
│   ├── main.stk           # Arquivo principal
│   ├── utils.stk          # Utilitários
│   └── components.stk     # Componentes
├── public/
│   ├── index.html
│   └── style.css
├── stack.config.js        # Configuração
└── package.json
```

---

## ⚙️ Configuração

Crie `stack.config.js`:

```javascript
module.exports = {
  language: "portuguese",
  ai: { enabled: true },
  server: { port: 3000 },
  bilingual: { enabled: true }
}
```

---

## 📖 Documentação Completa

- 📚 **[Tutorial Completo](TUTORIAL_COMPLETO.md)** - Guia detalhado passo a passo
- ⚡ **[Início Rápido](INICIO_RAPIDO.md)** - Comece em 3 passos
- 🔧 **[Configuração](stack.config.example.js)** - Exemplo de configuração
- 💡 **[Exemplos](examples/)** - Exemplos práticos

---

## 🎯 Exemplos Práticos

### Calculadora Avançada
```stk
componente Calculadora {
    variavel display = "0"
    variavel operacao = nulo
    
    funcao numero(num) {
        se (this.display igual "0") {
            this.display = num.toString()
        } senao {
            this.display = this.display + num.toString()
        }
    }
    
    funcao operacao(op) {
        this.primeiroNumero = parseFloat(this.display)
        this.operacao = op
        this.display = "0"
    }
    
    funcao igual() {
        variavel segundoNumero = parseFloat(this.display)
        variavel resultado = 0
        
        se (this.operacao igual "mais") {
            resultado = this.primeiroNumero + segundoNumero
        } senao se (this.operacao igual "menos") {
            resultado = this.primeiroNumero - segundoNumero
        } senao se (this.operacao igual "vezes") {
            resultado = this.primeiroNumero * segundoNumero
        } senao se (this.operacao igual "dividido") {
            resultado = this.primeiroNumero / segundoNumero
        }
        
        this.display = resultado.toString()
    }
}
```

### Sistema de Gerenciamento
```stk
variavel pessoas = []

funcao adicionarPessoa(nome, idade, cidade) {
    variavel pessoa = {
        nome: nome,
        idade: idade,
        cidade: cidade,
        id: pessoas.length mais 1
    }
    
    pessoas.push(pessoa)
    imprimir("Pessoa adicionada: " + nome)
}

funcao listarPessoas() {
    imprimir("=== Lista de Pessoas ===")
    
    para (variavel i = 0; i menor pessoas.length; i = i mais 1) {
        variavel p = pessoas[i]
        imprimir("ID: " + p.id + " | Nome: " + p.nome + " | Idade: " + p.idade)
    }
}
```

---

## 🆘 Suporte

### Problemas Comuns

**Erro de instalação:**
```bash
sudo npm install -g .
```

**Porta em uso:**
```bash
stk dev arquivo.stk --port 8080
```

**Verificar instalação:**
```bash
stk --version
```

### Canais de Suporte
- 📧 **Email**: suporte@stack-extension.com
- 💬 **Discord**: https://discord.gg/stack-extension
- 📖 **Documentação**: https://docs.stack-extension.com
- 🐛 **Issues**: https://github.com/stack-extension/stack-extension/issues

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Veja nosso [guia de contribuição](CONTRIBUTING.md).

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🎉 Agradecimentos

- Comunidade Stack Extensão
- Contribuidores do projeto
- Usuários que testam e reportam bugs
- Desenvolvedores que inspiram inovação

---

<div align="center">

**🚀 Stack Extensão - A linguagem de programação que você sempre sonhou!**

[![GitHub stars](https://img.shields.io/github/stars/stack-extension/stack-extension?style=social)](https://github.com/stack-extension/stack-extension)
[![GitHub forks](https://img.shields.io/github/forks/stack-extension/stack-extension?style=social)](https://github.com/stack-extension/stack-extension)
[![GitHub watchers](https://img.shields.io/github/watchers/stack-extension/stack-extension?style=social)](https://github.com/stack-extension/stack-extension)

</div>