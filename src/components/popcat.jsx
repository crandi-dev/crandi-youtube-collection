"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Trophy, VolumeX, Volume2 } from "lucide-react";

export default function PopCat() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.src = "/pop-sound.mp3";

    audio.addEventListener("canplaythrough", () => {
      setAudioLoaded(true);
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio loading error:", e);
    });

    audioRef.current = audio;

    return () => {
      audio.remove();
    };
  }, []);

  useEffect(() => {
    setProgress(count % 100);
  }, [count]);

  const handleClick = async () => {
    setCount((prev) => prev + 1);
    setIsOpen(true);

    if (audioRef.current && audioLoaded && !isMuted) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            PopCat Clicker
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Click the cat to make it pop!
          </p>
        </div>

        <Separator />

        <div className="flex flex-col items-center gap-6 p-6">
          <div className="relative">
            <div
              className="relative cursor-pointer transition-all hover:scale-105 active:scale-95"
              onClick={handleClick}
            >
              <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={isOpen ? "/popcat-open.png" : "/popcat-close.png"}
                  alt="popcat"
                  fill
                  priority
                  className="object-contain bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-lg px-4 py-1">
                <Trophy className="w-4 h-4 mr-2" />
                {count} Clicks
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="hover:text-primary"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Progress to next level
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
