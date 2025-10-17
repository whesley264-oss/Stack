#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stack Extensão - Executor Padrão
Executor visual em Python para executar código Stack Extensão
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

class StackExecutor:
    def __init__(self):
        self.version = "1.0.0"
        self.running = True
        self.current_file = None
        self.server_port = 3000
        
    def clear_screen(self):
        """Limpa a tela do terminal"""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def print_banner(self):
        """Imprime o banner da Stack Extensão"""
        banner = f"""
{Colors.CYAN}╔══════════════════════════════════════════════════════════════╗{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}║              {Colors.BOLD}🚀 STACK EXTENSÃO EXECUTOR{Colors.END} {Colors.CYAN}                    ║{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}║        {Colors.YELLOW}A super linguagem de programação única!{Colors.END} {Colors.CYAN}              ║{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Código Bilíngue (PT/EN){Colors.END} {Colors.CYAN}                              ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Operadores em Português{Colors.END} {Colors.CYAN}                              ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• IA Integrada{Colors.END} {Colors.CYAN}                                      ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Editor Web Completo{Colors.END} {Colors.CYAN}                                 ║{Colors.END}
{Colors.CYAN}║  {Colors.GREEN}• Colaboração em Tempo Real{Colors.END} {Colors.CYAN}                            ║{Colors.END}
{Colors.CYAN}║                                                              ║{Colors.END}
{Colors.CYAN}╚══════════════════════════════════════════════════════════════╝{Colors.END}

{Colors.BOLD}{Colors.WHITE}Versão: {self.version}{Colors.END}
{Colors.BOLD}{Colors.WHITE}Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}{Colors.END}
"""
        print(banner)
    
    def print_menu(self):
        """Imprime o menu principal"""
        menu = f"""
{Colors.BOLD}{Colors.WHITE}📋 MENU PRINCIPAL{Colors.END}
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
{Colors.RED}0.{Colors.END} {Colors.WHITE}Sair{Colors.END}

{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}
"""
        print(menu)
    
    def get_file_path(self):
        """Solicita o caminho do arquivo ao usuário"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📁 SELECIONAR ARQUIVO{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
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
    
    def check_stack_extension(self):
        """Verifica se a Stack Extensão está instalada"""
        try:
            # Tentar executar o comando stk
            result = subprocess.run(['stk', '--version'], 
                                 capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        # Tentar com npx
        try:
            result = subprocess.run(['npx', 'stack-extension', '--version'], 
                                 capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        return False
    
    def install_stack_extension(self):
        """Instala a Stack Extensão se não estiver instalada"""
        print(f"\n{Colors.YELLOW}📦 Instalando Stack Extensão...{Colors.END}")
        
        try:
            # Verificar se estamos no diretório correto
            if os.path.exists('package.json'):
                print(f"{Colors.BLUE}Instalando dependências...{Colors.END}")
                subprocess.run(['npm', 'install'], check=True)
                
                print(f"{Colors.BLUE}Instalando globalmente...{Colors.END}")
                subprocess.run(['npm', 'install', '-g', '.'], check=True)
                
                print(f"{Colors.GREEN}✅ Stack Extensão instalada com sucesso!{Colors.END}")
                return True
            else:
                print(f"{Colors.RED}❌ package.json não encontrado. Execute no diretório do projeto.{Colors.END}")
                return False
        except subprocess.CalledProcessError as e:
            print(f"{Colors.RED}❌ Erro ao instalar: {e}{Colors.END}")
            return False
    
    def execute_file(self, file_path):
        """Executa um arquivo .stk"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🚀 EXECUTANDO ARQUIVO{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.WHITE}Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}{Colors.END}")
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
            print(f"{Colors.YELLOW}Tentando instalar Stack Extensão...{Colors.END}")
            if self.install_stack_extension():
                self.execute_file(file_path)
    
    def execute_web_server(self, file_path):
        """Executa um servidor web para arquivos .stk"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🌐 EXECUTANDO SERVIDOR WEB{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.WHITE}Porta: {self.server_port}{Colors.END}")
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
                
                # Abrir no navegador
                try:
                    webbrowser.open(url)
                    print(f"{Colors.GREEN}✅ Abrindo no navegador...{Colors.END}")
                except Exception as e:
                    print(f"{Colors.YELLOW}⚠️  Não foi possível abrir o navegador: {e}{Colors.END}")
                
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
    
    def compile_to_javascript(self, file_path):
        """Compila arquivo .stk para JavaScript"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📦 COMPILANDO PARA JAVASCRIPT{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        try:
            result = subprocess.run(['stk', 'compile', file_path, '--target', 'javascript'], 
                                 capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Compilação bem-sucedida!{Colors.END}")
                if result.stdout:
                    print(f"\n{Colors.BOLD}{Colors.WHITE}📤 CÓDIGO JAVASCRIPT GERADO:{Colors.END}")
                    print(f"{Colors.WHITE}{result.stdout}{Colors.END}")
            else:
                print(f"\n{Colors.RED}❌ Erro na compilação!{Colors.END}")
                if result.stderr:
                    print(f"\n{Colors.BOLD}{Colors.RED}📤 ERRO:{Colors.END}")
                    print(f"{Colors.RED}{result.stderr}{Colors.END}")
        
        except subprocess.TimeoutExpired:
            print(f"\n{Colors.RED}❌ Timeout na compilação!{Colors.END}")
        except FileNotFoundError:
            print(f"\n{Colors.RED}❌ Comando 'stk' não encontrado!{Colors.END}")
    
    def compile_to_python(self, file_path):
        """Compila arquivo .stk para Python"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🐍 COMPILANDO PARA PYTHON{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        try:
            result = subprocess.run(['stk', 'compile', file_path, '--target', 'python'], 
                                 capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Compilação bem-sucedida!{Colors.END}")
                if result.stdout:
                    print(f"\n{Colors.BOLD}{Colors.WHITE}📤 CÓDIGO PYTHON GERADO:{Colors.END}")
                    print(f"{Colors.WHITE}{result.stdout}{Colors.END}")
            else:
                print(f"\n{Colors.RED}❌ Erro na compilação!{Colors.END}")
                if result.stderr:
                    print(f"\n{Colors.BOLD}{Colors.RED}📤 ERRO:{Colors.END}")
                    print(f"{Colors.RED}{result.stderr}{Colors.END}")
        
        except subprocess.TimeoutExpired:
            print(f"\n{Colors.RED}❌ Timeout na compilação!{Colors.END}")
        except FileNotFoundError:
            print(f"\n{Colors.RED}❌ Comando 'stk' não encontrado!{Colors.END}")
    
    def analyze_code(self, file_path):
        """Analisa código com IA"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🤖 ANÁLISE COM IA{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        try:
            result = subprocess.run(['stk', 'analyze', file_path], 
                                 capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Análise concluída!{Colors.END}")
                if result.stdout:
                    print(f"\n{Colors.BOLD}{Colors.WHITE}📤 RESULTADO DA ANÁLISE:{Colors.END}")
                    print(f"{Colors.WHITE}{result.stdout}{Colors.END}")
            else:
                print(f"\n{Colors.RED}❌ Erro na análise!{Colors.END}")
                if result.stderr:
                    print(f"\n{Colors.BOLD}{Colors.RED}📤 ERRO:{Colors.END}")
                    print(f"{Colors.RED}{result.stderr}{Colors.END}")
        
        except subprocess.TimeoutExpired:
            print(f"\n{Colors.RED}❌ Timeout na análise!{Colors.END}")
        except FileNotFoundError:
            print(f"\n{Colors.RED}❌ Comando 'stk' não encontrado!{Colors.END}")
    
    def translate_code(self, file_path):
        """Traduz código"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}🌍 TRADUÇÃO DE CÓDIGO{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        print(f"{Colors.WHITE}Arquivo: {file_path}{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        print(f"\n{Colors.YELLOW}Selecione o idioma de destino:{Colors.END}")
        print(f"{Colors.GREEN}1.{Colors.END} {Colors.WHITE}Português{Colors.END}")
        print(f"{Colors.GREEN}2.{Colors.END} {Colors.WHITE}Inglês{Colors.END}")
        
        choice = input(f"\n{Colors.YELLOW}Digite sua escolha (1-2): {Colors.END}").strip()
        
        target_lang = "portuguese" if choice == "1" else "english"
        
        try:
            result = subprocess.run(['stk', 'translate', file_path, '--to', target_lang], 
                                 capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Tradução concluída!{Colors.END}")
                if result.stdout:
                    print(f"\n{Colors.BOLD}{Colors.WHITE}📤 CÓDIGO TRADUZIDO:{Colors.END}")
                    print(f"{Colors.WHITE}{result.stdout}{Colors.END}")
            else:
                print(f"\n{Colors.RED}❌ Erro na tradução!{Colors.END}")
                if result.stderr:
                    print(f"\n{Colors.BOLD}{Colors.RED}📤 ERRO:{Colors.END}")
                    print(f"{Colors.RED}{result.stderr}{Colors.END}")
        
        except subprocess.TimeoutExpired:
            print(f"\n{Colors.RED}❌ Timeout na tradução!{Colors.END}")
        except FileNotFoundError:
            print(f"\n{Colors.RED}❌ Comando 'stk' não encontrado!{Colors.END}")
    
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
        """Mostra configurações"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}⚙️  CONFIGURAÇÕES{Colors.END}")
        print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}")
        
        print(f"\n{Colors.WHITE}Configurações atuais:{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Versão: {self.version}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Porta do servidor: {self.server_port}{Colors.END}")
        print(f"{Colors.GREEN}•{Colors.END} {Colors.WHITE}Arquivo atual: {self.current_file or 'Nenhum'}{Colors.END}")
        
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
        """Mostra ajuda"""
        help_text = f"""
{Colors.BOLD}{Colors.WHITE}📖 AJUDA - STACK EXTENSÃO EXECUTOR{Colors.END}
{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.END}

{Colors.BOLD}{Colors.WHITE}O que é a Stack Extensão?{Colors.END}
A Stack Extensão é uma super linguagem de programação que combina o melhor
do JavaScript e Python com funcionalidades únicas:

{Colors.GREEN}•{Colors.END} {Colors.WHITE}Código Bilíngue: Escreva em português e inglês{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Operadores em Português: Use 'mais', 'vezes', 'dividido'{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}IA Integrada: Completamento e análise automática{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Editor Web: Desenvolvimento completo no navegador{Colors.END}
{Colors.GREEN}•{Colors.END} {Colors.WHITE}Colaboração: Trabalhe em equipe em tempo real{Colors.END}

{Colors.BOLD}{Colors.WHITE}Como usar este executor:{Colors.END}
1. Selecione uma opção do menu
2. Digite o caminho do arquivo .stk
3. O executor fará o resto!

{Colors.BOLD}{Colors.WHITE}Exemplo de código Stack Extensão:{Colors.END}
{Colors.CYAN}```stk{Colors.END}
{Colors.WHITE}// Meu primeiro programa{Colors.END}
{Colors.WHITE}imprimir("Olá, Stack Extensão!"){Colors.END}
{Colors.WHITE}variavel resultado = 10 mais 5 vezes 2{Colors.END}
{Colors.WHITE}imprimir("Resultado: " + resultado){Colors.END}
{Colors.CYAN}```{Colors.END}

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
                choice = input(f"\n{Colors.YELLOW}Digite sua escolha (0-9): {Colors.END}").strip()
                
                if choice == "0":
                    print(f"\n{Colors.GREEN}👋 Obrigado por usar o Stack Extensão Executor!{Colors.END}")
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
                
                elif choice == "3":
                    file_path = self.get_file_path()
                    if file_path:
                        self.compile_to_javascript(file_path)
                        input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "4":
                    file_path = self.get_file_path()
                    if file_path:
                        self.compile_to_python(file_path)
                        input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "5":
                    file_path = self.get_file_path()
                    if file_path:
                        self.analyze_code(file_path)
                        input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "6":
                    file_path = self.get_file_path()
                    if file_path:
                        self.translate_code(file_path)
                        input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "7":
                    self.show_examples()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "8":
                    self.show_settings()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                elif choice == "9":
                    self.show_help()
                    input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")
                
                else:
                    print(f"\n{Colors.RED}❌ Escolha inválida! Digite um número de 0 a 9.{Colors.END}")
                    time.sleep(2)
            
            except KeyboardInterrupt:
                print(f"\n\n{Colors.YELLOW}👋 Saindo...{Colors.END}")
                self.running = False
            
            except Exception as e:
                print(f"\n{Colors.RED}❌ Erro inesperado: {e}{Colors.END}")
                input(f"\n{Colors.YELLOW}Pressione Enter para continuar...{Colors.END}")

def main():
    """Função principal"""
    executor = StackExecutor()
    executor.run()

if __name__ == "__main__":
    main()