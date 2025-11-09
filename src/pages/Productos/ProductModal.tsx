import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import MultiSelect from "../../components/form/MultiSelect";
import { FC, useEffect, useState } from "react";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { apiService, Categoria, Producto } from "../../utils/api";

interface Option {
    value: string;
    text: string;
}

interface ProductModalProps {
  onClose: () => void;
  product?: Producto;
}

const ProductModal: FC<ProductModalProps> = ({ onClose, product: productProp }) => {
    const [tags, setTags] = useState<Option[]>([]);
    const [colors, setColors] = useState<Option[]>([]);
    const [variants, setVariants] = useState<Option[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
    const [nombre, setNombre] = useState<string>("");
    const [descripción, setDescripcion] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");
    const [stock, setStock] = useState<string>("");

    useEffect(() => {
        if (productProp) {
            setNombre(productProp.nombres);
            setDescripcion(productProp.descripcion);
            setPrecio(productProp.precio.toString());
            setStock(productProp.stock.toString());
            setSelectedTags(productProp.categorias.map(c => c.id.toString()));
            // Assuming productProp has colors and variants
            // setSelectedColors(productProp.colors.map(c => c.id.toString()));
            // setSelectedVariants(productProp.variants.map(v => v.id.toString()));
        }
        loadInitialData();
    }, [productProp]);

    const loadInitialData = async () => {
        try {
            const [tagsData, colorsData, variantsData] = await Promise.all([
                apiService.tags.getAll(),
                apiService.colors.getAll(),
                apiService.sizes.getAll(),
            ]);
            setTags(tagsData.map((t: any) => ({ value: t.id.toString(), text: t.name })));
            setColors(colorsData.map((c: any) => ({ value: c.id.toString(), text: c.name })));
            setVariants(variantsData.map((v: any) => ({ value: v.id.toString(), text: v.name })));
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
    };

    const handleProducto = async () => {
        try {
            const payload = {
                name: nombre,
                description: descripción,
                price: Number(precio),
                stock: Number(stock),
                tags: selectedTags.map(id => ({ id: Number(id) })),
                colors: selectedColors.map(id => ({ id: Number(id) })),
                sizes: selectedVariants.map(id => ({ id: Number(id) })),
            };
            if (productProp) {
                await apiService.products.update(productProp.id, payload);
                alert("Producto Actualizado");
            } else {
                await apiService.products.create(payload);
                alert("Producto Creado");
            }
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-boxdark p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">{productProp ? 'Editar Producto' : 'Crear Producto'}</h2>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="nombre">Nombre del Producto</Label>
                        <Input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                    </div>
                    <div>
                        <MultiSelect label="Seleccionar Categorías" options={tags} value={selectedTags} onChange={setSelectedTags} />
                    </div>
                    <div>
                        <MultiSelect label="Seleccionar Colores" options={colors} value={selectedColors} onChange={setSelectedColors} />
                    </div>
                    <div>
                        <MultiSelect label="Seleccionar Variantes" options={variants} value={selectedVariants} onChange={setSelectedVariants} />
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <TextArea value={descripción} placeholder="Ingresa el Mensaje" onChange={setDescripcion} rows={6} />
                    </div>
                    <div>
                        <Label htmlFor="precio">Precio (COP)</Label>
                        <Input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)}/>
                    </div>
                    <div>
                        <Label htmlFor="stock">Stock Disponible</Label>
                        <Input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)}/>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleProducto}>{productProp ? 'Actualizar Producto' : 'Crear Producto'}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductModal;
