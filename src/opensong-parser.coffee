opensong = opensong || {}
opensong.helper = opensong.helper || {}

###

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

###
opensong.helper.parseLyrics = (lyrics) ->
  lyrics = lyrics.replace /\r\n?]/, '\n'
  lyricsLines = lyrics.split("\n")

  dataModel = []
  dataObject =
    header: undefined
    lines: []
  dataModel.push dataObject

  while lyricsLines.length > 0
    line = lyricsLines.shift()

    continue unless line?

    switch line[0]
      # header
      when "["
        # add new object if current is "used"
        if dataObject.lines.length > 0
          dataObject =
            header: undefined
            lines: []
          dataModel.push dataObject

        header = line.match(/\[(.*)\]/)[1]
        dataObject.header = header

      # chords (with lyrics)
      when "."
        chordsLine = line.substr(1)
        chordArr = []

        # split cords
        while chordsLine.length > 0
          m = /^(\S*\s*)(.*)$/.exec(chordsLine)
          chordArr.push m[1]
          chordsLine = m[2]
        # add an item if it is an empty line
        chordArr.push chordsLine if chordArr.length is 0

        # clean Chord line from trailing white spaces
        chordArrCleaned = []
        chordArr.forEach (value) ->
          m = /(\S*\s?)\s*/.exec(value)
          chordArrCleaned.push m[1]

        textLine = ""
        textLineArr = []
        m = null

        # while we have lines that match a textLine create an html table row
        while (textLine = lyricsLines.shift()) and \
              (m = textLine.match(/^([ 1-9])(.*)/))
          textArr = []
          textLineNr = m[1]
          textLine = m[2]
          # split lyrics line based on chord length
          for i of chordArr
            if i < chordArr.length - 1
              chordLength = chordArr[i].length
              # split String with RegExp (is there a better way?)
              m = textLine.match(new RegExp("(.{0,#{chordLength}})(.*)"))
              textArr.push m[1]
              textLine = m[2]
            else
              # add the whole string if at the end of the chord arr
              textArr.push textLine

          textLineArr.push textArr

        dataObject.lines.push
          chords: chordArrCleaned
          lyrics: textLineArr if textLineArr.length > 0

        # attach the line again in front (we cut it off in the while loop)
        lyricsLines.unshift textLine if textLine isnt 'undefined'

      # comments
      when ";"
        dataObject.lines.push {comments: line.substr(1)}

      # lyrics and everythings else
      else
        if /^[ 0-9]/.test(line)
          dataObject.lines.push {lyrics: [line.substr(1)]}
        else
          console?.log "no suppport for '#{line}'"

  dataModel


if typeof module == 'object'
  module.exports.parse = opensong.helper.parseLyrics
