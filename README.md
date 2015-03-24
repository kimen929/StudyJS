# StudyJS
Here is some JavaScript sample programs I've made when I study Node.js javascript programming.

##Table of Contents

  1.  [Simple Node Server](#simplenodeserver)
  2.  [Upload Picture](#uploadpics)
  3.  [Simple Blog](#blog)
  4.  [Contact](#contact)
  5.  [Resources](#resources)

## simpleNodeServer
This is the first Node.js based back-end javascript program I've ever made. It's very simple and can receive post request from browser and send back the contents to the end user.

## uploadPics
This is a picture uploader base on Node.js and formidable module. To run this, you must first install the formidable package.

	npm install formidable

The small application provide 3 pages: start, upload, show.
`start` page provides a file uploader, `upload` page saves the file user uploaded, `show` page just shows the picture user uploaded just now.

## Blog

Environment:  (Node 0.10.33, Express 4.12.1, mongoDB 2.6.8)

Blog is a minimal blog system based on [Express](http://expressjs.com/). Express is most famous Node.js framwork. To use this, we must first install it by the following command.

    $ npm install express-generator -g
    $ express -e blog (add ejs engine support)
    $ cd blog && npm install
    $ DEBUG=blog node ./bin/www

Then, we can check it on the browser with `localhost:3000`. **Done** the Express installing.

Installing [mongoDB](http://mongodb.com/), type the command as follows.

    $ vi /etc/yum.repos.d/mongodb.repo 
		
Write the following configuration (64-bit system)

		[mongodb]
		name=MongoDB Repository
		baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
		gpgcheck=0
		enabled=1

Then, install package with `yum` command.

		$ yum install mongo-10gen mongo-10gen-server

After this, the mongoDB is installed, then we may use `$ cd /bin/ && mongod --dbpath ../blog/` to set the DB storaging directory to /blog and start mongoDB with `service mongod start`.
	
**[⬆ back to top](#table-of-contents)**

## Contact
Follow me [kimen929](https://www.facebook.com/kimen929), mail me at [kin@kin-n.com](mailto:kin@kin-n.com), or check our my personal home page [金の炎](http://kin-n.com).

## Resources

1.	[The Node Beginner Book](http://www.nodebeginner.org/), by  [Manuel Kiessling](https://twitter.com/manuelkiessling)
2.  [JavaScript 标准参考教程](http://javascript.ruanyifeng.com/), by [阮一峰](http://www.ruanyifeng.com/home.html)
3.  [使用 Express + MongoDB 搭建多人博客](https://github.com/nswbmw/N-blog), by [nswbmw](http://github.com/nswbmw)
