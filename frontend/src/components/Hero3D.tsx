import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import * as THREE from "three";

function RotatingCore() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) {
      return;
    }

    mesh.current.rotation.x += delta * 0.4;
    mesh.current.rotation.y += delta * 0.8;
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[0.8, 0.3, 130, 16]} />
      <meshStandardMaterial color="#D7263D" metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

export function Hero3D() {
  return (
    <View style={styles.wrap}>
      <Canvas>
        <ambientLight intensity={1.2} />
        <directionalLight intensity={1.5} position={[3, 2, 5]} color="#ffffff" />
        <pointLight intensity={1.1} position={[-2, -1, 2]} color="#0B2A57" />
        <RotatingCore />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "rgba(6, 19, 42, 0.85)",
  },
});
