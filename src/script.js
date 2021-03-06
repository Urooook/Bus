import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'stats.js'
import { RedFormat } from 'three'

//import CannonUtils from "./utils/cannonUtils.js";
// import CannonDebugRenderer from './utils/cannonDebugRenderer'

//console.log(CannonUtils);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new dat.GUI({ width: 400 })

const CamObj = {
  FreeCamera: false
}

const CameraOffset = {
  x: 4.7,
  y: 5.45,
  z: 9.225
}

gui.add(CameraOffset, 'x').min(-20).max(20).step(0.1).name('Смещение камеры по x')
gui.add(CameraOffset, 'y').min(-20).max(20).step(0.1).name('Смещение камеры по y')
gui.add(CameraOffset, 'z').min(-20).max(20).step(0.1).name('Смещение камеры по z')

  gui.add(CamObj, 'FreeCamera').checkBox

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -10, 0);

 //world.solver.iterations = 40;
 world.allowSleep = true
 //world.sleepSpeedLimit = 1.0;
 
 //world.sleepTimeLimit = 1.0;

// const fog = new THREE.Fog('#262837', 10, 45)
// scene.fog = fog
const env = {
  BASE_URL: '.'
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const front = textureLoader.load(env.BASE_URL + '/textures/1.png') 
const frontSide = textureLoader.load(env.BASE_URL + '/textures/2.png') 
const black = textureLoader.load(env.BASE_URL +'/textures/black.jpg') 
const front2 = textureLoader.load(env.BASE_URL +'/textures/3.png') 
const front2Side = textureLoader.load(env.BASE_URL +'/textures/4.png') 
const zebra = textureLoader.load(env.BASE_URL +'/textures/zebra2.jpg')
const roadNothing = textureLoader.load(env.BASE_URL +'/textures/roadNotheng.jpg')
const zebraMap = textureLoader.load(env.BASE_URL +'/textures/zebraMap.jpg')
const shadowBlack = textureLoader.load(env.BASE_URL +'/textures/shadowBlack2.jpg')
const snow = textureLoader.load(env.BASE_URL +'/textures/snow.png') 
const busWheel = textureLoader.load(env.BASE_URL +'/textures/busWheel.jpg')
// zebra.repeat.x = 5
// zebra.wrapS = THREE.RepeatWrapping
console.log(snow);
zebra.repeat.y = 15
zebra.wrapT = THREE.RepeatWrapping

//scene.environmentMapTexture = environmentMapTexture


const gltfLoader = new GLTFLoader()

var cubeMaterials2 = [
  new THREE.MeshBasicMaterial({map: front2Side, aoMap: front2, aoMapIntensity: 3}),
  new THREE.MeshBasicMaterial({map: front2, aoMap: front2, aoMapIntensity: 3}),
  new THREE.MeshBasicMaterial({map: black}),
  new THREE.MeshBasicMaterial({map: black, aoMap: front, aoMapIntensity: 3}),
  new THREE.MeshBasicMaterial({map: front2, aoMap: front2, aoMapIntensity: 3}),
  new THREE.MeshBasicMaterial({map: front2, aoMap: front2, aoMapIntensity: 3}),
];
cubeMaterials2 = new THREE.MeshFaceMaterial( cubeMaterials2 );

var cubeMaterials1 = [
  new THREE.MeshBasicMaterial({map: front, aoMap: front, aoMapIntensity: 2}),
  new THREE.MeshBasicMaterial({map: frontSide, aoMap: front, aoMapIntensity: 2}),
  new THREE.MeshBasicMaterial({map: black}),
  new THREE.MeshBasicMaterial({map: black, aoMap: front, aoMapIntensity: 2}),
  new THREE.MeshBasicMaterial({map: frontSide, aoMap: front, aoMapIntensity: 2}),
  new THREE.MeshBasicMaterial({map: frontSide, aoMap: front, aoMapIntensity: 2}),
];
cubeMaterials1 = new THREE.MeshFaceMaterial( cubeMaterials1 );

var cubeMaterials3 = [
  new THREE.MeshBasicMaterial({map: black}),
  new THREE.MeshBasicMaterial({map: frontSide, aoMap: front, aoMapIntensity: 3}),
  new THREE.MeshBasicMaterial({map: frontSide, aoMap: front, aoMapIntensity: 3}),
  new THREE.MeshBasicMaterial({map: black}),
  new THREE.MeshBasicMaterial({map: black}),
  new THREE.MeshBasicMaterial({map: black}),
];
cubeMaterials1 = new THREE.MeshFaceMaterial( cubeMaterials1 );

const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const boxMaterial1 = cubeMaterials1
const boxMaterial2 = cubeMaterials2

console.log(shadowBlack);

const shadowPlaneGeometry = new THREE.PlaneBufferGeometry(20,8)
const shadowPlaneMaterial = new THREE.MeshStandardMaterial({
  // color: 'red',
   side: THREE.DoubleSide,
   transparent: true,
   map: shadowBlack,
   alphaMap: shadowBlack,
   aoMap: shadowBlack,
   aoMapIntensity: 30
 })


const createBox = (width, height, depth, position, material, shadowPosition, shadowScale = 1, wideH = false) =>
{
    //ShadowMexh
    const shadowPlane = new THREE.Mesh(
      shadowPlaneGeometry, shadowPlaneMaterial
    )
    shadowPlane.rotation.x = Math.PI/2
    shadowPlane.rotation.z = -Math.PI/2 - Math.PI/16
    if (wideH) {
     shadowPlane.rotation.z = Math.PI
    }
    
    shadowPlane.position.copy(shadowPosition)
    shadowPlane.scale.set(shadowScale, shadowScale, shadowScale)
    scene.add(shadowPlane)

    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, material)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //Light
    // var customMaterial = new THREE.ShaderMaterial( 
    //   {
    //       uniforms: {  },
    //     vertexShader:   `
    //     varying vec3 vNormal;
    //     void main() 
    //     {
    //         vNormal = normalize( normalMatrix * normal );
    //         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //     }
    //     `,
    //     fragmentShader: `
    //     varying vec3 vNormal;
    //     void main() 
    //     {
    //       float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); 
    //         gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
    //     }
    //     `,
    //     side: THREE.BackSide,
    //     blending: THREE.AdditiveBlending,
    //     transparent: true
    //   }   );
        
    //  var ballGeometry = new THREE.BoxBufferGeometry( 1.3, 1, 1);
      // var ball = new THREE.Mesh( boxGeometry, customMaterial );
      // ball.scale.set(width*1.3, height*1.3, depth*1.3)
      // ball.position.copy(position)
      // scene.add( ball );

    // const pl11 = new THREE.Points(new THREE.SphereBufferGeometry(2,64,64), new THREE.PointsMaterial({
    //   size: 0.02,
    //   sizeAttenuation: true
    // })) 
    // scene.add(pl11)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(position),
        shape: shape,
    })
    body.position.copy(position)
    world.addBody(body)

    // Save in objects
}

