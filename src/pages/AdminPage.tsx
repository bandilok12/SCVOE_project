import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit2, 
  ShoppingBag, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Save,
  X
} from 'lucide-react';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  unit: string;
  is_active: boolean;
}

interface ShippingAddress {
  fullName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
}

interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: ShippingAddress;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  packed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

const AdminPage: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'Seeds',
    stock: 0,
    unit: 'kg',
    is_active: true,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } else {
      const mappedOrders: Order[] = (data || []).map(order => ({
        ...order,
        shipping_address: (order.shipping_address as ShippingAddress) || {},
      }));
      setOrders(mappedOrders);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please fill in required fields');
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert([newProduct]);
    
    if (error) {
      toast.error('Failed to add product');
      console.error(error);
    } else {
      toast.success('Product added successfully');
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'Seeds',
        stock: 0,
        unit: 'kg',
        is_active: true,
      });
      fetchProducts();
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        image_url: editingProduct.image_url,
        category: editingProduct.category,
        stock: editingProduct.stock,
        unit: editingProduct.unit,
        is_active: editingProduct.is_active,
      })
      .eq('id', editingProduct.id);
    
    if (error) {
      toast.error('Failed to update product');
      console.error(error);
    } else {
      toast.success('Product updated successfully');
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete product');
      console.error(error);
    } else {
      toast.success('Product deleted successfully');
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], trackingNumber?: string) => {
    const updateData: { status: Order['status']; tracking_number?: string } = { status };
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);
    
    if (error) {
      toast.error('Failed to update order');
      console.error(error);
    } else {
      toast.success('Order updated successfully');
      fetchOrders();

      // Send email notification
      try {
        const response = await supabase.functions.invoke('send-order-notification', {
          body: {
            orderId,
            newStatus: status,
            trackingNumber: trackingNumber || undefined,
          },
        });
        
        if (response.error) {
          console.error('Email notification failed:', response.error);
          toast.error('Order updated but email notification failed');
        } else {
          toast.success('Customer notified via email');
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background ">
      {/* Header */}
      <section className="py-8 gradient-hero min-h-[25vh] top-30">
        <div className="container top-60 mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground  mb-2">Admin Dashboard</h1>
          <p className="text-primary-foreground/80">Manage products, orders, and tracking</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Products ({products.length})</h2>
                <Button onClick={() => setShowAddProduct(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Product</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddProduct(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2"
                      >
                        <option>Seeds</option>
                        <option>Fertilizers</option>
                        <option>Pesticides</option>
                        <option>Equipment</option>
                        <option>Irrigation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        placeholder="kg, liter, piece"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Product description"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProduct} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Product
                  </Button>
                </div>
              )}

              {/* Products List */}
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-card rounded-xl border border-border p-4">
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <Input
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            placeholder="Name"
                          />
                          <Input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            placeholder="Price"
                          />
                          <Input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                            placeholder="Stock"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateProduct} size="sm" className="gap-2">
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingProduct(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category} • ₹{product.price}/{product.unit}</p>
                            <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => setEditingProduct(product)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No products found. Add your first product!
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Orders ({orders.length})</h2>

              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-mono text-foreground">{order.id.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="text-foreground">{order.shipping_address?.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-foreground">₹{order.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                      <p className="text-foreground">
                        {order.shipping_address?.address}, {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
                      </p>
                      <p className="text-muted-foreground">Phone: {order.shipping_address?.phone}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Label>Status:</Label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="h-9 rounded-lg border-2 border-input bg-background px-3"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label>Tracking:</Label>
                        <Input
                          placeholder="Tracking number"
                          defaultValue={order.tracking_number || ''}
                          className="w-48"
                          onBlur={(e) => {
                            if (e.target.value !== order.tracking_number) {
                              handleUpdateOrderStatus(order.id, order.status, e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No orders found.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AdminPage;
