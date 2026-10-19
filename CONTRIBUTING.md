# Team contribution workflow

Every member must contribute using their own GitHub account and push their own work. Never share an account or fabricate contributions. Git records commits; the meaningful message belongs to the commit, not the push.

1. Accept the repository invitation and configure your own Git name and GitHub-verified email locally. Do not copy another member's identity.
2. Fetch and pull the agreed integration branch (`feature/team-and-app-setup` for the current WIL work) with `git pull --ff-only`, then create a task branch such as `feature/member-profile`, `database/booking-schema`, `docs/requirements`, or `test/booking-capacity`. Preserve unrelated local changes before switching branches.
3. Work on an assigned Azure Boards task. Commit each coherent, checked change and push after each work session or completed subtask. Do not save all contributions for submission day.
4. Use messages explaining the change: `feat: prevent duplicate class bookings`, `test: reject bookings when a class is full`, or `docs: record member registration acceptance criteria`. Avoid `1`, `2`, `update`, or `final`.
5. Open a pull request describing the result, task reference, and verification. Another team member reviews it before merging. Preserve attribution when integrating work.
6. Record the commit/PR link and test evidence in the progress tracker and Azure Boards. Documentation, SQL, tests, and accessibility work are meaningful contributions too.

The earlier access screenshot is historical, not a current permission audit. Each member should confirm access using their own account. Lecturer Pnkala is excluded from team assignments. Branch protections must be configured separately; these instructions do not enforce folder-level permissions or required reviews.

Role ownership (confirmed by Manqoba):

- Sanele Manqoba Mazibuko: Group Leader and Lead Software Developer; may change any area.
- Nyito Ramudzuli: Business Analyst; requirements, use cases, business rules, acceptance criteria and traceability.
- Tshifhiwa Thamagane: System Designer and Database Architect; architecture, ERD, Oracle SQL, data dictionary and database tests.
- Nonhlanhla Chirwa: UI/UX Designer and Tester; wireframes, website/app layouts, accessibility and QA evidence.

Every member pushes only work relevant to their role; cross-area integration belongs to Manqoba. This is a team review rule, not a technical GitHub path restriction. Follow [the dated two-week plans](docs/team/README.md). New branches and commit messages use project/task descriptions without assistant branding. Existing published history is retained.

Keep private medical records, passwords, database exports, signing keys, and service-account files out of Git. Use synthetic demo data. Record AI assistance honestly in the submission.

## Lead developer review and release

- Inspect the staged diff and preserve the original contributor's attribution.
- Require the changed feature's relevant tests and a link to its actual result. Database checks must name the schema/environment and retain query output, with secrets removed.
- Ask another member to review completed work; do not record a review that has not occurred.
- The `website` branch is a static release branch. Render publishes `CFJ-Management-System`; source-branch pushes do not update it automatically. Publish reviewed static files only after website checks pass and retain their source manifest.
- Never copy `.env` files, wallets or backend data into the static release. Deploying the static website does not deploy the API or database.
- Nyito owns progress/meeting records and Nonhlanhla owns UI/phone acceptance evidence. The lead supplies commit and database-check links for them to reference, rather than filling in their records on their behalf.
