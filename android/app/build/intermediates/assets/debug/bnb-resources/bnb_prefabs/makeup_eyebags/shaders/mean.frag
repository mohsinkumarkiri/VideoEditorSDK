#include <bnb/glsl.frag>

BNB_IN(0)
vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_input);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_mask);

layout(location = 1) out vec4 bnb_FragColor2;
layout(location = 2) out vec4 bnb_FragColor3;

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

void main()
{
    vec4 I = BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(tex_input), var_uv, 0.);
    vec3 I_hsv = rgb2hsv(I.bgr); // .bgr is needed to match OpenCV python version of algorithm

    float ccM = step(0.5, BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(tex_mask), var_uv, 0.)[0]);
    float hlM = step(0.5, BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(tex_mask), var_uv, 0.)[2]);

    bnb_FragColor = vec4(I_hsv * ccM, ccM);
    bnb_FragColor2 = vec4(I_hsv * hlM, hlM);
    bnb_FragColor3 = vec4(I.rgb * hlM, hlM);
}
