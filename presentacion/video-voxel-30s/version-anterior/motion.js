import * as THREE from "./vendor/three.module.js";

// All characters, terrain and connections are procedural, editable 3D geometry.
const canvas = document.querySelector("#stage"),
  ctx = canvas.getContext("2d");
const music = document.querySelector("#music"),
  demo = document.querySelector("#demo");
const seek = document.querySelector("#seek"),
  statusLabel = document.querySelector("#status");
const clamp = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
let script = [
  {
    start: 0,
    end: 4,
    tag: "01 / EXISTING NASA RESEARCH",
    title: ["NASA ALREADY", "MODELS THE HUMAN BODY."],
    sub: "DAS: biomechanics · CMO-DA: decision-support research",
  },
  {
    start: 4,
    end: 8,
    tag: "02 / THE ASTRONAUT’S QUESTION",
    title: ["DATA IS NOT", "UNDERSTANDING."],
    sub: "Can I trust it? What is missing? What does it mean?",
  },
  {
    start: 8,
    end: 12,
    tag: "03 / INTRODUCING TWINNAUTA",
    title: ["START WITH", "THE BODY."],
    sub: "Select a region. Inspect its indicators and baseline.",
  },
  {
    start: 12,
    end: 17,
    tag: "04 / EXPLORE THE CONNECTIONS",
    title: ["BUILD CONTEXT.", "FOLLOW THE GRAPH."],
    sub: "Evidence · scenarios · next steps",
  },
  {
    start: 17,
    end: 21,
    tag: "05 / TRACE THE EXPLANATION",
    title: ["OPEN THE PAPER.", "CHECK THE LIMITS."],
    sub: "Source · population · method · applicability",
  },
  {
    start: 21,
    end: 25,
    tag: "06 / FROM DATA TO A NEXT CHECK",
    title: ["TwinNauta"],
    sub: "Connected indicators. Traceable evidence. Human decisions.",
  },
  {
    start: 25,
    end: 30,
    tag: "07 / THE WORKING PROTOTYPE",
    title: ["SEE IT IN ACTION."],
    sub: "Replace these five seconds with your platform recording.",
  },
];
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true,
});
renderer.setSize(1920, 1080);
renderer.setPixelRatio(1);
renderer.setClearColor("#071320");
renderer.outputColorSpace = THREE.SRGBColorSpace;
const world = new THREE.Scene();
world.fog = new THREE.FogExp2("#071320", 0.018);
const camera = new THREE.PerspectiveCamera(43, 1920 / 1080, 0.1, 160);
world.add(new THREE.HemisphereLight("#ccefff", "#26333e", 2.5));
const key = new THREE.DirectionalLight("#fff0cf", 4);
key.position.set(5, 14, 9);
world.add(key);
const rim = new THREE.DirectionalLight("#45e8ff", 3);
rim.position.set(-9, 7, -10);
world.add(rim);
const geometry = new THREE.BoxGeometry(1, 1, 1),
  materials = new Map();
function material(color, glow = false) {
  const id = color + glow;
  if (!materials.has(id))
    materials.set(
      id,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.75,
        metalness: 0.1,
        emissive: glow ? color : "#000000",
        emissiveIntensity: glow ? 0.65 : 0,
      }),
    );
  return materials.get(id);
}
function block(parent, x, y, z, w, h, d, color, glow = false) {
  const mesh = new THREE.Mesh(geometry, material(color, glow));
  mesh.position.set(x, y, z);
  mesh.scale.set(w, h, d);
  parent.add(mesh);
  return mesh;
}
function group(parent = world) {
  const g = new THREE.Group();
  parent.add(g);
  return g;
}
function label(parent, content, x, y, z, color = "#bafff2", size = 2.8) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 128;
  const q = c.getContext("2d");
  q.fillStyle = "#071a2bea";
  q.fillRect(0, 0, 768, 128);
  q.strokeStyle = color;
  q.lineWidth = 4;
  q.strokeRect(2, 2, 764, 124);
  q.fillStyle = color;
  q.font = "bold 42px monospace";
  q.textAlign = "center";
  q.fillText(content, 384, 80);
  const texture = new THREE.CanvasTexture(c);
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, depthTest: false }),
  );
  s.position.set(x, y, z);
  s.scale.set(size, size / 6, 1);
  parent.add(s);
  return s;
}
function connector(parent, a, b, color = "#5ff2d9") {
  const delta = new THREE.Vector3().subVectors(b, a);
  const mesh = block(
    parent,
    0,
    0,
    0,
    0.045,
    delta.length(),
    0.045,
    color,
    true,
  );
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    delta.normalize(),
  );
  return mesh;
}
// A floating voxel island assembles one block at a time.
const island = group(),
  tiles = [];
