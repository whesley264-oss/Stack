# 📱 Stack Extensão - Termux Edition

<div align="center">

![Stack Extensão Termux](https://img.shields.io/badge/Stack%20Extensão-Termux%20Edition-purple?style=for-the-badge&logo=android&logoColor=white)

**A super linguagem de programação otimizada 100% para Android via Termux!**

[![Termux](https://img.shields.io/badge/Termux-Android-green?style=for-the-badge&logo=android)](https://termux.com)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)

</div>

---

## 🎯 **Por que Termux Edition?**

### **Otimizações Específicas para Mobile:**
- 📱 **Interface touch-friendly** - Otimizada para toque
- 🔋 **Battery saver** - Economia de bateria
- 📤 **Integração nativa** - `termux-open`, `termux-share`
- 🚀 **Performance mobile** - Otimizada para dispositivos móveis
- 🎨 **Temas mobile** - Visual adaptado para telas pequenas

### **Recursos Únicos do Termux:**
- ✅ **Compartilhamento nativo** com apps Android
- ✅ **Abertura automática** no navegador Android
- ✅ **Backup automático** dos projetos
- ✅ **Scripts específicos** para mobile
- ✅ **Aliases úteis** para desenvolvimento
- ✅ **Configuração otimizada** para touch

---

## 🚀 **Instalação no Termux**

### **1. Instalação Rápida:**
```bash
# Clone o repositório
git clone https://github.com/stack-extension/stack-extension.git
cd stack-extension

# Execute o instalador Termux
./install-termux.sh

# Pronto! 🎉
stk --help
```

### **2. Instalação Manual:**
```bash
# Atualizar Termux
pkg update && pkg upgrade

# Instalar dependências
pkg install nodejs npm python git curl wget

# Instalar projeto
npm install
npm install -g .

# Testar
stk --help
```

---

## 🎨 **Interface Otimizada para Termux**

### **Banner Específico:**
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              📱 STACK EXTENSÃO - TERMUX EDITION             ║
║                                                              ║
║        A super linguagem de programação única!              ║
║                                                              ║
║  • Otimizado 100% para Android via Termux                  ║
║  • Interface touch-friendly                                 ║
║  • Recursos específicos para mobile                         ║
║  • Integração com apps Android                              ║
║  • Performance otimizada para dispositivos móveis          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### **Menu Otimizado:**
```
📋 MENU PRINCIPAL - TERMUX
═══════════════════════════════════════════════════════════════

1. Executar arquivo .stk
2. Executar servidor web
3. Compilar para JavaScript
4. Compilar para Python
5. Analisar código com IA
6. Traduzir código
7. Ver exemplos
8. Configurações
9. Ajuda
a. Abrir no navegador Android
b. Compartilhar projeto
c. Fazer backup
0. Sair
```

---

## 📱 **Recursos Específicos do Termux**

### **1. Abrir no Navegador Android**
```bash
# Opção 'a' no menu
# Ou usar diretamente
termux-open http://localhost:3000
```

### **2. Compartilhar Projeto**
```bash
# Opção 'b' no menu
# Ou usar diretamente
termux-share projeto.tar.gz
```

### **3. Backup Automático**
```bash
# Opção 'c' no menu
# Ou usar script
./termux/backup.sh
```

### **4. Scripts Úteis**
```bash
# Abrir no navegador
./termux/open-browser.sh

# Compartilhar projeto
./termux/share-project.sh meu-projeto

# Fazer backup
./termux/backup.sh
```

---

## 🎯 **Exemplos Específicos para Termux**

### **Exemplo 1: Hello Termux**
```stk
// hello-termux.stk
imprimir("📱 Olá, Termux!")
imprimir("🚀 Stack Extensão funcionando no Android!")

variavel dispositivo = "Android"
variavel terminal = "Termux"
variavel resultado = 10 mais 5 vezes 2

imprimir("Dispositivo: " + dispositivo)
imprimir("Terminal: " + terminal)
imprimir("Resultado: " + resultado)

funcao calcularBateria(nivel) {
    se (nivel maior 80) {
        retornar "🔋 Bateria alta"
    } senao se (nivel maior 50) {
        retornar "🔋 Bateria média"
    } senao se (nivel maior 20) {
        retornar "🔋 Bateria baixa"
    } senao {
        retornar "🔋 Bateria crítica"
    }
}

variavel nivelBateria = 75
imprimir(calcularBateria(nivelBateria))
```

### **Exemplo 2: App Mobile**
```stk
// mobile-app.stk
imprimir("📱 Stack Extensão - App Mobile!")

componente AppMobile {
    variavel contador = 0
    variavel tema = "claro"
    
    funcao alternarTema() {
        se (this.tema igual "claro") {
            this.tema = "escuro"
        } senao {
            this.tema = "claro"
        }
    }
    
    funcao incrementar() {
        this.contador = this.contador mais 1
    }
    
    funcao render() {
        retornar `
            <div class="mobile-app tema-${this.tema}">
                <h1>📱 App Mobile</h1>
                <div class="contador">
                    <h2>Contador: ${this.contador}</h2>
                    <button onclick="this.incrementar()" class="btn-primary">
                        ➕ Incrementar
                    </button>
                </div>
                <div class="tema">
                    <button onclick="this.alternarTema()" class="btn-secondary">
                        🌓 ${this.tema === 'claro' ? 'Modo Escuro' : 'Modo Claro'}
                    </button>
                </div>
            </div>
        `
    }
}

variavel app = novo AppMobile()
app.render()
```

### **Exemplo 3: Integração Android**
```stk
// android-integration.stk
imprimir("🤖 Stack Extensão - Integração Android!")

funcao verificarRecursos() {
    imprimir("📱 Recursos disponíveis:")
    imprimir("• Terminal: Termux")
    imprimir("• Linguagem: Stack Extensão")
    imprimir("• Python: Disponível")
    imprimir("• Node.js: Disponível")
    imprimir("• Git: Disponível")
}

funcao abrirArquivo(caminho) {
    imprimir("📁 Abrindo arquivo: " + caminho)
    imprimir("💡 Use 'termux-open' para abrir no Android")
}

funcao compartilharProjeto() {
    imprimir("📤 Compartilhando projeto...")
    imprimir("💡 Use 'termux-share' para compartilhar")
}

verificarRecursos()
abrirArquivo("exemplo.txt")
compartilharProjeto()
```

---

## ⚙️ **Configuração Específica do Termux**

### **Arquivo de Configuração:**
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
  },
  mobile: {
    enabled: true,
    responsive: true,
    touchGestures: true,
    offlineMode: true
  }
}
```

### **Configuração do Executor:**
```json
{
  "version": "1.0.0",
  "platform": "termux",
  "name": "Stack Extensão Executor - Termux Edition",
  "settings": {
    "default_port": 3000,
    "timeout": 30,
    "auto_open_browser": false,
    "use_termux_open": true,
    "theme": "termux",
    "language": "pt",
    "touch_optimized": true,
    "mobile_friendly": true
  },
  "termux": {
    "use_termux_open": true,
    "optimize_for_mobile": true,
    "battery_saver": true,
    "touch_gestures": true
  }
}
```

---

## 🎨 **Aliases Úteis para Termux**

### **Adicionados automaticamente ao `.bashrc`:**
```bash
# Stack Extensão aliases
alias stk='stk'
alias stack='python3 ~/stack-extension/executor.py'
alias stack-web='stk dev'
alias stack-run='stk run'
alias stack-compile='stk compile'
alias stack-analyze='stk analyze'
alias stack-translate='stk translate'

# Aliases úteis para desenvolvimento
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# Função para criar projeto Stack
create-stack-project() {
    if [ -z "$1" ]; then
        echo "Uso: create-stack-project nome-do-projeto"
        return 1
    fi
    
    mkdir -p "$1"
    cd "$1"
    
    cat > main.stk << 'EOF'
// Projeto Stack Extensão
imprimir("🚀 Bem-vindo ao seu projeto Stack Extensão!")
EOF
    
    echo "✅ Projeto '$1' criado!"
    echo "📁 Localização: $(pwd)"
    echo "🚀 Execute: stk run main.stk"
}

# Função para abrir arquivo no editor
edit-stack() {
    if [ -z "$1" ]; then
        echo "Uso: edit-stack arquivo.stk"
        return 1
    fi
    
    if command -v nano &> /dev/null; then
        nano "$1"
    elif command -v vim &> /dev/null; then
        vim "$1"
    else
        echo "❌ Nenhum editor encontrado!"
    fi
}
```

---

## 🚀 **Como Usar**

### **1. Executor Python Específico:**
```bash
# Usar executor otimizado para Termux
python3 executor-termux.py
```

### **2. Comandos Diretos:**
```bash
# Executar arquivo
stk run examples/hello-termux.stk

# Modo desenvolvimento
stk dev examples/mobile-app.stk

# Compilar
stk compile examples/hello-termux.stk

# Analisar
stk analyze examples/hello-termux.stk
```

### **3. Scripts Específicos:**
```bash
# Iniciar Stack Extensão
./termux/start-stack.sh

# Abrir no navegador
./termux/open-browser.sh

# Compartilhar projeto
./termux/share-project.sh meu-projeto

# Fazer backup
./termux/backup.sh
```

---

## 🔧 **Troubleshooting Específico do Termux**

### **Problemas Comuns:**

#### **1. termux-open não encontrado**
```bash
# Instalar termux-api
pkg install termux-api

# Configurar permissões
termux-setup-storage
```

#### **2. termux-share não encontrado**
```bash
# Instalar termux-api
pkg install termux-api
```

#### **3. Permissões de armazenamento**
```bash
# Configurar permissões
termux-setup-storage

# Verificar permissões
ls -la /sdcard/
```

#### **4. Teclado não funciona bem**
```bash
# Instalar teclado adicional
pkg install vim nano

# Configurar teclado
termux-setup-storage
```

### **Comandos de Diagnóstico:**
```bash
# Verificar versão do Termux
cat /etc/termux_version

# Verificar pacotes instalados
pkg list-installed

# Verificar permissões
ls -la /sdcard/

# Verificar conectividade
ping google.com
```

---

## 📚 **Estrutura de Arquivos Termux**

```
stack-extension/
├── executor-termux.py          # Executor específico para Termux
├── termux/
│   ├── start-stack.sh          # Script de inicialização
│   ├── open-browser.sh         # Abrir no navegador
│   ├── share-project.sh        # Compartilhar projeto
│   └── backup.sh               # Fazer backup
├── examples/
│   ├── hello-termux.stk        # Exemplo básico
│   ├── mobile-app.stk          # App mobile
│   └── android-integration.stk # Integração Android
├── mobile/
│   ├── templates/              # Templates mobile
│   ├── assets/                 # Assets mobile
│   └── configs/                # Configurações mobile
└── ...
```

---

## 🎉 **Vantagens da Termux Edition**

### **Performance:**
- ⚡ **Otimizada para mobile** - Performance adaptada
- 🔋 **Battery saver** - Economia de bateria
- 📱 **Touch-friendly** - Interface adaptada para toque

### **Integração:**
- 🤖 **Apps Android** - Integração nativa
- 📤 **Compartilhamento** - Fácil compartilhamento
- 📁 **Armazenamento** - Acesso ao armazenamento Android

### **Desenvolvimento:**
- 🎨 **Temas mobile** - Visual otimizado
- 📝 **Aliases úteis** - Comandos simplificados
- 🔧 **Scripts específicos** - Automação mobile

---

## 🚀 **Próximos Passos**

1. **Instale a Termux Edition** usando `./install-termux.sh`
2. **Execute o executor** com `python3 executor-termux.py`
3. **Teste os exemplos** específicos para Termux
4. **Explore as funcionalidades** mobile
5. **Compartilhe** seus projetos mobile

**📱 Bem-vindo ao futuro da programação mobile com Stack Extensão!**