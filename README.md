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

Push your copy to GitHub, GitLab or Bitbucket first.

### 1. Create the application

In the Cloud dashboard, create an application from your repository. Or, with the [Cloud CLI](https://github.com/laravel/cloud-cli), run this from the project directory:

```sh
cloud ship --database=mysql -n
```

### 2. Configure the App cluster

Open the App cluster on the environment's canvas and set the following:

- **Size:** any Flex size. Only Flex sizes can scale to zero.
- **Scale to Zero:** on. New Flex sizes wake in under 500 ms.
- **Use Inertia SSR:** on.

Then open **Settings → Deployments**:

- **Build commands:** replace `npm run build` with `npm run build:ssr`.
- **Deploy command:** `php artisan migrate --force`

With the CLI, find the instance ID first (`cloud instance:list --json -n`), then run:

```sh
cloud instance:update <instance-id> --scale-to-zero=true --uses-inertia-ssr=true --json -n --force
```

### 3. Configure the database

The contact form needs a **Laravel MySQL** database. Choose a **Flex** size (Pro sizes are always on), attach it to the environment, and turn on **Scale to Zero** with an idle timeout of a few minutes. Cloud injects the connection details, and the app defaults to the `mysql` connection, so you don't need to set any database variables.

### 4. Environment variables

The site runs without any extra variables. Add these when you're ready:

| Variable            | Why                                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| `APP_NAME`          | Your name. Used as the email sender name                                       |
| `MAIL_MAILER`       | `resend` to send contact emails, or `log` to only store them                   |
| `RESEND_API_KEY`    | From [resend.com](https://resend.com). The Resend package is already installed |
| `MAIL_FROM_ADDRESS` | An address on a domain you've verified in Resend, e.g. `site@yourname.dev`     |

Leave `SESSION_DRIVER`, `CACHE_STORE` and `QUEUE_CONNECTION` unset. The defaults (`cookie`, `file` and `sync`) are what let the database sleep. Setting any of them to `database` means every page view wakes MySQL.

Save, then deploy.

### Why it can sleep

A MySQL Flex cluster sleeps once it has had no connections for its idle timeout. This app only opens a connection when someone submits the contact form:

- **Content** is parsed from files and cached on local disk, never in the database.
- **Sessions** are stored in an encrypted cookie. They only carry CSRF and form errors.
- **Mail** is sent during the request, so no queue worker is needed.
- **Nothing is scheduled**, so the scheduler never wakes the app.

`tests/Feature/PortfolioPagesTest.php` fails if any page runs a query, so you can't break this by accident.

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
