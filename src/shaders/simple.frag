#ifdef GL_ES
precision mediump float;
#endif

// schizo flower murrr

uniform float time;
uniform vec2 resolution;

void main( void ) {
    vec2 p=(2.*gl_FragCoord.xy-resolution.xy) / resolution.y;
	float l = length(p);
	vec2 rm = vec2( sin( cos(time) * l ), tan( sin(time) * .5 ) * dot(p,p*p));
	p = vec2( p.x*rm.x - p.y*rm.y, p.x*rm.y - p.y*rm.x * dot(p,p));
		
    float b=abs(l-2.0)+(cos(2.*(atan(p.x,p.y))))*.13;

    gl_FragColor = vec4(b,abs(.8-b),1.-b, 1.4 );


}