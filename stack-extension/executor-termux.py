#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stack Extensão - Executor Específico para Termux
Executor visual otimizado 100% para Android via Termux
"""

import os
import sys
import json
import time
import subprocess
import threading
import webbrowser
from pathlib import Path
import socket
from datetime import datetime

# Cores para terminal
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

class TermuxStackExecutor:
    def __init__(self):
        self.version = "1.0.0"
        self.running = True
        self.current_file = None
        self.server_port = 3000
        self.platform = "termux"
        
        # Verificar se está no Termux
        if not os.path.exists('/etc/termux_version'):
            print(f"{Colors.RED}❌ Este executor é específico para Termux!{Colors.END}")
            print(f"{Colors.YELLOW}Use executor.py para outros sistemas.{Colors.END}")
            sys.exit(1)
        
        # Carregar configurações específicas do Termux
        self.load_termux_config()
        
    def load_termux_config(self):
        """Carrega configurações específicas do Termux"""
        self.config = {
            "use_termux_open": True,
            "optimize_for_mobile": True,
            "battery_saver": True,
            "touch_gestures": True,
            "mobile_friendly": True,
            "auto_open_browser": False
        }
        
        # Tentar carregar configuração do arquivo
        try:
            with open('executor-config.json', 'r') as f:
                config_file = json.load(f)
                if 'termux' in config_file:
                    self.config.update(config_file['termux'])
        except FileNotFoundError:
            pass
    
    def clear_screen(self):
        """Limpa a tela do terminal"""
        os.system('clear')
    
    def print_banner(self):
        """Imprime o banner específico para Termux"""
        banner = f"""
{Colors.CYAN}╔══════════════════════════════════════════════════════════════╗{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}║              {Colors.BOLD}📱 STACK EXTENSÃO - TERMUX EDITION{Colors.END} {Colors.CYAN}           ║{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}║        {Colors.YELLOW}A super linguagem de programação única!{Colors.END} {Colors.CYAN}              ║{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Otimizado 100% para Android via Termux{Colors.END} {Colors.CYAN}            ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Interface touch-friendly{Colors.END} {Colors.CYAN}                              ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Recursos específicos para mobile{Colors.END} {Colors.CYAN}                      ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Integração com apps Android{Colors.END} {Colors.CYAN}                           ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Performance otimizada para dispositivos móveis{Colors.END} {Colors.CYAN}        ║{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}╚══════════════════════════════════════════════════════════════╝{Colors.END}

{Colors.BOLD}{Colors.WHITE}Versão: {self.version}{Colors.END}
{Colors.BOLD}{Colors.WHITE}Plataforma: {self.platform}{Colors.END}
{Colors.BOLD}{Colors.WHITE}Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}{Colors.END}
{Colors.BOLD}{Colors.WHITE}Termux: {self.get_termux_version()}{Colors.END}
"""
        print(banner)
    
    def get_termux_version(self):
        """Obtém a versão do Termux"""
        try:
            with open('/etc/termux_version', 'r') as f:
                return f.read().strip()
        except:
            return "Desconhecida"
    
    def print_menu(self):
        """Imprime o menu principal otimizado para Termux"""
        menu = f"""
{Colors.BOLD}{Colors.WHITE}📋 MENU PRINCIPAL - TERMUX{Colors.END}
{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}

{Colors.GREEN}1.{Colors.END} {Colors.WHITE}Executar arquivo .stk{Colors.END}
{Colors.GREEN}2.{Colors.END} {Colors.WHITE}Executar servidor web{Colors.END}
{Colors.GREEN}3.{Colors.END} {Colors.WHITE}Compilar para JavaScript{Colors.END}
{Colors.GREEN}4.{Colors.END} {Colors.WHITE}Compilar para Python{Colors.END}
{Colors.GREEN}5.{Colors.END} {Colors.WHITE}Analisar código com IA{Colors.END}
{Colors.GREEN}6.{Colors.END} {Colors.WHITE}Traduzir código{Colors.END}
{Colors.GREEN}7.{Colors.END} {Colors.WHITE}Ver exemplos{Colors.END}
{Colors.GREEN}8.{Colors.END} {Colors.WHITE}Configurações{Colors.END}
{Colors.GREEN}9.{Colors.END} {Colors.WHITE}Ajuda{Colors.END}
{Colors.GREEN}a.{Colors.END} {Colors.WHITE}Abrir no navegador Android{Colors.END}
{Colors.GREEN}b.{Colors.END} {Colors.WHITE}Compartilhar projeto{Colors.END}
{Colors.GREEN}c.{Colors.END} {Colors.WHITE}Fazer backup{Colors.END}
{Colors.RED}0.{Colors.END} {Colors.WHITE}Sair{Colors.END}

