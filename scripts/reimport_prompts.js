require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function reimportPrompts() {
  console.log('============================================================')
  console.log('RE-IMPORTAÇÃO DE PROMPTS CHATGPT')
  console.log('============================================================\n')

  // Carregar dados
  const dataPath = path.join(__dirname, '..', 'Curso_Clone_Completo', 'api_prompts_membros.json')
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  
  // Processar prompts
  const prompts = []
  
  Object.values(rawData).forEach(category => {
    const categoryName = category.nome || category.categoria
    const promptList = category.prompt_br || []
    
    promptList.forEach(promptText => {
      if (promptText && promptText.trim()) {
        prompts.push({
          categoria_prompt: categoryName,
          prompt_br: promptText.trim()
        })
      }
    })
  })

  console.log(`📦 Total de prompts a importar: ${prompts.length}\n`)

  // Limpar tabela
  console.log('🗑️ Limpando tabela existente...')
  const { error: deleteError } = await supabase
    .from('prompts_chatgpt')
    .delete()
    .neq('id', 0) // Deleta todos

  if (deleteError) {
    console.error('Erro ao limpar:', deleteError)
    return
  }
  console.log('   ✅ Tabela limpa\n')

  // Inserir em lotes de 500
  console.log('📤 Inserindo prompts...')
  const batchSize = 500
  let inserted = 0
  let errors = 0

  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize)
    
    const { error } = await supabase
      .from('prompts_chatgpt')
      .insert(batch)

    if (error) {
      console.error(`   ❌ Erro no lote ${Math.floor(i/batchSize) + 1}:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
      console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1}: ${batch.length} prompts`)
    }
  }

  // Verificar contagem final
  const { count } = await supabase
    .from('prompts_chatgpt')
    .select('*', { count: 'exact', head: true })

  console.log('\n============================================================')
  console.log('RESUMO')
  console.log('============================================================')
  console.log(`✅ Inseridos: ${inserted}`)
  console.log(`❌ Erros: ${errors}`)
  console.log(`📊 Total no banco: ${count}`)
  console.log('============================================================\n')

  // Mostrar categorias
  console.log('📂 Categorias importadas:')
  const { data: cats } = await supabase
    .from('prompts_chatgpt')
    .select('categoria_prompt')
  
  const categoryCount = new Map()
  cats?.forEach(item => {
    const cat = item.categoria_prompt
    categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1)
  })

  Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count}`)
    })
}

reimportPrompts()
