var renderer  = new THREE.WebGLRenderer({
  antialias : true,
  alpha: true
});
renderer.setClearColor( 0xffffff, 0 ); // second param is opacity, 0 => transparent

var canvas = document.getElementById("terrain-canvas")
canvas.appendChild( renderer.domElement );
var onRenderFcts= [];
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var scene = new THREE.Scene();
var camera  = new THREE.PerspectiveCamera(25, window.innerWidth /    window.innerHeight, 0.01, 1000);
var cameraCenter = new THREE.Vector3();
var cameraHorzLimit = 2;
var cameraVertLimit = 2;
var scroll_pos = 0;
var mouse = new THREE.Vector2();

d3.csv("https://raw.githubusercontent.com/JustinGOSSES/lidar_threejs_playground/master/HDL32.csv", function(error, data) {
    if (error) throw error;
    console.log(data); 
    // and calls "rest" function to start rest of page 
    rest(data)
});

function rest(data) {

camera.aspect = canvas.clientWidth / canvas.clientHeight;

camera.updateProjectionMatrix();

renderer.setSize(canvas.clientWidth, canvas.clientHeight);

camera.position.z = 15; 
camera.position.y = 4;

cameraCenter.x = camera.position.x;
cameraCenter.z = camera.position.z;




var particleSystem, uniforms, geometry;
var particles = data.length;

// uniforms and shader material have to do with materials that make the objects and points visible
uniforms = {
  color:     { value: new THREE.Color( 0xffffff ) },
  texture:   { value: new THREE.TextureLoader().load( "spark1.png" ) }
};
var shaderMaterial = new THREE.ShaderMaterial( {
  uniforms:       uniforms,
  vertexShader:   document.getElementById( 'vertexshader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
  blending:       THREE.AdditiveBlending,
  depthTest:      false,
  transparent:    true,
  fog: false
});
// establishing variables used in particle attributes
var radius = 200;
geometry = new THREE.BufferGeometry();
var positions = new Float32Array( particles * 3 );
var colors = new Float32Array( particles * 3 );
var sizes = new Float32Array( particles );
var color = new THREE.Color();
// adding in the particles based on the data from the csv loaded by d3.js
for ( var i = 0, i3 = 0; i < particles; i ++, i3 += 3 ) {
  if(i<40){ console.log("X is ",data[i]["X"])}
  positions[ i3 + 0 ] = data[i]["X"];
  positions[ i3 + 1 ] = data[i]["Y"];
  positions[ i3 + 2 ] = data[i]["Z"];   

  nearest_int = Math.ceil(data[i]["distance_m"])
  timestamp = Math.ceil(data[i]["vertical_angle"])
  time_normal_unq = (timestamp/40)
  color.setHSL( time_normal_unq, 1, 0.5 );
  colors[ i3 + 0 ] = color.r;
  colors[ i3 + 1 ] = color.g;
  colors[ i3 + 2 ] = color.b;
  sizes[ i ] = 0.1;
}
geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
particleSystem = new THREE.Points( geometry, shaderMaterial );
scene.add( particleSystem );
particleSystem.rotation.z = 2.4;
scene.lookAt(new THREE.Vector3(0,1,0));

}

onRenderFcts.push(function(){
  if(!iOS) {
    updateCamera();
  } else {
    var y = 4 + scroll_pos;
    var camera_position = new THREE.Vector3(camera.position.x,y,camera.position.z);
    camera.position.lerp(camera_position, .05);
    camera.lookAt(new THREE.Vector3(0,.5,0));
  }
  renderer.render( scene, camera );   
})

var lastTimeMsec= null;

requestAnimationFrame(function animate(nowMsec){
  requestAnimationFrame( animate );
  lastTimeMsec  = lastTimeMsec || nowMsec-1000/60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec  = nowMsec;
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000);
  })
})


document.addEventListener('mousemove', onDocumentMouseMove, false); 
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener('scroll', getScrollPercent);

function updateCamera() {
    //offset the camera x/y based on the mouse's position in the window
    var x = cameraCenter.x + (cameraHorzLimit * mouse.x);
    var z = cameraCenter.z + (cameraVertLimit * mouse.y);
    var y = 4 + scroll_pos;
    var camera_position = new THREE.Vector3(x,y,z);
    camera.position.lerp(camera_position, .05);
    camera.lookAt(new THREE.Vector3(0,.5,0));
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function getScrollPercent() {
  scroll_pos = window.pageYOffset || document.documentElement.scrollTop;
  scroll_pos /= 100;
}