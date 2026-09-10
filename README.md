# Separate editable H & L website

This folder is an independent copy. The original website in the parent folder is not changed by editing this version.

## Try it locally

Run `npm run dev` in this folder to open the website at http://localhost:3001. In a second terminal, run `node local-editor.cjs`, then open http://localhost:3002 to edit this copy alongside a live preview. Save & preview writes only this folder's `content/site.json`. Photo uploads go only to this folder's `public/images/projects`.

The local editor is for previewing on this computer. It is not published as an editing server on GitHub Pages. Production editing uses authenticated Pages CMS.

The local `node_modules` junction shares the existing dependency installation. For a separate checkout on another computer, run `npm ci` normally.

## Publish as a separate site

1. Put the **contents of this folder** at the root of a new GitHub repository. Include hidden files `.pages.yml`, `.gitignore`, and `.github`. Do not upload `node_modules`, `.next`, `out`, or `.env.local`.
2. Configure GitHub Pages to use GitHub Actions. The included workflow builds and publishes this copy.
3. Set repository Actions variables `SITE_URL`, `GOOGLE_SHEETS_URL`, `GOOGLE_SHEET_URL`, and `NOTIFICATION_EMAIL` as described in `LAUNCH-GUIDE.md`. Use this version's actual public HTTPS URL for `SITE_URL` so uploaded photo links work.
4. Use a custom domain/subdomain or a GitHub user/organization root site. This copy, like the original, uses root URLs; a `username.github.io/repository/` subpath requires base-path configuration before deployment.
5. Open https://app.pagescms.org and install/connect its GitHub App to the **new repository only**. Open Website content. Configure the client's editor access through Pages CMS/GitHub.

Pages CMS reads `.pages.yml` from the repository root. The configuration exposes text grouped by page section, contact details, search metadata, service cards, service process, hero photo, and the gallery. Gallery items can be added, removed, and reordered. Saving content commits to GitHub; the included main-branch workflow rebuilds the public site.

No GitHub repository, editor account, or production deployment has been connected automatically. The current site remains separate.

## Forms

The original Google Sheets submission logic is retained, including the three budget ranges and custom dollar amount. Local previews use the copied local environment settings. A real form submission may send a real inquiry; automated checks do not submit leads.

## Reference

- Pages CMS configuration: https://pagescms.org/docs/configuration/
- Pages CMS quick start: https://pagescms.org/docs/quick-start/
- `original-file-hashes.json` records the original source files before this copy was made.
- `setup-copy.cjs` is the completed one-time setup script; it refuses to overwrite existing editable content.