createBox(4, 6, 4, { x: -12, y: 3, z: -5 }, boxMaterial1, { x: -10.2, y: 0.012, z: -5.4 })
createBox(4, 6, 4, { x: -19, y: 3, z: -6 }, boxMaterial1, { x: -17.2, y: 0.001, z: -6.4 })
createBox(4, 6, 4, { x: -12, y: 3, z: 10 }, boxMaterial2, { x: -10.2, y: 0.014, z: 9.6 })
createBox(4, 6, 4, { x: -19, y: 3, z: 14 }, boxMaterial2, { x: -17.2, y: 0.015, z: 13.6 })
createBox(4, 6, 4, { x: -25, y: 3, z: 11 }, boxMaterial2, { x: -23.2, y: 0.01, z: 10.6 })
createBox(4, 6, 4, { x: -25, y: 3, z: -12 }, boxMaterial1, { x: -23.2, y: 0.02131, z: -12.4 })
createBox(4, 6, 4, { x: -30, y: 3, z: 20 }, boxMaterial2, { x: -28.2, y: 0.00112, z: 19.6 })
createBox(4, 6, 4, { x: -30, y: 3, z: -20 }, boxMaterial1, { x: -28.2, y: 0.143033, z: -20.4 })
createBox(4, 6, 4, { x: -35, y: 3, z: 25 }, boxMaterial2, { x: -33.2, y: 0.0155, z: 24.6 })

createBox(4, 18, 4, { x: -45, y: 9, z: 11 }, boxMaterial2, { x: -43.2, y: 0.0155, z: 10.6 })
createBox(4, 18, 4, { x: -45, y: 9, z: -12 }, boxMaterial1, { x: -43.2, y: 0.0155, z: -12.4 })


createBox(4, 6, 4, { x: 40, y: 3, z: 12 }, boxMaterial2, { x: 41.8, y: 0.01, z: 11.6 })

