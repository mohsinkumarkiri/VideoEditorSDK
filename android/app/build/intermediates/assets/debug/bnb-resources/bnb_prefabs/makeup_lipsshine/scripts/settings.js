// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "shine": {
    "SAT": 1.5,
    "BR": 1,
    "SI": 1,
    "SB": 0.5,
    "SS": 1,
    "K": {
      "high": 1,
      "mid": 0.8,
      "low": 0.7
    }
  },
  "glitter": {
    "SAT": 1,
    "BR": 1,
    "SI": 0.9,
    "SB": 0.6,
    "SS": 1,
    "GB": 1,
    "GI": 1,
    "GG": 0.4,
    "K": {
      "high": 1,
      "mid": 0.8,
      "low": 0.7
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports