// components/product-card.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ProductCard({ product, addToCart }: { product: any, addToCart: () => void }) {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                    ${product.price}
                    <Badge
                        variant={product.stock_quantity === 0 ? "destructive" : "outline"}
                        className="ml-2"
                        data-testid="stock-badge"
                    >
                        {product.stock_quantity === 0 ? (
                            "Out of Stock"
                        ) : (
                            `Stock: ${product.stock_quantity}`
                        )}
                    </Badge>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={addToCart}
                    disabled={product.stock_quantity <= 0}
                >
                    {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
            </CardFooter>
        </Card>
    )
}