createBox(14, 6, 4, { x: 0, y: 3, z: 45 }, boxMaterial2, { x: 1.8, y: 0.031, z: 43.6 }, 2, true)
createBox(4, 6, 14, { x: -9, y: 3, z: -30 }, boxMaterial1, { x: -7.8, y: 0.031, z: -30.4 }, 2)

//Snow
const snowParametrs = {
  vertMovingSpeed: 1,
  LatealSpeed: 1,
  count: 500,
  size: 0.3
}

let geometry = null
let pointsMaterial = null
let points = null
console.log(points);
const generateSnow = () => {

  if(points !== null)
    {
        geometry.dispose()
        pointsMaterial.dispose()
        scene.remove(points)
    }

 geometry= new THREE.Geometry();

 pointsMaterial = new THREE.PointsMaterial({
    size: snowParametrs.size,
   // color: 'red',
    transparent:true,
    opacity: 0.8,
    map:snow,
    blending:THREE.AdditiveBlending,
    sizeAttenuation:true,
    depthTest: false
});

let range = 100;

for (let i = 0; i < snowParametrs.count; i++ ) {

    let vertice = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        Math.random() * range - range / 2);
    /* Vertical moving speed */
    vertice.velocityY = (0.1 + Math.random() / 3) * snowParametrs.vertMovingSpeed
    /* Lateral speed */
    vertice.velocityX = ((Math.random() - 0.5) / 3)* snowParametrs.LatealSpeed;
     
    /* Add vertices to geometry */
    geometry.vertices.push(vertice);

}

geometry.center();

points = new THREE.Points(geometry, pointsMaterial);
points.position.y = -30;
// points.position.x = -50;
// points.position.z = -30;

scene.add(points);
}

gui.add(snowParametrs, 'count').min(100).max(13000).step(10).name('Количество снежинок').onFinishChange(generateSnow)
gui.add(snowParametrs, 'size').min(0.01).max(1).step(0.001).name('Размер снежинок').onFinishChange(generateSnow)
gui.add(snowParametrs, 'vertMovingSpeed').min(0.1).max(10).step(0.001).name('Скорость с которой падают снежинки').onFinishChange(generateSnow)
gui.add(snowParametrs, 'LatealSpeed').min(0.3).max(10).step(0.001).name('Разброс снежинок').onFinishChange(generateSnow)

gltfLoader.load(
  env.BASE_URL +'/models/Traffic.glb',
  (gltf) => {
    
    const TrafficObject = gltf.scene.children[2].children[0]
  
     console.log(TrafficObject);
    // TrafficObject.scale.set(0.5, 0.5, 0.5)

    const TraficLighter1 = TrafficObject.clone()
    TraficLighter1.rotation.z = - Math.PI/2
    TraficLighter1.rotation.x = Math.PI/2
    TraficLighter1.position.set(4, 0, 1)
    TraficLighter1.castShadow = true
    TraficLighter1.scale.set(0.5, 0.5, 0.5)

    scene.add(TraficLighter1)
    console.log(TraficLighter1);

    const TraficLighter2 = TrafficObject.clone()
    TraficLighter2.rotation.z = Math.PI/2
    TraficLighter2.rotation.x = Math.PI/2
    TraficLighter2.position.set(-2, 0, 7)
    TraficLighter2.castShadow = true
    TraficLighter2.scale.set(0.5, 0.5, 0.5)

    scene.add(TraficLighter2)
    console.log(TraficLighter2);
    const TraficLighter3 = TrafficObject.clone()
    TraficLighter3.rotation.x = Math.PI/2
    TraficLighter3.position.set(4, 0, 7)
    TraficLighter3.castShadow = true
    TraficLighter3.scale.set(0.5, 0.5, 0.5)

    scene.add(TraficLighter3)

    const TraficLighter4 = TrafficObject.clone()
    TraficLighter4.rotation.x = Math.PI/2
    TraficLighter4.rotation.z = -Math.PI
    TraficLighter4.position.set(-2, 0, 1)
    TraficLighter4.castShadow = true
    TraficLighter4.scale.set(0.5, 0.5, 0.5)

    scene.add(TraficLighter4)

  //   const pointLight1 = new THREE.PointLight('green', 1)
  // //  pointLight1.castShadow = true
  // //  pointLight1.shadow.mapSize.set(1024, 1024)
  //   pointLight1.position.set(4, 2.25, 2)
    
  //   scene.add(pointLight1)
   
  //   const pointLight2 = new THREE.PointLight('green', 1)
  // //  pointLight2.castShadow = true
  // //  pointLight2.shadow.mapSize.set(1024, 1024)
  //   pointLight2.position.set(-2,2.25,6)
    
  //   scene.add(pointLight2)

  //   const pointLight3 = new THREE.PointLight('green', 1)
  //  // pointLight3.castShadow = true
  //  // pointLight3.shadow.mapSize.set(1024, 1024)
  //   pointLight3.position.set(3, 2.25, 7)
    
  //   scene.add(pointLight3)

  //   const pointLight4 = new THREE.PointLight('green', 1)
  //  // pointLight4.castShadow = true
  //  // pointLight4.shadow.mapSize.set(1024, 1024)
  //   pointLight4.position.set(-1, 2.25, 1)
    
  //   scene.add(pointLight4)

    
  })


