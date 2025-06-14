
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageClassification from '@/components/ImageClassification';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import RecommendationSystem from '@/components/RecommendationSystem';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Web Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience cutting-edge machine learning with image classification, sentiment analysis, 
            and personalized recommendations - all running in your browser
          </p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="image" className="text-lg py-3">
              🖼️ Image Classification
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="text-lg py-3">
              💭 Sentiment Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-lg py-3">
              🎯 Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>Image Classification</CardTitle>
                <CardDescription>
                  Upload an image and our AI will classify it using a pre-trained computer vision model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageClassification />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Submit a review or text and discover its sentiment using natural language processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Product Recommendations</CardTitle>
                <CardDescription>
                  Get personalized product recommendations based on your preferences and behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationSystem />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
