# 🚀 Stack Extensão - Instalação Completa

<div align="center">

![Stack Extensão](https://img.shields.io/badge/Stack%20Extensão-1.0.0-blue?style=for-the-badge&logo=javascript&logoColor=white)

**Duas versões especializadas para máxima compatibilidade e performance!**

[![Instalação Inteligente](https://img.shields.io/badge/Instalação-Inteligente-green?style=for-the-badge)](#-instalação-inteligente)
[![Global](https://img.shields.io/badge/Global-PC%20Mac%20Linux-orange?style=for-the-badge)](#-instalação-global)
[![Termux](https://img.shields.io/badge/Termux-Android-purple?style=for-the-badge)](#-instalação-termux)

</div>

---

## 🎯 **Resumo das Instalações**

### **1. Instalação Inteligente** (Recomendada)
- ✅ **Detecção automática** do sistema operacional
- ✅ **Escolha inteligente** da instalação ideal
- ✅ **Funciona em qualquer sistema**
- ✅ **Interface interativa** amigável

### **2. Instalação Global** - Para PC, Mac, Linux
- ✅ **Suporte completo** para desktop
- ✅ **Detecção automática** do OS
- ✅ **Instalação inteligente** de dependências
- ✅ **Configuração otimizada** por plataforma

### **3. Instalação Termux** - Específica para Android
- ✅ **Otimizada 100%** para Termux
- ✅ **Interface touch-friendly**
- ✅ **Recursos específicos** para mobile
- ✅ **Integração com apps** Android

---

## 🚀 **Instalação Inteligente** (Recomendada)

### **Para qualquer sistema:**

```bash
# 1. Clone o repositório
git clone https://github.com/stack-extension/stack-extension.git
cd stack-extension

# 2. Execute o instalador inteligente
./install.sh

# 3. Siga as instruções na tela
# O instalador detectará seu sistema e sugerirá a melhor opção
```

### **Opções de linha de comando:**
```bash
# Instalação automática (sem interação)
./install.sh --auto

# Forçar instalação Global
./install.sh --global

# Forçar instalação Termux
./install.sh --termux

# Ver ajuda
./install.sh --help
```

---

## 🌍 **Instalação Global**

### **Para PC, Mac, Linux, Windows (WSL):**

```bash
# 1. Clone o repositório
git clone https://github.com/stack-extension/stack-extension.git
cd stack-extension

# 2. Execute o instalador global
./install-global.sh

# 3. Pronto! 🎉
stk --help
```

### **Sistemas Suportados:**
- 🐧 **Ubuntu/Debian** - `apt-get`
- 🐧 **CentOS/RHEL** - `yum`
- 🐧 **Arch Linux** - `pacman`
- 🍎 **macOS** - `brew`
- 🪟 **Windows (WSL)** - `wsl`

### **Funcionalidades:**
- ✅ **Detecção automática** do sistema operacional
- ✅ **Instalação automática** de Node.js, Python, Git
- ✅ **Configuração específica** por plataforma
- ✅ **Instalação global** do comando `stk`
- ✅ **Estrutura completa** do projeto
- ✅ **Exemplos prontos** para usar

---

## 📱 **Instalação Termux**

### **Específica para Android via Termux:**

```bash
# 1. Clone o repositório
git clone https://github.com/stack-extension/stack-extension.git
cd stack-extension

# 2. Execute o instalador Termux
./install-termux.sh

# 3. Pronto! 🎉
stk --help
```

### **Recursos Específicos:**
- ✅ **Interface touch-friendly** - Otimizada para toque
- ✅ **Integração nativa** - `termux-open`, `termux-share`
- ✅ **Scripts específicos** - Para mobile
- ✅ **Aliases úteis** - Comandos simplificados
- ✅ **Backup automático** - Dos projetos
- ✅ **Performance mobile** - Otimizada para dispositivos móveis

---

## 🎨 **Executores Disponíveis**

### **1. Executor Global** (`executor.py`)
```bash
# Para qualquer sistema
python3 executor.py
```

**Funcionalidades:**
- Interface visual completa
- Suporte a todos os sistemas
- Detecção automática de tipo de projeto
- Hot-reload inteligente

### **2. Executor Termux** (`executor-termux.py`)
```bash
# Específico para Termux
python3 executor-termux.py
```

**Funcionalidades:**
- Interface otimizada para touch
- Integração com apps Android
- Compartilhamento nativo
- Backup automático
- Performance mobile

---

## 📋 **Comandos Após Instalação**

### **Comandos Básicos:**
```bash
# Ver ajuda
stk --help

# Executar arquivo
stk run arquivo.stk

# Modo desenvolvimento
stk dev arquivo.stk

# Compilar
stk compile arquivo.stk

# Analisar com IA
stk analyze arquivo.stk

# Traduzir código
stk translate arquivo.stk --to english
```

### **Comandos Específicos do Termux:**
```bash
# Abrir no navegador Android
termux-open http://localhost:3000

# Compartilhar projeto
termux-share projeto.tar.gz

# Fazer backup
./termux/backup.sh

# Abrir no navegador
./termux/open-browser.sh

# Compartilhar projeto
./termux/share-project.sh meu-projeto
```

---

## 🎯 **Exemplos de Uso**

### **Exemplo 1: Código Básico**
```stk
// hello-world.stk
imprimir("🚀 Olá, Stack Extensão!")
variavel resultado = 10 mais 5 vezes 2
imprimir("Resultado: " + resultado)
```

**Executar:**
```bash
stk run hello-world.stk
```

### **Exemplo 2: Aplicação Web**
```stk
// web-app.stk
componente MinhaApp {
    variavel contador = 0
    
    funcao incrementar() {
        this.contador = this.contador mais 1
    }
    
    funcao render() {
        retornar `<h1>Contador: ${this.contador}</h1>`
    }
}
```

**Executar:**
```bash
stk dev web-app.stk
# Acesse: http://localhost:3000
```

### **Exemplo 3: Código Bilíngue**
```stk
// bilingual.stk
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

**Executar:**
```bash
stk run bilingual.stk
```

---

## ⚙️ **Configuração**

### **Arquivo de Configuração Global:**
```javascript
// stack.config.js
module.exports = {
  version: "1.0.0",
  platform: "global",
  language: "pt",
  server: {
    port: 3000,
    host: "localhost"
  },
  global: {
    enabled: true,
    autoOpenBrowser: true,
    useSystemBrowser: true
  }
}
```

### **Arquivo de Configuração Termux:**
```javascript
// stack.config.js
module.exports = {
  version: "1.0.0",
  platform: "termux",
  language: "pt",
  server: {
    port: 3000,
    host: "localhost"
  },
  termux: {
    enabled: true,
    autoOpenBrowser: false,
    useTermuxOpen: true,
    touchOptimized: true,
    mobileFriendly: true,
    batteryOptimized: true
  }
}
```

---

## 🔧 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Erro de Permissão**
```bash
# Dar permissão de execução
chmod +x install.sh
chmod +x install-global.sh
chmod +x install-termux.sh
```

#### **2. Node.js não encontrado**
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm

# macOS
brew install node

# Termux
pkg install nodejs npm
```

#### **3. Python não encontrado**
```bash
# Ubuntu/Debian
sudo apt-get install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip

# macOS
brew install python

# Termux
pkg install python
```

#### **4. Porta em uso**
```bash
# Usar porta diferente
stk dev arquivo.stk --port 8080
```

### **Comandos de Diagnóstico:**
```bash
# Verificar instalação
stk --version
node --version
python3 --version

# Ver logs detalhados
stk run arquivo.stk --verbose

# Verificar sistema
uname -a
cat /etc/os-release
```

---

## 📚 **Documentação Completa**

- 📖 **[Tutorial Completo](TUTORIAL_COMPLETO.md)** - Guia detalhado passo a passo
- ⚡ **[Início Rápido](INICIO_RAPIDO.md)** - Comece em 3 passos
- 🐍 **[Executor Python](EXECUTOR_README.md)** - Documentação do executor
- 📱 **[Termux Específico](README-TERMUX.md)** - Guia específico para Termux
- 🌍 **[Instalação Global](README-INSTALACAO.md)** - Guia de instalação

---

## 🎉 **Vantagens de Cada Instalação**

### **Instalação Inteligente:**
- ✅ **Fácil de usar** - Detecta automaticamente
- ✅ **Flexível** - Escolhe a melhor opção
- ✅ **Universal** - Funciona em qualquer sistema
- ✅ **Interativa** - Interface amigável

### **Instalação Global:**
- ✅ **Completa** - Todas as funcionalidades
- ✅ **Otimizada** - Para desktop
- ✅ **Automática** - Instala dependências
- ✅ **Configurável** - Por plataforma

### **Instalação Termux:**
- ✅ **Mobile-first** - Otimizada para mobile
- ✅ **Touch-friendly** - Interface adaptada
- ✅ **Integrada** - Com apps Android
- ✅ **Performática** - Para dispositivos móveis

---

## 🚀 **Próximos Passos**

1. **Escolha sua instalação** (Inteligente, Global ou Termux)
2. **Execute o instalador** correspondente
3. **Teste com exemplos** prontos
4. **Explore as funcionalidades** únicas
5. **Compartilhe** seus projetos

**🚀 Bem-vindo ao futuro da programação com Stack Extensão!**