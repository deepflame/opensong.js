###
 Project: opensong.js
 Description: displays OpenSong files nicely on a web page
 Author: Andreas Boehrnsen
 License: LGPL 2.1
###

opensong = opensong || {}
opensong.helper = opensong.helper || {}


opensong.helper.transposeChord = (chord, amount) ->
  chords = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
  ]

  outputChords = []
  for c in chord.split "/"
    m = /^([A-G][#b]?)(.*)$/.exec c
    return chord unless m

    [_, chordRoot, chordExt] = m
    index = chords.indexOf chordRoot
    if index < 0 # use chord if not found
      outputChords.push c
      continue

    # make negative amounts work, always transpose to sharps
    newIndex = (index + amount + chords.length) % (chords.length / 2)
    outputChords.push chords[newIndex] + chordExt

  outputChords.join "/"


opensong.helper.humanizeHeader = (abbr) ->
  replacements =
    "C": "Chorus"
    "V": "Verse"
    "B": "Bridge"
    "T": "Tag"
    "P": "Pre-Chorus"

  regexp = new RegExp("^([#{Object.keys(replacements).join("")}])(.*)$", "i")
  abbArr = regexp.exec(abbr)
  return abbr unless abbArr # <- !!

  # clean match
  abbArr = abbArr[1..]
  abbArr.pop() if abbArr[1] is ""

  # do replacement
  char = abbArr[0].toUpperCase()
  abbArr[0] = replacements[char]

  # use i18n if available
  abbArr[0] = i18n.t "header.#{abbArr[0].toLowerCase()}" if i18n?

  abbArr.join " "

opensong.helper.cleanLyrics = (lyrics) ->
  cleanRegExp = /_|\||---|-!!/g
  lyrics.replace cleanRegExp, ""

