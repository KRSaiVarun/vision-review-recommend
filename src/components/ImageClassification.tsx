
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { pipeline } from '@huggingface/transformers';

interface ClassificationResult {
  label: string;
  score: number;
}

const ImageClassification = () => {
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResults([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Loading image classification model...');
      const classifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'
      );

      console.log('Classifying image...');
      const output = await classifier(image);
      console.log('Classification results:', output);
      
      setResults(output.slice(0, 5)); // Show top 5 predictions
    } catch (err) {
      console.error('Classification error:', err);
      setError('Failed to classify image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <Button 
          onClick={triggerFileInput}
          variant="outline"
          className="w-full max-w-md h-32 border-dashed border-2 hover:bg-gray-50"
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">Click to upload an image</span>
          </div>
        </Button>

        {image && (
          <div className="space-y-4">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-4">
                <img 
                  src={image} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={classifyImage}
              disabled={loading}
              className="w-full max-w-md"
            >
              {loading ? 'Classifying...' : 'Classify Image'}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Classification Results:</h3>
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.label}</span>
                  <span className="text-sm text-gray-600">
                    {(result.score * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.score * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageClassification;
