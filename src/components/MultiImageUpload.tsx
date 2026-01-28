import { useState, useCallback } from "react";
import { Upload, X, GripVertical, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const MultiImageUpload = ({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: MultiImageUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `cars/${fileName}`;

    const { error } = await supabase.storage
      .from("car-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("car-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please upload image files only (JPG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast({
        title: "Maximum images reached",
        description: `You can only upload up to ${maxImages} images per car.`,
        variant: "destructive",
      });
      return;
    }

    const filesToUpload = imageFiles.slice(0, remaining);
    if (filesToUpload.length < imageFiles.length) {
      toast({
        title: "Some files skipped",
        description: `Only ${remaining} more image(s) can be added.`,
        variant: "default",
      });
    }

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < filesToUpload.length; i++) {
      const url = await uploadImage(filesToUpload[i]);
      if (url) {
        uploadedUrls.push(url);
      }
      setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
    }

    if (uploadedUrls.length > 0) {
      onImagesChange([...images, ...uploadedUrls]);
      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, images, maxImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input to allow selecting same files again
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // Drag-to-reorder handlers
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    onImagesChange(newImages);
    setDraggedIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-center
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
          ${disabled || isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
        onClick={() => !disabled && !isUploading && document.getElementById("multi-image-input")?.click()}
      >
        <input
          type="file"
          id="multi-image-input"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drop images here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload up to {maxImages} photos • JPG, PNG, WebP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {images.length} of {maxImages} photos • Drag to reorder
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`
                  relative group aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${draggedIndex === index 
                    ? "border-primary scale-95 opacity-50" 
                    : "border-transparent hover:border-primary/50"
                  }
                  ${index === 0 ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
              >
                <img
                  src={url}
                  alt={`Car photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Primary badge */}
                {index === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1 text-white/80 cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </div>
                </div>
                
                {/* Remove button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {/* Add more placeholder */}
            {images.length < maxImages && (
              <div
                onClick={() => document.getElementById("multi-image-input")?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors"
              >
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="h-6 w-6 mb-1" />
                  <span className="text-xs">Add more</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
