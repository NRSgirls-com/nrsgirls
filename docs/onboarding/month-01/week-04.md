# Week 4 – WebRTC Fundamentals (Founder Level)

## Outcomes
- Understand offer/answer, ICE, STUN/TURN
- Build a signalling stub (WebSocket)
- Local preview page for testing

## Pages
- `/app/webrtc/lab/page.tsx`: Start/Stop cam, render `<video>` local
- Signalling stub: `/app/api/signalling/route.ts` with WS upgrade
- Messages: `OFFER`, `ANSWER`, `ICE`, `PING`

## Reading goals (short)
- What signalling is (and is not)
- Why TURN is needed behind strict NATs
- Why we’ll start with a dedicated **DJ audio bus** (single track)

## Success criteria
- You can describe SDP at a high level
- You can send/receive a JSON `OFFER` and respond with `ANSWER` (loopback ok)
