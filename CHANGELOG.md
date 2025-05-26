# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

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
