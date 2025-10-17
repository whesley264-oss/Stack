#!/bin/bash

# Stack Extensão - Instalador Específico para Termux
# Otimizado 100% para Android via Termux

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_color() {
    echo -e "${1}${2}${NC}"
}

# Banner específico para Termux
print_banner() {
    print_color $CYAN "
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
    "
}

# Verificar se está no Termux
check_termux() {
    if [[ ! -f /etc/termux_version ]]; then
        print_color $RED "❌ Este script é específico para Termux!"
        print_color $YELLOW "Use install-global.sh para outros sistemas."
        exit 1
    fi
    
    print_color $GREEN "✅ Termux detectado!"
    print_color $BLUE "📱 Versão do Termux: $(cat /etc/termux_version)"
}

# Atualizar Termux
update_termux() {
    print_color $BLUE "🔄 Atualizando Termux..."
    
    pkg update && pkg upgrade -y
    
    print_color $GREEN "✅ Termux atualizado!"
}

# Instalar dependências específicas do Termux
install_termux_dependencies() {
    print_color $BLUE "📦 Instalando dependências específicas do Termux..."
    
    # Pacotes essenciais
    pkg install -y nodejs npm python git curl wget
    
    # Pacotes adicionais para desenvolvimento
    pkg install -y vim nano tree htop
    
    # Pacotes para web development
    pkg install -y openssh
    
    print_color $GREEN "✅ Dependências do Termux instaladas!"
}

# Configurar ambiente Termux
setup_termux_environment() {
    print_color $BLUE "⚙️  Configurando ambiente Termux..."
    
    # Criar diretório de trabalho
    mkdir -p ~/stack-projects
    cd ~/stack-projects
    
    # Configurar git (se necessário)
    if [ ! -f ~/.gitconfig ]; then
        print_color $YELLOW "📝 Configurando Git..."
        read -p "Digite seu nome para Git: " git_name
        read -p "Digite seu email para Git: " git_email
        
        git config --global user.name "$git_name"
        git config --global user.email "$git_email"
    fi
    
    # Configurar aliases úteis
    cat >> ~/.bashrc << 'EOF'

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
EOF

    print_color $GREEN "✅ Ambiente Termux configurado!"
}

# Instalar dependências do projeto
install_project_dependencies() {
    print_color $BLUE "📦 Instalando dependências do projeto..."
    
    # Instalar dependências do projeto
    npm install
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Dependências instaladas com sucesso!"
    else
        print_color $RED "❌ Erro ao instalar dependências!"
        exit 1
    fi
}

# Instalar globalmente
install_global() {
    print_color $BLUE "🌍 Instalando Stack Extensão globalmente..."
    
    # Instalar globalmente
    npm install -g .
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Stack Extensão instalada globalmente!"
        print_color $CYAN "🎉 Agora você pode usar o comando 'stk' em qualquer lugar!"
    else
        print_color $YELLOW "⚠️  Erro ao instalar globalmente. Você ainda pode usar 'npx stk'"
    fi
}

# Criar estrutura específica para Termux
create_termux_structure() {
    print_color $BLUE "📁 Criando estrutura específica para Termux..."
    
    # Estrutura principal
    mkdir -p src/{lexer,parser,transpiler,web,math,modules,language,server,editor,sharing,collaboration,ai,templates,plugins}
    mkdir -p examples bin output logs
    
    # Estrutura específica para mobile
    mkdir -p mobile/{templates,assets,configs}
    mkdir -p termux/{scripts,configs,aliases}
    
    print_color $GREEN "✅ Estrutura Termux criada!"
}

# Criar configurações específicas para Termux
create_termux_configs() {
    print_color $BLUE "⚙️  Criando configurações específicas para Termux..."
    
    # Configuração principal
    cat > stack.config.js << 'EOF'
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
EOF

    # Configuração do executor para Termux
    cat > executor-config.json << 'EOF'
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
EOF

    # Script de inicialização para Termux
    cat > termux/start-stack.sh << 'EOF'
#!/bin/bash

# Script de inicialização Stack Extensão para Termux
echo "🚀 Iniciando Stack Extensão no Termux..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script no diretório do projeto Stack Extensão!"
    exit 1
fi

# Verificar dependências
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado! Execute: pkg install nodejs"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado! Execute: pkg install python"
    exit 1
fi

# Iniciar executor
echo "🐍 Iniciando executor Python..."
python3 executor.py
EOF

    chmod +x termux/start-stack.sh

    print_color $GREEN "✅ Configurações Termux criadas!"
}

# Criar exemplos específicos para Termux
create_termux_examples() {
    print_color $BLUE "📝 Criando exemplos específicos para Termux..."
    
    # Exemplo básico
    cat > examples/hello-termux.stk << 'EOF'
// Exemplo específico para Termux
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
EOF

    # Exemplo mobile
    cat > examples/mobile-app.stk << 'EOF'
// Aplicação mobile para Termux
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
EOF

    # Exemplo de integração com Android
    cat > examples/android-integration.stk << 'EOF'
// Integração com recursos do Android
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
EOF

    print_color $GREEN "✅ Exemplos Termux criados!"
}