for (let x = -9; x <= 9; x++)
  for (let z = -7; z <= 7; z++) {
    if ((x / 10) ** 2 + (z / 8) ** 2 > 1) continue;
    const h = 1 + Math.floor((Math.sin(x * 2.7 + z * 4.1) + 1) * 1.3);
    const top = block(
      island,
      x,
      -0.5,
      z,
      0.96,
      0.5,
      0.96,
      (x + z) % 4 === 0 ? "#507a89" : "#385965",
    );
    tiles.push({
      mesh: top,
      target: -0.5,
      delay: (Math.abs(x) + Math.abs(z)) * 0.045,
    });
    block(
      island,
      x,
      -0.9 - h * 0.23,
      z,
      0.94,
      h * 0.48,
      0.94,
      (x + z) % 3 ? "#243d50" : "#1b3044",
    );
  }
for (let x = -6; x <= 6; x++)
  block(island, x, -0.22, 0, 0.8, 0.045, 0.3, "#5ff2d9", true);
const stars = group();
for (let i = 0; i < 180; i++)
  block(
    stars,
    Math.sin(i * 127.1) * 65,
    4 + ((i * 13) % 43),
    Math.cos(i * 73.3) * 65,
    0.045,
    0.045,
    0.045,
    "#bad5ff",
    true,
  );
// Earth is built from cubes; no raster background images are used.
const earth = group();
earth.position.set(-19, 12, -31);
for (let x = -7; x <= 7; x++)
  for (let y = -7; y <= 7; y++)
    for (let z = -7; z <= 7; z++) {
      const r = x * x + y * y + z * z;
      if (r > 49 || r < 34) continue;
      const land =
        Math.sin(x * 1.3 + y * 0.8) + Math.cos(z * 1.4 - y * 0.8) > 1;
      block(
        earth,
        x * 0.7,
        y * 0.7,
        z * 0.7,
        0.7,
        0.7,
        0.7,
        Math.abs(y) > 5 ? "#d7eff4" : land ? "#479c89" : "#256895",
      );
    }
