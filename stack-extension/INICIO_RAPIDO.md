# 🚀 Stack Extensão - Início Rápido

## ⚡ Instalação em 3 Passos

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
```

Execute:
```bash
stk run meu-programa.stk
```

---

## 🌐 Editor Web

Inicie o editor web completo:
```bash
stk web
```

Acesse: http://localhost:3000

---

## 📚 Comandos Essenciais

```bash
# Executar arquivo
stk run arquivo.stk

# Modo desenvolvimento
stk dev arquivo.stk

# Compilar para JavaScript
stk compile arquivo.stk

# Editor web
stk web

# Traduzir código
stk translate arquivo.stk --to english

# Analisar com IA
stk analyze arquivo.stk

# Compartilhar projeto
stk share

# Ajuda
stk --help
```

---

## 🧮 Operadores em Português

```stk
variavel a = 10
variavel b = 5

// Operações básicas
variavel soma = a mais b        // 15
variavel sub = a menos b        // 5
variavel mult = a vezes b       // 50
variavel div = a dividido b     // 2
variavel pot = a elevado b      // 100000
variavel mod = a modulo b       // 0

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

## 🌍 Código Bilíngue

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

---

## 🤖 IA Integrada

```stk
// A IA completa automaticamente
funcao calcular( // IA sugere: a, b) {
    // IA sugere: retornar a mais b
    retornar a mais b
}

// Análise automática
stk analyze meu-codigo.stk
```

---

## 👥 Colaboração

```bash
# Compartilhar projeto
stk share

# Entrar em projeto
stk join projeto-abc123

# Ver colaboradores
stk collaborators
```

---

## 📁 Estrutura de Projeto

```
meu-projeto/
├── src/
│   ├── main.stk
│   ├── utils.stk
│   └── components.stk
├── public/
│   ├── index.html
│   └── style.css
├── stack.config.js
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

## 🆘 Ajuda Rápida

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

### Suporte
- 📖 Tutorial completo: `TUTORIAL_COMPLETO.md`
- 💬 Discord: https://discord.gg/stack-extension
- 📧 Email: suporte@stack-extension.com

---

## 🎉 Próximos Passos

1. **Leia o tutorial completo**: `TUTORIAL_COMPLETO.md`
2. **Explore os exemplos**: `examples/`
3. **Teste o editor web**: `stk web`
4. **Experimente a IA**: `stk analyze`
5. **Compartilhe projetos**: `stk share`

**🚀 Bem-vindo ao futuro da programação com Stack Extensão!**