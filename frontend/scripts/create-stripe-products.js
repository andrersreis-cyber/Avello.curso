/**
 * Script para criar produtos no Stripe
 * Executar apenas uma vez: node scripts/create-stripe-products.js
 */

require('dotenv').config({ path: './.env.local' })

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const products = [
  {
    id: 'acesso_anual',
    name: 'Acesso Anual',
    description: 'Acesso completo ao sistema por 12 meses. Todos os templates, prompts, ferramentas e bônus inclusos.',
    price: 3900, // R$ 39,00
    type: 'recurring',
    interval: 'year'
  },
  {
    id: 'consultoria',
    name: 'Consultoria 1h',
    description: 'Sessão individual de 1 hora para tirar dúvidas, revisar automações ou receber orientação personalizada.',
    price: 29700, // R$ 297,00
    type: 'one_time'
  },
  {
    id: 'setup_n8n',
    name: 'Setup n8n Completo',
    description: 'Instalação e configuração completa do n8n no seu servidor com SSL, backup e monitoramento.',
    price: 49700, // R$ 497,00
    type: 'one_time'
  },
  {
    id: 'pack_premium',
    name: 'Pack Templates Premium',
    description: 'Coleção exclusiva de templates avançados não disponíveis no plano padrão.',
    price: 9700, // R$ 97,00
    type: 'one_time'
  },
  {
    id: 'acesso_vitalicio',
    name: 'Acesso Vitalício Premium',
    description: 'Acesso permanente ao sistema com todas as atualizações futuras incluídas para sempre.',
    price: 99700, // R$ 997,00
    type: 'one_time'
  },
  {
    id: 'mentoria_mensal',
    name: 'Mentoria Mensal',
    description: 'Acompanhamento mensal com reuniões semanais e suporte contínuo para seus projetos.',
    price: 19700, // R$ 197,00
    type: 'recurring',
    interval: 'month'
  }
]

async function createProducts() {
  console.log('🚀 Criando produtos no Stripe...\n')
  
  const createdProducts = {}
  
  for (const product of products) {
    try {
      // Cria o produto
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          internal_id: product.id
        }
      })
      
      console.log(`✅ Produto criado: ${product.name}`)
      console.log(`   Product ID: ${stripeProduct.id}`)
      
      // Cria o preço
      const priceData = {
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'brl',
      }
      
      if (product.type === 'recurring') {
        priceData.recurring = {
          interval: product.interval
        }
      }
      
      const stripePrice = await stripe.prices.create(priceData)
      
      console.log(`   Price ID: ${stripePrice.id}`)
      console.log('')
      
      createdProducts[product.id] = {
        productId: stripeProduct.id,
        priceId: stripePrice.id
      }
      
    } catch (error) {
      console.error(`❌ Erro ao criar ${product.name}:`, error.message)
    }
  }
  
  console.log('\n========================================')
  console.log('📋 IDs para usar no código:\n')
  console.log('export const STRIPE_PRICE_IDS = {')
  for (const [key, value] of Object.entries(createdProducts)) {
    console.log(`  ${key}: '${value.priceId}',`)
  }
  console.log('}')
  console.log('\n========================================')
  
  return createdProducts
}

createProducts()
  .then(() => {
    console.log('\n✅ Produtos criados com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error)
    process.exit(1)
  })
