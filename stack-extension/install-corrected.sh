#!/bin/bash

# Stack Extensão - Instalador Inteligente (CORRIGIDO)
# Detecta automaticamente o sistema e escolhe a instalação correta
# Repositório correto: https://github.com/whesley264-oss/Stack.git

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

# Banner principal
print_banner() {
    print_color $CYAN "
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║              🚀 STACK EXTENSÃO - INSTALADOR INTELIGENTE     ║
    ║                                                              ║
    ║        A super linguagem de programação única!              ║
    ║                                                              ║
    ║  • Detecção automática do sistema operacional               ║
    ║  • Instalação otimizada por plataforma                      ║
    ║  • Suporte completo para PC, Mac, Linux e Android           ║
    ║  • Configuração inteligente e personalizada                 ║
    ║                                                              ║
    ║  🔗 Repositório: https://github.com/whesley264-oss/Stack    ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    "
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

# Verificar se o comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Clonar repositório correto
clone_repository() {
    print_color $BLUE "📥 Clonando repositório correto..."
    
    # Verificar se já existe
    if [ -d "Stack" ]; then
        print_color $YELLOW "⚠️  Diretório Stack já existe. Removendo..."
        rm -rf Stack
    fi
    
    # Clonar repositório correto
    git clone https://github.com/whesley264-oss/Stack.git
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Repositório clonado com sucesso!"
        cd Stack
        print_color $GREEN "✅ Entrando no diretório Stack..."
    else
        print_color $RED "❌ Erro ao clonar repositório!"
        print_color $YELLOW "💡 Verifique sua conexão com a internet"
        exit 1
    fi
}

# Verificar pré-requisitos básicos
check_basic_prerequisites() {
    local os=$1
    
    print_color $BLUE "🔍 Verificando pré-requisitos básicos para $os..."
    
    # Verificar Git
    if ! command_exists git; then
        print_color $RED "❌ Git não encontrado!"
        print_color $YELLOW "📥 Instale Git primeiro:"
        case $os in
            "termux")
                print_color $WHITE "pkg install git"
                ;;
            "ubuntu")
                print_color $WHITE "sudo apt-get install git"
                ;;
            "centos")
                print_color $WHITE "sudo yum install git"
                ;;
            "arch")
                print_color $WHITE "sudo pacman -S git"
                ;;
            "macos")
                print_color $WHITE "brew install git"
                ;;
            *)
                print_color $WHITE "Visite: https://git-scm.com"
                ;;
        esac
        exit 1
    fi
    
    print_color $GREEN "✅ Git encontrado!"
}

# Mostrar opções de instalação
show_installation_options() {
    local os=$1
    
    print_color $WHITE "
    📋 OPÇÕES DE INSTALAÇÃO DISPONÍVEIS:
    "
    
    if [ "$os" = "termux" ]; then
        print_color $GREEN "1. Instalação Termux (Recomendada) 📱"
        print_color $WHITE "   • Otimizada 100% para Android via Termux"
        print_color $WHITE "   • Interface touch-friendly"
        print_color $WHITE "   • Recursos específicos para mobile"
        print_color $WHITE "   • Integração com apps Android"
        echo
        print_color $YELLOW "2. Instalação Global 🌍"
        print_color $WHITE "   • Funciona em qualquer sistema"
        print_color $WHITE "   • Menos otimizada para mobile"
        print_color $WHITE "   • Mais genérica"
    else
        print_color $GREEN "1. Instalação Global (Recomendada) 🌍"
        print_color $WHITE "   • Funciona em qualquer sistema"
        print_color $WHITE "   • Detecção automática do OS"
        print_color $WHITE "   • Instalação inteligente de dependências"
        print_color $WHITE "   • Configuração otimizada por plataforma"
        echo
        print_color $YELLOW "2. Instalação Manual 🔧"
        print_color $WHITE "   • Controle total sobre a instalação"
        print_color $WHITE "   • Instalação passo a passo"
        print_color $WHITE "   • Mais flexível"
    fi
    
    echo
    print_color $CYAN "═══════════════════════════════════════════════════════════════"
}

# Executar instalação baseada na escolha
execute_installation() {
    local os=$1
    local choice=$2
    
    case $choice in
        "1")
            if [ "$os" = "termux" ]; then
                print_color $GREEN "🚀 Executando instalação Termux..."
                # Usar o instalador corrigido
                if [ -f "../install-termux-fixed.sh" ]; then
                    ../install-termux-fixed.sh
                else
                    print_color $RED "❌ Instalador Termux não encontrado!"
                    exit 1
                fi
            else
                print_color $GREEN "🚀 Executando instalação Global..."
                # Usar o instalador global
                if [ -f "../install-global.sh" ]; then
                    ../install-global.sh
                else
                    print_color $RED "❌ Instalador Global não encontrado!"
                    exit 1
                fi
            fi
            ;;
        "2")
            if [ "$os" = "termux" ]; then
                print_color $GREEN "🚀 Executando instalação Global no Termux..."
                if [ -f "../install-global.sh" ]; then
                    ../install-global.sh
                else
                    print_color $RED "❌ Instalador Global não encontrado!"
                    exit 1
                fi
            else
                print_color $GREEN "🚀 Executando instalação Manual..."
                execute_manual_installation $os
            fi
            ;;
        *)
            print_color $RED "❌ Escolha inválida!"
            exit 1
            ;;
    esac
}

