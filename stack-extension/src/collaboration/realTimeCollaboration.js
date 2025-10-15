/**
 * Colaboração em Tempo Real para Stack Extensão
 * Sistema avançado de colaboração com sincronização de código, cursor e execução
 */

class RealTimeCollaboration {
  constructor(options = {}) {
    this.websocket = null
    this.projectId = null
    this.userId = options.userId || this.generateUserId()
    this.userName = options.userName || 'Usuário Anônimo'
    this.userColor = options.userColor || this.generateUserColor()
    this.collaborators = new Map()
    this.cursors = new Map()
    this.selections = new Map()
    this.operations = []
    this.operationBuffer = []
    this.isConnected = false
    this.isHost = false
    this.serverUrl = options.serverUrl || 'ws://localhost:3000'
    this.syncInterval = options.syncInterval || 100
    this.maxOperations = options.maxOperations || 1000
    
    this.initializeCollaboration()
  }

  // Inicializar colaboração
  initializeCollaboration() {
    this.setupWebSocket()
    this.setupOperationBuffer()
    this.setupEventListeners()
  }

  // Configurar WebSocket
  setupWebSocket() {
    this.websocket = new WebSocket(`${this.serverUrl}/collaborate`)
    
    this.websocket.onopen = () => {
      console.log('Conectado para colaboração')
      this.isConnected = true
      this.onConnectionChange(true)
    }

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }

    this.websocket.onclose = () => {
      console.log('Conexão de colaboração fechada')
      this.isConnected = false
      this.onConnectionChange(false)
    }

