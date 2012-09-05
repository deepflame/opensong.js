#
#  Project: opensong.js
#  Description: displays OpenSong files nicely on a web page
#  Author: Andreas Boehrnsen
#  License: LGPL 2.1
#

# Reference jQuery
$ = jQuery

# jQuery wrapper around openSongLyrics function
$.fn.extend
  openSongLyrics: (lyrics) ->
    openSongLyrics this, lyrics

# displays Opensong 
openSongLyrics = (domElem, lyrics) ->
  # clear Html Element and add opensong class
  $(domElem).html("").addClass "opensong"
  
  lyricsLines = lyrics.split("\n")

  while lyricsLines.length > 0
    line = lyricsLines.shift()
    switch line[0]
      when "["
        header = line.match(/\[(.*)\]/)[1]
        # replace first char (e.g. V -> Verse)
        header = header.replace(header[0], replaceHeader(header[0]))
        $(domElem).append "<h2>" + header + "</h2>"
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

        # write html table row for the chords
        htmlTableRows = "<tr class='chords'><td></td><td>" + chordArrCleaned.join("</td><td>") + "</td></tr>\n"
        textLine = ""
        m = null
        cleanRegExp = /_|\||---|-!!/g

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
          # write html table row for the text (lyrics)
          htmlTableRows = htmlTableRows + "<tr class='lyrics'><td>" + textLineNr + "</td><td>" + textArr.join("</td><td>") + "</td></tr>\n"
        
        # attach the line again in front (we cut it off in the while loop)
        lyricsLines.unshift textLine if textLine isnt `undefined`
        $(domElem).append "<table>" + htmlTableRows + "</table>"
      when " "
        $(domElem).append "<div class='lyrics'>" + line.substr(1) + "</div>"
      when ";"
        $(domElem).append "<div class='comments'>" + line.substr(1) + "</div>"
      else
        console.log "no support for :" + line

  replaceHeader = (abbr) ->
    switch abbr
      when "C"
        "Chorus "
      when "V"
        "Verse "
      when "B"
        "Bridge "
      when "T"
        "Tag "
      when "P"
        "Pre-Chorus "
      else
        abbr