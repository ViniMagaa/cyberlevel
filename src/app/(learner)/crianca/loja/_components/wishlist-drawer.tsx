"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prisma } from "@prisma/client";
import { Heart, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { ProductCard } from "./product-card";
import { removeAllFromWishlist } from "@/lib/actions/store";

type WishlistDrawerProps = {
  userId: string;
  wishlist: Prisma.WishlistGetPayload<{
    include: {
      items: { include: { product: true } };
    };
  }> | null;
};

export function WishlistDrawer({ userId, wishlist }: WishlistDrawerProps) {
  const [isPending, startTransition] = useTransition();

  const wishlistItemsCount = wishlist?.items.length || 0;

  function handleRemoveAll() {
    startTransition(() => {
      removeAllFromWishlist(userId);
    });
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="pixel" variant="pixel">
          <div className="flex items-center gap-2">
            <Heart /> Favoritos
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-primary-900 h-[100vh] max-h-none!">
        <DrawerHeader>
          <DrawerTitle className="font-upheaval text-4xl font-normal">
            Lista de favoritos
          </DrawerTitle>
          <DrawerDescription className="font-monocraft">
            {wishlistItemsCount >= 1 ? wishlistItemsCount : "Nenhum"}{" "}
            {wishlistItemsCount <= 1
              ? "produto favoritado"
              : "produtos favoritados"}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[70vh]">
          <div className="max-w-4x m-auto flex flex-wrap justify-center gap-4 p-4">
            {wishlist &&
              wishlist.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex w-full max-w-76 *:w-full"
                >
                  <ProductCard
                    userId={userId}
                    product={item.product}
                    isInWishlist
                  />
                </div>
              ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <div className="m-auto flex w-full max-w-2xl flex-col justify-center space-y-2">
            <div className="flex w-full gap-4 *:flex-1">
              <DrawerClose asChild>
                <Button size="pixel" variant="pixel" className="grayscale">
                  Voltar
                </Button>
              </DrawerClose>
              <Button
                size="pixel"
                variant="pixel"
                onClick={handleRemoveAll}
                disabled={isPending}
              >
                <div className="flex items-center gap-2">
                  Limpar favoritos
                  {isPending && <Loader2Icon className="animate-spin" />}
                </div>
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
