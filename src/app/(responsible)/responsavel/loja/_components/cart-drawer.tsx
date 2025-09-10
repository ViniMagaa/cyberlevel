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
import { formatCurrency } from "@/utils/format-currency";
import { CartItem, Product, ShoppingCart } from "@prisma/client";
import { ShoppingCart as IShoppingCart } from "lucide-react";
import { CartDrawerItem } from "./cart-drawer-item";

type CartDrawerProps = {
  userId: string;
  cart:
    | (ShoppingCart & {
        items: (CartItem & {
          product: Omit<Product, "price"> & { price: number };
        })[];
      })
    | null;
};

export function CartDrawer({ userId, cart }: CartDrawerProps) {
  const cartItemsCount = cart?.items.length || 0;

  const cartTotal =
    cart?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ) || 0;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg">
          <IShoppingCart /> Carrinho
        </Button>
      </DrawerTrigger>
      <DrawerContent className="!max-h-none">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">
            Carrinho de compras
          </DrawerTitle>
          <DrawerDescription>
            {cartItemsCount >= 1 ? cartItemsCount : "Nenhum"}{" "}
            {cartItemsCount <= 1 ? "produto" : "produtos"} em seu carrinho
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh]">
          <div className="m-auto flex max-w-4xl flex-col justify-center gap-4 p-4">
            {cart &&
              cart.items.map((cartItem) => (
                <CartDrawerItem
                  key={cartItem.product.id}
                  userId={userId}
                  cartItem={cartItem}
                />
              ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <div className="m-auto flex w-full max-w-2xl flex-col justify-center space-y-2">
            <p className="text-center text-2xl">
              Total: <strong>{formatCurrency(cartTotal)}</strong>
            </p>
            <div className="flex w-full gap-4 *:flex-1">
              <DrawerClose asChild>
                <Button variant="outline" className="rounded-full">
                  Voltar
                </Button>
              </DrawerClose>
              <Button className="rounded-full">Fazer pedido</Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
