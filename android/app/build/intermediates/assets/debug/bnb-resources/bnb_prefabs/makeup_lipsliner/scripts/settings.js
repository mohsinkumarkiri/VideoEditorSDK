// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "shimmer": {
    "A": 1.2,
    "C": 1,
    "R": 0,
    "P": 0,
    "K": {
      "high": 1,
      "mid": 0.8,
      "low": 0.7
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports