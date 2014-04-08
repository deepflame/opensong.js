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

