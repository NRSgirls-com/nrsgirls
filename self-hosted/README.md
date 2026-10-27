# NRSgirls — working self-hosted edition

This is the runnable application. It uses **Node.js 24 LTS**, the built-in SQLite database, and browser APIs. No npm dependencies, package installation, subscription, external database, payment account, or Vercel account is required. Running on an existing computer incurs no new hosting charge; internet access, electricity, and the computer remain your responsibility.

The older Next.js scaffold is retained in `nrsgirls-platform/frontend/` so previous work is not lost. It is not needed by this app. The two apps do not share accounts or databases. Hosted Actions is currently blocked before jobs start by an upstream account restriction; run the local verification commands below without a hosted runner.

## Start on your Mac or Linux computer

From the repository folder:

```bash
bash self-hosted/start-local.sh
```

On first start, enter an administrator email and a password of at least 12 characters. The password is entered without echoing it to the terminal. Open **http://localhost:3000**. Keep the terminal open; Control-C stops the app. On later starts the existing database is reused. Environment-supplied ADMIN_EMAIL and ADMIN_PASSWORD allow unattended first-start setup; PORT changes the default local URL. If the app reports that Node.js is missing or the wrong version, install Node.js 24 LTS from https://nodejs.org/ first.

Do **not** run `npm install`: this edition has no dependencies to install. `npm start` at the repository root also works after first-time administrator setup.

Data lives in `self-hosted/data/`, outside Git. Never commit or publish that directory. It contains account records, password hashes, session tokens in hashed form, chat, moderation reports, invitations, DJ state, and uploaded audio. Back it up privately while the server is stopped; copy the **entire** directory, including any SQLite sidecar files. Restore the directory while stopped. Loss of this directory means loss of accounts and uploads.

## Try the complete workflow

1. Sign in as the administrator in one browser profile.
2. Register a performer in a separate browser profile/private window. Creator accounts start pending.
3. Use the administrator's account queue to approve the performer **after** your identity, adult-status, consent, and rights review. The app does not perform that review for you. Refresh the creator page after approval.
4. The performer can create one public room and one invitation-only room. Register a viewer, then invite that viewer by registered email to the private room.
5. Both accounts enter the room. The performer selects **Enable camera & go live** and grants browser camera/microphone permissions. Other viewers receive the camera stream if network connectivity allows it. Muting the video avoids hearing the performer's microphone over the DJ feed.
6. Chat, report a concern, revoke a guest's invitation, and inspect the administrator's report queue. Room access is checked on the server, not merely hidden in the UI.
7. Register and approve a DJ. Upload a small MP3 (up to 20 MB) with rights confirmation. The administrator can preview pending audio and approve or reject it. An approved mix can then be selected for the shared feed. A direct HTTPS audio URL is also supported.
8. Listeners select **Play / resync** once to permit browser audio. Recorded-file position is approximately synchronized using server time; it is not sample-accurate. Live URLs use their live edge and are not guaranteed synchronized.

The audio signature test only recognizes an MP3-like header. It is **not** a full decoder validation or malware scanner. All uploaded audio starts pending. Review only files you trust. Rejected files remain on disk and count against the quota; the app intentionally does not automatically destroy creator files. Default total audio quota is 200 MB. To reclaim space, stop the server, make a private backup, and have the operator remove the corresponding file and database record together.

## What is implemented

| Capability | Behavior |
| --- | --- |
| Accounts | Scrypt password hashes, persistent sessions, HttpOnly cookies, logout, role checks |
| Creator review | Performer/DJ approval, suspension, live-connection termination |
| Rooms | One public and one invitation-only room per performer; server-enforced invitation access |
| Camera | Browser WebRTC with authenticated SSE signaling; one broadcaster, up to 11 other connections per room |
| Conversation | Persistent room chat, bounded history, text rendered without HTML interpretation |
| Moderation | Reports, resolution queue, creator approval, account suspension, audio review |
| DJ audio | Local reviewed MP3 uploads with byte-range playback, shared track selection and playback state |
| Persistence | SQLite records and local audio, retained across restarts |
| Protection | Same-origin writes, CSRF tokens, request limits, upload/storage limits, security headers |
| Payments | Explicitly disabled; checkout returns 503 and cannot collect charges |