gltfLoader.load(
  env.BASE_URL + '/models/Bus/SchoolBus.gltf',
    (gltf) => {

      const options = {
        radius: 0.3,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 45,
        suspensionRestLength: 0.4,
        frictionSlip: 5,
        dampingRelaxation: 2.3,
        dampingCompression: 4.5,
        maxSuspensionForce: 200000,
        rollInfluence:  0.01,
        axleLocal: new CANNON.Vec3(1, 0, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(0, 1, 0),
        maxSuspensionTravel: 0.25,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
      };
      

      const tesla = new THREE.Group();
      scene.add(tesla);

      const  wheelVisuals1 = [];
    
      while(gltf.scene.children[0].children.length){
        let i =0
        gltf.scene.children[0].children[i].traverse((child) => {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
              child.position.set(0,0,0)
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
          }
      })
        wheelVisuals1.push(gltf.scene.children[0].children[0]);
        tesla.add(gltf.scene.children[0].children[0])
        i++
      }
      
    //  axHelper.rotation.z = Math.PI
    //  scene.add(axHelper)
      tesla.scale.set(0.3,0.3,0.3)

     // const  wheelVisuals1 = [tesla.children[3], tesla.children[2], tesla.children[3], tesla.children[4]]
      const bus = tesla.children[4];
      tesla.add(bus)
      console.log(wheelVisuals1);
      console.log(tesla.children);
      bus.castShadow = true
     // bus.receiveShadow = true
      wheelVisuals1.shift();
      // const wheelEpt = wheelVisuals1[0];
      // console.log(wheelEpt);
    // wheelVisuals1.reverse()
  //  const wheelVisuals2 = [wheelVisuals1[0], wheelVisuals1[3], wheelVisuals1[1], wheelVisuals1[2]]
  //  console.log(wheelVisuals2);
  //  wheelVisuals1 = wheelVisuals2
      // console.log(wheelVisuals1);
      // console.log(bus);
      //  console.log(gltf)
       //scene.add(gltf.scene.children[0].children[2])
      gltf.castShadow = true




const groundMaterial = new CANNON.Material("groundMaterial");
const wheelMaterial = new CANNON.Material("wheelMaterial");
const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
  friction: 0.7,
  restitution: 0,
  contactEquationStiffness: 1000
});

world.addContactMaterial(wheelGroundContactMaterial)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.3,
        restitution: 0
    }
)
world.defaultContactMaterial = defaultContactMaterial
world.defaultContactMaterial.contactEquationStiffness = 1e6;
world.defaultContactMaterial.contactEquationRegularizationTime = 3;

//City Roades

const roadGeometry = new THREE.PlaneBufferGeometry(4, 100)
const roadMaterial = new THREE.MeshStandardMaterial({
   // color: 'rgb(61, 57, 57)',
     //side: THREE.DoubleSide,
     map: zebra,
    
     })

const mainRoad = new THREE.Mesh(
  roadGeometry,
  roadMaterial
)
mainRoad.rotation.x = - Math.PI/2
mainRoad.rotation.z = Math.PI/2
mainRoad.position.set(1, 0.01, 4)
mainRoad.receiveShadow = true

scene.add(mainRoad)

const secondRoad = new THREE.Mesh(
  roadGeometry,
  roadMaterial
)
secondRoad.rotation.x = -Math.PI/2
//secondRoad.rotation.z = Math.PI/2
secondRoad.position.set(1, 0.012, 4)
secondRoad.receiveShadow = true

