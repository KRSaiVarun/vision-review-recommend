
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare } from 'lucide-react';
import { pipeline } from '@huggingface/transformers';

interface SentimentResult {
  label: string;
  score: number;
}

const SentimentAnalysis = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Loading sentiment analysis model...');
      const classifier = await pipeline(
        'sentiment-analysis',
        'onnx-community/distilbert-base-uncased-finetuned-sst-2-english'
      );

      console.log('Analyzing sentiment...');
      const output = await classifier(text);
      console.log('Sentiment analysis result:', output);
      
      // Convert the output to our SentimentResult format
      const outputArray = Array.isArray(output) ? output : [output];
      const formattedResult: SentimentResult = {
        label: outputArray[0].label,
        score: outputArray[0].score
      };
      
      setResult(formattedResult);
    } catch (err) {
      console.error('Sentiment analysis error:', err);
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (label: string) => {
    return label === 'POSITIVE' ? 'text-green-600' : 'text-red-600';
  };

  const getSentimentEmoji = (label: string) => {
    return label === 'POSITIVE' ? '😊' : '😞';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="review-text" className="text-sm font-medium">
            Enter your review or text:
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your review here... For example: 'This product is amazing! I love it so much.'"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <Button 
          onClick={analyzeSentiment}
          disabled={loading || !text.trim()}
          className="w-full"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">
                {getSentimentEmoji(result.label)}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Sentiment Analysis Result</h3>
                <p className={`text-xl font-semibold ${getSentimentColor(result.label)}`}>
                  {result.label}
                </p>
                <p className="text-gray-600 mt-2">
                  Confidence: {(result.score * 100).toFixed(2)}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.label === 'POSITIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Try these examples:</h4>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setText("This product exceeded my expectations! Excellent quality and fast delivery.")}
          >
            Positive Example
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setText("Terrible experience. The product broke after one day and customer service was unhelpful.")}
          >
            Negative Example
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setText("The product is okay, nothing special but does what it's supposed to do.")}
          >
            Neutral Example
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
