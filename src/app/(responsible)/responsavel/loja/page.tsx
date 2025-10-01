import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CartDrawer } from "./_components/cart-drawer";
import { FeaturedProduct } from "./_components/featured-product";
import { ProductCard } from "./_components/product-card";
import { WishlistDrawer } from "./_components/wishlist-drawer";
import { getActiveProducts, getCart, getWishlist } from "./actions";

export default async function StorePage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const [[featuredProduct, ...products], cart, wishlist] = await Promise.all([
    getActiveProducts(),
    getCart(user.id),
    getWishlist(user.id),
  ]);

  function isInCart(productId: string) {
    return !!cart?.items.some((item) => item.productId === productId);
  }

  function isInWishlist(productId: string) {
    return !!wishlist?.items.some((item) => item.productId === productId);
  }

  return (
    <div className="w-full space-y-12 p-6 md:space-y-6">
      <div className="flex w-full flex-wrap justify-between">
        <h1 className="text-4xl font-bold">Loja</h1>
        <div className="space-x-4">
          <WishlistDrawer userId={user.id} cart={cart} wishlist={wishlist} />

          <CartDrawer userId={user.id} cart={cart} />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-3">
          <FeaturedProduct
            userId={user.id}
            product={featuredProduct}
            isInCart={isInCart(featuredProduct.id)}
            isInWishlist={isInWishlist(featuredProduct.id)}
          />
        </div>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              userId={user.id}
              key={product.id}
              product={product}
              isInCart={isInCart(product.id)}
              isInWishlist={isInWishlist(product.id)}
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