# Instalação manual
execute_manual_installation() {
    local os=$1
    
    print_color $BLUE "🔧 Iniciando instalação manual..."
    
    # Verificar Node.js
    if ! command_exists node; then
        print_color $RED "❌ Node.js não encontrado!"
        print_color $YELLOW "📥 Instale Node.js primeiro:"
        case $os in
            "ubuntu")
                print_color $WHITE "sudo apt-get install nodejs npm"
                ;;
            "centos")
                print_color $WHITE "sudo yum install nodejs npm"
                ;;
            "arch")
                print_color $WHITE "sudo pacman -S nodejs npm"
                ;;
            "macos")
                print_color $WHITE "brew install node"
                ;;
            "termux")
                print_color $WHITE "pkg install nodejs npm"
                ;;
            *)
                print_color $WHITE "Visite: https://nodejs.org"
                ;;
        esac
        exit 1
    fi
    
    # Verificar Python
    if ! command_exists python3; then
        print_color $RED "❌ Python 3 não encontrado!"
        print_color $YELLOW "📥 Instale Python 3 primeiro:"
        case $os in
            "ubuntu")
                print_color $WHITE "sudo apt-get install python3 python3-pip"
                ;;
            "centos")
                print_color $WHITE "sudo yum install python3 python3-pip"
                ;;
            "arch")
                print_color $WHITE "sudo pacman -S python python-pip"
                ;;
            "macos")
                print_color $WHITE "brew install python"
                ;;
            "termux")
                print_color $WHITE "pkg install python"
                ;;
            *)
                print_color $WHITE "Visite: https://python.org"
                ;;
        esac
        exit 1
    fi
    
    # Instalar dependências
    print_color $BLUE "📦 Instalando dependências..."
    npm install
    
    # Instalar globalmente
    print_color $BLUE "🌍 Instalando globalmente..."
    npm install -g .
    
    print_color $GREEN "✅ Instalação manual concluída!"
}

# Mostrar próximos passos
show_next_steps() {
    local os=$1
    local choice=$2
    
    print_color $PURPLE "
    🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!
    
    📚 Próximos passos:
    
    1. 📖 Testar instalação:
       stk --help
    
    2. 🚀 Executar exemplo:
       stk run examples/hello-world.stk
    
    3. 🐍 Usar executor Python:"
    
    if [ "$os" = "termux" ] && [ "$choice" = "1" ]; then
        print_color $WHITE "       python3 executor-termux.py"
    else
        print_color $WHITE "       python3 executor.py"
    fi
    
    print_color $WHITE "
    4. 🌐 Modo desenvolvimento:
       stk dev examples/web-demo.stk
    
    5. 📁 Ver exemplos:
       ls examples/
    
    📁 Projeto em: $(pwd)
    ⚙️  Configuração: stack.config.js
    🐍 Executor: executor.py"
    
    if [ "$os" = "termux" ] && [ "$choice" = "1" ]; then
        print_color $WHITE "    📱 Executor Termux: executor-termux.py"
    fi
    
    print_color $WHITE "
    💡 Dica: Use 'stk --help' para ver todos os comandos!
    
    🚀 Bem-vindo ao futuro da programação com Stack Extensão!
    "
    
    if [ "$os" = "termux" ] && [ "$choice" = "1" ]; then
        print_color $CYAN "
    📱 DICAS ESPECÍFICAS PARA TERMUX:
    
    • Use 'termux-open' para abrir arquivos
    • Use 'termux-share' para compartilhar projetos
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
    
    print_color $YELLOW "🚀 Iniciando instalação inteligente da Stack Extensão..."
    print_color $YELLOW "🖥️  Sistema detectado: $os"
    print_color $YELLOW "🔗 Repositório: https://github.com/whesley264-oss/Stack.git"
    echo
    
    # Verificar pré-requisitos básicos
    check_basic_prerequisites $os
    echo
    
    # Clonar repositório
    clone_repository
    echo
    
    # Mostrar opções de instalação
    show_installation_options $os
    
    # Solicitar escolha do usuário
    print_color $YELLOW "Digite sua escolha (1-2): "
    read -r choice
    
    # Executar instalação
    execute_installation $os $choice
    
    # Mostrar próximos passos
    show_next_steps $os $choice
}

# Verificar argumentos
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_color $CYAN "Stack Extensão - Instalador Inteligente (CORRIGIDO)"
    print_color $CYAN "Uso: ./install-corrected.sh [opções]"
    print_color $CYAN ""
    print_color $CYAN "Opções:"
    print_color $CYAN "  --help, -h     Mostra esta ajuda"
    print_color $CYAN "  --auto         Instalação automática (sem interação)"
    print_color $CYAN "  --termux       Força instalação Termux"
    print_color $CYAN "  --global       Força instalação Global"
    print_color $CYAN ""
    print_color $CYAN "Sistemas suportados:"
    print_color $CYAN "  • Ubuntu/Debian"
    print_color $CYAN "  • CentOS/RHEL"
    print_color $CYAN "  • Arch Linux"
    print_color $CYAN "  • macOS"
    print_color $CYAN "  • Android (Termux)"
    print_color $CYAN "  • Windows (WSL)"
    print_color $CYAN ""
    print_color $CYAN "Repositório: https://github.com/whesley264-oss/Stack.git"
    exit 0
fi

# Instalação automática
if [ "$1" = "--auto" ]; then
    local os=$(detect_os)
    if [ "$os" = "termux" ]; then
        ./install-termux-fixed.sh
    else
        ./install-global.sh
    fi
    exit 0
fi

# Forçar instalação Termux
if [ "$1" = "--termux" ]; then
    ./install-termux-fixed.sh
    exit 0
fi

# Forçar instalação Global
if [ "$1" = "--global" ]; then
    ./install-global.sh
    exit 0
fi

# Executar instalação interativa
main