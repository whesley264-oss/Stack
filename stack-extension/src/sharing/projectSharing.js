/**
 * Sistema de Compartilhamento de Projetos para Stack Extensão
 * Permite compartilhar, colaborar e executar projetos em tempo real
 */

class ProjectSharing {
  constructor(options = {}) {
    this.serverUrl = options.serverUrl || 'http://localhost:3000'
    this.websocket = null
    this.currentProject = null
    this.collaborators = new Map()
    this.userId = this.generateUserId()
    this.userName = options.userName || 'Usuário Anônimo'
    this.isHost = false
    this.isConnected = false
    
    this.initializeSharing()
  }

  // Inicializar sistema de compartilhamento
  initializeSharing() {
    this.setupWebSocket()
    this.setupEventListeners()
    this.loadUserPreferences()
  }

  // Configurar WebSocket
  setupWebSocket() {
    this.websocket = new WebSocket(`${this.serverUrl.replace('http', 'ws')}/share`)
    
    this.websocket.onopen = () => {
      console.log('Conectado ao servidor de compartilhamento')
      this.isConnected = true
      this.onConnectionChange(true)
    }

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }

    this.websocket.onclose = () => {
      console.log('Conexão de compartilhamento fechada')
      this.isConnected = false
      this.onConnectionChange(false)
    }

