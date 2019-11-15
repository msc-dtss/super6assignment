# MongoDB Collections

In this folder, we've got the seed database that we should all have.

If you add something to it that is needed for the application to work, please remember to re-export your DB, and save the resulting `*.json` files here.

Remember to commit and push!

## Importing into the database

This is done automatically by the application when it starts up.
It will clear your DB and import the json data in this folder.

## Exporting the database

To export the database into this folder, please run `export.sh` (linux, mac, and windows with gitbash) or `export.bat` (windows).
