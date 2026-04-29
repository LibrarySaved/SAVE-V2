# Auth-Gated App Testing Playbook (saved.)

This file is referenced by the testing agent to test authenticated flows.

## Test User & Session Creation

```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
var now = new Date();
var expiresAt = new Date(Date.now() + 7*24*60*60*1000);
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: now.toISOString(),
  updated_at: now.toISOString()
});
db.user_sessions.insertOne({
  session_id: 'sess_' + Date.now(),
  user_id: userId,
  session_token: sessionToken,
  expires_at: expiresAt.toISOString(),
  created_at: now.toISOString()
});
print('SESSION_TOKEN: ' + sessionToken);
print('USER_ID: ' + userId);
"
```

## Backend API smoke tests

```bash
TOKEN="<paste session_token>"
API="https://social-hub-687.preview.emergentagent.com/api"

curl -s "$API/auth/me" -H "Authorization: Bearer $TOKEN" | jq
curl -s "$API/content" -H "Authorization: Bearer $TOKEN" | jq
curl -s "$API/collections" -H "Authorization: Bearer $TOKEN" | jq
curl -s "$API/categories" -H "Authorization: Bearer $TOKEN" | jq
curl -s "$API/content/memories/on-this-day" -H "Authorization: Bearer $TOKEN" | jq
```

## Frontend Playwright cookie injection

```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": SESSION_TOKEN,
    "domain": "social-hub-687.preview.emergentagent.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None",
}])
await page.goto("https://social-hub-687.preview.emergentagent.com/dashboard")
```

## Cleanup

```bash
mongosh --eval "
use('test_database');
db.users.deleteMany({email: /test\\.user\\./});
db.user_sessions.deleteMany({session_token: /test_session/});
"
```

## Recent auth fixes (29/04/2026)
- **CORS**: replaced `allow_origins=['*']` with `allow_origin_regex='.*'` so Starlette echoes the request origin (required when `allow_credentials=True`)
- **StrictMode race**: `AuthCallback` now uses `useRef` guard to prevent double session_id consumption in dev
- **Error UX**: error toast now shows the backend `detail` instead of generic message
