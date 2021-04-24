# shobi-node
This is a website made using **Node.js**, **Express** and **MongoDB** for the server.
It also uses **jQuery** and **ajax** for some parts of content loading, combined with **EJS** for rendering the pages.

You can check out a live version of it on https://shoby.herokuapp.com.

If you want to modify this project on your machine, clone the project using `git clone https://github.com/extremq/shobi-node.git`.
After that, run `npm install` inside the folder to fetch all the **node modules**.
You also need to create an `.env` file inside the project folder with the following variables:

    DATABASE_URL=mongodb://localhost/{your-database-name}
    SESSION_SECRET={a random string}
Now, you only need to run `npm run devStart` to fire up a server on `localhost:3000`. 
That's it!
