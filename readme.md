# MERN URL Shortener Application

## Project Overview

### Project Purpose

This personal project is intended to showcase and hone an array of skills specific to the use of a collection of technologies that make up the MERN technology stack. As well as learn major new skills by implementing the front end of the application in typescript. The project will bolster my personal portfolio with a high quality finished application that has been developed using industry level techniques and testing methods, delivered and deployed using CI/CD pipelines.

### General Overview

Simply put, the application is intended to allow users to shorten web URLs, allowing for a more mobile / social media friendly length. The API will be able to redirect users to the original long URL when a GET request is made to the shortened URL.
On the surface the application is simple, as users will be able to make use of the core functionality of the application without being authenticated, this allows for a quick and simple use of the application. However, if desired, users will be able to create an account and authenticate. Allowing them to make use of more features, such as storing URLs, deleting, updating and so on.

## Project Requirements

### Backend

- Authentication & Users
  - Authentication will be done using JWT/cookies
    - JWT and cookie should expire in 30 days
  - User registration
    - Register as a "user" or "admin" ("admin" role will need to be set manually in the database)
    - Once registered, a token will be sent along with a cookie (token = xxx)
    - Passwords must be hashed
  - User login
    - User can login with email and password
    - Plain text password will compare with stored hashed password
    - Once logged in, a token will be sent along with a cookie (token = xxx)
  - User logout
    - Cookie will be sent to set token = none
  - Get user
    - Route to get the currently logged in user (via token)
  - Password reset (lost password)
    - User can request to reset password
    - A hashed token will be emailed to the users registered email address
    - A put request can be made to the generated url to reset password
    - The token will expire after 10 minutes
  - Update user info
    - Authenticated user only (admin)
    - Separate route to update password
  - User CRUD
    - Admin only
  - Users can only be made admin by updating the database field manually
  - Users must activate their account after creation, before being allowed to log in
- URLs
  - Short URL Creation
    - Be able to create new short URLs as both an unauthenticated and authenticated user
    - If user is logged in, create URL under their ownership
    - Balance the likelihood of duplicate URL IDs with URL ID length - It is desirable to keep IDs short, but not too short as duplicates are more likely
  - Redirect
    - Redirect to original URL on GET request to short URL
  - URL CRUD
    - Allow CRUD functionality to owned URLs via frontend UI for authenticated users
- Security
  - Encrypt passwords and reset tokens
  - Prevent cross site scripting - XSS
  - Prevent NoSQL injections
  - Add a rate limit for requests of 100 requests per 10 minutes
  - Protect against http param polution
  - Add headers for security (helmet)
- Documentation
  - Use Postman to create documentation
  - Use docgen to create HTML files from Postman
  - Add html files as the / route for the api
- Deployment
  - Push to Github
  - Deploy full stack application to AWS
    - Frontend React application to be deployed to AWS Aplify
    - Backend Node application to be deployed to Elastic Beanstalk
      - Run on minimum viable hardware for to ideally stay in AWS free tier
  - CI / CD
    - Deploy these solutions via Github, allowing AWS to automatically provision and launch new production builds
- Code Related Suggestions
  - NPM scripts for dev and production enviornments
  - Config file for important constants
  - Use controller methods with documented descriptions/routes
  - Error handling middleware
  - Authentication middleware for protecting routes and setting user roles
  - Validation using Mongoose and no external libraries
  - Use async/await (create middleware to clean up controller methods)
  - Create a database seeder to import and destroy data (for testing and development use)
- To be decided factors
  - Consider using DynamoDB instead of MongoDB for better AWS integration

### Frontend

For this project I intend to develop the frontend using Typescript, to develop new in demand skills and gain a better understanding of strongly typed languages.

- Implement Light / Dark theme
- Smooth page transitions
- Use some form of loading spinner / bar
- Landing Page
  - Simple centered input box
  - Allow users to immediately and easily create a short URL without logging in
  - Links to allow users to log in / register a new account
- Login Area
  - Login form with all standard features (forgot password, register new account etc)
- Dashboard Area
  - Allow authenticated users to see all previously created short URLs
  - Create new short URL as logged in user
  - Update and delete previously created short URLs
  - Show created URLs in a searchable table format
  - Allow users to change password
  - Allow users to update personal information such as name
- Frontend packages
  - Mostly still to be decided, however some mandatory packages
    - React
    - Axios
- Testing
  - Keen to develop testing skills I will write tests throughout development and complete a full testing phase after the main development stage is complete
  - Testing using React Testing Library and / or Jest
