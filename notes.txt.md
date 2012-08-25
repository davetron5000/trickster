# conman - create and present a nice presentation, quickly

conman allows you to do a few things:

* Author a presentation in Markdown instead of a GUI
* Allow anyone to connect to your laptop to view the presentation on their screen
* Have a "presenter view" either in another window or another device


## Authoring

Authoring is just like showoff; you create a `showoff.json` and various
markdown slides; this gets turned into your presentation

### Themeing

Each presentation comes witha `styles.css` that handles all themeing.  You can 
tweak this or try others that exist

## Presenting

You can present just as with showoff, by doing screen mirroring and
driving the presentation off.  OR, you can get the "speakers view"
in another window or device and drive the presentation that way.

- use showoff-style source; showoff.json and markdown slides in showoff format
- pml-style callout to code
- ability to highlight/reveal code
- clean styles for easy themeing
- default theme handles:
  - sublists
  - blockquotes
- Presentation works standalone or connected to presenter
- Get static version
- Get PDF version

Present

- presentations in-progress connect to server
- presenter connects to server and can send commands to presentation
    - forward
    - back
    - arbitrary slide
    - laser pointer
- should work on an iPad
- TIMER

# Questions

* Why not just beef up showoff?
  * Well, this is for me to learn node and showoff is a Sinatra app
  * showoff is also kinda hacked up over the years, and there's no tests
* CLI?
  * Ruby - quick and easy via GLI, but requires an extra dep to install
  * JavaScript - less to install, but probably suck to implement
* Markdown for JS?