scene.add(secondRoad)

const acrossRoadGeometry = new THREE.PlaneBufferGeometry(5, 4)
const acrossRoadMaterial = new THREE.MeshStandardMaterial({
 //  side: THREE.DoubleSide,
   map: roadNothing ,
    })

    const acrossRoad1 = new THREE.Mesh(
      acrossRoadGeometry, acrossRoadMaterial
    )
    acrossRoad1.rotation.x = - Math.PI/2
    acrossRoad1.receiveShadow = true
    acrossRoad1.position.set(1, 0.013, 4)

    const acrossRoad2 = new THREE.Mesh(
      acrossRoadGeometry, acrossRoadMaterial
    )
    acrossRoad2.rotation.x = - Math.PI/2
    acrossRoad2.rotation.z = Math.PI/2
    acrossRoad2.receiveShadow = true
    acrossRoad2.position.set(1, 0.014, 4)

    scene.add(acrossRoad1)
    scene.add(acrossRoad2)

      const zebraRoadMaterial =  new THREE.MeshStandardMaterial({
        //  side: THREE.DoubleSide ,
          map: zebraMap
        })

     const zebraRoad = new THREE.Mesh(
       acrossRoadGeometry,
       zebraRoadMaterial
     )
     zebraRoad.rotation.x = - Math.PI/2
     zebraRoad.position.set(10, 0.012, 4)
     scene.add(zebraRoad)

     const zebraRoad1 = new THREE.Mesh(
      acrossRoadGeometry,
      zebraRoadMaterial
    )
     zebraRoad1.rotation.x = - Math.PI/2
     zebraRoad1.position.set(27, 0.012, 4)
     scene.add(zebraRoad1)

     const zebraRoad2 = new THREE.Mesh(
      acrossRoadGeometry,
      zebraRoadMaterial
    )
    zebraRoad2.rotation.x = - Math.PI/2
     zebraRoad2.position.set(1, 0.0195, 34)
     zebraRoad2.rotation.z = Math.PI/2
     scene.add(zebraRoad2)

     const zebraRoad3 = new THREE.Mesh(
      acrossRoadGeometry,
      zebraRoadMaterial
    )
    zebraRoad3.rotation.x = - Math.PI/2
     zebraRoad3.position.set(1, 0.0195, -34)
     zebraRoad3.rotation.z = Math.PI/2
     scene.add(zebraRoad3)


const chassisShape = new CANNON.Box(new CANNON.Vec3(1/2, 1/2, 4.4/2))
const chassisBody = new CANNON.Body({mass: 150, shape: chassisShape, material: groundMaterial});
//chassisBody.addShape(chassisShape);
chassisBody.allowSleep = false
chassisBody.position.set(42, 1, 4);
//chassisBody.angularVelocity.set(0, 0, 0); // initial velocity
chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,-1,0), Math.PI/2)
//chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,-0.3,-1), Math.PI/2)


// car visual body
var geometry = new THREE.BoxBufferGeometry(1, 1, 4.4) // double chasis shape
var material = new THREE.MeshBasicMaterial({color: 0xffff00});
var box1 = new THREE.Mesh(geometry, material);
 const axHelper = new THREE.AxesHelper(3)
 box1.add(axHelper)
 box1.rotation.reorder('YXZ')
 
// var box = tesla
//box.position.set(0, 4.2, 0)
// box.castShadow = true;
// box.receiveShadow = true;
//scene.add(box);
// tesla.add
//scene.add(box1);

var geometry = new THREE.BoxBufferGeometry(1, 2.45, 4.4) // double chasis shape
var material = new THREE.MeshBasicMaterial({color: 'red'});
var box2 = new THREE.Mesh(geometry, material);
//scene.add(box2)


const vehicle = new CANNON.RaycastVehicle({
    chassisBody,
    indexRightAxis: 0, // x
    indexUpAxis: 1, // y
    indexForwardAxis: 2, // z
  });


  const axlewidth = 0.5;
options.chassisConnectionPointLocal.set(axlewidth, 0, -1.2);
vehicle.addWheel(options);

options.chassisConnectionPointLocal.set(-axlewidth, 0, -1.2);
vehicle.addWheel(options);

options.chassisConnectionPointLocal.set(axlewidth, 0, 1.5);
vehicle.addWheel(options);

options.chassisConnectionPointLocal.set(-axlewidth, 0, 1.5);
vehicle.addWheel(options);

