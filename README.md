# `BOX://ROSHAN-01` — Roshan Reju (`@C4PTR4`) Interactive Portfolio

An interactive **Hack The Box–style cybersecurity portfolio** built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, deployed automatically to **GitHub Pages** (`https://roshanreju.github.io/`).

Visitors act as an attacker on Kali Linux targeting **`ROSHAN-01` (`10.10.11.24`)** and progress through a realistic pentest kill chain to unlock each section of the portfolio:

1. **Reconnaissance** (`nmap -sV 10.10.11.24`) → Unlocks **About & Focus Areas**
2. **Enumeration** (`gobuster dir -u http://10.10.11.24`) → Unlocks **Experience & Education** and **Projects & Tooling**
3. **Initial Foothold** (`ssh guest@10.10.11.24`) → Captures `user.txt` and unlocks **IEEE Research & Technical Write-ups**
4. **Privilege Escalation** (`sudo -l` → `sudo /usr/local/bin/roshan-vault`) → Captures `root.txt` and unlocks the **Root Vault (Certifications, Awards & Contact)**

Includes a **1-click `Auto-Pwn (Quick View)`** button for recruiters or anyone who wants instant access to every section.

## Quick Start

```bash
npm install
npm run dev
```

## Updating Your Info

All profile details, experience, education, projects, publications, certifications, awards, and box flags live in a single typed file:

- [`src/data/portfolio.ts`](src/data/portfolio.ts)

## Deploying to GitHub Pages

1. Push this repo to `roshanreju/roshanreju.github.io` (`main` branch).
2. In GitHub go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` and publishes to `https://roshanreju.github.io/`.
