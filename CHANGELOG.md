# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [v1.3.0] - 2025-06-22

### 🚀 Features
- **Swagger Documentation**: Added OpenAPI (Swagger) documentation for the entire API.
- **Feedback Module**: Implemented feedback endpoint. [#19]
- **Profile Management Enhancements**:
  - Added delete account endpoint.
  - Added change password endpoint and refactored `PasswordUtils`.
  - Added get and update profile endpoints.
- **Contact Management Improvements**:
  - Added search endpoint. [#17]
  - Added CRUD support for contacts including:
    - Create, get one, update one
    - Trash (soft delete), bulk add to trash
    - Delete contact (hard delete)
    - Favorite/unfavorite toggle
    - Get favorites and trashed contacts

### 🧪 Tests
- Added unit tests for:
  - `UserRepository` and its `findUserByEmail` method
  - `PasswordUtils`
  - `MailOptions` utility
  - `getEnvVariables` utility (including error case)
  - `CookieUtils` and `CalculationUtils` with edge cases
- Refactored utility tests and removed incomplete module tests due to lack of domain knowledge.
- Setup the test environment and enhanced build script to run tests.

### 🛠️ Refactor
- Refactored `CookieUtils` to wrap methods inside an object.
- Refactored utility logic to increase testability and reliability.

### 🧹 Chores & Docs
- Updated `README.md`, `SECURITY.md`, and `LICENSE` files.
- Enhanced internal documentation.
- Improved build Bash script with better UI and automation.
- Bumped version and prepared for release.

## [v1.2.0] - 2025-05-27

### ✨ Added

- **Forgot Password Flow**: Implemented full step-based recovery process with secure HTTP-only cookie validation.

  - `POST /auth/recover/find` – Locate user by email/username (includes verification checks)
  - `POST /auth/recover/sent-otp` – Send OTP for password recovery (requires Step 1 token)
  - `POST /auth/recover/verify` – Verify submitted OTP (requires Step 2 token)
  - `POST /auth/recover/resent` – Resend OTP (requires Step 2 token)
  - `PATCH /auth/recover/reset` – Reset user password (requires Step 3 token)

- **Step Access Check Endpoints** (validate HTTP-only cookie tokens):

  - `POST /auth/recover/check/stp1`
  - `POST /auth/recover/check/stp2`
  - `POST /auth/recover/check/stp3`

- **New Utility**: `expiresInTimeUnitToMs()`
  - Converts time strings like `1d`, `1h`, `30m`, `15s`, `200ms` into milliseconds for consistent expiration handling.

### ♻️ Changed

- **Refactored Cookie Options Utility** for better reusability and configuration across authentication flows.
- **Reorganized Forgot Password Architecture**:
  - Modular design using middleware, service, and handler layers.
  - Improved readability, scalability, and testability.

### 🔧 Notes

- This release is **backward-compatible**.
- The recovery flow is now secure, modular, and prepared for enhancements like rate limiting, cooldown timers, and detailed analytics.

## [1.1.2] - 2025-05-26

### Changed

- Updated CORS whitelist to include new client URL due to migration from Vercel to Render.

## [v1.1.1] - 2025-05-26

### 🔧 Fixed

- Resolved `Set-Cookie` issues in both local and production environments by ensuring correct `SameSite`, `Secure`, and `Path` configurations.
- Fixed TypeScript error in `sharedCookieOption` by explicitly typing `SameSite` property as `'none' | 'lax' | 'strict'`.
- Corrected optional parameter handling in `cookieOption` utility to safely accept `null` values.

### ✨ Improved

- Standardized cookie names and behavior across all auth and recovery flows.
- Cleaned up redundant cookie clearing logic with reusable `sharedCookieOption`.
- Enhanced error logging for more precise debugging in user controller methods.

### ✅ Compatibility

- Verified proper cross-origin support with CORS `credentials: true` and frontend `withCredentials: true`.
- Confirmed token cookie delivery under HTTPS with correct `SameSite: 'none'` and `Secure: true` setup.

## [v1.1.0] - 2025-05-26

### Added

- Introduced complete "Forgot Password" feature:
  - Endpoint to **find user** by email.
  - Endpoint to **verify user identity** and send a secure OTP to the registered email.
  - Endpoint to **verify OTP** submitted by the user.
  - Endpoint to **reset password** securely after successful OTP verification.

### Fixed

- All forgot password flow endpoints tested and verified.
- Addressed potential bugs in OTP handling and password reset logic during development.

### Notes

- This version enhances account recovery functionality and improves user experience in case of forgotten credentials.
- Passwords are now correctly hashed during recovery to ensure secure storage.

## [v1.0.5] - 2025-05-23

### Fixed

- Removed the hardcoded `domain` from cookie options in production to ensure cookies are correctly set in cross-origin environments (e.g., frontend on Vercel, backend on Render).
- Made `domain` optional in the `CookieOptions` interface to improve type flexibility and prevent misconfiguration.

## [1.0.4] - 2025-05-23

### Added

- Resend OTP email endpoint to enhance the email verification process and user experience.

### Notes

- No rate limiting is applied to the endpoint; consider implementing request throttling or cooldown logic in future updates.

## [1.0.3] - 2025-05-22

### Fixed

- Fixed production CORS issue caused by incorrect protocol (`http` instead of `https`) in the `corsWhiteList` configuration.
- Updated environment configuration to ensure the correct client origin is whitelisted for secure cross-origin requests.

### Notes

- This fix restores proper CORS behavior in production, resolving authentication/session issues caused by the mismatch in protocol.

## [1.0.2] - 2025-05-22

### Fixed

- Fixed CORS and cookie configuration issue that prevented proper credential sharing between frontend and backend.
- Updated CORS middleware settings to allow credentials and correct origin headers.
- Ensured secure and consistent cookie handling across environments (local and production).

### Notes

- This patch ensures seamless frontend-backend integration, especially for authentication workflows relying on cookies.

## [1.0.1] - 2025-05-22

### Fixed

- Resolved Docker build failure caused by `tsc-alias` execution.
- Ensured proper TypeScript compilation and alias path rewriting in the Docker environment.
- Updated `build.sh` and `tsconfig` to support consistent builds across environments.

### Notes

- This patch improves Docker compatibility and stabilizes the CI/CD pipeline for containerized deployments.

## [1.0.0] - 2025-05-22

### Added

- Complete authentication module with the following endpoints:
  - `Signup`: Register a new user.
  - `Login`: Authenticate existing users.
  - `Verify`: Email or OTP-based verification (if applicable).
  - `Check`: Validate current session or token.
  - `Refresh`: Generate new access tokens using refresh tokens.
  - `Logout`: Invalidate session and tokens.
- JWT-based access and refresh token implementation.

### Notes

- This is the first production-ready pre-release (`v1.0.0`).
- Focused on core authentication features and stable API structure.
- Marks the foundational milestone for future modules and public deployment.

## [Unreleased]

### Added

- Initial release setup.
- API endpoints for user authentication, profile management, and post management.
- Basic role-based access control (RBAC) for authentication.
- Docker configuration for local and production environments.
- Swagger documentation for API.
- Redis caching for frequently accessed data.
- JWT-based authentication for API endpoints.
