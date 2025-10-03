import { getActiveProducts, getWishlist } from "@/lib/actions/store";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductCard } from "./_components/product-card";
import { WishlistDrawer } from "./_components/wishlist-drawer";

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
    <div className="bg-primary-800 outline-primary-400/40 ml-20 flex min-h-screen w-full flex-col gap-4 rounded-tl-3xl rounded-bl-3xl p-4 outline sm:gap-6 sm:p-6">
      <div className="flex w-full flex-wrap justify-center gap-2 sm:justify-between">
        <h1 className="font-upheaval text-6xl">Loja</h1>
        <WishlistDrawer userId={user.id} wishlist={wishlist} />
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              userId={user.id}
              key={product.id}
              product={product}
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
