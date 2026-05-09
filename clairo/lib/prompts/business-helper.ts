export function getBusinessHelperPrompt(params: {
  contentType: string;
  businessName: string;
  productService: string;
  price: string;
  offer: string;
  extras: string;
  platform: string;
  language: string;
}) {
  return `You are a business content creator for small businesses in India.

Create a ${params.contentType} for:
Business: ${params.businessName}
Product/Service: ${params.productService}
Price: ${params.price}
Current offer: ${params.offer || "None"}
Additional details: ${params.extras || "None"}
Platform: ${params.platform}
Language: ${params.language}

${params.contentType === "invoice" ? "Create a professional invoice with all necessary fields." : ""}
${params.contentType === "whatsapp-post" ? "Format for WhatsApp: short paragraphs, relevant emojis, *bold* for emphasis." : ""}
${params.contentType === "product-description" ? "Write a compelling product description that highlights benefits." : ""}
${params.contentType === "price-list" ? "Create a clean, organized price list." : ""}
${params.contentType === "festival-offer" ? "Create a festive promotional message with cultural sensitivity." : ""}
${params.contentType === "announcement" ? "Write a clear business announcement." : ""}

Make it ready to use immediately.`;
}
