const API_BASE_URL = "http://localhost:8081/admin";

const apiService = {
  products: {
    getAll: async (page = 0, pageSize = 20) => {
      const response = await fetch(`${API_BASE_URL}/products?page=${page}&page_size=${pageSize}`);
      if (!response.ok) throw new Error('Error fetching products');
      return response.json();
    },
    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Error fetching product');
      return response.json();
    },
    create: async (product: any) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Error creating product');
      return response.json();
    },
    update: async (id: number, product: any) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Error updating product');
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error deleting product');
      return response;
    },
    uploadImage: async (request: { productId: number; image: string }) => {
      const response = await fetch(`${API_BASE_URL}/products/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error('Error uploading image');
      return response;
    }
  },
  tags: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) throw new Error('Error fetching tags');
      return response.json();
    },
    create: async (tag: { name: string }) => {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      });
      if (!response.ok) throw new Error('Error creating tag');
      return response.json();
    },
    update: async (id: number, tag: { name: string }) => {
      const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      });
      if (!response.ok) throw new Error('Error updating tag');
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error deleting tag');
      return response;
    }
  },
  sizes: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/sizes`);
      if (!response.ok) throw new Error('Error fetching sizes');
      return response.json();
    },
    create: async (size: { name: string }) => {
      const response = await fetch(`${API_BASE_URL}/sizes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(size)
      });
      if (!response.ok) throw new Error('Error creating size');
      return response.json();
    },
    update: async (id: number, size: { name: string }) => {
      const response = await fetch(`${API_BASE_URL}/sizes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(size)
      });
      if (!response.ok) throw new Error('Error updating size');
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/sizes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error deleting size');
      return response;
    }
  },
  colors: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/colors`);
      if (!response.ok) throw new Error('Error fetching colors');
      return response.json();
    },
    create: async (color: { name: string }) => {
      const response = await fetch(`${API_BASE_URL}/colors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(color)
      });
      if (!response.ok) throw new Error('Error creating color');
      return response.json();
    },
    update: async (id: number, color: { name: string }) => {
      const response = await fetch(`${API_BASE_URL}/colors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(color)
      });
      if (!response.ok) throw new Error('Error updating color');
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/colors/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error deleting color');
      return response;
    }
  },
  users: {
    getAll: async () => {
      // This is a placeholder. Replace with the actual endpoint when available.
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Error fetching users');
      return response.json();
    },
    updateRole: async (userId: number, role: string) => {
      // This is a placeholder. Replace with the actual endpoint when available.
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error('Error updating user role');
      return response.json();
    }
  }
};

interface Categoria {
  id: number;
  nombre?: string;
}

interface Producto {
  id?: number;
  nombres: string;
  descripcion: string;
  precio: number;
  stock: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  categorias: Categoria[];
}

export {
    apiService
};
export type {
    Producto,
    Categoria
};
