/**
 * Script de Importação de Dados para o Supabase
 * Epic 2 - Organização dos Dados
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://pgjcvdmbpluewhpephhx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Diretórios
const DATA_DIR = path.join(__dirname, '..', 'Curso_Clone_Completo');

// ============================================
// FUNÇÕES DE IMPORTAÇÃO
// ============================================

async function getCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
    }, {});
}

// 1. Importar Workflows n8n
async function importWorkflows(categories) {
    console.log('\n📦 Importando Workflows n8n...');
    
    const categoryId = categories['n8n-workflows'];
    const workflows = [];
    
    // Zie619
    const zie619Dir = path.join(DATA_DIR, 'n8n_zie619', 'workflows');
    if (fs.existsSync(zie619Dir)) {
        const subdirs = fs.readdirSync(zie619Dir);
        for (const subdir of subdirs) {
            const subdirPath = path.join(zie619Dir, subdir);
            if (fs.statSync(subdirPath).isDirectory()) {
                const files = fs.readdirSync(subdirPath).filter(f => f.endsWith('.json'));
                for (const file of files) {
                    try {
                        const filePath = path.join(subdirPath, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        const json = JSON.parse(content);
                        
                        workflows.push({
                            category_id: categoryId,
                            nome: json.name || file.replace('.json', ''),
                            descricao: json.description || null,
                            subcategoria: subdir,
                            fonte: 'zie619',
                            arquivo_path: `n8n_zie619/workflows/${subdir}/${file}`,
                            tags: json.tags || [],
                            is_active: true
                        });
                    } catch (e) {
                        // Ignorar arquivos com erro
                    }
                }
            }
        }
    }
    
    // Awesome
    const awesomeDir = path.join(DATA_DIR, 'n8n_awesome');
    if (fs.existsSync(awesomeDir)) {
        const subdirs = fs.readdirSync(awesomeDir).filter(d => {
            const p = path.join(awesomeDir, d);
            return fs.statSync(p).isDirectory() && !d.startsWith('.') && d !== 'img';
        });
        
        for (const subdir of subdirs) {
            const subdirPath = path.join(awesomeDir, subdir);
            const files = fs.readdirSync(subdirPath).filter(f => f.endsWith('.json'));
            for (const file of files) {
                try {
                    const filePath = path.join(subdirPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    const json = JSON.parse(content);
                    
                    workflows.push({
                        category_id: categoryId,
                        nome: json.name || file.replace('.json', ''),
                        descricao: json.description || null,
                        subcategoria: subdir.replace(/_/g, ' '),
                        fonte: 'awesome',
                        arquivo_path: `n8n_awesome/${subdir}/${file}`,
                        tags: json.tags || [],
                        is_active: true
                    });
                } catch (e) {
                    // Ignorar arquivos com erro
                }
            }
        }
    }
    
    // Wassupjay
    const wassupjayDir = path.join(DATA_DIR, 'n8n_wassupjay');
    if (fs.existsSync(wassupjayDir)) {
        const subdirs = fs.readdirSync(wassupjayDir).filter(d => {
            const p = path.join(wassupjayDir, d);
            return fs.statSync(p).isDirectory() && !d.startsWith('.');
        });
        
        for (const subdir of subdirs) {
            const subdirPath = path.join(wassupjayDir, subdir);
            const files = fs.readdirSync(subdirPath).filter(f => f.endsWith('.json'));
            for (const file of files) {
                try {
                    const filePath = path.join(subdirPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    const json = JSON.parse(content);
                    
                    workflows.push({
                        category_id: categoryId,
                        nome: json.name || file.replace('.json', ''),
                        descricao: json.description || null,
                        subcategoria: subdir.replace(/_/g, ' '),
                        fonte: 'wassupjay',
                        arquivo_path: `n8n_wassupjay/${subdir}/${file}`,
                        tags: json.tags || [],
                        is_active: true
                    });
                } catch (e) {
                    // Ignorar arquivos com erro
                }
            }
        }
    }
    
    console.log(`   Encontrados: ${workflows.length} workflows`);
    
    // Inserir em lotes de 500
    const batchSize = 500;
    for (let i = 0; i < workflows.length; i += batchSize) {
        const batch = workflows.slice(i, i + batchSize);
        const { error } = await supabase.from('n8n_workflows').insert(batch);
        if (error) {
            console.error(`   ❌ Erro no lote ${i}-${i+batchSize}:`, error.message);
        } else {
            console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(workflows.length/batchSize)} inserido`);
        }
    }
    
    return workflows.length;
}

// 2. Importar Prompts ChatGPT
async function importPromptsChatGPT(categories) {
    console.log('\n💬 Importando Prompts ChatGPT...');
    
    const categoryId = categories['prompts-chatgpt'];
    const filePath = path.join(DATA_DIR, 'api_prompts_membros.json');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ⚠️ Arquivo não encontrado');
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const prompts = [];
    
    for (const categoria of data) {
        const promptsBR = categoria.prompt_br || [];
        const promptsEN = categoria.prompt_eua || [];
        
        // Combinar prompts BR e EN
        const maxLen = Math.max(promptsBR.length, promptsEN.length);
        for (let i = 0; i < maxLen; i++) {
            prompts.push({
                category_id: categoryId,
                categoria_prompt: categoria.nome || categoria.categoria,
                prompt_br: promptsBR[i] || promptsEN[i] || '',
                prompt_en: promptsEN[i] || null,
                is_active: true
            });
        }
    }
    
    console.log(`   Encontrados: ${prompts.length} prompts`);
    
    // Inserir em lotes
    const batchSize = 1000;
    for (let i = 0; i < prompts.length; i += batchSize) {
        const batch = prompts.slice(i, i + batchSize);
        const { error } = await supabase.from('prompts_chatgpt').insert(batch);
        if (error) {
            console.error(`   ❌ Erro no lote ${i}-${i+batchSize}:`, error.message);
        } else {
            console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(prompts.length/batchSize)} inserido`);
        }
    }
    
    return prompts.length;
}

// 3. Importar Prompts Midjourney
async function importPromptsMidjourney(categories) {
    console.log('\n🎨 Importando Prompts Midjourney...');
    
    const categoryId = categories['prompts-midjourney'];
    const filePath = path.join(DATA_DIR, 'api_midjourney_membros.json');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ⚠️ Arquivo não encontrado');
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const prompts = [];
    
    for (const categoria of data) {
        const promptsBR = categoria.prompt_br || [];
        const promptsEN = categoria.prompt_eua || [];
        
        const maxLen = Math.max(promptsBR.length, promptsEN.length);
        for (let i = 0; i < maxLen; i++) {
            prompts.push({
                category_id: categoryId,
                categoria_prompt: categoria.nome,
                nome: categoria.nome,
                descricao: categoria.descricao,
                prompt_br: promptsBR[i] || '',
                prompt_en: promptsEN[i] || null,
                imagem_url: categoria.imagem_url,
                tipo: categoria.tipo,
                is_active: true
            });
        }
    }
    
    console.log(`   Encontrados: ${prompts.length} prompts`);
    
    const batchSize = 500;
    for (let i = 0; i < prompts.length; i += batchSize) {
        const batch = prompts.slice(i, i + batchSize);
        const { error } = await supabase.from('prompts_midjourney').insert(batch);
        if (error) {
            console.error(`   ❌ Erro:`, error.message);
        } else {
            console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1} inserido`);
        }
    }
    
    return prompts.length;
}

// 4. Importar Templates Typebot
async function importTypebot(categories) {
    console.log('\n🤖 Importando Templates Typebot...');
    
    const categoryId = categories['typebot-templates'];
    const filePath = path.join(DATA_DIR, 'api_typebot_membros.json');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ⚠️ Arquivo não encontrado');
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const templates = data.map(item => ({
        category_id: categoryId,
        nome_original: item.nome_original,
        nome_resumido: item.nome_resumido,
        descricao: item.descricao,
        link_drive: item.link_drive,
        is_active: true
    }));
    
    console.log(`   Encontrados: ${templates.length} templates`);
    
    const batchSize = 200;
    for (let i = 0; i < templates.length; i += batchSize) {
        const batch = templates.slice(i, i + batchSize);
        const { error } = await supabase.from('typebot_templates').insert(batch);
        if (error) {
            console.error(`   ❌ Erro:`, error.message);
        } else {
            console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1} inserido`);
        }
    }
    
    return templates.length;
}

// 5. Importar SaaS
async function importSaaS(categories) {
    console.log('\n⚡ Importando SaaS White Label...');
    
    const categoryId = categories['saas-whitelabel'];
    const filePath = path.join(DATA_DIR, 'api_saas_membros.json');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ⚠️ Arquivo não encontrado');
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const saas = data.map(item => ({
        category_id: categoryId,
        nome: item.nome,
        descricao: item.descricao,
        imagem_url: item.imagem_url,
        link: item.link,
        is_active: true
    }));
    
    console.log(`   Encontrados: ${saas.length} SaaS`);
    
    const { error } = await supabase.from('saas').insert(saas);
    if (error) {
        console.error(`   ❌ Erro:`, error.message);
    } else {
        console.log(`   ✅ Todos inseridos`);
    }
    
    return saas.length;
}

// 6. Importar Bônus
async function importBonus(categories) {
    console.log('\n🌟 Importando Bônus...');
    
    const categoryId = categories['bonus'];
    const filePath = path.join(DATA_DIR, 'api_bonus_membros.json');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ⚠️ Arquivo não encontrado');
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let totalItems = 0;
    
    for (const item of data) {
        // Inserir bônus principal
        const { data: bonusData, error: bonusError } = await supabase
            .from('bonus')
            .insert({
                category_id: categoryId,
                nome: item.nome,
                descricao: item.descricao,
                imagem_url: item.imagem_url,
                link: item.link,
                is_active: true
            })
            .select()
            .single();
        
        if (bonusError) {
            console.error(`   ❌ Erro ao inserir bônus ${item.nome}:`, bonusError.message);
            continue;
        }
        
        // Inserir itens do bônus
        const conteudo = item.conteudo || [];
        if (conteudo.length > 0 && bonusData) {
            const items = conteudo.map((c, idx) => ({
                bonus_id: bonusData.id,
                titulo: typeof c === 'string' ? c : c.titulo || c.nome,
                descricao: typeof c === 'object' ? c.descricao : null,
                link: typeof c === 'object' ? c.link : null,
                ordem: idx
            }));
            
            const { error: itemsError } = await supabase.from('bonus_items').insert(items);
            if (!itemsError) {
                totalItems += items.length;
            }
        }
    }
    
    console.log(`   ✅ ${data.length} bônus com ${totalItems} itens inseridos`);
    return data.length;
}

// 7. Importar Ferramentas
async function importFerramentas(categories) {
    console.log('\n🆓 Importando Ferramentas...');
    
    const categoryId = categories['ferramentas'];
    const filePath = path.join(DATA_DIR, 'api_280ferramentas_membros.json');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ⚠️ Arquivo não encontrado');
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const ferramentas = [];
    
    for (const categoria of data) {
        const conteudo = categoria.conteudo || [];
        for (const item of conteudo) {
            ferramentas.push({
                category_id: categoryId,
                categoria_ferramenta: categoria.nome,
                nome: typeof item === 'string' ? item : item.nome,
                descricao: typeof item === 'object' ? item.descricao : null,
                link: typeof item === 'object' ? item.link : null,
                is_free: true,
                is_active: true
            });
        }
    }
    
    console.log(`   Encontradas: ${ferramentas.length} ferramentas`);
    
    if (ferramentas.length > 0) {
        const { error } = await supabase.from('ferramentas').insert(ferramentas);
        if (error) {
            console.error(`   ❌ Erro:`, error.message);
        } else {
            console.log(`   ✅ Todas inseridas`);
        }
    }
    
    return ferramentas.length;
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

async function main() {
    console.log('='.repeat(60));
    console.log('IMPORTAÇÃO DE DADOS PARA O SUPABASE');
    console.log('='.repeat(60));
    
    try {
        // Obter IDs das categorias
        console.log('\n📋 Carregando categorias...');
        const categories = await getCategories();
        console.log(`   ✅ ${Object.keys(categories).length} categorias carregadas`);
        
        // Executar importações
        const results = {
            workflows: await importWorkflows(categories),
            promptsGPT: await importPromptsChatGPT(categories),
            promptsMJ: await importPromptsMidjourney(categories),
            typebot: await importTypebot(categories),
            saas: await importSaaS(categories),
            bonus: await importBonus(categories),
            ferramentas: await importFerramentas(categories)
        };
        
        // Resumo
        console.log('\n' + '='.repeat(60));
        console.log('RESUMO DA IMPORTAÇÃO');
        console.log('='.repeat(60));
        console.log(`📦 Workflows n8n:      ${results.workflows}`);
        console.log(`💬 Prompts ChatGPT:    ${results.promptsGPT}`);
        console.log(`🎨 Prompts Midjourney: ${results.promptsMJ}`);
        console.log(`🤖 Templates Typebot:  ${results.typebot}`);
        console.log(`⚡ SaaS White Label:   ${results.saas}`);
        console.log(`🌟 Bônus:              ${results.bonus}`);
        console.log(`🆓 Ferramentas:        ${results.ferramentas}`);
        console.log('-'.repeat(30));
        console.log(`TOTAL: ${Object.values(results).reduce((a, b) => a + b, 0)} itens`);
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('❌ Erro fatal:', error.message);
        process.exit(1);
    }
}

main();
