import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { ChevronLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import CloudinaryUpload from '../../components/admin/CloudinaryUpload';

const CATEGORIES = [
    "Suits", "Sarees", "Dresses", "Lehenga Sets", "Kurtas", "Bridals"
];

const FABRICS = [
    "Cotton", "Silk", "Georgette", "Chanderi", "Rayon", "Velvet", "Crepe", "Linen", "Muslin"
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];

const ProductEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [uploadConfig, setUploadConfig] = useState({
        cloudName: localStorage.getItem('cloudinary_cloud_name') || '',
        uploadPreset: localStorage.getItem('cloudinary_preset') || ''
    });

    const { register, control, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            name: '',
            price: '',
            sale_price: '',
            category_name: 'Suits',
            fabric: 'Cotton',
            variants: [
                {
                    color: '',
                    images: [],
                    sizes: SIZES.map(s => ({ size: s, stock_qty: 0, sku: '' }))
                }
            ]
        }
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await api.getProduct(id);
            if (response.ok) {
                const product = await response.json();

                // Transform for form
                const formData = {
                    ...product,
                    price: product.price,
                    sale_price: product.sale_price,
                    category_name: product.category_name || 'Suits',
                    variants: product.variants.map(v => ({
                        ...v,
                        // Ensure all sizes exist for grid editing
                        sizes: SIZES.map(s => {
                            const existing = v.sizes.find(vs => vs.size === s);
                            return existing || { size: s, stock_qty: 0, sku: '' };
                        })
                    }))
                };
                reset(formData);
            }
        } catch (error) {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Clean up data
            const payload = {
                ...data,
                price: parseFloat(data.price),
                sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
                // Filter out zero stock sizes -> Actually keep them but maybe with 0 stock
                variants: data.variants.map(v => ({
                    ...v,
                    sizes: v.sizes.filter(s => s.stock_qty > 0 || isEditMode).map(s => ({
                        ...s,
                        stock_qty: parseInt(s.stock_qty) || 0,
                        sku: s.sku || `${data.name.substring(0, 3).toUpperCase()}-${v.color.substring(0, 2).toUpperCase()}-${s.size}`
                    }))
                }))
            };

            // Ensure at least one category
            const catRes = await api.getCategories();
            if (catRes.ok) {
                const cats = await catRes.json();
                const selectedCat = cats.find(c => c.name === data.category_name);
                if (selectedCat) payload.category_id = selectedCat.id;
            }

            let response;
            if (isEditMode) {
                response = await api.updateProduct(id, payload);
            } else {
                response = await api.createProduct(payload);
            }

            if (response.ok) {
                toast.success(isEditMode ? 'Product updated' : 'Product created');
                navigate('/admin');
            } else {
                throw new Error('Operation failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = () => {
        localStorage.setItem('cloudinary_cloud_name', uploadConfig.cloudName);
        localStorage.setItem('cloudinary_preset', uploadConfig.uploadPreset);
        toast.success('Configuration saved');
    };

    if (loading && isEditMode) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft />
                </button>
                <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                            <h2 className="text-lg font-semibold">Basic Details</h2>

                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Product Name</label>
                                    <input
                                        {...register("name", { required: "Name is required" })}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="e.g. Red Cotton Saree"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select {...register("category_name")} className="w-full p-2 border rounded-md">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Fabric</label>
                                        <select {...register("fabric")} className="w-full p-2 border rounded-md">
                                            {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            {...register("price", { required: true })}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Sale Price (Optional)</label>
                                        <input
                                            type="number"
                                            {...register("sale_price")}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        {...register("description")}
                                        rows={4}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Colors & Inventory</h2>
                                <button
                                    type="button"
                                    onClick={() => appendVariant({ color: '', images: [], sizes: SIZES.map(s => ({ size: s, stock_qty: 0 })) })}
                                    className="flex items-center gap-2 text-sm text-pink-600 font-medium hover:text-pink-700"
                                >
                                    <Plus size={16} /> Add Color Variant
                                </button>
                            </div>

                            {variantFields.map((field, index) => (
                                <div key={field.id} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-1/3">
                                            <label className="block text-sm font-medium mb-1">Color Name</label>
                                            <input
                                                {...register(`variants.${index}.color`, { required: true })}
                                                className="w-full p-2 border rounded-md"
                                                placeholder="e.g. Red"
                                            />
                                        </div>
                                        {variantFields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-red-500 hover:text-red-600 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Images</label>
                                        <Controller
                                            control={control}
                                            name={`variants.${index}.images`}
                                            render={({ field: { onChange, value } }) => (
                                                <CloudinaryUpload
                                                    cloudName={uploadConfig.cloudName}
                                                    uploadPreset={uploadConfig.uploadPreset}
                                                    images={value || []}
                                                    onUpload={(urls) => onChange([...(value || []), ...urls])}
                                                    onRemove={(i) => onChange(value.filter((_, idx) => idx !== i))}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Stock Grid */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Stock by Size</label>
                                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                            {SIZES.map((size, sIndex) => {
                                                // Find the index of this size in the field array
                                                // Since we initialized with all sizes, the index should match usually, 
                                                // but to be safe we rely on the order we initialized.

                                                return (
                                                    <div key={size} className="text-center">
                                                        <label className="block text-xs text-gray-500 mb-1">{size}</label>
                                                        <input
                                                            type="number"
                                                            {...register(`variants.${index}.sizes.${sIndex}.stock_qty`)}
                                                            className="w-full p-1 border rounded text-center text-sm"
                                                            min="0"
                                                        />
                                                        {/* Hidden input for size label */}
                                                        <input type="hidden" {...register(`variants.${index}.sizes.${sIndex}.size`)} value={size} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                Save Product
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Config */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border text-sm">
                        <h3 className="font-semibold mb-4 text-gray-900 border-b pb-2">Cloudinary Setup</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-xs">
                                To enable image uploads, enter your free Cloudinary credentials.
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Cloud Name</label>
                                <input
                                    value={uploadConfig.cloudName}
                                    onChange={(e) => setUploadConfig(c => ({ ...c, cloudName: e.target.value }))}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Upload Preset (Unsigned)</label>
                                <input
                                    value={uploadConfig.uploadPreset}
                                    onChange={(e) => setUploadConfig(c => ({ ...c, uploadPreset: e.target.value }))}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <button
                                onClick={saveConfig}
                                className="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductEditor;
