
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import MultiSelect from "../../components/form/MultiSelect";
import { FC, useEffect, useState } from "react";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { apiService, Categoria, Producto } from "../../utils/api";
import { useLocation } from "react-router";
interface Option {
    value: string;
    text: string;
    selected:string
}

interface ProductModalProps {
  onClose: () => void;
  product?: Producto;
}

const ProductModal: FC<ProductModalProps> = ({ onClose, product: productProp }) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const location = useLocation();
    const productoFromState = productProp || location.state?.producto as Producto | undefined;
    const [nombre, setNombre] = useState<string>("");
    const [descripción, setDescripcion] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");
    const [stock, setStock] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    useEffect(()=>{
        console.log("Producto recibido en CrearProducto:", productoFromState);
        if(productoFromState){
            setNombre(productoFromState.nombres);
            setDescripcion(productoFromState.descripcion);
            setPrecio(productoFromState.precio.toString());
            setStock(productoFromState.stock.toString());
            const selectedCats = productoFromState.categorias.map(categoria => categoria.id.toString());
            console.log(selectedCats);

            setSelectedValues(selectedCats);
        }
        loadTags()
    },[productoFromState])

    const handleProducto = async () => {
        try {
            let tags = Array.from(selectedValues)
            .map(id => ({ id: Number(id) }));

            const productData = {
                name: nombre,
                description: descripción,
                price: Number(precio),
                stock: Number(stock),
                tags: tags
            };

            let productResponse;
            if(productoFromState && productoFromState.id){
                productResponse = await apiService.products.update(productoFromState.id, productData);
                alert("Producto Actualizado");
            } else {
                productResponse = await apiService.products.create(productData);
                alert("Producto Creado");
            }

            if (image && productResponse) {
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onloadend = async () => {
                    const base64Image = reader.result as string;
                    await apiService.products.uploadImage({ productId: productResponse.id, image: base64Image });
                };
            }

            onClose();

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const loadTags = async () => {
        try {
            const tags = await apiService.tags.getAll();
            setOptions(tags.map((tag:Categoria)=> {
                return { value: `${tag.id}`, text: tag.nombre, selected: false }
            }))
        } catch (error) {
            console.error("Error loading tags:", error);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-boxdark p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">{productoFromState ? 'Editar Producto' : 'Crear Producto'}</h2>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="nombre">Nombre del Producto</Label>
                        <Input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                    </div>
                    <div>
                        <MultiSelect
                            label="Seleccionar Categorías"
                            options={options}

                            value={selectedValues}
                            onChange={(values) => setSelectedValues(values)}
                        />
                        <p className="sr-only">
                            Valores Seleccionados: {selectedValues.join(", ")}
                        </p>
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <TextArea
                            value={descripción}
                            placeholder="Ingresa el Mensaje"
                            onChange={(value) => setDescripcion(value)}
                            rows={6}
                        />
                    </div>
                    {/** Comentario */}
                    <div>
                        <Label htmlFor="precio">Precio (COP)</Label>
                        <Input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)}/>
                    </div>
                    <div>
                        <Label htmlFor="stock">Stock Disponible</Label>
                        <Input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)}/>
                    </div>
                    <div>
                        <Label htmlFor="image">Imagen del Producto</Label>
                        <Input type="file" id="image" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}/>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button onClick={onClose} className="w-full" size="sm">
                            Cancelar
                        </Button>
                        <Button onClick={() => handleProducto()} className="w-full" size="sm">
                            {productoFromState ? 'Actualizar Producto' : 'Crear Producto'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductModal;