Quoter
======

A journal that cures writer's block.
Write about anything, and related quotes
will appear before you.

![Landing Page](https://i.imgur.com/7Bq8xl5.png)

Live App
--------
https://loxphordex-quoter-client.now.sh

API
---

Quoter uses the TheySaidSo API:
https://theysaidso.com/api/#

Every few seconds, your journal will be scanned
for a category. This category will be run through
the TheySaidSo API like so:
GET http://quotes.rest/quote/search.json?category=<category>

Note: this is a private endpoint. The link above will
not work without a paid token. But don't worry, Quoter
is free!

Authorization
-------------

Users can sign up to save their entries for later.
More user functions are in development.

Summary
-------

Creative writing requires a lot of inspiration. The idea
for this app came from a brainstorming session about the topic of 
inspiration and writer's block. 

This app is meant to be accessible to everybody, which is
why an account is not required. A user with writer's block
probably lacks interest in signing up for yet another web
service.

Quoter is not a full-scale writing app. It is simply
a quick tool for sparking an idea, or for discovering
a new author.

Tech
----

Client: HTML, JS, CSS3, React, React-Router-Dom, 
Node.js, JWT, Enzyme, Chai

Server: JS, Node.js, Express, Knex, Postgres, Postgrator, SQL, JWT, Nodemon, CORS, Helmet, Morgan, Supertest, Mocha, Chai, XSS, bcryptjs

Deployment: Zeit, Heroku