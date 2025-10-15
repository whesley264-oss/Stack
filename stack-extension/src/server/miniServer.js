/**
 * Mini Servidor Automático para Stack Extensão
 * Servidor web integrado com hot-reload, WebSocket e funcionalidades únicas
 */

const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const WebSocket = require('ws')
const chokidar = require('chokidar')

class MiniServer {
  constructor(options = {}) {
    this.port = options.port || 3000
    this.host = options.host || 'localhost'
    this.rootDir = options.rootDir || process.cwd()
    this.watchFiles = options.watchFiles || ['**/*.stk', '**/*.js', '**/*.css', '**/*.html']
    this.autoReload = options.autoReload !== false
    this.websocket = options.websocket !== false
    this.api = options.api !== false
    
    this.server = null
    this.wss = null
    this.watcher = null
    this.clients = new Set()
    this.routes = new Map()
    this.middleware = []
    this.websockets = new Map()
    this.cache = new Map()
    this.stats = {
      requests: 0,
      connections: 0,
      filesChanged: 0,
      startTime: Date.now()
    }
  }

  // Iniciar servidor
  async start() {
    try {
      console.log(`🚀 Iniciando Stack Extensão Mini Server...`)
      console.log(`📁 Diretório: ${this.rootDir}`)
      console.log(`🌐 URL: http://${this.host}:${this.port}`)
      
      // Configurar rotas padrão
      this.setupDefaultRoutes()
      
      // Configurar middleware
      this.setupMiddleware()
      
      // Criar servidor HTTP
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res)
      })
      
      // Configurar WebSocket se habilitado
      if (this.websocket) {
        this.wss = new WebSocket.Server({ server: this.server })
        this.setupWebSocket()
      }
      
      // Configurar watcher de arquivos
      if (this.autoReload) {
        this.setupFileWatcher()
      }
      
      // Iniciar servidor
      this.server.listen(this.port, this.host, () => {
        console.log(`✅ Servidor iniciado com sucesso!`)
        console.log(`🔥 Hot-reload: ${this.autoReload ? 'Ativado' : 'Desativado'}`)
        console.log(`🔌 WebSocket: ${this.websocket ? 'Ativado' : 'Desativado'}`)
        console.log(`📊 API: ${this.api ? 'Ativada' : 'Desativada'}`)
        console.log(`\n🎯 Acesse: http://${this.host}:${this.port}`)
      })
      
      // Configurar tratamento de erros
      this.server.on('error', (error) => {
        console.error('❌ Erro no servidor:', error.message)
      })
      
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error.message)
      throw error
    }
  }

  // Parar servidor
  async stop() {
    console.log('🛑 Parando servidor...')
    
    if (this.watcher) {
      await this.watcher.close()
    }
    
    if (this.wss) {
      this.wss.close()
    }
    
    if (this.server) {
      this.server.close()
    }
    
    console.log('✅ Servidor parado com sucesso!')
  }

  // Configurar rotas padrão
  setupDefaultRoutes() {
    // Rota para arquivos estáticos
    this.get('/static/*', (req, res) => {
      this.serveStaticFile(req, res)
    })
    
    // Rota para arquivos .stk
    this.get('/*.stk', (req, res) => {
      this.serveStackFile(req, res)
    })
    
    // Rota para API de status
    if (this.api) {
      this.get('/api/status', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          status: 'online',
          uptime: Date.now() - this.stats.startTime,
          stats: this.stats,
          routes: Array.from(this.routes.keys()),
          websockets: this.websockets.size
        }))
      })
      
      // Rota para API de arquivos
      this.get('/api/files', (req, res) => {
        this.listFiles(req, res)
      })
      
      // Rota para API de compilação
      this.post('/api/compile', (req, res) => {
        this.compileFile(req, res)
      })
    }
    
    // Rota para hot-reload
    this.get('/hot-reload.js', (req, res) => {
      this.serveHotReloadScript(req, res)
    })
    
    // Rota padrão
    this.get('/', (req, res) => {
      this.serveIndex(req, res)
    })
  }

  // Configurar middleware
  setupMiddleware() {
    this.middleware.push((req, res, next) => {
      this.stats.requests++
      console.log(`📥 ${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`)
      next()
    })
    
    this.middleware.push((req, res, next) => {
      // CORS
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }
      
      next()
    })
  }

  // Configurar WebSocket
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('🔌 Nova conexão WebSocket')
      this.stats.connections++
      
      this.clients.add(ws)
      
      // Enviar mensagem de boas-vindas
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Conectado ao Stack Extensão Mini Server',
        timestamp: Date.now()
      }))
      
      // Configurar handlers
      ws.on('message', (message) => {
        this.handleWebSocketMessage(ws, message)
      })
      
      ws.on('close', () => {
        console.log('🔌 Conexão WebSocket fechada')
        this.clients.delete(ws)
        this.stats.connections--
      })
      
      ws.on('error', (error) => {
        console.error('❌ Erro WebSocket:', error.message)
        this.clients.delete(ws)
      })
    })
  }

  // Configurar watcher de arquivos
  setupFileWatcher() {
    const watchPath = path.join(this.rootDir, '**/*')
    
    this.watcher = chokidar.watch(watchPath, {
      ignored: /(^|[\/\\])\../, // Ignorar arquivos ocultos
      persistent: true,
      ignoreInitial: true
    })
    
    this.watcher.on('change', (filePath) => {
      console.log(`📝 Arquivo alterado: ${filePath}`)
      this.stats.filesChanged++
      
      // Notificar clientes via WebSocket
      this.notifyClients({
        type: 'file_changed',
        file: filePath,
        timestamp: Date.now()
      })
      
      // Compilar arquivo .stk se necessário
      if (filePath.endsWith('.stk')) {
        this.compileStackFile(filePath)
      }
    })
    
    this.watcher.on('add', (filePath) => {
      console.log(`➕ Arquivo adicionado: ${filePath}`)
      this.notifyClients({
        type: 'file_added',
        file: filePath,
        timestamp: Date.now()
      })
    })
    
    this.watcher.on('unlink', (filePath) => {
      console.log(`➖ Arquivo removido: ${filePath}`)
      this.notifyClients({
        type: 'file_removed',
        file: filePath,
        timestamp: Date.now()
      })
    })
  }

  // Adicionar rota
  addRoute(method, path, handler) {
    const key = `${method.toUpperCase()} ${path}`
    this.routes.set(key, handler)
  }

  // Adicionar rota GET
  get(path, handler) {
    this.addRoute('GET', path, handler)
  }

  // Adicionar rota POST
  post(path, handler) {
    this.addRoute('POST', path, handler)
  }

  // Adicionar rota PUT
  put(path, handler) {
    this.addRoute('PUT', path, handler)
  }

  // Adicionar rota DELETE
  delete(path, handler) {
    this.addRoute('DELETE', path, handler)
  }

  // Adicionar middleware
  use(middleware) {
    this.middleware.push(middleware)
  }

  // Adicionar WebSocket personalizado
  addWebSocket(path, handler) {
    this.websockets.set(path, handler)
  }

  // Processar requisição
  handleRequest(req, res) {
    // Executar middleware
    let middlewareIndex = 0
    const next = () => {
      if (middlewareIndex < this.middleware.length) {
        this.middleware[middlewareIndex++](req, res, next)
      } else {
        this.routeRequest(req, res)
      }
    }
    next()
  }

  // Roteamento
  routeRequest(req, res) {
    const method = req.method
    const urlPath = url.parse(req.url).pathname
    const key = `${method} ${urlPath}`
    
    // Buscar rota exata
    let handler = this.routes.get(key)
    
    // Buscar rota com wildcard
    if (!handler) {
      for (const [routeKey, routeHandler] of this.routes) {
        const [routeMethod, routePath] = routeKey.split(' ')
        if (routeMethod === method && this.matchRoute(routePath, urlPath)) {
          handler = routeHandler
          break
        }
      }
    }
    
    if (handler) {
      handler(req, res)
    } else {
      this.serve404(req, res)
    }
  }

  // Verificar se rota corresponde
  matchRoute(route, path) {
    if (route === path) return true
    
    // Suporte a wildcards
    if (route.includes('*')) {
      const regex = new RegExp('^' + route.replace(/\*/g, '.*') + '$')
      return regex.test(path)
    }
    
    return false
  }

  // Servir arquivo estático
  serveStaticFile(req, res) {
    const filePath = path.join(this.rootDir, req.url.replace('/static/', ''))
    
    if (!fs.existsSync(filePath)) {
      this.serve404(req, res)
      return
    }
    
    const ext = path.extname(filePath)
    const contentType = this.getContentType(ext)
    
    res.writeHead(200, { 'Content-Type': contentType })
    fs.createReadStream(filePath).pipe(res)
  }

  // Servir arquivo .stk
  serveStackFile(req, res) {
    const filePath = path.join(this.rootDir, req.url)
    
    if (!fs.existsSync(filePath)) {
      this.serve404(req, res)
      return
    }
    
    // Compilar arquivo .stk
    this.compileStackFile(filePath).then(compiled => {
      res.writeHead(200, { 'Content-Type': 'application/javascript' })
      res.end(compiled)
    }).catch(error => {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end(`Erro ao compilar: ${error.message}`)
    })
  }

  // Compilar arquivo .stk
  async compileStackFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      
      // Usar o transpilador do Stack Extensão
      const Tokenizer = require('../lexer/tokenizer')
      const Parser = require('../parser/parser')
      const Transpiler = require('../transpiler/transpiler')
      
      const tokenizer = new Tokenizer()
      const tokens = tokenizer.tokenize(content)
      
      const parser = new Parser(tokens)
      const ast = parser.parse()
      
      const transpiler = new Transpiler()
      const result = transpiler.transpile(ast, 'javascript')
      
      return result.code
    } catch (error) {
      throw new Error(`Erro ao compilar ${filePath}: ${error.message}`)
    }
  }

  // Servir script de hot-reload
  serveHotReloadScript(req, res) {
    const script = `
      (function() {
        const ws = new WebSocket('ws://${this.host}:${this.port}');
        
        ws.onmessage = function(event) {
          const data = JSON.parse(event.data);
          
          if (data.type === 'file_changed') {
            console.log('📝 Arquivo alterado:', data.file);
            
            // Recarregar página se for arquivo relevante
            if (data.file.endsWith('.stk') || data.file.endsWith('.js') || data.file.endsWith('.css')) {
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }
          }
        };
        
        ws.onopen = function() {
          console.log('🔥 Hot-reload conectado');
        };
        
        ws.onclose = function() {
          console.log('🔥 Hot-reload desconectado');
        };
      })();
    `
    
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    res.end(script)
  }

  // Servir página inicial
  serveIndex(req, res) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Stack Extensão Mini Server</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #333; text-align: center; }
          .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .feature { background: #f0f8ff; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .code { background: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; }
          .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
          .btn:hover { background: #0056b3; }
        </style>
        <script src="/hot-reload.js"></script>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Stack Extensão Mini Server</h1>
          
          <div class="status">
            <h3>✅ Servidor Online</h3>
            <p>Porta: ${this.port} | Host: ${this.host}</p>
            <p>Hot-reload: ${this.autoReload ? 'Ativado' : 'Desativado'} | WebSocket: ${this.websocket ? 'Ativado' : 'Desativado'}</p>
          </div>
          
          <div class="feature">
            <h3>🔥 Funcionalidades Únicas</h3>
            <ul>
              <li>Hot-reload automático para arquivos .stk</li>
              <li>WebSocket em tempo real</li>
              <li>API integrada</li>
              <li>Compilação automática</li>
              <li>Suporte bilíngue (português/inglês)</li>
            </ul>
          </div>
          
          <div class="feature">
            <h3>📁 Como usar</h3>
            <p>1. Coloque seus arquivos .stk na pasta do projeto</p>
            <p>2. Acesse <code>http://${this.host}:${this.port}/arquivo.stk</code></p>
            <p>3. O arquivo será compilado automaticamente para JavaScript</p>
            <p>4. As alterações são detectadas e aplicadas em tempo real</p>
          </div>
          
          <div class="code">
            <h4>Exemplo de código .stk:</h4>
            <pre>
variavel nome = "Stack Extensão"
variavel resultado = 10 mais 5 vezes 2

funcao main() {
    imprimir("Olá, " + nome + "!")
    imprimir("Resultado: " + resultado)
}

main()
            </pre>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <button class="btn" onclick="location.reload()">🔄 Recarregar</button>
            <button class="btn" onclick="fetch('/api/status').then(r => r.json()).then(console.log)">📊 Status</button>
          </div>
        </div>
      </body>
      </html>
    `
    
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  }

  // Servir 404
  serve404(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 - Não Encontrado</title></head>
      <body>
        <h1>404 - Arquivo Não Encontrado</h1>
        <p>O arquivo <code>${req.url}</code> não foi encontrado.</p>
        <a href="/">← Voltar ao início</a>
      </body>
      </html>
    `)
  }

  // Obter tipo de conteúdo
  getContentType(ext) {
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }
    return types[ext] || 'text/plain'
  }

  // Notificar clientes WebSocket
  notifyClients(message) {
    if (this.wss) {
      const data = JSON.stringify(message)
      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
      })
    }
  }

  // Processar mensagem WebSocket
  handleWebSocketMessage(ws, message) {
    try {
      const data = JSON.parse(message)
      console.log('📨 Mensagem WebSocket:', data)
      
      // Processar diferentes tipos de mensagem
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
          break
        case 'get_status':
          ws.send(JSON.stringify({
            type: 'status',
            data: {
              uptime: Date.now() - this.stats.startTime,
              stats: this.stats,
              routes: Array.from(this.routes.keys())
            }
          }))
          break
        default:
          console.log('📨 Mensagem desconhecida:', data.type)
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem WebSocket:', error.message)
    }
  }

  // Listar arquivos
  listFiles(req, res) {
    const files = this.getFilesRecursively(this.rootDir)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ files }))
  }

  // Obter arquivos recursivamente
  getFilesRecursively(dir) {
    const files = []
    
    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir)
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          walk(fullPath)
        } else {
          files.push({
            path: fullPath.replace(this.rootDir, ''),
            name: item,
            size: stat.size,
            modified: stat.mtime
          })
        }
      }
    }
    
    walk(dir)
    return files
  }

  // Compilar arquivo via API
  compileFile(req, res) {
    let body = ''
    
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const { filePath } = JSON.parse(body)
        const compiled = await this.compileStackFile(filePath)
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true, code: compiled }))
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: error.message }))
      }
    })
  }
}

module.exports = MiniServer