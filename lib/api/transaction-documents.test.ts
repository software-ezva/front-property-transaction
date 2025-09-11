/**
 * Test integration for Transaction Documents API
 *
 * This file demonstrates how the new API integration works:
 *
 * 1. Frontend calls: useTransactionDocuments hook
 * 2. Hook calls: getTransactionDocuments() from /lib/api/transaction-documents.ts
 * 3. API client calls: /api/transactions/[transactionId]/documents (internal endpoint)
 * 4. Internal endpoint calls: External API v1/transactions/{id}/documents
 *
 * Data Flow:
 * Frontend -> Hook -> API Client -> Internal API -> External API
 *
 * Error Handling:
 * - UUID validation at internal API level
 * - Proper error propagation through all layers
 * - User-friendly error messages in the UI
 *
 * Type Safety:
 * - TransactionDocumentResponse for external API response
 * - Document interface for internal usage
 * - Proper type transformations (string -> enum, string -> Date)
 */

// Example API Response from External API:
const exampleApiResponse = [
  {
    documentId: "550e8400-e29b-41d4-a716-446655440000",
    title: "Purchase Agreement - 123 Main St",
    category: "Contract and Negotiation",
    status: "Pending",
    createdAt: "2024-08-29T10:30:00Z",
    updatedAt: "2024-08-29T10:30:00Z",
  },
];

// Example Transformed Data for Frontend:
const exampleTransformedData = [
  {
    documentId: "550e8400-e29b-41d4-a716-446655440000",
    title: "Purchase Agreement - 123 Main St",
    category: "Contract and Negotiation", // Enum DocumentCategory
    status: "Pending", // Enum DocumentStatus
    url: "/documents/550e8400-e29b-41d4-a716-446655440000",
    createdAt: new Date("2024-08-29T10:30:00Z"),
    updatedAt: new Date("2024-08-29T10:30:00Z"),
  },
];

export { exampleApiResponse, exampleTransformedData };
