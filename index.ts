import { fetchPage } from './helpers/fetch-page';
import { PanelDefinition } from './helpers/types';

const handlePanels = async ({ panelDefinitions }: { panelDefinitions: PanelDefinition[] }) => {
  /**
   * Here's where you build your implementation
   */

  return 'I need implementation! 🥳';
};

const main = async () => {
  const pageId = 'movies';

  const { panelDefinitions } = await fetchPage({ pageId });
  const output = await handlePanels({ panelDefinitions });

  console.log(require('util').inspect(output, { showHidden: true, depth: null, colors: true, breakLength: 200 }));

  /**
   * Should output something along the lines of:
   *
   *  [
   *   {
   *     "panelTitle": "Topplistan hyrfilmer",
   *     "items": [
   *       { "id": "m-996959", "title": "The Outpost" },
   *       { "id": "m-997010", "title": "Final Target" },
   *       { "id": "m-1177741", "title": "Greta" },
   *       { "id": "m-28819", "title": "Solsidan" },
   *       { "id": "m-941904", "title": "The Doorman"
   *      }
   *     ]
   *   },
   *   ...
   * ]
   *
   */
};

main();
