import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Eye, EyeOff } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { loginUser, registerUser } from "@/lib/api";

const AuthComponent = () => {
  const { isLoggedIn, login, logout, userEmail } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginFieldErrors, setLoginFieldErrors] = useState<{[key:string]: string}>({});
  const [registerFieldErrors, setRegisterFieldErrors] = useState<{[key:string]: string}>({});
  
  // Estados para mostrar/ocultar contraseñas
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginFieldErrors({});
    setLoginLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('travelToken', data.token);
      login(email);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message);
      if (err && err.response && err.response.errors) {
        const fieldErrs: {[key:string]: string} = {};
        err.response.errors.forEach((e: any) => {
          fieldErrs[e.param] = e.msg;
        });
        setLoginFieldErrors(fieldErrs);
      } else if (err && err.errors) {
        // If error is a plain object
        const fieldErrs: {[key:string]: string} = {};
        err.errors.forEach((e: any) => {
          fieldErrs[e.param] = e.msg;
        });
        setLoginFieldErrors(fieldErrs);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterFieldErrors({});
    setRegisterLoading(true);
    try {
      const data = await registerUser(registerEmail, registerPassword, registerName);
      localStorage.setItem('travelToken', data.token);
      login(registerEmail);
      setIsOpen(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirm('');
      setRegisterName('');
    } catch (err: any) {
      setRegisterError(err.message);
      if (err && err.response && err.response.errors) {
        const fieldErrs: {[key:string]: string} = {};
        err.response.errors.forEach((e: any) => {
          fieldErrs[e.param] = e.msg;
        });
        setRegisterFieldErrors(fieldErrs);
      } else if (err && err.errors) {
        const fieldErrs: {[key:string]: string} = {};
        err.errors.forEach((e: any) => {
          fieldErrs[e.param] = e.msg;
        });
        setRegisterFieldErrors(fieldErrs);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Hola, {userEmail}</span>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <User className="h-4 w-4 mr-2" />
          Iniciar Sesión / Registrarse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <DialogHeader>
              <DialogTitle>Iniciar Sesión</DialogTitle>
              <DialogDescription>
                Ingresa tus credenciales para acceder a tu cuenta y carrito.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
                {loginFieldErrors.email && <div className="text-red-500 text-xs">{loginFieldErrors.email}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showLoginPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {loginFieldErrors.password && <div className="text-red-500 text-xs">{loginFieldErrors.password}</div>}
              </div>
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? <span className="animate-spin mr-2">⏳</span> : null}
                Iniciar Sesión
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <DialogHeader>
              <DialogTitle>Registrarse</DialogTitle>
              <DialogDescription>
                Crea una cuenta para guardar tu carrito y tus compras.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="registerName">Nombre</Label>
                <Input
                  id="registerName"
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
                {registerFieldErrors.name && <div className="text-red-500 text-xs">{registerFieldErrors.name}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Correo Electrónico</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
                {registerFieldErrors.email && <div className="text-red-500 text-xs">{registerFieldErrors.email}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="registerPassword"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {registerFieldErrors.password && <div className="text-red-500 text-xs">{registerFieldErrors.password}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerConfirm">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="registerConfirm"
                    type={showRegisterConfirm ? "text" : "password"}
                    value={registerConfirm}
                    onChange={(e) => setRegisterConfirm(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                  >
                    {showRegisterConfirm ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              {registerError && <div className="text-red-500 text-sm">{registerError}</div>}
              <Button type="submit" className="w-full" disabled={registerLoading || registerPassword !== registerConfirm}>
                {registerLoading ? <span className="animate-spin mr-2">⏳</span> : null}
                Registrarse
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthComponent;
