"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@thydl/ui/components/ui/breadcrumb";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@thydl/ui/components/ui/tooltip";
import { Info } from "lucide-react";
import RestaurantMenu from "@/components/res-menu";
import Chatbox from "@/components/chatbox";

export default function MenuPage() {
  const [formattedMenu, setFormattedMenu] = useState<{
    menu: { name: string; description: string }[];
    notes: string[];
  } | null>(null);

  useEffect(() => {
    const formattedMenuStr = localStorage.getItem("formattedMenu") || "{}";
    const json = JSON.parse(formattedMenuStr) as {
      menu: { name: string; description: string }[];
      notes: string[];
    };

    setFormattedMenu(json);
  }, []);

  if (!formattedMenu) {
    return null;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen container py-10">
      <div className="mb-12 md:mb-24 w-full flex justify-center">
        <Image alt="Logo" height={48} src="/logo-black.svg" width={256} />
      </div>
      <div className="flex flex-col gap-8 flex-1 w-full lg:w-1/2 max-w-lg">
        <Breadcrumb className="px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Upload new menu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Menu</BreadcrumbPage>
              {formattedMenu.notes.length > 0 ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-auto cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent
                      className="flex flex-col gap-1"
                      side="right"
                    >
                      {formattedMenu.notes.map((note) => (
                        <p key={note}>- {note}</p>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="md:h-[calc(100vh-20rem)] h-full overflow-y-auto shadow-lg shadow-gray-100 rounded-lg relative">
          <RestaurantMenu formattedMenu={formattedMenu} />

          <div className="sticky bottom-0 w-full bg-white p-4 justify-center shadow-xl shadow-gray-100 hidden md:flex">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <Chatbox text={JSON.stringify(formattedMenu.menu)} />
      </div>
    </div>
  );
}
