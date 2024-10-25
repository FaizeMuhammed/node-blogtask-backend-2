Blog Application Backend
This is the backend for a blog application built using Node.js and Express. It provides a RESTful API for user authentication, blog post management, and user management. The backend is set up with MongoDB as the database and JWT for authentication.

Table of Contents
Features
API Routes
Installation
Environment Variables
Starting the Server
Project Structure
Features


Install dependencies:

bash

npm install

To start the server, use:

bash

node server.js
Or for development (with auto-restart using Nodemon):

bash

npm run dev

The server will be running on http://localhost:5000 by default (or the port specified in .env).

User Authentication: Register, login, and logout with JWT-based authentication.
Blog Post Management: CRUD operations for blog posts, with additional functionalities like liking, unliking, and commenting on posts.
User Management: Admin users can view, update, block, and unblock users.
API Routes
Auth Routes
Endpoint	Method	Description
/api/auth/register	POST	Register a new user.
/api/auth/login	POST	Log in an existing user.
/api/auth/logout	GET	Log out the current user.
Post Routes
Endpoint	Method	Description
/api/posts/	POST	Create a new post (protected).
/api/posts/	GET	Retrieve all posts.
/api/posts/:id	GET	Retrieve a single post by ID.
/api/posts/:id	PUT	Update a post by ID (protected).
/api/posts/:id	DELETE	Delete a post by ID (protected).
/api/posts/:id/like	POST	Like a post (protected).
/api/posts/:id/unlike	POST	Unlike a post (protected).
/api/posts/:id/comment	POST	Add a comment to a post (protected).
/api/posts/:id/comment/:commentId	DELETE	Delete a comment (protected).
User Routes
Endpoint	Method	Description
/api/users/	GET	Retrieve all users (protected, admin only).
/api/users/:id	GET	Retrieve a single user by ID (protected, admin only).
/api/users/:id	PUT	Update a user's information (protected, admin only).
/api/users/:id	DELETE	Delete a user (protected, admin only).
/api/users/:id/block	PUT	Block a user (protected, admin only).
/api/users/:id/unblock	PUT	Unblock a user (protected, admin only).