Replace the existing Instagram and Facebook account URLs with the new ones provided by the user wherever they appear in the codebase.

**New URLs**
- Instagram: `https://www.instagram.com/car._.rental._.bengaluru?igsh=MTFpZXBjdGE0am5tbg==`
- Facebook: `https://www.facebook.com/share/1BC8ZkNNXz/`

**Files to update**
1. `src/components/InstagramHighlights.tsx` – update `INSTAGRAM_URL` and `FACEBOOK_URL` constants used by the "Follow on Instagram" and "Follow on Facebook" buttons.
2. `src/components/Footer.tsx` – update the Instagram and Facebook social-link `href` values and the Instagram display handle text.

**Out of scope**
- Instagram highlight story deep-links (Bookings Confirmed, Happy Customers) will remain unchanged unless explicitly requested, as they point to specific stories, not the account profile.
- WhatsApp, Maps, phone, and email links remain unchanged.

**Verification**
- After the edit, search the codebase again to confirm no old Instagram/Facebook account URLs remain.