An adult checkbox records a self-declaration at registration, not identity verification. The app currently enforces acceptance to register but does not store a versioned legal-consent audit trail.

## Tests

See [REPAIR_LOG.md](REPAIR_LOG.md) for the numbered defect review, reproductions, repairs, and unresolved verification. The suite now includes 25 named tests, including delayed HTTP request authorization, account/media races, room capacity, configuration validation, and actual startup subprocesses. Browser-code tests use controlled DOM/media stubs; they do not replace real-browser acceptance tests.

```bash
npm run check
npm test
```

The integration test uses temporary databases and an isolated local HTTP server. It verifies registration and login, privilege-escalation rejection, approval gates, public/private room authorization, invitation revocation, CSRF/origin rejection, chat persistence, actual SSE signaling transport and peer impersonation rejection, DJ permissions, upload quarantine and approval, audio byte ranges, report resolution, restart persistence, suspension, and logout. Setup tests reject missing administrators and insecure production origins.

These tests do **not** verify actual browser camera capture, ICE traversal, audio decoding, or visual layout. During development, the separate cloud browser could not reach the workspace's localhost server (connection refused). Two real browsers/devices are still required for a media acceptance test. API and signaling tests passing must not be represented as that media test passing.

## Hosting without Vercel

Localhost is **not** public hosting. This app deliberately starts on `127.0.0.1`. No hosting account, public exposure, domain change, or paid service is provisioned by running it.

For an existing server you control, put a TLS reverse proxy in front of the Node process. Set:

```text
NODE_ENV=production
PUBLIC_ORIGIN=https://your-actual-domain.example
HOST=127.0.0.1
PORT=3000
DATA_DIR=/an/absolute/private/persistent/directory
```

The proxy must preserve the public **Host**, stream SSE without response buffering, support long-lived SSE connections, limit request bodies to 20 MB, and keep the app port private. Production cookies require HTTPS. Do not point DATA_DIR at temporary/serverless storage. This is a **single-process** app: do not run multiple instances against this design; live presence and signaling are process-local. The per-IP rate limiter deliberately does not trust forwarded IP headers; behind a proxy, visitors may share limits.

Optional `ICE_SERVERS_JSON` supplies your authorized STUN/TURN server configuration as a JSON array. Example shape (place actual credentials in the environment, never Git):

```json
[{"urls":"turn:YOUR-RELAY:3478","username":"YOUR-USER","credential":"YOUR-SECRET"}]
```

ICE credentials must be delivered to participating browsers to establish connections. Use scoped, short-lived credentials before deploying a relay publicly. Without ICE servers, direct media may work on the same machine/LAN and fail across networks. No relay is purchased or configured here. Each viewer consumes broadcaster upload bandwidth; this is not an SFU/CDN streaming architecture.

The repository root and legacy frontend Vercel configurations disable Git-triggered deployments. That does not close external accounts, remove billing, or uninstall an existing GitHub integration. No Vercel deployment is required or initiated by this app.

## Remaining before a commercial public launch

These require real operator configuration or further implementation; the app does not pretend otherwise:

- Public machine/network availability, domain control, TLS, monitoring, recovery, and private backups.
- Real browser/device media verification, authorized relay infrastructure where needed, and bandwidth capacity.
- Your identity/adult-status/consent verification process and a versioned consent record system; human moderation and takedown procedures.
- Rights clearance and applicable service terms for the content you actually choose to host.
- Automated media scanning/transcoding, scalable delivery, and time-aligned live DJ audio distribution.
- Email verification, password recovery, multi-factor administration, and user deletion/export workflows.
- Payments, token ledger, subscriptions, payouts, reconciliation, and a suitable processor, if you later choose to monetize. No fake token balances or fake successful payments are implemented.

The photographed whiteboard provides historical notes about browsers, virtual machines, and ports. It does not identify the runtime configuration of this app or establish a compromise. This edition needs no inbound Telnet or SSH exposure, browser extensions, or installation of applets.
