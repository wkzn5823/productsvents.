"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, Search, UserPlus, Trash2, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role_id: number;
}

const roleNames = {
  1: "Admin",
  2: "Vendedor",
  3: "Cliente",
} as const;

export default function AdminUsuarios() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    role_id: 3,
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Usamos la variable de entorno REACT_APP_API_URL configurada en Vercel
  const API_URL = `${process.env.REACT_APP_API_URL}/api/auth/get-users`;  // Correcto

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ success: boolean; users: Usuario[] }>(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUsuarios(response.data.users);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (id: number, newRole: number) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/update-role/${id}`,
        { role_id: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUsuarios(usuarios.map((user) => (user.id === id ? { ...user, role_id: newRole } : user)));
      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.nombre || !newUser.email || !newUser.contraseña) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          nombre: newUser.nombre,
          email: newUser.email,
          contraseña: newUser.contraseña,
          role_id: newUser.role_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast({
        title: "Usuario agregado",
        description: "El nuevo usuario ha sido agregado exitosamente.",
      });
      fetchUsuarios();
      setNewUser({ nombre: "", email: "", contraseña: "", role_id: 3 });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo agregar el usuario.",
        variant: "destructive",
      });
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Gestionar Usuarios</h1>
        </motion.div>

        <div className="space-y-6 max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg font-medium">Agregar Usuario</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    type="text"
                    placeholder="Nombre"
                    value={newUser.nombre}
                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Correo"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={newUser.contraseña}
                    onChange={(e) => setNewUser({ ...newUser, contraseña: e.target.value })}
                  />
                  <Select
                    value={newUser.role_id.toString()}
                    onValueChange={(value) => setNewUser({ ...newUser, role_id: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Vendedor</SelectItem>
                      <SelectItem value="3">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser} className="mt-4 w-full">
                  <UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Lista de Usuarios</CardTitle>
                <Button variant="outline" size="icon" onClick={fetchUsuarios}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Search className="text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[80px] font-medium">ID</TableHead>
                          <TableHead className="font-medium">Nombre</TableHead>
                          <TableHead className="font-medium">Email</TableHead>
                          <TableHead className="font-medium">Rol</TableHead>
                          <TableHead className="text-right font-medium">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {usuariosFiltrados.map((usuario) => (
                            <motion.tr
                              key={usuario.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-b"
                            >
                              <TableCell className="font-medium">{usuario.id}</TableCell>
                              <TableCell>{usuario.nombre}</TableCell>
                              <TableCell>{usuario.email}</TableCell>
                              <TableCell>
                                <Select
                                  value={usuario.role_id.toString()}
                                  onValueChange={(value) => handleUpdateRole(usuario.id, Number(value))}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder={roleNames[usuario.role_id as keyof typeof roleNames]} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Admin</SelectItem>
                                    <SelectItem value="2">Vendedor</SelectItem>
                                    <SelectItem value="3">Cliente</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="destructive" size="icon" onClick={() => setDeleteId(usuario.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
      <Toaster />
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Este usuario se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDeleteUser(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
