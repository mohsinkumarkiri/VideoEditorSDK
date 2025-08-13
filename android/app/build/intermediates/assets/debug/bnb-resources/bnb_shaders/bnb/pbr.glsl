#ifndef BNB_PBR_GLSL
#define BNB_PBR_GLSL

// gamma to linear
vec3 bnb_g2l(vec3 g)
{
    return g * (g * (g * 0.305306011 + 0.682171111) + 0.012522878);
}

// combined hdr to ldr and linear to gamma
vec3 bnb_l2g(vec3 l)
{
    return sqrt(1.33 * (1. - exp(-l))) - 0.03;
}

vec3 bnb_fresnel_schlick_roughness(float prod, vec3 F0, float roughness)
{
    return F0 + (max(F0, 1. - roughness) - F0) * pow(1. - prod, 5.);
}

vec2 bnb_brdf_approx(float Roughness, float NoV)
{
    const vec4 c0 = vec4(-1., -0.0275, -0.572, 0.022);
    const vec4 c1 = vec4(1., 0.0425, 1.04, -0.04);
    vec4 r = Roughness * c0 + c1;
    float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
    vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;
    return AB;
}

vec3 bnb_fresnel_schlick(float prod, vec3 F0)
{
    return F0 + (1. - F0) * pow(1. - prod, 5.);
}

float bnb_distribution_GGX(float cN_H, float roughness, vec3 NxH)
{
    // https://gist.github.com/romainguy/a2e9208f14cae37c579448be99f78f25

    // Walter et al. 2007, "Microfacet Models for Refraction through Rough Surfaces"

    // In mediump, there are two problems computing 1.0 - NoH^2
    // 1) 1.0 - NoH^2 suffers floating point cancellation when NoH^2 is close to 1 (highlights)
    // 2) NoH doesn't have enough precision around 1.0
    // Both problem can be fixed by computing 1-NoH^2 in highp and providing NoH in highp as well

    // However, we can do better using Lagrange's identity:
    //      ||a x b||^2 = ||a||^2 ||b||^2 - (a . b)^2
    // since N and H are unit vectors: ||N x H||^2 = 1.0 - NoH^2
    // This computes 1.0 - NoH^2 directly (which is close to zero in the highlights and has
    // enough precision).
    // Overall this yields better performance, keeping all computations in mediump
    float oneMinusNoHSquared = dot(NxH, NxH);

    float a = cN_H * roughness;
    float k = roughness / (oneMinusNoHSquared + a * a);
    float d = k * k * (1.0 / 3.14159265);
    const float MEDIUMP_FLT_MAX = 65504.0;
    return min(d, MEDIUMP_FLT_MAX);
}

float bnb_geometry_schlick_GGX(float NV, float roughness)
{
    float r = roughness + 1.;
    float k = r * r / 8.;
    return NV / (NV * (1. - k) + k);
}

float bnb_geometry_smith(float cN_L, float ggx2, float roughness)
{
    return bnb_geometry_schlick_GGX(cN_L, roughness) * ggx2;
}

float bnb_diffuse_factor(float n_l, float w)
{
    float w1 = 1. + w;
    return pow(max(0., n_l + w) / w1, w1);
}

vec3 bnb_pbr_light(vec4 radiance_wrap, vec4 dir_pos, vec3 N, vec3 V, vec3 base, float roughness, float metallic, float cN_V, vec3 F0, float ggx2)
{
    vec3 radiance = radiance_wrap.xyz;
    float lwrap = radiance_wrap.w;
    vec3 L = dir_pos.xyz;
    vec3 H = normalize(V + L);
    float N_L = dot(N, L);
    float cN_L = max(0., N_L);
    float cN_H = max(0., dot(N, H));
    float cH_V = max(0., dot(H, V));

    float NDF = bnb_distribution_GGX(cN_H, roughness * roughness, cross(N, H));
    float G = bnb_geometry_smith(cN_L, ggx2, roughness);
    vec3 F_light = bnb_fresnel_schlick(cH_V, F0);

    vec3 specular = NDF * G * F_light / (4. * cN_V * cN_L + 0.001);

    vec3 kD_light = (1. - F_light) * (1. - metallic);

    vec3 color = (kD_light * base / 3.14159265 + specular) * radiance * bnb_diffuse_factor(N_L, lwrap);

    return color;
}

void bnb_roughness_aa(vec3 N, inout float roughness)
{
    vec3 dFdxN = dFdx(N);
    vec3 dFdyN = dFdy(N);
    float curv2 = max(dot(dFdxN, dFdxN), dot(dFdyN, dFdyN));
    float max_rough = clamp(1. - 0.0909 + 0.0909 * log2(bnb_spec_aa_strength.x * curv2), 0., 1.);
    roughness = max(roughness, max_rough);
}

#endif