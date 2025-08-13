#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0)
BNB_IN vec3 attrib_pos;

BNB_OUT(0)
vec2 var_uv;
flat BNB_OUT(1) vec4 var_param;

void main()
{
    vec2 v = attrib_pos.xy;
    gl_Position = vec4(v, 0., 1.);
    var_uv = v * 0.5 + 0.5;

#ifdef BNB_VK_1
    var_uv.y = 1. - var_uv.y;
#endif

    var_param = vec4(0.);
    int f = int(attrib_pos.z);
    // clang-format off
#ifdef BNB_MAKEUP_FOUNDATION
    if( f == 0 )
        var_param = vec4(foundation_krp.yz,foundation_rgb_maxa.w,0.);
    else
#endif
#ifdef BNB_MAKEUP_CONCEALER
    if( f == 1 )
        var_param = vec4(concealer_krp.yz,concealer_rgb_maxa.w,0.);
    else
#endif
#ifdef BNB_MAKEUP_CONTOUR
    if( f == 2 )
        var_param = vec4(contour_krp.yz,contour_rgb_maxa.w,1.);
    else
#endif
#ifdef BNB_MAKEUP_HIGHLIGHTER
    if( f == 3 )
        var_param = vec4(highlighter_krp.yz,highlighter_rgb_maxa.w,2.);
    else
#endif
#ifdef BNB_MAKEUP_BLUSH
    if( f == 4 )
        var_param = vec4(blush_krp.yz,blush_rgb_maxa.w,3.);
    else
#endif
#ifdef BNB_MAKEUP_LIPSTICK
    if( f == 5 )
        var_param = vec4(lipstick_krp.yz,lipstick_rgb_maxa.w,2.);
    else
#endif
#ifdef BNB_MAKEUP_LIPSLINER
    if( f == 6 )
        var_param = vec4(lipsliner_krp.yz,lipsliner_rgb_maxa.w,3.);
    else
#endif
#ifdef BNB_MAKEUP_EYESHADOW0
    if( f == 7 )
        var_param = vec4(eyeshadow0_krp.yz,eyeshadow0_rgb_maxa.w,0.);
    else
#endif
#ifdef BNB_MAKEUP_EYESHADO1
    if( f == 8 )
        var_param = vec4(eyeshadow1_krp.yz,eyeshadow1_rgb_maxa.w,1.);
    else
#endif
#ifdef BNB_MAKEUP_EYESHADOW2
    if( f == 9 )
        var_param = vec4(eyeshadow2_krp.yz,eyeshadow2_rgb_maxa.w,2.);
    else
#endif
#ifdef BNB_MAKEUP_EYELINER
    if( f == 10 )
        var_param = vec4(eyeliner_krp.yz,eyeliner_rgb_maxa.w,3.);
    else
#endif
#ifdef BNB_MAKEUP_EYEBROWS
    if( f == 11 )
        var_param = vec4(eyebrows_krp.yz,eyebrows_rgb_maxa.w,1.);
    else
#endif
        ; // nop
    // clang-format on
}
