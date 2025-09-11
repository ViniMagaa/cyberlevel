"use client";

import { Paragraphs } from "@/components/paragraphs";
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
import { Product } from "@prisma/client";
import { Check, Heart, Loader2Icon, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import {
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
} from "../actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  userId: string;
  product: Product;
  isInCart?: boolean;
  isInWishlist?: boolean;
};

export function ProductCard({
  userId,
  product,
  isInCart,
  isInWishlist,
}: ProductCardProps) {
  const [isPendingCart, startCartTransition] = useTransition();
  const [isPendingWishlist, startWishlistTransition] = useTransition();

  const isProductActive = product.active;

  function handleAddToCart() {
    startCartTransition(() => {
      addToCart(userId, product.id);
    });
  }

  function handleRemoveCart() {
    startCartTransition(() => {
      removeFromCart(userId, product.id);
    });
  }

  function handleAddToWishlist() {
    startWishlistTransition(() => {
      addToWishlist(userId, product.id);
    });
  }

  function handleRemoveWishlist() {
    startWishlistTransition(() => {
      removeFromWishlist(userId, product.id);
    });
  }

  return (
    <Card className="group pointer relative flex flex-col justify-end gap-2 overflow-hidden bg-neutral-950 pt-0 pb-4 transition-all hover:scale-[102%] hover:bg-neutral-900">
      {!isProductActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
          <Badge variant="destructive" className="rounded-full">
            Produto indisponível
          </Badge>
        </div>
      )}
      <CardHeader className={cn("p-0", !isProductActive && "opacity-50")}>
        {product.imageUrl && (
          <AspectRatio ratio={1 / 1}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-md object-cover shadow-lg"
            />
          </AspectRatio>
        )}
      </CardHeader>
      <CardContent
        className={cn("h-full px-4", !isProductActive && "opacity-50")}
      >
        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        <CardDescription>
          <Paragraphs text={product.description} />
        </CardDescription>
        <p className="text-lg font-black">
          {formatCurrency(Number(product.price))}
        </p>
      </CardContent>
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {isInWishlist ? (
          <Button
            variant="default"
            size="icon"
            className="group/wishlist-button"
            onClick={handleRemoveWishlist}
            disabled={isPendingWishlist}
          >
            {isPendingWishlist ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <>
                <Heart className="group-hover/wishlist-button:hidden" />
                <X className="hidden group-hover/wishlist-button:block" />
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddToWishlist}
            disabled={isPendingWishlist}
          >
            {isPendingWishlist ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Heart />
            )}
          </Button>
        )}

        {isInCart ? (
          <Button
            variant="default"
            size="icon"
            className="group/cart-button"
            onClick={handleRemoveCart}
            disabled={isPendingCart}
          >
            {isPendingCart ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <>
                <Check className="group-hover/cart-button:hidden" />
                <X className="hidden group-hover/cart-button:block" />
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddToCart}
            disabled={isPendingCart || !isProductActive}
          >
            {isPendingCart ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ShoppingCart />
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
