# Customer account setup

The public site is a static Next.js export. The account UI is available without backend configuration as an explicit questionnaire preview. Real authentication is intentionally disabled until a dedicated Supabase shop project has been configured; do not reuse the academy production project without an access-control review.

1. Create a dedicated Supabase project. Enable email/password authentication and email confirmation. Set Site URL to https://multum.online/ and allow https://multum.online/ as an auth redirect. Configure transactional email and rate limits.
2. Review privacy and retention requirements, publish a privacy notice, and enable the signup flow only after that review.
3. Apply shop-purchases.sql in the dedicated project. RLS restricts reads to the signed-in customer; there is no client insert/update/delete privilege.
4. Set url and publishableKey in app/data/account-config.json using the public project URL and sb_publishable_ key only. Never put a service role or secret key in the repository.
5. Commit and deploy. Test signup with email confirmation, login, password recovery, signout, profile editing, own purchase reads and denial of cross-user purchase reads.
6. The current basket stays in browser localStorage as it did before; it is not cross-device or per-account synchronized. The account displays both ordinary and custom baskets. No purchases are inferred from cart items. A verified payment integration or trusted administrator must write purchase records.
7. Questionnaire drafts are stored in sessionStorage until registration. On registration, answers are saved in user_metadata for profile display and recommendations only, never for access-control decisions. No password is stored in draft. Recommendations are deterministic, not a generative AI model. Remove customer profile data through the appropriate authenticated account deletion process.
