"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button";
import { PropsWithChildren } from "react";

export default function LogDrawer({children}: PropsWithChildren) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="z-100 max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>기록하기</DrawerTitle>
          <DrawerDescription>체성분 기록 또는 약물 주사 내역을 입력하세요.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-1">
          <Button>저장하기</Button>
          <DrawerClose>
            <Button variant="outline" className="w-full">취소</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