// Batch static blocks to keep camera motion smooth on integrated graphics.
function batchBlocks(parent, selected) {
  const batches = new Map();
  selected.forEach((mesh) => {
    mesh.updateMatrix();
    if (!batches.has(mesh.material)) batches.set(mesh.material, []);
    batches.get(mesh.material).push(mesh);
  });
  batches.forEach((meshes, mat) => {
    const instance = new THREE.InstancedMesh(geometry, mat, meshes.length);
    meshes.forEach((mesh, i) => {
      instance.setMatrixAt(i, mesh.matrix);
      parent.remove(mesh);
    });
    instance.instanceMatrix.needsUpdate = true;
    parent.add(instance);
  });
}
batchBlocks(earth, [...earth.children]);
batchBlocks(stars, [...stars.children]);
const movingTiles = new Set(tiles.map((tile) => tile.mesh));
batchBlocks(
  island,
  island.children.filter((mesh) => !movingTiles.has(mesh)),
);
const astronaut = group();
block(astronaut, 0, 1.6, 0, 1.3, 1.5, 0.8, "#e0edf3");
block(astronaut, 0, 1.7, -0.6, 1.15, 1.2, 0.5, "#6b879d");
block(astronaut, 0, 2.95, 0, 1.8, 1.6, 1.4, "#eef5f7");
block(astronaut, 0, 2.95, 0.73, 1.45, 1.02, 0.08, "#12304a");
block(astronaut, -0.38, 3.08, 0.79, 0.19, 0.16, 0.05, "#65fff1", true);
block(astronaut, 0.38, 3.08, 0.79, 0.19, 0.16, 0.05, "#65fff1", true);
block(astronaut, 0, 2.73, 0.79, 0.32, 0.06, 0.05, "#65fff1", true);
block(astronaut, -0.5, 3.35, 0.78, 0.45, 0.08, 0.03, "#bdeeff");
block(astronaut, 0, 1.65, 0.43, 0.72, 0.55, 0.09, "#23465f");
for (let i = 0; i < 3; i++)
  block(
    astronaut,
    -0.22 + i * 0.22,
    1.65,
    0.49,
    0.11,
    0.17,
    0.04,
    "#64f5d7",
    true,
  );
block(astronaut, 0, 1.05, 0.03, 1.32, 0.16, 0.85, "#3b657d");
const limbs = [];
for (const side of [-1, 1]) {
  const arm = group(astronaut);
  arm.position.set(side * 0.88, 2.1, 0);
  block(arm, 0, -0.5, 0, 0.42, 1.1, 0.55, "#cadfe9");
  block(arm, 0, -1.05, 0, 0.5, 0.34, 0.6, "#7798ae");
  limbs.push(arm);
  const leg = group(astronaut);
  leg.position.set(side * 0.36, 0.9, 0);
  block(leg, 0, -0.38, 0, 0.48, 0.78, 0.6, "#dceaf1");
  block(leg, 0, -0.8, 0.15, 0.56, 0.28, 0.9, "#7798ae");
  limbs.push(leg);
}
const thigh = block(
  astronaut,
  0.36,
  0.57,
  0.34,
  0.5,
  0.55,
  0.06,
  "#ffb36b",
  true,
);
thigh.visible = false;
// Three original mini-builds: NASA research, measurements, and scientific papers.
const research = group(),
  researchBlocks = [];
for (let i = 0; i < 3; i++) {
  const x = -5 + i * 5;
  const building = group(research);
  building.position.set(x, 0, -2);
  for (let y = 0; y < 4; y++)
    for (let a = -1; a <= 1; a++)
      researchBlocks.push(
        block(
          building,
          a * 0.7,
          0.3 + y * 0.7,
          0,
          0.65,
          0.65,
          0.8,
          ["#409bb5", "#7088c5", "#54baa9"][i],
        ),
      );
  for (let y = 0; y < 3; y++)
    block(building, 0, 0.5 + y * 0.7, 0.43, 1.7, 0.12, 0.06, "#b3ffff", true);
  label(
    building,
    ["DAS", "CMO-DA", "PUBLICATIONS"][i],
    0,
    3.8,
    0,
    "#d0edff",
    4,
  );
  label(
    building,
    ["BIOMECHANICS", "RESEARCH", "EVIDENCE"][i],
    0,
    4.5,
    0,
    "#6ef2d3",
    3.6,
  );
}
const readings = group(),
  readingsItems = [];
[
  "AREA / cm²",
  "TORQUE / N·m",
  "EXERCISE",
  "BASELINE",
  "METHOD",
  "MISSING?",
  "SOURCE?",
  "DAY 10",
].forEach((name, i) => {
  const g = group(readings);
  block(g, 0, 0, 0, 1.4, 0.9, 0.2, i > 4 ? "#af784f" : "#28627a");
  label(g, name, 0, 0.85, 0, i > 4 ? "#ffca8e" : "#a7fff1", 2.8);
  for (let k = 0; k < 5; k++)
    block(
      g,
      -0.5 + k * 0.25,
      -0.15,
      0.15,
      0.12,
      0.2 + (k % 3) * 0.15,
      0.04,
      "#a9e6ed",
      true,
    );
  readingsItems.push(g);
});
const graphGroup = group(),
  nodes = [],
  edges = [],
  pulses = [];
