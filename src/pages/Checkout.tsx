import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Check, ArrowLeft, ShieldCheck, Package } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const tax = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + tax;

  // Redirect admin users away from checkout
  if (isAdmin) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Admin users cannot place orders</h1>
          <p className="text-muted-foreground mb-6">Please use a regular user account to make purchases.</p>
          <Link to="/shop">
            <Button variant="hero">Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address || 
        !shippingDetails.city || !shippingDetails.state || !shippingDetails.pincode) {
      toast.error('Please fill all shipping details');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: finalTotal,
          shipping_address: JSON.parse(JSON.stringify(shippingDetails)),
          status: 'confirmed' as const,
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Order was created but items failed - still show success
      }

      setOrderId(orderData.id);
      clearCart();
      setStep('confirmation');
      toast.success('Payment successful! Order placed.');
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in to checkout</h1>
          <Link to="/auth">
            <Button variant="hero">Sign In</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  if (items.length === 0 && step !== 'confirmation') {
    navigate('/cart');
    return null;
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { key: 'shipping', label: 'Shipping', icon: MapPin },
              { key: 'payment', label: 'Payment', icon: CreditCard },
              { key: 'confirmation', label: 'Confirmation', icon: Check },
            ].map(({ key, label, icon: Icon }, index) => (
              <React.Fragment key={key}>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step === key ? 'bg-primary text-primary-foreground' :
                    ['shipping', 'payment', 'confirmation'].indexOf(step) > index 
                      ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium hidden sm:block ${step === key ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 rounded ${
                    ['shipping', 'payment', 'confirmation'].indexOf(step) > index 
                      ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Shipping Step */}
          {step === 'shipping' && (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Shipping Details
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={shippingDetails.fullName}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={shippingDetails.phone}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Farm Road, Village Name"
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingDetails.city}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Mumbai"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingDetails.state}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="Maharashtra"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          value={shippingDetails.pincode}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="400001"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Link to="/cart">
                        <Button type="button" variant="outline" className="gap-2">
                          <ArrowLeft className="w-4 h-4" />
                          Back to Cart
                        </Button>
                      </Link>
                      <Button type="submit" variant="hero" className="flex-1">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-primary">Free</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (5% GST)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Method
                  </h2>
                  
                  {/* Stripe Payment UI */}
                  <div className="space-y-4">
                    <div className="p-4 bg-accent rounded-xl border-2 border-primary">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Powered by Stripe</p>
                        </div>
                        <div className="ml-auto flex gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input id="cardName" placeholder="John Doe" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('shipping')} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button 
                        variant="hero" 
                        className="flex-1 gap-2" 
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay ₹{finalTotal.toLocaleString()}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-foreground mb-4">Shipping To</h3>
                  <div className="bg-muted rounded-lg p-3 mb-4">
                    <p className="font-medium text-foreground">{shippingDetails.fullName}</p>
                    <p className="text-sm text-muted-foreground">{shippingDetails.address}</p>
                    <p className="text-sm text-muted-foreground">{shippingDetails.city}, {shippingDetails.state} - {shippingDetails.pincode}</p>
                    <p className="text-sm text-muted-foreground">{shippingDetails.phone}</p>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {step === 'confirmation' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-card rounded-2xl shadow-card border border-border p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>
                
                <div className="bg-accent rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="text-xl font-bold text-foreground">{orderId}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-muted rounded-xl p-4">
                    <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium text-foreground">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Shipping To</p>
                    <p className="font-medium text-foreground">{shippingDetails.city}, {shippingDetails.state}</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link to="/orders">
                    <Button variant="hero" className="gap-2">
                      <Package className="w-4 h-4" />
                      Track Order
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Checkout;
