# Push guide for Nyito

Use your own account `Nyito22`. Accept the invite if pending. Install Git and clone the repository once. Configure your own name and verified GitHub email, not another member's identity.

```powershell
git clone https://github.com/Manqoba275/CFJ-Management-System.git
cd CFJ-Management-System
git switch main
git pull --ff-only
git switch -c work/nyito-first-task
```

If the shared starter is not merged yet, use `git switch -c work/nyito-first-task origin/feature/team-and-app-setup` instead of the last command.

Complete the daily work first. Review `git status` and `git diff`. Stage the specific files from your plan using `git add path/to/your/file`; do not use that example path literally. Commit with the meaningful message matching your actual work, then `git push -u origin HEAD`. Open a pull request to main and request review. On later pushes of that same branch, `git push` is enough. Create a new branch for the next coherent task after pulling reviewed changes.

Scope: Business requirements, use cases, business rules, acceptance criteria, traceability and meeting decisions. No unrelated application or database code.

Never upload passwords, signing keys, real medical/member records, node_modules, .gradle, build folders, or local.properties. Add evidence links to your daily record. Do not upload this whole instruction packet as your completed work.
