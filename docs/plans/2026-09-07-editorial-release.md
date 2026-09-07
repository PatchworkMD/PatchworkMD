# PatchworkMD editorial release implementation plan
Goal: Ship the approved editorial website in the existing Sites project.
Architecture: Existing React/vinext routes, CSS-first motion and shared branding. Product owners retain app source and release ownership.
Tech stack: React 19, vinext, Vite, CSS, Sites.

1. IN PROGRESS: Update app/page.tsx, app/globals.css, public/icon.svg with approved editorial visual direction. Worker owns these files. Use public/brand/studio.webp for clearly atmospheric art, authentic available logos, readable product status.
2. Add requested app/appdesignresearch/page.tsx redirect and verify existing short product routes. Preserve /localmodelfit redirect to /localmodelmatch. Parent owns route and product-page updates.
3. Add or retain verified GitHub links. Public GitHub API only exposes ADR as matching current product repository; await owners rather than link private repos or obsolete custom-vibe-island. Add maker credit in owned website footer; app owners handle their releases.
4. Build exact source in isolated /tmp/patchworkmd-products-publish worktree. Run scoped oxlint app, TypeScript, dependency audit, diff whitespace check. Unused template components have pre-existing full-lint failures; do not hide them.
5. Browser QA at desktop and mobile, keyboard, reduced motion, media appearance, product navigation, ADR alias and LocalModelMatch redirect. Independent review checks exact source and limits.
6. Push exact source to existing Sites repository, package validated build using package-site.sh, save and deploy a version. Verify public URL routes and production errors. Roll back to v7 if critical rendering/navigation failures occur.
7. Record exact deployment/source and app-credit receipts, distinguishing source edits from shipped binaries.
