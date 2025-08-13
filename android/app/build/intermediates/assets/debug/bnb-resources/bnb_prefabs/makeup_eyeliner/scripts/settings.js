// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "cream": {
    "A": 1,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "matte_liquid": {
    "A": 1,
    "C": 0.6,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "matte_cream": {
    "A": 1,
    "C": 0.6,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "matte_dark": {
    "A": 0.0,
    "C": 0.2,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "metallic": {
    "A": 1,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "shimmer": {
    "A": 1,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "glitter": {
    "A": 1,
    "C": 1,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "cream_lightcolors": {
    "A": 1,
    "C": 0.6,
    "R": 0,
    "P": 0,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports