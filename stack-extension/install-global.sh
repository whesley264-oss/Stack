#!/bin/bash

# Stack Extensão - Instalador Global
# Funciona em qualquer sistema: PC, Mac, Linux, Android (Termux), etc.

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

# Detectar sistema operacional
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [[ -f /etc/termux_version ]]; then
            echo "termux"
        elif command -v apt-get &> /dev/null; then
            echo "ubuntu"
        elif command -v yum &> /dev/null; then
            echo "centos"
        elif command -v pacman &> /dev/null; then
            echo "arch"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Banner
print_banner() {
    print_color $CYAN "
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║              🚀 STACK EXTENSÃO - INSTALADOR GLOBAL          ║
    ║                                                              ║
    ║        A super linguagem de programação única!              ║
    ║                                                              ║
    ║  • Funciona em qualquer sistema operacional                 ║
    ║  • PC, Mac, Linux, Android (Termux)                        ║
    ║  • Instalação automática e inteligente                     ║
    ║  • Configuração otimizada por plataforma                   ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    "
}

# Verificar se o comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Instalar Node.js
install_nodejs() {
    local os=$1
    
    print_color $BLUE "📦 Instalando Node.js..."
    
    case $os in
        "termux")
            pkg update && pkg upgrade
            pkg install nodejs npm -y
            ;;
        "ubuntu")
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        "centos")
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
            ;;
        "arch")
            sudo pacman -S nodejs npm --noconfirm
            ;;
        "macos")
            if command_exists brew; then
                brew install node
            else
                print_color $YELLOW "Instalando Homebrew primeiro..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                brew install node
            fi
            ;;
        "windows")
            print_color $YELLOW "Para Windows, baixe Node.js de: https://nodejs.org"
            print_color $YELLOW "Ou use o Windows Subsystem for Linux (WSL)"
            ;;
        *)
            print_color $YELLOW "Sistema não reconhecido. Instale Node.js manualmente."
            ;;
    esac
}

# Instalar Python
install_python() {
    local os=$1
    
    print_color $BLUE "🐍 Instalando Python..."
    
    case $os in
        "termux")
            pkg install python -y
            ;;
        "ubuntu")
            sudo apt-get install -y python3 python3-pip
            ;;
        "centos")
            sudo yum install -y python3 python3-pip
            ;;
        "arch")
            sudo pacman -S python python-pip --noconfirm
            ;;
        "macos")
            if command_exists brew; then
                brew install python
            else
                print_color $YELLOW "Python já deve estar instalado no macOS"
            fi
            ;;
        "windows")
            print_color $YELLOW "Para Windows, baixe Python de: https://python.org"
            ;;
        *)
            print_color $YELLOW "Sistema não reconhecido. Instale Python manualmente."
            ;;
    esac
}

# Instalar Git
install_git() {
    local os=$1
    
    print_color $BLUE "📁 Instalando Git..."
    
    case $os in
        "termux")
            pkg install git -y
            ;;
        "ubuntu")
            sudo apt-get install -y git
            ;;
        "centos")
            sudo yum install -y git
            ;;
        "arch")
            sudo pacman -S git --noconfirm
            ;;
        "macos")
            if command_exists brew; then
                brew install git
            else
                print_color $YELLOW "Git já deve estar instalado no macOS"
            fi
            ;;
        "windows")
            print_color $YELLOW "Para Windows, baixe Git de: https://git-scm.com"
            ;;
        *)
            print_color $YELLOW "Sistema não reconhecido. Instale Git manualmente."
            ;;
    esac
}

# Verificar pré-requisitos
check_prerequisites() {
    local os=$1
    
    print_color $BLUE "🔍 Verificando pré-requisitos para $os..."
    
    # Verificar Node.js
    if ! command_exists node; then
        print_color $RED "❌ Node.js não encontrado!"
        install_nodejs $os
    else
        print_color $GREEN "✅ Node.js encontrado: $(node --version)"
    fi
    
    # Verificar npm
    if ! command_exists npm; then
        print_color $RED "❌ npm não encontrado!"
        install_nodejs $os
    else
        print_color $GREEN "✅ npm encontrado: $(npm --version)"
    fi
    
    # Verificar Python
    if ! command_exists python3; then
        print_color $RED "❌ Python 3 não encontrado!"
        install_python $os
    else
        print_color $GREEN "✅ Python 3 encontrado: $(python3 --version)"
    fi
    
    # Verificar Git
    if ! command_exists git; then
        print_color $RED "❌ Git não encontrado!"
        install_git $os
    else
        print_color $GREEN "✅ Git encontrado: $(git --version)"
    fi
}

