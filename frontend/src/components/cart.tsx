// components/cart.tsx (update checkout handler)
import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input.tsx"
import { useCart } from "../hooks/use-cart"
import { createOrder } from "../api/products"
import { useQueryClient } from "@tanstack/react-query"

export function Cart() {
    const { items, clearCart , updateQuantity, removeItem} = useCart()
    const queryClient = useQueryClient()
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const handleCheckout = async () => {
        try {
            const orderItems = items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))

            await createOrder(orderItems)
            clearCart()

            // Refresh products data after successful checkout
            await queryClient.invalidateQueries({ queryKey: ['products'] })

            alert('Order placed successfully!')
        } catch (error) {
            alert('Error placing order')
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
                                console.log('Raw input value:', e.target.value); // Debugging
                                const value = parseInt(e.target.value);

                                // Handle empty input case first
                                if (e.target.value === "") {
                                    console.log('Empty input detected, setting to 1');
                                    updateQuantity(item.product_id, 1);
                                    return;
                                }

                                if (!isNaN(value) && value >= 1) {
                                    console.log('Valid quantity update:', value);
                                    updateQuantity(item.product_id, value);
                                } else {
                                    console.log('Invalid value, ignoring:', value);
                                }
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "" || parseInt(e.target.value) < 1) {
                                    console.log('Blur with invalid value, resetting to 1');
                                    updateQuantity(item.product_id, 1);
                                }
                            }}
                            className="w-16 px-2 border rounded ml-6"
                        />
                        <Button
                            variant="destructive"
                            onClick={() => {
                                console.log('Removing item:', item.product_id);
                                removeItem(item.product_id);
                            }}
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
        </div>
    )
}