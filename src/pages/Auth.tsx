import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Невірний формат email'),
  password: z.string().min(6, 'Пароль повинен містити мінімум 6 символів'),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
});

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = loginSchema.parse(loginForm);
      const { error } = await signIn(validated.email, validated.password);
      
      if (error) {
        toast({
          title: language === 'uk' ? 'Помилка входу' : 'Login Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: language === 'uk' ? 'Успішний вхід' : 'Login Successful',
          description: language === 'uk' ? 'Ласкаво просимо!' : 'Welcome!',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: language === 'uk' ? 'Помилка валідації' : 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = signupSchema.parse(signupForm);
      const { error } = await signUp(validated.email, validated.password, validated.fullName);
      
      if (error) {
        let message = error.message;
        if (message.includes('already registered')) {
          message = language === 'uk' 
            ? 'Користувач з таким email вже існує' 
            : 'User with this email already exists';
        }
        toast({
          title: language === 'uk' ? 'Помилка реєстрації' : 'Signup Error',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: language === 'uk' ? 'Успішна реєстрація' : 'Signup Successful',
          description: language === 'uk' ? 'Ваш акаунт створено!' : 'Your account has been created!',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: language === 'uk' ? 'Помилка валідації' : 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">
            {language === 'uk' ? 'Особистий кабінет' : 'Personal Account'}
          </CardTitle>
          <CardDescription>
            {language === 'uk' 
              ? 'Увійдіть або зареєструйтесь для доступу до панелі керування' 
              : 'Sign in or register to access the control panel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                {language === 'uk' ? 'Вхід' : 'Login'}
              </TabsTrigger>
              <TabsTrigger value="signup">
                {language === 'uk' ? 'Реєстрація' : 'Sign Up'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="email@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">
                    {language === 'uk' ? 'Пароль' : 'Password'}
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? (language === 'uk' ? 'Завантаження...' : 'Loading...') 
                    : (language === 'uk' ? 'Увійти' : 'Sign In')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">
                    {language === 'uk' ? "Повне ім'я" : 'Full Name'}
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={language === 'uk' ? "Ваше ім'я" : 'Your name'}
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="email@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    {language === 'uk' ? 'Пароль' : 'Password'}
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">
                    {language === 'uk' ? 'Підтвердіть пароль' : 'Confirm Password'}
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? (language === 'uk' ? 'Завантаження...' : 'Loading...') 
                    : (language === 'uk' ? 'Зареєструватись' : 'Sign Up')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {language === 'uk' ? '← Повернутись на сайт' : '← Back to website'}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
