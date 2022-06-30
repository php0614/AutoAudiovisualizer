//Philip Liu, 2021
//Simple Audiovisualization + Convolution Reverb buffer mix based on current camera position
//Three.js  +   Tone.js

import Stats from "./js/stats.module.js";

const scene = new THREE.Scene();

////////////////////audio//////////////////////



//hidden button//
document.getElementById("play").onclick = soundPlayback;

console.log(location.origin);

//////////////////////////////Routing/////////////

var rbuffer = new Tone.Buffer("CathedralRev.wav");
var rbuffer2 = new Tone.Buffer("HallRev.wav");
var cvPlayer = new Tone.Player("dtkickcv.wav");
var cvPlayer2 = new Tone.Player("dtsineCV.wav");


var player1 = new Tone.Player({
    url: "dt.ogg",
    loop: true
});

var player2 = new Tone.Player({
    url: "dt.ogg",
    loop: true
});


const reverb1 = new Tone.Reverb({
    decay: 4,
    wet: 0.2,
    preDelay: 0.25,
    buffer: rbuffer
  });

  const reverb2 = new Tone.Reverb({
    decay: 1,
    wet: 0.5,
    preDelay: 0.15,
    buffer: rbuffer2
  });

  const reverb3 = new Tone.Reverb({
    decay: 3,
    wet: 0.2,
    preDelay: 0.25,
    buffer: rbuffer2
  });

  const reverb4 = new Tone.Reverb({
    decay: 7,
    wet: 0.6,
    preDelay: 0.32,
    buffer: rbuffer2
  });

  //Reverb mix
const crossFade = new Tone.CrossFade().toDestination();
//



    /////////////////////////////
    
    let mesh;
    let mesh2;
    
    //CVs//


    

player1.connect(reverb1);
reverb1.connect(crossFade.a);
///


player2.connect(reverb4);
reverb4.connect(crossFade.b);


//CV meters//
const meter = new Tone.DCMeter();
const meter2 = new Tone.DCMeter();
cvPlayer.loop = true;
cvPlayer2.loop = true;

//level and level2 are where cv values are stored in at every frame
let level;
let level2;

Tone.start();

function updateLevel(){
    level = meter.getValue();
    level2 = meter2.getValue();

}
    
/////////////////////Visuals//////////////////////////


// field of view(degrees),aspect ratio(width of the element divided by the height,), near clipping plane, far cliipping plane.
// clipping plane: objects further away from the camera than the value of far or closer than near won't be rendered
// clipping plane: may also lead to performance.
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(-26,5,104);



const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.shadowMap.enabled = true; //basic= unfiltered. pcf(default)= filters percentage close algorithm. pcf soft. vsm.   
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const light = new THREE.AmbientLight(0x404040,1); // soft white light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // intensity value
directionalLight.position.set(25,100,10);
directionalLight.target.position.set(0,0,0);
directionalLight.castShadow=true;
scene.add(light, directionalLight);

//examples/js/controls/orbutconntrols.js
//must chagne to THREE. OrbitControls... = plugin
const controls = new THREE.OrbitControls(camera, renderer.domElement);
let stats = new Stats();
//document.body.appendChild(stats.dom)


//gltf loading//
const gltfLoader = new THREE.GLTFLoader();
var model = gltfLoader.load("ico.gltf", function (object) {
    mesh = object.scene;
    mesh.scale.x = 5;
    mesh.scale.y = 5;
    mesh.scale.z = 5;
    scene.add(mesh);
    
    object.scene.position.y -= 2;
    object.scene.castShadow=true;
    object.scene.receiveShadow=true;
});

const gltfLoader2 = new THREE.GLTFLoader();
var model2 = gltfLoader2.load("cathedral.glb", function (object) {
    mesh2 = object.scene;
    mesh2.scale.x = 100;
    mesh2.scale.y = 100;
    mesh2.scale.z = 100;
    scene.add(mesh2);
    
    
    object.scene.position.z = 0;
    object.scene.position.y = 0;
    object.scene.position.x = 0;
    object.scene.castShadow=true;
    object.scene.receiveShadow=true;
    mesh2.position.set(0,-120,-300);
});
///////////////////

//HemisphereLight//
{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}
////////////////////

////////Sphere Meshes/////
const geometry= new THREE.SphereGeometry( 15, 32, 16 )
const material= new THREE.MeshStandardMaterial({
    color:0xffff00,
});
const sphere= new THREE.Mesh(geometry, material);
sphere.position.set(0,-28,0);
sphere.castShadow=true;
sphere.receiveShadow=true;
sphere.rotation.x = -Math.PI/2;
scene.add(sphere);


const geometry2= new THREE.SphereGeometry( 100, 100, 100 )
const material2= new THREE.MeshStandardMaterial({
    color:0x2a9df4,
});
const sphere2= new THREE.Mesh(geometry2, material2);
sphere2.position.set(0,-28,0);
sphere2.castShadow=true;
sphere2.receiveShadow=true;
sphere2.rotation.x = -Math.PI/2;
scene.add(sphere2);
//////////////////////////

//////Create an abstract shape
var colors = ['#f5cb42', '#ffe796', '#ffb114', '#ff7e3d', '#ff4d3d'];
var numBoxes = 200;
var boxes = [];
var container = new THREE.Object3D(5,4);

