# Integrating With HubSpot I: Foundations Practicum

This Node.js app reads and creates **Video games** records in a HubSpot developer test account.

## HubSpot test account

Create a private app named **Jacob's Practicum Private App** with read and write access for custom object schemas, custom object records, and contacts. Create a **Video games** custom object associated with contacts. Give it three string properties with these labels and internal names:

| Label | Internal name |
| --- | --- |
| Name | `name` |
| Genre | `genre` |
| Platform | `platform` |

Set Name as the primary display property, and add at least three Video games records in the test account.

**Custom object list in my developer test account:** Add the real URL here after the object is created. It must have the form `https://app.hubspot.com/contacts/<test-account-id>/objects/<custom-object-id>/views/all/list`.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. In `.env`, set `HUBSPOT_PRIVATE_APP_TOKEN` to the private app token and `HUBSPOT_OBJECT_TYPE` to the object's ID, usually shown as `2-...`. Set `HUBSPOT_ACCOUNT_ID` to the developer test account ID for your own reference.
4. Run `node index.js` and open `http://localhost:3000`.

The `.env` file is ignored by Git. **Never commit or share the private app token.**

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Retrieve game records and show Name, Genre, and Platform in a table |
| GET | `/update-cobj` | Show the form to add a game |
| POST | `/update-cobj` | Create a game in HubSpot and return to the homepage |

Run `npm test` to check the routes with a fake HubSpot client. The final check is to submit a new game through the form in the developer test account and confirm it appears in the homepage table.
