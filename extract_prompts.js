const fs = require('fs');
const path = require('path');

// Ler o arquivo de snapshot
const snapshotPath = 'C:\\Users\\andre\\.cursor\\browser-logs\\snapshot-2026-01-29T18-01-35-500Z.log';
const content = fs.readFileSync(snapshotPath, 'utf8');

// Extrair todos os "name:" que parecem ser prompts (textos longos)
const lines = content.split('\n');
const prompts = [];

let currentCategory = 'Career'; // Categoria inicial

for (const line of lines) {
    const nameMatch = line.match(/name:\s*(.+)/);
    if (nameMatch) {
        const name = nameMatch[1].trim();
        // Ignorar nomes curtos ou de navegação
        if (name.length > 30 && 
            !name.includes('Pack +') && 
            !name.includes('Templates') &&
            !name.includes('Fluxos') &&
            !name.includes('Prompts Midjourney') &&
            !name.includes('Curso de N8N') &&
            !name.includes('Typebot') &&
            !name.includes('ferramentas') &&
            !name.includes('Ferramentas') &&
            !name.includes('Self-Hosted') &&
            !name.includes('Saas') &&
            !name.includes('Bônus') &&
            !name.includes('Membros') &&
            !name.includes('Buscar por') &&
            !name.includes('Coleção de prompts')) {
            prompts.push({
                category: currentCategory,
                prompt: name.replace(/^"/, '').replace(/"$/, '')
            });
        }
        
        // Detectar mudança de categoria
        if (name === 'Career' || name === 'Business' || name === 'Email Marketing' || 
            name === 'Google Sheets' || name === 'Act As' || name === 'Copywriting' ||
            name === 'Microsoft Excel' || name === 'Learn English' || name === 'Shadow Work for Signs' ||
            name === 'Google Ads' || name === 'ETSY' || name === 'Bonus') {
            currentCategory = name;
        }
    }
}

console.log(`Total de prompts extraídos: ${prompts.length}`);

// Agrupar por categoria
const byCategory = {};
for (const p of prompts) {
    if (!byCategory[p.category]) {
        byCategory[p.category] = [];
    }
    byCategory[p.category].push(p.prompt);
}

// Mostrar contagem por categoria
for (const cat in byCategory) {
    console.log(`  ${cat}: ${byCategory[cat].length} prompts`);
}

// Salvar em arquivos por categoria
const outputDir = 'Curso_Clone_Completo/01_Pack_3500_Prompts_ChatGPT';
for (const cat in byCategory) {
    const safeCat = cat.replace(/\s+/g, '_');
    const filePath = path.join(outputDir, `${safeCat}.json`);
    fs.writeFileSync(filePath, JSON.stringify(byCategory[cat], null, 2), 'utf8');
    console.log(`Salvo: ${filePath}`);
}

// Salvar arquivo completo
fs.writeFileSync(path.join(outputDir, '_todos_prompts.json'), JSON.stringify(byCategory, null, 2), 'utf8');
console.log('\\nArquivo completo salvo em _todos_prompts.json');
