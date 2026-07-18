# EOG Monitoring

A website for monitoring EOG data.

### The Model is pre-train by me using Tensorflow and Keras. The Dataset came from http://www.drozy.ulg.ac.be. I manually labeling all the data based on KSS (Karolinska Sleepiness Scale) level.

<video src="./video ppt.mp4" width="100%" controls></video>

## Folder Structure

```
├───controllers
├───db
│ ├───migrations
│ └───models
├───public
│ ├───model
│ └───socket.io
├───routes
└───views
```

## Installation Process

1. Create a database named `eog_monitoring`
2. Run the command `npm i` to install all the required packages
3. Run the command `npm run migrate` to create the tables defined in the `db/migrations/*js` folder
4. Run the command `npm run dev` to run the website

## Features

- Displays EOG graphs retrieved from the database by accessing the URL `http://localhost:3001/`
- Insert data via the URL `http://localhost:3001/data/` using the `POST` method with the following example body:

```
{
  "time": 10
  "data": 30.78
}
```
