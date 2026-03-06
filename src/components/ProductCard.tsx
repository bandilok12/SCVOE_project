import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft h-150 hover:shadow-card transition-all duration-300 border border-border">
      {/* Image */}
      <div className="relative h-80 w-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Stock & Unit */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Package className="w-4 h-4" />
          <span>{product.stock} in stock • {product.unit}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground ml-1">/{product.unit}</span>
          </div>
          <Button
            onClick={() => addToCart(product)}
            variant="hero"
            size="sm"
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
