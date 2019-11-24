# Super 6 Rugby
This is for the First Assignment for the 2019 MSc for Digital &amp; Technology Solutions Specialist.

## Why Rugby?
The day we started brainstorming our plan together, it was the start of the 2019 Rugby World Cup, so why not?

## Game Format
See [Game Format](docs/game_format.md)

## Technical Documentation
* [User Interface Views](docs/ui_views.md)
* [Module Breakdown](docs/code_modules.md)

## Get Started
  On a terminal (cmd), follow these steps:
  1. Clone this repository from github
    * `git clone https://github.com/msc-dtss/super6assignment.git`
  2. Navigate into the folder
    * `cd super6assignment`


### Running with the Source Code
Ensure MongoDB is running on your system on the default port, the app will attempt to connect to the 'super6db' database on this server.

  1. Install the npm packages
      * `npm install`
  2. Run the express app with nodemon
      * In development mode: `npm start`
      * In production mode: `NODE_ENV=production npm start`
  3. The app should now be available on [http://localhost:3000](http://localhost:3000)

If you'd like to use a different port, change the `port` value in the configuration file `config/config.json`.

**Note:** You can force the Database to be seeded with an environment variable `SUPERSIX_FORCE_SEED` set to `"true"`.

### Docker
#### Building
To build a docker image based on the current source code
```bash
docker build -t shu-ddsa/rugbysuper6 .
```

#### Running
```bash
docker run -tid \
  --name rugbysuper6 \
  -p0.0.0.0:3000:3000 \
  --env SUPERSIX_FORCE_SEED=true \
  shu-ddsa/rugbysuper6
```

The app should now be available on [http://localhost:3000](http://localhost:3000)

## Developing
Use the git commands when you make changes (Visual Studio Code has a nice gui for this out of the box)

   * `git pull` - pull the latest changes from github
   * `git add FILE` - add a file or file changes to the stage
   * `git commit -m 'MESSAGE'` - commit the staged changes with a descriptive message
   * `git push` - push the committed changes back to github

# Group:
* [Chris](https://github.com/TheQuietPotato)
* [Mike](https://github.com/MikeKeightley)
* [Millan](https://github.com/AMIllan75)
* [Neil](https://github.com/neilmusgrove)
* [Tiago](https://github.com/dosaki)
