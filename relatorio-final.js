/**
 * Script para gerar um relatório final sobre os endpoints do projeto
 */

const fs = require('fs');
const path = require('path');

// Configurações
const BACKEND_DIR = path.join(__dirname, 'Devagram-Node');
const FRONTEND_DIR = path.join(__dirname, 'Devagram-react');
const OUTPUT_FILE = path.join(__dirname, 'relatorio-final.md');

// Endpoints do backend
const BACKEND_ENDPOINTS = [
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

// Função para verificar se um endpoint do backend é usado pelo frontend
function checkEndpointUsage(endpoint, frontendServices) {
  const patterns = [
    new RegExp(`/${endpoint}`, 'i'),
    new RegExp(`"${endpoint}"`, 'i'),
    new RegExp(`'${endpoint}'`, 'i')
  ];
  
  for (const [file, content] of Object.entries(frontendServices)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return { used: true, file };
      }
    }
  }
  
  return { used: false };
}

// Função para ler arquivos de serviço do frontend
function readFrontendServices() {
  const servicesDir = path.join(FRONTEND_DIR, 'services');
  const serviceFiles = fs.readdirSync(servicesDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(servicesDir, file));
  
  const services = {};
  
  serviceFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    services[fileName] = content;
  });
  
  return services;
}

// Função principal
function main() {
  console.log('Gerando relatório final...');
  
  // Ler serviços do frontend
  const frontendServices = readFrontendServices();
  console.log(`Lidos ${Object.keys(frontendServices).length} arquivos de serviço do frontend.`);
  
  // Verificar uso de cada endpoint
  const endpointUsage = BACKEND_ENDPOINTS.map(endpoint => {
    const usage = checkEndpointUsage(endpoint, frontendServices);
    return {
      endpoint,
      used: usage.used,
      file: usage.file
    };
  });
  
  const usedEndpoints = endpointUsage.filter(e => e.used);
  const unusedEndpoints = endpointUsage.filter(e => !e.used);
  
  console.log(`Endpoints usados: ${usedEndpoints.length}`);
  console.log(`Endpoints não usados: ${unusedEndpoints.length}`);
  
  // Gerar relatório
  let report = '# Relatório Final - Endpoints do Projeto Devagram\n\n';
  
  report += '## Endpoints do Backend Utilizados pelo Frontend\n\n';
  report += '| Endpoint | Utilizado | Arquivo do Frontend |\n';
  report += '|----------|-----------|---------------------|\n';
  
  usedEndpoints.forEach(({ endpoint, file }) => {
    report += `| \`/${endpoint}\` | ✅ | ${file || '-'} |\n`;
  });
  
  if (unusedEndpoints.length > 0) {
    report += '\n## Endpoints do Backend Não Utilizados pelo Frontend\n\n';
    report += '| Endpoint | Utilizado |\n';
    report += '|----------|----------|\n';
    
    unusedEndpoints.forEach(({ endpoint }) => {
      report += `| \`/${endpoint}\` | ❌ |\n`;
    });
  }
  
  report += '\n## Arquivos Essenciais do Backend\n\n';
  report += '### Endpoints\n\n';
  BACKEND_ENDPOINTS.forEach(endpoint => {
    report += `- pages/api/${endpoint}.ts\n`;
  });
  
  report += '\n### Middlewares\n\n';
  [
    'conectarMongoDB.ts',
    'validarTokenJWT.ts',
    'politicaCORS.ts',
    'corsMiddleware.ts'
  ].forEach(file => {
    report += `- middlewares/${file}\n`;
  });
  
  report += '\n### Models\n\n';
  [
    'UsuarioModel.ts',
    'PublicacaoModel.ts',
    'SeguidorModel.ts'
  ].forEach(file => {
    report += `- models/${file}\n`;
  });
  
  report += '\n### Services\n\n';
  [
    'uploadImagensS3.ts',
    'redimensionarImagem.ts'
  ].forEach(file => {
    report += `- services/${file}\n`;
  });
  
  report += '\n### Types\n\n';
  [
    'respostaPadraoMsg.ts',
    'cadastroRequisicao.ts',
    'loginResposta.ts'
  ].forEach(file => {
    report += `- types/${file}\n`;
  });
  
  report += '\n### Configuração\n\n';
  [
    'next.config.js',
    'package.json',
    'tsconfig.json',
    '.env',
    '.env.exemple'
  ].forEach(file => {
    report += `- ${file}\n`;
  });
  
  report += '\n## Conclusão\n\n';
  
  if (unusedEndpoints.length === 0) {
    report += 'Todos os endpoints do backend estão sendo utilizados pelo frontend. ';
  } else {
    report += `${unusedEndpoints.length} endpoints do backend não estão sendo utilizados diretamente pelo frontend. `;
  }
  
  report += 'Os arquivos listados acima são essenciais para manter a funcionalidade do sistema e devem ser mantidos no projeto.';
  
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`Relatório final salvo em ${OUTPUT_FILE}`);
}

// Executar
main();