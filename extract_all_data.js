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

async function main() {
    console.log('Iniciando extração completa...\n');
    
    const browser = await puppeteer.launch({
        headless: false, // Mostrar o navegador para debug
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar cookies
    const cookies = parseCookies(COOKIES_FILE);
    for (const cookie of cookies) {
        try {
            await page.setCookie(cookie);
        } catch (e) {
            console.log('Cookie error:', e.message);
        }
    }
    
    // Armazenar todas as respostas da API
    const apiData = {};
    
    // Interceptar respostas da rede
    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('rest/v1') || url.includes('supabase')) {
            try {
                const contentType = response.headers()['content-type'] || '';
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    const endpoint = new URL(url).pathname;
                    console.log(`API capturada: ${endpoint} - ${Array.isArray(data) ? data.length : 1} itens`);
                    
                    if (!apiData[endpoint]) {
                        apiData[endpoint] = [];
                    }
                    if (Array.isArray(data)) {
                        apiData[endpoint].push(...data);
                    } else {
                        apiData[endpoint].push(data);
                    }
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
    
    // Esperar carregar
    await page.waitForTimeout(5000);
    
    // Capturar lista de todos os módulos/tabs
    const tabs = await page.$$eval('[role="tab"]', tabs => 
        tabs.map(t => ({
            text: t.textContent.trim(),
            name: t.getAttribute('name') || t.textContent.trim()
        }))
    );
    
    console.log(`\\nEncontrados ${tabs.length} módulos:`);
    tabs.forEach((t, i) => console.log(`  ${i+1}. ${t.text.substring(0, 50)}...`));
    
    // Clicar em cada módulo para carregar os dados
    const tabElements = await page.$$('[role="tab"]');
    
    for (let i = 0; i < tabElements.length; i++) {
        console.log(`\\n--- Processando módulo ${i+1}/${tabElements.length}: ${tabs[i].text.substring(0, 40)}... ---`);
        
        try {
            await tabElements[i].click();
            await page.waitForTimeout(3000);
            
            // Scroll para carregar mais conteúdo
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(2000);
            
            // Capturar conteúdo da página
            const content = await page.content();
            const moduleDir = path.join(OUTPUT_DIR, `modulo_${String(i+1).padStart(2, '0')}`);
            
            if (!fs.existsSync(moduleDir)) {
                fs.mkdirSync(moduleDir, { recursive: true });
            }
            
            // Salvar HTML
            fs.writeFileSync(path.join(moduleDir, 'page.html'), content, 'utf8');
            
            // Capturar todos os headings (itens)
            const items = await page.$$eval('h3', els => 
                els.map(el => ({
                    title: el.textContent.trim(),
                    parent: el.parentElement?.textContent?.substring(0, 500) || ''
                }))
            );
            
            console.log(`  Itens encontrados: ${items.length}`);
            fs.writeFileSync(path.join(moduleDir, 'items.json'), JSON.stringify(items, null, 2), 'utf8');
            
        } catch (e) {
            console.log(`  Erro: ${e.message}`);
        }
    }
    
    // Salvar todos os dados da API
    console.log('\\n--- Salvando dados da API ---');
    for (const endpoint in apiData) {
        const safeName = endpoint.replace(/[^a-zA-Z0-9]/g, '_');
        const filePath = path.join(OUTPUT_DIR, `api${safeName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(apiData[endpoint], null, 2), 'utf8');
        console.log(`Salvo: ${filePath} (${apiData[endpoint].length} itens)`);
    }
    
    console.log('\\nExtração concluída!');
    await browser.close();
}

main().catch(console.error);