var boxGeom = new THREE.DodecahedronBufferGeometry(30,4);
for(var i = 0; i<numBoxes; i++){
    var colorIndex = Math.ceil(Math.random()* colors.length -1);
    var materialSS = new THREE.MeshLambertMaterial({color: colors[colorIndex]});

    var box = new THREE.Mesh(boxGeom, materialSS);
    box.rotation.x = Math.random() * Math.PI;
    box.rotation.y = Math.random() * Math.PI;
    box.rotation.z = Math.random() * Math.PI;

    box.position.x += Math.random()*2;
    box.speedX = Math.random() * 0.02 - 0.01;
    box.speedY = Math.random() * 0.02 - 0.01;
    box.speedZ = Math.random() * 0.02 - 0.01;
    box.castShadow = true;
    box.receiveShadow = true;

    boxes.push(box);
    container.add(box);

}

scene.add(container);
///////////////////


let pos = 0;
let dist = 0;
const origin = new THREE.Vector3(0, 0, 100);

animate();

function animate() {
    //screen refreshed=draw scene. 60 times  a second. 
    requestAnimationFrame(animate);
    //console.log(renderer.info.render.frame);
  
    if(renderer.info.render.frame > 70){
        updateLevel();
    }

    for(var i = 0; i<numBoxes; i++){
        boxes[i].rotation.x = boxes[i].rotation.x+boxes[i].speedX+(level);
        boxes[i].rotation.y += boxes[i].speedY;
        boxes[i].rotation.z += boxes[i].speedZ;

    }

    container.rotation.y += 0.03;

    
     //stats update is needed 
    stats.update();

    //directional light//
    directionalLight.position.set(25,level*100,level*50);

    //calculate distance from origin to current cam poisition
    pos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    dist = pos.distanceTo(origin);

    //Reverb mix crossfade modulation based on the distance(above)
    crossFade.fade.value = (dist % 500) / 500; 

    //console.log(renderer.info.render.frame);
    
    //Change Pattern//
    if(renderer.info.render.frame < 1420){

        //mesh = icosphere//
        mesh.position.set(level, 0, 0);

         //level = cv modulation
        mesh.rotation.x = level*20;
        mesh.rotation.y += 0.01;
        mesh.rotation.z += 0.008;

        //sphere -> yellow small sphere//
        //level2 = cv modulation
        sphere.rotation.x = level2*30;
        sphere.rotation.y += 0.1;
        sphere.rotation.z += 0.08;

        sphere.position.set(level2*150*Math.random(), level2*70-60, -150);


        //sphere2 -> Blue big sphere//
        sphere2.rotation.x = level2*30;
        sphere2.position.set(level2*10*Math.random(), 80, -590+(level2*400));
    } else if(renderer.info.render.frame < 2770) {

        //mesh = icosphere//
        mesh.position.set(level, 0, 0);

         //level = cv modulation
        mesh.rotation.x = level*90;
        mesh.rotation.y += 0.07;
        mesh.rotation.z += 0.038;

        //sphere -> yellow small sphere//
        //level2 = cv modulation
        sphere.rotation.x = level2*80;
        sphere.rotation.y += 0.2;
        sphere.rotation.z += 0.48;

        sphere.position.set(level2*150*Math.random(), level2*180, -150);


        //sphere2 -> Blue big sphere//
        sphere2.rotation.x = level2*100;
        sphere2.position.set(level2*10*Math.random(), 80, -470+(level2*900));
    } else if(renderer.info.render.frame < 5500) {
        //mesh = icosphere//
        mesh.position.set(level, 0, 0);

         //level = cv modulation
        mesh.rotation.x = level*25;
        mesh.rotation.y += 0.01;
        mesh.rotation.z += 0.008;

        //sphere -> yellow small sphere//
        //level2 = cv modulation
        sphere.rotation.x = level2*30;
        sphere.rotation.y += 0.1;
        sphere.rotation.z += 0.98;

        sphere.position.set(level2*150*Math.random(), level2*70-60, -150);


        //sphere2 -> Blue big sphere//
        sphere2.rotation.x = level2*30;
        sphere2.position.set(level2*10*Math.random(), 80, -590+(level2*400));
    } else {

         //mesh = icosphere//
         mesh.position.set(level+15, 0, 0);

         //level = cv modulation
        mesh.rotation.x = level*90;
        mesh.rotation.y += 0.07;
        mesh.rotation.z += level*0.18;

        //sphere -> yellow small sphere//
        //level2 = cv modulation
        sphere.rotation.x = level2*80;
        sphere.rotation.y += 0.2;
        sphere.rotation.z += 0.48;

        sphere.position.set(level2*150*Math.random(), level2*180*Math.random(), -150);


        //sphere2 -> Blue big sphere//
        sphere2.rotation.x = level2*300;
        sphere2.position.set(level2*100*Math.random(), 80, -470+(level2*1200));


 }


 //rendering//
 renderer.render(scene, camera);
 }

function soundPlayback(){

    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }

    crossFade.fade.value = 0.5;

    crossFade.connect(Tone.Master);

    cvPlayer.connect(meter);
    cvPlayer2.connect(meter2);

    cvPlayer.sync().start(0);
    cvPlayer2.sync().start(0);
    player1.sync().start(0);
    player2.sync().start(0);
    Tone.Transport.start();
}


  
    
function onWindowResize(){
    var newWidth = window.innerWidth,
        newHeight = window.innerHeight,
        newAspect = newWidth / newHeight;
    camera.aspect = newAspect;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
}

//window는 js의 기본 func인듯. addEventListner와 onWindowResize와 비슷한 시리즈의 조합은 매우 유용할듯 
window.addEventListener('resize', onWindowResize);




