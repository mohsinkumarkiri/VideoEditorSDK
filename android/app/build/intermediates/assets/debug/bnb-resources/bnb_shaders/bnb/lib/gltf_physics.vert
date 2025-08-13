#include <bnb/glsl.vert>
#include <bnb/matrix_operations.glsl>
#include <bnb/decode_int1010102.glsl>

layout(location = 0) in vec3 attrib_pos;
#if defined(BNB_VK_1)
layout(location = 1) in uint attrib_n;
layout(location = 2) in uint attrib_t;
#else
layout(location = 1) in vec4 attrib_n;
layout(location = 2) in vec4 attrib_t;
#endif
layout(location = 3) in vec2 attrib_uv;
layout(location = 4) in uvec4 attrib_bones;
layout(location = 5) in vec4 attrib_weights;

BNB_DECLARE_SAMPLER_2D(10, 11, bnb_BONES);

BNB_OUT(0)
vec2 var_uv;
BNB_OUT(1)
vec3 var_t;
BNB_OUT(2)
vec3 var_b;
BNB_OUT(3)
vec3 var_n;
BNB_OUT(4)
vec3 var_v;

#include <bnb/anim_transform.glsl>

void main()
{
    mat4 m = bnb_get_transform();
    vec3 vpos = (vec4(attrib_pos, 1.) * m).xyz;

    gl_Position = bnb_PROJ * vec4(vpos, 1.);

    var_uv = attrib_uv;

    mat3 m_3 = mat3(m[0].xyz, m[1].xyz, m[2].xyz);

    vec4 attrib_t1 = decode_int1010102(attrib_t);
    vec4 attrib_n1 = decode_int1010102(attrib_n);

    var_t = normalize(attrib_t1.xyz * m_3);
    var_n = normalize(attrib_n1.xyz * m_3);
    var_b = attrib_t1.w * cross(var_n, var_t);

    // On some Android devices mediump precision is only a minimum required by the spec (-2^14, +2^14) range
    // There will be not anough range to calculate normalize(-var_v) in fragment shader as var_v.z can be near -1000.0
    // and square of it is much bigger than 2^14.
    // We can't normalize it in vertex shader because this will produce wrong interpolated vectors.
    // Instead we just scale it by 0.001 bringing values closer to 1.0 scale.
    var_v = vpos * 0.001;
}
