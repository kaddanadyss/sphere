const canvasSketch = require("canvas-sketch");

// Import ThreeJS and assign it to global scope
// This way examples/ folder can use it too
const THREE = require("three");
global.THREE = THREE;

// Import extra THREE plugins
require("three/examples/js/controls/OrbitControls");

const Stats = require("stats-js");

const settings = {
  animate: true,
  context: "webgl",
  resizeCanvas: false
};

const sketch = ({ context, canvas }) => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  // Setup
  // -----

  const renderer = new THREE.WebGLRenderer({ context });
  renderer.setClearColor(0x1f1e1c, 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0, 0, 5);

  const controls = new THREE.OrbitControls(camera, canvas);

  const scene = new THREE.Scene();

  // Content
  // -------

  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Update
  // ------

  const update = (deltaTime) => {
    const ROTATE_TIME = 30; // Time in seconds for a full rotation
    const xAxis = new THREE.Vector3(1, 0, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);
    const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
    const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;

    mesh.rotateOnWorldAxis(xAxis, rotateX);
    mesh.rotateOnWorldAxis(yAxis, rotateY);
  };

  // Lifecycle
  // ---------

  return {
    resize({ canvas, pixelRatio, viewportWidth, viewportHeight }) {
      const dpr = Math.min(pixelRatio, 2); // Cap DPR scaling to 2x

      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      canvas.style.width = viewportWidth + "px";
      canvas.style.height = viewportHeight + "px";

      renderer.setPixelRatio(dpr);
      renderer.setSize(viewportWidth, viewportHeight);

      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render({ time, deltaTime }) {
      stats.begin();
      controls.update();
      update(deltaTime);
      renderer.render(scene, camera);
      stats.end();
    },
    unload() {
      geometry.dispose();
      material.dispose();
      controls.dispose();
      renderer.dispose();
      document.body.removeChild(stats.dom);
    }
  };
};

canvasSketch(sketch, settings);
