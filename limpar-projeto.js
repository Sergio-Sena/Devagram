/**
 * Script para limpar o projeto, mantendo apenas os arquivos necessários
 * para os endpoints utilizados pelo frontend
 */

const fs = require('fs');
const path = require('path');

// Configurações
const BACKEND_DIR = path.join(__dirname, 'Devagram-Node');
const FRONTEND_DIR = path.join(__dirname, 'Devagram-react');
const BACKUP_DIR = path.join(__dirname, 'backup');

// Endpoints e arquivos relacionados a manter
const ENDPOINTS_TO_KEEP = [
  'cadastro',
  'comentario',
  'excluirPublicacao',
  'feed',
  'like',
  'login',
  'pesquisa',
  'publicacao',
  'seguir',
  'seguidor', // Mesmo que não seja usado diretamente, é importante para a funcionalidade
  'usuario'
];

// Arquivos essenciais do backend
const ESSENTIAL_BACKEND_FILES = [
  // Middlewares
  'middlewares/conectarMongoDB.ts',
  'middlewares/validarTokenJWT.ts',
  'middlewares/politicaCORS.ts',
  'middlewares/corsMiddleware.ts',
  
  // Models
  'models/UsuarioModel.ts',
  'models/PublicacaoModel.ts',
  'models/SeguidorModel.ts',
  
  // Services
  'services/uploadImagensS3.ts',
  'services/redimensionarImagem.ts',
  
  // Types
  'types/respostaPadraoMsg.ts',
  'types/cadastroRequisicao.ts',
  'types/loginResposta.ts',
  
  // Configuração
  'next.config.js',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  '.env',
  '.env.exemple'
];

// Função para criar backup
function createBackup() {
  console.log('Criando backup do projeto...');
  
  // Criar diretório de backup se não existir
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }
  
  // Backup do backend
  const backendBackupDir = path.join(BACKUP_DIR, 'Devagram-Node');
  if (!fs.existsSync(backendBackupDir)) {
    fs.mkdirSync(backendBackupDir);
  }
  
  // Função para copiar diretório recursivamente
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  // Copiar backend e frontend
  copyDir(BACKEND_DIR, backendBackupDir);
  console.log('Backup criado com sucesso!');
}

// Função para verificar se um arquivo deve ser mantido
function shouldKeepFile(filePath) {
  // Verificar se é um endpoint que deve ser mantido
  const relativePath = path.relative(BACKEND_DIR, filePath);
  
  // Se for um arquivo de endpoint
  if (relativePath.startsWith('pages/api/')) {
    const endpoint = path.basename(relativePath, '.ts');
    return ENDPOINTS_TO_KEEP.includes(endpoint);
  }
  
  // Se for um arquivo essencial
  return ESSENTIAL_BACKEND_FILES.some(essentialFile => 
    relativePath === essentialFile || relativePath.endsWith(essentialFile)
  );
}

// Função para listar arquivos a serem mantidos
function listFilesToKeep() {
  const filesToKeep = [];
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (shouldKeepFile(fullPath)) {
        filesToKeep.push(fullPath);
      }
    }
  }
  
  scanDir(BACKEND_DIR);
  return filesToKeep;
}

// Função principal
function main() {
  console.log('Iniciando limpeza do projeto...');
  
  // Criar backup
  createBackup();
  
  // Listar arquivos a serem mantidos
  const filesToKeep = listFilesToKeep();
  console.log(`Encontrados ${filesToKeep.length} arquivos essenciais para manter.`);
  
  // Gerar relatório
  let report = '# Arquivos Mantidos no Projeto\n\n';
  
  filesToKeep.forEach(file => {
    report += `- ${path.relative(BACKEND_DIR, file)}\n`;
  });
  
  fs.writeFileSync(path.join(__dirname, 'arquivos-mantidos.md'), report);
  console.log('Relatório de arquivos mantidos gerado.');
  
  console.log('Processo concluído!');
}

// Executar
main();