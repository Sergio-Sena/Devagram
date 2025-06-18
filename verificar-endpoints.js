/**
 * Script para verificar quais endpoints do backend estão sendo consumidos pelo frontend
 */

const fs = require('fs');
const path = require('path');

// Configurações
const BACKEND_DIR = path.join(__dirname, 'Devagram-Node', 'pages', 'api');
const FRONTEND_DIR = path.join(__dirname, 'Devagram-react');
const OUTPUT_FILE = path.join(__dirname, 'endpoints-verificados.md');

// Função para ler arquivos recursivamente
function readFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.ts'))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Função para encontrar endpoints do backend
function findBackendEndpoints() {
  const endpoints = [];
  const apiFiles = fs.readdirSync(BACKEND_DIR);
  
  apiFiles.forEach(file => {
    if (file.endsWith('.ts')) {
      const endpoint = file.replace('.ts', '');
      endpoints.push(endpoint);
    }
  });
  
  return endpoints;
}

// Função para verificar se um endpoint é usado no frontend
function checkEndpointUsage(endpoint, frontendFiles) {
  const usageInfo = {
    endpoint,
    used: false,
    files: []
  };
  
  frontendFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar diferentes padrões de uso do endpoint
      const patterns = [
        `/${endpoint}`,
        `"${endpoint}"`,
        `'${endpoint}'`,
        `\`${endpoint}\``
      ];
      
      for (const pattern of patterns) {
        if (content.includes(pattern)) {
          usageInfo.used = true;
          usageInfo.files.push(path.relative(FRONTEND_DIR, file));
        }
      }
    } catch (error) {
      console.error(`Erro ao ler arquivo ${file}:`, error);
    }
  });
  
  return usageInfo;
}

// Função principal
function main() {
  console.log('Verificando endpoints do backend utilizados pelo frontend...');
  
  // Encontrar todos os endpoints do backend
  const backendEndpoints = findBackendEndpoints();
  console.log(`Encontrados ${backendEndpoints.length} endpoints no backend.`);
  
  // Ler todos os arquivos do frontend
  const frontendFiles = readFilesRecursively(FRONTEND_DIR);
  console.log(`Encontrados ${frontendFiles.length} arquivos no frontend.`);
  
  // Verificar uso de cada endpoint
  const endpointUsage = backendEndpoints.map(endpoint => 
    checkEndpointUsage(endpoint, frontendFiles)
  );
  
  // Gerar relatório
  const usedEndpoints = endpointUsage.filter(info => info.used);
  const unusedEndpoints = endpointUsage.filter(info => !info.used);
  
  let report = '# Verificação de Endpoints\n\n';
  
  report += '## Endpoints Utilizados\n\n';
  report += '| Endpoint | Arquivos do Frontend |\n';
  report += '|----------|----------------------|\n';
  
  usedEndpoints.forEach(info => {
    report += `| \`${info.endpoint}\` | ${info.files.join(', ')} |\n`;
  });
  
  report += '\n## Endpoints Não Utilizados\n\n';
  
  if (unusedEndpoints.length > 0) {
    unusedEndpoints.forEach(info => {
      report += `- \`${info.endpoint}\`\n`;
    });
  } else {
    report += 'Todos os endpoints estão sendo utilizados.\n';
  }
  
  // Salvar relatório
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`Relatório salvo em ${OUTPUT_FILE}`);
  
  console.log(`Endpoints utilizados: ${usedEndpoints.length}`);
  console.log(`Endpoints não utilizados: ${unusedEndpoints.length}`);
}

// Executar
main();