/**
 * Editor Web Integrado para Stack Extensão
 * Editor de código com execução em tempo real e tradução bilíngue
 */

class WebEditor {
  constructor(options = {}) {
    this.container = options.container || document.body
    this.theme = options.theme || 'dark'
    this.language = options.language || 'portuguese'
    this.autoSave = options.autoSave !== false
    this.autoRun = options.autoRun || false
    this.collaborative = options.collaborative || false
    
    this.editor = null
    this.output = null
    this.console = null
    this.files = new Map()
    this.currentFile = null
    this.isRunning = false
    this.websocket = null
    this.collaborators = new Map()
    
    this.initializeEditor()
    this.setupEventListeners()
    this.setupWebSocket()
  }

  // Inicializar editor
  initializeEditor() {
    // Criar estrutura HTML
    this.container.innerHTML = `
      <div class="stack-editor">
        <div class="editor-header">
          <div class="file-tabs">
            <div class="file-tab active" data-file="main.stk">
              <span>main.stk</span>
              <button class="close-tab" onclick="this.closeTab('main.stk')">×</button>
            </div>
            <button class="new-file-btn" onclick="this.newFile()">+</button>
          </div>
          <div class="editor-controls">
            <button class="run-btn" onclick="this.runCode()">
              <span class="icon">▶</span> Executar
            </button>
            <button class="translate-btn" onclick="this.toggleLanguage()">
              <span class="icon">🌐</span> <span class="lang-text">PT/EN</span>
            </button>
            <button class="share-btn" onclick="this.shareProject()">
              <span class="icon">🔗</span> Compartilhar
            </button>
            <button class="save-btn" onclick="this.saveProject()">
              <span class="icon">💾</span> Salvar
            </button>
            <select class="theme-select" onchange="this.changeTheme(this.value)">
              <option value="dark">Tema Escuro</option>
              <option value="light">Tema Claro</option>
              <option value="monokai">Monokai</option>
            </select>
          </div>
        </div>
        <div class="editor-content">
          <div class="editor-panel">
            <div class="editor-container">
              <textarea id="code-editor" placeholder="Digite seu código Stack Extensão aqui..."></textarea>
            </div>
            <div class="editor-footer">
              <div class="status-bar">
                <span class="language-indicator">Português</span>
                <span class="line-info">Linha 1, Coluna 1</span>
                <span class="file-info">main.stk</span>
              </div>
            </div>
          </div>
          <div class="output-panel">
            <div class="output-tabs">
              <button class="output-tab active" data-tab="output">Saída</button>
              <button class="output-tab" data-tab="console">Console</button>
              <button class="output-tab" data-tab="errors">Erros</button>
              <button class="output-tab" data-tab="ai">IA</button>
            </div>
            <div class="output-content">
              <div class="output-tab-content active" id="output">
                <div class="output-text"></div>
              </div>
              <div class="output-tab-content" id="console">
                <div class="console-text"></div>
              </div>
              <div class="output-tab-content" id="errors">
                <div class="errors-text"></div>
              </div>
              <div class="output-tab-content" id="ai">
                <div class="ai-suggestions"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="collaborators-panel" style="display: none;">
          <h4>Colaboradores Online</h4>
          <div class="collaborators-list"></div>
        </div>
      </div>
    `

    // Configurar editor
    this.setupCodeEditor()
    this.setupOutput()
    this.setupConsole()
    this.setupAI()
    this.loadDefaultCode()
    this.applyTheme(this.theme)
  }

