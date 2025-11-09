import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import { Producto, apiService } from '../../utils/api';

const ProductInventory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | undefined>(undefined);
  const [products, setProducts] = useState<Producto[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await apiService.products.getAll();
      setProducts(response.content);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Producto) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.products.delete(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-white">Inventario de Productos</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Administra todos los productos de tu catálogo</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-black py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + Agregar Producto
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                  Imagen
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  Producto
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Categoría
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Precio
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Stock
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Estado
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <img src={'https://via.placeholder.com/40'} alt="Product" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">{product.nombres}</h5>
                    <p className="text-sm">{product.descripcion}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{product.categorias.map(c => c.nombre).join(', ')}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">${product.precio.toFixed(2)}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{product.stock}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        product.stock > 10
                          ? 'bg-success text-success'
                          : product.stock > 0
                          ? 'bg-warning text-warning'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock bajo' : 'Sin stock'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button onClick={() => handleOpenModal(product as any)} className="hover:text-primary">
                        {/* Edit Icon */}
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5 0.75C13.2188 0.75 12.9375 0.867188 12.7266 1.07812L2.85938 10.9453C2.71875 11.0859 2.625 11.2594 2.57812 11.4531L2.01562 14.9344C1.96875 15.2812 2.07187 15.6281 2.32031 15.8766C2.56875 16.125 2.91562 16.2281 3.2625 16.1812L6.74375 15.6187C6.9375 15.5719 7.11094 15.4781 7.25156 15.3375L17.1187 5.47031C17.5312 5.05781 17.5312 4.40156 17.1187 3.98906L14.2109 1.08125C13.9906 0.860938 13.7531 0.75 13.5 0.75ZM13.5 2.0625L15.4375 4.00938L14.4844 4.9625L12.5469 3.01562L13.5 2.0625ZM11.6094 3.95312L13.5562 5.89062L5.42812 14.0187L3.73125 14.4656L3.28438 12.7687L11.6094 3.95312Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="hover:text-primary">
                        {/* Delete Icon */}
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7531 2.86875H11.5875V2.30625C11.5875 1.45312 10.8844 0.75 10.0312 0.75H8.21875C7.36562 0.75 6.6625 1.45312 6.6625 2.30625V2.86875H4.5C4.05 2.86875 3.65625 3.2625 3.65625 3.7125C3.65625 4.1625 4.05 4.55625 4.5 4.55625H13.7531C14.2031 4.55625 14.5969 4.1625 14.5969 3.7125C14.5969 3.2625 14.2031 2.86875 13.7531 2.86875ZM8.21875 2.30625H10.0312V2.86875H8.21875V2.30625ZM12.9187 5.4H5.33125L5.72812 14.5688C5.775 15.6656 6.675 16.5 7.77187 16.5H10.4781C11.575 16.5 12.475 15.6656 12.5219 14.5688L12.9187 5.4Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <ProductModal onClose={handleCloseModal} product={selectedProduct} />}
    </>
  );
};

export default ProductInventory;
