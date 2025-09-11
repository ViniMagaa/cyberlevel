"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { Prisma } from "@prisma/client";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { addToCart, removeFromCart } from "../actions";
import { Badge } from "@/components/ui/badge";

type CartDrawerItemProps = {
  userId: string;
  cartItem: Prisma.CartItemGetPayload<{
    include: { product: true };
  }>;
};

export function CartDrawerItem({ userId, cartItem }: CartDrawerItemProps) {
  const [isPending, startTransition] = useTransition();

  const isProductActive = cartItem.product.active;

  function handleIncrease() {
    startTransition(() => {
      addToCart(userId, cartItem.productId, 1);
    });
  }

  function handleDecrease() {
    if (cartItem.quantity > 1) {
      startTransition(() => {
        addToCart(userId, cartItem.productId, -1);
      });
    } else {
      handleRemove();
    }
  }

  function handleRemove() {
    startTransition(() => {
      removeFromCart(userId, cartItem.productId);
    });
  }

  return (
    <Card className="relative bg-neutral-950 p-2">
      {!isProductActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
          <Badge variant="destructive" className="rounded-full">
            Produto indisponível
          </Badge>
        </div>
      )}
      <CardContent className="flex flex-col gap-4 p-2 sm:grid sm:grid-cols-5 sm:place-items-center">
        <div className="col-span-2 flex w-full flex-wrap items-center gap-4">
          <div className="w-32">
            {cartItem.product.imageUrl && (
              <AspectRatio ratio={1 / 1} className="h-32 w-32">
                <Image
                  src={cartItem.product.imageUrl}
                  alt={cartItem.product.name}
                  fill
                  className="rounded-md object-cover shadow-lg"
                />
              </AspectRatio>
            )}
          </div>
          <CardHeader className="grow p-0">
            <CardTitle className="text-xl font-bold">
              {cartItem.product.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {formatCurrency(Number(cartItem.product.price))}
            </CardDescription>
          </CardHeader>
        </div>

        <div className="col-span-3 mx-1 flex w-full flex-wrap items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={isPending}
              onClick={handleDecrease}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-[2rem] text-center font-bold">
              {cartItem.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={isPending}
              onClick={handleIncrease}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-lg font-bold">
            {formatCurrency(Number(cartItem.product.price) * cartItem.quantity)}
          </p>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive absolute top-2 right-2 z-10 sm:static"
            disabled={isPending}
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
