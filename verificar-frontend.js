/**
 * Script para verificar quais endpoints do backend são consumidos pelo frontend
 */

const fs = require('fs');
const path = require('path');

// Configurações
const FRONTEND_DIR = path.join(__dirname, 'Devagram-react');
const SERVICES_DIR = path.join(FRONTEND_DIR, 'services');
const OUTPUT_FILE = path.join(__dirname, 'frontend-endpoints.md');

// Função para ler arquivos de serviço do frontend
function readServiceFiles() {
  const serviceFiles = fs.readdirSync(SERVICES_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(SERVICES_DIR, file));
  
  const services = {};
  
  serviceFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    services[fileName] = content;
  });
  
  return services;
}

// Função para extrair endpoints dos serviços
function extractEndpoints(services) {
  const endpoints = [];
  
  // Padrões comuns para identificar endpoints
  const patterns = [
    /this\.get\(['"]([^'"]+)['"]\)/g,
    /this\.post\(['"]([^'"]+)['"]/g,
    /this\.put\(['"]([^'"]+)['"]/g,
    /this\.delete\(['"]([^'"]+)['"]/g,
    /url\s*=\s*['"]([^'"]+)['"]/g,
    /\$\{([^}]+)\}/g
  ];
  
  Object.entries(services).forEach(([fileName, content]) => {
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const endpoint = match[1].trim();
        
        // Filtrar apenas endpoints reais (não variáveis ou URLs completas)
        if (!endpoint.includes('${') && !endpoint.includes('http')) {
          endpoints.push({
            endpoint,
            file: fileName
          });
        }
      }
    });
  });
  
  return endpoints;
}

// Função principal
function main() {
  console.log('Verificando endpoints consumidos pelo frontend...');
  
  const services = readServiceFiles();
  console.log(`Lidos ${Object.keys(services).length} arquivos de serviço.`);
  
  const endpoints = extractEndpoints(services);
  console.log(`Encontrados ${endpoints.length} endpoints.`);
  
  // Agrupar endpoints por arquivo
  const endpointsByFile = {};
  endpoints.forEach(({ endpoint, file }) => {
    if (!endpointsByFile[file]) {
      endpointsByFile[file] = [];
    }
    if (!endpointsByFile[file].includes(endpoint)) {
      endpointsByFile[file].push(endpoint);
    }
  });
  
  // Gerar relatório
  let report = '# Endpoints Consumidos pelo Frontend\n\n';
  
  Object.entries(endpointsByFile).forEach(([file, endpoints]) => {
    report += `## ${file}\n\n`;
    endpoints.forEach(endpoint => {
      report += `- \`${endpoint}\`\n`;
    });
    report += '\n';
  });
  
  // Adicionar resumo
  const uniqueEndpoints = [...new Set(endpoints.map(e => e.endpoint))];
  report += '## Resumo\n\n';
  report += `Total de endpoints únicos: ${uniqueEndpoints.length}\n\n`;
  report += 'Endpoints únicos:\n';
  uniqueEndpoints.forEach(endpoint => {
    report += `- \`${endpoint}\`\n`;
  });
  
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`Relatório salvo em ${OUTPUT_FILE}`);
}

// Executar
main();