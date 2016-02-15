var opensong = opensong || {};
opensong.helper = opensong.helper || {};

/*

json = [
  {
    header: "V",
    lines: [
      {
        chords: ["A", "C"],
        lyrics: [
          ["Yeah", "Yeah, God is great!"]
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
  lyrics = lyrics.replace(/\r\n?/g, '\n');
  var lyricsLines = lyrics.split("\n");

  var dataModel = [];
  var dataObject =
    {header: undefined,
    lines: []
    };
  dataModel.push(dataObject);

  while (lyricsLines.length > 0) {
    var line = lyricsLines.shift();

    if (!(typeof line !== "undefined" && line !== null)) { continue; }

    switch (line[0]) {
      // header
      case "[":
        // add new object if current is "used"
        if (dataObject.lines.length > 0) {
          dataObject =
            {header: undefined,
            lines: []
            };
          dataModel.push(dataObject);
        }

        var header = line.match(/\[(.*)\]/)[1];
        dataObject.header = header;
        break;

      // chords (with lyrics)
      case ".":
        var chordsLine = line.substr(1);
        var chordArr = [];

        // split cords
        while (chordsLine.length > 0) {
          var m = /^(\S*\s*)(.*)/.exec(chordsLine);
          chordArr.push(m[1]);
          chordsLine = m[2];
        }
        // add an item if it is an empty line
        if (chordArr.length === 0) { chordArr.push(chordsLine); }

        // clean Chord line from trailing white spaces
        var chordArrCleaned = [];
        chordArr.forEach(function(value) {
          m = /(\S*\s?)\s*/.exec(value);
          return chordArrCleaned.push(m[1]);
        });

        var textLine = "";
        var textLineArr = [];
        m = null;

        // while we have lines that match a textLine create an html table row
        while ((textLine = lyricsLines.shift()) && (m = textLine.match(/^([ 1-9])(.*)/))) {
          var textArr = [];
          var textLineNr = m[1];
          textLine = m[2];
          // split lyrics line based on chord length
          for (var i in chordArr) {
            if (i < chordArr.length - 1) {
              var chordLength = chordArr[i].length;
              // split String with RegExp (is there a better way?)
              m = textLine.match(new RegExp(`(.{0,${chordLength}})(.*)`));
              textArr.push(m[1]);
              textLine = m[2];
            } else {
              // add the whole string if at the end of the chord arr
              textArr.push(textLine);
            }
          }

          textLineArr.push(textArr);
        }

        dataObject.lines.push({
          chords: chordArrCleaned,
          lyrics: textLineArr.length > 0 ? textLineArr : undefined
        });

        // attach the line again in front (we cut it off in the while loop)
        if (textLine !== 'undefined') { lyricsLines.unshift(textLine); }
        break;

      // comments
      case ";":
        dataObject.lines.push({comments: line.substr(1)});
        break;

      // lyrics and everythings else
      default:
        if (/^[ 0-9]/.test(line)) {
          dataObject.lines.push({lyrics: [line.substr(1)]});
        }
    }
  }

  return dataModel;
};


if (typeof module === 'object') {
  module.exports.parse = opensong.helper.parseLyrics;
}