    this.websocket.onerror = (error) => {
      console.error('Erro na colaboração:', error)
    }
  }

  // Configurar buffer de operações
  setupOperationBuffer() {
    setInterval(() => {
      this.flushOperations()
    }, this.syncInterval)
  }

  // Configurar event listeners
  setupEventListeners() {
    // Detectar mudanças de foco
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseCollaboration()
      } else {
        this.resumeCollaboration()
      }
    })

    // Detectar fechamento da página
    window.addEventListener('beforeunload', () => {
      this.leaveProject()
    })
  }

  // Entrar em projeto
  joinProject(projectId, password = null) {
    this.projectId = projectId
    
    this.sendMessage({
      type: 'join_project',
      projectId: projectId,
      password: password,
      user: {
        id: this.userId,
        name: this.userName,
        color: this.userColor
      }
    })
  }

  // Sair do projeto
  leaveProject() {
    if (this.projectId) {
      this.sendMessage({
        type: 'leave_project',
        projectId: this.projectId,
        userId: this.userId
      })

      this.projectId = null
      this.collaborators.clear()
      this.cursors.clear()
      this.selections.clear()
      this.operations = []
      this.operationBuffer = []
    }
  }

  // Sincronizar operação de código
  syncCodeOperation(operation) {
    const op = {
      ...operation,
      userId: this.userId,
      timestamp: Date.now(),
      projectId: this.projectId
    }

    this.operationBuffer.push(op)
    this.operations.push(op)

    // Limitar histórico de operações
    if (this.operations.length > this.maxOperations) {
      this.operations.shift()
    }
  }

  // Sincronizar posição do cursor
  syncCursor(fileName, position) {
    this.sendMessage({
      type: 'cursor_move',
      projectId: this.projectId,
      fileName: fileName,
      position: position,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Sincronizar seleção
  syncSelection(fileName, selection) {
    this.sendMessage({
      type: 'selection_change',
      projectId: this.projectId,
      fileName: fileName,
      selection: selection,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Sincronizar execução de código
  syncCodeExecution(fileName, code, result) {
    this.sendMessage({
      type: 'code_execution',
      projectId: this.projectId,
      fileName: fileName,
      code: code,
      result: result,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Sincronizar compilação
  syncCompilation(fileName, code, compiled) {
    this.sendMessage({
      type: 'code_compilation',
      projectId: this.projectId,
      fileName: fileName,
      code: code,
      compiled: compiled,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Sincronizar tradução
  syncTranslation(fileName, code, translated, language) {
    this.sendMessage({
      type: 'code_translation',
      projectId: this.projectId,
      fileName: fileName,
      code: code,
      translated: translated,
      language: language,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Enviar mensagem
  sendMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message))
    }
  }

  // Processar mensagem recebida
  handleMessage(data) {
    switch (data.type) {
      case 'project_joined':
        this.handleProjectJoined(data)
        break
      case 'collaborator_joined':
        this.handleCollaboratorJoined(data)
        break
      case 'collaborator_left':
        this.handleCollaboratorLeft(data)
        break
      case 'code_operation':
        this.handleCodeOperation(data)
        break
      case 'cursor_move':
        this.handleCursorMove(data)
        break
      case 'selection_change':
        this.handleSelectionChange(data)
        break
      case 'code_execution':
        this.handleCodeExecution(data)
        break
      case 'code_compilation':
        this.handleCodeCompilation(data)
        break
      case 'code_translation':
        this.handleCodeTranslation(data)
        break
      case 'operation_ack':
        this.handleOperationAck(data)
        break
      case 'error':
        this.handleError(data)
        break
      default:
        console.log('Mensagem desconhecida:', data)
    }
  }

  // Handlers de mensagens
  handleProjectJoined(data) {
    this.isHost = data.isHost
    this.collaborators = new Map(data.collaborators.map(c => [c.id, c]))
    this.onProjectJoined(data)
  }

  handleCollaboratorJoined(data) {
    this.collaborators.set(data.user.id, data.user)
    this.onCollaboratorJoined(data.user)
  }

  handleCollaboratorLeft(data) {
    this.collaborators.delete(data.userId)
    this.cursors.delete(data.userId)
    this.selections.delete(data.userId)
    this.onCollaboratorLeft(data.userId)
  }

  handleCodeOperation(data) {
    if (data.userId !== this.userId) {
      this.applyOperation(data)
      this.onCodeOperation(data)
    }
  }

  handleCursorMove(data) {
    if (data.userId !== this.userId) {
      this.cursors.set(data.userId, {
        position: data.position,
        fileName: data.fileName,
        timestamp: data.timestamp
      })
      this.onCursorMove(data)
    }
  }

  handleSelectionChange(data) {
    if (data.userId !== this.userId) {
      this.selections.set(data.userId, {
        selection: data.selection,
        fileName: data.fileName,
        timestamp: data.timestamp
      })
      this.onSelectionChange(data)
    }
  }

  handleCodeExecution(data) {
    this.onCodeExecution(data)
  }

  handleCodeCompilation(data) {
    this.onCodeCompilation(data)
  }

  handleCodeTranslation(data) {
    this.onCodeTranslation(data)
  }

  handleOperationAck(data) {
    // Remover operação do buffer se foi confirmada
    this.operationBuffer = this.operationBuffer.filter(op => op.id !== data.operationId)
  }

  handleError(data) {
    console.error('Erro na colaboração:', data.message)
    this.onError(data)
  }

  // Aplicar operação de código
  applyOperation(operation) {
    // Implementar transformação de operações (OT - Operational Transform)
    // Por simplicidade, aqui seria aplicada a operação diretamente
    this.onApplyOperation(operation)
  }

  // Flush operações do buffer
  flushOperations() {
    if (this.operationBuffer.length > 0) {
      this.sendMessage({
        type: 'batch_operations',
        projectId: this.projectId,
        operations: this.operationBuffer,
        userId: this.userId,
        timestamp: Date.now()
      })
      
      this.operationBuffer = []
    }
  }

  // Pausar colaboração
  pauseCollaboration() {
    this.sendMessage({
      type: 'pause_collaboration',
      projectId: this.projectId,
      userId: this.userId
    })
  }

  // Retomar colaboração
  resumeCollaboration() {
    this.sendMessage({
      type: 'resume_collaboration',
      projectId: this.projectId,
      userId: this.userId
    })
  }

  // Obter estado da colaboração
  getCollaborationState() {
    return {
      isConnected: this.isConnected,
      isHost: this.isHost,
      projectId: this.projectId,
      collaborators: this.collaborators.size,
      operations: this.operations.length,
      pendingOperations: this.operationBuffer.length
    }
  }

  // Obter colaboradores ativos
  getActiveCollaborators() {
    const now = Date.now()
    const activeThreshold = 30000 // 30 segundos
    
    return Array.from(this.collaborators.values()).filter(collaborator => {
      const lastActivity = this.cursors.get(collaborator.id)?.timestamp || 0
      return (now - lastActivity) < activeThreshold
    })
  }

  // Obter posições dos cursores
  getCursorPositions() {
    return Array.from(this.cursors.entries()).map(([userId, cursor]) => ({
      userId,
      ...cursor,
      user: this.collaborators.get(userId)
    }))
  }

  // Obter seleções ativas
  getActiveSelections() {
    return Array.from(this.selections.entries()).map(([userId, selection]) => ({
      userId,
      ...selection,
      user: this.collaborators.get(userId)
    }))
  }

  // Obter histórico de operações
  getOperationHistory(limit = 100) {
    return this.operations.slice(-limit)
  }

  // Desfazer última operação
  undoLastOperation() {
    if (this.operations.length > 0) {
      const lastOp = this.operations[this.operations.length - 1]
      if (lastOp.userId === this.userId) {
        this.sendMessage({
          type: 'undo_operation',
          projectId: this.projectId,
          operationId: lastOp.id,
          userId: this.userId
        })
      }
    }
  }

  // Sincronizar estado completo
  syncFullState() {
    this.sendMessage({
      type: 'sync_state',
      projectId: this.projectId,
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // Resolver conflitos
  resolveConflicts(conflicts) {
    // Implementar resolução de conflitos
    // Por simplicidade, aceitar operações do host
    conflicts.forEach(conflict => {
      if (this.isHost) {
        this.sendMessage({
          type: 'resolve_conflict',
          projectId: this.projectId,
          conflictId: conflict.id,
          resolution: 'accept',
          userId: this.userId
        })
      }
    })
  }

  // Gerar ID único
  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9)
  }

  // Gerar cor do usuário
  generateUserColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Callbacks (para serem sobrescritos)
  onConnectionChange(connected) {
    console.log('Colaboração:', connected ? 'Conectado' : 'Desconectado')
  }

  onProjectJoined(data) {
    console.log('Entrou no projeto de colaboração')
  }

  onCollaboratorJoined(user) {
    console.log('Colaborador entrou:', user.name)
  }

  onCollaboratorLeft(userId) {
    console.log('Colaborador saiu:', userId)
  }

  onCodeOperation(operation) {
    console.log('Operação de código recebida:', operation.type)
  }

  onApplyOperation(operation) {
    console.log('Aplicando operação:', operation.type)
  }

  onCursorMove(data) {
    console.log('Cursor movido por:', data.userId)
  }

  onSelectionChange(data) {
    console.log('Seleção alterada por:', data.userId)
  }

  onCodeExecution(data) {
    console.log('Código executado por:', data.userId)
  }

  onCodeCompilation(data) {
    console.log('Código compilado por:', data.userId)
  }

  onCodeTranslation(data) {
    console.log('Código traduzido por:', data.userId)
  }

  onError(error) {
    console.error('Erro na colaboração:', error.message)
  }

  // Configurar callbacks
  setCallbacks(callbacks) {
    Object.assign(this, callbacks)
  }

  // Obter estatísticas
  getStats() {
    return {
      isConnected: this.isConnected,
      isHost: this.isHost,
      collaborators: this.collaborators.size,
      operations: this.operations.length,
      pendingOperations: this.operationBuffer.length,
      cursors: this.cursors.size,
      selections: this.selections.size
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

module.exports = RealTimeCollaboration