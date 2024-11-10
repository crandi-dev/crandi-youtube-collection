"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Volume2 } from "lucide-react";

export default function LightningLocator() {
  const [lightningTime, setLightningTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${String(milliseconds).padStart(3, "0")}s`;
  };

  const handleLightningClick = () => {
    setLightningTime(Date.now());
    setElapsedTime(0);
    setIsRunning(true);
    setDistance(null);
  };

  const handleThunderClick = () => {
    if (!lightningTime) return;

    setIsRunning(false);
    const thunderTime = Date.now();
    const timeDiff = thunderTime - lightningTime;
    const distanceInMeters = (timeDiff / 1000) * 340;
    setDistance(distanceInMeters);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="font-mono text-5xl font-bold tracking-tight">
              {formatTime(elapsedTime)}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              variant={isRunning ? "secondary" : "default"}
              className="h-16 text-lg gap-2"
              onClick={handleLightningClick}
            >
              <Zap className="h-6 w-6" />
              Flash
            </Button>

            <Button
              size="lg"
              variant="default"
              className="h-16 text-lg gap-2"
              onClick={handleThunderClick}
              disabled={!lightningTime || !isRunning}
            >
              <Volume2 className="h-6 w-6" />
              Sound
            </Button>
          </div>

          {distance && (
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold">
                {(distance / 1000).toFixed(1)} km
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {distance < 1000 ? "⚠️ Very close!" : "Safe distance"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
