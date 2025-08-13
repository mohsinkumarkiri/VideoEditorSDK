// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "matte": {
    "A": 0.5,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.8,
      "mid": 0.6,
      "low": 0.4
    }
  },
  "shimmer": {
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
  "cream_shine": {
    "A": 1,
    "C": 1.3,
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