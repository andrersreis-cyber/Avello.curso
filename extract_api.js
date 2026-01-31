const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIES_FILE = 'cookies.txt';
const OUTPUT_DIR = 'Curso_Clone_Completo';

// Parse cookies do formato Netscape
function parseCookies(cookieFile) {
    const content = fs.readFileSync(cookieFile, 'utf8');
    const cookies = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
        if (line.startsWith('#') || !line.trim()) continue;
        const parts = line.split('\t');
        if (parts.length >= 7) {
            cookies.push({
                name: parts[5],
                value: parts[6].trim(),
                domain: parts[0].startsWith('.') ? parts[0] : '.' + parts[0],
                path: parts[2],
                secure: parts[3] === 'TRUE',
                httpOnly: false,
                expires: parseInt(parts[4]) || -1
            });
        }
    }
    return cookies;
}

// Função para delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('Iniciando extração via API...\n');
    
    // Criar diretório de saída
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar cookies
    const cookies = parseCookies(COOKIES_FILE);
    for (const cookie of cookies) {
        try {
            await page.setCookie(cookie);
        } catch (e) {
            // Ignorar erros de cookie
        }
    }
    
    // Armazenar todas as respostas da API
    const apiData = {};
    let capturedEndpoints = 0;
    
    // Interceptar respostas da rede e salvar imediatamente
    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('rest/v1') || url.includes('supabase')) {
            try {
                const contentType = response.headers()['content-type'] || '';
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    const urlObj = new URL(url);
                    const endpoint = urlObj.pathname.split('/').pop();
                    
                    const itemCount = Array.isArray(data) ? data.length : 1;
                    console.log(`✅ API: ${endpoint} - ${itemCount} itens`);
                    
                    // Salvar imediatamente
                    const filePath = path.join(OUTPUT_DIR, `api_${endpoint}.json`);
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                    console.log(`   Salvo: ${filePath}`);
                    
                    capturedEndpoints++;
                }
            } catch (e) {
                // Ignorar erros de parsing
            }
        }
    });
    
    // Navegar para a página
    console.log('Navegando para a área de membros...');
    await page.goto('https://app.segredosdon8n.com/members', {
        waitUntil: 'networkidle2',
        timeout: 60000
    });
    
    // Esperar um pouco para capturar todas as APIs
    console.log('\\nAguardando carregamento completo...');
    await delay(10000);
    
    // Fazer scroll para carregar mais dados
    console.log('Fazendo scroll para carregar mais dados...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(3000);
    
    // Clicar em cada tab para carregar os dados
    console.log('\\nClicando nas tabs para carregar todos os dados...');
    
    const tabSelectors = [
        '[name*="Pack +2000"]',
        '[name*="Pack +3500"]', 
        '[name*="+58 Super"]',
        '[name*="Midjourney"]',
        '[name*="Typebot"]',
        '[name*="ferramentas IA"]',
        '[name*="Self-Hosted"]',
        '[name*="Ferramentas Gratuitas"]',
        '[name*="Saas"]',
        '[name*="Bônus"]'
    ];
    
    for (const selector of tabSelectors) {
        try {
            const tab = await page.$(`[role="tab"]${selector}`);
            if (tab) {
                await tab.click();
                console.log(`Clicado: ${selector}`);
                await delay(3000);
            }
        } catch (e) {
            // Ignorar erros de clique
        }
    }
    
    // Esperar mais um pouco
    await delay(5000);
    
    console.log(`\\n========================================`);
    console.log(`Total de endpoints capturados: ${capturedEndpoints}`);
    console.log(`========================================`);
    
    await browser.close();
    
    // Listar arquivos salvos
    console.log('\\nArquivos salvos:');
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('api_'));
    files.forEach(f => {
        const content = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf8'));
        const count = Array.isArray(content) ? content.length : 1;
        console.log(`  ${f}: ${count} itens`);
    });
    
    console.log('\\n✅ Extração concluída!');
}

main().catch(console.error);