vehicle.addToWorld(world);

const cylinderMaterial =  new THREE.MeshStandardMaterial({
  color: 0xd0901d,
  flatShading: true,
});

const wheelBodies = []
const  wheelVisuals = [];
vehicle.wheelInfos.forEach((wheel) => {
 // wheelVisuals2[i].scale.set(0.3,0.3,0.3)
  const shape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
  const body = new CANNON.Body({mass: 1, material: wheelMaterial });
 // body.sleepSpeedLimit = 1.0;
  var q = new CANNON.Quaternion();
  q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
  body.addShape(shape, new CANNON.Vec3(), q);

  wheelBodies.push(body);
  // wheel visual body
  const geometryCulinder = new THREE.CylinderBufferGeometry(0.3, 0.3, 0.3 / 2, 20);
 
  const cylinder = new THREE.Mesh(geometryCulinder, cubeMaterials3);
  cylinder.geometry.rotateZ(Math.PI/2);
  cylinder.rotation.reorder('YXZ')
  wheelVisuals.push(cylinder);
  //wheelVisuals.push(tesla.children[i].children[0]);
 scene.add(cylinder);
});
console.log(tesla.children[0].children[0]);
//Tramplin
// const trampline = new THREE.Mesh(
//     new THREE.CylinderBufferGeometry(11.5, 8, 2, 11),
//     new THREE.MeshStandardMaterial({
//         color: 'blue',
//         side: THREE.DoubleSide
//     })
// )

// trampline.castShadow = true
// trampline.receiveShadow = true
// trampline.position.set(14,1,2)
// trampline.scale.set(0.5, 0.5, 0.5)
// trampline.rotation.x = Math.PI

// // scene.add(trampline)

// const tramplinShape = new CANNON.Cylinder(11.5, 8, 2, 11 )
// const tramplinBody = new CANNON.Body({ mass: 99999, shape: tramplinShape, material: groundMaterial})
// tramplinBody.position.set(14,1,2)
// //tramplinBody.scale.set(0.5, 0.5, 0.5)
// tramplinBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI)

// world.addBody(tramplinBody)

world.addEventListener('postStep', function() {
//  / console.log(tesla.children[1]);
    for (var i=0; i<vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i);
      var t = vehicle.wheelInfos[i].worldTransform;
      // update wheel physics
      //console.log(wheelVisuals[0].rotation);
      wheelBodies[i].position.set(t.position);
      wheelBodies[i].quaternion.copy(t.quaternion);
     // tesla.children[1].position.copy(t.position)
    //  tesla.children[1].rotation.z = t.quaternion.z/10
      // update wheel visuals
      wheelVisuals[i].quaternion.copy(t.quaternion);
      wheelVisuals[i].position.copy(t.position);
      wheelVisuals[0].quaternion.copy(wheelVisuals[1].quaternion)
    }
  });

var geometry = new THREE.PlaneBufferGeometry(200, 200, 100);
var material = new THREE.MeshStandardMaterial({
   color: 'black',
   //side: THREE.DoubleSide
});
var plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI/2;
//plane.rotation.z = Math.PI;
//plane.receiveShadow = true
scene.add(plane);

  var q = plane.quaternion;
  var planeBody = new CANNON.Body({
  mass: 0, // mass = 0 makes the body static
  material: defaultMaterial,
  shape: new CANNON.Plane(),
  quaternion: new CANNON.Quaternion(-q._x, q._y, q._z, q._w)
});
world.addBody(planeBody)

// WallBlocks
const brickSizes = {
  x: 0.5,
  y: 0.4,
  z: 1
}

const brickObjects = []
let a =  brickSizes.y
const brickShape = new CANNON.Box(new CANNON.Vec3(brickSizes.x*0.5, brickSizes.y*0.5, brickSizes.z*0.5))
const brickGeometry = new THREE.BoxBufferGeometry(brickSizes.x, brickSizes.y, brickSizes.z)
const brickMaterial = new THREE.MeshStandardMaterial({ color: 'white' })
for(let i=1; i<9; i++){
  
 for(let j =1; j<7; j++){
  const brick = new THREE.Mesh(
    brickGeometry,
    brickMaterial
  )
  brick.castShadow = true
  scene.add(brick)

  const brickBody = new CANNON.Body({
    mass: 0.01,
    shape: brickShape,
    material: defaultMaterial,
  });
  brickBody.allowSleep = true;
  brickBody.sleepSpeedLimit = 1.0;
  brickBody.sleepTime = 1.0;

  if(i%2===0){
    brickBody.position.set(-6,a, brickSizes.z*j*1.2 + brickSizes.z/2)
  }else {
    brickBody.position.set(-6,a, brickSizes.z*j*1.2)
  }
 
  world.addBody(brickBody)
  
  const object = {
    brick,
    brickBody
  }
  
  brickObjects.push(object)
 }
 a = brickSizes.y*i + 0.2
 console.log(a);

}


