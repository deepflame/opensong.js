describe "openSong", ->

  describe ".transposeChord", ->

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


