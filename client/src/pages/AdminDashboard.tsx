"use client"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, Search, Plus, Trash2 } from "lucide-react"
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

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria_id: number
  imagen_url: string
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2)
}

export default function AdminProductos() {
  const { toast } = useToast()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
    imagen_url: "",
  })

  const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

  const fetchProductos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<Producto[]>(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      setProductos(response.data)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      toast({ title: "Error", description: "Error al cargar productos.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [API_URL, toast])

  useEffect(() => {
    fetchProductos()
  }, [fetchProductos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = nuevoProducto
    const token = localStorage.getItem("accessToken")

    if (!token) {
      toast({ title: "Error", description: "No tienes permisos.", variant: "destructive" })
      return
    }

    try {
      const response = await axios.post(
        API_URL,
        {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
          categoria_id: parseInt(categoria_id),
          imagen_url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data.success) {
        toast({ title: "Producto agregado", description: "El producto fue agregado correctamente." })
        fetchProductos() // Actualiza la lista de productos
      } else {
        toast({ title: "Error", description: "No se pudo agregar el producto.", variant: "destructive" })
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as { response?: { data?: any; status?: number } }
      console.error("🚨 Error al agregar producto:", axiosError.response?.data || axiosError)

      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "No se pudo agregar el producto.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      toast({ title: "Error", description: "No tienes permisos.", variant: "destructive" })
      return
    }

    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast({ title: "Producto eliminado", description: "Se eliminó correctamente." })

        setProductos((prevProductos) => prevProductos.filter((p) => p.id !== id))
      } else {
        toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" })
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as { response?: { data?: any; status?: number } }
      console.error("🚨 Error al eliminar producto:", axiosError.response?.data || axiosError)

      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "No se pudo eliminar.",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Gestionar Productos</h1>
        </motion.div>

        <div className="space-y-6 max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg font-medium">Agregar Producto</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={nuevoProducto.nombre}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={nuevoProducto.descripcion}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    value={nuevoProducto.precio}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={nuevoProducto.stock}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    name="categoria_id"
                    placeholder="Categoría ID"
                    value={nuevoProducto.categoria_id}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria_id: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    name="imagen_url"
                    placeholder="Imagen URL"
                    value={nuevoProducto.imagen_url}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen_url: e.target.value })}
                    required
                  />
                  <Button type="submit" className="col-span-3">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                  </Button>
                </form>
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
                <CardTitle className="text-lg font-medium">Lista de Productos</CardTitle>
                <Button variant="outline" size="icon" onClick={fetchProductos}>
                  <Search className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Imagen</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {productos.map((producto) => (
                            <motion.tr
                              key={producto.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-b"
                            >
                              <TableCell>{producto.id}</TableCell>
                              <TableCell>{producto.nombre}</TableCell>
                              <TableCell>${formatPrice(producto.precio)}</TableCell>
                              <TableCell>{producto.stock}</TableCell>
                              <TableCell>{producto.categoria_id}</TableCell>
                              <TableCell>
                                <img
                                  src={producto.imagen_url || "/placeholder.svg"}
                                  alt={producto.nombre}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>
                                <Button onClick={() => setDeleteId(producto.id)} variant="destructive" size="sm">
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
              Esta acción no se puede deshacer. Este producto se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
