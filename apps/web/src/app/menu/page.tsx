"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@thydl/ui/components/ui/breadcrumb";
import { Button } from "@thydl/ui/components/ui/button";
import Image from "next/image";
import { BotMessageSquare } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@thydl/ui/components/ui/drawer";
import RestaurantMenu from "@/components/res-menu";

("lucide-react");

export default function MenuPage() {
  return (
    <div className="relative flex flex-col gap-16 items-center justify-center min-h-screen container py-10">
      <div>
        <Image alt="Logo" height={48} src="/logo-black.svg" width={256} />
      </div>
      <div className="flex flex-col gap-4 flex-1 w-full lg:w-1/2 max-w-lg">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/upload">Upload new menu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Menu</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <RestaurantMenu />

        <Drawer>
          <DrawerTrigger asChild>
            <BotMessageSquare className="w-10 h-auto text-[#c90d0f] fixed bottom-10 right-1/4 transform translate-x-1/2 cursor-pointer p-1" />
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>
                  Set your daily activity goal.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col h-96">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="mb-4">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <p>Hello! How can I help you today?</p>
                    </div>
                  </div>
                  <div className="mb-4 text-right">
                    <div className="bg-blue-500 text-white p-2 rounded-lg inline-block">
                      <p>I need some information about your services.</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <p>Sure! What would you like to know?</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Type your message..."
                    type="text"
                  />
                </div>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
