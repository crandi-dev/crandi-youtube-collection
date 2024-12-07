"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const LunchRecommender = () => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [recentMenus, setRecentMenus] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  const menus = [
    // 한식
    { name: "김치찌개", type: "한식" },
    { name: "된장찌개", type: "한식" },
    { name: "비빔밥", type: "한식" },
    { name: "삼겹살", type: "한식" },
    { name: "부대찌개", type: "한식" },
    { name: "갈비탕", type: "한식" },
    { name: "칼국수", type: "한식" },
    { name: "냉면", type: "한식" },
    { name: "제육볶음", type: "한식" },
    { name: "순두부찌개", type: "한식" },
    { name: "닭갈비", type: "한식" },
    { name: "불고기", type: "한식" },

    // 일식
    { name: "라멘", type: "일식" },
    { name: "초밥", type: "일식" },
    { name: "우동", type: "일식" },
    { name: "돈까스", type: "일식" },
    { name: "덮밥", type: "일식" },
    { name: "소바", type: "일식" },
    { name: "타코야끼", type: "일식" },
    { name: "오니기리", type: "일식" },
    { name: "규동", type: "일식" },
    { name: "가츠동", type: "일식" },
    { name: "텐동", type: "일식" },

    // 중식
    { name: "짜장면", type: "중식" },
    { name: "짬뽕", type: "중식" },
    { name: "마라탕", type: "중식" },
    { name: "탕수육", type: "중식" },
    { name: "양꼬치", type: "중식" },
    { name: "깐풍기", type: "중식" },
    { name: "마파두부", type: "중식" },
    { name: "동파육", type: "중식" },
    { name: "볶음밥", type: "중식" },
    { name: "계란탕", type: "중식" },
    { name: "꿔바로우", type: "중식" },

    // 양식
    { name: "파스타", type: "양식" },
    { name: "피자", type: "양식" },
    { name: "샐러드", type: "양식" },
    { name: "스테이크", type: "양식" },
    { name: "햄버거", type: "양식" },
    { name: "리조또", type: "양식" },
    { name: "오믈렛", type: "양식" },
    { name: "수프", type: "양식" },
    { name: "치킨", type: "양식" },
    { name: "샌드위치", type: "양식" },
    { name: "타코", type: "양식" },
  ];

  const getRandomMenu = () => {
    setIsSpinning(true);

    // 애니메이션을 위한 딜레이 추가
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * menus.length);
      const newMenu = menus[randomIndex];
      setCurrentMenu(newMenu);
      setRecentMenus((prev) => {
        const updated = [newMenu, ...prev].slice(0, 3);
        return updated;
      });
      setIsSpinning(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">점메추</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {currentMenu ? (
              <motion.div
                key={currentMenu.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-2"
              >
                <motion.h2
                  className="text-2xl font-bold"
                  animate={{ scale: isSpinning ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentMenu.name}
                </motion.h2>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="secondary">{currentMenu.type}</Badge>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500"
              >
                버튼을 눌러 메뉴를 추천받아보세요!
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            className="w-full"
            onClick={getRandomMenu}
            disabled={isSpinning}
          >
            {isSpinning ? "메뉴 고르는 중..." : "다른 메뉴 추천받기"}
          </Button>

          {recentMenus.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4 border-t"
            >
              <h3 className="text-sm font-medium mb-2">최근 추천 메뉴</h3>
              <div className="space-y-1">
                {recentMenus.map((menu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{menu.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {menu.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LunchRecommender;
