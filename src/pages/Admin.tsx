import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';

export type AdminView = 'dashboard' | 'analytics' | 'roles' | 'content' | 'images';

export default function Admin() {
  const { user, loading, canAccessAdmin } = useAuth();
  const { language } = useLanguage();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">
            {language === 'uk' ? 'Доступ заборонено' : 'Access Denied'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'uk' 
              ? 'У вас немає прав для доступу до цієї сторінки.' 
              : 'You do not have permission to access this page.'}
          </p>
          <a href="/" className="text-accent hover:underline">
            {language === 'uk' ? '← Повернутись на сайт' : '← Back to website'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto min-w-0">
          {/* Mobile header with sidebar trigger */}
          <div className="md:hidden mb-4 flex items-center justify-between">
            <h1 className="font-display text-lg font-medium">
              {language === 'uk' ? 'Панель керування' : 'Admin Panel'}
            </h1>
          </div>
          <AdminDashboard currentView={currentView} />
        </main>
      </div>
    </SidebarProvider>
  );
}
