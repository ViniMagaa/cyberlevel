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
import { removeAllFromWishlist } from "@/lib/actions/store";
import { Prisma } from "@prisma/client";
import { Heart, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { ProductCard } from "./product-card";

type WishlistDrawerProps = {
  userId: string;
  wishlist: Prisma.WishlistGetPayload<{
    include: {
      items: { include: { product: true } };
    };
  }> | null;
  cart?: Prisma.ShoppingCartGetPayload<{
    include: {
      items: { include: { product: true } };
    };
  }> | null;
  showCartActions?: boolean;
};

export function WishlistDrawer({
  userId,
  cart,
  wishlist,
  showCartActions = true,
}: WishlistDrawerProps) {
  const [isPending, startTransition] = useTransition();

  const wishlistItemsCount = wishlist?.items.length || 0;

  function handleRemoveAll() {
    startTransition(() => {
      removeAllFromWishlist(userId);
    });
  }

  function isInCart(productId: string) {
    return !!cart?.items.some((item) => item.productId === productId);
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" variant="ghost">
          <Heart /> Favoritos
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mt-0! h-[95vh] max-h-none!">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">
            Lista de favoritos
          </DrawerTitle>
          <DrawerDescription>
            {wishlistItemsCount >= 1 ? wishlistItemsCount : "Nenhum"}{" "}
            {wishlistItemsCount <= 1
              ? "produto favoritado"
              : "produtos favoritados"}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[70vh]">
          <div className="max-w-4x m-auto flex flex-wrap justify-center gap-4 px-4 py-1">
            {wishlist &&
              wishlist.items.map((item) => (
                <div key={item.product.id} className="w-full max-w-48">
                  <ProductCard
                    key={item.product.id}
                    userId={userId}
                    product={item.product}
                    isInCart={isInCart(item.productId)}
                    isInWishlist
                    showCartActions={showCartActions}
                  />
                </div>
              ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <div className="m-auto flex w-full max-w-2xl flex-col justify-center space-y-2">
            <div className="flex w-full gap-4 *:flex-1">
              <DrawerClose asChild>
                <Button variant="outline">Voltar</Button>
              </DrawerClose>
              <Button onClick={handleRemoveAll} disabled={isPending}>
                Limpar favoritos
                {isPending && <Loader2Icon className="animate-spin" />}
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
