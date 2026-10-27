# Repair log — PR 46

The first implementation passed its broad API test but had defects that test did not exercise. The following repairs were made sequentially. Regressions were reproduced with failing tests before the corresponding code repairs; workflow corrections were verified by inspection and running their local commands.

| # | Defect | Repair and verification |
| --- | --- | --- |
| 1 | Withdrawn creator/mix approval did not withdraw an already-selected DJ feed. | Associate the feed with its creator ID; recheck creator and local-mix approval on each feed read. Test both withdrawals. Old feed records without a creator ID fail closed until a DJ reselects a track. |
| 2 | Authorization was checked before reading slow request bodies. Revoked users could finish writes/uploads. | Reauthenticate after reading bodies, then make room/role decisions. Recheck binary upload authorization before storing files. Real delayed HTTP requests reproduce revoked chat, withdrawn room-creation permission, and suspended uploads. Login also rechecks account state after password hashing. |
| 3 | Click handlers did not disable buttons, allowing overlapping camera operations. | Guard both click and submit buttons, reject overlapping calls, and restore the button in finally. Client-code regression test. |
| 4 | A withdrawn feed kept playing in the client; replacing a playing track left playback paused. | Clear unavailable sources, preserve listener playback through track replacement and DJ pause/resume, and avoid playing beyond a recording's end. Client-code regressions for withdrawal and replacement. |
| 5 | Delayed video/signaling callbacks could update a room opened afterward. | Bind peer callbacks and signaling operations to their original room generation and peer ID. Guard asynchronous guest lists and room error callbacks. Client-code stale-video regression. |
| 6 | Sign-out/session expiry left stale account state, audio, or delayed account data. | Clear media and account-specific UI on identity changes; invalidate old room/mix/admin responses; refresh account approval with the Refresh button. Client-code account/expiry regressions. |
| 7 | Missing/malformed administrator IDs caused 500 errors; missing review targets falsely returned success. | Validate IDs and require an updated database row. HTTP regressions for malformed users and nonexistent mix/report reviews. |
| 8 | A late camera start/stop response could change controls or stop media in a different room. | Scope camera response handling to the original room. Client-code late-start regression. |
| 9 | Invalid origins, storage quotas, ICE configuration, and bootstrap emails were accepted. | Validate these settings before opening storage. Regression cases for invalid protocol, NaN/negative quotas, malformed ICE objects, and unusable administrator email. |
| 10 | Supplied bootstrap credentials still prompted for input; custom ports retained an origin on port 3000. | Respect environment credentials and derive the default origin from PORT. Actual subprocess tests exercise first start and restart without stdin. |
| 11 | An old 401 response could sign out a newer account; history-restored rooms retained stale connections. | Bind 401 handling to its request's account generation. Clear rooms on page hide and refresh restored pages. Client-code stale-401 regression. |
| 12 | Legacy CI referenced a nonexistent app directory; the release workflow attempted to install/publish a private app. | Use one Node 24 check/test workflow without dependency installation; release verification does not publish or deploy. Remove duplicate workflow. Local commands pass; hosted Actions execution is not verified. |
| 13 | Viewers could fill every room slot before the broadcaster connected. | Reserve one slot for the owner. Real SSE capacity test fills audience slots, rejects overflow, and admits the broadcaster. |
| 14 | A missing stored audio file produced a generic server error. | Return unavailable/404 for absent audio. HTTP regression with a missing media file. |
| 15 | Sign-out and Stop Broadcast waited for the network before shutting off capture. | Stop camera/microphone tracks immediately, then confirm the server response separately. Two deferred-network client regressions. Offline sign-out does not claim server-session invalidation. |
| 16 | Stalled requests could leave controls disabled indefinitely. | Use abortable 15-second request limits covering fetch and response decoding; apply the same handling to uploads. A controlled timeout regression verifies the operation exits. |
| 17 | Broadcaster connections used bidirectional media and could replace the local preview with unsolicited viewer media. | Use send-only transceivers and ignore inbound tracks on the broadcaster. Client-code direction/preview regression. |
| 18 | Rejected room entry left an unconnected room panel visible indefinitely. | Clear the failed room and ignore obsolete scrolling. Client-code revoked-room regression. |
| 19 | Malformed HTTP request targets generated internal server errors. | Return 400 for invalid request URLs. Raw HTTP regression. |
| 20 | Public HEAD health probes required login; static HEAD probes were rejected. | Support anonymous HEAD for health and static assets with empty response bodies. HTTP regressions cover all four public endpoints. |
| 21 | An uncertain broadcast start/stop left its signaling session open. | Close signaling and require room reconnection after failure, while keeping capture off. A failed-stop regression verifies disconnection. The lease in repair 22 now bounds stale application presence; it does not establish that every viewer is receiving media. |
| 22 | A stale open connection could keep a room marked LIVE after the broadcaster disappeared. | Add authenticated 10-second client heartbeats and a 45-second server lease using a monotonic clock. Expired leases close the broadcaster connection and cannot be renewed by viewers or silently resurrected. HTTP/SSE tests advance a controlled clock to reproduce expiry and renewal. |
| 23 | Camera hardware ending could leave microphone capture active or be followed by a false startup confirmation. | Stop all capture when the video track ends and recheck capture ownership after startup completes. Client regressions cover both hardware loss and hardware loss during a pending start. |

