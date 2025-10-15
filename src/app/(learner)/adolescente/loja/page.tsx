import { ProductCard } from "@/components/product-card";
import { WishlistDrawer } from "@/components/wishlist-drawer";
import { getActiveProducts, getWishlist } from "@/lib/actions/store";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StorePage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const [products, wishlist] = await Promise.all([
    getActiveProducts(),
    getWishlist(user.id),
  ]);

  function isInWishlist(productId: string) {
    return !!wishlist?.items.some((item) => item.productId === productId);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 p-6 md:space-y-6">
      <div className="flex w-full flex-wrap justify-between">
        <h1 className="text-4xl font-extrabold">Loja</h1>
        <WishlistDrawer
          userId={user.id}
          wishlist={wishlist}
          showCartActions={false}
        />
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              userId={user.id}
              key={product.id}
              product={product}
              isInWishlist={isInWishlist(product.id)}
              showCartActions={false}
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
