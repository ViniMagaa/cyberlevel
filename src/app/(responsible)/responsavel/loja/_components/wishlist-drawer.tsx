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
import {
  CartItem,
  Product,
  ShoppingCart,
  Wishlist,
  WishlistItem,
} from "@prisma/client";
import { Heart, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { removeAllFromWishlist } from "../actions";
import { ProductCard } from "./product-card";

type WishlistDrawerProps = {
  userId: string;
  wishlist:
    | (Wishlist & {
        items: (WishlistItem & {
          product: Omit<Product, "price"> & { price: number };
        })[];
      })
    | null;
  cart:
    | (ShoppingCart & {
        items: (CartItem & {
          product: Omit<Product, "price"> & { price: number };
        })[];
      })
    | null;
};

export function WishlistDrawer({
  userId,
  cart,
  wishlist,
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
      <DrawerContent className="!max-h-none">
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
        <ScrollArea className="h-[55vh]">
          <div className="max-w-4x m-auto flex flex-wrap justify-center gap-4 p-4">
            {wishlist &&
              wishlist.items.map((item) => (
                <div key={item.product.id} className="w-full max-w-48">
                  <ProductCard
                    key={item.product.id}
                    userId={userId}
                    product={item.product}
                    isInCart={isInCart(item.productId)}
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
                <Button variant="outline" className="rounded-full">
                  Voltar
                </Button>
              </DrawerClose>
              <Button
                className="rounded-full"
                onClick={handleRemoveAll}
                disabled={isPending}
              >
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
