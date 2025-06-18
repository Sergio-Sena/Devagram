/**
 * Script para listar apenas os arquivos essenciais do backend
 */

const fs = require('fs');
const path = require('path');

// Configurações
const BACKEND_DIR = path.join(__dirname, 'Devagram-Node');
const OUTPUT_FILE = path.join(__dirname, 'arquivos-essenciais.md');

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
  'seguidor',
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
  'tsconfig.json',
  '.env',
  '.env.exemple'
];

// Função para listar arquivos essenciais
function listEssentialFiles() {
  const essentialFiles = [];
  
  // Adicionar endpoints
  ENDPOINTS_TO_KEEP.forEach(endpoint => {
    const endpointPath = path.join(BACKEND_DIR, 'pages', 'api', `${endpoint}.ts`);
    if (fs.existsSync(endpointPath)) {
      essentialFiles.push(`pages/api/${endpoint}.ts`);
    }
  });
  
  // Adicionar outros arquivos essenciais
  ESSENTIAL_BACKEND_FILES.forEach(file => {
    const filePath = path.join(BACKEND_DIR, file);
    if (fs.existsSync(filePath)) {
      essentialFiles.push(file);
    }
  });
  
  return essentialFiles;
}

// Função principal
function main() {
  console.log('Listando arquivos essenciais do backend...');
  
  const essentialFiles = listEssentialFiles();
  console.log(`Encontrados ${essentialFiles.length} arquivos essenciais.`);
  
  // Gerar relatório
  let report = '# Arquivos Essenciais do Backend\n\n';
  
  report += '## Endpoints\n\n';
  essentialFiles
    .filter(file => file.startsWith('pages/api/'))
    .forEach(file => {
      report += `- ${file}\n`;
    });
  
  report += '\n## Middlewares\n\n';
  essentialFiles
    .filter(file => file.startsWith('middlewares/'))
    .forEach(file => {
      report += `- ${file}\n`;
    });
  
  report += '\n## Models\n\n';
  essentialFiles
    .filter(file => file.startsWith('models/'))
    .forEach(file => {
      report += `- ${file}\n`;
    });
  
  report += '\n## Services\n\n';
  essentialFiles
    .filter(file => file.startsWith('services/'))
    .forEach(file => {
      report += `- ${file}\n`;
    });
  
  report += '\n## Types\n\n';
  essentialFiles
    .filter(file => file.startsWith('types/'))
    .forEach(file => {
      report += `- ${file}\n`;
    });
  
  report += '\n## Configuração\n\n';
  essentialFiles
    .filter(file => !file.startsWith('pages/') && 
                   !file.startsWith('middlewares/') && 
                   !file.startsWith('models/') && 
                   !file.startsWith('services/') && 
                   !file.startsWith('types/'))
    .forEach(file => {
      report += `- ${file}\n`;
    });
  
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`Relatório salvo em ${OUTPUT_FILE}`);
}

// Executar
main();