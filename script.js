import { Scene, SphereGeometry, Vector3, PerspectiveCamera, WebGLRenderer, Color, MeshBasicMaterial, Mesh, Clock, BoxGeometry } from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.146/examples/jsm/controls/OrbitControls.js';
import { createSculptureWithGeometry } from 'https://unpkg.com/shader-park-core/dist/shader-park-core.esm.js';
import { spCode } from '/sp-code.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

let scene = new Scene();

let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 2;

let renderer = new WebGLRenderer({ antialias: true, transparent: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor( new Color(1, 1, 1), 1);
document.body.appendChild( renderer.domElement );

let clock = new Clock();

let state = {
  mouse : new Vector3(),
  currMouse : new Vector3(),
  size: 0.5,
  pointerDown: 0.0,
  currPointerDown: 0.0,
  time: 0.0,
  scale: 0.15,
  color1r: 0.2,
  color1g: 0.163,
  color1b: 0.51,
  color2r: 0.4,
  color2g: 0.863,
  color2b: 0.4,
  color3r: 0.76,
  color3g: 0.863,
  color3b: 1.0,
  rcr: 0.5,
  rcg: 0.5,
  rcb: 0.5,
  metalAmount: 0.0,
  displaceX: 0.1,
  displaceY: 1,
  displaceZ: 0,
  occlusionValue: 0.1,
//   stepSize: .5
}

const gui = new GUI();
const obj = {
    size: state.size,
    scale: state.scale,
    metalAmount: state.metalAmount,
    displaceX: state.displaceX,
    displaceY: state.displaceY,
    displaceZ: state.displaceZ,
    occlusionValue: state.occlusionValue,
    // stepSize: state.stepSize,
    color1: {
        r: state.color1r,
        g: state.color1g,
        b: state.color1b
    },
    color2: {
        r: state.color2r,
        g: state.color2g,
        b: state.color2b
    },
    color3: {
        r: state.color3r,
        g: state.color3g,
        b: state.color3b
    },
    reflectiveColor: {
        r: state.rcr,
        g: state.rcg,
        b: state.rcb
    }
}

gui.add(document, 'title');
gui.add(obj, 'size', 0, 1, 0.05);
gui.add(obj, 'scale', 0, 2, 0.01);
gui.add(obj, 'metalAmount', 0, 1, 0.01);
gui.add(obj, 'displaceX', 0, 10, 0.01);
gui.add(obj, 'displaceY', 0, 10, 0.01);
gui.add(obj, 'displaceZ', 0, 10, 0.01);
gui.add(obj, 'occlusionValue', 0.0, 0.95, 0.01);
// gui.add(obj, 'stepSize', .01, .95, 0.01);
gui.addColor(obj, 'color1');
gui.addColor(obj, 'color2');
gui.addColor(obj, 'color3');
gui.addColor(obj, 'reflectiveColor');
gui.onChange( event => {
    console.log(event.property);
    if (event.property === "color1") {
        state.color1r = event.value.r;
        state.color1g = event.value.g;
        state.color1b = event.value.b;
    } else if (event.property === "color2") {
        state.color2r = event.value.r;
        state.color2g = event.value.g;
        state.color2b = event.value.b;
    }  else if (event.property === "color3") {
        state.color3r = event.value.r;
        state.color3g = event.value.g;
        state.color3b = event.value.b;
    } else if (event.property === "reflectiveColor") {
        state.rcr = event.value.r;
        state.rcg = event.value.g;
        state.rcb = event.value.b;
    } else {
        state[event.property] = event.value;
    }
    console.log(state);
	//console.log(event.object);     // object that was modified
	//console.log(event.property);   // string, name of property
	//console.log(event.value);
    //state.size = event.value;      // new value of controller
	//console.log(event.controller); // controller that was modified
} );

// create our geometry and material
let geometry  = new BoxGeometry();

let mesh = createSculptureWithGeometry(geometry, spCode(), () => {
  return {
    time: state.time,
    size: state.size,
    scale: state.scale,
    pointerDown: state.pointerDown,
    mouse: state.mouse,
    color1r: state.color1r,
    color1g: state.color1g,
    color1b: state.color1b,
    color2r: state.color2r,
    color2g: state.color2g,
    color2b: state.color2b,
    color3r: state.color3r,
    color3g: state.color3g,
    color3b: state.color3b,
    rcr: state.rcr,
    rcg: state.rcg,
    rcb: state.rcb,
    metalAmount: state.metalAmount,
    displaceX: state.displaceX,
    displaceY: state.displaceY,
    displaceZ: state.displaceZ,
    occlusionValue: state.occlusionValue,
    // stepSize: state.stepSize,
  }
})

scene.add(mesh);

// Function to resize cube to fit full screen
function resizeCubeToFitScreen() {
    const aspectRatio = window.innerWidth / window.innerHeight;
  
    // Adjust cube scaling to fit both width and height of the screen
    if (aspectRatio > 1) {
        mesh.scale.set(aspectRatio, 1, 1); // Widen the cube when width > height
    } else {
        mesh.scale.set(1, 1 / aspectRatio, 1); // Heighten the cube when height > width
    }
  }

  // Initial resize for the cube
resizeCubeToFitScreen();

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

  resizeCubeToFitScreen();
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