  // Configurar editor de código
  setupCodeEditor() {
    this.editor = document.getElementById('code-editor')
    
    // Configurar editor com funcionalidades avançadas
    this.editor.addEventListener('input', () => {
      this.onCodeChange()
      this.updateLineInfo()
    })

    this.editor.addEventListener('keydown', (e) => {
      this.handleKeyDown(e)
    })

    this.editor.addEventListener('paste', (e) => {
      this.handlePaste(e)
    })

    // Auto-save
    if (this.autoSave) {
      setInterval(() => {
        this.autoSaveProject()
      }, 5000)
    }

    // Auto-run
    if (this.autoRun) {
      let timeout
      this.editor.addEventListener('input', () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          this.runCode()
        }, 2000)
      })
    }
  }

  // Configurar saída
  setupOutput() {
    this.output = document.querySelector('.output-text')
  }

  // Configurar console
  setupConsole() {
    this.console = document.querySelector('.console-text')
    
    // Interceptar console.log
    const originalLog = console.log
    console.log = (...args) => {
      originalLog(...args)
      this.addToConsole(args.join(' '))
    }
  }

  // Configurar IA
  setupAI() {
    this.aiPanel = document.querySelector('.ai-suggestions')
  }

  // Carregar código padrão
  loadDefaultCode() {
    const defaultCode = `// Bem-vindo ao Stack Extensão Editor!
// Digite seu código aqui e pressione Ctrl+Enter para executar

funcao main() {
    imprimir("Olá, Stack Extensão!")
    
    variavel numeros = [1, 2, 3, 4, 5]
    variavel soma = 0
    
    para (variavel i = 0; i menor numeros.length; i = i mais 1) {
        soma = soma mais numeros[i]
    }
    
    imprimir("Soma dos números: " + soma)
}

main()`

    this.editor.value = defaultCode
    this.files.set('main.stk', defaultCode)
    this.currentFile = 'main.stk'
  }

  // Configurar event listeners
  setupEventListeners() {
    // Tabs de saída
    document.querySelectorAll('.output-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchOutputTab(e.target.dataset.tab)
      })
    })

    // Tabs de arquivo
    document.querySelectorAll('.file-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchFile(e.target.dataset.file)
      })
    })
  }

  // Configurar WebSocket para colaboração
  setupWebSocket() {
    if (this.collaborative) {
      this.websocket = new WebSocket('ws://localhost:3000/collaborate')
      
      this.websocket.onopen = () => {
        console.log('Conectado para colaboração')
      }

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleCollaborationMessage(data)
      }

      this.websocket.onclose = () => {
        console.log('Conexão de colaboração fechada')
      }
    }
  }

  // Executar código
  async runCode() {
    if (this.isRunning) return

    this.isRunning = true
    this.updateRunButton(true)
    this.clearOutput()
    this.clearConsole()
    this.clearErrors()

    try {
      const code = this.editor.value
      this.files.set(this.currentFile, code)

      // Compilar código Stack Extensão
      const compiled = await this.compileCode(code)
      
      // Executar código compilado
      const result = await this.executeCode(compiled)
      
      this.addToOutput(result.output)
      this.addToConsole('Código executado com sucesso!')

      // Análise com IA
      this.analyzeWithAI(code)

    } catch (error) {
      this.addToError(error.message)
      this.addToConsole('Erro na execução: ' + error.message)
    } finally {
      this.isRunning = false
      this.updateRunButton(false)
    }
  }

  // Compilar código
  async compileCode(code) {
    // Simular compilação (aqui seria feita a compilação real)
    const compiled = `
      // Código compilado para JavaScript
      ${code.replace(/funcao/g, 'function')
            .replace(/variavel/g, 'var')
            .replace(/imprimir/g, 'console.log')
            .replace(/se/g, 'if')
            .replace(/senao/g, 'else')
            .replace(/enquanto/g, 'while')
            .replace(/para/g, 'for')
            .replace(/retornar/g, 'return')
            .replace(/mais/g, '+')
            .replace(/menos/g, '-')
            .replace(/vezes/g, '*')
            .replace(/dividido/g, '/')
            .replace(/elevado/g, '**')
            .replace(/modulo/g, '%')
            .replace(/igual/g, '===')
            .replace(/diferente/g, '!==')
            .replace(/maior/g, '>')
            .replace(/menor/g, '<')
            .replace(/maior_igual/g, '>=')
            .replace(/menor_igual/g, '<=')
            .replace(/e/g, '&&')
            .replace(/ou/g, '||')
            .replace(/nao/g, '!')
            .replace(/verdadeiro/g, 'true')
            .replace(/falso/g, 'false')
            .replace(/nulo/g, 'null')
            .replace(/vazio/g, 'undefined')}
    `
    
    return compiled
  }

  // Executar código compilado
  async executeCode(compiled) {
    return new Promise((resolve, reject) => {
      try {
        // Capturar console.log
        const originalLog = console.log
        const logs = []
        
        console.log = (...args) => {
          logs.push(args.join(' '))
          originalLog(...args)
        }

        // Executar código
        eval(compiled)

        // Restaurar console.log
        console.log = originalLog

        resolve({
          output: logs.join('\n'),
          success: true
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Analisar com IA
  async analyzeWithAI(code) {
    const aiPanel = document.getElementById('ai')
    aiPanel.innerHTML = '<div class="ai-loading">Analisando código com IA...</div>'

    // Simular análise da IA
    setTimeout(() => {
      const suggestions = this.generateAISuggestions(code)
      this.displayAISuggestions(suggestions)
    }, 1000)
  }

  // Gerar sugestões da IA
  generateAISuggestions(code) {
    const suggestions = []

    // Verificar se há funções sem retorno
    if (code.includes('funcao') && !code.includes('retornar')) {
      suggestions.push({
        type: 'warning',
        message: 'Função sem retorno explícito',
        suggestion: 'Considere adicionar um retornar no final da função'
      })
    }

    // Verificar divisão por zero
    if (code.includes('dividido') && !code.includes('se') && !code.includes('diferente 0')) {
      suggestions.push({
        type: 'error',
        message: 'Possível divisão por zero',
        suggestion: 'Adicione verificação antes da divisão'
      })
    }

    // Verificar loops infinitos
    if (code.includes('enquanto') && !code.includes('i = i mais 1')) {
      suggestions.push({
        type: 'warning',
        message: 'Loop pode ser infinito',
        suggestion: 'Verifique se há incremento da variável de controle'
      })
    }

    // Sugestões de otimização
    if (code.includes('para') && code.includes('imprimir')) {
      suggestions.push({
        type: 'info',
        message: 'Otimização disponível',
        suggestion: 'Considere usar console.log com array para melhor performance'
      })
    }

    return suggestions
  }

  // Exibir sugestões da IA
  displayAISuggestions(suggestions) {
    const aiPanel = document.getElementById('ai')
    
    if (suggestions.length === 0) {
      aiPanel.innerHTML = '<div class="ai-success">✅ Código analisado - Nenhum problema encontrado!</div>'
      return
    }

    let html = '<div class="ai-suggestions-list">'
    
    suggestions.forEach((suggestion, index) => {
      html += `
        <div class="ai-suggestion ${suggestion.type}">
          <div class="suggestion-header">
            <span class="suggestion-type">${suggestion.type.toUpperCase()}</span>
            <span class="suggestion-message">${suggestion.message}</span>
          </div>
          <div class="suggestion-body">
            <p>${suggestion.suggestion}</p>
          </div>
        </div>
      `
    })
    
    html += '</div>'
    aiPanel.innerHTML = html
  }

  // Alternar idioma
  toggleLanguage() {
    const code = this.editor.value
    const currentLanguage = this.detectLanguage(code)
    
    let targetLanguage
    if (currentLanguage === 'portuguese') {
      targetLanguage = 'english'
    } else {
      targetLanguage = 'portuguese'
    }

    const translated = this.translateCode(code, targetLanguage)
    this.editor.value = translated.code
    
    // Atualizar indicador de idioma
    const langIndicator = document.querySelector('.language-indicator')
    langIndicator.textContent = targetLanguage === 'portuguese' ? 'Português' : 'English'
    
    // Atualizar botão
    const langText = document.querySelector('.lang-text')
    langText.textContent = targetLanguage === 'portuguese' ? 'PT/EN' : 'EN/PT'
  }

  // Detectar idioma do código
  detectLanguage(code) {
    const portugueseWords = ['funcao', 'variavel', 'imprimir', 'se', 'senao', 'enquanto', 'para']
    const englishWords = ['function', 'var', 'console.log', 'if', 'else', 'while', 'for']
    
    let ptCount = 0
    let enCount = 0
    
    portugueseWords.forEach(word => {
      if (code.includes(word)) ptCount++
    })
    
    englishWords.forEach(word => {
      if (code.includes(word)) enCount++
    })
    
    return ptCount > enCount ? 'portuguese' : 'english'
  }

  // Traduzir código
  translateCode(code, targetLanguage) {
    // Implementação básica de tradução
    let translated = code
    
    if (targetLanguage === 'english') {
      translated = translated.replace(/funcao/g, 'function')
      translated = translated.replace(/variavel/g, 'var')
      translated = translated.replace(/imprimir/g, 'console.log')
      translated = translated.replace(/se/g, 'if')
      translated = translated.replace(/senao/g, 'else')
      translated = translated.replace(/enquanto/g, 'while')
      translated = translated.replace(/para/g, 'for')
      translated = translated.replace(/retornar/g, 'return')
      translated = translated.replace(/mais/g, '+')
      translated = translated.replace(/menos/g, '-')
      translated = translated.replace(/vezes/g, '*')
      translated = translated.replace(/dividido/g, '/')
      translated = translated.replace(/elevado/g, '**')
      translated = translated.replace(/modulo/g, '%')
      translated = translated.replace(/igual/g, '===')
      translated = translated.replace(/diferente/g, '!==')
      translated = translated.replace(/maior/g, '>')
      translated = translated.replace(/menor/g, '<')
      translated = translated.replace(/maior_igual/g, '>=')
      translated = translated.replace(/menor_igual/g, '<=')
      translated = translated.replace(/e/g, '&&')
      translated = translated.replace(/ou/g, '||')
      translated = translated.replace(/nao/g, '!')
      translated = translated.replace(/verdadeiro/g, 'true')
      translated = translated.replace(/falso/g, 'false')
      translated = translated.replace(/nulo/g, 'null')
      translated = translated.replace(/vazio/g, 'undefined')
    } else {
      translated = translated.replace(/function/g, 'funcao')
      translated = translated.replace(/var/g, 'variavel')
      translated = translated.replace(/console\.log/g, 'imprimir')
      translated = translated.replace(/if/g, 'se')
      translated = translated.replace(/else/g, 'senao')
      translated = translated.replace(/while/g, 'enquanto')
      translated = translated.replace(/for/g, 'para')
      translated = translated.replace(/return/g, 'retornar')
      translated = translated.replace(/\+/g, 'mais')
      translated = translated.replace(/-/g, 'menos')
      translated = translated.replace(/\*/g, 'vezes')
      translated = translated.replace(/\//g, 'dividido')
      translated = translated.replace(/\*\*/g, 'elevado')
      translated = translated.replace(/%/g, 'modulo')
      translated = translated.replace(/===/g, 'igual')
      translated = translated.replace(/!==/g, 'diferente')
      translated = translated.replace(/>/g, 'maior')
      translated = translated.replace(/</g, 'menor')
      translated = translated.replace(/>=/g, 'maior_igual')
      translated = translated.replace(/<=/g, 'menor_igual')
      translated = translated.replace(/&&/g, 'e')
      translated = translated.replace(/\|\|/g, 'ou')
      translated = translated.replace(/!/g, 'nao')
      translated = translated.replace(/true/g, 'verdadeiro')
      translated = translated.replace(/false/g, 'falso')
      translated = translated.replace(/null/g, 'nulo')
      translated = translated.replace(/undefined/g, 'vazio')
    }
    
    return { code: translated }
  }

  // Mudar tema
  changeTheme(theme) {
    this.theme = theme
    this.applyTheme(theme)
  }

  // Aplicar tema
  applyTheme(theme) {
    const editor = document.querySelector('.stack-editor')
    editor.className = `stack-editor theme-${theme}`
  }

  // Compartilhar projeto
  shareProject() {
    const projectData = {
      files: Object.fromEntries(this.files),
      theme: this.theme,
      language: this.language,
      timestamp: Date.now()
    }

    // Gerar link de compartilhamento
    const encoded = btoa(JSON.stringify(projectData))
    const shareUrl = `${window.location.origin}?project=${encoded}`
    
    // Copiar para clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.addToConsole('Link de compartilhamento copiado!')
      this.showShareModal(shareUrl)
    })
  }

  // Mostrar modal de compartilhamento
  showShareModal(url) {
    const modal = document.createElement('div')
    modal.className = 'share-modal'
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Compartilhar Projeto</h3>
        <p>Link para compartilhar:</p>
        <input type="text" value="${url}" readonly>
        <button onclick="this.closeModal()">Fechar</button>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal()
      }
    })
  }

  // Fechar modal
  closeModal() {
    const modal = document.querySelector('.share-modal')
    if (modal) {
      modal.remove()
    }
  }

  // Salvar projeto
  saveProject() {
    const projectData = {
      files: Object.fromEntries(this.files),
      theme: this.theme,
      language: this.language,
      timestamp: Date.now()
    }

    // Salvar no localStorage
    localStorage.setItem('stack-project', JSON.stringify(projectData))
    this.addToConsole('Projeto salvo localmente!')
  }

  // Auto-salvar projeto
  autoSaveProject() {
    if (this.autoSave) {
      this.saveProject()
    }
  }

  // Carregar projeto
  loadProject(projectData) {
    this.files = new Map(Object.entries(projectData.files))
    this.theme = projectData.theme || 'dark'
    this.language = projectData.language || 'portuguese'
    
    // Carregar arquivo principal
    if (this.files.has('main.stk')) {
      this.editor.value = this.files.get('main.stk')
      this.currentFile = 'main.stk'
    }
    
    this.applyTheme(this.theme)
    this.addToConsole('Projeto carregado!')
  }

  // Utilitários de saída
  addToOutput(text) {
    this.output.innerHTML += text + '\n'
    this.output.scrollTop = this.output.scrollHeight
  }

  addToConsole(text) {
    this.console.innerHTML += `<div class="console-line">${text}</div>`
    this.console.scrollTop = this.console.scrollHeight
  }

  addToError(text) {
    const errorsPanel = document.getElementById('errors')
    errorsPanel.innerHTML += `<div class="error-line">${text}</div>`
  }

  clearOutput() {
    this.output.innerHTML = ''
  }

  clearConsole() {
    this.console.innerHTML = ''
  }

  clearErrors() {
    const errorsPanel = document.getElementById('errors')
    errorsPanel.innerHTML = ''
  }

  // Utilitários de interface
  updateRunButton(running) {
    const runBtn = document.querySelector('.run-btn')
    if (running) {
      runBtn.innerHTML = '<span class="icon">⏸</span> Executando...'
      runBtn.disabled = true
    } else {
      runBtn.innerHTML = '<span class="icon">▶</span> Executar'
      runBtn.disabled = false
    }
  }

  updateLineInfo() {
    const text = this.editor.value
    const lines = text.split('\n')
    const cursorPos = this.editor.selectionStart
    const beforeCursor = text.substring(0, cursorPos)
    const line = beforeCursor.split('\n').length
    const column = beforeCursor.split('\n').pop().length + 1

    const lineInfo = document.querySelector('.line-info')
    lineInfo.textContent = `Linha ${line}, Coluna ${column}`
  }

  switchOutputTab(tabName) {
    // Remover active de todas as tabs
    document.querySelectorAll('.output-tab').forEach(tab => {
      tab.classList.remove('active')
    })
    
    document.querySelectorAll('.output-tab-content').forEach(content => {
      content.classList.remove('active')
    })

    // Ativar tab selecionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active')
    document.getElementById(tabName).classList.add('active')
  }

  switchFile(fileName) {
    if (this.files.has(fileName)) {
      this.editor.value = this.files.get(fileName)
      this.currentFile = fileName
      
      // Atualizar tabs
      document.querySelectorAll('.file-tab').forEach(tab => {
        tab.classList.remove('active')
      })
      document.querySelector(`[data-file="${fileName}"]`).classList.add('active')
    }
  }

  newFile() {
    const fileName = prompt('Nome do arquivo:', 'novo.stk')
    if (fileName) {
      this.files.set(fileName, '')
      this.addFileTab(fileName)
    }
  }

  addFileTab(fileName) {
    const tabsContainer = document.querySelector('.file-tabs')
    const newTab = document.createElement('div')
    newTab.className = 'file-tab'
    newTab.dataset.file = fileName
    newTab.innerHTML = `
      <span>${fileName}</span>
      <button class="close-tab" onclick="this.closeTab('${fileName}')">×</button>
    `
    
    // Inserir antes do botão de novo arquivo
    const newFileBtn = document.querySelector('.new-file-btn')
    tabsContainer.insertBefore(newTab, newFileBtn)
  }

  closeTab(fileName) {
    if (this.files.size > 1) {
      this.files.delete(fileName)
      document.querySelector(`[data-file="${fileName}"]`).remove()
      
      // Mudar para outro arquivo se necessário
      if (this.currentFile === fileName) {
        const firstFile = this.files.keys().next().value
        this.switchFile(firstFile)
      }
    }
  }

  // Event handlers
  onCodeChange() {
    if (this.currentFile) {
      this.files.set(this.currentFile, this.editor.value)
    }
  }

  handleKeyDown(e) {
    // Ctrl+Enter para executar
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      this.runCode()
    }
    
    // Ctrl+S para salvar
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      this.saveProject()
    }
  }

  handlePaste(e) {
    // Processar colagem de código
    setTimeout(() => {
      this.onCodeChange()
    }, 0)
  }

  // Colaboração
  handleCollaborationMessage(data) {
    switch (data.type) {
      case 'code_change':
        this.handleRemoteCodeChange(data)
        break
      case 'cursor_move':
        this.handleRemoteCursorMove(data)
        break
      case 'user_join':
        this.handleUserJoin(data)
        break
      case 'user_leave':
        this.handleUserLeave(data)
        break
    }
  }

  handleRemoteCodeChange(data) {
    if (data.userId !== this.userId) {
      this.editor.value = data.code
      this.files.set(this.currentFile, data.code)
    }
  }

  handleRemoteCursorMove(data) {
    // Mostrar cursor de outros usuários
    // Implementação seria mais complexa com CodeMirror ou Monaco
  }

  handleUserJoin(data) {
    this.collaborators.set(data.userId, data.user)
    this.updateCollaboratorsList()
  }

  handleUserLeave(data) {
    this.collaborators.delete(data.userId)
    this.updateCollaboratorsList()
  }

  updateCollaboratorsList() {
    const list = document.querySelector('.collaborators-list')
    list.innerHTML = ''
    
    this.collaborators.forEach((user, userId) => {
      const item = document.createElement('div')
      item.className = 'collaborator'
      item.innerHTML = `
        <span class="user-avatar">${user.name[0]}</span>
        <span class="user-name">${user.name}</span>
      `
      list.appendChild(item)
    })
  }
}

