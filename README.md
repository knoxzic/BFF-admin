# BFF-admin

Admin portal for Best Face Forward.

## Preview Link

For local preview, run:

```bash
cd admin-portal
npm install
npm start
```

Then open:

- http://localhost:3000

For the hosted GitHub Pages preview, visit:

- https://knoxzic.github.io/BFF-admin/

> Use the preview credentials on the login screen:
> - **Email / Username:** `admin999`
> - **Password:** `$Kg4lyfe2`

## Structure

- `admin-portal/` — React admin portal
- `admin-portal/.env.example` — API config example
- `admin-portal/public/index.html` — app shell
- `admin-portal/src/` — React source files

## Backend

Update `REACT_APP_API_BASE_URL` in `.env` to point to your backend API.
