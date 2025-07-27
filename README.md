# Itch.io collection copy script

Simple puppeteer script for copying a specific collection to a new collection for the logged in user.
NOTE: This script always creates a new collection and adds all of the items to it.

Collection is created as `${collectionName}_by_{author}`

To start add following env variables to your `.env` file:

- USERNAME - Your itch.io username
- PASSWORD - Your itch.io password
- COLLECTION_URL - Link to collection on itch.io

Then run `pnpm run puppet`
