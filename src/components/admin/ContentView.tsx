import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Save, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  content_uk: string;
  content_en: string;
  content_type: string;
  updated_at: string;
}

export function ContentView() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ content_uk: '', content_en: '' });
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ key: '', content_uk: '', content_en: '' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key');

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditForm({ content_uk: item.content_uk, content_en: item.content_en });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ content_uk: '', content_en: '' });
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          content_uk: editForm.content_uk,
          content_en: editForm.content_en,
          updated_by: user?.id,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Контент оновлено' : 'Content updated',
      });

      cancelEdit();
      fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Не вдалося оновити контент' : 'Failed to update content',
        variant: 'destructive',
      });
    }
  };

  const addContent = async () => {
    if (!newForm.key.trim()) {
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Введіть ключ контенту' : 'Enter content key',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('site_content')
        .insert({
          key: newForm.key.trim(),
          content_uk: newForm.content_uk,
          content_en: newForm.content_en,
          updated_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Контент додано' : 'Content added',
      });

      setShowNew(false);
      setNewForm({ key: '', content_uk: '', content_en: '' });
      fetchContent();
    } catch (error) {
      console.error('Error adding content:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Не вдалося додати контент' : 'Failed to add content',
        variant: 'destructive',
      });
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm(language === 'uk' ? 'Видалити цей контент?' : 'Delete this content?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Контент видалено' : 'Content deleted',
      });

      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Не вдалося видалити контент' : 'Failed to delete content',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground">
            {language === 'uk' ? 'Редагування контенту' : 'Content Editor'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'uk' 
              ? 'Редагуйте тексти вашого сайту' 
              : 'Edit your website texts'}
          </p>
        </div>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="w-4 h-4 mr-2" />
          {language === 'uk' ? 'Додати' : 'Add'}
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'uk' ? 'Новий контент' : 'New Content'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'uk' ? 'Ключ (унікальний ідентифікатор)' : 'Key (unique identifier)'}</Label>
              <Input
                placeholder="hero.slogan"
                value={newForm.key}
                onChange={(e) => setNewForm({ ...newForm, key: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Українською</Label>
                <Textarea
                  rows={4}
                  value={newForm.content_uk}
                  onChange={(e) => setNewForm({ ...newForm, content_uk: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>English</Label>
                <Textarea
                  rows={4}
                  value={newForm.content_en}
                  onChange={(e) => setNewForm({ ...newForm, content_en: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addContent}>
                {language === 'uk' ? 'Зберегти' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setShowNew(false)}>
                {language === 'uk' ? 'Скасувати' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : content.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {language === 'uk' 
              ? 'Контент ще не додано. Натисніть "Додати" для створення.' 
              : 'No content added yet. Click "Add" to create.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-mono">{item.key}</CardTitle>
                  <div className="flex gap-2">
                    {editingId !== item.id && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                          {language === 'uk' ? 'Редагувати' : 'Edit'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteContent(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Українською</Label>
                        <Textarea
                          rows={4}
                          value={editForm.content_uk}
                          onChange={(e) => setEditForm({ ...editForm, content_uk: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>English</Label>
                        <Textarea
                          rows={4}
                          value={editForm.content_en}
                          onChange={(e) => setEditForm({ ...editForm, content_en: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveEdit(item.id)}>
                        <Save className="w-4 h-4 mr-2" />
                        {language === 'uk' ? 'Зберегти' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        {language === 'uk' ? 'Скасувати' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">UA:</span>
                      <p className="mt-1">{item.content_uk}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">EN:</span>
                      <p className="mt-1">{item.content_en}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
