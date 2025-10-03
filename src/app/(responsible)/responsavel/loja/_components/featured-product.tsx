"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { Paragraphs } from "@/components/paragraphs";
import TiltedCard from "@/components/tilted-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
} from "@/lib/actions/store";
import { formatCurrency } from "@/utils/format-currency";
import { Product } from "@prisma/client";
import {
  Asterisk,
  Check,
  Heart,
  Loader2Icon,
  ShoppingCart,
  X,
} from "lucide-react";
import { useTransition } from "react";

type FeaturedProductProps = {
  userId: string;
  product: Product;
  isInCart?: boolean;
  isInWishlist?: boolean;
};

export function FeaturedProduct({
  userId,
  product,
  isInCart,
  isInWishlist,
}: FeaturedProductProps) {
  const [isPendingCart, startCartTransition] = useTransition();
  const [isPendingWishlist, startWishlistTransition] = useTransition();

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
    <Card className="relative border-0 p-0">
      <MagicCard
        gradientColor="#2db780"
        gradientFrom="#2db780"
        gradientTo="#1a8f6b"
        className="md:p-6"
        gradientOpacity={0.15}
      >
        <CardContent className="flex flex-col p-0 md:flex-row">
          {product.imageUrl && (
            <div className="m-auto -mt-6 md:mt-0">
              <TiltedCard
                imageSrc={product.imageUrl}
                altText={product.name}
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="300px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          )}

          <div className="flex w-full flex-col justify-between gap-2 p-6 md:p-0 md:pl-6">
            <div>
              <div className="mb-4 flex w-full justify-between gap-2">
                <div className="bg-primary-600 wrap hover:bg-primary-700 border-primary-500 inline-flex w-fit items-center rounded-full border px-2 text-sm break-keep text-white transition-all hover:cursor-pointer">
                  <Asterisk className="h-6 w-6" />
                  Produto em destaque
                </div>
                {isInWishlist ? (
                  <Button
                    variant="default"
                    size="icon"
                    className="group/wishlist-button ml-auto"
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
                    className="ml-auto"
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
              </div>
              <h2 className="text-5xl font-bold">{product.name}</h2>
              <div className="text-lg">
                <Paragraphs text={product.description} />
              </div>
              <p className="text-3xl font-black">
                {formatCurrency(Number(product.price))}
              </p>
            </div>

            {isInCart ? (
              <Button
                variant="outline"
                size="lg"
                className="group/cart-button"
                onClick={handleRemoveCart}
                disabled={isPendingCart}
              >
                <span className="group-hover/cart-button:hidden">
                  Adicionado ao carrinho
                </span>
                <span className="hidden group-hover/cart-button:block">
                  Remover do carrinho
                </span>
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
                size="lg"
                onClick={handleAddToCart}
                disabled={isPendingCart}
              >
                Adicionar ao carrinho
                {isPendingCart ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <ShoppingCart />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </MagicCard>
    </Card>
  );
}
