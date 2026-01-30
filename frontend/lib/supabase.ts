import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug log
console.log('Supabase config:', { url: supabaseUrl, hasKey: !!supabaseAnonKey })

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos das tabelas
export type Category = {
  id: string
  nome: string
  slug: string
  descricao: string
  icone: string
  ordem: number
  ativo: boolean
}

export type N8nWorkflow = {
  id: string
  category_id: string
  nome: string
  descricao: string
  arquivo_json: object
  tags: string[]
  origem: string
  created_at: string
}

export type PromptChatGPT = {
  id: string
  category_id: string
  titulo: string
  prompt_pt: string
  prompt_en: string
  categoria_original: string
  created_at: string
}

export type PromptMidjourney = {
  id: string
  category_id: string
  titulo: string
  prompt: string
  categoria_original: string
  created_at: string
}

export type TypebotTemplate = {
  id: string
  category_id: string
  nome: string
  descricao: string
  arquivo_json: object
  imagem_url: string
  created_at: string
}

export type Saas = {
  id: string
  category_id: string
  nome: string
  descricao: string
  url: string
  imagem_url: string
  tags: string[]
  created_at: string
}

export type Bonus = {
  id: string
  category_id: string
  nome: string
  descricao: string
  created_at: string
}

export type BonusItem = {
  id: string
  bonus_id: string
  titulo: string
  descricao: string
  url: string
  tipo: string
}

export type Ferramenta = {
  id: string
  category_id: string
  nome: string
  descricao: string
  url: string
  categoria_original: string
  gratuita: boolean
  created_at: string
}
