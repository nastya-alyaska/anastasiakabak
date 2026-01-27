import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  } | null;
}

export function RolesView() {
  const { language } = useLanguage();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AppRole>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch profiles for each role
      const rolesWithProfiles: UserRole[] = [];
      for (const role of rolesData || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('user_id', role.user_id)
          .maybeSingle();
        
        rolesWithProfiles.push({
          ...role,
          profiles: profile,
        });
      }

      setRoles(rolesWithProfiles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Не вдалося завантажити ролі' : 'Failed to load roles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    if (!newEmail.trim()) {
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Введіть email користувача' : 'Enter user email',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Find user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', newEmail.trim())
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: language === 'uk' ? 'Користувача не знайдено' : 'User not found',
          description: language === 'uk' 
            ? 'Користувач з таким email не зареєстрований' 
            : 'User with this email is not registered',
          variant: 'destructive',
        });
        return;
      }

      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('role', newRole)
        .maybeSingle();

      if (existingRole) {
        toast({
          title: language === 'uk' ? 'Роль вже існує' : 'Role already exists',
          description: language === 'uk' 
            ? 'У цього користувача вже є ця роль' 
            : 'This user already has this role',
          variant: 'destructive',
        });
        return;
      }

      // Add role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: profile.user_id,
          role: newRole,
        });

      if (error) throw error;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Роль успішно додано' : 'Role added successfully',
      });

      setNewEmail('');
      fetchRoles();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Не вдалося додати роль' : 'Failed to add role',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: language === 'uk' ? 'Успіх' : 'Success',
        description: language === 'uk' ? 'Роль видалено' : 'Role deleted',
      });

      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: language === 'uk' ? 'Помилка' : 'Error',
        description: language === 'uk' ? 'Не вдалося видалити роль' : 'Failed to delete role',
        variant: 'destructive',
      });
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return language === 'uk' ? 'Адміністратор' : 'Administrator';
      case 'psychologist':
        return language === 'uk' ? 'Психолог' : 'Psychologist';
      case 'user':
        return language === 'uk' ? 'Користувач' : 'User';
    }
  };

  const getRoleBadgeClass = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'psychologist':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-medium text-foreground">
          {language === 'uk' ? 'Управління ролями' : 'Role Management'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'uk' 
            ? 'Призначайте ролі користувачам системи' 
            : 'Assign roles to system users'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {language === 'uk' ? 'Додати роль' : 'Add Role'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48 space-y-2">
              <Label>{language === 'uk' ? 'Роль' : 'Role'}</Label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    {language === 'uk' ? 'Адміністратор' : 'Administrator'}
                  </SelectItem>
                  <SelectItem value="psychologist">
                    {language === 'uk' ? 'Психолог' : 'Psychologist'}
                  </SelectItem>
                  <SelectItem value="user">
                    {language === 'uk' ? 'Користувач' : 'User'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addRole} disabled={isSubmitting}>
                {isSubmitting 
                  ? (language === 'uk' ? 'Додавання...' : 'Adding...') 
                  : (language === 'uk' ? 'Додати' : 'Add')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'uk' ? 'Існуючі ролі' : 'Existing Roles'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : roles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'uk' ? 'Немає призначених ролей' : 'No roles assigned yet'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>{language === 'uk' ? "Ім'я" : 'Name'}</TableHead>
                  <TableHead>{language === 'uk' ? 'Роль' : 'Role'}</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.profiles?.email || '-'}</TableCell>
                    <TableCell>{role.profiles?.full_name || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(role.role)}`}>
                        {getRoleLabel(role.role)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRole(role.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
