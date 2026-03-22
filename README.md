# urpstudio

Local document editor for presentations and project reports. Compiles LaTeX live using XeLaTeX.

## Requirements

- Node.js 18+
- XeLaTeX (Ubuntu/Debian): `sudo apt install texlive-xetex texlive-full`
- XeLaTeX (macOS): `brew install --cask mactex`
- XeLaTeX (Windows): Install [MiKTeX](https://miktex.org/) or [TeX Live](https://tug.org/texlive/)

## Quick Start

```bash
npm run install:all
npm run dev
```

Open <http://localhost:5173>

## Frontend Environment

Frontend reads `VITE_API_BASE_URL` from `client/.env.*`.

- Local dev: keep it empty so Vite proxy handles `/api` and `/uploads`
- Production: set `VITE_API_BASE_URL=https://api.urpstudio.me`

An example file is available at `client/.env.example`.

## Deploy Frontend to GitHub Pages (urpstudio.me)

1. Push code to the main or master branch.
2. In GitHub repository settings, enable Pages and set source to GitHub Actions.
3. The workflow in `.github/workflows/deploy-pages.yml` builds `client` and deploys `client/dist`.
4. The workflow writes `CNAME=urpstudio.me` at deploy time.
5. In Pages settings, confirm custom domain is `urpstudio.me` and enable HTTPS.

## Namecheap DNS Records

Use these records for the apex domain and www on GitHub Pages.

- Type `A`, Host `@`, Value `185.199.108.153`, TTL `Automatic`
- Type `A`, Host `@`, Value `185.199.109.153`, TTL `Automatic`
- Type `A`, Host `@`, Value `185.199.110.153`, TTL `Automatic`
- Type `A`, Host `@`, Value `185.199.111.153`, TTL `Automatic`
- Type `CNAME`, Host `www`, Value `<github-username>.github.io`, TTL `Automatic`

For Render backend on `api.urpstudio.me`, add this record after Render creates your service:

- Type `CNAME`, Host `api`, Value `<your-render-service>.onrender.com`, TTL `Automatic`

## Deploy Backend to Render (api.urpstudio.me)

1. Push code to GitHub (same repository as frontend).
1. In Render, create a new Web Service from your repository.
1. Choose runtime Docker and set Dockerfile path to `Dockerfile.render`.
1. Keep plan as Free.
1. Set environment variables `NODE_ENV=production` and `PORT=3001`.
1. Deploy and wait for first build to finish.
1. Confirm backend health endpoint works: `https://<your-render-service>.onrender.com/api/health`.
1. In Render, add custom domain `api.urpstudio.me` to this service.
1. In Namecheap, add the `api` CNAME record shown above pointing to your Render host.
1. Wait for SSL to be issued by Render and confirm `https://api.urpstudio.me/api/health` works.

Render free tier sleeps on inactivity. This project includes a frontend wake flow and backend status UI so users get a clear waiting state while the service wakes.

## Deploy Backend to Oracle Cloud (api.urpstudio.me)

1. Create Ubuntu VM on Oracle Cloud Free Tier.
1. Open ingress rules for TCP ports 22, 80, and 443.
1. Install runtime dependencies:

```bash
sudo apt update
sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx texlive-xetex texlive-full
```

1. Clone project, install dependencies, and run backend:

```bash
npm run install:all
node server/index.js
```

1. Configure Nginx for `api.urpstudio.me` to proxy to `http://127.0.0.1:3001` for `/api` and `/uploads` using `deploy/nginx-api.urpstudio.me.conf` as the base template.
1. Issue TLS certificate:

```bash
sudo certbot --nginx -d api.urpstudio.me
```

1. Add a process manager (systemd or pm2) so backend restarts automatically; a systemd template is provided in `deploy/urpstudio-backend.service`.

## Usage

1. Choose Presentation or Project Report in the top nav.
2. Fill in fields in the editor panel.
3. The PDF compiles automatically after 1.5s of inactivity.
4. Download the `.tex` file with Export Source.
5. To use in Overleaf, upload `main.tex`, `file-setup.tex`, and `logo_soa.png`.

## Notes

- XeLaTeX takes around 5 to 10 seconds on first compile due to font caching.
- Subsequent compiles are usually faster.
- The backend server must be running for compilation and image upload.