/**
 * Lights
 */
console.log(chassisBody.position)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
//ambientLight.castShadow = true;
scene.add(ambientLight)

var light = new THREE.DirectionalLight(0xffffff, 0.7);
light.position.set(50, 200, 22);
light.target.position.set(300, 400, 200);
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 5000;
light.shadow.camera.left = -500;
light.shadow.camera.bottom = -500;
light.shadow.camera.right = 500;
light.shadow.camera.top = 500;
//light.castShadow = true;
scene.add(light);

/**
 * Sizes
 */


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(5,5,5)
scene.add(camera)
// box.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  //  antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.5;

const rotationBodyForceCount = {
  up: 0,
  edge: 0
}

const generateBusHeight = (rotation) => {
  const y = (1.3/Math.PI)* Math.abs(rotation) - 0.65
  return y;
}

const generateBusOffsetX = (rotation) => {
 // console.log(rotation.toFixed(2));
  switch(rotation.toFixed(2)){
    case (Math.PI/2).toFixed(2): {
      return (1.3/Math.PI)* Math.abs(rotation) + 0.65
    }
    case (-Math.PI/2).toFixed(2): {
      return (1.3/Math.PI)* Math.abs(rotation) - 0.65
    }
    default: {
      return 0
    }
  }
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1/60, deltaTime, 3)
    
    //Car
  //  box1.position.copy(chassisBody.position);
  const BusOffsetY = generateBusHeight(box1.rotation.z)
  const BusOffsetX = generateBusOffsetX(box1.rotation.z)
  //console.log(BusOffsetX);
  box1.position.set(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z);
  box1.quaternion.copy(chassisBody.quaternion);
  // box2.position.set(chassisBody.position.x, chassisBody.position.y - 0.65, chassisBody.position.z);
  //   box2.quaternion.copy(chassisBody.quaternion);
    tesla.quaternion.copy(chassisBody.quaternion);
    tesla.position.set(chassisBody.position.x , chassisBody.position.y + BusOffsetY , chassisBody.position.z);
  //  tesla.up.set(0,-1,0)
//console.log(tesla);

    // const localUp = new CANNON.Vec3(0, 0, 1)
    // const worldUp = new CANNON.Vec3()
    // console.log(worldUp.dot(localUp));
  //  var localVelocity = new CANNON.Vec3(0, 0, 1);
  //  chassisBody.quaternion.vmult(localVelocity, chassisBody.velocity);
//chassisBody.applyImpulse(new CANNON.Vec3(0, -2, 0), chassisBody.position)
    //trampline.position.copy(tramplinBody.position)

for(const object of brickObjects){
  object.brick.position.copy(object.brickBody.position)
  object.brick.quaternion.copy(object.brickBody.quaternion)

}
//wheelBodies[3].force.set(new CANNON.Vec3)
// if(Math.abs(box1.rotation.z).toFixed(2) === (Math.PI/2).toFixed(2)) {
//   console.log(box1.rotation)
//   tesla.position.set(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z)
// }
//chassisBody.velocity.x -= 0.1
// if( chassisBody.velocity.x !== 0){
 // chassisBody.velocity.x += 0.1
// }
//console.log(chassisBody.velocity.x);
//console.log(box1.rotation);
if(Math.abs(box1.rotation.z).toFixed(2) === (Math.PI).toFixed(2)) {
 // tesla.position.set(chassisBody.position.x, chassisBody.position.y + 0.65, chassisBody.position.z)
  if(rotationBodyForceCount.up === 45) {
    chassisBody.velocity.y += 4
    chassisBody.velocity.x += 4
    rotationBodyForceCount.up = 0
  }
  rotationBodyForceCount.up += 1
}

if((box1.rotation.z).toFixed(2) === (-Math.PI/2).toFixed(2)) {
 // tesla.position.set(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z)
  if(rotationBodyForceCount.edge === 45) {
    chassisBody.velocity.y += 3
    chassisBody.velocity.x += -3
    rotationBodyForceCount.edge = 0
  }
  rotationBodyForceCount.edge += 1
}

