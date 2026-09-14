# API checks (for non-BE folks)

Run the API first: from repo root, `pnpm dev:api` (leave that terminal open).

Use a **second terminal** for the commands below. The `%` at the end of a line is normal (zsh).

---

## 1. Already working — cities (no login)

```bash
curl -s http://localhost:3000/api/v1/reference/cities | jq .
```

You should see Kyiv, Lviv, etc.

---

## 2. Legal pages (no login)

```bash
curl -s "http://localhost:3000/api/v1/legal/privacy?lang=en" | jq .
curl -s "http://localhost:3000/api/v1/legal/terms?lang=uk" | jq .
```

Stub text is expected until client supplies real copy.

---

## 3. Full doctor sign-up (4 steps + login check)

### Step 1 — start registration

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register/step-1 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "doctor",
    "firstName": "Test",
    "lastName": "Doctor",
    "email": "doctor.test@example.com",
    "password": "password123",
    "acceptedPrivacy": true,
    "acceptedTerms": true
  }' | jq .
```

Copy `registrationId` from the JSON.

Copy **`devVerifyToken`** from the same JSON (development only).  
Or find `verifyToken` in the **API terminal** log.

### Step 2 — verify email

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "registrationId": "PASTE_REG_ID",
    "token": "PASTE_VERIFY_TOKEN"
  }' | jq .
```

### Step 3 — doctor profile (multipart)

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register/step-3/doctor \
  -F "registrationId=PASTE_REG_ID" \
  -F "dob=1990-01-15" \
  -F "cityId=city_kyiv" \
  -F "clinicId=clinic_kyiv_center" \
  -F "specialty=family_doctor" \
  -F "yearsPractice=5" \
  -F "visitDurationMinutes=30" \
  -F "licenseFile=@/path/to/license.pdf" | jq .
```

(`licenseFile` is optional.)

### Step 3 — patient profile (JSON)

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register/step-3/patient \
  -H "Content-Type: application/json" \
  -d '{
    "registrationId": "PASTE_REG_ID",
    "dob": "1990-05-20",
    "gender": "female",
    "cityId": "city_kyiv",
    "clinicId": "clinic_kyiv_center"
  }' | jq .
```

### Step 4 — finish (creates user + cookie)

Save cookies to a file:

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register/complete \
  -H "Content-Type: application/json" \
  -c /tmp/medicly-cookies.txt \
  -d '{"registrationId": "PASTE_REG_ID"}' | jq .
```

### Step 5 — doctor schedule (must use cookie from step 4)

```bash
curl -s http://localhost:3000/api/v1/doctors/me/schedule \
  -b /tmp/medicly-cookies.txt | jq .
```

Expect `basePriceUah: 600`, `supportedFormats: ["offline"]`, Mon–Fri 09:00–18:00.

---

## 4. Login (if you already have an account)

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c /tmp/medicly-cookies.txt \
  -d '{"email": "doctor.test@example.com", "password": "password123"}' | jq .

curl -s http://localhost:3000/api/v1/auth/me -b /tmp/medicly-cookies.txt | jq .
```

---

## After pulling new BE code

If we added database tables:

```bash
pnpm db:migrate
```

(Uses `DIRECT_URL` in `apps/api/.env` — session pooler port 5432.)
