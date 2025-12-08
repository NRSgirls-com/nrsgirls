API

REST API design and endpoint catalog will be developed here. Core routes:
- /auth/* (signup, login, token refresh)
- /djs/* (profile, uploads, stats)
- /performers/* (profiles, privacy controls)
- /mixes/* (upload processing, metadata, streaming links)
- /moderation/* (queues, decisions)

Authentication: JWT with role-based claims. Rate limiting and auditing required.