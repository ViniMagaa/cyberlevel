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
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

type ProductCardProps = {
  product: Omit<Product, "price"> & { price: number };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group pointer relative flex flex-col justify-end gap-2 overflow-hidden bg-neutral-950 pt-0 pb-4 transition-all hover:scale-[102%] hover:bg-neutral-900">
      <CardHeader className="p-0">
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
      <CardContent className="h-full px-4">
        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        <CardDescription>
          <Paragraphs text={product.description} />
        </CardDescription>
        <p className="text-lg font-black">{formatCurrency(product.price)}</p>
      </CardContent>
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="outline" size="icon" className="rounded-full">
          <Heart />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <ShoppingCart />
        </Button>
      </div>
    </Card>
  );
}
