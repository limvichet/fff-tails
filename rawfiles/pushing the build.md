1. Modify .gitignore:
Open your .gitignore file and remove or comment out the line that says .output.

2. Use a local .env file (Easiest)
NUXT_PUBLIC_API_BASE=https://apiloan.cdcf.info
NUXT_PUBLIC_SITE_URL=https://chhoukroit.pages.dev

3. Generate your site:
> npx nuxi generate

4. Push to GitHub:
> git add -f .output/public
> git commit -m "Deploying static files"
> git push

5. Connect Cloudflare to that specific folder:
When you connect GitHub to Cloudflare Pages:
- Set Build Command to: `(leave empty)`
- Set Build Output Directory to: `.output/public`