const nodeSpecs = [
  ["QUADRICEPS", 0, 3, 0, "#5ff2d9"],
  ["AREA", -4, 2, 1, "#40badd"],
  ["TORQUE", -3, 5, -1, "#40badd"],
  ["EXERCISE", -4, 3, -4, "#40badd"],
  ["SCOTT 2020", 2, 6, -3, "#b69aff"],
  ["SPRINT 2024", 5, 4, -2, "#b69aff"],
  ["LIMITS", 5, 1, 1, "#ffbc85"],
  ["NEXT CHECK", 2, 2, 4, "#7cedae"],
  ["CONTEXT", 0, 5, 4, "#e1edff"],
];
nodeSpecs.forEach(([name, x, y, z, color], i) => {
  const g = group(graphGroup);
  g.position.set(x, y, z);
  block(
    g,
    0,
    0,
    0,
    i === 0 ? 1.3 : 0.75,
    i === 0 ? 1.3 : 0.75,
    i === 0 ? 1.3 : 0.75,
    color,
    true,
  );
  label(g, name, 0, 1, 0, color, 2.7);
  nodes.push(g);
});
[
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [1, 5],
  [4, 6],
  [5, 6],
  [0, 8],
  [8, 7],
  [7, 6],
].forEach(([a, b], i) => {
  const mesh = connector(
    graphGroup,
    nodes[a].position,
    nodes[b].position,
    i < 5 ? "#67dce7" : "#c0a3fa",
  );
  edges.push(mesh);
  const pulse = block(graphGroup, 0, 0, 0, 0.15, 0.15, 0.15, "#ffffff", true);
  pulses.push({ mesh: pulse, a, b });
});
const library = group();
for (let i = 0; i < 11; i++) {
  const g = group(library);
  g.position.set(-5 + i * 0.85, 0.1, -2 + Math.sin(i) * 0.6);
  g.rotation.y = (i - 5) * 0.06;
  block(g, 0, 1.3, 0, 0.55, 2.6, 1.5, i % 2 ? "#7566a8" : "#3c8193");
  block(g, 0, 1.3, 0.78, 0.4, 2.4, 0.05, "#dce9ed");
}
const documentGroup = group(library);
documentGroup.position.set(2.5, 3, 2);
documentGroup.rotation.y = -0.15;
block(documentGroup, 0, 0, 0, 4, 4.7, 0.18, "#dfeef2");
block(documentGroup, 0, 1.6, 0.12, 3.2, 0.35, 0.03, "#2c6283");
for (let i = 0; i < 7; i++)
  block(
    documentGroup,
    -0.1,
    0.8 - i * 0.38,
    0.12,
    2.9 - (i % 3) * 0.3,
    0.1,
    0.04,
    i === 4 ? "#b98554" : "#809da9",
  );
label(documentGroup, "SOURCE + LIMITS", 0, 2.9, 0, "#b5ffec", 4.5);
const portal = group();
for (let x = -4; x <= 4; x++)
  for (let y = 0; y <= 7; y++) {
    if (Math.abs(x) === 4 || y === 0 || y === 7)
      block(portal, x * 0.7, y * 0.7, 0, 0.65, 0.65, 0.7, "#5ff2d9", true);
  }
