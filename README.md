
# Super 6 Rugby
This is for the First Assignment for the 2019 MSc for Digital &amp; Technology Solutions Specialist.

Why rugby? The day we started brainstorming our plan together, it was the start of the 2019 Rugby World Cup, so why not?

## Table of Contents
- [Super 6 Rugby](#super-6-rugby)
  * [Authors:](#authors)
- [Running](#running)
  * [... pre-deployed app](#-pre-deployed-app)
  * [... from cloned repository](#-from-cloned-repository)
  * [... from release](#-from-release)
  * [... from Docker](#-from-docker)
- [Contributing](#contributing)
  * [Game Format](#game-format)
  * [Technical Documentation](#technical-documentation)
  * [Using git](#using-git)
  * [Get Started](#get-started)
  * [Building](#building)

## Authors

* [Chris](https://github.com/TheQuietPotato)
* [Mike](https://github.com/MikeKeightley)
* [Millan](https://github.com/AMIllan75)
* [Neil](https://github.com/neilmusgrove)
* [Tiago](https://github.com/dosaki)


# Running
You can try the application using any of the methods below

## ... pre-deployed app
Just go to [https://rugbysuper6.herokuapp.com/](https://rugbysuper6.herokuapp.com/)


## ... from cloned repository
Dependencies:

* `git`
* `node` (12 or above)
* `npm`
* `mongodb`

Assuming you have all dependencies installed and `mongodb` is running with the default settings, you can get the application and start it with the commands below:
```bash
# -----------------
# For Linux/MacOS
# -----------------
git clone https://github.com/msc-dtss/super6assignment.git # Clone the repository
cd super6assignment                                        # Change directory into the cloned repo
npm install                                                # Install node dependencies
SUPERSIX_FORCE_SEED=true                                   # Ensure the database is seeded
                                                           # (Only use this the first time you run the application.
                                                           # Otherwise it will reset your DB)
NODE_ENV=production node ./bin/www                         # Start the application in Production Mode
```

```bat
rem -----------------
rem For Windows
rem -----------------
rem Clone the repository
git clone https://github.com/msc-dtss/super6assignment.git
rem Change directory into the cloned repo
cd super6assignment
rem Install node dependencies
npm install
rem Set the environment to production
set NODE_ENV=production
rem Ensure the database is seeded (only use this the first time you run the application. Otherwise it will reset your DB)
set SUPERSIX_FORCE_SEED=true
rem Start the application
node bin/www
```

## ... from release
Dependencies:

* `node` (12 or above)
* `npm`
* `mongodb`

1. Download `rugbysuper6.zip` in the [latest release](https://github.com/msc-dtss/super6assignment/releases/latest) on the [releases page](https://github.com/msc-dtss/super6assignment/releases/)
2. Unzip the archive using whatever method you prefer
3. Start a command-line on the new folder you've just extracted (`rugbysuper6`)
4. Run the Linux/MacOS or the Windows commands below
```bash
# -----------------
# For Linux/MacOS
# -----------------
npm install                        # Install node dependencies
SUPERSIX_FORCE_SEED=true           # Ensure the database is seeded
                                   # (Only use this the first time you run the application.
                                   # Otherwise it will reset your DB)
NODE_ENV=production node ./bin/www # Start the application in Production Mode
```

```bat
rem -----------------
rem For Windows
rem -----------------
rem Install node dependencies
npm install
rem Set the environment to production
set NODE_ENV=production
rem Ensure the database is seeded (only use this the first time you run the application. Otherwise it will reset your DB)
set SUPERSIX_FORCE_SEED=true
rem Start the application
node bin/www
```

## ... from Docker

Dependencies:

* `docker`

You should be able to run the commands below on Windows, Linux and MacOS:

```
docker pull mscdtss/rugbysuper6
docker run -tid \
  --name rugbysuper6 \
  -p0.0.0.0:3000:3000 \
  --env SUPERSIX_FORCE_SEED=true \
  mscddsa/rugbysuper6
```

You should be able to access the application on [http://localhost:3000/](http://localhost:3000/).

**Note:** Setting `SUPERSIX_FORCE_SEED=true` will force the seeding of the database (i.e. it will overwrite any changes you might've made).

# Contributing
## Game Format
See [Game Format](docs/game_format.md)

## Technical Documentation
### General
* [Code Style (vscode)](.vscode/settings.json) (ensure your personal styles don't conflict with these)

Further documentation in the code as docstrings, or under `docs/code/` when obtaining [the release](https://github.com/msc-dtss/super6assignment/releases/latest).

### Architecture
![Rough architecture](https://raw.githubusercontent.com/msc-dtss/super6assignment/master/docs/images/architecture.png)

We try to keep our routes light by delegating the work of dealing with the database or performing any data transformation to the services layer.

The services also serve as the traditional model layer since with MongoDB it didn't feel right to create objects that would represent entities in the database.

## Using git
Use the git commands when you make changes (Visual Studio Code has a nice gui for this out of the box)

   * `git pull` - pull the latest changes from github
   * `git add FILE` - add a file or file changes to the stage
   * `git commit -m 'MESSAGE'` - commit the staged changes with a descriptive message
   * `git push` - push the committed changes back to github

## Get Started
Ensure MongoDB is running on your system on the default port, the app will attempt to connect to the 'super6db' database on this server.

On a terminal (cmd), copy the code below (depending on your system: Windows or Linux/MacOS)

```bash
# -----------------
# For Linux/MacOS
# -----------------
git clone https://github.com/msc-dtss/super6assignment.git # Clone the repository
cd super6assignment                                        # Change directory into the cloned repo
npm install                                                # Install node dependencies
SUPERSIX_FORCE_SEED=true                                   # Ensure the database is seeded
                                                           # (Only use this the first time you run the application.
                                                           # Otherwise it will reset your DB)
npm start                                                  # Start the application in Production Mode
```

```bat
rem -----------------
rem For Windows
rem -----------------
rem Clone the repository
git clone https://github.com/msc-dtss/super6assignment.git
rem Change directory into the cloned repo
cd super6assignment
rem Install node dependencies
npm install
rem Ensure the database is seeded (only use this the first time you run the application. Otherwise it will reset your DB)
set SUPERSIX_FORCE_SEED=true
rem Start the application
npm start
```

`npm start` runs `nodemon ./bin/www` which will run the express server and take care of reloading it when changes are made.

The app should now be available on [http://localhost:3000](http://localhost:3000)

If you'd like to use a different port, change the `port` value in the configuration file `config/config.json`.

## Building

### Locally
Simply run `./build.sh` to create a zip archive locally.

### Automatically
The code gets tested and packaged into a zip automatically via github actions. This is available as draft releases on the [releases page](https://github.com/msc-dtss/super6assignment/releases/).

Once we're happy with a particular release, we should change the name to match the version in [`package.json`](package.json) and publish that release.

### Docker
Docker gets automatically built via the dockerhub automated builds.

You can find it here: [https://hub.docker.com/r/mscdtss/rugbysuper6](https://hub.docker.com/r/mscdtss/rugbysuper6)
