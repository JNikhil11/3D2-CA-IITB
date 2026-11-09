import * as THREE from 'three';

export const aetherCoreVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const aetherCoreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorCore;
  uniform vec3 uColorRim;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    float fresnel = pow(1.0 - max(0.0, dot(vViewDir, vNormal)), 2.8);
    float pulse = 0.85 + 0.15 * sin(uTime * 2.5 + vPosition.y * 3.0);
    
    // Internal geometric diffraction veins
    float veins = sin(vPosition.x * 12.0 + uTime) * sin(vPosition.z * 12.0 - uTime);
    veins = smoothstep(0.3, 0.9, veins * 0.5 + 0.5);

    vec3 finalColor = mix(uColorCore * pulse, uColorRim, fresnel);
    finalColor += uColorRim * veins * 0.45;

    float alpha = clamp(0.55 + fresnel * 0.45, 0.0, 1.0) * uIntensity;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function createAetherCoreMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: aetherCoreVertexShader,
    fragmentShader: aetherCoreFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color('#F2A93B') },
      uColorRim: { value: new THREE.Color('#F4EFE6') },
      uIntensity: { value: 1.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

