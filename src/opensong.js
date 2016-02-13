/*
 Project: opensong.js
 Description: displays OpenSong files nicely on a web page
 Author: Andreas Boehrnsen
 License: LGPL 2.1
*/

var opensong = opensong || {};
opensong.helper = opensong.helper || {};

class opensong.Song {

  var toString = Object.prototype.toString;
  var functionType = '[object Function]';

  constructor(element, lyrics) {
    this.el = getDomElem(element);
    this.tpl = window['JST']['src/opensong.hbs'];

    this.setLyrics(lyrics);
  }

  transpose(amount) {
    Handlebars.registerHelper('transpose', function(chord) {
      return opensong.helper.transposeChord(chord, amount || 0);
    });

    return this.renderLyrics(); // rerender
  }

  setLyrics(lyrics) {
    this.model = opensong.helper.parseLyrics(lyrics);
    return this.renderLyrics();
  }

  getModel() {
    return this.model;
  }

  renderLyrics() {
    // clear Html Element and add opensong class
    this.el.innerHTML = this.tpl(this.model);
    if (!/opensong/.test(this.el.className)) { return this.el.className += " opensong"; }
  }


  var getDomElem = function(domElem) {
    if (typeof domElem === 'string') {
      return document.getElementById(domElem);
    }

    if (domElem.jquery) {
      return domElem.get(0);
    }

    if (domElem.nodeType) {
      return domElem;
    }

    return undefined;
  };

  Handlebars.registerHelper('human_header', function(abbr) {
    return opensong.helper.humanizeHeader(abbr);
  });

  Handlebars.registerHelper('transpose', function(chord) {
    return chord; // just return chord, no transposing initially
  });

  Handlebars.registerHelper('clean_lyrics', function(lyrics) {
    return opensong.helper.cleanLyrics(lyrics);
  });

  Handlebars.registerHelper('if_or', function(elem1, elem2, options) {
    if (Handlebars.Utils.isEmpty(elem1) && Handlebars.Utils.isEmpty(elem2)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });
}

