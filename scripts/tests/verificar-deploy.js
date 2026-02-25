#!/usr/bin/env node

/**
 * Script de Verificação Pré-Deploy
 * Valida se o projeto está pronto para deploy no Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração para deploy no Vercel...\n');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// Verificar arquivos do Backend
console.log('📦 BACKEND (Devagram-Node)');
const backendPath = path.join(__dirname, 'Devagram-Node');

// 1. package.json
if (fs.existsSync(path.join(backendPath, 'package.json'))) {
  checks.passed.push('✅ package.json encontrado');
  const pkg = JSON.parse(fs.readFileSync(path.join(backendPath, 'package.json')));
  if (pkg.scripts && pkg.scripts.build) {
    checks.passed.push('✅ Script de build configurado');
  } else {
    checks.failed.push('❌ Script de build não encontrado');
  }
} else {
  checks.failed.push('❌ package.json não encontrado');
}

// 2. vercel.json
if (fs.existsSync(path.join(backendPath, 'vercel.json'))) {
  checks.passed.push('✅ vercel.json configurado');
} else {
  checks.warnings.push('⚠️  vercel.json não encontrado (será criado)');
}

// 3. next.config.js
if (fs.existsSync(path.join(backendPath, 'next.config.js'))) {
  checks.passed.push('✅ next.config.js encontrado');
} else {
  checks.failed.push('❌ next.config.js não encontrado');
}

// 4. Verificar estrutura de APIs
const apiPath = path.join(backendPath, 'pages', 'api');
if (fs.existsSync(apiPath)) {
  const apis = fs.readdirSync(apiPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  checks.passed.push(`✅ ${apis.length} APIs encontradas`);
} else {
  checks.failed.push('❌ Pasta pages/api não encontrada');
}

console.log('\n📱 FRONTEND (Devagram-react)');
const frontendPath = path.join(__dirname, 'Devagram-react');

// 5. package.json
if (fs.existsSync(path.join(frontendPath, 'package.json'))) {
  checks.passed.push('✅ package.json encontrado');
  const pkg = JSON.parse(fs.readFileSync(path.join(frontendPath, 'package.json')));
  if (pkg.scripts && pkg.scripts.build) {
    checks.passed.push('✅ Script de build configurado');
  } else {
    checks.failed.push('❌ Script de build não encontrado');
  }
} else {
  checks.failed.push('❌ package.json não encontrado');
}

// 6. vercel.json
if (fs.existsSync(path.join(frontendPath, 'vercel.json'))) {
  checks.passed.push('✅ vercel.json configurado');
} else {
  checks.warnings.push('⚠️  vercel.json não encontrado (será criado)');
}

// 7. next.config.js
if (fs.existsSync(path.join(frontendPath, 'next.config.js'))) {
  checks.passed.push('✅ next.config.js encontrado');
} else {
  checks.failed.push('❌ next.config.js não encontrado');
}

// 8. Verificar páginas
const pagesPath = path.join(frontendPath, 'pages');
if (fs.existsSync(pagesPath)) {
  const pages = fs.readdirSync(pagesPath).filter(f => f.endsWith('.js') || f.endsWith('.tsx'));
  checks.passed.push(`✅ ${pages.length} páginas encontradas`);
} else {
  checks.failed.push('❌ Pasta pages não encontrada');
}

// Exibir resultados
console.log('\n' + '='.repeat(50));
console.log('📊 RESULTADO DA VERIFICAÇÃO');
console.log('='.repeat(50) + '\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSOU:');
  checks.passed.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (checks.warnings.length > 0) {
  console.log('⚠️  AVISOS:');
  checks.warnings.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (checks.failed.length > 0) {
  console.log('❌ FALHOU:');
  checks.failed.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

// Resumo final
console.log('='.repeat(50));
if (checks.failed.length === 0) {
  console.log('🎉 PROJETO PRONTO PARA DEPLOY!');
  console.log('\n📖 Próximos passos:');
  console.log('   1. Commit e push para o GitHub');
  console.log('   2. Acesse https://vercel.com/new');
  console.log('   3. Siga o guia em DEPLOY-VERCEL-GUIA.md');
} else {
  console.log('⚠️  CORRIJA OS ERROS ANTES DO DEPLOY');
  console.log('\n📖 Verifique:');
  console.log('   - Estrutura de pastas');
  console.log('   - Arquivos de configuração');
  console.log('   - Scripts de build');
}
console.log('='.repeat(50) + '\n');

process.exit(checks.failed.length > 0 ? 1 : 0);
