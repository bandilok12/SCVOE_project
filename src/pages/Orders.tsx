import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_id: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_number: string | null;
}

const Orders: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      // Fetch orders for the current user
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast.error('Failed to load orders');
        setLoading(false);
        return;
      }

      // Fetch order items for each order
      const ordersWithItems: Order[] = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
          }

          return {
            ...order,
            shipping_address: order.shipping_address as unknown as ShippingAddress,
            items: itemsData || [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'packed':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
      case 'confirmed':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'processing':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'packed':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'delivered':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Pending', icon: Clock },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'processing', label: 'Processing', icon: Clock },
      { key: 'packed', label: 'Packed', icon: Package },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= (currentIndex === -1 ? 0 : currentIndex),
      current: step.key === status,
    }));
  };

  const getEstimatedDelivery = (createdAt: string) => {
    const orderDate = new Date(createdAt);
    const deliveryDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    return deliveryDate;
  };

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Sign in to view orders</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to see your order history.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">No orders yet</h1>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="lg" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-bold text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-border p-6 space-y-6">
                  {/* Tracking Progress */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Order Tracking</h3>
                    <div className="flex items-center justify-between relative overflow-x-auto pb-4">
                      <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ 
                            width: `${(getTrackingSteps(order.status).filter(s => s.completed).length - 1) / 5 * 100}%` 
                          }}
                        />
                      </div>
                      {getTrackingSteps(order.status).map(step => (
                        <div key={step.key} className="flex flex-col items-center relative z-10 min-w-[60px]">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs mt-2 text-center ${
                            step.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Number */}
                  {order.tracking_number && (
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium text-foreground">{order.tracking_number}</p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Items</h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 bg-muted rounded-lg p-3">
                          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-foreground">₹{(Number(item.price) * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Shipping Address
                      </h3>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-medium text-foreground">{order.shipping_address.fullName}</p>
                        <p className="text-sm text-muted-foreground">{order.shipping_address.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{order.shipping_address.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        Delivery Info
                      </h3>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                        <p className="font-medium text-foreground">
                          {getEstimatedDelivery(order.created_at).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Orders;
