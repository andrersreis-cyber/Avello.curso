require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const REPOS_DIR = path.join(__dirname, '..', 'Curso_Clone_Completo')

async function updateWorkflowsWithJson() {
  console.log('============================================================')
  console.log('ATUALIZAÇÃO DE WORKFLOWS COM JSON COMPLETO')
  console.log('============================================================\n')

  // Buscar todos os workflows sem JSON
  const { data: workflows, error } = await supabase
    .from('n8n_workflows')
    .select('id, nome')
  
  if (error) {
    console.error('Erro ao buscar workflows:', error)
    return
  }

  console.log(`📦 ${workflows.length} workflows encontrados\n`)

  // Mapear arquivos JSON por nome
  const jsonFiles = new Map()
  
  // Procurar em todos os diretórios de repos
  const repoDirs = ['n8n_wassupjay', 'n8n_zie619', 'n8n_awesome']
  
  for (const repoDir of repoDirs) {
    const repoPath = path.join(REPOS_DIR, repoDir)
    if (!fs.existsSync(repoPath)) continue
    
    scanDirectory(repoPath, jsonFiles)
  }

  console.log(`📁 ${jsonFiles.size} arquivos JSON mapeados\n`)

  // Atualizar workflows
  let updated = 0
  let notFound = 0
  let errors = 0

  for (const workflow of workflows) {
    // Tentar encontrar o JSON pelo nome
    const possibleNames = [
      workflow.nome,
      workflow.nome.toLowerCase(),
      workflow.nome.replace(/\s+/g, '_').toLowerCase(),
      workflow.nome.replace(/\s+/g, '-').toLowerCase(),
      workflow.nome.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
    ]

    let jsonContent = null
    let matchedFile = null

    for (const name of possibleNames) {
      if (jsonFiles.has(name)) {
        matchedFile = jsonFiles.get(name)
        break
      }
    }

    // Busca mais flexível
    if (!matchedFile) {
      const searchName = workflow.nome.toLowerCase().replace(/[^a-z0-9]/g, '')
      for (const [key, value] of jsonFiles.entries()) {
        const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (keyClean.includes(searchName) || searchName.includes(keyClean)) {
          matchedFile = value
          break
        }
      }
    }

    if (matchedFile) {
      try {
        const content = fs.readFileSync(matchedFile, 'utf-8')
        jsonContent = JSON.parse(content)
        
        const { error: updateError } = await supabase
          .from('n8n_workflows')
          .update({ arquivo_json: jsonContent })
          .eq('id', workflow.id)
        
        if (updateError) {
          console.error(`❌ Erro ao atualizar ${workflow.nome}:`, updateError.message)
          errors++
        } else {
          updated++
          if (updated % 100 === 0) {
            console.log(`✅ ${updated} workflows atualizados...`)
          }
        }
      } catch (e) {
        console.error(`❌ Erro ao ler ${matchedFile}:`, e.message)
        errors++
      }
    } else {
      notFound++
    }
  }

  console.log('\n============================================================')
  console.log('RESUMO DA ATUALIZAÇÃO')
  console.log('============================================================')
  console.log(`✅ Atualizados: ${updated}`)
  console.log(`⚠️ Não encontrados: ${notFound}`)
  console.log(`❌ Erros: ${errors}`)
  console.log('============================================================\n')
}

function scanDirectory(dir, map) {
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, map)
    } else if (item.endsWith('.json')) {
      // Usar o nome do arquivo sem extensão como chave
      const name = path.basename(item, '.json')
      map.set(name, fullPath)
      map.set(name.toLowerCase(), fullPath)
      map.set(name.replace(/_/g, ' '), fullPath)
      map.set(name.replace(/-/g, ' '), fullPath)
    }
  }
}

updateWorkflowsWithJson()
