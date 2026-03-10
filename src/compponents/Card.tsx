import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import keenanImg from "../assets/foto.jpeg";

const SEGS = 40;
const RW = 0.22;

function buildRibbon(spine: THREE.Vector3[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const nrm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const N = spine.length;

  spine.forEach((p, i) => {
    const prev = spine[Math.max(0, i - 1)];
    const next = spine[Math.min(N - 1, i + 1)];
    const tan = new THREE.Vector3().subVectors(next, prev).normalize();
    const right = new THREE.Vector3(1, 0, 0)
      .addScaledVector(tan, -tan.x)
      .normalize();

    const v = i / (N - 1);
    const L = p.clone().addScaledVector(right, -RW);
    const R = p.clone().addScaledVector(right, RW);

    pos.push(L.x, L.y, L.z, R.x, R.y, R.z);
    nrm.push(0, 0, 1, 0, 0, 1);
    uv.push(0, v, 1, v);

    if (i < N - 1) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, b, c, b, d, c);
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(nrm), 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
  geo.setIndex(idx);
  return geo;
}

function getSpine(from: THREE.Vector3, to: THREE.Vector3, sag: number): THREE.Vector3[] {
  return Array.from({ length: SEGS }, (_, i) => {
    const t = i / (SEGS - 1);
    const p = new THREE.Vector3().lerpVectors(from, to, t);
    p.y -= Math.sin(t * Math.PI) * sag;
    return p;
  });
}

function Lanyard({ cardPos }: { cardPos: React.MutableRefObject<THREE.Vector3> }) {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const leftTextRef = useRef<THREE.Group>(null);
  const rightTextRef = useRef<THREE.Group>(null);

  const LEFT_TOP = new THREE.Vector3(-0.5, 5.8, 0);
  const RIGHT_TOP = new THREE.Vector3(0.5, 5.8, 0);

  useFrame(() => {
    const buckleY = cardPos.current.y + 2.35;
    const buckleX = cardPos.current.x;
    const buckle = new THREE.Vector3(buckleX, buckleY, 0);

    const lTop = LEFT_TOP.clone().add(new THREE.Vector3(cardPos.current.x * 0.1, 0, 0));
    const rTop = RIGHT_TOP.clone().add(new THREE.Vector3(cardPos.current.x * 0.1, 0, 0));

    const sag = 0.2 + Math.abs(cardPos.current.x) * 0.03;

    const leftSpine = getSpine(lTop, buckle, sag);
    const rightSpine = getSpine(rTop, buckle, sag);

    if (leftRef.current) {
      leftRef.current.geometry.dispose();
      leftRef.current.geometry = buildRibbon(leftSpine);
    }
    if (rightRef.current) {
      rightRef.current.geometry.dispose();
      rightRef.current.geometry = buildRibbon(rightSpine);
    }

    const lMid = leftSpine[Math.floor(SEGS * 0.45)];
    const lA = leftSpine[Math.floor(SEGS * 0.38)];
    const lB = leftSpine[Math.floor(SEGS * 0.52)];
    const lAngle = Math.atan2(lB.y - lA.y, lB.x - lA.x) + Math.PI / 2;

    const rMid = rightSpine[Math.floor(SEGS * 0.45)];
    const rA = rightSpine[Math.floor(SEGS * 0.38)];
    const rB = rightSpine[Math.floor(SEGS * 0.52)];
    const rAngle = Math.atan2(rB.y - rA.y, rB.x - rA.x) + Math.PI / 2;

    if (leftTextRef.current) {
      leftTextRef.current.position.set(lMid.x, lMid.y, 0.08);
      leftTextRef.current.rotation.z = lAngle;
    }
    if (rightTextRef.current) {
      rightTextRef.current.position.set(rMid.x, rMid.y, 0.08);
      rightTextRef.current.rotation.z = rAngle;
    }
  });

  const buckleInit = new THREE.Vector3(0, -0.8 + 2.35, 0);
  const initL = buildRibbon(getSpine(LEFT_TOP, buckleInit, 0.2));
  const initR = buildRibbon(getSpine(RIGHT_TOP, buckleInit, 0.2));

  return (
    <group>
      <mesh ref={leftRef} geometry={initL}>
        <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} roughness={0.15} metalness={0} />
      </mesh>

      <mesh ref={rightRef} geometry={initR}>
        <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} roughness={0.15} metalness={0} />
      </mesh>

      {/* <group ref={leftTextRef}>
        <Text fontSize={0.1} color="#333333" letterSpacing={0.15} anchorX="center" anchorY="middle">
          AMIQBAL
        </Text>
      </group>
      <group ref={rightTextRef}>
        <Text fontSize={0.09} color="#444444" letterSpacing={0.12} anchorX="center" anchorY="middle">
          S O F T W A R E
        </Text>
      </group> */}
    </group>
  );
}

