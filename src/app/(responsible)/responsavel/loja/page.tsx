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
import { Heart, ShoppingCart } from "lucide-react";
import { FeaturedProduct } from "./_components/featured-product";
import { ProductCard } from "./_components/product-card";
import { getActiveProducts } from "./actions";

export default async function StorePage() {
  const [featuredProduct, ...products] = await getActiveProducts();

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

          <Drawer>
            <DrawerTrigger asChild>
              <Button size="lg">
                <ShoppingCart /> Carrinho
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-4xl font-bold">
                  Carrinho de compras
                </DrawerTitle>
                <DrawerDescription>
                  Nenhum produto em seu carrinho
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Fazer pedido</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Voltar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-3">
          <FeaturedProduct
            product={{
              ...featuredProduct,
              price: Number(featuredProduct.price),
            }}
          />
        </div>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, price: Number(product.price) }}
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
