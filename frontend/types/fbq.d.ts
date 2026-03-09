interface Window {
  fbq: (
    action: string,
    eventName: string,
    params?: {
      content_name?: string
      content_category?: string
      content_ids?: string[]
      content_type?: string
      value?: number
      currency?: string
      predicted_ltv?: number
      num_items?: number
      search_string?: string
      status?: boolean
      [key: string]: any
    }
  ) => void
  avelloPixel: {
    cadastro: () => void
    purchase: (plano?: string, valor?: number) => void
  }
}
