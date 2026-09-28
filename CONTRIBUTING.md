# Team contribution workflow

Every member must contribute using their own GitHub account and push their own work. Never share an account or fabricate contributions. Git records commits; the meaningful message belongs to the commit, not the push.

1. Accept the repository invitation and configure your own Git name and GitHub-verified email locally. Do not copy another member's identity.
2. Pull the latest main branch and create a branch such as `feature/member-profile`, `feature/class-booking`, `docs/requirements`, or `test/booking-capacity`.
3. Work on an assigned Azure Boards task. Commit each coherent, checked change and push after each work session or completed subtask. Do not save all contributions for submission day.
4. Use messages explaining the change: `feat: prevent duplicate class bookings`, `test: reject bookings when a class is full`, or `docs: record member registration acceptance criteria`. Avoid `1`, `2`, `update`, or `final`.
5. Open a pull request describing the result, task reference, and verification. Another team member reviews it before merging. Preserve attribution when integrating work.
6. Record the commit/PR link and test evidence in the progress tracker and Azure Boards. Documentation, SQL, tests, and accessibility work are meaningful contributions too.

Repository owner: add all four members as collaborators and configure main-branch protection with pull-request review and available CI checks. These remote settings are pending usernames and repository permissions; this file does not enforce them.

Recommended responsibilities from the project plan: Sanele coordinates integration and API work; Tshifhiwa leads database design and migrations; Nyito leads requirements and acceptance checks; Nonhlanhla leads interface design and usability testing. All four must also own implementation or automated-test tasks suitable to their skills. These are proposed allocations, not evidence of completed work.

Keep private medical records, passwords, database exports, signing keys, and service-account files out of Git. Use synthetic demo data. Record AI assistance honestly in the submission.
