const TrackballControls = require('three-trackballcontrols');
Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';

/////////////////////////////////////////
// Scene Setup
/////////////////////////////////////////

var scene,
    camera,
    renderer,
    controls;

scene = new Physijs.Scene;

camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 6, 25);
camera.lookAt( scene.position );

renderer = new THREE.WebGLRenderer({
  alpha: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

window.setCamera = function(x,y,z) {
  camera.position.set(x,y,z)
}
window.lookCamera = function(x,y,z) {
  camera.lookAt(x,y,z)
}

// keys

let left = 0,
    right = 0,
    jump = 0,
    forward = 0,
    backward = 0;


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

var axisHelper = new THREE.AxisHelper( 1.25 );
scene.add( axisHelper );

/////////////////////////////////////////
// Objects add to scene
/////////////////////////////////////////

createBox(5,0.01,50,'grey', [0,0,-24], 0);
createBox(1,1,1,'green', [2,0,-5], 22);
createBox(1,1,1,'green', [-2,0,-9], 10);
createBox(1,1,1,'green', [0,0,-9]);
let player = createBox(1,1,1,'red',[0,0.6,0],1);
let playerZ = 0;
player.velocityX = 0;

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
var simulate = true;
setTimeout(() => {
  simulate = false;
}, 3000);
function animationLoop() {
  scene.simulate();
  playerMove();
  render()
   camera.position.setZ(player.position.z + 25);
   camera.position.setX(player.position.x);
   camera.position.setY(player.position.y + 7);
  requestAnimationFrame(animationLoop);
}

animationLoop();

player.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
  console.log('collision');
  
  // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
});


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


function createBox(width, height, depth, color, position = [0,0,0], mass){
  const geometry = new THREE.BoxGeometry( width, height, depth );
  const material = new THREE.MeshPhysicalMaterial( {color} );
  const cube = new Physijs.BoxMesh( geometry, material, mass );
  cube.position.set(position[0],position[1],position[2]);
  scene.add( cube );
  return cube;
}

// keys
window.addEventListener('keydown', function (event) {
  event.preventDefault(event);
  console.log(event.keyCode);
  
  switch (event.keyCode) {
    case 38: forward = 1; break;// up key
    case 40: backward = 1; break;// down key
    case 32: jump = 1; break; // space key
    case 39: right = 1; break; // right key
    case 37: left = 1; break; // left key
  }
});
window.addEventListener('keyup', function (event) {
  event.preventDefault(event);
  switch (event.keyCode) {
    case 38: forward = 0; break;// up key
    case 40: backward = 0; break;// down key
    case 32: jump = 0; break; // space key
    case 39: right = 0; break; // right key
    case 37: left = 0; break; // left key
  }
});

function playerMove() {
  const speedX = 2;
  const speedZ = 2;
  const jumpSpeed = 0.3;
  let oldVector = player.getLinearVelocity();
  console.log(oldVector);
  
  // let playerVec3 = new THREE.Vector3(-1,oldVector.y,oldVector.z);
  let playerVec3 = new THREE.Vector3(speedX*(right-left),oldVector.y + jumpSpeed*jump,speedZ*(backward-forward));
  // console.log(oldVector.x + speedX*(right-left),-10,oldVector.z + speedZ*(backward-forward));
  // console.log(oldVector.x + speedX*(right-left),oldVector.y,oldVector.z + speedZ*(backward-forward));
  
  player.setLinearVelocity(playerVec3);
}


// https://stackoverflow.com/questions/23095082/physijs-combining-movement-and-physics