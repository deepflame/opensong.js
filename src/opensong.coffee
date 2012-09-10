###
 Project: opensong.js
 Description: displays OpenSong files nicely on a web page
 Author: Andreas Boehrnsen
 License: LGPL 2.1
###

# Reference jQuery
$ = jQuery


Handlebars.registerHelper 'human_header', (abbr) ->
  switch abbr
    when "C"
      "Chorus "
    when "V"
      "Verses "
    when "B"
      "Bridge "
    when "T"
      "Tag "
    when "P"
      "Pre-Chorus "
    else
      abbr

# jQuery wrapper around openSongLyrics function
$.fn.extend
  openSongLyrics: (lyrics) ->
    openSongLyrics this, lyrics

# displays Opensong 
openSongLyrics = (domElem, lyrics) ->

  ###

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

  ###

  templateSrc = """
    {{#this}}
    <h2>{{human_header header}}</h2>
      {{#lines}}
    <table>
      <tr class="chords">
        {{#chords}}
        <td>{{this}}</td>
        {{/chords}}
      </tr>
        {{#lyrics}}
      <tr class='lyrics'>
          {{#this}}
        <td>{{this}}</td>
          {{/this}}
      </tr>
        {{/lyrics}}
    </table>
      {{/lines}}
    {{/this}}
  """
  template = Handlebars.compile templateSrc

  # clear Html Element and add opensong class
  $(domElem).html("").addClass "opensong"
  
  lyricsLines = lyrics.split("\n")

  dataModel = []

  while lyricsLines.length > 0
    line = lyricsLines.shift()

    continue unless line?

    switch line[0]
      when "["
        header = line.match(/\[(.*)\]/)[1]

        dataObject = 
          header: header
          lines: []
        dataModel.push dataObject
      when "."
        chordsLine = line.substr(1)

        # split cords
        chordArr = []
        while chordsLine.length > 0
          m = /^(\S*\s*)(.*)$/.exec(chordsLine)
          chordArr.push m[1]
          chordsLine = m[2]
        # add an item if it is an empty line
        chordArr.push chordsLine if chordArr.length is 0

        # clean Chord line from trailing white spaces
        chordArrCleaned = []
        $.each chordArr, (index, value) ->
          m = /(\S*\s?)\s*/.exec(value)
          chordArrCleaned.push m[1]


        textLine = ""
        m = null
        cleanRegExp = /_|\||---|-!!/g

        textLineArr = []

        # while we have lines that match a textLine create an html table row
        while (textLine = lyricsLines.shift()) and (m = textLine.match(/^([ 1-9])(.*)/))
          textArr = []
          textLineNr = m[1]
          textLine = m[2]
          # split lyrics line based on chord length
          for i of chordArr
            if i < chordArr.length - 1
              chordLength = chordArr[i].length
              # split String with RegExp (is there a better way?)
              m = textLine.match(new RegExp("(.{0," + chordLength + "})(.*)"))
              textArr.push m[1].replace(cleanRegExp, "")
              textLine = m[2]
            else
              # add the whole string if at the end of the chord arr
              textArr.push textLine.replace(cleanRegExp, "")

          textLineArr.push textArr

        dataObject.lines.push
          chords: chordArrCleaned
          lyrics: textLineArr
        
        # attach the line again in front (we cut it off in the while loop)
        lyricsLines.unshift textLine if textLine isnt 'undefined'
      when " "
        dataObject.lines.push {lyrics: line.substr(1)}
      when ";"
        dataObject.lines.push {comments: line.substr(1)}
      else
        console.log "no support for :" + line

  $(domElem).append template(dataModel)
