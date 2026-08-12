# Quick Food — GitHub Pages Edition

This folder is a static conversion of the original PHP + MySQL Quick Food project.

## Why this version works on GitHub Pages

GitHub Pages cannot execute PHP or connect to MySQL. This edition replaces the PHP/MySQL backend with browser-side JavaScript and `localStorage`.

Included working flows:
- Home page and video hero
- Categories
- Food menu and search
- Add to cart / quantity / remove
- Registration
- Login / logout
- Profile editing
- Checkout
- Order success / printable invoice
- Demo admin dashboard
- Demo food deletion/addition

## Demo credentials

Customer:
- Username: `demo`
- Password: `demo123`

Admin:
- Username: `admin`
- Password: `admin123`

## Important

This is a GitHub Pages demo/static version. Data is stored in each visitor's browser using localStorage. It is not suitable for real payments, real user authentication, or production secrets.

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. Go to Settings → Pages.
4. Under Build and deployment choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for deployment.
7. Open the GitHub Pages URL.

The repository root contains `index.html`, so GitHub Pages can load the website.
