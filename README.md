# StudyJS
Here is some JavaScript sample programs I've made when I study Node.js javascript programming.

## simpleNodeServer
This is the first Node.js based back-end javascript program I've ever made. It's very simple and can receive post request from browser and send back the contents to the end user.

## uploadPics
This is a picture uploader base on Node.js and formidable module. To run this, you must first install the formidable package.

	npm install formidable

The small application provide 3 pages: start, upload, show.
`start` page provides a file uploader, `upload` page saves the file user uploaded, `show` page just shows the picture user uploaded just now.

## blog (version 4+)
blog is a minimal blog system based on [Express](http://expressjs.com/). Express is most famous Node.js framwork. To use this, we must first install it by the following command.

    $ npm install express-generator -g
    $ express -e blog (add ejs engine support)
    $ cd blog && npm install
    $ DEBUG=blog node ./bin/www

Then, we can check it on the browser with `localhost:3000`.
