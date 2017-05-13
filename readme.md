# Chrome DevTools Dark Theme

![Screenshot 1](screenshot1.png)

<br/>

## Installation
- Install the extension from the Chrome Web Store:  <br/>
https://chrome.google.com/webstore/detail/chrome-devtools-dark-them/bfcohnmjbpeilfcijkjkeggbdmehhnbk
<br/>

- Enable DevTools Experiments in Chrome (http://islegend.com/development/how-to-enable-devtools-experiments-within-google-chrome/)
<br/>

- Go to DevTools Settings -> Experiments -> Enable "Allow Custom UI themes". 
<br/>

- Go to DevTools Settings -> Preferences and select Theme: "Dark", which enables Chrome's own Dark Theme. This theme builds on top of that.

<br/>

## Build Instructions
To customize this theme you can edit the CSS (SASS) by yourself:
- run `npm install`. Make sure you have at least node.js v4 installed.
- Install Gulp globally if you haven't done that yet: `npm install --global gulp-cli`
- modify the .scss under `src/` to your preference
- compile the .scss to `dist/theme.css` by running `gulp generate.css`
- In `dist/devtools.js`, comment out line 9: ` var theStyle = ':host-context(.platform-mac) .mo [...]`. Now the theme.css file gets loaded dynamically.
- Load the extension locally in Chrome: go to `chrome://extensions/`, enable 'Developer Mode', click 'Load unpacked extension' and load it (select the `dist/` folder).
- To style the DevTools, you can actually inspect the DevTools window itself! Make sure the DevTools are undocked, e.g. they are in a seperate window, then press `Cmd+Option+I` and another DevTools window opens.

<br/>

## Credits
The CSS for this theme is based on the DevTools Author themes:<br/>
https://github.com/micjamking/devtools-author

