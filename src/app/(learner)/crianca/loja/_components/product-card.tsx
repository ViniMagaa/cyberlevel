"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/store";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format-currency";
import { Product } from "@prisma/client";
import { Heart, Loader2Icon, X } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";

type ProductCardProps = {
  userId: string;
  product: Product;
  isInWishlist?: boolean;
};

export function ProductCard({
  userId,
  product,
  isInWishlist,
}: ProductCardProps) {
  const [isPendingWishlist, startWishlistTransition] = useTransition();

  const isProductActive = product.active;

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
    <Card className="group pointer bg-primary-600 relative flex flex-col justify-end gap-2 overflow-hidden pt-0 pb-4 transition-all hover:scale-[102%]">
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
              className="rounded-md object-contain"
            />
          </AspectRatio>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          "flex h-full flex-col px-4",
          !isProductActive && "opacity-50",
        )}
      >
        <CardTitle className="font-upheaval text-3xl font-normal">
          {product.name}
        </CardTitle>
        <CardDescription className="font-monocraft text-primary-200">
          {product.description}
        </CardDescription>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <p className="font-upheaval text-3xl">
            {formatCurrency(Number(product.price))}
          </p>
          <div className="ml-auto">
            {isInWishlist ? (
              <Button
                variant="pixel"
                size="pixel"
                className="hue-rotate-200"
                onClick={handleRemoveWishlist}
                disabled={isPendingWishlist}
              >
                <div className="flex w-full items-center gap-2 text-base">
                  {isPendingWishlist ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <X />
                  )}
                  Remover
                </div>
              </Button>
            ) : (
              <Button
                variant="pixel"
                size="pixel"
                onClick={handleAddToWishlist}
                disabled={isPendingWishlist}
              >
                <div className="flex w-full items-center gap-2 text-base">
                  {isPendingWishlist ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Heart />
                  )}
                  Favoritar
                </div>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