# Instalar dependências do projeto
install_dependencies() {
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

# Criar estrutura de diretórios
create_structure() {
    print_color $BLUE "📁 Criando estrutura de diretórios..."
    
    mkdir -p src/{lexer,parser,transpiler,web,math,modules,language,server,editor,sharing,collaboration,ai,templates,plugins}
    mkdir -p examples bin output logs
    
    print_color $GREEN "✅ Estrutura criada!"
}

# Criar arquivos de configuração
create_configs() {
    local os=$1
    
    print_color $BLUE "⚙️  Criando arquivos de configuração..."
    
    # Configuração específica por OS
    case $os in
        "termux")
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
    useTermuxOpen: true
  }
}
EOF
            ;;
        *)
            cat > stack.config.js << 'EOF'
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
EOF
            ;;
    esac
    
    # Configuração do executor
    cat > executor-config.json << EOF
{
  "version": "1.0.0",
  "platform": "$os",
  "name": "Stack Extensão Executor",
  "settings": {
    "default_port": 3000,
    "timeout": 30,
    "auto_open_browser": $([ "$os" = "termux" ] && echo "false" || echo "true"),
    "theme": "default",
    "language": "pt"
  }
}
EOF
    
    print_color $GREEN "✅ Configurações criadas!"
}

# Criar exemplos
create_examples() {
    print_color $BLUE "📝 Criando exemplos..."
    
    # Exemplo básico
    cat > examples/hello-world.stk << 'EOF'
// Meu primeiro programa Stack Extensão
imprimir("🚀 Olá, Stack Extensão!")
imprimir("Bem-vindo ao mundo da programação!")

variavel nome = "Desenvolvedor"
variavel resultado = 10 mais 5 vezes 2

imprimir("Olá, " + nome + "!")
imprimir("Resultado: " + resultado)

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

variavel notas = [8.5, 7.0, 9.0, 6.5]
variavel media = calcularMedia(notas)
imprimir("Média: " + media)
EOF

    # Exemplo web
    cat > examples/web-demo.stk << 'EOF'
// Exemplo web para Stack Extensão
imprimir("🌐 Stack Extensão - Demo Web!")

componente MinhaApp {
    variavel contador = 0
    
    funcao incrementar() {
        this.contador = this.contador mais 1
    }
    
    funcao render() {
        retornar `
            <div class="app">
                <h1>Contador: ${this.contador}</h1>
                <button onclick="this.incrementar()">Incrementar</button>
            </div>
        `
    }
}

variavel app = novo MinhaApp()
app.render()
EOF

    print_color $GREEN "✅ Exemplos criados!"
}

# Executar testes
run_tests() {
    print_color $BLUE "🧪 Executando testes..."
    
    # Teste básico
    if command_exists stk; then
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
}

# Mostrar próximos passos
show_next_steps() {
    local os=$1
    
    print_color $PURPLE "
    🎉 INSTALAÇÃO GLOBAL CONCLUÍDA COM SUCESSO!
    
    📚 Próximos passos:
    
    1. 📖 Testar instalação:
       stk --help
    
    2. 🚀 Executar exemplo:
       stk run examples/hello-world.stk
    
    3. 🐍 Usar executor Python:
       python3 executor.py
    
    4. 🌐 Modo desenvolvimento:
       stk dev examples/web-demo.stk
    
    5. 📁 Ver exemplos:
       ls examples/
    
    📁 Projeto em: $(pwd)
    ⚙️  Configuração: stack.config.js
    🐍 Executor: executor.py
    
    💡 Dica: Use 'stk --help' para ver todos os comandos!
    
    🚀 Bem-vindo ao futuro da programação com Stack Extensão!
    "
    
    if [ "$os" = "termux" ]; then
        print_color $CYAN "
    📱 DICAS ESPECÍFICAS PARA TERMUX:
    
    • Use 'termux-open' para abrir arquivos
    • Configure permissões de armazenamento
    • Use 'pkg update' para atualizar pacotes
    • Configure o teclado para melhor experiência
        "
    fi
}

# Função principal
main() {
    local os=$(detect_os)
    
    print_banner
    
    print_color $YELLOW "🚀 Iniciando instalação global da Stack Extensão..."
    print_color $YELLOW "🖥️  Sistema detectado: $os"
    print_color $YELLOW "⏱️  Isso pode levar alguns minutos..."
    echo
    
    # Verificar se estamos no diretório correto
    if [ ! -f "package.json" ]; then
        print_color $RED "❌ Execute este script no diretório raiz do projeto Stack Extensão!"
        exit 1
    fi
    
    # Executar etapas de instalação
    check_prerequisites $os
    echo
    
    create_structure
    echo
    
    install_dependencies
    echo
    
    install_global
    echo
    
    create_configs $os
    echo
    
    create_examples
    echo
    
    run_tests
    echo
    
    show_next_steps $os
}

# Verificar argumentos
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_color $CYAN "Stack Extensão - Instalador Global"
    print_color $CYAN "Uso: ./install-global.sh [opções]"
    print_color $CYAN ""
    print_color $CYAN "Opções:"
    print_color $CYAN "  --help, -h     Mostra esta ajuda"
    print_color $CYAN "  --check        Apenas verifica pré-requisitos"
    print_color $CYAN "  --install      Instala dependências"
    print_color $CYAN ""
    print_color $CYAN "Suporta:"
    print_color $CYAN "  • Ubuntu/Debian"
    print_color $CYAN "  • CentOS/RHEL"
    print_color $CYAN "  • Arch Linux"
    print_color $CYAN "  • macOS"
    print_color $CYAN "  • Android (Termux)"
    print_color $CYAN "  • Windows (WSL)"
    exit 0
fi

# Executar instalação
main