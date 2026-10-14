tour01

University virtual tour project — 3DVista edition.

This site is now only the shared shell around the tour, in whatever
language: the homepage, the pole-selection page, the header (university
logo + wordmark), the language switcher, and the background music. All
panorama images, the WebGL viewer, and every navigation/hotspot system
that used to live here have been permanently removed, including from the
source files (not just the photo folders).

How a pole page works now:
- Each pole page (economic.html, literary.html, science-tech.html,
  social-medical.html) keeps its header exactly as before.
- Its window.TOUR_CONFIG only holds poleKey/poleTitleAr/poleTitleEn and a
  "tourSrc" path.
- viewer.js reads tourSrc and embeds it full-screen in an <iframe> inside
  #viewer. That's the entire job of viewer.js now.

To plug in a 3DVista tour for a pole:
- Export the pole's project from 3DVista. 3DVista's own export names its
  entry file index.htm (not index.html) — this project's tourSrc paths
  already point at index.htm for every pole, so exporting normally and
  dropping the files in is enough, no path edit needed.
- Drop the exported files into assets/tours/<poleKey>/, overwriting the
  placeholder index.htm that sits there (along with everything else
  3DVista exports next to it: script.js, manifest.json, media/, skin/,
  lib/, etc. — leave those file names as 3DVista names them).
- The economic pole already has a real 3DVista export in place as of
  this update; the other three still only hold the placeholder index.htm
  saying "put the 3DVista export here".

poleKey per pole: economic, literary, science-tech, social-medical.

Existing music files and language files were intentionally left unchanged,
as was the university logo/wordmark sizing.

Serve this folder through a local web server (for example
`python3 -m http.server`) rather than double-clicking the HTML files, so
the iframes and other relative asset paths load correctly.

Phone layout (mobile.css):
- mobile.css resizes the header on phones only (width <= 700px, and landscape
  phones up to 950px wide / 500px tall): university crest, wordmark, music
  button, language button and the back button (Home / Poles).
- Desktop, laptop and tablet layouts are untouched. To change phone sizes,
  edit the numbers in the :root block at the top of mobile.css. To disable
  it completely, remove the <link href="mobile.css"> line from the pages.

Economic tour overlay (poles.html -> tour-overlay.js / tour-overlay.css):
- Clicking the Economic Pole card opens assets/tours/economic/index.htm in a
  full-screen overlay on top of poles.html.
- While it is open the page header stays on top of the tour (crest, wordmark,
  pole name, music, language) and a "Poles" button replaces "Home"; that
  button, the Esc key and the browser Back button all close the tour and
  return to poles.html exactly as it was (scroll position included).
- A new iframe is created on every opening (and removed on closing). Do not
  re-use one iframe: pointing an existing iframe at a new address adds extra
  browser-history entries and breaks the Back button.
