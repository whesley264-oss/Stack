# 🚀 Stack Extensão - Guia de Instalação

<div align="center">

![Stack Extensão](https://img.shields.io/badge/Stack%20Extensão-1.0.0-blue?style=for-the-badge&logo=javascript&logoColor=white)

**Escolha a instalação ideal para seu sistema!**

[![Global](https://img.shields.io/badge/Instalação-Global-green?style=for-the-badge)](#-instalação-global)
[![Termux](https://img.shields.io/badge/Instalação-Termux-purple?style=for-the-badge)](#-instalação-termux)

</div>

---

## 🎯 **Duas Opções de Instalação**

### 🌍 **1. Instalação Global** - Para qualquer sistema
- ✅ **PC, Mac, Linux, Windows (WSL)**
- ✅ **Detecção automática do sistema operacional**
- ✅ **Instalação inteligente de dependências**
- ✅ **Configuração otimizada por plataforma**

### 📱 **2. Instalação Termux** - Específica para Android
- ✅ **Otimizada 100% para Termux**
- ✅ **Interface touch-friendly**
- ✅ **Recursos específicos para mobile**
- ✅ **Integração com apps Android**

---

## 🌍 **Instalação Global**

### **Para qualquer sistema operacional:**

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
- 🤖 **Android (Termux)** - `pkg`
- 🪟 **Windows (WSL)** - `wsl`

### **Funcionalidades da Instalação Global:**
- ✅ **Detecção automática do OS**
- ✅ **Instalação de Node.js, Python, Git**
- ✅ **Configuração específica por plataforma**
- ✅ **Instalação global do comando `stk`**
- ✅ **Estrutura de projeto completa**
- ✅ **Exemplos prontos para usar**

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

### **Recursos Específicos do Termux:**
- ✅ **Interface otimizada para touch**
- ✅ **Integração com `termux-open`**
- ✅ **Compartilhamento com `termux-share`**
- ✅ **Scripts específicos para mobile**
- ✅ **Configuração de aliases úteis**
- ✅ **Backup automático**
- ✅ **Performance otimizada para mobile**

---

## 🎯 **Qual Escolher?**

### **Use Instalação Global se:**
- 🖥️ Você está em PC, Mac ou Linux
- 🌐 Quer usar em múltiplos sistemas
- 🔧 Prefere configuração automática
- 📦 Quer instalar dependências automaticamente

### **Use Instalação Termux se:**
- 📱 Você está no Android via Termux
- 🎯 Quer interface otimizada para mobile
- 📤 Quer compartilhar projetos facilmente
- 🔋 Quer performance otimizada para mobile

---

## 🚀 **Executores Disponíveis**

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
```

### **Comandos Específicos do Termux:**
```bash
# Abrir no navegador Android
termux-open http://localhost:3000

# Compartilhar projeto
termux-share projeto.tar.gz

# Fazer backup
./termux/backup.sh
```

---

## 🔧 **Configuração**

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

## 🎨 **Exemplos de Uso**

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

---

## 🆘 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Erro de Permissão**
```bash
# Dar permissão de execução
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

### **Logs e Debug:**
```bash
# Ver logs detalhados
stk run arquivo.stk --verbose

# Verificar instalação
stk --version
node --version
python3 --version
```

---

## 📚 **Documentação Completa**

- 📖 **[Tutorial Completo](TUTORIAL_COMPLETO.md)** - Guia detalhado
- ⚡ **[Início Rápido](INICIO_RAPIDO.md)** - Comece em 3 passos
- 🐍 **[Executor Python](EXECUTOR_README.md)** - Documentação do executor
- 📱 **[Termux Específico](README-TERMUX.md)** - Guia específico para Termux

---

## 🤝 **Suporte**

### **Canais de Suporte:**
- 📧 **Email**: suporte@stack-extension.com
- 💬 **Discord**: https://discord.gg/stack-extension
- 📖 **Documentação**: https://docs.stack-extension.com
- 🐛 **Issues**: https://github.com/stack-extension/stack-extension/issues

### **Comunidade:**
- 🌟 **GitHub Stars**: Mostre seu apoio
- 🍴 **Forks**: Contribua com o projeto
- 💬 **Discussions**: Participe das discussões
- 📝 **Wiki**: Compartilhe conhecimento

---

## 🎉 **Próximos Passos**

1. **Escolha sua instalação** (Global ou Termux)
2. **Execute o instalador** correspondente
3. **Teste com exemplos** prontos
4. **Explore as funcionalidades** únicas
5. **Compartilhe** seus projetos

**🚀 Bem-vindo ao futuro da programação com Stack Extensão!**