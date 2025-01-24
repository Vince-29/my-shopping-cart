// pages/Home.tsx
import { useQuery } from "@tanstack/react-query"
import { ProductCard } from "../components/product-card"
import { getProducts } from "../api/products"
import { useCart } from "../hooks/use-cart"

export default function Home() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts
    })

    const { addItem } = useCart()

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="p-8 grid grid-cols-3 gap-4">
            {products?.map(product => (
                <ProductCard
                    key={product.product_id}
                    product={product}
                    addToCart={() => addItem({
                        product_id: product.product_id,
                        name: product.name,
                        price: product.price
                    })}
                />
            ))}
        </div>
    )
}