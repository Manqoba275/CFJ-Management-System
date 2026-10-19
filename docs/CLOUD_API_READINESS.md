# Cloud API deployment prerequisites

The static CFJ website is already hosted on Render. This does not host the Oracle database or make the development-token API suitable for public use.

## Current boundary

The new Oracle operations adapter runs locally. `backend/oracle-server.mjs` deliberately binds to loopback and uses manually configured development tokens. Do not change it to a public listener and call that a production sign-in service. No cloud database connection or Firebase service identity has been supplied or verified in this work session.

## Required inputs

1. An actual hosted Oracle service reachable from the API host, with a restricted application account, TLS/wallet configuration where required, allowed outbound IPs, and migration access. Never use the PC's 127.0.0.1 address as the Render database host.
2. A verified authentication project shared by web and Android, backend token verification, member UID mapping and server-controlled role/consent data. Development tokens must not become public credentials.
3. Deployment secrets entered through the host's secret settings, never through a public issue, source file or screenshot.

## Deployment sequence once configured

- Run reviewed migrations 001-004 against the intended cloud schema (001 only on a fresh schema); seed synthetic data deliberately.
- Implement a production entry point that verifies the identity on every protected request and resolves that member's Oracle store. Add exact-origin CORS, request limits and sanitized errors.
- On Render, deploy the source integration branch as a Node web service using npm ci and the implemented production entry point. Bind to 0.0.0.0 and Render's PORT. Do not copy the existing Docker service configuration without checking it.
- Configure health/readiness probes and separate secret credentials. Use small connection pools matched to database limits. Choose a plan after reviewing its current price and availability.
- Test unauthorized/forbidden cases, account ownership, concurrent writes, persistence after restart and remote access while the development PC is off.
- Only then configure the website/Android API URL and collect cloud evidence.

## Evidence required

Record service/deploy ID, source commit, health result, redacted cloud database status, actual authenticated request results, cross-client results and a successful restart/persistence check. Do not substitute local test screenshots for hosted-service evidence.
