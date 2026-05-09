export function getReceiptScannerPrompt(params: {
  category: string;
  outputFormat: string;
}) {
  return `You are an expert receipt and expense analyzer.

Carefully analyze ALL receipt images provided.
Category hint: ${params.category === "auto" ? "Detect category automatically" : params.category}
Output format: ${params.outputFormat}

For each receipt, extract:
- Vendor/store name
- Date
- Individual items with prices
- Subtotal, tax/GST amount, total
- Payment method if visible

Then provide:
${params.outputFormat === "summary" ? "A summary report with total spending by category" : ""}
${params.outputFormat === "itemized" ? "A detailed itemized list of all items across all receipts" : ""}
${params.outputFormat === "gst" ? "A GST-ready format with GSTIN, taxable amount, CGST, SGST, IGST columns" : ""}

Format the output clearly with headers and tables.
If any value is unclear, mark it with [?].`;
}
