## Folder Responsibilities

### controllers/
* Logic for handling requests and responses for each resoource.

### db/
* Code responsible for connecting the app to MongoDB (db connection).

### middleware/
* Reusable code that runs during request and response cycle.

### models/
* Layer/code between controllers and db - handles actual getting, adding, updating, and deleting data in the db.  

### routes/
* Defines API endpoints & connects them to their controller.

