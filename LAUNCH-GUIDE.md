# Simple launch and customer handoff guide

The site is configured for GitHub Pages with a custom domain. The production build passed. It is not published yet.

## 1. Buy the domain and set up ownership

Buy the domain for three years in the customer's account, with their contact details. Record the expiration date and enable renewal reminders. Agree who pays for renewal and future website edits. Domain registration is separate from hosting and business email.

Have the customer own the GitHub repository and Google Sheet too. They can invite you as a collaborator and share the sheet for setup without sharing passwords.

## 2. Put the project on GitHub

Use GitHub Desktop: **File > Add local repository**, select this project folder, and choose **create a repository here** if prompted. Commit the project and **Publish repository** to the customer's account. Use the `main` branch.

Use a public repository for GitHub Free. Review the upload list: include `.github/workflows/deploy-pages.yml` and `package-lock.json`; exclude `.env.local`, customer inquiry records, `node_modules`, `.next`, and `out`. The included `.gitignore` handles these exclusions.

On GitHub, open the repository's **Settings > Pages** and select **GitHub Actions** as the source.

## 3. Connect inquiries

For the private inquiry inbox, use the customer's Google account:

1. Create a Google Sheet and keep its sharing restricted.
2. Open **Extensions > Apps Script** and paste the project's `google-apps-script.gs` into the editor, replacing the starter code.
3. Under **Project Settings > Script Properties**, add `NOTIFICATION_EMAIL` with the customer's email. Otherwise the script uses its existing default recipient.
4. Run `checkNotificationSetup` and authorize the requested permissions.
5. Choose **Deploy > New deployment > Web app**. Execute as the owner and allow access to **Anyone**. Authorize and copy the URL ending in `/exec`. The submission endpoint is public; the sheet stays private.

In GitHub, open **Settings > Secrets and variables > Actions > Variables** and add:

| Name | Value |
| --- | --- |
| `SITE_URL` | `https://yourdomain.com` using your purchased domain |
| `GOOGLE_SHEETS_URL` | Apps Script URL ending in `/exec` |
| `GOOGLE_SHEET_URL` | Private Google Sheet URL |
| `NOTIFICATION_EMAIL` | Customer's email |

These settings are embedded in the public website. Never enter passwords or private API keys. Local `.env.local` settings are not uploaded.

For email-only inquiries, leave both Google variables empty and set `NOTIFICATION_EMAIL`. The website uses FormSubmit instead: activate its recipient through the verification email and test delivery. The `/admin/` inbox requires the Google setup.

## 4. Connect the domain and publish

First enter your purchased domain in **GitHub > repository > Settings > Pages > Custom domain** and save it.

At your domain provider, open DNS settings and add:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | CUSTOMER-USERNAME.github.io |

Replace `CUSTOMER-USERNAME` with the GitHub account that owns the repository, without the repository name. Replace conflicting website records for these names; preserve email records such as MX and TXT.

In **Actions > Deploy static site to GitHub Pages**, choose **Run workflow** on `main`. Wait for the deployment to turn green. Once GitHub's domain check passes and a certificate is available, enable **Enforce HTTPS** under Pages. DNS and certificate setup may take up to 24 hours. No CNAME file is needed with this Actions workflow. See [GitHub's domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

This build expects the custom domain root. The temporary `username.github.io/repository/` address will not display assets correctly; connect the domain before reviewing the live site.

## 5. Check before delivery

- Open the website on a phone and computer; check images, navigation, business details, and the call button.
- Submit one inquiry with a gallery look and another without one.
- Confirm both arrive in the customer's sheet and notification inbox. Open the selected photo link.
- Visit `https://yourdomain.com/admin/` directly and refresh. Confirm the customer can open the sheet while signed into Google.

The build has passed locally. Actual email delivery and customer account access still need these live checks.

## 6. Send this to your customer

Replace every capitalized placeholder before sending:

> Your website is live at https://YOURDOMAIN.com.
>
> Review inquiries at https://YOURDOMAIN.com/admin/ while signed into your Google account. Open the sheet and mark Contacted when you follow up. Notifications go to YOUR EMAIL.
>
> You own the domain, GitHub repository, and inquiry sheet. Your domain is paid through EXPIRATION DATE. DOMAIN PROVIDER manages the domain. Your repository is REPOSITORY LINK.
>
> NAME handles domain renewal. NAME handles future website edits under OUR AGREEMENT. Keep your account recovery information and renewal reminders current.

For email-only setup, replace the sheet paragraph with instructions to check the notification inbox.

Future code changes deploy when pushed to `main`. After changing GitHub variables, rerun the workflow. After editing Apps Script, publish a new version in Google; a website rebuild does not update the script.
