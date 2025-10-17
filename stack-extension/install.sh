#!/bin/bash

# Stack Extensão - Script de Instalação Automática
# Instala e configura a Stack Extensão em seu sistema

set -e

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
    ║              🚀 STACK EXTENSÃO - INSTALADOR                  ║
    ║                                                              ║
    ║        A super linguagem de programação única!              ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    "
}

# Verificar se o comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar pré-requisitos
check_prerequisites() {
    print_color $BLUE "🔍 Verificando pré-requisitos..."
    
    # Verificar Node.js
    if ! command_exists node; then
        print_color $RED "❌ Node.js não encontrado!"
        print_color $YELLOW "📥 Instalando Node.js..."
        
        # Detectar sistema operacional
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            if command_exists apt-get; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command_exists yum; then
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo yum install -y nodejs
            else
                print_color $RED "❌ Gerenciador de pacotes não suportado. Instale Node.js manualmente."
                exit 1
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install node
            else
                print_color $RED "❌ Homebrew não encontrado. Instale Node.js manualmente."
                exit 1
            fi
        else
            print_color $RED "❌ Sistema operacional não suportado."
            exit 1
        fi
    else
        print_color $GREEN "✅ Node.js encontrado: $(node --version)"
    fi
    
    # Verificar npm
    if ! command_exists npm; then
        print_color $RED "❌ npm não encontrado!"
        exit 1
    else
        print_color $GREEN "✅ npm encontrado: $(npm --version)"
    fi
    
    # Verificar Git
    if ! command_exists git; then
        print_color $RED "❌ Git não encontrado!"
        print_color $YELLOW "📥 Instalando Git..."
        
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command_exists apt-get; then
                sudo apt-get install -y git
            elif command_exists yum; then
                sudo yum install -y git
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command_exists brew; then
                brew install git
            fi
        fi
    else
        print_color $GREEN "✅ Git encontrado: $(git --version)"
    fi
}

# Instalar dependências
install_dependencies() {
    print_color $BLUE "📦 Instalando dependências..."
    
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

# Executar testes
run_tests() {
    print_color $BLUE "🧪 Executando testes..."
    
    npm test
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Todos os testes passaram!"
    else
        print_color $YELLOW "⚠️  Alguns testes falharam, mas a instalação continuará..."
    fi
}

# Criar exemplos
create_examples() {
    print_color $BLUE "📝 Criando exemplos..."
    
    # Criar diretório de exemplos se não existir
    mkdir -p ~/stack-examples
    
    # Copiar exemplos
    cp examples/*.stk ~/stack-examples/ 2>/dev/null || true
    cp examples/*.html ~/stack-examples/ 2>/dev/null || true
    
    print_color $GREEN "✅ Exemplos criados em ~/stack-examples/"
}

# Configurar ambiente
setup_environment() {
    print_color $BLUE "⚙️  Configurando ambiente..."
    
    # Criar arquivo de configuração
    cat > ~/.stack-extension.json << EOF
{
  "version": "1.0.0",
  "language": "portuguese",
  "theme": "dark",
  "autoTranslate": true,
  "ai": {
    "enabled": true,
    "autoSuggest": true
  },
  "server": {
    "port": 3000,
    "autoReload": true
  }
}
EOF
    
    print_color $GREEN "✅ Configuração criada em ~/.stack-extension.json"
}

# Demonstrar instalação
demonstrate_installation() {
    print_color $BLUE "🎯 Demonstrando instalação..."
    
    # Criar arquivo de teste
    cat > /tmp/teste-stack.stk << EOF
// Teste da instalação Stack Extensão
imprimir("🚀 Stack Extensão instalada com sucesso!")

variavel nome = "Desenvolvedor"
variavel resultado = 10 mais 5 vezes 2

imprimir("Olá, " + nome + "!")
imprimir("Resultado: " + resultado)

funcao saudar(pessoa) {
    retornar "Bem-vindo, " + pessoa + "!"
}

imprimir(saudar("Stack Extensão"))
EOF
    
    # Executar teste
    if command_exists stk; then
        print_color $CYAN "▶️  Executando teste..."
        stk run /tmp/teste-stack.stk
    else
        print_color $CYAN "▶️  Executando teste com npx..."
        npx stack-extension run /tmp/teste-stack.stk
    fi
    
    # Limpar arquivo de teste
    rm /tmp/teste-stack.stk
}

# Mostrar próximos passos
show_next_steps() {
    print_color $PURPLE "
    🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!
    
    📚 Próximos passos:
    
    1. 📖 Leia o tutorial completo:
       cat TUTORIAL_COMPLETO.md
    
    2. 🚀 Execute seu primeiro programa:
       stk run examples/hello-world.stk
    
    3. 🌐 Inicie o editor web:
       stk web
    
    4. 👥 Compartilhe um projeto:
       stk share
    
    5. 🤖 Teste a IA integrada:
       stk analyze examples/hello-world.stk
    
    📁 Exemplos disponíveis em: ~/stack-examples/
    ⚙️  Configuração em: ~/.stack-extension.json
    
    💡 Dica: Use 'stk --help' para ver todos os comandos disponíveis!
    
    🚀 Bem-vindo ao futuro da programação com Stack Extensão!
    "
}

# Função principal
main() {
    print_banner
    
    print_color $YELLOW "🚀 Iniciando instalação da Stack Extensão..."
    print_color $YELLOW "⏱️  Isso pode levar alguns minutos..."
    echo
    
    # Verificar se estamos no diretório correto
    if [ ! -f "package.json" ]; then
        print_color $RED "❌ Execute este script no diretório raiz do projeto Stack Extensão!"
        exit 1
    fi
    
    # Executar etapas de instalação
    check_prerequisites
    echo
    
    install_dependencies
    echo
    
    install_global
    echo
    
    run_tests
    echo
    
    create_examples
    echo
    
    setup_environment
    echo
    
    demonstrate_installation
    echo
    
    show_next_steps
}

# Verificar argumentos
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_color $CYAN "Stack Extensão - Instalador"
    print_color $CYAN "Uso: ./install.sh [opções]"
    print_color $CYAN ""
    print_color $CYAN "Opções:"
    print_color $CYAN "  --help, -h     Mostra esta ajuda"
    print_color $CYAN "  --no-global    Não instala globalmente"
    print_color $CYAN "  --no-tests     Não executa testes"
    print_color $CYAN "  --no-examples  Não cria exemplos"
    exit 0
fi

# Verificar se não deve instalar globalmente
if [ "$1" = "--no-global" ]; then
    export NO_GLOBAL_INSTALL=true
fi

# Verificar se não deve executar testes
if [ "$1" = "--no-tests" ]; then
    export NO_TESTS=true
fi

# Verificar se não deve criar exemplos
if [ "$1" = "--no-examples" ]; then
    export NO_EXAMPLES=true
fi

# Executar instalação
main