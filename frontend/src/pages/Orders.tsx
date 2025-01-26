import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getOrders } from '../api/orders';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import {Button} from "@/components/ui/Button.tsx";

type SortColumn = 'order_id' | 'created_at' | 'total_items' | 'total_amount';

export default function OrdersPage() {
    const [sortConfig, setSortConfig] = useState<{
        column: SortColumn;
        direction: 'asc' | 'desc';
    }>({ column: 'order_id', direction: 'asc' });

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders
    });

    const handleSort = (column: SortColumn) => {
        setSortConfig(prev => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedOrders = [...(orders || [])].sort((a, b) => {
        const modifier = sortConfig.direction === 'asc' ? 1 : -1;

        switch(sortConfig.column) {
            case 'order_id':
                return (a.order_id - b.order_id) * modifier;
            case 'created_at':
                return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * modifier;
            case 'total_items':
                return (a.total_items - b.total_items) * modifier;
            case 'total_amount':
                return (Number(a.total_amount) - Number(b.total_amount)) * modifier;
            default:
                return 0;
        }
    });

    if (isLoading) return <div>Loading orders...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>

            <Table>
                <TableCaption>List of all completed orders</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Button
                                variant="secondary"
                                className="flex items-center gap-1"
                                onClick={() => handleSort('order_id')}
                            >
                                Order ID
                                <ArrowUpDown className="h-4 w-4" />
                                {sortConfig.column === 'order_id' && (
                                    <span>({sortConfig.direction.toUpperCase()})</span>
                                )}
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="secondary"
                                className="flex items-center gap-1"
                                onClick={() => handleSort('created_at')}
                            >
                                Date
                                <ArrowUpDown className="h-4 w-4" />
                                {sortConfig.column === 'created_at' && (
                                    <span>({sortConfig.direction.toUpperCase()})</span>
                                )}
                            </Button>
                        </TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>
                            <Button
                                variant="secondary"
                                className="flex items-center gap-1"
                                onClick={() => handleSort('total_items')}
                            >
                                Total Items
                                <ArrowUpDown className="h-4 w-4" />
                                {sortConfig.column === 'total_items' && (
                                    <span>({sortConfig.direction.toUpperCase()})</span>
                                )}
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="secondary"
                                className="flex items-center gap-1 justify-end"
                                onClick={() => handleSort('total_amount')}
                            >
                                Amount
                                <ArrowUpDown className="h-4 w-4" />
                                {sortConfig.column === 'total_amount' && (
                                    <span>({sortConfig.direction.toUpperCase()})</span>
                                )}
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedOrders?.map(order => (
                        <TableRow key={order.order_id}>
                            <TableCell>#{order.order_id}</TableCell>
                            <TableCell>
                                {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Badge variant="outline">{item.quantity}</Badge>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>{order.total_items}</TableCell>
                            <TableCell className="text-right font-medium">
                                ${Number(order.total_amount).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}