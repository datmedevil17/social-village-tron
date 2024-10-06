"use client";
import React, { useEffect, useRef, useState } from "react";
import Lights from "@/components/ThreeD/Lights";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Sky } from "@react-three/drei";
import Image from "next/image";
import { Character } from "@/components/Character";
import MapFloor from "@/components/ThreeD/MapFloor";
import { Button } from "antd";
import { useInput } from "@/hooks/useInput";

export default function Home() {
  const inputs = useInput();
  const testing = true;
  return (
   <div className="h-[100vh] relative">
     {/* Controls for Movement */}
     <div className="absolute bottom-4 left-4 z-20">
          <div className="flex">
            <div className="flex flex-col items-center ml-4">
              <Button
                shape="default"
                style={{
                  width: 60,
                  height: 60,
                  margin: 1,
                  borderRadius: 5,
                  opacity: 0.9,
                  backgroundColor: inputs.forward ? "yellow" : "", // Change to yellow when 'W' is pressed
                }}
              >
                <div className="text-center flex flex-col">
                  <div className="text-lg font-bold">W</div>
                  <div className="text-xs font-thin">Forward</div>
                </div>
              </Button>
              <div className="flex flex-row">
                <Button
                  shape="default"
                  style={{
                    width: 60,
                    height: 60,
                    margin: 1,
                    borderRadius: 5,
                    opacity: 0.9,
                    backgroundColor: inputs.left ? "yellow" : "", // Change to yellow when 'A' is pressed
                  }}
                >
                  <div className="text-center flex flex-col">
                    <div className="text-lg font-bold">A</div>
                    <div className="text-xs font-thin">Left</div>
                  </div>
                </Button>
                <Button
                  shape="default"
                  style={{
                    width: 60,
                    height: 60,
                    margin: 1,
                    borderRadius: 5,
                    opacity: 0.9,
                    backgroundColor: inputs.backward ? "yellow" : "", // Change to yellow when 'S' is pressed
                  }}
                >
                  <div className="text-center flex flex-col">
                    <div className="text-lg font-bold">S</div>
                    <div className="text-xs font-thin">Backward</div>
                  </div>
                </Button>
                <Button
                  shape="default"
                  style={{
                    width: 60,
                    height: 60,
                    margin: 1,
                    borderRadius: 5,
                    opacity: 0.9,
                    backgroundColor: inputs.right ? "yellow" : "", // Change to yellow when 'D' is pressed
                  }}
                >
                  <div className="text-center flex flex-col">
                    <div className="text-lg font-bold">D</div>
                    <div className="text-xs font-thin">Right</div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div className="flex flex-row">
                <Button
                  shape="default"
                  style={{
                    width: 60,
                    height: 60,
                    margin: 1,
                    borderRadius: 5,
                    opacity: 0.9,
                    backgroundColor: inputs.break_dance ? "yellow" : "", // Change to yellow when '1' is pressed
                  }}
                >
                  <div className="text-center flex flex-col">
                    <div className="text-lg font-bold">1</div>
                    <div className="text-xs font-thin">Emote</div>
                  </div>
                </Button>
                <Button
                  shape="default"
                  style={{
                    width: 60,
                    height: 60,
                    margin: 1,
                    borderRadius: 5,
                    opacity: 0.9,
                    backgroundColor: inputs.backflip ? "yellow" : "", // Change to yellow when '2' is pressed
                  }}
                >
                  <div className="text-center flex flex-col">
                    <div className="text-lg font-bold">2</div>
                    <div className="text-xs font-thin">Emote</div>
                  </div>
                </Button>
              </div>
              <Button
                shape="default"
                style={{
                  width: 70,
                  height: 60,
                  margin: 1,
                  borderRadius: 5,
                  opacity: 0.9,
                  backgroundColor: inputs.shift ? "yellow" : "", // Change to yellow when 'SHIFT' is pressed
                }}
              >
                <div className="text-center flex flex-col">
                  <div className="text-lg font-bold">SHIFT</div>
                  <div className="text-xs font-thin">Sprint</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
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
          <MapFloor />
          <Character />
          <Lights/>
        </Canvas>
   </div>
  );
}
