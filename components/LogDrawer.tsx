"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "./ui/button";
import { useLogContext } from "./provider/LogProvider";
import { LogType } from "@/lib/type";

const TYPE_KOREAN: Record<LogType, string> = {
  weight: "체성분 기록",
  injection: "약물 주사 내역",
};

export default function LogDrawer() {
  const { isOpen, setIsOpen, type } = useLogContext();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="z-100 max-w-lg mx-auto">
        <DrawerHeader>
          <Tabs defaultValue="weight">
            <TabsList className="w-full">
              <TabsTrigger value="weight">{TYPE_KOREAN["weight"]}</TabsTrigger>
              <TabsTrigger value="injection">
                {TYPE_KOREAN["injection"]}
              </TabsTrigger>
            </TabsList>

            <DrawerTitle hidden>{TYPE_KOREAN[type]} 기록하기</DrawerTitle>
            <div className="pt-6">
              <TabsContent value="weight">체중입력폼</TabsContent>
              <TabsContent value="injection">주사입력폼</TabsContent>
            </div>
          </Tabs>
        </DrawerHeader>
        <DrawerFooter className="gap-1">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              취소
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
