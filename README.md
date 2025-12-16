# BayLearn (Amplify Gen 2 + Next.js) — Production-Ready Starter

This repo is a **deployable** BayLearn starter for AWS Amplify Hosting with:
- Next.js App Router (SSR-ready)
- Amplify Gen 2 backend (Auth + Data)
- Course catalog, course viewer, learner dashboard
- Course versioning + progress tracking + certificate issuance + verification page
- AI Assistant (AWS Bedrock) for course Q&A (guardrailed)
- Stripe (optional) checkout + post-checkout verification (lightweight)

> Note: Stripe in this repo is implemented as a **starter**: it verifies checkout sessions and then enrolls the user.
> If you want strict entitlements (webhook → DB writes) we can add a hardened webhook flow with IAM → DynamoDB/AppSync admin writes.

## 1) Deploy on AWS Amplify

### A) Push to GitHub
```bash
git init
git add .
git commit -m "BayLearn Amplify starter"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### B) Create Amplify App (Hosting)
AWS Console → Amplify → Host web app → connect GitHub repo → main branch.

Amplify will build Next.js and provision the backend (Gen 2).

### C) Create Admin group membership
1) Sign up in the app
2) In Cognito User Pool → create a group named **Admin**
3) Add your user to **Admin**
4) Visit `/admin`

## 2) Local dev
Install:
```bash
npm ci
npm run dev
```

For full local backend workflows, use Amplify Gen 2 CLI via the Amplify console or your preferred CI workflow.

## 3) Key routes
- `/` Catalog
- `/course/[courseId]` Course page
- `/dashboard` Learner dashboard (auth)
- `/admin` Admin console (auth + Admin group)
- `/cert/[certId]` Certificate verification (public)

## 4) Bedrock AI
Set `AWS_REGION` and `BEDROCK_MODEL_ID` in Amplify Hosting environment variables.
AI endpoint: `POST /api/ai/ask` (server-side), used by the in-course assistant UI.

## 5) Stripe (optional)
Set:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Checkout endpoint: `POST /api/stripe/checkout`
Success handler verifies the session and enrolls the user.


## Important: Amplify Gen 2 build settings
This repo includes an `amplify.yml` that runs `npx ampx pipeline-deploy` in the **backend** phase, which is required to deploy the Gen 2 backend and generate `amplify_outputs.json` during CI/CD.
