// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "matte": {
    "A": 0.5,
    "C": 1,
    "R": 0,
    "P": 0,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "matte_powder": {
    "A": 0.5,
    "C": 0.8,
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
    "C": 1.1,
    "R": 2,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "glitter_metallic": {
    "A": 1.3,
    "C": 1.3,
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
    "C": 1.1,
    "R": 2,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "metallic": {
    "A": 1.3,
    "C": 1.3,
    "R": 1,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "glitter_sheer": {
    "A": 1,
    "C": 1.4,
    "R": 2,
    "P": -1,
    "K": {
      "high": 1,
      "mid": 0.9,
      "low": 0.8
    }
  },
  "cream": {
    "A": 1,
    "C": 1,
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