if((box1.rotation.z).toFixed(2) === (Math.PI/2).toFixed(2)) {
  //tesla.position.set(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z)
  if(rotationBodyForceCount.edge === 45) {
    chassisBody.velocity.y += 3
    chassisBody.velocity.x += 3
    rotationBodyForceCount.edge = 0
  }
  rotationBodyForceCount.edge += 1
}
// console.log(Math.abs(box1.rotation.z).toFixed(2) === (Math.PI/2).toFixed(2));
    
    // Update controls
    controls.update()

    //Camera
    if(!CamObj.FreeCamera){
      camera.position.set(box1.position.x + CameraOffset.x, box1.position.y + CameraOffset.y, box1.position.z + CameraOffset.z)
     camera.lookAt(box1.position)
    }

    //Snow Update
    let snowP = scene.children.filter(el => el instanceof THREE.Points)
    let vertices = snowP[0].geometry.vertices

    if(vertices){
    vertices.forEach(function (v) {
 
        v.y = v.y - (v.velocityY);
        v.x = v.x - (v.velocityX);
 
        if (v.y <= 0) v.y = 60;
        if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
 
      });
    }
    snowP[0].geometry.verticesNeedUpdate = true;

    stats.update()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

   
}

var engineForce = 600,
maxSteerVal = 0.3;

const buttonForward = document.querySelector('.button-forward1')
const buttonBack = document.querySelector('.button-back1')
const buttonLeft = document.querySelector('.button-left1')
const buttonRight = document.querySelector('.button-right1')
console.log(buttonForward);

buttonForward.addEventListener('pointerover', () => {
  vehicle.applyEngineForce(-engineForce, 2);
  vehicle.applyEngineForce(-engineForce, 3);
})

buttonForward.addEventListener('pointerout', () => {
  vehicle.setBrake(6, 0);
  vehicle.applyEngineForce(0, 2);
  vehicle.applyEngineForce(0, 3);
})

buttonBack.addEventListener('pointerover', () => {
  vehicle.applyEngineForce(engineForce/2, 2);
  vehicle.applyEngineForce(engineForce/2, 3);
})

buttonBack.addEventListener('pointerout', () => {
  vehicle.setBrake(6, 0);
  vehicle.applyEngineForce(0, 2);
  vehicle.applyEngineForce(0, 3);
})

buttonLeft.addEventListener('pointerover', () => {
  vehicle.setSteeringValue(maxSteerVal, 2);
  vehicle.setSteeringValue(maxSteerVal, 3);
})

buttonLeft.addEventListener('pointerout', () => {
  vehicle.setSteeringValue(0, 2);
  vehicle.setSteeringValue(0, 3);
})

buttonRight.addEventListener('pointerover', () => {
  vehicle.setSteeringValue(-maxSteerVal, 2);
  vehicle.setSteeringValue(-maxSteerVal, 3);
})

buttonRight.addEventListener('pointerout', () => {
  vehicle.setSteeringValue(0, 2);
  vehicle.setSteeringValue(0, 3);
})

const navigate = (e) => {
    if (e.type != 'keydown' && e.type != 'keyup') return;
    var keyup = e.type == 'keyup'
     vehicle.setBrake(6, 0);
    // vehicle.setBrake(2, 1);
    // vehicle.setBrake(2, 2);
    // vehicle.setBrake(2, 3);
  

    
              
    switch(e.keyCode) {
  
      case 38: case 87: // forward
      vehicle.applyEngineForce(keyup ? 0 : -engineForce, 2);
      vehicle.applyEngineForce(keyup ? 0 : -engineForce, 3);
      // vehicle.applyEngineForce(keyup ? 0 : -engineForce, 1);
      //   vehicle.applyEngineForce(keyup ? 0 : -engineForce, 0);
        break;
  
      case 40: case 83: // backward
        vehicle.applyEngineForce(keyup ? 0 : engineForce/2, 2);
        vehicle.applyEngineForce(keyup ? 0 : engineForce/2, 3);
        break;
  
      case 39: case 68 : // right
        vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 2);
        vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 3);
        break;
  
      case 37: case 65: // left
        vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 2);
        vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 3);
        break;
    }
  }
  
  window.addEventListener('keydown', navigate)
  window.addEventListener('keyup', navigate)
  

tick()
}
)

generateSnow()