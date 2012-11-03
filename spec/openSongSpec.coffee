describe "openSong", ->

  describe ".transposeChord", ->

    it "transposes simple chords up", ->
      expect(openSong.transposeChord "A",  1).toEqual "A#"
      expect(openSong.transposeChord "A",  2).toEqual "B"
      expect(openSong.transposeChord "A", 13).toEqual "A#"

    it "transposes simple chords down", ->
      expect(openSong.transposeChord "A",  -1).toEqual "G#"
      expect(openSong.transposeChord "A",  -2).toEqual "G"
      expect(openSong.transposeChord "A", -13).toEqual "G#"

