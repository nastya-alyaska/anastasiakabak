import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface SiteImage {
  id: string;
  key: string;
  image_url: string;
  alt_text_uk: string | null;
  alt_text_en: string | null;
  updated_at: string;
}

export function ImagesView() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('key');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !newKey.trim()) {
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' 
          ? 'Виберіть файл та введіть ключ' 
          : 'Select a file and enter a key',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${newKey.trim().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('site_images')
        .insert({
          key: newKey.trim(),
          image_url: urlData.publicUrl,
          updated_by: user?.id,
        });

      if (dbError) throw dbError;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Зображення завантажено' : 'Image uploaded',
      });

      setNewKey('');
      setSelectedFile(null);
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' 
          ? 'Не вдалося завантажити зображення' 
          : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (image: SiteImage) => {
    if (!confirm(language === 'uk' ? 'Видалити це зображення?' : 'Delete this image?')) {
      return;
    }

    try {
      // Extract filename from URL
      const urlParts = image.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage.from('site-images').remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from('site_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Зображення видалено' : 'Image deleted',
      });

      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' 
          ? 'Не вдалося видалити зображення' 
          : 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-medium text-foreground">
          {language === 'uk' ? 'Управління зображеннями' : 'Image Management'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'uk' 
            ? 'Завантажуйте та керуйте зображеннями сайту' 
            : 'Upload and manage website images'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {language === 'uk' ? 'Завантажити зображення' : 'Upload Image'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'uk' ? 'Ключ (наприклад: hero-background)' : 'Key (e.g., hero-background)'}</Label>
              <Input
                placeholder="hero-background"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'uk' ? 'Файл зображення' : 'Image File'}</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <Button onClick={uploadImage} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading 
              ? (language === 'uk' ? 'Завантаження...' : 'Uploading...') 
              : (language === 'uk' ? 'Завантажити' : 'Upload')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {language === 'uk' ? 'Завантажені зображення' : 'Uploaded Images'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'uk' 
                ? 'Зображення ще не завантажено' 
                : 'No images uploaded yet'}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden group">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src={image.image_url}
                      alt={image.alt_text_uk || image.key}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteImage(image)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="font-mono text-sm font-medium truncate">{image.key}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {image.image_url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
