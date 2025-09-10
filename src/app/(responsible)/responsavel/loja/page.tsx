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
import { requireUserSession } from "@/lib/auth";
import { Heart } from "lucide-react";
import { CartDrawer } from "./_components/cart-drawer";
import { FeaturedProduct } from "./_components/featured-product";
import { ProductCard } from "./_components/product-card";
import { getActiveProducts, getCart } from "./actions";

export default async function StorePage() {
  const { user } = await requireUserSession();

  if (!user) return <div>Usuário não encontrado.</div>;

  const [featuredProduct, ...products] = await getActiveProducts();

  const cart = await getCart(user.id);

  function isInCart(productId: string) {
    return !!cart?.items.some((item) => item.productId === productId);
  }

  return (
    <div className="w-full space-y-12 p-6 md:space-y-6">
      <div className="flex w-full flex-wrap justify-between">
        <h1 className="text-4xl font-bold">Loja</h1>
        <div className="space-x-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="lg" variant="ghost">
                <Heart /> Favoritos
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-4xl font-bold">
                  Produtos favoritos
                </DrawerTitle>
                <DrawerDescription>Nenhum produto favoritado</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Limpar favoritos</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Voltar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <CartDrawer
            userId={user.id}
            cart={
              cart
                ? {
                    ...cart,
                    items: cart.items.map((item) => ({
                      ...item,
                      product: {
                        ...item.product,
                        price: Number(item.product.price),
                      },
                    })),
                  }
                : null
            }
          />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-3">
          <FeaturedProduct
            userId={user.id}
            product={{
              ...featuredProduct,
              price: Number(featuredProduct.price),
            }}
            isInCart={isInCart(featuredProduct.id)}
          />
        </div>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              userId={user.id}
              key={product.id}
              product={{ ...product, price: Number(product.price) }}
              isInCart={isInCart(product.id)}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum produto encontrado.
          </p>
        )}
      </section>
    </div>
  );
}
