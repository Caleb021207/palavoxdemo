import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface TranscriptUploadProps {
  onUploadSuccess?: () => void;
}

const TranscriptUpload = ({ onUploadSuccess }: TranscriptUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or PDF file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Demo mode - simulate upload
    setTimeout(() => {
      toast({
        title: "Upload Successful",
        description: "Your transcript has been analyzed!",
      });
      setIsUploading(false);
      setSelectedFile(null);
      onUploadSuccess?.();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Test Transcript
          </CardTitle>
          <CardDescription>
            Upload your language test score report (JPEG, PNG, WebP, or PDF) for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            animate={{
              borderColor: isDragging ? "hsl(var(--primary))" : "hsl(var(--border))",
              backgroundColor: isDragging ? "hsl(var(--primary) / 0.05)" : "transparent",
            }}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center
              transition-all cursor-pointer hover:border-primary/50
              ${selectedFile ? 'border-green-500 bg-green-500/5' : ''}
            `}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium text-foreground">
                    {isDragging ? "Drop file here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports JPEG, PNG, WebP, and PDF files up to 10MB
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Upload Button */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze Transcript
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="glass border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            What our AI can analyze:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Overall scores and CEFR levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Individual skill breakdowns (Reading, Writing, Speaking, Listening)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Strengths and areas for improvement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Progress tracking over time</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptUpload;
