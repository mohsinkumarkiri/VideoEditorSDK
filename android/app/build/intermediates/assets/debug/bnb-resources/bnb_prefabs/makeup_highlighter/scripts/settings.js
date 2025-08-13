// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "shimmer": {
    "A": 1.2,
    "C": 1.2,
    "R": 1,
    "P": -1,
    "K": {
      "high": 0.6,
      "mid": 0.5,
      "low": 0.4
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports