describe "opensong.helper", ->

  openSong = null

  beforeEach ->
    openSong = opensong.helper

  describe ".humanizeHeader", ->

    it "substitutes certain leading letters", ->
      expect(openSong.humanizeHeader 'C').toEqual 'Chorus'
      expect(openSong.humanizeHeader 'V').toEqual 'Verse'
      expect(openSong.humanizeHeader 'B').toEqual 'Bridge'
      expect(openSong.humanizeHeader 'T').toEqual 'Tag'
      expect(openSong.humanizeHeader 'P').toEqual 'Pre-Chorus'

    it "supports lowercase", ->
      expect(openSong.humanizeHeader 'c').toEqual 'Chorus'
      expect(openSong.humanizeHeader 'v').toEqual 'Verse'
      expect(openSong.humanizeHeader 'b').toEqual 'Bridge'
      expect(openSong.humanizeHeader 't').toEqual 'Tag'
      expect(openSong.humanizeHeader 'p').toEqual 'Pre-Chorus'

    it "seperates the rest with a space if it matches", ->
      expect(openSong.humanizeHeader 'V1').toEqual 'Verse 1'
      expect(openSong.humanizeHeader 'v1').toEqual 'Verse 1'
      expect(openSong.humanizeHeader 'vlast').toEqual 'Verse last'

    it "does not change unmatched headers", ->
      expect(openSong.humanizeHeader 'x').toEqual 'x'
      expect(openSong.humanizeHeader '1').toEqual '1'
      expect(openSong.humanizeHeader 'section1').toEqual 'section1'


  describe ".transposeChord", ->

    it "handles some bad input", ->
      expect(openSong.transposeChord "",  1).toEqual ""
      expect(openSong.transposeChord "mali",  1).toEqual "mali"
      #expect(openSong.transposeChord "C",  "err").toEqual "mali"

    it "transposes simple chords up", ->
      expect(openSong.transposeChord "A",  1).toEqual "A#"
      expect(openSong.transposeChord "A",  2).toEqual "B"

    it "transposes simple chords down", ->
      expect(openSong.transposeChord "A",  -1).toEqual "G#"
      expect(openSong.transposeChord "A",  -2).toEqual "G"

    it "transposes sharp chords", ->
      expect(openSong.transposeChord "A#",  1).toEqual "B"
      expect(openSong.transposeChord "C#",  1).toEqual "D"

    it "transposes flat chords", ->
      expect(openSong.transposeChord "Db",  1).toEqual "D"
      expect(openSong.transposeChord "Bb", -2).toEqual "G#"

    it "transposes special chords", ->
      expect(openSong.transposeChord "Cmaj7", 1).toEqual "C#maj7"
      expect(openSong.transposeChord "F#7",  -2).toEqual "E7"

    it "transposes base chords", ->
      expect(openSong.transposeChord "C/E",   1).toEqual "C#/F"
      expect(openSong.transposeChord "Em/D", -2).toEqual "Dm/C"

  describe ".cleanLyrics", ->

    it "cleans page breaks", ->
      lyrics = "||"
      output = opensong.helper.cleanLyrics(lyrics)
      expect(output).toEqual ""

  describe ".parseLyrics", ->

    it "parses header", ->
      src = "[C]"
      model = opensong.helper.parseLyrics src
      expect(model).toEqual [
        header: "C"
        lines: []
      ]

    it "parses chords", ->
      src = ".D"
      model = opensong.helper.parseLyrics src
      expect(model).toEqual [
        header: undefined
        lines: [
          chords: ["D"]
        ]
      ]

    it "parses lyrics", ->
      src = " Lyrics"
      model = opensong.helper.parseLyrics src
      expect(model).toEqual [
        header: undefined
        lines: [
          lyrics: ["Lyrics"]
        ]
      ]

    it "parses comments", ->
      src = ";Comment"
      model = opensong.helper.parseLyrics src
      expect(model).toEqual [
        header: undefined
        lines: [
          comments: "Comment"
        ]
      ]

    it "works with different line endings", ->
      sources = ["[V]\r.C", "[V]\n.C", "[V]\r\n.C"]
      sources.forEach (src) ->
        model = opensong.helper.parseLyrics src
        expect(model).toEqual [
          header: 'V'
          lines: [
            chords: ['C']
          ]
        ]

