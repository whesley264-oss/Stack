# 🚀 Stack Extensão Executor

<div align="center">

![Stack Extensão Executor](https://img.shields.io/badge/Stack%20Extensão%20Executor-1.0.0-blue?style=for-the-badge&logo=python&logoColor=white)

**Executor visual em Python para Stack Extensão - Execute qualquer código .stk com interface amigável!**

[![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Stack Extensão](https://img.shields.io/badge/Stack%20Extensão-1.0.0-purple?style=for-the-badge)](https://github.com/stack-extension/stack-extension)

</div>

---

## ✨ Funcionalidades

### 🎯 **Execução Visual**
- Interface de terminal colorida e amigável
- Banner animado da Stack Extensão
- Menu interativo com opções numeradas
- Feedback visual em tempo real

### 🚀 **Execução de Código**
- Execute arquivos `.stk` diretamente
- Suporte a servidor web com hot-reload
- Compilação para JavaScript e Python
- Análise de código com IA integrada

### 🌐 **Servidor Web Inteligente**
- Detecta automaticamente se é um projeto web
- Abre automaticamente no navegador
- Gera link de acesso
- Hot-reload automático

### 🧮 **Operações Avançadas**
- Tradução de código (PT ↔ EN)
- Análise de código com IA
- Visualização de exemplos
- Configurações personalizáveis

---

## 🚀 Instalação e Uso

### 1. **Execução Rápida**
```bash
# Executar diretamente
python3 executor.py

# Ou usar o script de conveniência
./run-executor.sh
```

### 2. **Verificar Pré-requisitos**
```bash
# Verificar se tudo está funcionando
./run-executor.sh --check
```

### 3. **Instalar Dependências**
```bash
# Instalar dependências necessárias
./run-executor.sh --install
```

---

## 📋 Menu Principal

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🚀 STACK EXTENSÃO EXECUTOR                      ║
║                                                              ║
║        A super linguagem de programação única!              ║
║                                                              ║
║  • Código Bilíngue (PT/EN)                                  ║
║  • Operadores em Português                                  ║
║  • IA Integrada                                             ║
║  • Editor Web Completo                                      ║
║  • Colaboração em Tempo Real                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📋 MENU PRINCIPAL
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
0. Sair
```

---

## 🎯 Exemplos de Uso

### **1. Executar Arquivo .stk**
```
Digite o caminho do arquivo .stk: examples/teste-executor.stk
✅ Arquivo encontrado: examples/teste-executor.stk

🚀 EXECUTANDO ARQUIVO
═══════════════════════════════════════════════════════════════
Arquivo: examples/teste-executor.stk
Data: 15/12/2024 14:30:25
═══════════════════════════════════════════════════════════════

✅ Execução bem-sucedida!

📤 SAÍDA:
🚀 Stack Extensão - Teste do Executor Python!
==================================================
👤 Dados pessoais:
Nome: Desenvolvedor
Idade: 25
Salário: R$ 5000.5
...
```

### **2. Executar Servidor Web**
```
Digite o caminho do arquivo .stk: examples/web-demo.stk
✅ Arquivo encontrado: examples/web-demo.stk

🌐 EXECUTANDO SERVIDOR WEB
═══════════════════════════════════════════════════════════════
Arquivo: examples/web-demo.stk
Porta: 3000
═══════════════════════════════════════════════════════════════

✅ Servidor iniciado com sucesso!

🌐 ACESSE SEU PROJETO:
═══════════════════════════════════════════════════════════════
🔗 http://localhost:3000
═══════════════════════════════════════════════════════════════

✅ Abrindo no navegador...
```

### **3. Compilar para JavaScript**
```
Digite o caminho do arquivo .stk: examples/teste-executor.stk
✅ Arquivo encontrado: examples/teste-executor.stk

📦 COMPILANDO PARA JAVASCRIPT
═══════════════════════════════════════════════════════════════
Arquivo: examples/teste-executor.stk
═══════════════════════════════════════════════════════════════

✅ Compilação bem-sucedida!

📤 CÓDIGO JAVASCRIPT GERADO:
console.log("🚀 Stack Extensão - Teste do Executor Python!");
console.log("=".repeat(50));
...
```

---

## 🛠️ Configuração

### **Arquivo de Configuração**
O executor usa o arquivo `executor-config.json` para configurações:

```json
{
  "version": "1.0.0",
  "name": "Stack Extensão Executor",
  "settings": {
    "default_port": 3000,
    "timeout": 30,
    "auto_open_browser": true,
    "theme": "default",
    "language": "pt"
  },
  "features": {
    "file_execution": true,
    "web_server": true,
    "compilation": true,
    "ai_analysis": true,
    "translation": true,
    "examples": true,
    "settings": true,
    "help": true
  }
}
```

### **Configurações Disponíveis**
- **Porta padrão**: Porta para servidor web (padrão: 3000)
- **Timeout**: Tempo limite para execução (padrão: 30s)
- **Auto-abrir navegador**: Abrir automaticamente no navegador
- **Tema**: Tema visual do terminal
- **Idioma**: Idioma da interface (pt/en)

---

## 📁 Estrutura de Arquivos

```
stack-extension/
├── executor.py              # Executor principal
├── run-executor.sh          # Script de conveniência
├── executor-config.json     # Configurações
├── EXECUTOR_README.md       # Esta documentação
├── examples/
│   ├── teste-executor.stk   # Exemplo básico
│   └── web-demo.stk         # Exemplo web
└── ...
```

---

## 🎨 Interface Visual

### **Cores e Estilos**
- 🔴 **Vermelho**: Erros e avisos
- 🟢 **Verde**: Sucesso e confirmações
- 🟡 **Amarelo**: Avisos e prompts
- 🔵 **Azul**: Informações e processos
- 🟣 **Roxo**: Títulos e destaques
- 🔵 **Ciano**: Banner e separadores

### **Símbolos**
- ✅ Sucesso
- ❌ Erro
- ⚠️ Aviso
- 🚀 Execução
- 🌐 Web
- 📦 Compilação
- 🤖 IA
- 🌍 Tradução
- 📚 Exemplos
- ⚙️ Configurações

---

## 🔧 Troubleshooting

### **Problemas Comuns**

#### **1. Python não encontrado**
```bash
# Instalar Python 3
sudo apt-get install python3 python3-pip  # Ubuntu/Debian
brew install python3                       # macOS
```

#### **2. Arquivo não encontrado**
```bash
# Verificar se está no diretório correto
ls -la executor.py
```

#### **3. Permissão negada**
```bash
# Dar permissão de execução
chmod +x executor.py
chmod +x run-executor.sh
```

#### **4. Porta em uso**
```
⚠️ Porta 3000 em uso. Tentando porta 3001...
```

### **Logs e Debug**
```bash
# Executar com debug
python3 executor.py --debug

# Ver logs detalhados
tail -f logs/executor.log
```

---

## 🚀 Funcionalidades Avançadas

### **1. Detecção Automática de Tipo**
- **Arquivo .stk simples**: Executa no terminal
- **Arquivo .stk web**: Inicia servidor web
- **Detecção por conteúdo**: Analisa código para determinar tipo

### **2. Hot-reload Inteligente**
- Monitora mudanças no arquivo
- Recarrega automaticamente
- Notifica sobre mudanças

### **3. Integração com Stack Extensão**
- Usa comandos `stk` nativos
- Fallback para `npx stack-extension`
- Instalação automática se necessário

### **4. Análise de Código**
- Detecção de erros
- Sugestões de melhoria
- Análise de performance
- Verificação de segurança

---

## 📚 Exemplos Práticos

### **Exemplo 1: Calculadora Simples**
```stk
// calculadora.stk
imprimir("🧮 Calculadora Stack Extensão")

variavel a = 10
variavel b = 5

imprimir("a = " + a + ", b = " + b)
imprimir("a mais b = " + (a mais b))
imprimir("a vezes b = " + (a vezes b))
```

**Executar:**
```bash
python3 executor.py
# Escolher opção 1
# Digitar: calculadora.stk
```

### **Exemplo 2: Aplicação Web**
```stk
// app-web.stk
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
python3 executor.py
# Escolher opção 2
# Digitar: app-web.stk
# Acessar: http://localhost:3000
```

---

## 🤝 Contribuição

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature
3. Faça suas alterações
4. Teste o executor
5. Abra um Pull Request

### **Áreas de Melhoria**
- [ ] Suporte a mais temas
- [ ] Integração com IDEs
- [ ] Plugins personalizados
- [ ] Métricas de uso
- [ ] Logs avançados

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🎉 Agradecimentos

- Comunidade Stack Extensão
- Contribuidores do executor
- Usuários que testam e reportam bugs
- Desenvolvedores Python

---

<div align="center">

**🚀 Stack Extensão Executor - Execute sua super linguagem com estilo!**

[![GitHub stars](https://img.shields.io/github/stars/stack-extension/stack-extension?style=social)](https://github.com/stack-extension/stack-extension)
[![GitHub forks](https://img.shields.io/github/forks/stack-extension/stack-extension?style=social)](https://github.com/stack-extension/stack-extension)

</div>