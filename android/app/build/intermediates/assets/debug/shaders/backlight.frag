#version 300 es
precision highp float;

layout(location = 0) out vec4 frag;
in vec2 vTexCoord;

uniform sampler2D s_tex;
uniform float stroke1_radius;
uniform float stroke2_radius;
uniform vec2 pixel_step;

const float PI = 3.1415926538979;
const float PI_STEP = PI / 24.0;
const float PI_MUL_2 = PI * 2.0;

float get_backlight(sampler2D tex, vec2 tex_coord, float radius)
{
    vec2 scale = radius * pixel_step;
    float result = 0.0;
    for (float a = 0.0; a < PI_MUL_2; a += PI_STEP) {
        vec2 coord = tex_coord + vec2(cos(a), sin(a)) * scale;
        float current = textureLod(tex, coord, 0.0).x;
        result = max(result, current);
    }
    return result;
}

void main()
{
    float alpha = textureLod(s_tex, vTexCoord, 0.0).x;
    float shadow = alpha;
    float stroke1 = 0.0;
    float stroke2 = 0.0;
    if (stroke1_radius > 0.0) {
        stroke1 = clamp(get_backlight(s_tex, vTexCoord, stroke1_radius) + alpha, 0.0, 1.0);
        shadow = max(shadow, stroke1);
    }
    if (stroke2_radius > 0.0) {
        stroke2 = clamp(get_backlight(s_tex, vTexCoord, stroke1_radius + stroke2_radius) + alpha + stroke1, 0.0, 1.0);
        shadow = max(shadow, stroke2);
    }

    frag = vec4(alpha, stroke1, stroke2, shadow);
}