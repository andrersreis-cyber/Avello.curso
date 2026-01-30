require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const REPOS_DIR = path.join(__dirname, '..', 'Curso_Clone_Completo')

// Carregar todos os arquivos JSON
function loadAllJsonFiles() {
  const files = []
  const repoDirs = ['n8n_wassupjay', 'n8n_zie619', 'n8n_awesome']
  
  for (const repoDir of repoDirs) {
    const repoPath = path.join(REPOS_DIR, repoDir)
    if (!fs.existsSync(repoPath)) continue
    scanDir(repoPath, files)
  }
  
  return files
}

function scanDir(dir, files) {
  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      scanDir(fullPath, files)
    } else if (item.endsWith('.json') && !item.startsWith('README')) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
        if (content.nodes && Array.isArray(content.nodes)) {
          files.push({
            path: fullPath,
            name: content.name || path.basename(item, '.json'),
            content: content
          })
        }
      } catch (e) {
        // Ignorar JSONs inválidos
      }
    }
  }
}

// Normalizar nome para comparação
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

async function updateAllWorkflows() {
  console.log('============================================================')
  console.log('ATUALIZAÇÃO COMPLETA DE WORKFLOWS')
  console.log('============================================================\n')

  // Carregar todos os JSONs
  console.log('📁 Carregando arquivos JSON...')
  const jsonFiles = loadAllJsonFiles()
  console.log(`   ${jsonFiles.length} workflows encontrados nos repositórios\n`)

  // Criar mapa por nome normalizado
  const jsonMap = new Map()
  for (const file of jsonFiles) {
    const key = normalize(file.name)
    if (!jsonMap.has(key)) {
      jsonMap.set(key, file)
    }
  }

  // Buscar workflows do banco (paginando)
  console.log('📦 Buscando workflows do banco...')
  let allWorkflows = []
  let page = 0
  const pageSize = 1000
  
  while (true) {
    const { data, error } = await supabase
      .from('n8n_workflows')
      .select('id, nome, arquivo_json')
      .range(page * pageSize, (page + 1) * pageSize - 1)
    
    if (error) {
      console.error('Erro:', error)
      break
    }
    
    if (!data || data.length === 0) break
    allWorkflows = allWorkflows.concat(data)
    page++
  }
  
  console.log(`   ${allWorkflows.length} workflows no banco\n`)

  // Filtrar apenas os que não têm JSON
  const workflowsWithoutJson = allWorkflows.filter(w => !w.arquivo_json)
  console.log(`   ${workflowsWithoutJson.length} sem JSON\n`)

  // Atualizar
  let updated = 0
  let notFound = 0

  for (const workflow of workflowsWithoutJson) {
    const normalizedName = normalize(workflow.nome)
    
    // Busca exata
    let match = jsonMap.get(normalizedName)
    
    // Busca por substring
    if (!match) {
      for (const [key, value] of jsonMap.entries()) {
        if (key.includes(normalizedName) || normalizedName.includes(key)) {
          match = value
          break
        }
      }
    }
    
    if (match) {
      const { error } = await supabase
        .from('n8n_workflows')
        .update({ arquivo_json: match.content })
        .eq('id', workflow.id)
      
      if (!error) {
        updated++
        if (updated % 50 === 0) {
          console.log(`   ✅ ${updated} atualizados...`)
        }
      }
    } else {
      notFound++
    }
  }

  console.log('\n============================================================')
  console.log('RESUMO')
  console.log('============================================================')
  console.log(`✅ Atualizados: ${updated}`)
  console.log(`⚠️ Não encontrados: ${notFound}`)
  console.log(`📊 Total com JSON: ${allWorkflows.length - workflowsWithoutJson.length + updated}`)
  console.log('============================================================\n')
}

updateAllWorkflows()
