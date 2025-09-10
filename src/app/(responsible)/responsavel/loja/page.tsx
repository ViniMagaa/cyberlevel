import { requireUserSession } from "@/lib/auth";
import { CartDrawer } from "./_components/cart-drawer";
import { FeaturedProduct } from "./_components/featured-product";
import { ProductCard } from "./_components/product-card";
import { WishlistDrawer } from "./_components/wishlist-drawer";
import { getActiveProducts, getCart, getWishlist } from "./actions";

export default async function StorePage() {
  const { user } = await requireUserSession();

  if (!user) return <div>Usuário não encontrado.</div>;

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
          <WishlistDrawer
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
            wishlist={
              wishlist
                ? {
                    ...wishlist,
                    items: wishlist.items.map((item) => ({
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
            isInWishlist={isInWishlist(featuredProduct.id)}
          />
        </div>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              userId={user.id}
              key={product.id}
              product={{ ...product, price: Number(product.price) }}
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
