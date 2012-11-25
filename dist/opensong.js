/*! opensong - v0.0.0-ignored - 2012-11-25
 * https://github.com/deepflame/opensong.js
 * Copyright (c) 2012 Andreas Boehrnsen; Licensed LGPL 2.1
 */

var opensong;

opensong = opensong || {};

opensong.helper = opensong.helper || {};

opensong.Song = (function() {
  var getDomElem;

  function Song(element, lyrics) {
    this.el = getDomElem(element);
    this.tpl = (function() {
      var templateSrc;
      templateSrc = "{{#this}}\n<h2>{{human_header header}}</h2>\n  {{#lines}}\n<table>\n  <tr class=\"chords\">\n    {{#chords}}\n    <td>{{transpose this}}</td>\n    {{/chords}}\n  </tr>\n    {{#lyrics}}\n  <tr class='lyrics'>\n      {{#this}}\n    <td>{{this}}</td>\n      {{/this}}\n  </tr>\n    {{/lyrics}}\n</table>\n  {{/lines}}\n{{/this}}";
      return Handlebars.compile(templateSrc);
    })();
    this.setLyrics(lyrics);
  }

  Song.prototype.transpose = function(amount) {
    Handlebars.registerHelper('transpose', function(chord) {
      return opensong.helper.transposeChord(chord, amount || 0);
    });
    return this.renderLyrics();
  };

  Song.prototype.setLyrics = function(lyrics) {
    this.model = opensong.helper.parseLyrics(lyrics);
    return this.renderLyrics();
  };

  Song.prototype.renderLyrics = function() {
    this.el.innerHTML = this.tpl(this.model);
    if (!/opensong/.test(this.el.className)) {
      return this.el.className += " opensong";
    }
  };

  getDomElem = function(domElem) {
    if (typeof domElem === 'string') {
      return document.getElementById(domElem);
    }
    if (domElem.jquery) {
      return domElem.get(0);
    }
    if (domElem.nodeType) {
      return domElem;
    }
    return void 0;
  };

  Handlebars.registerHelper('human_header', function(abbr) {
    return opensong.helper.humanizeHeader(abbr);
  });

  Handlebars.registerHelper('transpose', function(chord) {
    return chord;
  });

  return Song;

})();

opensong.helper.transposeChord = function(chord, amount) {
  var c, chordExt, chordRoot, chords, index, m, newIndex, outputChords, _, _i, _len, _ref;
  chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  outputChords = [];
  _ref = chord.split("/");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    c = _ref[_i];
    m = /^([A-G][#b]?)(.*)$/.exec(c);
    if (!m) {
      return chord;
    }
    _ = m[0], chordRoot = m[1], chordExt = m[2];
    index = chords.indexOf(chordRoot);
    if (index < 0) {
      outputChords.push(c);
      continue;
    }
    newIndex = (index + amount + chords.length) % (chords.length / 2);
    outputChords.push(chords[newIndex] + chordExt);
  }
  return outputChords.join("/");
};

opensong.helper.humanizeHeader = function(abbr) {
  var abbArr, char;
  abbArr = /([a-zA-Z]+)(\d*)/.exec(abbr).slice(1);
  char = abbArr[0];
  abbArr[0] = (function() {
    switch (char) {
      case "C":
        return "Chorus";
      case "V":
        return "Verse";
      case "B":
        return "Bridge";
      case "T":
        return "Tag";
      case "P":
        return "Pre-Chorus";
      default:
        return char;
    }
  })();
  if (abbArr[1] === "") {
    abbArr.pop();
  }
  return abbArr.join(" ");
};

/*

json = [
  {
    header: "V",
    lines: [
      {
        chords: ["A", "C"],
        lyrics: [
          ["Yeah", "Yeah, God is grea!"]
        ]
      },
      {
        comments: "This is a comment"
      }
    ]
  }
]
*/


opensong.helper.parseLyrics = function(lyrics) {
  var chordArr, chordArrCleaned, chordLength, chordsLine, cleanRegExp, dataModel, dataObject, header, i, line, lyricsLines, m, textArr, textLine, textLineArr, textLineNr;
  lyricsLines = lyrics.split("\n");
  dataModel = [];
  while (lyricsLines.length > 0) {
    line = lyricsLines.shift();
    if (line == null) {
      continue;
    }
    switch (line[0]) {
      case "[":
        header = line.match(/\[(.*)\]/)[1];
        dataObject = {
          header: header,
          lines: []
        };
        dataModel.push(dataObject);
        break;
      case ".":
        chordsLine = line.substr(1);
        chordArr = [];
        while (chordsLine.length > 0) {
          m = /^(\S*\s*)(.*)$/.exec(chordsLine);
          chordArr.push(m[1]);
          chordsLine = m[2];
        }
        if (chordArr.length === 0) {
          chordArr.push(chordsLine);
        }
        chordArrCleaned = [];
        $.each(chordArr, function(index, value) {
          m = /(\S*\s?)\s*/.exec(value);
          return chordArrCleaned.push(m[1]);
        });
        textLine = "";
        m = null;
        cleanRegExp = /_|\||---|-!!/g;
        textLineArr = [];
        while ((textLine = lyricsLines.shift()) && (m = textLine.match(/^([ 1-9])(.*)/))) {
          textArr = [];
          textLineNr = m[1];
          textLine = m[2];
          for (i in chordArr) {
            if (i < chordArr.length - 1) {
              chordLength = chordArr[i].length;
              m = textLine.match(new RegExp("(.{0," + chordLength + "})(.*)"));
              textArr.push(m[1].replace(cleanRegExp, ""));
              textLine = m[2];
            } else {
              textArr.push(textLine.replace(cleanRegExp, ""));
            }
          }
          textLineArr.push(textArr);
        }
        dataObject.lines.push({
          chords: chordArrCleaned,
          lyrics: textLineArr
        });
        if (textLine !== 'undefined') {
          lyricsLines.unshift(textLine);
        }
        break;
      case " ":
        dataObject.lines.push({
          lyrics: line.substr(1)
        });
        break;
      case ";":
        dataObject.lines.push({
          comments: line.substr(1)
        });
        break;
      default:
        if (typeof console !== "undefined" && console !== null) {
          console.log("no support for: " + line);
        }
    }
  }
  return dataModel;
};
