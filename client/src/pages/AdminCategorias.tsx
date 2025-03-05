"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, Search, Plus, Trash2, RefreshCw, Edit, Save } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Categoria {
  id: number
  nombre: string
}

export default function AdminCategorias() {
  const { toast } = useToast()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [newCategoria, setNewCategoria] = useState("")
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const API_URL = "http://localhost:8000/api/categorias"

  useEffect(() => {
    fetchCategorias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCategorias = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({
          title: "Error",
          description: "No tienes permisos para ver categorías.",
          variant: "destructive",
        })
        return
      }

      const response = await axios.get<Categoria[]>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategorias(response.data)
    } catch (err) {
      toast({
        title: "Error",
        description: "Error al cargar categorías.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategoria = async () => {
    if (!newCategoria.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      toast({
        title: "Error",
        description: "No tienes permisos para agregar categorías. Inicia sesión nuevamente.",
        variant: "destructive",
      })
      return
    }

    try {
      await axios.post(
        API_URL,
        { nombre: newCategoria },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      toast({
        title: "Éxito",
        description: "Categoría agregada exitosamente.",
      })
      fetchCategorias()
      setNewCategoria("")
    } catch (err) {
      console.error("Error al agregar categoría:", err)
      toast({
        title: "Error",
        description: "Error al agregar categoría. Inténtalo nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditCategoria = async () => {
    if (!editCategoria || !editCategoria.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío.",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({
          title: "Error",
          description: "No tienes permisos para actualizar categorías.",
          variant: "destructive",
        })
        return
      }

      await axios.put(
        `${API_URL}/${editCategoria.id}`,
        { nombre: editCategoria.nombre },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      toast({
        title: "Éxito",
        description: "Categoría actualizada exitosamente.",
      })
      fetchCategorias()
      setEditCategoria(null)
    } catch (err) {
      console.error("Error al actualizar categoría:", err)
      toast({
        title: "Error",
        description: "Error al actualizar categoría. Inténtalo nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategoria = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({
          title: "Error",
          description: "No tienes permisos para eliminar categorías.",
          variant: "destructive",
        })
        return
      }

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast({
        title: "Éxito",
        description: "Categoría eliminada exitosamente.",
      })
      fetchCategorias()
      setDeleteId(null)
    } catch (err) {
      console.error("Error al eliminar categoría:", err)
      toast({
        title: "Error",
        description: "Error al eliminar categoría. Inténtalo nuevamente.",
        variant: "destructive",
      })
    }
  }

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Gestionar Categorías</h1>
        </motion.div>

        <div className="space-y-6 max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg font-medium">Agregar Categoría</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Nueva Categoría"
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                  />
                  <Button onClick={handleAddCategoria}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar
                  </Button>
                </div>
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
                <CardTitle className="text-lg font-medium">Lista de Categorías</CardTitle>
                <Button variant="outline" size="icon" onClick={fetchCategorias}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Search className="text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar categoría..."
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
                          <TableHead className="text-right font-medium">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {categoriasFiltradas.map((categoria) => (
                            <motion.tr
                              key={categoria.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-b"
                            >
                              <TableCell className="font-medium">{categoria.id}</TableCell>
                              <TableCell>
                                {editCategoria && editCategoria.id === categoria.id ? (
                                  <Input
                                    type="text"
                                    value={editCategoria.nombre}
                                    onChange={(e) => setEditCategoria({ ...editCategoria, nombre: e.target.value })}
                                  />
                                ) : (
                                  categoria.nombre
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {editCategoria && editCategoria.id === categoria.id ? (
                                  <Button onClick={handleEditCategoria} variant="outline" size="sm">
                                    <Save className="h-4 w-4 mr-2" /> Guardar
                                  </Button>
                                ) : (
                                  <Button onClick={() => setEditCategoria(categoria)} variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" /> Editar
                                  </Button>
                                )}
                                <Button
                                  onClick={() => setDeleteId(categoria.id)}
                                  variant="destructive"
                                  size="sm"
                                  className="ml-2"
                                >
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
              Esta acción no se puede deshacer. Esta categoría se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDeleteCategoria(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

