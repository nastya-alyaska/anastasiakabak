import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminView } from '@/pages/Admin';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  FileText, 
  Image, 
  LogOut,
  Home
} from 'lucide-react';

interface AdminSidebarProps {
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
}

export function AdminSidebar({ currentView, setCurrentView }: AdminSidebarProps) {
  const { user, signOut, isAdmin } = useAuth();
  const { language } = useLanguage();

  const menuItems = [
    {
      id: 'dashboard' as AdminView,
      label: language === 'uk' ? 'Огляд' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'analytics' as AdminView,
      label: language === 'uk' ? 'Аналітика' : 'Analytics',
      icon: BarChart3,
    },
    ...(isAdmin ? [{
      id: 'roles' as AdminView,
      label: language === 'uk' ? 'Користувачі' : 'Users',
      icon: Users,
    }] : []),
    {
      id: 'content' as AdminView,
      label: language === 'uk' ? 'Контент' : 'Content',
      icon: FileText,
    },
    {
      id: 'images' as AdminView,
      label: language === 'uk' ? 'Зображення' : 'Images',
      icon: Image,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-base md:text-lg font-medium truncate group-data-[collapsible=icon]:hidden">
            {language === 'uk' ? 'Панель керування' : 'Admin Panel'}
          </h2>
          <SidebarTrigger className="shrink-0" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            {language === 'uk' ? 'Меню' : 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.id)}
                    isActive={currentView === item.id}
                    className="w-full"
                    tooltip={item.label}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 md:p-4 border-t border-border space-y-2">
        <div className="text-xs md:text-sm text-muted-foreground truncate group-data-[collapsible=icon]:hidden">
          {user?.email}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1 text-xs md:text-sm">
            <a href="/">
              <Home className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden ml-1">
                {language === 'uk' ? 'Сайт' : 'Site'}
              </span>
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={signOut} className="flex-1 text-xs md:text-sm">
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden ml-1">
              {language === 'uk' ? 'Вийти' : 'Logout'}
            </span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
