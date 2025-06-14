
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  image: string;
}

interface UserPreference {
  category: string;
  weight: number;
}

const RecommendationSystem = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: 99.99,
      rating: 4.5,
      description: "High-quality wireless headphones with noise cancellation",
      image: "🎧"
    },
    {
      id: 2,
      name: "Yoga Mat",
      category: "Fitness",
      price: 29.99,
      rating: 4.2,
      description: "Non-slip yoga mat for all types of yoga practice",
      image: "🧘"
    },
    {
      id: 3,
      name: "Coffee Maker",
      category: "Kitchen",
      price: 149.99,
      rating: 4.7,
      description: "Programmable coffee maker with thermal carafe",
      image: "☕"
    },
    {
      id: 4,
      name: "Smart Watch",
      category: "Electronics",
      price: 299.99,
      rating: 4.4,
      description: "Fitness tracking smartwatch with heart rate monitor",
      image: "⌚"
    },
    {
      id: 5,
      name: "Running Shoes",
      category: "Fitness",
      price: 89.99,
      rating: 4.3,
      description: "Lightweight running shoes with excellent cushioning",
      image: "👟"
    },
    {
      id: 6,
      name: "Blender",
      category: "Kitchen",
      price: 79.99,
      rating: 4.1,
      description: "High-speed blender perfect for smoothies and soups",
      image: "🥤"
    },
    {
      id: 7,
      name: "Laptop Stand",
      category: "Electronics",
      price: 39.99,
      rating: 4.6,
      description: "Adjustable laptop stand for better ergonomics",
      image: "💻"
    },
    {
      id: 8,
      name: "Resistance Bands",
      category: "Fitness",
      price: 24.99,
      rating: 4.0,
      description: "Set of resistance bands for strength training",
      image: "💪"
    }
  ]);

  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([
    { category: "Electronics", weight: 0.3 },
    { category: "Fitness", weight: 0.4 },
    { category: "Kitchen", weight: 0.3 }
  ]);

  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  // Collaborative filtering simulation
  const generateRecommendations = () => {
    console.log('Generating recommendations based on user preferences and behavior...');
    
    // Simulate user-item matrix and collaborative filtering
    const categoryScores = userPreferences.reduce((acc, pref) => {
      acc[pref.category] = pref.weight;
      return acc;
    }, {} as Record<string, number>);

    // Add bonus for categories of liked products
    likedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        categoryScores[product.category] = (categoryScores[product.category] || 0) + 0.2;
      }
    });

    // Calculate recommendation scores
    const scoredProducts = products
      .filter(product => !likedProducts.includes(product.id))
      .map(product => ({
        ...product,
        score: (categoryScores[product.category] || 0) * product.rating + Math.random() * 0.5
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    setRecommendations(scoredProducts);
  };

  const handleLikeProduct = (productId: number) => {
    setLikedProducts(prev => [...prev, productId]);
    
    // Update user preferences based on liked product
    const product = products.find(p => p.id === productId);
    if (product) {
      setUserPreferences(prev => 
        prev.map(pref => 
          pref.category === product.category 
            ? { ...pref, weight: Math.min(pref.weight + 0.1, 1) }
            : pref
        )
      );
    }
  };

  const handlePreferenceChange = (category: string, weight: number) => {
    setUserPreferences(prev =>
      prev.map(pref =>
        pref.category === category ? { ...pref, weight } : pref
      )
    );
  };

  useEffect(() => {
    generateRecommendations();
  }, [userPreferences, likedProducts]);

  return (
    <div className="space-y-6">
      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPreferences.map(pref => (
              <div key={pref.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{pref.category}</span>
                  <span className="text-sm text-gray-600">
                    {(pref.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={pref.weight}
                  onChange={(e) => handlePreferenceChange(pref.category, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{product.image}</div>
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                    <p className="text-lg font-bold">${product.price}</p>
                    <Button
                      size="sm"
                      onClick={() => handleLikeProduct(product.id)}
                      disabled={likedProducts.includes(product.id)}
                      className="w-full"
                    >
                      {likedProducts.includes(product.id) ? '❤️ Liked' : '👍 Like'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(product => (
                <Card key={product.id} className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{product.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="font-bold text-blue-600">${product.price}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">How it works:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Adjust your category preferences using the sliders above</li>
          <li>• Like products to improve recommendations</li>
          <li>• The system uses collaborative filtering to suggest similar items</li>
          <li>• Recommendations update in real-time based on your behavior</li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationSystem;
