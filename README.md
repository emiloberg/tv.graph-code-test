# Pair coding exercise

We'll be implementing a simple middleware server that will accept a (fake) requests from a client and fetch all necessary data to present the page to the client. Very much like what our GraphQL server is doing. We're coding against our real APIs.

## Your task: Console.log (the data for) a page

Getting all the data needed to render a page to the screen is, at the most minimal level, a 3 step thing.

![Screenshot of C More](/docs/page-panel-medias.png)

1. This first step is already built for you. Fetch a `page definition`. The page definition contains information about what `panels` (rows, e.g "Latest movies" with 10 movies in the list) are on that page, and for each panel:

   - how to fetch the content (movies, series, etc) of the panels, and
   - some metadata about the panel (e.g. the panel title).

2. Fetch the content of every panel. The content is typically just a list of media id's (`["m-996959", "m-997010", "..."]`).
3. Fetch the actual media data (which is information such as `title`, `description`, `images`, playback, and a lot more) for every media id.

When we're done, something like this should be output to the console, the title of the panels and the title of the first couple of media items in each of them. (In the real world we'd send this to the client to render.)

```json
[
 {
   "panelTitle": "Topplistan hyrfilmer",
   "items": [
     { "id": "m-996959", "title": "The Outpost" },
     { "id": "m-997010", "title": "Final Target" },
     { "id": "m-1177741", "title": "Greta" },
     { "id": "m-28819", "title": "Solsidan" },
     { "id": "m-941904", "title": "The Doorman"
    }
   ]
 },
 {
   "panelTitle": "Veckans tips",
   "items": [
     { "id": "m-109576", "title": "Episode 21" },
     { "id": "m-3975607", "title": "Antikrundan" },
     { "id": "m-113168", "title": "The Game That Moves As You Play" },
     { "id": "m-1578182", "title": "Dataland"
    }
   ]
 },
 ...
]
```

There's already some code built. If you have a look at `index.ts` you'll see that there's a `main` function that fetches (and makes some data transformation to) the page definition, so step 1 in already done. You most probably don't need to change any code in `/helpers`.

## Good things to know

- **Resilience** and **performance** is really important for us. We get tens of thousands of simultaneous requests and don't want to break the service when it's UEFA Finals.
- This is a made up exercise, feel free to make dummy implementations
- There're two additional functions available that you will want to use, `helpers/fetch-panel-content.ts` and `helpers/fetch-media.ts`.
- There's a `helpers/types.ts` file with some types that you might want to use, especially:
  - `Media`
  - `PanelDefinition`
  - `EditorialPanelResponse`
- `npm run dev` will start the machine
- There's absolutely no "things to pass" or gotchas. We simply want to see how you reason around code.
- We're here to help you! Talk to us and ask us.
