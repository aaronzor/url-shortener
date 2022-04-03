<h1 align="center">
  Node.js API Backend
</h1>

<div align="center">
  <sub>Built by Aaron McMullan </sub>
</div>

<div align="center">
  <img src="public/JavaScript frameworks-rafiki.png" width="30%"/>
</div>

<h2 align="center">
  Introduction
</h2>
<br>

This is a fully fleshed out web application backend, built using Node.js and Express.js. It is intended to be used as a groundwork to build upon,
so that I could quickly get a functioning backend up and running for new web applications with minimal effort.

Simply build any new application specific database schemas, controllers and routes into the API, everything else is already in place. The API was built to
work with MongoDB, but could easily be converted to make use of any other NoSQL database engine.

<hr>
<h2 align="center">
  Features
</h2>
<br>

    -Users
        - Because most of my applications include user registration / authentication I have made this baseline in the API
        - Create, Read, Update and Delete (CRUD) routes for users in the database
        - User roles, for example; 'admin' or 'user'
        - User authentication is achieved using Json Web Tokens (JWT) / Cookies
        - When a user registers they are automatically logged in
        - User passwords are hashed before being stored in the database - no plain text passwords are stored
        - Users log in with email & password
            - Entered plain text password is hashed and checked against hashed password stored in database
            - On sucessful login, a JWT will be sent along with the cookie to provide authentication to the server
            - On logout the JWT cookie is destroyed
        - Route to query the current logged in user for the session
        - Password reset
            - User can request to reset password
            - A hashed token will be emailed to the users registered email address
            - A put request can be made to the generated url to reset password
            - The token will expire after 10 minutes
        - Authenticated user may update their stored information - name, email etc
        - User CRUD is Admin only
        - Users must be set to Admin role manually in the database by a human

    - Other Baseline features
        - Pagination - this is part of the advancedResults middleware built into the API and can easily applied to any database query
        - Limit number of results per page
        - Filter by fields
        - Select specific fields in result
        - Built in geocoding - useful if your application needs to make use of maps / addresses / location data
        - Sophisticated middleware to allow for less repitition within the code, error handling, async function handling etc

<hr>
<h2 align="center">
 What else ?
</h2>
<br>

    - Security
        - NoSQL injection prevented with mongo-sanitize
        - Security headers
        - Built in cross site scripting prevention
        - Rate limiting
        - Http paramter pollution prevention
        - Password and reset token encryption
        - CORS rules can be easily changed if the API is not desired to be public

    - Data seeder for development and testing
        - Sample data is included in JSON files (_data folder)
        - Two commands:
        - 'node seeder -i' will populate the database with data in these JSON files
        - 'node seeder -d' will destroy all baseline data in the database (will not destroy custom schemas / documents)

<hr>
<h2 align="center">
 Use Case
</h2>
<br>

    - Included is a use case to demonstrate how the API could be used to provide a backend for a web application
    - Use case is a restaurant guide / reviews platform
        - Allows users with 'publisher' or 'admin' role to create restaurants and store them in the database
        - Allows users to create and leave reviews of stored restaurants - 'publishers' cannot create reviews
        - Geocoding creates detailed location information for restaurant using the address provided when creating restaurant listing
        - Database relationships between reviews - restaurants and reviews - users provides ownership of database entries
        - Restaurant average rating is automatically calculated based on reviews
        - Querying restaurants and reviews includes all advancedResults middleware, eg: Pagination, filtering, limiting results etc
        - Publisher can upload a photograph for restaurant profile, default storage in local files, but can easily be changed
        - Search for restaurants by postal code - uses geocoder to return all restaurants in a radius around a postal code

    This use case shows the versatility and depth of the API, any application can easily be integrated in the same way that this use case was,
    allowing for quick implementation of a feature rich backend for web applications

    All code specific to the use case is stored in the 'USECASE' folder or is clearly labeleld USECASE throughout the codebase, making it easily removed.

<hr>
<h2 align="center">
 Technologies used
</h2>
<br>

Tech Stack,

-   Database: MongoDB Atlas
-   Server: Express.js & Node.js
-   Route documentation hosted on S3
-   Enviornment: VScode, Postman, MongoDB Compass, AWS Console

<br>
<p align="center">
  <img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img alt="Ubuntu" src ="https://camo.githubusercontent.com/d6de31463470dd4540e7ece7849e6d38d423825f113ea4ae639f4dcfd0392d82/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5562756e74752d4539353432303f7374796c653d666f722d7468652d6261646765266c6f676f3d7562756e7475266c6f676f436f6c6f723d7768697465"/>
  <img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="JavaScript" src="https://img.shields.io/badge/javascript-%2343853D.svg?&style=for-the-badge&logo=javascript&logoColor=yellow&color=inactive"/>
  <img alt="AWS" src="https://camo.githubusercontent.com/0f9a0171a13165ad40c3a4ada30160e2a307d3c8f284b9dfb9d9ac8ebf9b7f1c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4157532d2532333243353236332e7376673f267374796c653d666f722d7468652d6261646765266c6f676f3d616d617a6f6e2d617773266c6f676f436f6c6f723d7768697465"/>
  <img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?&style=for-the-badge&logo=express"/>
</p>

<hr>
<h2 align="center">
 Route Documentation
</h2>
  <p align="center">Click <a style="text-decoration: underline; font-size: 18px" href="https://azr-static-site.s3.amazonaws.com/index.html">here</a> to view detailed documentation for all available end points in the API. Including routes used by the restaurant guide Usecase.</p>

<hr>
<h2 align="center">
 How to use / run 
</h2>

<p align="center">
  
</p>
