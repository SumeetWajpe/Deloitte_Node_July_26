# Node.js Best Practices — Top 10 Rules (Agent Code Review)

> **Purpose:** A compact rule set for an automated agent to check Node.js code against. All rules are `MUST` (blocking). Report violations with rule ID, file, line, and the `fix`.

---

### RULE-01 — No secrets hardcoded in source
- **Check:** Scan for hardcoded API keys, passwords, tokens, DB connection strings (e.g. `apiKey = "..."`, `mongodb://user:pass@...`).
- **Fix:** Move to environment variables (`.env`, secrets manager); ensure `.env` is gitignored.

### RULE-02 — No unhandled promise rejections
- **Check:** Every `Promise`/`async` call site must have `.catch()` or be wrapped in `try/catch`.
- **Fix:** Add `.catch(err => ...)` or `try { } catch (err) { }`.

### RULE-03 — No blocking the event loop
- **Check:** Flag synchronous heavy ops in request/handler paths: `fs.readFileSync`, `execSync`, large sync JSON parsing, CPU-bound loops.
- **Fix:** Use async equivalents (`fs.promises.readFile`); offload CPU-heavy work to worker threads or a queue.

### RULE-04 — No silently swallowed errors
- **Check:** Flag empty `catch {}` blocks or `catch (err) {}` with no logging/rethrow.
- **Fix:** Log the error with context, or rethrow/handle explicitly.

### RULE-05 — No unsanitized input in queries or commands
- **Check:** Flag string-concatenated SQL (`` `SELECT * FROM x WHERE id=${id}` ``), unsanitized Mongo queries, or shell commands built from `req.body`/`req.query`.
- **Fix:** Use parameterized queries/an ORM, and validate/sanitize all external input (e.g. `zod`, `joi`).

### RULE-06 — No `eval`, `new Function`, or dynamic `require` on user input
- **Check:** Flag `eval(...)`, `new Function(...)`, or `require(variable)` where `variable` traces to user input.
- **Fix:** Remove dynamic code execution; use explicit allowlists or safe parsing (`JSON.parse`).

### RULE-07 — Passwords/secrets never stored or logged in plaintext
- **Check:** Flag storing or logging raw password fields, tokens, or auth headers.
- **Fix:** Hash passwords (`bcrypt`/`argon2`) before storage; redact sensitive fields from logs.

### RULE-08 — Centralized error-handling middleware
- **Check:** Express/Koa/etc. apps must register a final catch-all error handler (Express: 4-arg `(err, req, res, next)`).
- **Fix:** Add error middleware as the last item in the middleware chain.

### RULE-09 — Lockfile committed, dependencies audited
- **Check:** `package-lock.json`/`yarn.lock`/`pnpm-lock.yaml` must exist and be tracked; no `high`/`critical` `npm audit` advisories outstanding.
- **Fix:** Commit the lockfile; patch/update flagged packages.

### RULE-10 — `var` is not allowed
- **Check:** Flag any `var` declaration.
- **Fix:** Replace with `const` (default) or `let` (if reassigned).

---

## Suppressing a rule inline
```js
// nodejs-rules-ignore: RULE-03
```

## Suggested agent output format
```json
{
  "violations": [
    { "rule": "RULE-04", "file": "src/routes/user.js", "line": 42, "message": "Empty catch block swallows error", "fix": "Log or rethrow the error" }
  ]
}
```
