import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import keenanImg from "../assets/foto.jpeg";

// ── Global motion target (shared antara IDCard dan permission button) ─────────
const _motionTarget = { x: 0, y: -0.5 };
const _motionEnabled = { value: false };

const SEGS = 40;
const RW = 0.22;

const ROWS = [
  "LETS BUILD SOMETHING AMAZING",
  "LETS BUILD SOMETHING AMAZING",
  "LETS BUILD SOMETHING AMAZING",
  "LETS BUILD SOMETHING AMAZING",
];

const SPEED = 0.012;
const ROW_HEIGHT = 2.2;
const FONT_SIZE = 2.0;
const REPEAT = "          ";

function RunningRow({
  text,
  direction,
  yPos,
}: {
  text: string;
  direction: 1 | -1;
  yPos: number;
}) {
  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);

  const TILE_WIDTH = text.length * FONT_SIZE * 0.62;

  useFrame(() => {
    if (!ref1.current || !ref2.current) return;

    ref1.current.position.x += SPEED * direction;
    ref2.current.position.x += SPEED * direction;

    if (direction === 1) {
      if (ref1.current.position.x > TILE_WIDTH) ref1.current.position.x -= TILE_WIDTH * 2;
      if (ref2.current.position.x > TILE_WIDTH) ref2.current.position.x -= TILE_WIDTH * 2;
    } else {
      if (ref1.current.position.x < -TILE_WIDTH) ref1.current.position.x += TILE_WIDTH * 2;
      if (ref2.current.position.x < -TILE_WIDTH) ref2.current.position.x += TILE_WIDTH * 2;
    }
  });

  const fullText = text + REPEAT + text;

  return (
    <group position={[0, yPos, -1.5]}>
      <Text
        ref={ref1}
        position={[0, 0, 0]}
        fontSize={FONT_SIZE}
        letterSpacing={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        // fillOpacity={0.}
      >
        {fullText}
      </Text>
      <Text
        ref={ref2}
        position={[direction === 1 ? -TILE_WIDTH : TILE_WIDTH, 0, 0]}
        fontSize={FONT_SIZE}
        letterSpacing={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        fillOpacity={0.06}
      >
        {fullText}
      </Text>
    </group>
  );
}

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
  });

  const buckleInit = new THREE.Vector3(0, -0.5 + 2.35, 0);
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
    </group>
  );
}

function Buckle({ cardPos }: { cardPos: React.MutableRefObject<THREE.Vector3> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.set(cardPos.current.x, cardPos.current.y + 2.35, 0.05);
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.42, 0.2, 0.09]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.28, 0.09, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.42, 0.025, 0.03]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
      </mesh>
      {([-1, 1] as const).map((side, i) => (
        <mesh key={i} position={[side * 0.24, 0, 0]}>
          <boxGeometry args={[0.05, 0.17, 0.13]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
      ))}
    </group>
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
  cardPos,
  isDragging,
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
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
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

export function BackgroundText() {
  const totalRows = ROWS.length;
  const startY = ((totalRows - 1) / 2) * ROW_HEIGHT;

  return (
    <group>
      {ROWS.map((text, i) => (
        <RunningRow
          key={i}
          text={text}
          direction={i % 2 === 0 ? 1 : -1}
          yPos={startY - i * ROW_HEIGHT}
        />
      ))}
    </group>
  );
}

function BarcodeDecor() {
  const bars = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      x: -1.08 + i * 0.074,
      w: Math.random() * 0.022 + 0.01,
    }))
  );
  return (
    <group position={[0, -1.88, 0.055]}>
      {bars.current.map((b, i) => (
        <mesh key={i} position={[b.x, 0, 0]}>
          <planeGeometry args={[b.w, 0.28]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      ))}
      <Text
        position={[0, -0.22, 0.005]}
        fontSize={0.085}
        color="#333333"
        letterSpacing={0.12}
        anchorX="center"
      >
        AMQ · 2025 · SWE-001
      </Text>
    </group>
  );
}

function _handleMotion(e: DeviceMotionEvent) {
  if (!_motionEnabled.value) return;
  const x = e.accelerationIncludingGravity?.x ?? 0;
  const y = e.accelerationIncludingGravity?.y ?? 0;
  _motionTarget.x = Math.max(-3, Math.min(3, x)) * 0.18;
  _motionTarget.y = -0.5 + Math.max(-3, Math.min(3, y)) * 0.12;
}

function useDeviceMotion(
  targetPos: React.MutableRefObject<THREE.Vector3>,
  isDragging: React.MutableRefObject<boolean>
) {
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const isIOS = typeof (DeviceMotionEvent as any).requestPermission === "function";

    if (!isIOS) {
      // Android — langsung aktif
      _motionEnabled.value = true;
      window.addEventListener("devicemotion", _handleMotion);
    }
    // iOS — tunggu permission lewat tombol (lihat MotionPermissionButton)

    return () => {
      window.removeEventListener("devicemotion", _handleMotion);
    };
  }, []);

  // Sync _motionTarget ke targetPos setiap frame
  useFrame(() => {
    if (!_motionEnabled.value) return;
    if (isDragging.current) return;
    targetPos.current.set(_motionTarget.x, _motionTarget.y, 0);
  });
}

// ── iOS Permission Button ─────────────────────────────────────────────────────
function MotionPermissionButton() {
  const isIOS = typeof (DeviceMotionEvent as any).requestPermission === "function";
  const isMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const [granted, setGranted] = useState(false);

  if (!isIOS || !isMobile || granted) return null;

  const handleClick = async () => {
    try {
      const permission = await (DeviceMotionEvent as any).requestPermission();
      if (permission === "granted") {
        _motionEnabled.value = true;
        window.addEventListener("devicemotion", _handleMotion);
        setGranted(true);
      }
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: "5.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "rgba(255,255,255,0.6)",
        fontSize: "0.55rem",
        letterSpacing: "0.22em",
        padding: "0.45rem 1.1rem",
        borderRadius: "2px",
        fontFamily: "monospace",
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 10,
        textTransform: "uppercase",
      }}
    >
      ↑ Enable Motion
    </button>
  );
}

function IDCard({ isReady }: { isReady: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, keenanImg);
  const { viewport, gl } = useThree();

  const REST_Y = -0.5;

  const isDragging = useRef(false);
  const pos = useRef(new THREE.Vector3(0, REST_Y, 0));
  const targetPos = useRef(new THREE.Vector3(0, REST_Y, 0));
  const velPos = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector2());
  const rotVel = useRef(new THREE.Vector2());
  const wobble = useRef(0);
  const wasReleased = useRef(false);

  // Drop animation refs
  const dropY = useRef(7.0);         // posisi awal card (tinggi di atas layar)
  const dropVel = useRef(0);         // kecepatan jatuh
  const hasDropped = useRef(false);  // sudah landing?
  const landingTriggered = useRef(false); // wobble landing sudah trigger?

  // Device motion — goyang HP → card ikut goyang
  useDeviceMotion(targetPos, isDragging);

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

    const down = (e: MouseEvent) => {
      const w = toWorld(e.clientX, e.clientY);
      if (hit(w.x, w.y)) { isDragging.current = true; wobble.current = 0; }
    };
    const move = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const w = toWorld(e.clientX, e.clientY);
      targetPos.current.set(w.x, w.y, 0);
    };
    const up = () => {
      if (isDragging.current) wasReleased.current = true;
      isDragging.current = false;
      targetPos.current.set(0, REST_Y, 0);
    };
    const td = (e: TouchEvent) => {
      const w = toWorld(e.touches[0].clientX, e.touches[0].clientY);
      if (hit(w.x, w.y)) { isDragging.current = true; wobble.current = 0; }
    };
    const tm = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const w = toWorld(e.touches[0].clientX, e.touches[0].clientY);
      targetPos.current.set(w.x, w.y, 0);
    };

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

    // ── Phase 1: Jatuh dari atas ─────────────────────────────────────────
    if (isReady && !hasDropped.current) {
      // Damping ringan = ada bounce saat landing
      dropVel.current *= 0.88;
      dropVel.current += (REST_Y - dropY.current) * 0.038;
      dropY.current += dropVel.current;

      pos.current.y = dropY.current;
      targetPos.current.y = REST_Y;

      // Landing check
      if (Math.abs(dropY.current - REST_Y) < 0.05 && Math.abs(dropVel.current) < 0.012) {
        dropY.current = REST_Y;
        pos.current.y = REST_Y;
        hasDropped.current = true;
      }

      groupRef.current.position.copy(pos.current);
      const fallProgress = 1 - Math.max(0, Math.min(1, (dropY.current - REST_Y) / 7.5));
      groupRef.current.rotation.z = Math.sin(fallProgress * Math.PI) * 0.25;
      groupRef.current.rotation.x = -0.15 + fallProgress * 0.15;
      return;
    }

    if (hasDropped.current && !landingTriggered.current) {
      rotVel.current.y = 0;
      rot.current.y = 0;
      wobble.current = 0.002;
      landingTriggered.current = true;
    }

    if (wasReleased.current) { wobble.current = 1.0; wasReleased.current = false; }
    wobble.current *= 0;

    const stiff = isDragging.current ? 0.28 : 0.06;
    const damp  = isDragging.current ? 0.52 : 0.72;

    velPos.current.multiplyScalar(damp).addScaledVector(
      targetPos.current.clone().sub(pos.current), stiff
    );
    pos.current.add(velPos.current);
    groupRef.current.position.copy(pos.current);

    rotVel.current.x += (-velPos.current.y * 0.35 - rot.current.x) * 0.2;
    rotVel.current.y += (-rot.current.y) * 0.05;     
    rotVel.current.y += velPos.current.x * 0.5;      
    rotVel.current.multiplyScalar(0.78);           
    rot.current.add(rotVel.current);

    const t = clock.getElapsedTime();
    const swingZ = Math.sin(t * 0) * wobble.current * 0;
    groupRef.current.rotation.x = rot.current.x + Math.cos(t * 6) * wobble.current * 0.0;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = swingZ;
  });

  return (
    <>
      <Lanyard cardPos={pos} />
      <Buckle cardPos={pos} />
      <DragTrail cardPos={pos} isDragging={isDragging} />

      <group ref={groupRef}>
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
        <mesh position={[0, 2.27, 0.047]}>
          <planeGeometry args={[2.85, 0.012]} />
          <meshBasicMaterial color="#444444" />
        </mesh>
        <mesh position={[0, 1.57, 0.047]}>
          <planeGeometry args={[2.85, 0.012]} />
          <meshBasicMaterial color="#444444" />
        </mesh>
        <Text position={[0, 1.92, 0.052]} fontSize={0.2} color="#ffffff" letterSpacing={0.22} anchorX="center">
          · ID CARD ·
        </Text>

        <mesh position={[0, 0.44, 0.046]}>
          <planeGeometry args={[2.14, 2.14]} />
          <meshBasicMaterial color="#eeeeee" />
        </mesh>
        <mesh position={[0, 0.44, 0.050]}>
          <planeGeometry args={[2.08, 2.08]} />
          <meshBasicMaterial map={texture} />
        </mesh>

        <Text position={[0, -0.9, 0.052]} fontSize={0.38} fontWeight={900} color="#111111" letterSpacing={0.1} anchorX="center">
          amiqbal
        </Text>

        <mesh position={[0, -1.2, 0.050]}>
          <planeGeometry args={[1.8, 0.008]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>

        <Text position={[0, -1.4, 0.052]} fontSize={0.14} color="#555555" letterSpacing={0.2} anchorX="center">
          SOFTWARE ENGINEER
        </Text>

        <BarcodeDecor />
        <Brackets />
      </group>
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function Card({ isReady = false }: { isReady?: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 48 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={0.5} color="#f0f0ff" />
        <Suspense fallback={null}>
          <BackgroundText />
          <IDCard isReady={isReady} />
        </Suspense>
      </Canvas>

      <MotionPermissionButton />

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
          color: "rgba(235, 231, 231, 1)",
          fontSize: "0.6rem",
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
            borderTop: "5px solid rgba(230,227,227,0.4)",
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