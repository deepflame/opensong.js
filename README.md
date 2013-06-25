[![Build Status](https://travis-ci.org/deepflame/opensong.js.png?branch=master)](https://travis-ci.org/deepflame/opensong.js)

# opensong.js

Opensong.js is a Javascript/Coffeescript library to format and display [OpenSong](http://opensong.org) files nicely on a web page.

It supports:

- rendering lyrics
- transposing chords

Check out the [Demo](http://deepflame.github.com/opensong.js/ "Demo").

## What is OpenSong?

> OpenSong is a free, open-source software application created to manage lyrics, chords, lead sheets, overheads, computer projection, and more.   
>   
> OpenSong releases are available for Microsoft Windows, Mac OSX, and Linux operating systems.   
>   
> [Download](http://opensong.org/d/downloads) the full application for free and give it a try!


## Getting Started

Development on this project can be done on all major platforms (Windowd, Mac, Linux). 

If you know current web technologies you should be ready to go.

To start hacking on the code you need apparantly to check out the source code. We assume you know how to do that.

### Requirements

  - [Nodejs](http://nodejs.org/ "Nodejs") for your platform
  - grunt (see below how to install it)
  
Nodejs comes now prepackaged with NPM, its package manager. To install grunt execute:

    npm install grunt -g
  
With the -g option we install grunt globally. We need this to be able to use the command line utility.

### Install dependencies

In the source code folder execute:

    npm install
    
This will install all dependencies specified in `package.json`.

### Start Coding

The project uses these projects:

  - [CoffeeScript](http://coffeescript.org/ "CoffeeScript")
  - [jQuery](http://jquery.com/ "jQuery")
  - [Handlebars](http://handlebarsjs.com/ "Handlebars")
  - [Jasmine](http://pivotal.github.com/jasmine/ "Jasmine")

The CoffeeScript files need to be compiled into Javascript. This can be automated with grunt.

You can start a watcher that will automatically compile the coffee files. In your source root dir run:

    grunt
    grunt.cmd (on Windows)


## License

[The GNU Lesser General Public License, version 2.1 (LGPL-2.1)](http://www.opensource.org/licenses/lgpl-2.1.php)
