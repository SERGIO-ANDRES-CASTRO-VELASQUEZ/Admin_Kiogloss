import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { useEffect, useState } from "react";
import { apiService, Producto } from "../../utils/api";
import { useSearchParams } from "react-router-dom";
import ProductModal from "./ProductModal";

export default function ProductInventory() {
  const [tableData, setTableData] = useState<Producto[]>([]);
  const [filteredData, setFilteredData] = useState<Producto[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | undefined>(undefined);

  const handleOpenModal = (product?: Producto) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = tableData.filter((producto) =>
        producto.nombres.toLowerCase().includes(searchLower) ||
        producto.descripcion.toLowerCase().includes(searchLower) ||
        producto.categorias.some((cat) => cat.nombre?.toLowerCase().includes(searchLower))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
  }, [searchParams, tableData]);

  const handleDeleteProducto = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await apiService.products.delete(id);
        fetchData();
        alert('Producto eliminado exitosamente');
      } catch (err) {
        alert('Error al eliminar el producto');
        console.error(err);
      }
    }
  };

  const fetchData = async () => {
    try {
      const data = await apiService.products.getAll();
      setTableData(data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex justify-between items-center p-5">
            <h2 className="text-2xl font-semibold text-black dark:text-white">Inventario de Productos</h2>
            <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center gap-2.5 rounded-md bg-black py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                + Agregar Producto
            </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          {searchParams.get('search') && (
            <div className="px-5 py-3 border-b border-gray-100 dark:border-white/[0.05]">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {filteredData.length} resultado(s) para:
                <span className="font-medium text-gray-900 dark:text-white ml-1">
                  "{searchParams.get('search')}"
                </span>
                <button
                  onClick={() => setSearchParams({})}
                  className="ml-2 text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Limpiar búsqueda
                </button>
              </p>
            </div>
          )}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>ID</TableCell>
                <TableCell isHeader>Imagen</TableCell>
                <TableCell isHeader>Nombre</TableCell>
                <TableCell isHeader>Descripción</TableCell>
                <TableCell isHeader>Precio</TableCell>
                <TableCell isHeader>Stock</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Categoría</TableCell>
                <TableCell isHeader>Colores</TableCell>
                <TableCell isHeader>Variantes</TableCell>
                <TableCell isHeader>Creación</TableCell>
                <TableCell isHeader>Actualización</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="px-5 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchParams.get('search')
                        ? 'No se encontraron productos con ese criterio de búsqueda'
                        : 'No hay productos para mostrar'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.id}</TableCell>
                    <TableCell><img src={producto.imageUrl || 'https://via.placeholder.com/40'} alt="Product" className="h-10 w-10 rounded-full" /></TableCell>
                    <TableCell>{producto.nombres}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>${producto.precio.toFixed(2)}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        color={
                          producto.stock > 10 ? "success" : producto.stock > 0 ? "warning" : "error"
                        }
                      >
                        {producto.stock > 10 ? "En Stock" : producto.stock > 0 ? "Bajo Stock" : "Sin Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>{producto.categorias.map((c) => c.nombre).join(", ")}</TableCell>
                    <TableCell>{(producto.colors || []).map((c) => c.name).join(", ")}</TableCell>
                    <TableCell>{(producto.sizes || []).map((s) => s.name).join(", ")}</TableCell>
                    <TableCell>{producto.fechaCreacion}</TableCell>
                    <TableCell>{producto.fechaActualizacion}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(producto)} className="bg-green-600 text-white hover:bg-green-500 rounded-lg px-4 py-2">Editar</button>
                        <button onClick={() => handleDeleteProducto(producto.id)} className="bg-red-600 text-white hover:bg-red-500 rounded-lg px-4 py-2">Eliminar</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {isModalOpen && <ProductModal onClose={handleCloseModal} product={selectedProduct} />}
    </>
  );
}