{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}
"""
        print(menu)
    
    def get_file_path(self):
        """Solicita o caminho do arquivo ao usuário"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📁 SELECIONAR ARQUIVO{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        # Mostrar arquivos .stk disponíveis
        stk_files = list(Path('.').glob('**/*.stk'))
        if stk_files:
            print(f"\n{Colors.GREEN}Arquivos .stk encontrados:{Colors.END}")
            for i, file in enumerate(stk_files, 1):
                print(f"{Colors.GREEN}{i}.{Colors.END} {Colors.WHITE}{file}{Colors.END}")
            print(f"{Colors.GREEN}0.{Colors.END} {Colors.WHITE}Digitar caminho manualmente{Colors.END}")
            
            choice = input(f"\n{Colors.YELLOW}Escolha um arquivo (0 para digitar): {Colors.END}").strip()
            
            try:
                choice_num = int(choice)
                if 1 <= choice_num <= len(stk_files):
                    file_path = str(stk_files[choice_num - 1])
                    self.current_file = file_path
                    print(f"{Colors.GREEN}✅ Arquivo selecionado: {file_path}{Colors.END}")
                    return file_path
                elif choice_num == 0:
                    pass  # Continuar para entrada manual
                else:
                    print(f"{Colors.RED}❌ Escolha inválida!{Colors.END}")
            except ValueError:
                print(f"{Colors.RED}❌ Digite um número válido!{Colors.END}")
        
        # Entrada manual
        while True:
            file_path = input(f"\n{Colors.YELLOW}Digite o caminho do arquivo .stk: {Colors.END}").strip()
            
            if not file_path:
                print(f"{Colors.RED}❌ Caminho não pode estar vazio!{Colors.END}")
                continue
            
            # Adicionar extensão .stk se não tiver
            if not file_path.endswith('.stk'):
                file_path += '.stk'
            
            # Verificar se arquivo existe
            if os.path.exists(file_path):
                self.current_file = file_path
                print(f"{Colors.GREEN}✅ Arquivo encontrado: {file_path}{Colors.END}")
                return file_path
            else:
                print(f"{Colors.RED}❌ Arquivo não encontrado: {file_path}{Colors.END}")
                retry = input(f"{Colors.YELLOW}Deseja tentar novamente? (s/n): {Colors.END}").lower()
                if retry != 's':
                    return None
    
    def execute_file(self, file_path):
        """Executa um arquivo .stk"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🚀 EXECUTANDO ARQUIVO{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.WHITE}Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}{Colors.END}")
        print(f"{Colors.WHITE}Plataforma: {self.platform}{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        try:
            # Tentar executar com stk
            result = subprocess.run(['stk', 'run', file_path], 
                                 capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Execução bem-sucedida!{Colors.END}")
                if result.stdout:
                    print(f"\n{Colors.BOLD}{Colors.WHITE}📤 SAÍDA:{Colors.END}")
                    print(f"{Colors.WHITE}{result.stdout}{Colors.END}")
            else:
                print(f"\n{Colors.RED}❌ Erro na execução!{Colors.END}")
                if result.stderr:
                    print(f"\n{Colors.BOLD}{Colors.RED}📤 ERRO:{Colors.END}")
                    print(f"{Colors.RED}{result.stderr}{Colors.END}")
        
        except subprocess.TimeoutExpired:
            print(f"\n{Colors.RED}❌ Timeout na execução!{Colors.END}")
        except FileNotFoundError:
            print(f"\n{Colors.RED}❌ Comando 'stk' não encontrado!{Colors.END}")
            print(f"{Colors.YELLOW}Tentando executar diretamente...{Colors.END}")
            # Executar arquivo diretamente como JavaScript
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    print(f"\n{Colors.BOLD}{Colors.WHITE}📤 CONTEÚDO DO ARQUIVO:{Colors.END}")
                    print(f"{Colors.WHITE}{content}{Colors.END}")
            except Exception as e:
                print(f"{Colors.RED}❌ Erro ao ler arquivo: {e}{Colors.END}")
    
    def execute_web_server(self, file_path):
        """Executa um servidor web para arquivos .stk"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🌐 EXECUTANDO SERVIDOR WEB{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.WHITE}Porta: {self.server_port}{Colors.END}")
        print(f"{Colors.WHITE}Plataforma: {self.platform}{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        try:
            # Verificar se porta está disponível
            if self.is_port_in_use(self.server_port):
                print(f"{Colors.YELLOW}⚠️  Porta {self.server_port} em uso. Tentando porta 3001...{Colors.END}")
                self.server_port = 3001
            
            # Executar servidor em thread separada
            def run_server():
                try:
                    subprocess.run(['stk', 'dev', file_path, '--port', str(self.server_port)], 
                                 timeout=3600)  # 1 hora timeout
                except subprocess.TimeoutExpired:
                    pass
            
            server_thread = threading.Thread(target=run_server, daemon=True)
            server_thread.start()
            
            # Aguardar servidor iniciar
            time.sleep(3)
            
            # Verificar se servidor está rodando
            if self.is_port_in_use(self.server_port):
                url = f"http://localhost:{self.server_port}"
                print(f"\n{Colors.GREEN}✅ Servidor iniciado com sucesso!{Colors.END}")
                print(f"\n{Colors.BOLD}{Colors.WHITE}🌐 ACESSE SEU PROJETO:{Colors.END}")
                print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
                print(f"{Colors.BOLD}{Colors.GREEN}🔗 {url}{Colors.END}")
                print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
                
                # Abrir no navegador Android usando termux-open
                if self.config.get('use_termux_open', True):
                    try:
                        subprocess.run(['termux-open', url], check=True)
                        print(f"{Colors.GREEN}✅ Abrindo no navegador Android...{Colors.END}")
                    except subprocess.CalledProcessError:
                        print(f"{Colors.YELLOW}⚠️  Não foi possível abrir no navegador Android{Colors.END}")
                        print(f"{Colors.YELLOW}💡 Use: termux-open {url}{Colors.END}")
                else:
                    print(f"{Colors.YELLOW}💡 Use: termux-open {url}{Colors.END}")
                
                print(f"\n{Colors.YELLOW}Pressione Ctrl+C para parar o servidor{Colors.END}")
                
                try:
                    while True:
                        time.sleep(1)
                except KeyboardInterrupt:
                    print(f"\n{Colors.YELLOW}🛑 Parando servidor...{Colors.END}")
            else:
                print(f"{Colors.RED}❌ Falha ao iniciar servidor!{Colors.END}")
        
        except Exception as e:
            print(f"{Colors.RED}❌ Erro ao executar servidor: {e}{Colors.END}")
    
    def is_port_in_use(self, port):
        """Verifica se uma porta está em uso"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('localhost', port)) == 0
    
    def open_in_browser(self):
        """Abre o projeto no navegador Android"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📱 ABRINDO NO NAVEGADOR ANDROID{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        url = f"http://localhost:{self.server_port}"
        
        try:
            subprocess.run(['termux-open', url], check=True)
            print(f"{Colors.GREEN}✅ Abrindo no navegador Android...{Colors.END}")
            print(f"{Colors.WHITE}URL: {url}{Colors.END}")
        except subprocess.CalledProcessError:
            print(f"{Colors.RED}❌ Erro ao abrir no navegador Android{Colors.END}")
            print(f"{Colors.YELLOW}💡 Execute manualmente: termux-open {url}{Colors.END}")
        except FileNotFoundError:
            print(f"{Colors.RED}❌ termux-open não encontrado!{Colors.END}")
            print(f"{Colors.YELLOW}💡 Instale: pkg install termux-api{Colors.END}")
    
    def share_project(self):
        """Compartilha o projeto usando termux-share"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📤 COMPARTILHAR PROJETO{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        project_name = input(f"{Colors.YELLOW}Nome do projeto: {Colors.END}").strip() or "stack-project"
        
        try:
            # Criar arquivo compactado
            import tarfile
            archive_name = f"{project_name}.tar.gz"
            
            with tarfile.open(archive_name, "w:gz") as tar:
                tar.add(".", arcname=project_name)
            
            # Compartilhar usando termux-share
            subprocess.run(['termux-share', archive_name], check=True)
            
            print(f"{Colors.GREEN}✅ Projeto compartilhado: {archive_name}{Colors.END}")
            
            # Limpar arquivo temporário
            os.remove(archive_name)
            
        except subprocess.CalledProcessError:
            print(f"{Colors.RED}❌ Erro ao compartilhar projeto{Colors.END}")
            print(f"{Colors.YELLOW}💡 Execute manualmente: termux-share {archive_name}{Colors.END}")
        except FileNotFoundError:
            print(f"{Colors.RED}❌ termux-share não encontrado!{Colors.END}")
            print(f"{Colors.YELLOW}💡 Instale: pkg install termux-api{Colors.END}")
        except Exception as e:
            print(f"{Colors.RED}❌ Erro: {e}{Colors.END}")
    
    def backup_project(self):
        """Faz backup do projeto"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}💾 FAZENDO BACKUP{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        backup_dir = os.path.expanduser("~/stack-backups")
        os.makedirs(backup_dir, exist_ok=True)
        
        date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"stack-extension_{date_str}.tar.gz"
        backup_path = os.path.join(backup_dir, backup_name)
        
        try:
            import tarfile
            with tarfile.open(backup_path, "w:gz") as tar:
                tar.add(".", arcname="stack-extension")
            
            print(f"{Colors.GREEN}✅ Backup criado: {backup_path}{Colors.END}")
            print(f"{Colors.WHITE}Tamanho: {os.path.getsize(backup_path)} bytes{Colors.END}")
            
        except Exception as e:
            print(f"{Colors.RED}❌ Erro ao criar backup: {e}{Colors.END}")
    
    def show_examples(self):
        """Mostra exemplos disponíveis"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📚 EXEMPLOS DISPONÍVEIS{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        examples_dir = Path("examples")
        if examples_dir.exists():
            stk_files = list(examples_dir.glob("*.stk"))
            if stk_files:
                print(f"\n{Colors.GREEN}Arquivos .stk encontrados:{Colors.END}")
                for i, file in enumerate(stk_files, 1):
                    print(f"{Colors.GREEN}{i}.{Colors.END} {Colors.WHITE}{file.name}{Colors.END}")
                
                print(f"\n{Colors.YELLOW}Digite o número do exemplo para executar (0 para voltar): {Colors.END}")
                choice = input().strip()
                
                try:
                    choice_num = int(choice)
                    if 1 <= choice_num <= len(stk_files):
                        selected_file = stk_files[choice_num - 1]
                        print(f"\n{Colors.GREEN}Executando: {selected_file.name}{Colors.END}")
                        self.execute_file(str(selected_file))
                    elif choice_num == 0:
                        return
                    else:
                        print(f"{Colors.RED}❌ Escolha inválida!{Colors.END}")
                except ValueError:
                    print(f"{Colors.RED}❌ Digite um número válido!{Colors.END}")
            else:
                print(f"{Colors.YELLOW}⚠️  Nenhum arquivo .stk encontrado em examples/{Colors.END}")
        else:
            print(f"{Colors.YELLOW}⚠️  Diretório examples/ não encontrado{Colors.END}")
    
    def show_settings(self):
        """Mostra configurações específicas do Termux"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}⚙️  CONFIGURAÇÕES - TERMUX{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        print(f"\n{Colors.WHITE}Configurações atuais:{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Versão: {self.version}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Plataforma: {self.platform}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Porta do servidor: {self.server_port}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Arquivo atual: {self.current_file or 'Nenhum'}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Termux Open: {self.config.get('use_termux_open', True)}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Otimização Mobile: {self.config.get('optimize_for_mobile', True)}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Battery Saver: {self.config.get('battery_saver', True)}{Colors.END}")
        
        print(f"\n{Colors.YELLOW}Deseja alterar a porta do servidor? (s/n): {Colors.END}")
        if input().lower() == 's':
            try:
                new_port = int(input(f"{Colors.YELLOW}Nova porta: {Colors.END}"))
                if 1 <= new_port <= 65535:
                    self.server_port = new_port
                    print(f"{Colors.GREEN}✅ Porta alterada para {new_port}{Colors.END}")
                else:
                    print(f"{Colors.RED}❌ Porta inválida!{Colors.END}")
            except ValueError:
                print(f"{Colors.RED}❌ Digite um número válido!{Colors.END}")
    
    def show_help(self):
        """Mostra ajuda específica para Termux"""
        help_text = f"""
{Colors.BOLD}{Colors.WHITE}📖 AJUDA - STACK EXTENSÃO TERMUX EDITION{Colors.END}
{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}

{Colors.BOLD}{Colors.WHITE}O que é a Stack Extensão?{Colors.END}
A Stack Extensão é uma super linguagem de programação que combina o melhor
do JavaScript e Python com funcionalidades únicas, otimizada para mobile:

{Colors.GREEN}•{Colors.END} {Colors.WHITE}Código Bilíngue: Escreva em português e inglês{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Operadores em Português: Use 'mais', 'vezes', 'dividido'{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}IA Integrada: Completamento e análise automática{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Editor Web: Desenvolvimento completo no navegador{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Colaboração: Trabalhe em equipe em tempo real{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Mobile-First: Otimizado para dispositivos móveis{Colors.END}

{Colors.BOLD}{Colors.WHITE}Como usar este executor no Termux:{Colors.END}
1. Selecione uma opção do menu
2. Digite o caminho do arquivo .stk
3. O executor fará o resto!

{Colors.BOLD}{Colors.WHITE}Comandos específicos para Termux:{Colors.END}
{Colors.GREEN}a.{Colors.END} {Colors.WHITE}Abrir no navegador Android{Colors.END}
{Colors.GREEN}b.{Colors.END} {Colors.WHITE}Compartilhar projeto{Colors.END}
{Colors.GREEN}c.{Colors.END} {Colors.WHITE}Fazer backup{Colors.END}

{Colors.BOLD}{Colors.WHITE}Comandos disponíveis:{Colors.END}
{Colors.GREEN}1.{Colors.END} {Colors.WHITE}Executar arquivo .stk{Colors.END}
{Colors.GREEN}2.{Colors.END} {Colors.WHITE}Executar servidor web{Colors.END}
{Colors.GREEN}3.{Colors.END} {Colors.WHITE}Compilar para JavaScript{Colors.END}
{Colors.GREEN}4.{Colors.END} {Colors.WHITE}Compilar para Python{Colors.END}
{Colors.GREEN}5.{Colors.END} {Colors.WHITE}Analisar código com IA{Colors.END}
{Colors.GREEN}6.{Colors.END} {Colors.WHITE}Traduzir código{Colors.END}
{Colors.GREEN}7.{Colors.END} {Colors.WHITE}Ver exemplos{Colors.END}
{Colors.GREEN}8.{Colors.END} {Colors.WHITE}Configurações{Colors.END}
{Colors.GREEN}9.{Colors.END} {Colors.WHITE}Ajuda{Colors.END}
{Colors.RED}0.{Colors.END} {Colors.WHITE}Sair{Colors.END}

{Colors.BOLD}{Colors.WHITE}Dicas específicas para Termux:{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Use 'termux-open' para abrir arquivos{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Use 'termux-share' para compartilhar{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Configure permissões de armazenamento{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Use 'pkg update' para atualizar pacotes{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Configure o teclado para melhor experiência{Colors.END}

{Colors.BOLD}{Colors.WHITE}Suporte:{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}GitHub: https://github.com/stack-extension/stack-extension{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Discord: https://discord.gg/stack-extension{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Email: suporte@stack-extension.com{Colors.END}

{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}
"""
        print(help_text)
    
    def run(self):
        """Executa o executor principal"""
        while self.running:
            self.clear_screen()
            self.print_banner()
            self.print_menu()
            
            try:
                choice = input(f"\n{Colors.YELLOW}Digite sua escolha (0-9, a-c): {Colors.END}").strip().lower()
                
                if choice == "0":
                    print(f"\n{Colors.GREEN}👋 Obrigado por usar o Stack Extensão Executor no Termux!{Colors.END}")
                    self.running = False
                
                elif choice == "1":
                    file_path = self.get_file_path()
                    if file_path:
                        self.execute_file(file_path)
                        input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "2":
                    file_path = self.get_file_path()
                    if file_path:
                        self.execute_web_server(file_path)
                
                elif choice == "7":
                    self.show_examples()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "8":
                    self.show_settings()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "9":
                    self.show_help()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "a":
                    self.open_in_browser()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "b":
                    self.share_project()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "c":
                    self.backup_project()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                else:
                    print(f"\n{Colors.YELLOW}⚠️  Funcionalidade em desenvolvimento!{Colors.END}")
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
            
            except KeyboardInterrupt:
                print(f"\n\n{Colors.YELLOW}👋 Saindo...{Colors.END}")
                self.running = False
            
            except Exception as e:
                print(f"\n{Colors.RED}❌ Erro inesperado: {e}{Colors.END}")
                input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")

def main():
    """Função principal"""
    executor = TermuxStackExecutor()
    executor.run()

if __name__ == "__main__":
    main()