#!/bin/bash

# Stack Extensão - Script para executar o executor Python
# Este script facilita a execução do executor visual

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_color() {
    echo -e "${1}${2}${NC}"
}

# Banner
print_banner() {
    print_color $CYAN "
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║              🚀 STACK EXTENSÃO EXECUTOR                      ║
    ║                                                              ║
    ║        Executor visual em Python para Stack Extensão        ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    "
}

# Verificar se Python está instalado
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_color $RED "❌ Python 3 não encontrado!"
        print_color $YELLOW "📥 Instalando Python 3..."
        
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v apt-get &> /dev/null; then
                sudo apt-get update
                sudo apt-get install -y python3 python3-pip
            elif command -v yum &> /dev/null; then
                sudo yum install -y python3 python3-pip
            else
                print_color $RED "❌ Gerenciador de pacotes não suportado. Instale Python 3 manualmente."
                exit 1
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install python3
            else
                print_color $RED "❌ Homebrew não encontrado. Instale Python 3 manualmente."
                exit 1
            fi
        else
            print_color $RED "❌ Sistema operacional não suportado."
            exit 1
        fi
    else
        print_color $GREEN "✅ Python 3 encontrado: $(python3 --version)"
    fi
}

# Verificar se o arquivo executor.py existe
check_executor() {
    if [ ! -f "executor.py" ]; then
        print_color $RED "❌ Arquivo executor.py não encontrado!"
        print_color $YELLOW "Execute este script no diretório do projeto Stack Extensão."
        exit 1
    fi
}

# Instalar dependências Python (se necessário)
install_dependencies() {
    print_color $BLUE "📦 Verificando dependências Python..."
    
    # Verificar se as dependências estão disponíveis
    python3 -c "import subprocess, threading, webbrowser, socket, json, time, os, sys, pathlib" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Todas as dependências estão disponíveis!"
    else
        print_color $YELLOW "⚠️  Algumas dependências podem estar faltando, mas o executor deve funcionar."
    fi
}

# Executar o executor
run_executor() {
    print_color $BLUE "🚀 Iniciando Stack Extensão Executor..."
    print_color $YELLOW "Pressione Ctrl+C para sair"
    echo
    
    # Executar o executor Python
    python3 executor.py
}

# Função principal
main() {
    print_banner
    
    print_color $YELLOW "🔍 Verificando pré-requisitos..."
    check_python
    check_executor
    install_dependencies
    
    echo
    print_color $GREEN "✅ Tudo pronto! Iniciando executor..."
    echo
    
    run_executor
}

# Verificar argumentos
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_color $CYAN "Stack Extensão Executor - Script de Execução"
    print_color $CYAN "Uso: ./run-executor.sh [opções]"
    print_color $CYAN ""
    print_color $CYAN "Opções:"
    print_color $CYAN "  --help, -h     Mostra esta ajuda"
    print_color $CYAN "  --check        Apenas verifica pré-requisitos"
    print_color $CYAN "  --install      Instala dependências"
    print_color $CYAN ""
    print_color $CYAN "Exemplos:"
    print_color $CYAN "  ./run-executor.sh              # Executa o executor"
    print_color $CYAN "  ./run-executor.sh --check      # Verifica pré-requisitos"
    print_color $CYAN "  ./run-executor.sh --install    # Instala dependências"
    exit 0
fi

# Verificar apenas pré-requisitos
if [ "$1" = "--check" ]; then
    print_banner
    check_python
    check_executor
    install_dependencies
    print_color $GREEN "✅ Verificação concluída!"
    exit 0
fi

# Instalar dependências
if [ "$1" = "--install" ]; then
    print_banner
    check_python
    install_dependencies
    print_color $GREEN "✅ Instalação concluída!"
    exit 0
fi

# Executar função principal
main