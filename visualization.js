//////////Dynamic 3D Visualization of 3 Band Envelope Follower data///////
///////////////////////////Philip Liu, 2022///////////////////////////////

import { envF_Out_low, envF_Out_mid, envF_Out_high } from './modules.js';

const scene = new THREE.Scene();


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

const controls = new THREE.OrbitControls(camera, renderer.domElement);




//HemisphereLight//
{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}
///////////////////


//////Create an abstract shape
let colors = ['#f5cb42', '#ffe796', '#ffb114', '#ff7e3d', '#ff4d3d'];
//let numBoxes = 200;
let boxes = [];
let container = new THREE.Object3D(5,4);
let pos;
let dist;


///////////////////


animate();

function animate() {
    //screen refreshed=draw scene. 60 times  a second. 
    requestAnimationFrame(animate);
    //console.log(renderer.info.render.frame);

    let boxGeom = new THREE.DodecahedronBufferGeometry(parseInt(envF_Out_low*20),8);
    for(let i = 0; i<parseInt(envF_Out_low*7); i++){
        let colorIndex = Math.ceil(envF_Out_low* envF_Out_mid * 5 *colors.length -1);
        let materialSS = new THREE.MeshLambertMaterial({color: colors[colorIndex]});

        let box = new THREE.Mesh(boxGeom, materialSS);
       box.rotation.x = envF_Out_low * 80;
       box.rotation.y = envF_Out_mid * 80;
       box.rotation.z = envF_Out_high * 80;

       if(i>3){
           box.scale.x *= envF_Out_high*20;
       }


        //box.position.x += envF_Out_mid*10;
        box.speedX = envF_Out_low;
        box.speedY = envF_Out_mid;
        box.speedZ = envF_Out_high;
        box.castShadow = true;
        box.receiveShadow = true;

        boxes.push(box);
        container.add(box);
}

    scene.add(container);


    //directional light//
    //directionalLight.position.set(25,envF_Out_low*100,envF_Out_mid*50);

    //rotate the Geometry
    container.scale.x = (envF_Out_high * 20.0);
    container.scale.y = (envF_Out_mid * 20.0);
    container.scale.z = (envF_Out_low * 20.0);

    container.rotation.x = (envF_Out_high * 4.0);
    container.rotation.y = (envF_Out_mid * 4.0);
    container.rotation.z = (envF_Out_low * 4.0);



    //calculate distance from origin to current cam poisition
    pos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    dist = pos.distanceTo(origin);


     //rendering//
     renderer.render(scene, camera);
     scene.remove(container);
}
