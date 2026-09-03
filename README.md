# Unifeed Frontend

This is the frontend of **Unifeed**, a social networking application built with React.

The main purpose of this repository is not only to contain the React application, but also to show how I took the application from a local development environment and deployed it to AWS.

The frontend is hosted on **Amazon S3 Static Website Hosting**, and I set up **GitHub Actions + AWS OIDC** so that every push to the `main` branch automatically builds and deploys the latest version.

---

## What I Built

The frontend was developed locally first and then deployed to AWS.

The deployment flow is:

```text
React + Vite Application
          │
          ▼
      npm install
          │
          ▼
     npm run build
          │
          ▼
       dist/
          │
          ▼
     Amazon S3
          │
          ▼
    Live Website
```

After setting up CI/CD, the deployment became:

```text
Developer
    │
    │ git push origin main
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Checkout code
    ├── Setup Node.js
    ├── Install dependencies
    ├── Create .env
    ├── Build React application
    │
    ▼
GitHub OIDC
    │
    ▼
AWS IAM Role
    │
    ▼
Amazon S3
    │
    ▼
Updated Website
```

---

## Tech Stack

### Application

* React.js
* Vite
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios
* Socket.IO Client

### AWS

* Amazon S3
* AWS IAM
* GitHub OIDC

### CI/CD

* GitHub Actions
* npm
* Git
* GitHub

---

# 1. Running the Frontend Locally

Before deploying anything, I first made sure the React application was working correctly on my local machine.

### Clone the repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY>
```

Move into the project:

```bash
cd unifeed
```

### Install dependencies

```bash
npm install
```

This installs all the packages required by the React application from `package.json`.

For the CI/CD pipeline, I use:

```bash
npm ci
```

`npm ci` is preferred in the deployment environment because it installs the exact dependency versions recorded in `package-lock.json`, making the build more predictable.

---

# 2. Environment Variables

The frontend needs environment variables for things such as the backend API URL and Firebase configuration.

For local development, I use a `.env` file:

```env
VITE_API_URL=your_backend_api_url

VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
VITE_FIREBASE_MEASUREMENT_ID=your_value
```

The `.env` file is **not committed to GitHub**.

Instead, these values are stored as **GitHub Secrets** and the CI/CD workflow creates the `.env` file during the build.

---

# 3. Create the Production Build

Once the application works locally, I create the production build:

```bash
npm run build
```

Vite creates a `dist/` directory containing the optimized production files.

For example:

```text
dist/
├── assets/
├── index.html
└── ...
```

These are the files that actually need to be uploaded to S3.

The development source code itself is not what I deploy to S3.

---

# 4. Creating the S3 Bucket

I created an S3 bucket specifically for the Unifeed frontend:

```text
unifeed-social-networking
```

The reason for using S3 here is that the frontend is a static React application after the production build.

There is no need to run Node.js on the frontend server.

The S3 bucket stores and serves the generated HTML, CSS, JavaScript, and other static assets.

---

# 5. Configure S3 Static Website Hosting

After creating the bucket, I enabled **Static Website Hosting**.

The index document is:

```text
index.html
```

I also configured the error document as:

```text
index.html
```

The reason for this is React Router.

If a user directly opens a frontend route such as:

```text
/some-route
```

S3 needs to return `index.html` so that React Router can handle the route on the client side.

The S3 website endpoint is:

```text
http://unifeed-social-networking.s3-website.ap-south-1.amazonaws.com/
```

---

# 6. Manually Testing the Deployment

Before creating CI/CD, I tested the deployment manually.

After creating the production build:

```bash
npm run build
```

I can upload the generated files using:

```bash
aws s3 sync dist/ s3://unifeed-social-networking
```

### What does this command do?

```bash
aws s3 sync dist/ s3://unifeed-social-networking
```

It synchronizes the contents of the local `dist/` directory with the S3 bucket.

So instead of manually uploading every file, AWS CLI handles the upload.

I later use the same idea in GitHub Actions.

---

# 7. Why I Did Not Store AWS Access Keys in GitHub

For CI/CD, GitHub needs permission to upload the frontend to S3.

One option would be to create an IAM user and store:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

in GitHub.

I did **not** use that approach.

Instead, I used:

```text
GitHub Actions
      ↓
GitHub OIDC
      ↓
AWS IAM Role
      ↓
Temporary AWS Credentials
      ↓
S3
```

This avoids keeping long-lived AWS access keys in GitHub.

---

# 8. Configure GitHub OIDC

I configured GitHub as an **OIDC identity provider** in AWS IAM.

The GitHub OIDC provider is:

```text
https://token.actions.githubusercontent.com
```

The audience is:

```text
sts.amazonaws.com
```

I then created an IAM role that GitHub Actions can assume.

The trust policy restricts which GitHub repository and branch are allowed to assume the role.

Conceptually, the trust policy says:

```text
Who can assume this IAM role?

        ↓

This GitHub repository

        ↓

From this branch

        ↓

main
```

This is important because I don't want any random GitHub repository to obtain AWS permissions through the role.

---

# 9. GitHub Actions Permissions

The workflow contains:

```yaml
permissions:
  id-token: write
  contents: read
