"use client";
import React, { useEffect, useRef, useState } from "react";
import Lights from "@/components/ThreeD/Lights";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Sky } from "@react-three/drei";
import Image from "next/image";
import { Character } from "@/components/Character";

export default function Home() {
  const testing = true;
  return (
   <div className="h-[100vh] relative">
    <Canvas
          shadows
          camera={{ position: [0, 30, 55], fov: 50 }}
          style={{ zIndex: 0 }}
        >
          {testing ? <axesHelper visible={testing} args={[200]} /> : null}
          {testing ? <gridHelper args={[200, 200]} /> : null}
          <OrbitControls/>
          {testing ? <Stats /> : null}
          <Sky/>
          {/* <MapFloor /> */}
          <Character />
          <Lights/>
        </Canvas>
   </div>
  );
}
