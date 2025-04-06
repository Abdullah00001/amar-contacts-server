# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]
### Added
- Initial release setup.
- API endpoints for user authentication, profile management, and post management.
- Basic role-based access control (RBAC) for authentication.
- Docker configuration for local and production environments.
- Swagger documentation for API.
- Redis caching for frequently accessed data.
- JWT-based authentication for API endpoints.

## [1.0.0] - 2025-02-08
### Added
- First production-ready release.
- Integrated Cloudinary for image storage and retrieval.
- CI/CD pipeline for automated Docker push and production deployment.
- Redis integration for better performance.
- Detailed error handling and logging with Winston and Morgan.
- Swagger API documentation for easy interaction with backend endpoints.
- Email service integration via SMTP for notifications and password reset.

### Changed
- Reworked database schema to optimize relationships between users, posts, and interactions.

### Fixed
- Fixed issue with authentication token expiration handling.
- Resolved minor bugs related to user feed filtering.

## [0.1.0] - 2025-01-15
### Added
- Initial project setup with TypeScript, Node.js, Express, Mongoose, and Redis.
- Basic user registration and login functionality.
- Basic post creation, deletion, and editing capabilities.