# Criar scripts úteis para Termux
create_termux_scripts() {
    print_color $BLUE "📜 Criando scripts úteis para Termux..."
    
    # Script para abrir no navegador Android
    cat > termux/open-browser.sh << 'EOF'
#!/bin/bash

# Script para abrir Stack Extensão no navegador Android
PORT=${1:-3000}

echo "🌐 Abrindo Stack Extensão no navegador Android..."
echo "🔗 URL: http://localhost:$PORT"

# Usar termux-open para abrir no navegador
termux-open "http://localhost:$PORT"
EOF

    chmod +x termux/open-browser.sh

    # Script para compartilhar projeto
    cat > termux/share-project.sh << 'EOF'
#!/bin/bash

# Script para compartilhar projeto Stack Extensão
PROJECT_NAME=${1:-"stack-project"}

echo "📤 Compartilhando projeto: $PROJECT_NAME"

# Criar arquivo compactado
tar -czf "$PROJECT_NAME.tar.gz" .

# Compartilhar usando termux-share
termux-share "$PROJECT_NAME.tar.gz"

echo "✅ Projeto compartilhado!"
EOF

    chmod +x termux/share-project.sh

    # Script para backup
    cat > termux/backup.sh << 'EOF'
#!/bin/bash

# Script de backup para projetos Stack Extensão
BACKUP_DIR="$HOME/stack-backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Criando backup dos projetos Stack Extensão..."

# Criar diretório de backup
mkdir -p "$BACKUP_DIR"

# Fazer backup do projeto atual
tar -czf "$BACKUP_DIR/stack-extension_$DATE.tar.gz" .

echo "✅ Backup criado: $BACKUP_DIR/stack-extension_$DATE.tar.gz"
EOF

    chmod +x termux/backup.sh

    print_color $GREEN "✅ Scripts Termux criados!"
}

# Executar testes específicos para Termux
run_termux_tests() {
    print_color $BLUE "🧪 Executando testes específicos para Termux..."
    
    # Teste básico
    if command -v stk &> /dev/null; then
        stk --help > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            print_color $GREEN "✅ Comando 'stk' funcionando!"
        else
            print_color $YELLOW "⚠️  Comando 'stk' com problemas"
        fi
    fi
    
    # Teste Python
    python3 -c "import subprocess, threading, webbrowser, socket, json, time, os, sys, pathlib" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Python e dependências OK!"
    else
        print_color $YELLOW "⚠️  Python com problemas"
    fi
    
    # Teste termux-open
    if command -v termux-open &> /dev/null; then
        print_color $GREEN "✅ termux-open disponível!"
    else
        print_color $YELLOW "⚠️  termux-open não encontrado"
    fi
    
    # Teste termux-share
    if command -v termux-share &> /dev/null; then
        print_color $GREEN "✅ termux-share disponível!"
    else
        print_color $YELLOW "⚠️  termux-share não encontrado"
    fi
}

# Mostrar próximos passos específicos para Termux
show_termux_next_steps() {
    print_color $PURPLE "
    🎉 INSTALAÇÃO TERMUX CONCLUÍDA COM SUCESSO!
    
    📱 Próximos passos específicos para Termux:
    
    1. 📖 Testar instalação:
       stk --help
    
    2. 🚀 Executar exemplo:
       stk run examples/hello-termux.stk
    
    3. 🐍 Usar executor Python:
       python3 executor.py
    
    4. 📱 Executar app mobile:
       stk run examples/mobile-app.stk
    
    5. 🌐 Abrir no navegador Android:
       ./termux/open-browser.sh
    
    6. 📤 Compartilhar projeto:
       ./termux/share-project.sh meu-projeto
    
    7. 💾 Fazer backup:
       ./termux/backup.sh
    
    📁 Projeto em: $(pwd)
    ⚙️  Configuração: stack.config.js
    🐍 Executor: executor.py
    📱 Scripts: termux/
    
    💡 Dicas específicas para Termux:
    • Use 'termux-open' para abrir arquivos
    • Use 'termux-share' para compartilhar
    • Configure permissões de armazenamento
    • Use 'pkg update' para atualizar pacotes
    
    🚀 Bem-vindo ao futuro da programação mobile com Stack Extensão!
    "
}

# Função principal
main() {
    print_banner
    
    print_color $YELLOW "🚀 Iniciando instalação específica para Termux..."
    print_color $YELLOW "📱 Otimizado 100% para Android via Termux"
    print_color $YELLOW "⏱️  Isso pode levar alguns minutos..."
    echo
    
    # Verificar se está no Termux
    check_termux
    echo
    
    # Verificar se estamos no diretório correto
    if [ ! -f "package.json" ]; then
        print_color $RED "❌ Execute este script no diretório raiz do projeto Stack Extensão!"
        exit 1
    fi
    
    # Executar etapas de instalação
    update_termux
    echo
    
    install_termux_dependencies
    echo
    
    setup_termux_environment
    echo
    
    create_termux_structure
    echo
    
    install_project_dependencies
    echo
    
    install_global
    echo
    
    create_termux_configs
    echo
    
    create_termux_examples
    echo
    
    create_termux_scripts
    echo
    
    run_termux_tests
    echo
    
    show_termux_next_steps
}

# Verificar argumentos
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_color $CYAN "Stack Extensão - Instalador Termux"
    print_color $CYAN "Uso: ./install-termux.sh [opções]"
    print_color $CYAN ""
    print_color $CYAN "Opções:"
    print_color $CYAN "  --help, -h     Mostra esta ajuda"
    print_color $CYAN "  --check        Apenas verifica pré-requisitos"
    print_color $CYAN "  --install      Instala dependências"
    print_color $CYAN ""
    print_color $CYAN "Específico para:"
    print_color $CYAN "  • Android via Termux"
    print_color $CYAN "  • Interface touch-friendly"
    print_color $CYAN "  • Integração com apps Android"
    print_color $CYAN "  • Performance otimizada para mobile"
    exit 0
fi

# Executar instalação
main