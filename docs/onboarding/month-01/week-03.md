# Week 3 – Database + Presence

## Outcomes
- Postgres + Prisma
- Models: User, Performer, Room (A/B)
- Presence via Redis + WebSocket

## Prisma schema (start)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

model Performer {
  id        String   @id @default(cuid())
  userId    String   @unique
  rooms     Room[]
  createdAt DateTime @default(now())
}

model Room {
  id           String   @id @default(cuid())
  performerId  String
  name         String   // "Room A" | "Room B"
  isLive       Boolean  @default(false)
  updatedAt    DateTime @updatedAt
}

enum Role {
  USER
  PERFORMER
  ADMIN
}
```

## Presence (baseline)

* `ws://…/api/ws` channel
* Events: `JOIN_ROOM`, `LEAVE_ROOM`, `ROOM_STATUS`
* Redis pub/sub to fan out room status

## Success criteria

* Migrations run; seed creates 1 performer with two rooms
* Toggle “Room A/B live” and broadcast to clients
