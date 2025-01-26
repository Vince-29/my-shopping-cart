// pages/ProductDetail.tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../api/products.ts'
import { Button } from "@/components/ui/button"
import { useCart } from '../hooks/use-cart'

export default function ProductDetail() {
    const { id } = useParams()
    const { addItem } = useCart()

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id!)
    })

    if (isLoading) return <div>Loading...</div>
    if (!product) return <div>Product not found</div>

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">${product.price}</p>
            <p className="mb-8">{product.description}</p>
            <Button
                size="lg"
                onClick={() => addItem({
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price
                })}
            >
                Add to Cart
            </Button>
        </div>
    )
}