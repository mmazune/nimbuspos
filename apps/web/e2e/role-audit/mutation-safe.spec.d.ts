/**
 * Mutation-Safe Micro-Suite - M27
 *
 * Exercises mutation-risk controls safely without corrupting demo orgs.
 * Creates drafts only - does NOT finalize, submit, or approve anything.
 *
 * Safe Actions:
 *   - Create draft purchase order (do not submit)
 *   - Create draft stock transfer (do not finalize)
 *   - Create draft waste entry (do not post)
 *   - Navigate to create forms (verify form renders)
 *
 * Prohibited:
 *   - finalize, submit, approve, charge, refund
 *   - close period, close shift, delete/void
 *
 * Outputs:
 *   apps/web/audit-results/mutation-safe/MUTATION_SAFE_SUITE.v1.json
 *   apps/web/audit-results/mutation-safe/MUTATION_SAFE_SUITE.v1.md
 */
export {};
//# sourceMappingURL=mutation-safe.spec.d.ts.map