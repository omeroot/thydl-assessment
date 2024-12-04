"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@thydl/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@thydl/ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@thydl/ui/components/ui/collapsible";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  details: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    name: "Appetizers",
    items: [
      {
        name: "Bruschetta",
        description: "Toasted bread with fresh tomatoes",
        price: 8.99,
        details:
          "Our bruschetta features locally sourced tomatoes, fresh basil, and extra virgin olive oil on top of perfectly toasted artisan bread.",
      },
      {
        name: "Calamari",
        description: "Crispy fried squid rings",
        price: 10.99,
        details:
          "Tender squid lightly battered and fried to golden perfection. Served with our house-made marinara and lemon aioli.",
      },
      {
        name: "Spinach Artichoke Dip",
        description: "Creamy dip with spinach and artichokes",
        price: 9.99,
        details:
          "A rich blend of spinach, artichokes, and three cheeses, served hot with crispy tortilla chips.",
      },
      {
        name: "Stuffed Mushrooms",
        description: "Mushroom caps with savory filling",
        price: 11.99,
        details:
          "Button mushrooms filled with a mixture of cream cheese, garlic, and herbs, topped with breadcrumbs and baked until golden.",
      },
    ],
  },
  {
    name: "Main Courses",
    items: [
      {
        name: "Spaghetti Carbonara",
        description: "Classic pasta with eggs and pancetta",
        price: 14.99,
        details:
          "Al dente spaghetti tossed with a creamy sauce made from eggs, Pecorino Romano cheese, pancetta, and freshly ground black pepper.",
      },
      {
        name: "Grilled Salmon",
        description: "Fresh salmon with lemon butter",
        price: 18.99,
        details:
          "Wild-caught Atlantic salmon fillet, grilled to perfection and served with a zesty lemon butter sauce, roasted asparagus, and herb-infused rice pilaf.",
      },
      {
        name: "Chicken Parmesan",
        description: "Breaded chicken with marinara and cheese",
        price: 16.99,
        details:
          "Tender chicken breast, lightly breaded and fried, topped with our house-made marinara sauce and melted mozzarella. Served with a side of spaghetti.",
      },
      {
        name: "Vegetable Stir-Fry",
        description: "Mixed vegetables in savory sauce",
        price: 13.99,
        details:
          "A medley of fresh, crisp vegetables stir-fried in our special ginger-soy sauce. Served over steamed jasmine rice with your choice of tofu or chicken.",
      },
    ],
  },
  {
    name: "Desserts",
    items: [
      {
        name: "Tiramisu",
        description: "Coffee-flavored Italian dessert",
        price: 7.99,
        details:
          "Layers of coffee-soaked ladyfingers and creamy mascarpone cheese, dusted with rich cocoa powder. A true Italian classic.",
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm cake with gooey center",
        price: 8.99,
        details:
          "Decadent chocolate cake with a molten chocolate center, served warm with a scoop of vanilla bean ice cream and fresh berries.",
      },
      {
        name: "New York Cheesecake",
        description: "Classic creamy cheesecake",
        price: 7.99,
        details:
          "Rich and creamy New York-style cheesecake with a graham cracker crust, topped with your choice of fresh strawberry or blueberry compote.",
      },
      {
        name: "Crème Brûlée",
        description: "Vanilla custard with caramelized sugar",
        price: 8.99,
        details:
          "Smooth and silky vanilla bean custard topped with a layer of caramelized sugar. Served with fresh seasonal berries.",
      },
    ],
  },
];

export default function RestaurantMenu() {
  return (
    <>
      {menuData.map((category) => (
        <Collapsible
          className="border rounded-lg overflow-hidden"
          key={category.name}
        >
          <CollapsibleTrigger asChild>
            <Button
              className="w-full justify-between p-6 text-lg font-semibold bg-[#c90d0f] hover:bg-[#c90d0f]/80"
              variant="default"
            >
              {category.name}
              <ChevronDown className="h-6 w-6" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-4 space-y-4">
            {category.items.map((item) => (
              <Card
                className="border-0 shadow-none rounded-none border-b border-gray-200 last:border-b-0"
                key={item.name}
              >
                <CardHeader className="p-4">
                  <CardTitle className="flex justify-between items-center">
                    <span>{item.name}</span>
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">
                    {item.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}
