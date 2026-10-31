# Ever Warm Northampton — HTML/CSS readability update

Source: branch archive `Northampton-insulate-everwarm-site-build.zip` supplied for this task.

## Scope

This update is **formatting only**. It is not a redesign or SEO rewrite.

- Indented and spaced all eight HTML pages, separating page sections, navigation links, metadata, and many nested elements onto readable lines.
- Expanded the compressed stylesheet into readable selector blocks, one declaration per line, with consistent 2-space indentation and spacing between CSS rules.
- Formatted inline JSON-LD for readability without changing its parsed data.
- Preserved the original visual design and behavior *in the source code*: no CSS rules, values, selectors, or order were intentionally changed.
- Did **not** edit JavaScript, media assets, domain settings, URLs, headings, paragraphs, navigation destinations, form logic, or sitemap files.

## Checks completed

1. The parsed HTML element/attribute sequences for all eight pages match the originals.
2. Every H1–H6, title, and normalized visible text matches the original on each page.
3. All `href` and `src` values are unchanged.
4. The JSON-LD data structures are unchanged.
5. The PostCSS declaration/rule/at-rule/comment sequence, selectors, values, and `!important` flags match the original.
6. The original JavaScript and all non-HTML/CSS files are byte-identical to the source archive.
7. Checked local internal links and fragment targets: no missing target found.
8. The unchanged `script.js` passed `node --check`.

### What still needs your review

**A browser-rendered comparison was not available in this workspace.** Check the homepage, each service page, contact, 404, and privacy pages on desktop and mobile (e.g., using VS Code Live Server). Verify especially the navigation dropdowns, mobile menu, gallery, and enquiry form before submitting a pull request. The form's original sending behavior has not been changed or independently end-to-end tested.

### Suggested GitHub workflow

1. Start a **new cleanup branch** from the latest `origin/everwarm-site-build`. Avoid copying over uncommitted edits.
2. Extract the *updates-only* ZIP into the repository root, keeping existing assets and JavaScript.
3. Run `git diff --check` and review `git diff --stat` and `git diff --word-diff`.
4. Preview/test every page using Live Server.
5. Commit, push the cleanup branch, and open a pull request for Aaron to review. Do not merge into `main` without approval.

### Future page work

Keep 2-space indentation for HTML and CSS. Prefer one CSS declaration per line. Preserve Aaron's approved H1s, H2s, and existing copy unless explicitly instructed to change them. New location/service pages should follow the same formatting style.
