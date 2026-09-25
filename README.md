# Portfolio

A personal site for developers who are looking for work. Clone it, replace the
sample content with your own, and deploy it to [Laravel Cloud](https://cloud.laravel.com).

Built on Laravel 13, Inertia 3, React 19, Tailwind CSS 4 and shadcn/ui.

![Home page, light theme](.github/assets/home-light.png)

- **Content lives in files.** One YAML file holds your profile, and each project and post is a Markdown file. There's no admin panel, no database for content, and nothing extra to log into.
- **Pages:** home, work index with case studies, writing with an RSS feed, about (experience, skills, education, résumé download) and contact.
- **Contact form:** messages are saved to MySQL and emailed to you through Resend. It has a honeypot and a rate limit, and a failed email never loses a message.
- **Built for scale-to-zero.** Page views never touch the database (a test enforces this), so compute and MySQL can both sleep when nobody is visiting.
- **Server-side rendered** with Inertia SSR, so recruiters, search engines and link previews see real HTML with the right title and description.
- Light and dark themes, a sitemap, and a clock showing your local time.

---

## Run it locally

You'll need PHP 8.3+, Composer and Node 22+. Locally the site uses SQLite, so you don't need MySQL on your machine.

```sh
git clone https://github.com/you/portfolio.git && cd portfolio
composer setup      # installs dependencies, creates .env, migrates, builds assets
composer run dev    # http://localhost:8000
```

## Make it yours

Everything you'll edit is in `content/`, `public/` and one CSS file.

| File                    | What it controls                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `content/site.yaml`     | Name, role, location, time zone, email, availability, links, intro, about text, experience, skills, education |
| `content/projects/*.md` | One case study per file. The file name becomes the URL (`/work/invoice-sync`)                                 |
| `content/posts/*.md`    | One post per file. The file name becomes the URL (`/writing/my-post`)                                         |
| `public/resume.pdf`     | The résumé download. Set `resume: null` in `site.yaml` to hide the link                                       |
| `public/favicon.svg`    | Tab icon                                                                                                      |
| `resources/css/app.css` | The four colour tokens at the top: `--paper`, `--ink`, `--graphite` and `--signal` (the accent)               |
| `vite.config.ts`        | Fonts (Host Grotesk and IBM Plex Mono, served from Bunny Fonts)                                               |

### Project front matter

```yaml
---
title: Carrier invoice sync
summary: One sentence with a number in it. Shown in lists and link previews.
year: 2024
role: Lead engineer
stack: [Laravel, MySQL, SQS]
featured: true # show on the home page
order: 1 # lower comes first
image: /images/sync.png # optional, put the file in public/images
image_alt: Dashboard showing dispute counts
links:
    - label: GitHub
      url: https://github.com/you/project
---
```

### Post front matter

```yaml
---
title: What I learned moving a queue off cron
summary: Shown in lists, the RSS feed and link previews.
date: 2026-05-12
draft: true # visible locally, hidden in production
---
```

Code blocks are highlighted on the server (PHP, JS/TS, CSS, HTML, SQL, YAML and more), so no highlighting JavaScript is sent to the browser.

Changes to `content/` show up on the next page load, locally and after each deploy.

---

## Deploy to Laravel Cloud

Push your copy to GitHub, GitLab or Bitbucket first. With the [Cloud CLI](https://github.com/laravel/cloud-cli), the whole setup is five commands. Every setting can also be changed in the dashboard.

### 1. Ship it

Run this from the project directory:

```sh
cloud ship --database=mysql -n
```

This creates the application, a `production` environment and a Flex Laravel MySQL cluster, runs the migrations and deploys. The site works at this point. The next three steps make it cheap to run.

### 2. Let the app sleep and render on the server

`cloud ship` leaves Scale to Zero off and turns the scheduler on. This app has no scheduled tasks, so turn the scheduler off, and turn on Scale to Zero and Inertia SSR:

```sh
cloud instance:list --json -n   # note the App instance id
cloud instance:update <instance-id> \
  --scale-to-zero=true --scale-to-zero-timeout=5 \
  --uses-inertia-ssr=true --uses-scheduler=0 \
  --json -n --force
```

The timeout is in minutes (1–60) and the API rejects the update without it. Use `--uses-scheduler=0` rather than `=false`: `false` was ignored in CLI v0.6.1.

SSR also needs the SSR bundle, so switch the last build command from `npm run build` to `npm run build:ssr`:

```sh
cloud environment:update <environment-id> --json -n --force --build-command="$(printf 'composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader\n\nnpm ci --audit false\nnpm run build:ssr')"
```

In the dashboard, the same settings are on the App cluster (Scale to Zero, Use Inertia SSR, Scheduler) and under **Settings → Deployments** (build commands).

### 3. Let the database sleep

New MySQL Flex clusters are created with scale-to-zero **off** (`suspend_seconds: 0`). Turn it on with an idle timeout in seconds (60–3600):

```sh
cloud database-cluster:list --json -n   # note the cluster id
cloud database-cluster:update <cluster-id> --suspend-seconds=300 --json -n --force
```

The CLI help labels `--suspend-seconds` as Neon-only, but Laravel MySQL accepts it too. Wait until `cloud database-cluster:get <cluster-id> --json -n` shows `"status": "available"` before deploying. A deploy that starts while the cluster is still updating fails with _"The attached database is not available."_

### 4. Deploy

```sh
cloud deploy <app-name> production --no-wait --json -n
cloud deployment:get <deployment-id> --json -n   # repeat until deployment.succeeded
```

### 5. Environment variables (optional)

The site runs without any. Add these when you want contact emails:

| Variable            | Why                                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| `APP_NAME`          | Your name. Used as the email sender name                                       |
| `MAIL_MAILER`       | `resend` to send contact emails. Default `log` only stores them                |
| `RESEND_API_KEY`    | From [resend.com](https://resend.com). The Resend package is already installed |
| `MAIL_FROM_ADDRESS` | An address on a domain you've verified in Resend, e.g. `site@yourname.dev`     |

Don't set `SESSION_DRIVER` or `QUEUE_CONNECTION` to `database`.

### Why it can sleep

A MySQL Flex cluster sleeps once it has had no connections for its idle timeout. This app only opens a connection when someone submits the contact form:

- **Content** is parsed from files and cached on local disk. The content cache is pinned to the `file` store in code, so it stays off the database even though Cloud injects `CACHE_STORE=database` when a database is attached.
- **The default cache** (Cloud's `database` store) is used only by the contact form's rate limiter, which runs on POST.
- **Sessions** are stored in an encrypted cookie (Cloud injects `SESSION_DRIVER=cookie` too). They only carry CSRF and form errors.
- **Mail** is sent during the request, so no queue worker is needed.
- **Nothing is scheduled**, so nothing wakes the app or the database on a timer.

`tests/Feature/PortfolioPagesTest.php` fails if any page runs a query, so you can't break this by accident.

**Verified on Cloud (September 2026):**

- **Wake cost:** after 9 idle minutes, the first query took 315 ms; a fresh connection straight afterwards took 9 ms.
- **Page traffic:** after 180 page requests over 7 minutes, covering every page, the feed and the sitemap, the next query still took 236 ms. The database had slept through all of it.

---

## Reading messages

Every message is emailed to the address in `site.yaml`, with Reply-To set to the sender. They're also stored in the database. To read the latest, run this in the environment's **Commands** tab on Cloud, or locally:

```sh
php artisan contact:messages --limit=20
```

## Development

```sh
composer test        # lint, PHPStan and Pest
npm run check        # Oxlint and format check
npm run types:check  # TypeScript
```

The tests read fixture content from `tests/Fixtures/content`, so editing your own content never breaks them.

The project ships with [Laravel Boost](https://laravel.com/docs/boost). Run `php artisan boost:install` to give your AI agent the project's guidelines, skills and MCP tools.

## Structure

```
app/Content/Portfolio.php      reads and caches everything in content/
app/Http/Controllers/          one small controller per page
content/                       your site
resources/css/app.css          design tokens and prose styles
resources/js/components/       layout pieces (section, project list, header, footer)
resources/js/components/ui/    shadcn/ui primitives
resources/js/pages/            one file per page
```

## License

MIT. Remove the sample content (Ines Varga is not a real person) before you publish.
