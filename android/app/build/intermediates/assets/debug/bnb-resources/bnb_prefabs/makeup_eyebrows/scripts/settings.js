// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "matte": {
    "A": 1,
    "C": 0.5,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.5,
      "mid": 0.4,
      "low": 0.3
    }
  },
  "wet": {
    "A": 1.5,
    "C": 1.5,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.5,
      "mid": 0.4,
      "low": 0.3
    }
  },
  "clear": {
    "A": 1,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.5,
      "mid": 0.4,
      "low": 0.3
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports