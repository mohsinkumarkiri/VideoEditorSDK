
// If the export is not a JSON string - Safari crashes applying the effect
exports = /* json */ `{
  "volume": {
    "texture": "/bnb_prefabs/makeup_eyelashes/images/lashes_tex4.ktx",
    "length": 1.3,
    "K": {
      "high": 0.85,
      "mid": 0.75
    }
  },
  "lengthening": {
    "texture": "/bnb_prefabs/makeup_eyelashes/images/lashes_tex1.ktx",
    "length": 1.3,
    "K": {
      "high": 0.85,
      "mid": 0.75
    }
  },
  "lengthandvolume": {
    "texture": "/bnb_prefabs/makeup_eyelashes/images/lashes_tex6.ktx",
    "length": 1.3,
    "K": {
      "high": 0.85,
      "mid": 0.75
    }
  },
  "natural": {
    "texture": "/bnb_prefabs/makeup_eyelashes/images/lashes_tex3.ktx",
    "length": 1,
    "K": {
      "high": 0.85,
      "mid": 0.75
    }
  },
  "natural_bottom": {
    "texture": "/bnb_prefabs/makeup_eyelashes/images/lashes_tex5.ktx",
    "length": 1.3,
    "K": {
      "high": 0.85,
      "mid": 0.75
    }
  }
}`

if (typeof module !== "undefined") module.exports = exports