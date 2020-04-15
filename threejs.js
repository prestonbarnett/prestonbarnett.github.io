var renderer  = new THREE.WebGLRenderer({
    antialias : true
  });

var canvas = document.getElementById("terrain-canvas")
canvas.appendChild( renderer.domElement );
var onRenderFcts= [];
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var scene = new THREE.Scene();
var camera  = new THREE.PerspectiveCamera(25, window.innerWidth /    window.innerHeight, 0.01, 1000);
var cameraCenter = new THREE.Vector3();
var cameraHorzLimit = 1;
var cameraVertLimit = 1;
var mouse = new THREE.Vector2();

camera.aspect = canvas.clientWidth / canvas.clientHeight;

camera.updateProjectionMatrix();

renderer.setSize(canvas.clientWidth, canvas.clientHeight);

camera.position.z = 15; 
camera.position.y = 4;

cameraCenter.x = camera.position.x;
cameraCenter.z = camera.position.z;

var light = new THREE.AmbientLight( 'white' )
scene.add( light )
var light = new THREE.DirectionalLight('white', 5)
light.position.set(0.5, 0.0, 2)
scene.add( light )
var light = new THREE.DirectionalLight('white', 0.75*2)
light.position.set(-0.5, -0.5, -2)
scene.add( light )    

var heightMap = THREEx.Terrain.allocateHeightMap(256,256)
THREEx.Terrain.simplexHeightMap(heightMap)  
var geometry  = THREEx.Terrain.heightMapToPlaneGeometry(heightMap)
THREEx.Terrain.heightMapToVertexColor(heightMap, geometry)

var wire_color = new THREE.Color('gray');
var material  = new THREE.MeshBasicMaterial({
  color: wire_color,
  wireframe: true
});

var mesh  = new THREE.Mesh( geometry, material );
scene.add( mesh );

mesh.lookAt(new THREE.Vector3(0,1,0));

mesh.scale.y  = 3.5;
mesh.scale.x  = 3;
mesh.scale.z  = 0.20;
mesh.scale.multiplyScalar(10);

onRenderFcts.push(function(){
  if(!iOS) {
    updateCamera();
  } else {
    mesh.rotation.z += 0.001
    camera.lookAt(new THREE.Vector3(0,.5,0))
  }
  renderer.render( scene, camera );   
})

var lastTimeMsec= null

requestAnimationFrame(function animate(nowMsec){
  requestAnimationFrame( animate );
  lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec  = nowMsec
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
})


document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener( 'resize', onWindowResize, false );

function updateCamera() {
    //offset the camera x/y based on the mouse's position in the window
    camera.position.x = cameraCenter.x + (cameraHorzLimit * mouse.x);
    camera.position.z = cameraCenter.z + (cameraVertLimit * mouse.y);
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