```

### `contents: read`

Allows the GitHub Actions runner to read the repository and check out the code.

### `id-token: write`

Allows GitHub Actions to request an OIDC token.

That token is then used with AWS IAM to assume the configured role.

---

# 10. GitHub Actions CI/CD

The workflow runs whenever code is pushed to the `main` branch.

```yaml
on:
  push:
    branches:
      - main
```

So instead of manually running the deployment commands every time, I can simply do:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

GitHub Actions then handles the deployment.

---

# 11. CI/CD Workflow

My frontend workflow follows these steps:

```text
Push to main
     ↓
Checkout repository
     ↓
Setup Node.js
     ↓
npm ci
     ↓
Create .env
     ↓
npm run build
     ↓
Authenticate with AWS using OIDC
     ↓
Assume IAM Role
     ↓
aws s3 sync
     ↓
Updated S3 Website
```

---

# 12. GitHub Actions Workflow

The actual workflow is:

```yaml
name: Deploy React Frontend to S3

on:
  push:
    branches:
      - main

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:

      # Get the source code from GitHub
      - name: Checkout code
        uses: actions/checkout@v4

      # Install Node.js on the GitHub runner
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      # Install dependencies using package-lock.json
      - name: Install dependencies
        run: npm ci

      # Create environment file from GitHub Secrets
      - name: Create .env
        run: |
          echo "VITE_FIREBASE_API_KEY=${{ secrets.VITE_FIREBASE_API_KEY }}" >> .env
          echo "VITE_FIREBASE_AUTH_DOMAIN=${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}" >> .env
          echo "VITE_FIREBASE_PROJECT_ID=${{ secrets.VITE_FIREBASE_PROJECT_ID }}" >> .env
          echo "VITE_FIREBASE_STORAGE_BUCKET=${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}" >> .env
          echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}" >> .env
          echo "VITE_FIREBASE_APP_ID=${{ secrets.VITE_FIREBASE_APP_ID }}" >> .env
          echo "VITE_FIREBASE_MEASUREMENT_ID=${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}" >> .env
          echo "VITE_API_URL=${{ secrets.VITE_API_URL }}" >> .env

      # Create the production build
      - name: Build React application
        run: npm run build

      # Authenticate with AWS using GitHub OIDC
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ap-south-1

      # Upload the production build to S3
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://unifeed-social-networking --delete
```

This workflow is based on the deployment process documented in my project notes.

---

# 13. Why `--delete` Is Used

The deployment command is:

```bash
aws s3 sync dist/ s3://unifeed-social-networking --delete
```

The `--delete` option removes files from S3 that no longer exist in the current `dist/` directory.

For example:

```text
Old build:
dist/
├── index.html
├── old-file.js
└── app.js

New build:
dist/
├── index.html
└── app.js
```

Without `--delete`, `old-file.js` could remain in S3.

With:

```bash
--delete
```

the S3 bucket is kept synchronized with the current production build.

---

# 14. Why Environment Variables Are Created During CI/CD

The `.env` file is not stored in the repository.

Instead:

```text
GitHub Secrets
      ↓
GitHub Actions
      ↓
Creates .env
      ↓
npm run build
      ↓
dist/
```

This allows the build to use the required configuration without committing the `.env` file to GitHub.

The GitHub Actions workflow creates the environment variables before running the production build.

---

# 15. Final Deployment Architecture

The final frontend deployment looks like this:

```text
                     Developer
                         │
                         │ git push
                         ▼
                  GitHub Repository
                         │
                         ▼
                  GitHub Actions
                         │
              ┌──────────┴──────────┐
              │                     │
          npm ci                Create .env
              │                     │
              └──────────┬──────────┘
                         ▼
                   npm run build
                         │
                         ▼
                       dist/
                         │
                         ▼
                  GitHub OIDC Token
                         │
                         ▼
                     AWS IAM
                    IAM Role
                         │
                         ▼
                  Amazon S3 Bucket
                         │
                         ▼
                  React Website
```

---

# 16. What I Learned From This Deployment

Through this deployment I worked with:

* Creating and configuring an S3 bucket
* S3 Static Website Hosting
* AWS IAM roles and permissions
* GitHub OIDC authentication
* GitHub Actions
* CI/CD pipelines
* AWS CLI
* Environment variables and GitHub Secrets
* Production builds with Vite
* Deploying static applications to AWS
* Understanding how GitHub Actions securely authenticates with AWS

The main goal was to move from:

```text
Build manually
     ↓
Upload manually
```

to:

```text
git push
   ↓
GitHub Actions
   ↓
Build
   ↓
Authenticate with AWS
   ↓
Deploy to S3
```

That is the deployment workflow I use for the Unifeed frontend.

---

## Live Application

**Unifeed:**
http://unifeed-social-networking.s3-website.ap-south-1.amazonaws.com/

## Repository

**GitHub:**
<YOUR_FRONTEND_GITHUB_REPOSITORY>

---

## Author

**Himanshu Pagare**

```

This version is much more **human/project-log style**. It explains *what you actually did and why*, rather than just saying “AWS S3, IAM, GitHub Actions.”

One important thing: I intentionally **didn't put Terraform into this frontend README**, because your actual frontend deployment process documented here was done through the AWS console/CLI and GitHub Actions. If you used Terraform to create specific resources for Unifeed, we can add a separate **“Infrastructure Provisioning with Terraform”** section based on your actual Terraform files.
```
