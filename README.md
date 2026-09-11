# H & L Holiday Lighting — main website

This repository runs your main website. Changes saved in Pages CMS automatically update it after GitHub finishes publishing.

**View your website:** https://kkonnerharris.github.io/h-and-l-holiday-lighting-editable/

**Edit your website:** https://app.pagescms.org — select `h-and-l-holiday-lighting-editable`.

The word `editable` is just part of the repository name. This is the live website to use. Save changes in Pages CMS, wait for publishing to finish, and refresh the website.

## Edit in Pages CMS

## Lead email delivery

The live form saves inquiries to Sheets, then sends a lead alert to the configured `NOTIFICATION_EMAIL` through FormSubmit unless Apps Script explicitly returns `notificationSent: true`. This supports older Sheets scripts that only save rows. Activate FormSubmit using the email sent to the notification recipient before relying on delivery. A saved lead is retained if the email service fails; the customer is asked to call to confirm instead of resubmitting the same lead.

The included Apps Script returns `notificationSent: true` after sending its own email. If you deploy that script later, the website skips the second email automatically. Updating the file in GitHub alone does not redeploy Google Apps Script.

## Edit in Pages CMS

Open https://app.pagescms.org and select `kkonnerharris/h-and-l-holiday-lighting-editable`.

- **Home page**: edit the headline, introduction, main photo, optional photo description, and button text.
- **Gallery photos**: expand one photo, select or upload its replacement, optionally add a description, then save. Add, remove, and reorder photos in this section.
- **Contact details**: one phone number and a Facebook link.
- **Advanced**: less frequent changes to other page text, services, and search settings.

Saving publishes to the main website through GitHub Actions. To replace a photo, select or upload its replacement in the Home page or Gallery photos editor, then save. Uploading a photo to the library alone does not change the displayed photo.

## Local website preview

Run `npm run dev` in this folder to open the website at http://localhost:3001. Use the actual Pages CMS editor for editing; the earlier local editor prototype has been retired.

The local editor is for previewing on this computer. It is not published as an editing server on GitHub Pages. Production editing uses authenticated Pages CMS.

The local `node_modules` junction shares the existing dependency installation. For a separate checkout on another computer, run `npm ci` normally.

## Developer reference: setting up a new client repository

1. Put the **contents of this folder** at the root of a new GitHub repository. Include hidden files `.pages.yml`, `.gitignore`, and `.github`. Do not upload `node_modules`, `.next`, `out`, or `.env.local`.
2. Configure GitHub Pages to use GitHub Actions. The included workflow builds and publishes this copy.
3. Set repository Actions variables `SITE_URL`, `GOOGLE_SHEETS_URL`, `GOOGLE_SHEET_URL`, and `NOTIFICATION_EMAIL` as described in `LAUNCH-GUIDE.md`. Use this version's actual public HTTPS URL for `SITE_URL` so uploaded photo links work.
4. Use a custom domain/subdomain or a GitHub user/organization root site. This copy, like the original, uses root URLs; a `username.github.io/repository/` subpath requires base-path configuration before deployment.
5. Open https://app.pagescms.org and install/connect its GitHub App to the **new repository only**. Open Website content. Configure the client's editor access through Pages CMS/GitHub.

Pages CMS reads `.pages.yml` from the repository root. The configuration exposes text grouped by page section, contact details, search metadata, service cards, service process, hero photo, and the gallery. Gallery items can be added, removed, and reordered. Saving content commits to GitHub; the included main-branch workflow rebuilds the public site.

This repository is already published through GitHub Pages, and Pages CMS saves are connected. No custom domain is configured yet. The setup steps above are only needed when handing off to a new repository. For a custom domain on this repository, configure the domain and DNS, set `SITE_URL` to its HTTPS URL, clear `BASE_PATH`, and rebuild.

## Forms

The original Google Sheets submission logic is retained, including the three budget ranges and custom dollar amount. Local previews use the copied local environment settings. A real form submission may send a real inquiry; automated checks do not submit leads.

## Reference

- Pages CMS configuration: https://pagescms.org/docs/configuration/
- Pages CMS quick start: https://pagescms.org/docs/quick-start/
- `original-file-hashes.json` records the original source files before this copy was made.
- `setup-copy.cjs` is the completed one-time setup script; it refuses to overwrite existing editable content.