    this.websocket.onerror = (error) => {
      console.error('Erro na conexão de compartilhamento:', error)
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Detectar mudanças na URL para carregar projetos compartilhados
    window.addEventListener('popstate', () => {
      this.loadProjectFromURL()
    })

    // Detectar fechamento da página para notificar colaboradores
    window.addEventListener('beforeunload', () => {
      this.leaveProject()
    })

    // Detectar mudanças de foco para sincronizar estado
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseCollaboration()
      } else {
        this.resumeCollaboration()
      }
    })
  }

  // Carregar preferências do usuário
  loadUserPreferences() {
    const saved = localStorage.getItem('stack-user-preferences')
    if (saved) {
      const prefs = JSON.parse(saved)
      this.userName = prefs.userName || this.userName
      this.userId = prefs.userId || this.userId
    }
  }

  // Salvar preferências do usuário
  saveUserPreferences() {
    const prefs = {
      userName: this.userName,
      userId: this.userId
    }
    localStorage.setItem('stack-user-preferences', JSON.stringify(prefs))
  }

  // Criar novo projeto
  createProject(projectData) {
    const project = {
      id: this.generateProjectId(),
      name: projectData.name || 'Projeto Sem Nome',
      description: projectData.description || '',
      files: projectData.files || {},
      theme: projectData.theme || 'dark',
      language: projectData.language || 'portuguese',
      settings: projectData.settings || {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      host: this.userId,
      collaborators: [this.userId],
      isPublic: projectData.isPublic || false,
      password: projectData.password || null,
      maxCollaborators: projectData.maxCollaborators || 10
    }

    this.currentProject = project
    this.isHost = true

    // Enviar para servidor
    this.sendMessage({
      type: 'create_project',
      project: project
    })

    // Atualizar URL
    this.updateURL(project.id)

    return project
  }

  // Entrar em projeto existente
  joinProject(projectId, password = null) {
    this.sendMessage({
      type: 'join_project',
      projectId: projectId,
      password: password,
      user: {
        id: this.userId,
        name: this.userName
      }
    })
  }

  // Sair do projeto
  leaveProject() {
    if (this.currentProject) {
      this.sendMessage({
        type: 'leave_project',
        projectId: this.currentProject.id,
        userId: this.userId
      })

      this.currentProject = null
      this.isHost = false
      this.collaborators.clear()
      this.updateURL()
    }
  }

  // Compartilhar projeto
  shareProject(options = {}) {
    if (!this.currentProject) {
      throw new Error('Nenhum projeto ativo para compartilhar')
    }

    const shareData = {
      projectId: this.currentProject.id,
      isPublic: options.isPublic || false,
      password: options.password || null,
      expiresAt: options.expiresAt || null,
      maxViews: options.maxViews || null,
      allowEdit: options.allowEdit !== false,
      allowRun: options.allowRun !== false
    }

    this.sendMessage({
      type: 'share_project',
      ...shareData
    })

    return this.generateShareLink(shareData)
  }

  // Gerar link de compartilhamento
  generateShareLink(shareData) {
    const baseUrl = window.location.origin
    const params = new URLSearchParams({
      project: this.currentProject.id,
      ...(shareData.password && { pwd: shareData.password }),
      ...(shareData.isPublic && { public: 'true' })
    })

    return `${baseUrl}?${params.toString()}`
  }

  // Carregar projeto da URL
  loadProjectFromURL() {
    const urlParams = new URLSearchParams(window.location.search)
    const projectId = urlParams.get('project')
    const password = urlParams.get('pwd')

    if (projectId && projectId !== this.currentProject?.id) {
      this.joinProject(projectId, password)
    }
  }

  // Atualizar URL
  updateURL(projectId = null) {
    const url = new URL(window.location)
    
    if (projectId) {
      url.searchParams.set('project', projectId)
    } else {
      url.searchParams.delete('project')
    }

    window.history.replaceState({}, '', url)
  }

  // Sincronizar código
  syncCode(fileName, code, cursorPosition = null) {
    if (!this.currentProject) return

    this.sendMessage({
      type: 'code_change',
      projectId: this.currentProject.id,
      fileName: fileName,
      code: code,
      cursorPosition: cursorPosition,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Sincronizar cursor
  syncCursor(fileName, position) {
    if (!this.currentProject) return

    this.sendMessage({
      type: 'cursor_move',
      projectId: this.currentProject.id,
      fileName: fileName,
      position: position,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Executar código colaborativamente
  runCode(fileName, code) {
    if (!this.currentProject) return

    this.sendMessage({
      type: 'run_code',
      projectId: this.currentProject.id,
      fileName: fileName,
      code: code,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Compilar código colaborativamente
  compileCode(fileName, code) {
    if (!this.currentProject) return

    this.sendMessage({
      type: 'compile_code',
      projectId: this.currentProject.id,
      fileName: fileName,
      code: code,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Enviar mensagem
  sendMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket não conectado, mensagem não enviada:', message)
    }
  }

  // Processar mensagem recebida
  handleMessage(data) {
    switch (data.type) {
      case 'project_created':
        this.handleProjectCreated(data)
        break
      case 'project_joined':
        this.handleProjectJoined(data)
        break
      case 'project_left':
        this.handleProjectLeft(data)
        break
      case 'code_changed':
        this.handleCodeChanged(data)
        break
      case 'cursor_moved':
        this.handleCursorMoved(data)
        break
      case 'code_ran':
        this.handleCodeRan(data)
        break
      case 'code_compiled':
        this.handleCodeCompiled(data)
        break
      case 'collaborator_joined':
        this.handleCollaboratorJoined(data)
        break
      case 'collaborator_left':
        this.handleCollaboratorLeft(data)
        break
      case 'error':
        this.handleError(data)
        break
      default:
        console.log('Mensagem desconhecida:', data)
    }
  }

  // Handlers de mensagens
  handleProjectCreated(data) {
    console.log('Projeto criado:', data.project)
    this.currentProject = data.project
    this.onProjectCreated(data.project)
  }

  handleProjectJoined(data) {
    console.log('Entrou no projeto:', data.project)
    this.currentProject = data.project
    this.isHost = data.project.host === this.userId
    this.onProjectJoined(data.project)
  }

  handleProjectLeft(data) {
    console.log('Saiu do projeto')
    this.currentProject = null
    this.isHost = false
    this.collaborators.clear()
    this.onProjectLeft()
  }

  handleCodeChanged(data) {
    if (data.userId !== this.userId) {
      this.onCodeChanged(data)
    }
  }

  handleCursorMoved(data) {
    if (data.userId !== this.userId) {
      this.onCursorMoved(data)
    }
  }

  handleCodeRan(data) {
    this.onCodeRan(data)
  }

  handleCodeCompiled(data) {
    this.onCodeCompiled(data)
  }

  handleCollaboratorJoined(data) {
    this.collaborators.set(data.user.id, data.user)
    this.onCollaboratorJoined(data.user)
  }

  handleCollaboratorLeft(data) {
    this.collaborators.delete(data.userId)
    this.onCollaboratorLeft(data.userId)
  }

  handleError(data) {
    console.error('Erro do servidor:', data.message)
    this.onError(data)
  }

  // Pausar colaboração
  pauseCollaboration() {
    if (this.currentProject) {
      this.sendMessage({
        type: 'pause_collaboration',
        projectId: this.currentProject.id,
        userId: this.userId
      })
    }
  }

  // Retomar colaboração
  resumeCollaboration() {
    if (this.currentProject) {
      this.sendMessage({
        type: 'resume_collaboration',
        projectId: this.currentProject.id,
        userId: this.userId
      })
    }
  }

  // Obter estatísticas do projeto
  getProjectStats() {
    if (!this.currentProject) return null

    return {
      id: this.currentProject.id,
      name: this.currentProject.name,
      collaborators: this.collaborators.size,
      files: Object.keys(this.currentProject.files).length,
      isHost: this.isHost,
      isConnected: this.isConnected,
      uptime: Date.now() - this.currentProject.createdAt
    }
  }

  // Exportar projeto
  exportProject(format = 'json') {
    if (!this.currentProject) return null

    const exportData = {
      ...this.currentProject,
      exportedAt: Date.now(),
      exportedBy: this.userId
    }

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2)
      case 'zip':
        return this.createZipFile(exportData)
      default:
        throw new Error(`Formato de exportação não suportado: ${format}`)
    }
  }

  // Importar projeto
  importProject(data) {
    try {
      const projectData = typeof data === 'string' ? JSON.parse(data) : data
      
      // Validar dados do projeto
      if (!projectData.files || !projectData.name) {
        throw new Error('Dados do projeto inválidos')
      }

      // Criar projeto local
      this.createProject(projectData)
      
      return true
    } catch (error) {
      console.error('Erro ao importar projeto:', error)
      return false
    }
  }

  // Criar arquivo ZIP
  createZipFile(projectData) {
    // Implementação básica - em produção usaria uma biblioteca como JSZip
    const zipData = {
      'project.json': JSON.stringify(projectData, null, 2),
      ...projectData.files
    }

    return zipData
  }

  // Gerar ID único
  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9)
  }

  // Gerar ID do projeto
  generateProjectId() {
    return 'proj_' + Math.random().toString(36).substr(2, 9)
  }

  // Callbacks (para serem sobrescritos)
  onConnectionChange(connected) {
    console.log('Conexão:', connected ? 'Conectado' : 'Desconectado')
  }

  onProjectCreated(project) {
    console.log('Projeto criado:', project.name)
  }

  onProjectJoined(project) {
    console.log('Entrou no projeto:', project.name)
  }

  onProjectLeft() {
    console.log('Saiu do projeto')
  }

  onCodeChanged(data) {
    console.log('Código alterado por:', data.userId)
  }

  onCursorMoved(data) {
    console.log('Cursor movido por:', data.userId)
  }

  onCodeRan(data) {
    console.log('Código executado por:', data.userId)
  }

  onCodeCompiled(data) {
    console.log('Código compilado por:', data.userId)
  }

  onCollaboratorJoined(user) {
    console.log('Colaborador entrou:', user.name)
  }

  onCollaboratorLeft(userId) {
    console.log('Colaborador saiu:', userId)
  }

  onError(error) {
    console.error('Erro:', error.message)
  }

  // Configurar callbacks
  setCallbacks(callbacks) {
    Object.assign(this, callbacks)
  }

  // Obter informações do usuário
  getUserInfo() {
    return {
      id: this.userId,
      name: this.userName,
      isHost: this.isHost,
      isConnected: this.isConnected
    }
  }

  // Atualizar informações do usuário
  updateUserInfo(userInfo) {
    if (userInfo.name) {
      this.userName = userInfo.name
      this.saveUserPreferences()
    }
  }

  // Obter lista de colaboradores
  getCollaborators() {
    return Array.from(this.collaborators.values())
  }

  // Verificar se usuário é colaborador
  isCollaborator(userId) {
    return this.collaborators.has(userId)
  }

  // Obter permissões do usuário
  getUserPermissions() {
    if (!this.currentProject) return null

    return {
      canEdit: this.isHost || this.currentProject.settings.allowEdit,
      canRun: this.isHost || this.currentProject.settings.allowRun,
      canShare: this.isHost,
      canManage: this.isHost
    }
  }

  // Desconectar
  disconnect() {
    if (this.websocket) {
      this.websocket.close()
    }
  }

  // Reconectar
  reconnect() {
    this.disconnect()
    this.setupWebSocket()
  }
}

module.exports = ProjectSharing