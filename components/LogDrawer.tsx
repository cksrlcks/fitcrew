"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useLogContext } from "./provider/LogProvider";
import { LogType } from "@/lib/type";
import BodyLogForm from "./BodyLogForm";
import InjectionLogForm from "./InjectionLogForm";

const TYPE_KOREAN: Record<LogType, string> = {
  weight: "체성분 기록",
  injection: "약물 주사 내역",
};

export default function LogDrawer() {
  const { isOpen, setIsOpen, type, setType, date } = useLogContext();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="z-100 max-w-lg mx-auto">
        <div className="overflow-y-auto">
          <DrawerHeader>
            <Tabs
              value={type}
              onValueChange={(value) => setType(value as LogType)}
            >
              <TabsList className="w-full">
                <TabsTrigger value="weight">
                  {TYPE_KOREAN["weight"]}
                </TabsTrigger>
                <TabsTrigger value="injection">
                  {TYPE_KOREAN["injection"]}
                </TabsTrigger>
              </TabsList>

              <DrawerTitle hidden>{TYPE_KOREAN[type]} 기록하기</DrawerTitle>
              <div className="pt-6">
                {type === "weight" && (
                  <BodyLogForm
                    logDate={date}
                    onClose={() => setIsOpen(false)}
                  />
                )}
                {type === "injection" && (
                  <InjectionLogForm
                    logDate={date}
                    onClose={() => setIsOpen(false)}
                  />
                )}
              </div>
            </Tabs>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
