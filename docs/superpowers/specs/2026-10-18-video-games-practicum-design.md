# Video games practicum design

## Goal

Build the HubSpot Academy practicum app around a Video games custom object with three string properties: Name, Genre, and Platform. The test account will contain at least three records, and the object schema will be associated with contacts.

## Application

- `GET /` retrieves the custom object records and renders `views/homepage.pug` as a table with Name, Genre, and Platform columns plus an "Add to this table" link.
- `GET /update-cobj` renders `views/updates.pug` with the required title, three input fields, and a "Return to the homepage" link.
- `POST /update-cobj` validates the three fields, creates a HubSpot record, and redirects to `/` after success.
- A failed HubSpot call displays a useful error and logs diagnostic details without exposing the access token.

## Configuration

The private app token, custom object type ID, and the three HubSpot internal property names come from `.env`, which remains ignored by Git. An example environment file documents the required names without secrets. The README explains setup and contains the test account custom object list URL once known.

## Verification

Automated tests cover form rendering, GET data rendering, POST payload and redirect, validation, and API failures with a local fake HTTP client. A live manual check in the user's HubSpot test account confirms that submitting a game adds it to the homepage table.

## Submission checklist

Use a developer test account; grant the listed private app scopes; create and associate the Video games object; add three records; include the object list link in README; merge `working-branch` into `main`; submit the public fork URL. Do not commit the access token.
