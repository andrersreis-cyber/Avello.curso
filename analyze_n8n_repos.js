const fs = require('fs');
const path = require('path');

const baseDir = 'Curso_Clone_Completo';

// Função para contar arquivos JSON recursivamente
function countJsonFiles(dir) {
    let count = 0;
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory() && !item.startsWith('.')) {
                count += countJsonFiles(fullPath);
            } else if (item.endsWith('.json')) {
                count++;
            }
        }
    } catch (e) {}
    return count;
}

// Função para listar categorias com contagem
function getCategoriesWithCount(dir) {
    const categories = {};
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'img') {
                categories[item] = countJsonFiles(fullPath);
            }
        }
    } catch (e) {}
    return categories;
}

console.log('='.repeat(60));
console.log('ANÁLISE DOS REPOSITÓRIOS N8N');
console.log('='.repeat(60));

// 1. Zie619
console.log('\n📦 ZIE619/N8N-WORKFLOWS (50.6k stars)');
console.log('-'.repeat(40));
const zie619 = getCategoriesWithCount(path.join(baseDir, 'n8n_zie619/workflows'));
const zie619Total = Object.values(zie619).reduce((a, b) => a + b, 0);
console.log(`Total de workflows: ${zie619Total}`);
console.log(`Categorias: ${Object.keys(zie619).length}`);
console.log('\nTop 10 categorias:');
Object.entries(zie619)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

// 2. Awesome
console.log('\n\n📦 AWESOME-N8N-TEMPLATES (18.5k stars)');
console.log('-'.repeat(40));
const awesome = getCategoriesWithCount(path.join(baseDir, 'n8n_awesome'));
const awesomeTotal = Object.values(awesome).reduce((a, b) => a + b, 0);
console.log(`Total de workflows: ${awesomeTotal}`);
console.log(`Categorias: ${Object.keys(awesome).length}`);
console.log('\nTodas as categorias:');
Object.entries(awesome)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

// 3. Wassupjay
console.log('\n\n📦 WASSUPJAY/N8N-FREE-TEMPLATES (5.4k stars)');
console.log('-'.repeat(40));
const wassupjay = getCategoriesWithCount(path.join(baseDir, 'n8n_wassupjay'));
const wassupjayTotal = Object.values(wassupjay).reduce((a, b) => a + b, 0);
console.log(`Total de workflows: ${wassupjayTotal}`);
console.log(`Categorias: ${Object.keys(wassupjay).length}`);
console.log('\nTodas as categorias:');
Object.entries(wassupjay)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

// Resumo
const grandTotal = zie619Total + awesomeTotal + wassupjayTotal;
console.log('\n\n' + '='.repeat(60));
console.log('RESUMO TOTAL');
console.log('='.repeat(60));
console.log(`Zie619:    ${zie619Total} workflows`);
console.log(`Awesome:   ${awesomeTotal} workflows`);
console.log(`Wassupjay: ${wassupjayTotal} workflows`);
console.log('-'.repeat(30));
console.log(`TOTAL:     ${grandTotal} workflows n8n!`);
console.log('='.repeat(60));