portal.position.set(0, 0, -3);
label(portal, "TwinNauta", 0, 5.7, 0, "#d9fff8", 6);
const sceneGroups = [research, readings, graphGroup, library, portal];
function text(value, x, y, size = 32, color = "#eef8ff", weight = 700) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Arial,sans-serif`;
  ctx.fillText(value, x, y);
}
function drawPanel(lines, x, y, w = 460) {
  ctx.fillStyle = "#071522e8";
  ctx.fillRect(x, y, w, lines.length * 45 + 36);
  ctx.fillStyle = "#5ff2d9";
  ctx.fillRect(x, y, 4, lines.length * 45 + 36);
  lines.forEach((line, i) =>
    text(line, x + 23, y + 43 + i * 45, i ? 24 : 27, i ? "#c4d6e1" : "#5ff2d9"),
  );
}
window.ready = Promise.resolve();
window.renderAt = function (t) {
  t = Math.min(29.999, t);
  const index = script.findIndex((s) => t >= s.start && t < s.end),
    s = script[index],
    u = t - s.start;
  sceneGroups.forEach((g) => (g.visible = false));
  research.visible = index === 0;
  readings.visible = index === 1 || index === 2;
  graphGroup.visible = index === 3;
  library.visible = index === 4;
  portal.visible = index >= 5;
  earth.rotation.y = t * 0.025;
  stars.rotation.y = t * 0.005;
  tiles.forEach(({ mesh, target, delay }) => {
    mesh.position.y = target - (1 - ease((t - delay) / 0.65)) * 8;
  });
  researchBlocks.forEach((mesh, i) => {
    mesh.scale.y = 0.65 * ease((u - i * 0.012) / 0.6);
  });
  astronaut.visible = index !== 3 && index !== 4;
  astronaut.position.set(
    index === 0 ? 0 : index === 2 ? 2 : 0,
    index === 1 ? 0.6 + Math.sin(t * 2) * 0.25 : 0,
    index === 0 ? 2 : 1.5,
  );
  astronaut.rotation.y =
    index === 1
      ? Math.sin(t) * 0.25
      : index === 2
        ? -0.4 + u * 0.3
        : index >= 5
          ? u * 0.4
          : Math.sin(t * 0.7) * 0.1;
  limbs.forEach((limb, i) => {
    limb.rotation.x =
      Math.sin(t * 5 + i) * (index === 0 || index === 5 ? 0.28 : 0.08);
    limb.rotation.z = i % 2 === 0 ? Math.sin(t * 2 + i) * 0.15 : 0;
  });
  thigh.visible = index === 2;
  thigh.material.emissiveIntensity = 0.7 + Math.sin(t * 8) * 0.3;
  readingsItems.forEach((g, i) => {
    const a = (i / 8) * Math.PI * 2 + t * 0.35;
    g.position.set(
      Math.cos(a) * 4.8,
      3 + Math.sin(a * 1.5) * 1.6,
      Math.sin(a) * 4,
    );
    g.rotation.y = -a;
    g.scale.setScalar(index === 2 ? Math.max(0.4, 1 - u * 0.12) : 1);
  });
  nodes.forEach((g, i) => {
    const e = ease((u - i * 0.12) / 0.8);
    g.scale.setScalar(Math.max(0.001, e));
    g.rotation.y = u * 0.3;
  });
  edges.forEach((mesh, i) => (mesh.visible = u > i * 0.13 + 0.5));
  pulses.forEach(({ mesh, a, b }, i) => {
    mesh.visible = u > 1;
    mesh.position.lerpVectors(
      nodes[a].position,
      nodes[b].position,
      (u * 0.45 + i * 0.17) % 1,
    );
  });
  documentGroup.rotation.y = -0.3 + Math.sin(t * 0.4) * 0.12;
  const orbit =
    index === 3
      ? -0.65 + u * 0.14
      : index === 4
        ? 0.5 + u * 0.06
        : 0.45 + u * 0.08;
  const distance =
    index === 0
      ? 24 - u * 1.0
      : index === 1
        ? 18
        : index === 2
          ? 15.5
          : index === 3
            ? 21 - u * 0.6
            : index === 4
              ? 17
              : 19 - u * 0.35;
  camera.position.set(
    Math.sin(orbit) * distance,
    9 + (index === 0 ? 3 - u * 0.6 : Math.sin(u * 0.4)),
    Math.cos(orbit) * distance,
  );
  camera.lookAt(0, index === 0 ? 1.7 : 2, 0);
  renderer.render(world, camera);
  ctx.globalAlpha = 1;
  ctx.drawImage(renderer.domElement, 0, 0);
  if (index === 6 && demo.readyState >= 2) {
    ctx.fillStyle = "#030b16";
    ctx.fillRect(0, 0, 1920, 1080);
    const k = Math.min(1920 / demo.videoWidth, 1080 / demo.videoHeight);
    ctx.drawImage(
      demo,
      (1920 - demo.videoWidth * k) / 2,
      (1080 - demo.videoHeight * k) / 2,
      demo.videoWidth * k,
      demo.videoHeight * k,
    );
    return;
  }
  const shade = ctx.createLinearGradient(0, 0, 0, 500);
  shade.addColorStop(0, "#04101bea");
  shade.addColorStop(1, "#04101b00");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 1920, 500);
  ctx.fillStyle = "#04101bbd";
  ctx.fillRect(0, 930, 1920, 150);
  text(s.tag, 80, 67, 22, "#7effe3");
  s.title.forEach((value, i) => {
    const a = ease((u - i * 0.12) / 0.5);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate((1 - a) * -100, 0);
    text(
      value,
      80,
      160 + i * 91,
      index === 0 ? 72 : index === 5 ? 110 : 80,
      i ? "#70f5dc" : "#ffffff",
      800,
    );
    ctx.restore();
  });
  text(s.sub, 80, 985, 30, "#d7e8f3", 400);
  text("TWINNAUTA / RESEARCH PROTOTYPE", 80, 1043, 18, "#90adbd");
  text(
    index === 0
      ? "RESEARCH REFERENCES · NO NASA SYSTEM INTEGRATION"
      : "CONCEPTUAL VISUALIZATION · SYNTHETIC CASE",
    1120,
    1043,
    17,
    "#90adbd",
  );
  if (index === 1)
    drawPanel(
      [
        "DAY 10 / SYNTHETIC CASE",
        "Torque: missing",
        "Exercise: not recorded",
        "Missing ≠ zero",
      ],
      80,
      520,
      430,
    );
  if (index === 2)
    drawPanel(
      [
        "QUADRICEPS",
        "Muscle area · baseline",
        "Knee-extension torque",
        "Exercise record",
      ],
      80,
      540,
      440,
    );
  if (index === 3)
    drawPanel(
      [
        "EXPLORE THE MAP",
        "Evidence → explanation",
        "Scenario → limitations",
        "Next steps → requirements",
      ],
      80,
      560,
      450,
    );
  if (index === 4)
    drawPanel(
      [
        "CHECK APPLICABILITY",
        "Bed rest ≠ spaceflight",
        "Summary → excerpt → original",
        "Sources stay visible",
      ],
      80,
      540,
      470,
    );
  if (index === 5)
    drawPanel(
      [
        "NEXT STEP",
        "Confirm the missing record",
        "Review the source and method",
        "Human-led follow-up",
      ],
      80,
      550,
      470,
    );
  if (index === 6) {
    ctx.strokeStyle = "#5ff2d9";
    ctx.lineWidth = 3;
    ctx.strokeRect(65, 350, 1790, 540);
    text("YOUR REAL PLATFORM / 25–30 s", 110, 830, 32, "#5ff2d9");
  }
  ctx.fillStyle = "#5ff2d9";
  ctx.fillRect(80, 1067, (1760 * t) / 30, 3);
  // A quick voxel-shutter transition accompanies each new location.
  if (u < 0.22 && index > 0) {
    const p = 1 - u / 0.22;
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = i % 2 ? "#102b3f" : "#5ff2d9";
      ctx.fillRect(i * 120, 0, 120, 1080 * p);
    }
  }
};
let playing = false,
  position = 0,
  epoch = 0,
  recording = false;
function pause() {
  playing = false;
  music.pause();
  demo.pause();
}
function play() {
  if (position >= 30) position = 0;
  epoch = performance.now() - position * 1000;
  playing = true;
  music.currentTime = position;
  music.play().catch(() => {});
  if (position >= 25 && demo.src) {
    demo.currentTime = position - 25;
    demo.play();
  }
}
function tick() {
  if (playing) {
    position = (performance.now() - epoch) / 1000;
    if (position >= 30) {
      position = 30;
      pause();
    }
    if (position >= 25 && demo.src && demo.paused && position < 30) {
      demo.currentTime = position - 25;
      demo.play();
    }
  }
  if (!recording) {
    window.renderAt(position);
    seek.value = position;
    document.querySelector("#clock").textContent =
      `${position.toFixed(2)} / 30`;
  }
  requestAnimationFrame(tick);
}
window.ready.then(() => {
  window.renderAt(0);
  requestAnimationFrame(tick);
});
document.querySelector("#play").onclick = () => (playing ? pause() : play());
seek.oninput = () => {
  pause();
  position = Number(seek.value);
  if (demo.src) demo.currentTime = Math.max(0, position - 25);
};
document.querySelector("#upload").onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    demo.src = URL.createObjectURL(file);
    statusLabel.textContent = "Demo loaded. Preview from 25 seconds.";
  }
};
const editor = document.querySelector("#script");
editor.value = JSON.stringify(script, null, 2);
document.querySelector("#apply").onclick = () => {
  try {
    const data = JSON.parse(editor.value);
    if (
      data.length !== 7 ||
      data.some(
        (s, i) =>
          s.start !== script[i].start ||
          s.end !== script[i].end ||
          !Array.isArray(s.title),
      )
    )
      throw Error("Keep the seven scene timings.");
    script = data;
    statusLabel.textContent = "Text updated";
  } catch (e) {
    statusLabel.textContent = e.message;
  }
};
function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
document.querySelector("#save").onclick = () =>
  download(
    new Blob([JSON.stringify(script, null, 2)], { type: "application/json" }),
    "script.json",
  );
let audioContext, audioSource, audioDestination;
window.exportVideo = async function (slowdown = 1) {
  pause();
  await window.ready;
  recording = true;
  statusLabel.textContent = "Exporting 30 seconds…";
  if (!audioContext) {
    audioContext = new AudioContext();
    audioSource = audioContext.createMediaElementSource(music);
    audioDestination = audioContext.createMediaStreamDestination();
    audioSource.connect(audioDestination);
    audioSource.connect(audioContext.destination);
  }
  await audioContext.resume();
  const stream = canvas.captureStream(30);
  audioDestination.stream
    .getAudioTracks()
    .forEach((track) => stream.addTrack(track));
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : "video/webm";
  const recorder = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 12000000,
  });
  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((resolve) => (recorder.onstop = resolve));
  window.renderAt(0);
  music.currentTime = 0;
  recorder.start();
  music.playbackRate = 1 / slowdown;
  await music.play();
  const start = performance.now();
  await new Promise((resolve) => {
    function draw() {
      const t = (performance.now() - start) / (1000 * slowdown);
      window.renderAt(t);
      if (t >= 25 && demo.src && demo.paused) {
        demo.currentTime = t - 25;
        demo.play();
      }
      if (t < 30) requestAnimationFrame(draw);
      else resolve();
    }
    draw();
  });
  music.playbackRate = 1;
  recorder.stop();
  pause();
  await done;
  stream.getVideoTracks().forEach((track) => track.stop());
  recording = false;
  position = 0;
  statusLabel.textContent = "Export complete";
  download(
    new Blob(chunks, { type: "video/webm" }),
    "TwinNauta_dynamic_EN.webm",
  );
};
document.querySelector("#export").onclick = () =>
  window.exportVideo().catch((e) => {
    recording = false;
    statusLabel.textContent = e.message;
  });
window.seekTo = function (seconds) {
  pause();
  position = seconds;
  window.renderAt(seconds);
};