// ── Buckle — follows card, sits between strap and card ───────────────────────
function Buckle({ cardPos }: { cardPos: React.MutableRefObject<THREE.Vector3> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.set(
      cardPos.current.x,
      cardPos.current.y + 2.35,
      0.05
    );
  });
  return (
    <group ref={ref}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.42, 0.2, 0.09]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Inner slot */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.28, 0.09, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {/* Center bar */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.42, 0.025, 0.03]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Side release tabs */}
      {([-1, 1] as const).map((side, i) => (
        <mesh key={i} position={[side * 0.24, 0, 0]}>
          <boxGeometry args={[0.05, 0.17, 0.13]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = -2.25 + ((t * 0.55) % 4.5);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + Math.sin(t * 4) * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.056]}>
      <planeGeometry args={[2.92, 0.03]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.05} depthWrite={false} />
    </mesh>
  );
}

function Brackets() {
  const corners: [number, number][] = [
    [-1.37, 2.15], [1.37, 2.15],
    [-1.37, -2.15], [1.37, -2.15],
  ];
  return (
    <>
      {corners.map(([x, y], i) => (
        <group key={i} position={[x, y, 0.057]}>
          <mesh position={[x > 0 ? -0.07 : 0.07, 0, 0]}>
            <planeGeometry args={[0.14, 0.014]} />
            <meshBasicMaterial color="#aaaaaa" />
          </mesh>
          <mesh position={[0, y > 0 ? -0.07 : 0.07, 0]}>
            <planeGeometry args={[0.014, 0.14]} />
            <meshBasicMaterial color="#aaaaaa" />
          </mesh>
        </group>
      ))}
    </>
  );
}

function DragTrail({
  cardPos, isDragging,
}: {
  cardPos: React.MutableRefObject<THREE.Vector3>;
  isDragging: React.MutableRefObject<boolean>;
}) {
  const COUNT = 20;
  const trailPos = useRef(Array.from({ length: COUNT }, () => new THREE.Vector3(0, 0, -2)));
  const head = useRef(0);
  const frame = useRef(0);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    frame.current++;
    if (isDragging.current && frame.current % 2 === 0) {
      trailPos.current[head.current].copy(cardPos.current);
      head.current = (head.current + 1) % COUNT;
    }
    if (!pointsRef.current) return;
    const pos = new Float32Array(COUNT * 3);
    trailPos.current.forEach((p, i) => {
      pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
    });
    pointsRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(COUNT * 3), 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aaaaaa" size={0.09} transparent opacity={0.2} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function BackgroundText() {
  return (
   <Text
  position={[0, 0.5, -1.5]}
  fontSize={2.4}
  maxWidth={20.6}
  lineHeight={1}
  letterSpacing={0.05}
  textAlign="center"
  color="#ffffff"
  anchorX="center"
  anchorY="middle"
>
      {`WELCOME TO MY CREATIVE LAB, LETS BUILD SOMETHING`}
    </Text>
  );
}

