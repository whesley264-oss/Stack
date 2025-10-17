# 🚀 Stack Extensão - Tutorial Completo

## 📋 Índice
1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Primeiros Passos](#primeiros-passos)
4. [Sintaxe Básica](#sintaxe-básica)
5. [Operadores Matemáticos](#operadores-matemáticos)
6. [Código Bilíngue](#código-bilíngue)
7. [IA Integrada](#ia-integrada)
8. [Editor Web](#editor-web)
9. [Compartilhamento e Colaboração](#compartilhamento-e-colaboração)
10. [Exemplos Práticos](#exemplos-práticos)
11. [Projetos Avançados](#projetos-avançados)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Introdução

**Stack Extensão** é uma super linguagem de programação que combina o melhor do JavaScript e Python com funcionalidades únicas que nenhuma outra linguagem possui:

- ✅ **Código Bilíngue**: Escreva em português e inglês simultaneamente
- ✅ **Operadores em Português**: Use `mais`, `vezes`, `dividido` em vez de símbolos
- ✅ **IA Integrada**: Completamento, análise e otimização automática
- ✅ **Editor Web**: Desenvolvimento completo no navegador
- ✅ **Hot-reload**: Mudanças aplicadas instantaneamente
- ✅ **Colaboração**: Trabalhe em equipe em tempo real
- ✅ **Mini Servidor**: Servidor web integrado

---

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Git

### 1. Clonar o Repositório

```bash
# Clonar o repositório
git clone https://github.com/stack-extension/stack-extension.git

# Entrar na pasta
cd stack-extension

# Instalar dependências
npm install
```

### 2. Instalação Global (Opcional)

```bash
# Instalar globalmente para usar o comando 'stk' em qualquer lugar
npm install -g .

# Verificar instalação
stk --version
```

### 3. Verificar Instalação

```bash
# Verificar se tudo está funcionando
npm test

# Executar exemplo básico
stk run examples/hello-world.stk
```

---

## 🚀 Primeiros Passos

### 1. Criar Seu Primeiro Arquivo

Crie um arquivo chamado `meu-primeiro-programa.stk`:

```stk
// Meu primeiro programa Stack Extensão
imprimir("Olá, Stack Extensão!")

variavel nome = "Desenvolvedor"
imprimir("Bem-vindo, " + nome + "!")
```

### 2. Executar o Programa

```bash
# Executar arquivo
stk run meu-primeiro-programa.stk

# Ou compilar para JavaScript
stk compile meu-primeiro-programa.stk
```

### 3. Modo Desenvolvimento

```bash
# Iniciar modo desenvolvimento com hot-reload
stk dev meu-primeiro-programa.stk
```

Isso iniciará um servidor web em `http://localhost:3000` com hot-reload automático!

---

## 📝 Sintaxe Básica

### Variáveis

```stk
// Declaração de variáveis
variavel nome = "João"
variavel idade = 25
variavel ativo = verdadeiro

// Constantes
constante PI = 3.14159
constante VERSÃO = "1.0.0"

// Múltiplas variáveis
variavel a = 10, b = 20, c = 30
```

### Funções

```stk
// Função básica
funcao saudar(nome) {
    retornar "Olá, " + nome + "!"
}

// Função com múltiplos parâmetros
funcao calcular(a, b, operacao) {
    se (operacao igual "soma") {
        retornar a mais b
    } senao se (operacao igual "subtracao") {
        retornar a menos b
    }
}

// Chamar função
variavel resultado = saudar("Maria")
imprimir(resultado)
```

### Estruturas de Controle

```stk
// Condicionais
variavel idade = 18

se (idade maior igual 18) {
    imprimir("Maior de idade")
} senao {
    imprimir("Menor de idade")
}

// Loops
variavel numeros = [1, 2, 3, 4, 5]

// Loop for
para (variavel i = 0; i menor numeros.length; i = i mais 1) {
    imprimir("Número: " + numeros[i])
}

// Loop while
variavel contador = 0
enquanto (contador menor 5) {
    imprimir("Contador: " + contador)
    contador = contador mais 1
}
```

### Arrays e Objetos

```stk
// Arrays
variavel frutas = ["maçã", "banana", "laranja"]
variavel numeros = [1, 2, 3, 4, 5]

// Acessar elementos
imprimir(frutas[0]) // maçã
imprimir(numeros[2]) // 3

// Adicionar elementos
frutas.push("uva")
numeros.push(6)

// Objetos
variavel pessoa = {
    nome: "João",
    idade: 30,
    cidade: "São Paulo"
}

imprimir(pessoa.nome) // João
imprimir(pessoa["idade"]) // 30
```

---

## 🧮 Operadores Matemáticos

### Operadores Básicos

```stk
variavel a = 10
variavel b = 3

// Adição
variavel soma = a mais b // 13

// Subtração
variavel subtracao = a menos b // 7

// Multiplicação
variavel multiplicacao = a vezes b // 30

// Divisão
variavel divisao = a dividido b // 3.33...

// Exponenciação
variavel potencia = a elevado b // 1000

// Módulo
variavel resto = a modulo b // 1
```

### Operadores de Comparação

```stk
variavel x = 10
variavel y = 5

// Igualdade
variavel igual = x igual y // falso

// Diferença
variavel diferente = x diferente y // verdadeiro

// Maior que
variavel maior = x maior y // verdadeiro

// Menor que
variavel menor = x menor y // falso

// Maior ou igual
variavel maior_igual = x maior_igual y // verdadeiro

// Menor ou igual
variavel menor_igual = x menor_igual y // falso
```

### Operadores Lógicos

```stk
variavel p = verdadeiro
variavel q = falso

// E lógico
variavel e_logico = p e q // falso

// OU lógico
variavel ou_logico = p ou q // verdadeiro

// NÃO lógico
variavel nao_p = nao p // falso
variavel nao_q = nao q // verdadeiro
```

### Expressões Complexas

```stk
// Ordem de precedência
variavel resultado1 = 10 mais 5 vezes 2 // 20 (5*2=10, 10+10=20)
variavel resultado2 = (10 mais 5) vezes 2 // 30 (15*2=30)

// Expressões com múltiplos operadores
variavel expressao = 2 elevado 3 mais 4 vezes 5 // 28 (8+20=28)

// Operações com arrays
variavel numeros = [1, 2, 3, 4, 5]
variavel soma_total = 0

para (variavel i = 0; i menor numeros.length; i = i mais 1) {
    soma_total = soma_total mais numeros[i]
}

imprimir("Soma total: " + soma_total) // 15
```

---

## 🌍 Código Bilíngue

### Misturando Português e Inglês

```stk
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

// Função em inglês
function calculateSum(numbers) {
    if (numbers.length === 0) {
        return 0
    }
    
    let sum = 0
    for (let i = 0; i < numbers.length; i++) {
        sum = sum + numbers[i]
    }
    
    return sum
}

// Função híbrida
funcao processData(dados) {
    const resultado = []
    
    for (let i = 0; i < dados.length; i++) {
        se (dados[i].tipo igual "numero") {
            resultado.push(dados[i].valor vezes 2)
        } senao {
            resultado.push(dados[i].valor.toUpperCase())
        }
    }
    
    return resultado
}
```

### Tradução Automática

```bash
# Traduzir arquivo para inglês
stk translate arquivo.stk --to english

# Traduzir arquivo para português
stk translate arquivo.stk --to portuguese

# Detectar idioma do arquivo
stk detect-language arquivo.stk
```

### Configuração de Idioma

```stk
// No início do arquivo
# language: portuguese
# auto-translate: true

// Ou usar configuração global
variavel config = {
    idioma: "portuguese",
    traducao_automatica: verdadeiro,
    sugestoes: verdadeiro
}
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

// Digite "se (" e a IA sugere:
se (condicao) {
    // IA sugere: imprimir("condição verdadeira")
    imprimir("condição verdadeira")
}
```

### Análise de Código

```stk
// Analisar código com IA
stk analyze meu-codigo.stk

// Análise de performance
stk analyze meu-codigo.stk --performance

// Análise de segurança
stk analyze meu-codigo.stk --security

// Análise completa
stk analyze meu-codigo.stk --all
```

### Geração de Código

```stk
// Gerar função a partir de descrição
stk generate "criar função que calcula fatorial"

// Resultado gerado:
funcao fatorial(n) {
    se (n menor igual 1) {
        retornar 1
    }
    retornar n vezes fatorial(n menos 1)
}
```

### Debugging Inteligente

```stk
// Código com erro
variavel x = 10
variavel y = 0
variavel resultado = x dividido y // IA detecta: divisão por zero

// IA sugere correção:
se (y diferente 0) {
    variavel resultado = x dividido y
} senao {
    imprimir("Erro: Divisão por zero")
}
```

---

## 🌐 Editor Web

### Iniciar Editor Web

```bash
# Iniciar editor web completo
stk web

# Ou com opções específicas
stk web --port 8080 --theme dark
```

### Funcionalidades do Editor

1. **Syntax Highlighting**: Destaque de sintaxe para Stack Extensão
2. **Auto-complete**: Completamento automático inteligente
3. **Tradução em Tempo Real**: Alternar entre português e inglês
4. **Execução Instantânea**: Executar código com Ctrl+Enter
5. **Hot-reload**: Mudanças aplicadas automaticamente
6. **Terminal Integrado**: Console integrado
7. **Gerenciador de Arquivos**: Navegar entre arquivos
8. **Temas**: Tema escuro, claro, Monokai

### Exemplo de Uso no Editor

```stk
// 1. Digite o código
funcao calcularIdade(anoNascimento) {
    variavel anoAtual = 2024
    retornar anoAtual menos anoNascimento
}

// 2. Pressione Ctrl+Enter para executar
variavel idade = calcularIdade(1990)
imprimir("Idade: " + idade)

// 3. Use Ctrl+Shift+T para traduzir
// 4. Use Ctrl+Shift+A para analisar com IA
// 5. Use Ctrl+S para salvar
```

---

## 👥 Compartilhamento e Colaboração

### Compartilhar Projeto

```bash
# Compartilhar projeto atual
stk share

# Compartilhar com senha
stk share --password minha-senha

# Compartilhar publicamente
stk share --public
```

### Colaboração em Tempo Real

```stk
// Entrar em projeto compartilhado
stk join projeto-abc123

// Ver colaboradores online
stk collaborators

// Sincronizar código
stk sync

// Sair do projeto
stk leave
```

### Funcionalidades de Colaboração

1. **Código Sincronizado**: Mudanças aplicadas em tempo real
2. **Cursor Compartilhado**: Veja onde outros estão editando
3. **Chat Integrado**: Comunicar com colaboradores
4. **Histórico de Mudanças**: Ver quem fez o quê
5. **Resolução de Conflitos**: IA ajuda a resolver conflitos
6. **Permissões**: Controle quem pode editar/executar

---

## 💡 Exemplos Práticos

### 1. Calculadora Simples

```stk
// calculadora.stk
funcao calculadora() {
    imprimir("=== Calculadora Stack Extensão ===")
    
    variavel a = 10
    variavel b = 5
    
    imprimir("a = " + a + ", b = " + b)
    imprimir("a mais b = " + (a mais b))
    imprimir("a menos b = " + (a menos b))
    imprimir("a vezes b = " + (a vezes b))
    imprimir("a dividido b = " + (a dividido b))
    imprimir("a elevado b = " + (a elevado b))
}

calculadora()
```

### 2. Sistema de Gerenciamento de Pessoas

```stk
// pessoas.stk
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
        imprimir("ID: " + p.id + " | Nome: " + p.nome + " | Idade: " + p.idade + " | Cidade: " + p.cidade)
    }
}

funcao buscarPessoa(nome) {
    para (variavel i = 0; i menor pessoas.length; i = i mais 1) {
        se (pessoas[i].nome igual nome) {
            retornar pessoas[i]
        }
    }
    retornar nulo
}

// Usar o sistema
adicionarPessoa("João", 30, "São Paulo")
adicionarPessoa("Maria", 25, "Rio de Janeiro")
adicionarPessoa("Pedro", 35, "Belo Horizonte")

listarPessoas()

variavel pessoa = buscarPessoa("Maria")
se (pessoa diferente nulo) {
    imprimir("Pessoa encontrada: " + pessoa.nome)
}
```

### 3. Jogo da Adivinhação

```stk
// adivinhacao.stk
funcao jogoAdivinhacao() {
    imprimir("=== Jogo da Adivinhação ===")
    imprimir("Pensei em um número entre 1 e 100. Tente adivinhar!")
    
    variavel numeroSecreto = Math.floor(Math.random() * 100) mais 1
    variavel tentativas = 0
    variavel acertou = falso
    
    enquanto (nao acertou) {
        variavel palpite = parseInt(prompt("Digite seu palpite: "))
        tentativas = tentativas mais 1
        
        se (palpite igual numeroSecreto) {
            acertou = verdadeiro
            imprimir("Parabéns! Você acertou em " + tentativas + " tentativas!")
        } senao se (palpite maior numeroSecreto) {
            imprimir("Muito alto! Tente novamente.")
        } senao {
            imprimir("Muito baixo! Tente novamente.")
        }
    }
}

jogoAdivinhacao()
```

### 4. Sistema de Notas

```stk
// notas.stk
variavel alunos = []

funcao adicionarAluno(nome) {
    variavel aluno = {
        nome: nome,
        notas: [],
        media: 0
    }
    
    alunos.push(aluno)
    imprimir("Aluno adicionado: " + nome)
}

funcao adicionarNota(nomeAluno, nota) {
    para (variavel i = 0; i menor alunos.length; i = i mais 1) {
        se (alunos[i].nome igual nomeAluno) {
            alunos[i].notas.push(nota)
            calcularMedia(i)
            imprimir("Nota " + nota + " adicionada para " + nomeAluno)
            retornar
        }
    }
    imprimir("Aluno não encontrado: " + nomeAluno)
}

funcao calcularMedia(indiceAluno) {
    variavel aluno = alunos[indiceAluno]
    variavel soma = 0
    
    para (variavel i = 0; i menor aluno.notas.length; i = i mais 1) {
        soma = soma mais aluno.notas[i]
    }
    
    aluno.media = soma dividido aluno.notas.length
}

funcao listarAlunos() {
    imprimir("=== Lista de Alunos ===")
    
    para (variavel i = 0; i menor alunos.length; i = i mais 1) {
        variavel aluno = alunos[i]
        imprimir("Nome: " + aluno.nome + " | Notas: " + aluno.notas.join(", ") + " | Média: " + aluno.media.toFixed(2))
    }
}

// Usar o sistema
adicionarAluno("João")
adicionarAluno("Maria")

adicionarNota("João", 8.5)
adicionarNota("João", 7.0)
adicionarNota("João", 9.0)

adicionarNota("Maria", 6.5)
adicionarNota("Maria", 8.0)
adicionarNota("Maria", 7.5)

listarAlunos()
```

---

## 🚀 Projetos Avançados

### 1. Aplicação Web Completa

```stk
// app-web.stk
importar { WebEditor } from "editor"
importar { ProjectSharing } from "sharing"

// Configurar aplicação
variavel app = {
    nome: "Minha App Stack",
    versao: "1.0.0",
    tema: "dark"
}

// Componente principal
componente AppPrincipal {
    variavel titulo = "Bem-vindo à Stack Extensão!"
    variavel contador = 0
    
    funcao render() {
        retornar `
            <div class="app">
                <header>
                    <h1>{{titulo}}</h1>
                    <nav>
                        <a href="#/home">Home</a>
                        <a href="#/sobre">Sobre</a>
                        <a href="#/contato">Contato</a>
                    </nav>
                </header>
                <main>
                    <div class="contador">
                        <h2>Contador: {{contador}}</h2>
                        <button onclick="this.incrementar()">Incrementar</button>
                        <button onclick="this.decrementar()">Decrementar</button>
                        <button onclick="this.resetar()">Resetar</button>
                    </div>
                </main>
            </div>
        `
    }
    
    funcao incrementar() {
        this.contador = this.contador mais 1
    }
    
    funcao decrementar() {
        this.contador = this.contador menos 1
    }
    
    funcao resetar() {
        this.contador = 0
    }
}

// Inicializar aplicação
variavel appPrincipal = novo AppPrincipal()
appPrincipal.render()
```

### 2. API REST Simples

```stk
// api.stk
importar { MiniServer } from "server"

variavel server = novo MiniServer({
    port: 3000,
    api: true
})

// Dados em memória
variavel produtos = [
    { id: 1, nome: "Produto 1", preco: 10.50 },
    { id: 2, nome: "Produto 2", preco: 25.00 },
    { id: 3, nome: "Produto 3", preco: 15.75 }
]

// Rota GET /api/produtos
server.get('/api/produtos', (req, res) => {
    res.json(produtos)
})

// Rota GET /api/produtos/:id
server.get('/api/produtos/:id', (req, res) => {
    variavel id = parseInt(req.params.id)
    variavel produto = produtos.find(p => p.id igual id)
    
    se (produto) {
        res.json(produto)
    } senao {
        res.status(404).json({ erro: "Produto não encontrado" })
    }
})

// Rota POST /api/produtos
server.post('/api/produtos', (req, res) => {
    variavel novoProduto = {
        id: produtos.length mais 1,
        nome: req.body.nome,
        preco: req.body.preco
    }
    
    produtos.push(novoProduto)
    res.status(201).json(novoProduto)
})

// Iniciar servidor
server.start()
```

### 3. Sistema de Chat em Tempo Real

```stk
// chat.stk
importar { RealTimeCollaboration } from "collaboration"

variavel chat = {
    mensagens: [],
    usuarios: [],
    usuarioAtual: "Usuário Anônimo"
}

funcao enviarMensagem(texto) {
    variavel mensagem = {
        id: Date.now(),
        texto: texto,
        usuario: chat.usuarioAtual,
        timestamp: new Date()
    }
    
    chat.mensagens.push(mensagem)
    renderizarMensagens()
}

funcao renderizarMensagens() {
    variavel container = document.getElementById('mensagens')
    container.innerHTML = ''
    
    para (variavel i = 0; i menor chat.mensagens.length; i = i mais 1) {
        variavel msg = chat.mensagens[i]
        variavel div = document.createElement('div')
        div.className = 'mensagem'
        div.innerHTML = `
            <strong>${msg.usuario}:</strong> ${msg.texto}
            <small>${msg.timestamp.toLocaleTimeString()}</small>
        `
        container.appendChild(div)
    }
    
    container.scrollTop = container.scrollHeight
}

// Configurar colaboração
variavel colaboracao = novo RealTimeCollaboration({
    onCodeChanged: (data) => {
        // Sincronizar mensagens
        chat.mensagens = data.mensagens
        renderizarMensagens()
    }
})

colaboracao.joinProject('chat-room-123')
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Instalação

```bash
# Se der erro de permissão
sudo npm install -g .

# Ou usar npx
npx stack-extension run arquivo.stk
```

#### 2. Porta já em uso

```bash
# Usar porta diferente
stk dev arquivo.stk --port 8080

# Ou matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

#### 3. Erro de Compilação

```stk
// Verificar sintaxe
stk check arquivo.stk

// Ver logs detalhados
stk run arquivo.stk --verbose
```

#### 4. Problemas de Tradução

```bash
# Resetar configurações de tradução
stk config --reset-translation

# Verificar idioma detectado
stk detect-language arquivo.stk
```

### Logs e Debug

```bash
# Habilitar logs detalhados
export STACK_DEBUG=true
stk run arquivo.stk

# Ver logs do servidor
stk dev arquivo.stk --log-level debug

# Verificar status dos serviços
stk status
```

### Suporte

- 📧 Email: suporte@stack-extension.com
- 💬 Discord: https://discord.gg/stack-extension
- 📖 Documentação: https://docs.stack-extension.com
- 🐛 Issues: https://github.com/stack-extension/stack-extension/issues

---

## 🎉 Conclusão

Parabéns! Você agora conhece todas as funcionalidades únicas da **Stack Extensão**:

- ✅ **Sintaxe Intuitiva**: Código em português e inglês
- ✅ **Operadores Naturais**: `mais`, `vezes`, `dividido`
- ✅ **IA Integrada**: Desenvolvimento assistido
- ✅ **Editor Web**: Desenvolvimento completo no navegador
- ✅ **Colaboração**: Trabalho em equipe em tempo real
- ✅ **Hot-reload**: Desenvolvimento ágil
- ✅ **Mini Servidor**: Deploy instantâneo

**Stack Extensão** é mais que uma linguagem - é uma plataforma completa de desenvolvimento que torna a programação mais acessível, intuitiva e produtiva!

🚀 **Comece agora mesmo e experimente o futuro da programação!**