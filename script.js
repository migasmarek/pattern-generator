import { Scene, SphereGeometry, Vector3, PerspectiveCamera, WebGLRenderer, Color, MeshBasicMaterial, Mesh, Clock } from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.146/examples/jsm/controls/OrbitControls.js';
import { createSculptureWithGeometry } from 'https://unpkg.com/shader-park-core/dist/shader-park-core.esm.js';
import { spCode } from '/sp-code.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

let scene = new Scene();

let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5.5;

let renderer = new WebGLRenderer({ antialias: true, transparent: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor( new Color(1, 1, 1), 0);
document.body.appendChild( renderer.domElement );

let clock = new Clock();

let button = document.querySelector('.button');
button.innerHTML = "Loading Audio..."
button.style.display = 'none';

let state = {
  mouse : new Vector3(),
  currMouse : new Vector3(),
  size: 0.5,
  pointerDown: 0.0,
  currPointerDown: 0.0,
  // audio: 0.0,
  // currAudio: 0.0,
  time: 0.0,
}

const gui = new GUI();
const obj = {
    size: state.size
}

gui.add(document, 'title');
gui.add(obj, 'size', 0, 1, 0.05);
gui.onChange( event => {
	console.log(event.object);     // object that was modified
	console.log(event.property);   // string, name of property
	console.log(event.value);
    state.size = event.value;      // new value of controller
	console.log(event.controller); // controller that was modified
} );

// create our geometry and material
let geometry  = new SphereGeometry(2, 45, 45);
// let material = new MeshBasicMaterial( { color: 0x33aaee} );
// let mesh = new Mesh(geometry, material);

let mesh = createSculptureWithGeometry(geometry, spCode(), () => {
  return {
    time: state.time,
    size: state.size,
    pointerDown: state.pointerDown,
    mouse: state.mouse,
    // audio: state.audio,
  }
})

scene.add(mesh);

window.addEventListener( 'pointermove', (event) => {
  state.currMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	state.currMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}, false );

window.addEventListener( 'pointerdown', (event) => state.currPointerDown = 1.0, false );
window.addEventListener( 'pointerup', (event) => state.currPointerDown = 0.0, false );

// Add mouse controlls
let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
} );

let onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize );


let render = () => {
  requestAnimationFrame( render );
  state.time += clock.getDelta();
  state.pointerDown = .1 * state.currPointerDown + .9 * state.pointerDown;
  state.mouse.lerp(state.currMouse, .05 );
  controls.update();
  renderer.render( scene, camera );
};

render();