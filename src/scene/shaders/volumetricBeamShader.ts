import * as THREE from 'three';

export const volumetricBeamVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const volumetricBeamFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fade at the top and base of the cone
    float lengthFade = smoothstep(0.0, 0.15, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
    
    // Soft radial edge fade
    float rim = pow(1.0 - abs(dot(vViewDir, vNormal)), 1.5);
    
    // Subtle dust beam scintillation
    float dust = 0.9 + 0.1 * sin(vUv.y * 40.0 - uTime * 4.0);

    float alpha = lengthFade * (0.35 + rim * 0.65) * dust * uIntensity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function createVolumetricBeamMaterial(color = '#1F3A93'): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: volumetricBeamVertexShader,
    fragmentShader: volumetricBeamFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: 0.65 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

