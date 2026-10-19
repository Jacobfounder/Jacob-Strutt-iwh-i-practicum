# Video games practicum implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the required HubSpot Video games read/create Express app with three routes and two Pug views.

**Architecture:** Keep the routes in the starter `index.js`. A `createApp` function accepts configuration and an Axios-compatible client so tests can exercise real HTTP routes with a fake HubSpot client. The normal entry point loads `.env` and starts port 3000.

**Tech Stack:** Node.js, Express, Axios, Pug, dotenv, Node built-in test runner.

---

### Task 1: Configuration and form route

**Files:** `index.js`, `views/updates.pug`, `package.json`, `.env.example`, `test/app.test.js`

- [ ] Add a failing Node test: `GET /update-cobj` responds 200 with title, Name, Genre, Platform fields, and a Return to the homepage link. Run `npm test` and confirm the route is missing.
- [ ] Implement `createApp`, environment loading, and the `GET /update-cobj` route. Use `res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', fields })`.
- [ ] Add `views/updates.pug` with a `form(method='post', action='/update-cobj')` and inputs named `name`, `genre`, and `platform`; add the required return link.
- [ ] Add `dotenv` dependency and `.env.example` with `HUBSPOT_PRIVATE_APP_TOKEN`, `HUBSPOT_OBJECT_TYPE`, and `HUBSPOT_ACCOUNT_ID`. Keep `.env` ignored. Run `npm test` to green, then commit.

### Task 2: POST record creation

**Files:** `index.js`, `test/app.test.js`

- [ ] Add a failing test: POST URL encoded Name, Genre, Platform; assert the fake client receives `POST https://api.hubapi.com/crm/v3/objects/<object-type>` with `{properties:{name,genre,platform}}` and Bearer authorization; assert redirect to `/`.
- [ ] Add a failing test for a blank field: assert 400 and no HubSpot API call.
- [ ] Implement `POST /update-cobj`: trim inputs, validate each, call `axios.post`, then `res.redirect('/')`. On HubSpot failure render the form with a nonsecret error and status 502. Run `npm test`, then commit.

### Task 3: Homepage table

**Files:** `index.js`, `views/homepage.pug`, `test/app.test.js`

- [ ] Add a failing test: fake HubSpot GET returns one game; assert `GET /` displays it in a three-column table and an Add to this table link.
- [ ] Implement `GET /` with `axios.get` and `params: { properties: 'name,genre,platform', limit: 100 }`. Render `homepage.pug` with `data: response.data.results`. On failure return a nonsecret 502 message.
- [ ] Create `homepage.pug` with the required link and table headers Name, Genre, Platform. Run `npm test`, then commit.

### Task 4: README and verification

**Files:** `README.md`, `test/app.test.js`

- [ ] Document `npm install`, `.env` setup, `node index.js`, all three routes, test-account object setup, and the exact custom object list URL once the user provides the account/object IDs.
- [ ] Run `npm test`, `node --check index.js`, and `git diff --check`. Confirm no token appears in tracked files.
- [ ] With the user's test account configured, run the app and verify adding a game changes the homepage table. Commit README and any verified fixes. Merge `working-branch` into `main` and push only after the live check.

## Required external values

The user must supply a HubSpot developer test account, private app token stored locally in `.env`, and the custom object type ID. The token must never be sent in chat or committed. If the UI creates different internal property names, configure or adjust the code to use the actual names before the live check.
