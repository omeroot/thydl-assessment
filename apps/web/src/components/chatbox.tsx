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
import { Button } from "@thydl/ui/components/ui/button";
import { createRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { useChat } from "ai/react";
import { Textarea } from "@thydl/ui/components/ui/textarea";
import { cn } from "@thydl/ui/lib/utils";

export default function Chatbox({
  image,
  text,
}: {
  image?: string;
  text?: string;
}) {
  const chatId = nanoid();
  const chatboxWrapper = createRef<HTMLDivElement>();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      chatId,
      image,
      text,
    },
  });

  useEffect(() => {
    if (chatboxWrapper.current) {
      chatboxWrapper.current.scrollTo(0, chatboxWrapper.current.scrollHeight);
    }
  }, [messages, chatboxWrapper]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <BotMessageSquare className="w-10 h-auto text-[#c90d0f] fixed bottom-10 right-1/4 transform translate-x-1/2 cursor-pointer p-1" />
      </DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit}>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>Menu Assistant</DrawerTitle>
              <DrawerDescription>
                Ask me anything about the menu.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col h-96">
              <div className="flex-1 p-4 overflow-y-auto" ref={chatboxWrapper}>
                <div className="mb-4">
                  <div className="bg-gray-200 py-2 px-4 rounded-lg w-5/6">
                    <p className="whitespace-pre-wrap">
                      Hello! How can I assist you with the menu today?
                    </p>
                  </div>
                </div>
                {messages.map((message) => (
                  <div
                    className={cn(
                      "mb-4",
                      message.role === "user" && "flex justify-end"
                    )}
                    key={message.id}
                  >
                    <div
                      className={cn(
                        "py-2 px-4 rounded-lg w-5/6 max-w-fit text-left",
                        message.role === "user"
                          ? "bg-[#c90d0f]/20"
                          : "bg-gray-200"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 flex items-center gap-2 flex-row">
                <Textarea
                  className="w-full p-2 border border-gray-300 rounded-lg min-h-24"
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  value={input}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button type="submit">Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}