// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "matte": {
    "A": 0.5,
    "C": 1.2,
    "R": 1,
    "P": -2,
    "K": {
      "high": 0.8,
      "mid": 0.6,
      "low": 0.4
    }
  },
  "natural": {
    "A": 1,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.8,
      "mid": 0.6,
      "low": 0.4
    }
  },
  "radiance": {
    "A": 1.2,
    "C": 1.1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.8,
      "mid": 0.6,
      "low": 0.4
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports