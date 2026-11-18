// Escena 3D de la credencial colgante: una cinta (3 tramos unidos por "rope joints")
// sostiene una tarjeta rígida. La física la resuelve Rapier; la cinta se dibuja con MeshLine
// siguiendo una curva que pasa por los tramos.
import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree, type ThreeElement } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint,
  type RapierRigidBody, type RigidBodyProps,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { drawBack, drawBand, drawFront, type BadgeData } from './textures';

extend({ MeshLineGeometry, MeshLineMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    // El constructor recibe parámetros opcionales: 'args' no es obligatorio.
    meshLineMaterial: Partial<ThreeElement<typeof MeshLineMaterial>>;
  }
}

const CARD = { w: 1.6, h: 2.25 };
type Body = RapierRigidBody & { lerped?: THREE.Vector3 };

interface Textures { front: THREE.Texture; back: THREE.Texture; band: THREE.Texture }

function Band({ textures, onGrab }: { textures: Textures; onGrab: () => void }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<Body>(null), j1 = useRef<Body>(null), j2 = useRef<Body>(null), j3 = useRef<Body>(null);
  const card = useRef<Body>(null);
  const { width, height } = useThree(state => state.size);
  const [vec] = useState(() => new THREE.Vector3());
  const [ang] = useState(() => new THREE.Vector3());
  const [rot] = useState(() => new THREE.Vector3());
  const [dir] = useState(() => new THREE.Vector3());
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([0, 1, 2, 3].map(() => new THREE.Vector3()));
    c.curveType = 'chordal';
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const segment: RigidBodyProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  useRopeJoint(fixed as RefObject<RapierRigidBody>, j1 as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as RefObject<RapierRigidBody>, j2 as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as RefObject<RapierRigidBody>, j3 as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as RefObject<RapierRigidBody>, card as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 1.3, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => { document.body.style.cursor = ''; };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return;
    if (dragged) {
      // Proyecta el puntero sobre el plano de la escena y mueve la tarjeta hasta ahí.
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    // Suaviza los puntos intermedios para que la cinta no tiemble.
    for (const ref of [j1, j2]) {
      const body = ref.current!;
      const t = body.translation();
      body.lerped ??= new THREE.Vector3(t.x, t.y, t.z);
      const distance = Math.max(0.1, Math.min(1, body.lerped.distanceTo(t as THREE.Vector3)));
      body.lerped.lerp(t as THREE.Vector3, delta * (10 + distance * 40));
    }
    curve.points[0].copy(j3.current.translation() as THREE.Vector3);
    curve.points[1].copy(j2.current.lerped!);
    curve.points[2].copy(j1.current.lerped!);
    curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
    band.current.geometry.setPoints(curve.getPoints(32));
    // Tiende a mostrar el frente: frena el giro sobre el eje vertical.
    ang.copy(card.current.angvel() as THREE.Vector3);
    rot.copy(card.current.rotation() as unknown as THREE.Vector3);
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  const face = { clearcoat: 1, clearcoatRoughness: 0.2, roughness: 0.45, metalness: 0.15, transparent: true, alphaTest: 0.5 };
  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segment}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segment}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segment}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segment} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[CARD.w / 2, CARD.h / 2, 0.01]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => { (e.target as Element).releasePointerCapture(e.pointerId); drag(false); }}
            onPointerDown={e => {
              (e.target as Element).setPointerCapture(e.pointerId);
              const t = card.current!.translation();
              drag(new THREE.Vector3().copy(e.point).sub(vec.set(t.x, t.y, t.z)));
              onGrab();
            }}
          >
            <mesh position={[0, 0, 0.006]}>
              <planeGeometry args={[CARD.w, CARD.h]} />
              <meshPhysicalMaterial map={textures.front} {...face} />
            </mesh>
            <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD.w, CARD.h]} />
              <meshPhysicalMaterial map={textures.back} {...face} />
            </mesh>
            {/* Clip metálico */}
            <mesh position={[0, CARD.h / 2 - 0.02, 0]}>
              <boxGeometry args={[0.34, 0.14, 0.05]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh position={[0, 1.24, 0]}>
              <torusGeometry args={[0.08, 0.022, 12, 24]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white" depthTest={false} resolution={new THREE.Vector2(width, height)}
          useMap={1} map={textures.band} repeat={new THREE.Vector2(-3, 1)} lineWidth={1}
        />
      </mesh>
    </>
  );
}

export default function LanyardScene({ data, onReady, onGrab }: { data: BadgeData; onReady: () => void; onGrab: () => void }) {
  const [textures, setTextures] = useState<Textures | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([drawFront(data), drawBack(data), drawBand(data.name)]).then(([front, back, band]) => {
      if (alive) setTextures({ front, back, band });
    });
    return () => { alive = false; };
  }, [data]);

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      aria-hidden="true"
    >
      <ambientLight intensity={Math.PI} />
      {textures && (
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band textures={textures} onGrab={onGrab} />
          <Ready onReady={onReady} />
        </Physics>
      )}
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="#93c5fd" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

/** Avisa una sola vez, en el primer cuadro dibujado con la tarjeta. */
function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
  return null;
}
