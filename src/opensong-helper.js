/*
 Project: opensong.js
 Description: displays OpenSong files nicely on a web page
 Author: Andreas Boehrnsen
 License: LGPL 2.1
*/

var opensong = opensong || {};
opensong.helper = opensong.helper || {};


opensong.helper.transposeChord = function(chord, amount) {
  var chords = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
  ];

  var outputChords = [];
  var iterable = chord.split("/");
  for (var i = 0, c; i < iterable.length; i++) {
    c = iterable[i];
    var m = /^([A-G][#b]?)(.*)$/.exec(c);
    if (!m) { return chord; }

    var [_, chordRoot, chordExt] = m;
    var index = chords.indexOf(chordRoot);
    if (index < 0) { // use chord if not found
      outputChords.push(c);
      continue;
    }

    // make negative amounts work, always transpose to sharps
    var newIndex = (index + amount + chords.length) % (chords.length / 2);
    outputChords.push(chords[newIndex] + chordExt);
  }

  return outputChords.join("/");
};


opensong.helper.humanizeHeader = function(abbr) {
  var replacements =
    {"C": "Chorus",
    "V": "Verse",
    "B": "Bridge",
    "T": "Tag",
    "P": "Pre-Chorus"
    };

  var regexp = new RegExp(`^([${Object.keys(replacements).join("")}])(.*)$`, "i");
  var abbArr = regexp.exec(abbr);
  if (!abbArr) { return abbr; } // <- !!

  // clean match
  abbArr = abbArr.slice(1);
  if (abbArr[1] === "") { abbArr.pop(); }

  // do replacement
  var char = abbArr[0].toUpperCase();
  abbArr[0] = replacements[char];

  // use i18n if available
  if ((typeof i18n !== "undefined" && i18n !== null)) { abbArr[0] = i18n.t(`header.${abbArr[0].toLowerCase()}`); }

  return abbArr.join(" ");
};

opensong.helper.cleanLyrics = function(lyrics) {
  var cleanRegExp = /_|\||---|-!!/g;
  return lyrics.replace(cleanRegExp, "");
};

