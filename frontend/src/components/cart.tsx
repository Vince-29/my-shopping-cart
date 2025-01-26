import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "../hooks/use-cart"
import { createOrder } from "../api/products"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function Cart() {
    const { items, clearCart, updateQuantity, removeItem } = useCart()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const handleCheckout = async () => {
        try {
            const orderItems = items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))

            const response = await createOrder(orderItems)
            clearCart()

            await queryClient.invalidateQueries({ queryKey: ['products'] })

            toast({
                title: "Order Successful!",
                description: `Order ID: ${response.order_id}\nTotal: $${response.total_amount.toFixed(2)}`,
            })
        } catch (error) {
            toast({
                title: "Order Failed",
                description: "Could not process your order",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            {items.map(item => (
                <div key={item.product_id} className="flex justify-between items-center">
                    <div>
                        <h3>{item.name}</h3>
                        <p>${item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            min="1"
                            value={item.quantity.toString()}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (e.target.value === "") {
                                    updateQuantity(item.product_id, 1)
                                    return
                                }
                                if (!isNaN(value) && value >= 1) {
                                    updateQuantity(item.product_id, value)
                                }
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "" || parseInt(e.target.value) < 1) {
                                    updateQuantity(item.product_id, 1)
                                }
                            }}
                            className="w-16 px-2 border rounded ml-6"
                        />
                        <Button
                            variant="destructive"
                            onClick={() => removeItem(item.product_id)}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
            <div className="text-right font-bold text-lg">
                Total: ${total.toFixed(2)}
            </div>
            <Button onClick={handleCheckout} className="w-full">
                Checkout
            </Button>
            <Toaster />
        </div>
    )
}