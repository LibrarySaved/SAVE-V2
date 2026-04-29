# Test Credentials — saved.

> Auth method: **Emergent-managed Google OAuth**.
> No app-managed passwords are used.

## Production-style E2E flows
Real Google login is required for full E2E (the user logs in with their own Google account).

## Test Identities for the Testing Agent

The testing agent should create a temporary MongoDB session/user when validating auth-gated routes. See `/app/auth_testing.md` for the exact `mongosh` commands.

Quick recipe:

```bash
SESSION_TOKEN="test_session_$(date +%s)"
USER_ID="test-user-$(date +%s)"
mongosh --quiet --eval "
use('test_database');
var now = new Date();
var expiresAt = new Date(Date.now() + 7*24*60*60*1000);
db.users.insertOne({
  user_id: '$USER_ID',
  email: 'qa.$SESSION_TOKEN@test.com',
  name: 'QA Test',
  picture: 'https://via.placeholder.com/150',
  created_at: now.toISOString(),
  updated_at: now.toISOString()
});
db.user_sessions.insertOne({
  session_id: 'sess_$SESSION_TOKEN',
  user_id: '$USER_ID',
  session_token: '$SESSION_TOKEN',
  expires_at: expiresAt.toISOString(),
  created_at: now.toISOString()
});
"
echo \"$SESSION_TOKEN\"
```

Inject the cookie in Playwright:
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
```

## Cleanup
```bash
mongosh --quiet --eval "
use('test_database');
db.users.deleteMany({email: /qa\\.test_session_/});
db.user_sessions.deleteMany({session_token: /^test_session_/});
"
```
