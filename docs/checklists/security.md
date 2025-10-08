# Security — Month 1
- .env templates present; real secrets excluded
- HTTPS in dev proxy (optional), required in prod
- Rate limit auth and public routes
- Input validation (Zod) on all endpoints
- DB least privilege: separate `app` user
- Audit basic access logs enabled
