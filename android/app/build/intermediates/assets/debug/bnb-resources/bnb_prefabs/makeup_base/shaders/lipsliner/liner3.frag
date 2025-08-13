#include <bnb/glsl.frag>

BNB_DECLARE_SAMPLER_2D(0, 1, liner0);

BNB_IN(0)
float var_scale;
BNB_IN(1)
vec2 var_uv;

float gauss(float x, float y, float sigma_mult)
{
    return exp(-sigma_mult * (x * x + y * y));
}

float blur1(BNB_DECLARE_SAMPLER_2D_ARGUMENT(img), ivec2 iuv, float r)
{
    ivec2 isz1 = textureSize(BNB_SAMPLER_2D(img), 0) - 1;
    float c = texelFetch(BNB_SAMPLER_2D(img), iuv, 0).x;

    float sigma = (r * 2. + 1.) / 4.;
    float sigma_mult = 1. / (2. * sigma * sigma);

    float blurred = c;
    float mult_sum = 1.;
    int ir = int(r) + 1;
    for (int y = 0; y <= ir; ++y) {
        for (int x = 1; x <= ir; ++x) {
            float mult = gauss(float(x), float(y), sigma_mult);
            mult_sum += mult * 4.;
            blurred += mult * (texelFetch(BNB_SAMPLER_2D(img), clamp(iuv + ivec2(x, y), ivec2(0), isz1), 0).x + texelFetch(BNB_SAMPLER_2D(img), clamp(iuv + ivec2(-y, x), ivec2(0), isz1), 0).x + texelFetch(BNB_SAMPLER_2D(img), clamp(iuv + ivec2(-x, -y), ivec2(0), isz1), 0).x + texelFetch(BNB_SAMPLER_2D(img), clamp(iuv + ivec2(y, -x), ivec2(0), isz1), 0).x);
        }
    }
    blurred *= 1. / mult_sum;
    blurred = clamp(blurred, 0., 1.);
    return blurred;
}

float box01(vec2 uv)
{
    vec2 xy = step(0., uv) - step(1., uv);
    return xy.x * xy.y;
}

void main()
{
    float m = blur1(BNB_PASS_SAMPLER_ARGUMENT(liner0), ivec2(gl_FragCoord.xy), lipsliner_r1_r2.y * var_scale);
    m *= box01(var_uv);
    bnb_FragColor = vec4(m, 0., 0., 0.);
}