function IDCard() {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, keenanImg);
  const { viewport, gl } = useThree();

  const isDragging = useRef(false);
  const pos = useRef(new THREE.Vector3(0, -0.5, 0));
  const targetPos = useRef(new THREE.Vector3(0, -0.5, 0));
  const velPos = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector2());
  const rotVel = useRef(new THREE.Vector2());
  const wobble = useRef(0);
  const wasReleased = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const toWorld = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      return new THREE.Vector3(
        ((cx - r.left) / r.width * 2 - 1) * (viewport.width / 2),
        -(((cy - r.top) / r.height) * 2 - 1) * (viewport.height / 2),
        0
      );
    };
    const hit = (wx: number, wy: number) =>
      Math.abs(wx - pos.current.x) < 1.6 && Math.abs(wy - pos.current.y) < 2.4;

    const down = (e: MouseEvent) => { const w = toWorld(e.clientX, e.clientY); if (hit(w.x, w.y)) { isDragging.current = true; wobble.current = 0; } };
    const move = (e: MouseEvent) => { if (!isDragging.current) return; const w = toWorld(e.clientX, e.clientY); targetPos.current.set(w.x, w.y, 0); };
    const up = () => { if (isDragging.current) wasReleased.current = true; isDragging.current = false; targetPos.current.set(0, -0.5, 0); };
    const td = (e: TouchEvent) => { const w = toWorld(e.touches[0].clientX, e.touches[0].clientY); if (hit(w.x, w.y)) { isDragging.current = true; wobble.current = 0; } };
    const tm = (e: TouchEvent) => { if (!isDragging.current) return; const w = toWorld(e.touches[0].clientX, e.touches[0].clientY); targetPos.current.set(w.x, w.y, 0); };

    canvas.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    canvas.addEventListener("touchstart", td);
    window.addEventListener("touchmove", tm);
    window.addEventListener("touchend", up);
    return () => {
      canvas.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      canvas.removeEventListener("touchstart", td);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", up);
    };
  }, [gl, viewport]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (wasReleased.current) { wobble.current = 1.0; wasReleased.current = false; }
    wobble.current *= 0.87;

    const stiff = isDragging.current ? 0.28 : 0.06;
    const damp = isDragging.current ? 0.52 : 0.72;

    velPos.current.multiplyScalar(damp).addScaledVector(targetPos.current.clone().sub(pos.current), stiff);
    pos.current.add(velPos.current);
    groupRef.current.position.copy(pos.current);

    rotVel.current.x += (-velPos.current.y * 0.35 - rot.current.x) * 0.2;
    rotVel.current.y += (velPos.current.x * 0.5 - rot.current.y) * 0.2;
    rotVel.current.multiplyScalar(0.76);
    rot.current.add(rotVel.current);

    const t = clock.getElapsedTime();
    groupRef.current.rotation.x = rot.current.x + Math.cos(t * 6) * wobble.current * 0.09;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = Math.sin(t * 7) * wobble.current * 0.13;
  });

  return (
    <>
      <Lanyard cardPos={pos} />
      <Buckle cardPos={pos} />
      <DragTrail cardPos={pos} isDragging={isDragging} />

      <group ref={groupRef}>
        {/* White card */}
        <RoundedBox args={[3.0, 4.6, 0.09]} radius={0.13} smoothness={6}>
          <meshPhysicalMaterial color="#ffffff" roughness={0.06} metalness={0} clearcoat={1} clearcoatRoughness={0.04} />
        </RoundedBox>

        <RoundedBox args={[3.02, 4.62, 0.088]} radius={0.13} smoothness={6}>
          <meshBasicMaterial color="#000000" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} />
        </RoundedBox>

        <mesh position={[0, 1.92, 0.046]}>
          <planeGeometry args={[3.0, 0.7]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 2.27, 0.047]}><planeGeometry args={[2.85, 0.012]} /><meshBasicMaterial color="#444444" /></mesh>
        <mesh position={[0, 1.57, 0.047]}><planeGeometry args={[2.85, 0.012]} /><meshBasicMaterial color="#444444" /></mesh>
        <Text position={[0, 1.92, 0.052]} fontSize={0.2} color="#ffffff" letterSpacing={0.22} anchorX="center">
          STAFF · ID CARD
        </Text>

        <mesh position={[0, 0.44, 0.046]}><planeGeometry args={[2.14, 2.14]} /><meshBasicMaterial color="#eeeeee" /></mesh>
        <mesh position={[0, 0.44, 0.050]}><planeGeometry args={[2.08, 2.08]} /><meshBasicMaterial map={texture} /></mesh>

        <Text position={[0, -0.9, 0.052]} fontSize={0.33} color="#111111" letterSpacing={0.1} anchorX="center">
          amiqbal
        </Text>

        <mesh position={[0, -1.2, 0.050]}><planeGeometry args={[1.8, 0.008]} /><meshBasicMaterial color="#cccccc" /></mesh>

        <Text position={[0, -1.4, 0.052]} fontSize={0.14} color="#555555" letterSpacing={0.2} anchorX="center">
          SOFTWARE ENGINEER
        </Text>

        <BarcodeDecor />
        <Brackets />
        <ScanLine />
      </group>
    </>
  );
}

function BarcodeDecor() {
  const bars = useRef(
    Array.from({ length: 30 }, (_, i) => ({ x: -1.08 + i * 0.074, w: Math.random() * 0.022 + 0.01 }))
  );
  return (
    <group position={[0, -1.88, 0.055]}>
      {bars.current.map((b, i) => (
        <mesh key={i} position={[b.x, 0, 0]}>
          <planeGeometry args={[b.w, 0.28]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      ))}
      <Text position={[0, -0.22, 0.005]} fontSize={0.085} color="#333333" letterSpacing={0.12} anchorX="center">
        AMQ · 2025 · SWE-001
      </Text>
    </group>
  );
}

export default function Card() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.5, 10], fov: 50 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={0.5} color="#f0f0ff" />
        <Suspense fallback={null}>
            <BackgroundText />
          <IDCard />
        </Suspense>
      </Canvas>

      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        pointerEvents: "none",
      }}>
        <p style={{
          color: "rgba(255, 255, 255, 0.45)",
          fontSize: "1rem",
          letterSpacing: "0.35em",
          fontFamily: "monospace",
          textTransform: "uppercase",
          margin: 0,
          animation: "scrollFade 2s ease-in-out infinite",
        }}>
          Scroll to explore
        </p>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          animation: "scrollBounce 1.5s ease-in-out infinite",
        }}>
          <div style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
          <div style={{
            width: 0, height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "5px solid rgba(230, 227, 227, 0.4)",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(7px); }
        }
      `}</style>
    </div>
  );
}