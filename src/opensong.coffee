###
 Project: opensong.js
 Description: displays OpenSong files nicely on a web page
 Author: Andreas Boehrnsen
 License: LGPL 2.1
###

opensong = opensong || {}
opensong.helper = opensong.helper || {}

class opensong.Song

  toString = Object.prototype.toString
  functionType = '[object Function]'

  constructor: (element, lyrics) ->
    @el = getDomElem element
    @tpl = window['JST']['src/opensong.hbs']

    this.setLyrics lyrics

  transpose: (amount) ->
    Handlebars.registerHelper 'transpose', (chord) ->
      opensong.helper.transposeChord chord, amount || 0

    this.renderLyrics() # rerender

  setLyrics: (lyrics) ->
    @model = opensong.helper.parseLyrics lyrics
    this.renderLyrics()

  getModel: ->
    @model

  renderLyrics: ->
    # clear Html Element and add opensong class
    @el.innerHTML = @tpl @model
    @el.className += " opensong" unless /opensong/.test @el.className


  getDomElem = (domElem) ->
    if typeof domElem is 'string'
      return document.getElementById domElem

    if domElem.jquery
      return domElem.get(0)

    if domElem.nodeType
      return domElem

    undefined

  Handlebars.registerHelper 'human_header', (abbr) ->
    opensong.helper.humanizeHeader abbr

  Handlebars.registerHelper 'transpose', (chord) ->
    chord # just return chord, no transposing initially

  Handlebars.registerHelper 'clean_lyrics', (lyrics) ->
    opensong.helper.cleanLyrics lyrics

  Handlebars.registerHelper 'if_or', (elem1, elem2, options) ->
    if Handlebars.Utils.isEmpty(elem1) and Handlebars.Utils.isEmpty(elem2)
      options.inverse this
    else
      options.fn this


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

