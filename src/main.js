const TrackballControls = require('three-trackballcontrols');

/////////////////////////////////////////
// Scene Setup
/////////////////////////////////////////

let scene,
    camera,
    renderer,
    controls;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(-5, 12, 10);
camera.lookAt( scene.position );

renderer = new THREE.WebGLRenderer({
  alpha: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );


/////////////////////////////////////////
// Trackball Controller
/////////////////////////////////////////

controls = new TrackballControls( camera );
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 3.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.2;


/////////////////////////////////////////
// Lighting
/////////////////////////////////////////

var iphone_color  = '#FAFAFA',
    ambientLight  = new THREE.AmbientLight( '#EEEEEE' ),
    hemiLight     = new THREE.HemisphereLight( iphone_color, iphone_color, 0 ),
    light         = new THREE.PointLight( iphone_color, 1, 100 );

hemiLight.position.set( 0, 50, 0 );
light.position.set( 0, 20, 10 );

scene.add( ambientLight );
scene.add( hemiLight );
scene.add( light );


/////////////////////////////////////////
// Utilities
/////////////////////////////////////////

var axesHelper = new THREE.AxesHelper( 1.25 );
scene.add( axesHelper );

/////////////////////////////////////////
// Objects add to scene
/////////////////////////////////////////

createBox(5,0.01,20,'grey', [0,0,0]);
let player = createBox(1,1,1,'red',[0,0.5,0]);
let playerZ = 0;

/////////////////////////////////////////
// Render Loop
/////////////////////////////////////////

function render() {
  renderer.render( scene, camera );
}
render()

// Render the scene when the controls have changed.
// If you don’t have other animations or changes in your scene,
// you won’t be draining system resources every frame to render a scene.
// controls.addEventListener( 'change', render );

// Avoid constantly rendering the scene by only 
// updating the controls every requestAnimationFrame
function animationLoop() {
  requestAnimationFrame(animationLoop);
  controls.update();
  playerZ -= 0.01;
  player.position.setZ(playerZ);
  render()
}

animationLoop();


/////////////////////////////////////////
// Window Resizing
/////////////////////////////////////////

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}, false );


function createBox(width, height, depth, color, position = [0,0,0]){
  const geometry = new THREE.BoxGeometry( width, height, depth );
  const material = new THREE.MeshPhysicalMaterial( {color} );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(position[0],position[1],position[2]);
  scene.add( cube );
  return cube;
}