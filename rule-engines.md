# Node.js Best Practices — Code Review Rules

> **Purpose:** This document defines a rule set for an automated agent to check developer-submitted Node.js code against. Each rule has a stable `ID`, a `severity`, a `check` description (what the agent should look for), and `good`/`bad` examples. Agents should treat `MUST` rules as blocking and `SHOULD` rules as advisory (flag but don't fail the build) unless the project config overrides this.

---

## How to use this file (for the agent)

1. Parse each rule block below (`### RULE-ID`).
2. For each rule, apply the `check` heuristic to the code under review (static analysis, regex, or semantic parsing as appropriate).
3. Report violations with: `rule ID`, `file`, `line`, `severity`, and a one-line fix suggestion (use the `fix` field).
4. Do not report a violation if the file contains an inline suppression comment: `// nodejs-rules-ignore: RULE-ID`.
5. Aggregate results into: `blocking` (MUST violations) and `advisory` (SHOULD violations).

---

## 1. Project Structure & Configuration

### RULE-001 — Use `package.json` engines field
- **Severity:** SHOULD
- **Check:** `package.json` should declare an `engines.node` field pinning a supported Node version range.
- **Fix:** Add `"engines": { "node": ">=18.0.0" }` to `package.json`.

### RULE-002 — No secrets in source or config committed to repo
- **Severity:** MUST
- **Check:** Scan for hardcoded API keys, passwords, tokens, connection strings (patterns like `AKIA[0-9A-Z]{16}`, `sk-[a-zA-Z0-9]{20,}`, `mongodb(+srv)?:\/\/.*:.*@`, or assignments like `apiKey = "..."`).
- **Fix:** Move secrets to environment variables and load via `.env` (with `.env` in `.gitignore`) or a secrets manager.

### RULE-003 — `.env` files must be gitignored
- **Severity:** MUST
- **Check:** If `.env` or `.env.*` exists in the repo, confirm it is listed in `.gitignore`.
- **Fix:** Add `.env*` to `.gitignore`; commit only `.env.example` with placeholder values.

### RULE-004 — Lockfile must be committed
- **Severity:** MUST
- **Check:** `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` must exist and be tracked in version control.
- **Fix:** Run `npm install` (or equivalent) and commit the generated lockfile.

---

## 2. Async & Concurrency

### RULE-010 — No mixing of callbacks and promises without adapting
- **Severity:** SHOULD
- **Check:** Flag functions that both accept a callback param and return a Promise without using `util.promisify` or a documented dual-mode pattern.
- **Fix:** Standardize on Promises/async-await; use `util.promisify` for legacy callback APIs.

### RULE-011 — No unhandled promise rejections
- **Severity:** MUST
- **Check:** Every `Promise` chain or `async` call site must have a `.catch()`, be wrapped in `try/catch`, or be explicitly awaited inside a function whose caller handles errors.
- **Fix:** Add `.catch(err => ...)` or wrap in `try { } catch (err) { }`.

### RULE-012 — No `async` executor functions in `new Promise()`
- **Severity:** MUST
- **Check:** Detect `new Promise(async (resolve, reject) => { ... })`.
- **Fix:** Don't mark the executor `async`; handle async logic inside and call `resolve`/`reject` explicitly, or avoid wrapping an already-async operation in `new Promise` at all.

### RULE-013 — Avoid blocking the event loop
- **Severity:** MUST
- **Check:** Flag synchronous heavy operations on hot paths: `fs.readFileSync`, `fs.writeFileSync`, `child_process.execSync`, large synchronous JSON parsing, or CPU-bound loops inside request handlers.
- **Fix:** Use async variants (`fs.promises.readFile`), offload CPU-bound work to worker threads or a job queue.

### RULE-014 — Use `Promise.all` / `Promise.allSettled` for independent async operations
- **Severity:** SHOULD
- **Check:** Flag sequential `await` calls in a loop where operations don't depend on each other's results.
- **Fix:** Batch with `await Promise.all([...])` (or `allSettled` if partial failures are acceptable).

---

## 3. Error Handling

### RULE-020 — Centralized error handling middleware (Express/Koa/etc.)
- **Severity:** MUST
- **Check:** HTTP frameworks must register a final error-handling middleware (Express: 4-arg function `(err, req, res, next)`).
- **Fix:** Add a catch-all error middleware at the end of the middleware chain.

### RULE-021 — Never swallow errors silently
- **Severity:** MUST
- **Check:** Flag empty `catch {}` blocks or `catch (err) {}` with no logging, rethrow, or handling logic.
- **Fix:** At minimum log the error with context; rethrow or handle explicitly.

### RULE-022 — Use `Error` objects, not strings, when throwing
- **Severity:** MUST
- **Check:** Flag `throw "some string"` or `throw { message: ... }` instead of `throw new Error(...)` / a custom `Error` subclass.
- **Fix:** Always `throw new Error('message')` or a typed custom error class.

### RULE-023 — Handle process-level uncaught errors
- **Severity:** SHOULD
- **Check:** Entry point (`index.js`/`server.js`) should register `process.on('uncaughtException', ...)` and `process.on('unhandledRejection', ...)` for logging/graceful shutdown (not for swallowing errors and continuing).
- **Fix:** Add handlers that log the error and perform a controlled shutdown (`process.exit(1)` after cleanup) rather than letting the process continue in a corrupted state.

---

## 4. Security

### RULE-030 — No use of `eval`, `new Function`, or dynamic `require` with unsanitized input
- **Severity:** MUST
- **Check:** Flag `eval(...)`, `new Function(...)`, or `require(variable)` where `variable` derives from user input.
- **Fix:** Remove dynamic code execution; use safe alternatives (JSON.parse for data, explicit allowlists for dynamic imports).

### RULE-031 — Validate and sanitize all external input
- **Severity:** MUST
- **Check:** Request handlers reading `req.body`, `req.query`, `req.params` should pass through a validation layer (e.g. `joi`, `zod`, `express-validator`) before use in DB queries, file paths, or shell commands.
- **Fix:** Add schema validation at the boundary before the data is used.

### RULE-032 — No string-concatenated SQL/NoSQL queries
- **Severity:** MUST
- **Check:** Flag SQL built via template literals/string concat with variables (`` `SELECT * FROM users WHERE id = ${id}` ``), or MongoDB queries built by directly interpolating unsanitized `req.body`.
- **Fix:** Use parameterized queries / prepared statements, or an ORM/query builder, and sanitize Mongo operators (e.g. via `mongo-sanitize`).

### RULE-033 — Set security-related HTTP headers
- **Severity:** SHOULD
- **Check:** Express (or similar) apps should use `helmet` or manually set headers like `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.
- **Fix:** `npm install helmet` and `app.use(helmet())`.

### RULE-034 — Rate limiting on public endpoints
- **Severity:** SHOULD
- **Check:** Public-facing routes (especially auth/login) should be behind rate-limiting middleware.
- **Fix:** Use `express-rate-limit` or equivalent, tuned per route.

### RULE-035 — No outdated/vulnerable dependencies
- **Severity:** MUST
- **Check:** Run `npm audit` (or equivalent) as part of the pipeline; flag any `high`/`critical` advisories.
- **Fix:** Update the affected package or apply the vendor-recommended patch/workaround.

### RULE-036 — Passwords must be hashed, never stored/logged in plaintext
- **Severity:** MUST
- **Check:** Flag any code path that stores, logs, or transmits raw password fields without hashing (`bcrypt`, `argon2`, etc.).
- **Fix:** Hash with `bcrypt`/`argon2` before storage; scrub password fields from logs.

---

## 5. Code Style & Structure

### RULE-040 — Use `const`/`let`, never `var`
- **Severity:** MUST
- **Check:** Flag any `var` declaration.
- **Fix:** Replace with `const` (default) or `let` (if reassigned).

### RULE-041 — Strict equality (`===`/`!==`)
- **Severity:** SHOULD
- **Check:** Flag `==`/`!=` except explicit `== null` checks (which are an accepted idiom for null-or-undefined).
- **Fix:** Use `===`/`!==`.

### RULE-042 — Consistent module system
- **Severity:** SHOULD
- **Check:** A single project should not mix CommonJS (`require`/`module.exports`) and ESM (`import`/`export`) without a documented reason (e.g. transitional migration).
- **Fix:** Pick one module system per project (declare via `"type": "module"` in `package.json` for ESM) and convert stragglers.

### RULE-043 — Linter and formatter configured
- **Severity:** MUST
- **Check:** Repo should include an ESLint config (`.eslintrc*` or `eslint.config.js`) and ideally Prettier config, wired into CI or a pre-commit hook.
- **Fix:** Add ESLint (`eslint`) + Prettier, and a `lint` script in `package.json`.

### RULE-044 — No unused variables/imports
- **Severity:** SHOULD
- **Check:** Flag declared-but-unused variables, functions, or imports (ESLint `no-unused-vars`).
- **Fix:** Remove dead code or prefix intentionally-unused params with `_`.

### RULE-045 — Avoid deeply nested callbacks ("callback hell")
- **Severity:** SHOULD
- **Check:** Flag callback nesting depth greater than ~3 levels.
- **Fix:** Refactor to async/await or split into named functions.

---

## 6. Logging & Observability

### RULE-050 — No `console.log` in production code paths
- **Severity:** SHOULD
- **Check:** Flag `console.log`/`console.error` usage outside of scripts/tests/dev tooling.
- **Fix:** Use a structured logger (`pino`, `winston`) with log levels.

### RULE-051 — No sensitive data in logs
- **Severity:** MUST
- **Check:** Flag log statements that include raw request bodies, headers (esp. `authorization`), passwords, tokens, or PII fields without redaction.
- **Fix:** Redact/mask sensitive fields before logging.

### RULE-052 — Correlation/request IDs for traceability
- **Severity:** SHOULD
- **Check:** HTTP services should attach a request/correlation ID (middleware or header propagation) usable across logs for a single request lifecycle.
- **Fix:** Add middleware (e.g. `cls-hooked`, `async_hooks`-based context, or a header-based ID) and include it in every log line for that request.

---

## 7. Dependency Management

### RULE-060 — Pin or range dependencies sensibly
- **Severity:** SHOULD
- **Check:** Flag overly loose version ranges (`"*"`, `"latest"`) in `package.json` `dependencies`.
- **Fix:** Use caret ranges (`^1.2.3`) at minimum; rely on the lockfile for exact resolution.

### RULE-061 — No unused dependencies
- **Severity:** SHOULD
- **Check:** Cross-reference `package.json` dependencies against actual `require`/`import` usage in source (tools like `depcheck`).
- **Fix:** Remove unused packages.

### RULE-062 — Separate `dependencies` from `devDependencies`
- **Severity:** MUST
- **Check:** Flag build/test-only tools (e.g. `eslint`, `jest`, `nodemon`, `typescript`) listed under `dependencies` instead of `devDependencies`.
- **Fix:** Move dev-only tooling to `devDependencies`.

---

## 8. Testing

### RULE-070 — Test suite must exist and be runnable via `npm test`
- **Severity:** MUST
- **Check:** `package.json` `scripts.test` must run an actual test suite (not the default `"echo \"Error: no test specified\" && exit 1"`).
- **Fix:** Add a test framework (Jest, Mocha, Vitest, node:test) and wire it into the `test` script.

### RULE-071 — Critical paths (auth, payments, data mutation) have tests
- **Severity:** SHOULD
- **Check:** Identify files implementing auth/payment/data-mutation logic and confirm a corresponding test file exists.
- **Fix:** Add unit/integration tests for the identified module.

---

## 9. Environment & Configuration

### RULE-080 — No environment-specific logic hardcoded (`if (env === 'production')` scattered everywhere)
- **Severity:** SHOULD
- **Check:** Flag repeated inline environment branching across many files instead of a centralized config module.
- **Fix:** Centralize environment-dependent config in one `config/` module, read once at startup.

### RULE-081 — Graceful shutdown handling
- **Severity:** SHOULD
- **Check:** Long-running servers should handle `SIGTERM`/`SIGINT` to close DB connections and in-flight requests cleanly.
- **Fix:** Add `process.on('SIGTERM', shutdownHandler)` that closes server/DB connections before exit.

---

## Severity Legend

| Severity | Meaning | Agent Action |
|---|---|---|
| **MUST** | Violates a critical safety, correctness, or security practice | Block merge / fail check |
| **SHOULD** | Strong recommendation, not always applicable | Flag as advisory, don't block |

## Suppressing a rule inline

```js
// nodejs-rules-ignore: RULE-050
console.log('debug: temporary trace');
```

## Suggested agent output format

```json
{
  "blocking": [
    { "rule": "RULE-021", "file": "src/routes/user.js", "line": 42, "message": "Empty catch block swallows error", "fix": "Log or rethrow the error" }
  ],
  "advisory": [
    { "rule": "RULE-050", "file": "src/index.js", "line": 10, "message": "console.log used outside dev tooling", "fix": "Use a structured logger" }
  ]
}
```