## Verification

```bash
npm run check
npm test
bash -n self-hosted/start-local.sh
git diff --check
```

The suite has **31 named tests**, including HTTP/database workflows, real SSE signaling and capacity, delayed-body authorization regressions, isolated browser-code state tests with mocks, and real startup subprocesses. The client tests execute the actual `app.js` code against controlled DOM/media stubs; they are not browser/device acceptance tests.

## Unresolved verification and launch requirements

- GitHub Actions jobs are blocked before starting by an upstream account restriction, confirmed in the public run annotations. Application-code repairs cannot remove that restriction. No account or billing configuration was changed. Hosted CI remains blocked; local checks do not claim hosted CI success.
- The cloud browser cannot reach this workspace's localhost server. Real browser layout, camera/audio permissions, codecs, and cross-device ICE/TURN remain unverified. Mock tests do not resolve these checks.
- No public hosting, domain routing, TLS proxy, TURN relay, payment account, or paid service has been provisioned. See README.md for the remaining operational/commercial scope.
- This change replaces the CI behavior proposed in draft PR 44. Do not apply that older CI patch over this app's workflow.

No claim is made that all possible defects have been eliminated. All defects reproduced in this review have passing regression coverage or a recorded workflow correction; the limits above remain explicit.

## Golden ratio and the cause analysis

The user's clarified reference is the **golden ratio**, not the ethical Golden Rule. Euclid's definition is the equality of the whole-to-larger and larger-to-smaller ratios: https://mathcs.clarku.edu/~djoyce/elements/bookVI/defVI3.html . With larger part a and smaller part b, (a+b)/a = a/b = phi, approximately 1.618034.

The desktop room layout therefore gives the video/control column 1.618034 shares and the conversation column one share of the space remaining after the gap: approximately 61.8% / 38.2%. The longer registration form receives the larger share of the desktop account layout. Below 900 CSS pixels, both layouts stack. Video retains its native 16:9 display area. This is a geometric design choice; it does not prove faster software, better usability, or optimal resource use. Browser visual acceptance remains pending.

The code defects have observable causes independent of that proportion: permissions and account state were reused after asynchronous boundaries, camera state was allowed to wait for network responses, stale callbacks crossed room/account boundaries, and LIVE state had no expiry. Their candidate fixes are checked by regression tests. The hosted CI restriction is external to these application paths. No mathematical proportion or application patch can clear that account restriction.

Presence confirmations add one small POST per active broadcaster every 10 seconds, not one per viewer. Room reads check lease expiry immediately; the background sweep runs every 15 seconds. After 45 seconds without a confirmation, an expired broadcast is removed on the next read/sweep. This is a bounded presence signal, not proof of delivered video. Keep the broadcast tab open and active; sleep, heavy throttling, or loss of connectivity may end the broadcast. Re-enter to restart; old open tabs should reload after this upgrade.