// CSS para o editor
const editorCSS = `
  <style>
    .stack-editor {
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #1e1e1e;
      color: #d4d4d4;
    }

    .theme-light {
      background: #ffffff;
      color: #333333;
    }

    .theme-monokai {
      background: #272822;
      color: #f8f8f2;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #2d2d30;
      border-bottom: 1px solid #3e3e42;
    }

    .file-tabs {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .file-tab {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: #3e3e42;
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      position: relative;
    }

    .file-tab.active {
      background: #1e1e1e;
    }

    .close-tab {
      margin-left: 8px;
      background: none;
      border: none;
      color: #d4d4d4;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 2px;
    }

    .close-tab:hover {
      background: #ff6b6b;
    }

    .new-file-btn {
      background: #007acc;
      border: none;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    .editor-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .run-btn, .translate-btn, .share-btn, .save-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 12px;
      background: #007acc;
      border: none;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .run-btn:hover, .translate-btn:hover, .share-btn:hover, .save-btn:hover {
      background: #005a9e;
    }

    .run-btn:disabled {
      background: #666;
      cursor: not-allowed;
    }

    .theme-select {
      padding: 8px 12px;
      background: #3e3e42;
      border: 1px solid #555;
      color: #d4d4d4;
      border-radius: 4px;
    }

    .editor-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .editor-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .editor-container {
      flex: 1;
      position: relative;
    }

    #code-editor {
      width: 100%;
      height: 100%;
      background: #1e1e1e;
      color: #d4d4d4;
      border: none;
      padding: 20px;
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      outline: none;
    }

    .editor-footer {
      background: #2d2d30;
      padding: 5px 10px;
      border-top: 1px solid #3e3e42;
    }

    .status-bar {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: #888;
    }

    .output-panel {
      width: 400px;
      display: flex;
      flex-direction: column;
      background: #252526;
      border-left: 1px solid #3e3e42;
    }

    .output-tabs {
      display: flex;
      background: #2d2d30;
    }

    .output-tab {
      flex: 1;
      padding: 10px;
      background: #3e3e42;
      border: none;
      color: #d4d4d4;
      cursor: pointer;
    }

    .output-tab.active {
      background: #252526;
    }

    .output-content {
      flex: 1;
      overflow: hidden;
    }

    .output-tab-content {
      display: none;
      height: 100%;
      padding: 10px;
      overflow-y: auto;
    }

    .output-tab-content.active {
      display: block;
    }

    .output-text, .console-text, .errors-text {
      white-space: pre-wrap;
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.4;
    }

    .console-line {
      margin-bottom: 2px;
    }

    .error-line {
      color: #f48771;
      margin-bottom: 2px;
    }

    .ai-suggestions-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ai-suggestion {
      padding: 10px;
      border-radius: 4px;
      border-left: 4px solid;
    }

    .ai-suggestion.error {
      background: #2d1b1b;
      border-left-color: #f48771;
    }

    .ai-suggestion.warning {
      background: #2d2a1b;
      border-left-color: #dcdcaa;
    }

    .ai-suggestion.info {
      background: #1b2d2d;
      border-left-color: #4ec9b0;
    }

    .suggestion-header {
      display: flex;
      gap: 10px;
      margin-bottom: 5px;
    }

    .suggestion-type {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10px;
    }

    .suggestion-message {
      font-weight: bold;
    }

    .ai-loading {
      text-align: center;
      color: #888;
      font-style: italic;
    }

    .ai-success {
      text-align: center;
      color: #4ec9b0;
      font-weight: bold;
    }

    .collaborators-panel {
      width: 200px;
      background: #2d2d30;
      padding: 10px;
      border-left: 1px solid #3e3e42;
    }

    .collaborator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px;
      margin-bottom: 5px;
    }

    .user-avatar {
      width: 24px;
      height: 24px;
      background: #007acc;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .share-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: #2d2d30;
      padding: 20px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
    }

    .modal-content input {
      width: 100%;
      padding: 8px;
      margin: 10px 0;
      background: #3e3e42;
      border: 1px solid #555;
      color: #d4d4d4;
      border-radius: 4px;
    }

    .modal-content button {
      background: #007acc;
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
`

// Adicionar CSS ao documento
document.head.insertAdjacentHTML('beforeend', editorCSS)

module.exports = WebEditor