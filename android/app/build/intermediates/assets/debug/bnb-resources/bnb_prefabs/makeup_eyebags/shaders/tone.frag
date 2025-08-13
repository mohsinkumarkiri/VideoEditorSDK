#include <bnb/glsl.frag>

BNB_IN(0)
vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_input);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_mask);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_mean_cc);
BNB_DECLARE_SAMPLER_2D(6, 7, tex_mean_hl);
BNB_DECLARE_SAMPLER_2D(8, 9, tex_mean_hl_rgb);

vec3 rgb2hsv(in vec3 c)
{
    const float eps = 0.0001;
    vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z < c.y) ? 1.0 : 0.0);
    vec4 q = mix(vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x < c.x) ? 1.0 : 0.0);
    float d = q.x - min(q.w, q.y);

    // (180./255.) scale is to mimic OpenCV cv::COLOR_RGB2HSV conversion which outputs H in [0., 180./255.] range
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + eps)) * (180. / 255.), d / (q.x + eps), q.x);
}

vec3 hsv2rgb(in vec3 c)
{
    c.x *= 255. / 180.;
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main()
{
    vec4 I = BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(tex_input), var_uv, 0.);
    float M = textureLod(BNB_SAMPLER_2D(tex_mask), var_uv, 0.).x;

    vec3 I_hsv = rgb2hsv(I.bgr); // .bgr is needed to match OpenCV python version of algorithm

    vec4 I_mean_cc_ = texelFetch(BNB_SAMPLER_2D(tex_mean_cc), ivec2(0, 0), 8);
    vec3 I_mean_cc = I_mean_cc_.xyz / max(I_mean_cc_.w, 0.00001);

    vec4 I_mean_hl_ = texelFetch(BNB_SAMPLER_2D(tex_mean_hl), ivec2(0, 0), 8);
    vec3 I_mean_hl = I_mean_hl_.xyz / max(I_mean_hl_.w, 0.00001);

    vec4 I_mean_hl_rgb_ = texelFetch(BNB_SAMPLER_2D(tex_mean_hl_rgb), ivec2(0, 0), 8);
    vec3 I_mean_hl_rgb = I_mean_hl_rgb_.xyz / max(I_mean_hl_rgb_.w, 0.00001);

    float a = eyebags_alpha.x;

    I_hsv.x = rgb2hsv(I_mean_hl_rgb.bgr + 0.5).x; // .bgr is needed to match OpenCV python version of algorithm
    I_hsv.y = (I_hsv.y - I_mean_cc.y) * a + I_mean_hl.y;
    I_hsv.z = (I_hsv.z - I_mean_cc.z) * a + I_mean_hl.z;

    I_hsv = clamp(I_hsv, 0., 1.);

    vec3 I_ = hsv2rgb(I_hsv).bgr; // .bgr is needed to match OpenCV python version of algorithm

    bnb_FragColor = vec4(I_, M);
}
