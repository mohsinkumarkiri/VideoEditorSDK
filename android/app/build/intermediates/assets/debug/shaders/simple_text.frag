#version 300 es
precision highp float;

layout(location = 0) out vec4 frag;

in vec2 vTexCoord;

uniform sampler2D s_tex;

uniform vec4 stroke1_color;
uniform vec4 stroke2_color;

uniform vec4 text_color_up;
uniform vec4 text_color_down;
uniform float text_gradient_indent;
uniform vec4 background_color;

uniform vec4 shadow1_color;
uniform vec4 shadow1_params;
uniform vec4 shadow2_color;
uniform vec4 shadow2_params;

uniform vec4 stroke1_over_text_color;
uniform float stroke1_over_text_dist;
uniform float stroke1_over_text_angle_rad;

uniform vec2 pixel_step;

float gauss( float x, float y, float sigma_mult )
{
	return exp( -sigma_mult*(x*x + y*y) );
}

float blur_shadow( sampler2D img, vec2 uv, float r )
{
    ivec2 isz = textureSize(img,0);
	ivec2 isz1 = isz - 1;
    ivec2 iuv = ivec2(uv * vec2(isz));
	float c = texelFetch( img, iuv, 0 ).a;

	float sigma = (r*2.+1.)/4.;
	float sigma_mult = 1./(2.*sigma*sigma);

	float blurred = c;
	float mult_sum = 1.;
	int ir = int(r)+1;
	for( int y = 0; y <= ir; ++y )
	{
		for( int x = 1; x <= ir; ++x )
		{
			float mult = gauss(float(x),float(y),sigma_mult);
			mult_sum += mult*4.;
			blurred += mult*(
				texelFetch( img, clamp( iuv + ivec2( x, y), ivec2(0), isz1 ), 0 ).a +
				texelFetch( img, clamp( iuv + ivec2(-y, x), ivec2(0), isz1 ), 0 ).a +
				texelFetch( img, clamp( iuv + ivec2(-x,-y), ivec2(0), isz1 ), 0 ).a +
				texelFetch( img, clamp( iuv + ivec2( y,-x), ivec2(0), isz1 ), 0 ).a);
		}
	}
	blurred *= 1./mult_sum;
	blurred = clamp( blurred, 0., 1. );
	return blurred;
}

vec4 apply_shadow(sampler2D s_tex, vec4 shadow_color, vec4 shadow_params, vec4 bg) {
    float shadow_dist = shadow_params.x;
    float shadow_angle_rad = shadow_params.y;
    float shadow_blur = shadow_params.z;
    float shadow = 0.0;
    if (shadow_dist > 0.0) {
        vec2 dir = vec2(cos(shadow_angle_rad), -sin(shadow_angle_rad));
        vec2 shadow_point = vTexCoord - (dir * shadow_dist) * pixel_step;
        if (shadow_blur > 0.0) {
            shadow = blur_shadow(s_tex, shadow_point, shadow_blur);
        } else {
            shadow = textureLod(s_tex, shadow_point, 0.0).a;
        }
    }
    if (shadow > 0.0) {
        bg = mix(bg, shadow_color, shadow);
    }
    return bg;
}

void main()
{
    vec4 px = textureLod(s_tex, vTexCoord, 0.0);

    float text = px.r;
    float stroke1 = px.g;
    float stroke2 = px.b;

    vec4 rgba = background_color;

    rgba = apply_shadow(s_tex, shadow2_color, shadow2_params, rgba);
    rgba = apply_shadow(s_tex, shadow1_color, shadow1_params, rgba);

    if (stroke2 > 0.0) {
        rgba = mix(rgba, stroke2_color, stroke2);
    }
    if (stroke1 > 0.0) {
        rgba = mix(rgba, stroke1_color, stroke1);
    }
    if (text > 0.0) {
        float coef = vTexCoord.y + text_gradient_indent;
        float normalized_coef = coef - floor(coef);
        vec4 text_color = mix(text_color_up, text_color_down, normalized_coef);
        rgba = mix(rgba, text_color, text);
    }
    if (stroke1_over_text_dist > 0.0f) {
        vec2 dir = vec2(cos(stroke1_over_text_angle_rad), -sin(stroke1_over_text_angle_rad));
        vec4 px = textureLod(s_tex, vTexCoord - (dir * stroke1_over_text_dist) * pixel_step, 0.0);
        float stroke1_over_text = px.g - px.r;
        if (stroke1_over_text > 0.0) {
            rgba = mix(rgba, stroke1_over_text_color, stroke1_over_text);
        }
    }

    frag = vec4(rgba);
}
