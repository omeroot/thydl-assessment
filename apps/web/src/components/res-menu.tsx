"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@thydl/ui/components/ui/card";
import { nanoid } from "nanoid";

export default function RestaurantMenu({
  formattedMenu,
}: {
  formattedMenu: {
    menu: { name: string; description: string }[];
    notes: string[];
  };
}) {
  return (
    <>
      {formattedMenu.menu.map((item) => (
        <Card
          className="border-0 shadow-none rounded-none border-b border-gray-200 last:border-b-0 overflow-y-scroll"
          key={nanoid(3)}
        >
          <CardHeader className="p-4">
            <CardTitle className="flex justify-between items-center">
              <span>{item.name}</span>
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
