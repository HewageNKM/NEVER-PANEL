'use client';
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {accessoriesSizesList, shoeSizesList} from "@/constant";
import {setItem, setSelectedVariant, setShowEditingForm} from "@/lib/itemDetailsSlice/itemDetailsSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import {Img, Item, Size, Variant} from "@/interfaces";
import Image from "next/image";
import {IoCloudUpload, IoPencil, IoTrashBin} from "react-icons/io5";
import {generateId} from "@/utils/Generate";
import {deleteAFile, updateAItem, uploadAFile} from "@/actions/inventoryActions";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {useSnackbar} from "@/contexts/SnackBarContext";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const VariantFormDialog = () => {
    const {item, showEditingForm, selectedVariant} = useAppSelector(state => state.itemDetailsSlice);
    const dispatch = useAppDispatch();
    const {showNotification} = useSnackbar();
    const [isLoading, setIsLoading] = useState(false)

    const [sizes, setSizes] = useState<Size[]>([] as Size[]);
    const [images, setImages] = useState([] as Img[])
    const [deletePendingImages, setDeletePendingImages] = useState<string[]>([])

    const [selectedSize, setSelectedSize] = useState<string>("none");
    const [stock, setStock] = useState(0)

    const [newImages, setNewImages] = useState<File[] | null>([] as File[]);

    const handleAddSize = () => {
        if (selectedSize === "none") {
            return;
        }

        const existSize = sizes.filter(size => size.size === selectedSize)[0];
        if (existSize) {
            const updatedSizes = sizes.map(size => size.size === selectedSize ? {...size, stock} : size);
            setSizes(updatedSizes);
        } else {
            setSizes([...sizes, {size: selectedSize, stock}]);
        }
        setSelectedSize("none");
        setStock(0);
    };

    useEffect(() => {
        if (selectedVariant) {
            setSizes(selectedVariant.sizes);
            setImages(selectedVariant.images)
        }
    }, [selectedVariant])


    const handleRemoveSize = (sizeToRemove: string) => {
        setSizes(sizes.filter(size => size.size !== sizeToRemove));
    };


    const onSubmit = async (evt) => {
        try {
            if (!item) {
                new Error("Item not found")
            }

            setIsLoading(true)
            evt.preventDefault();

            const name = evt.target.variantName.value;

            const id = generateId("variant", "");

            //if newImages exist, upload them
            const uploadedImages = [] as Img[];
            if (newImages?.length > 0) {
                for (const image of newImages) {
                    const uploadedImage = await uploadAFile(image, `inventory/${item?.itemId}/${selectedVariant?.variantId || id}`);
                    uploadedImages.push(uploadedImage);
                }
            }

            for (const image of deletePendingImages){
                await deleteAFile(`inventory/${item?.itemId}/${selectedVariant?.variantId}/${image}`);
            }

            if (selectedVariant) {
                const updatedImages = [...images, ...uploadedImages];
                const updatedVariant: Variant = {
                    variantId: selectedVariant?.variantId,
                    variantName: name.toLowerCase(),
                    images: updatedImages,
                    sizes: sizes
                }
                const updatedItem: Item = {
                    ...item,
                    variants: item.variants.map(variant => variant.variantId === selectedVariant.variantId ? updatedVariant : variant)
                }
                await updateAItem(updatedItem)
                dispatch(setItem(updatedItem));
                evt.target.reset();
                clear();
                showNotification("Variant updated successfully", "success")
            } else {

                if (newImages?.length === 0 || !newImages) {
                    throw new Error("Please add at least one  image")
                }

                const newVariant: Variant = {
                    variantId: id,
                    variantName: name.toLowerCase(),
                    images: uploadedImages,
                    sizes: sizes
                }
                const updatedItem: Item = {
                    ...item,
                    variants: [
                        ...item.variants, newVariant]
                }

                await updateAItem(updatedItem)
                dispatch(setItem(updatedItem));
                evt.target.reset();
                clear();
                showNotification("Variant added successfully", "success")
            }
        } catch (e) {
            console.error(e)
            showNotification(e.message, "error")
        } finally {
            setIsLoading(false)
        }
    };
    const addNewImage = (e) => {
        try {
            if (e.target.files.length === 0) {
                return
            }
            // validate 4mb size each file and remove if it exceeds
            const files = Array.from(e.target.files).filter(file => file.size <= 4194304)
            setNewImages(prevState => [...prevState, ...files])
        } catch (e) {
            showNotification(e.message, "error")
            console.error(e)
        }
    }
    const clear = () => {
        dispatch(setShowEditingForm(false));
        dispatch(setSelectedVariant(null));
        setSizes([] as Size[]);
        setImages([] as Img[]);
        setNewImages([] as File[]);
        setDeletePendingImages([])
        setSelectedSize("none");
        setStock(0);
    }

    const deleteUploadImage = async (name: string) => {
        try {
            setImages(prevState => prevState.filter(image => image.file !== name))
            setDeletePendingImages(prevState => [...prevState, name])
        } catch (e) {
            console.error(e)
            showNotification(e.message, "error")
        }
    }

    return (
        <Dialog open={showEditingForm} onClose={() => dispatch(setShowEditingForm(false))}>
            <DialogTitle>Add/Edit Variant</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <Stack spacing={3} mt={2}>
                        <Stack>
                            <Typography variant="h6" gutterBottom>
                                Images
                            </Typography>
                            <Box
                                sx={{
                                    maxWidth: '100%', // Ensure it adapts to the parent container width
                                    overflowX: 'auto', // Enables horizontal scrolling
                                    display: 'flex', // Use flex layout for horizontal alignment
                                    flexWrap: 'nowrap', // Prevent wrapping of children
                                    mt: 0.5,
                                    p: 1,
                                }}
                            >
                                {images.map((image, index) => (
                                    <Stack
                                        key={`image-${index}`}
                                        direction="column"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{minWidth: 120, mr: 2}} // Ensure a consistent width for each item
                                    >
                                        <Image src={image.url} alt={image.file} width={100} height={100}/>
                                        <Button color={"error"} onClick={() => deleteUploadImage(image.file)}>
                                            <IoTrashBin/>
                                        </Button>
                                    </Stack>
                                ))}
                                {newImages?.map((image, index) => (
                                    <Stack
                                        key={`newImage-${index}`}
                                        direction="column"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{minWidth: 120, mr: 2}}
                                    >
                                        <Image src={URL.createObjectURL(image)} alt={image.name} width={100}
                                               height={100}/>
                                        <Button color={"error"} onClick={() => {
                                            setNewImages(prevState => prevState.filter((_, i) => i !== index))
                                        }}>
                                            <IoTrashBin/>
                                        </Button>
                                    </Stack>
                                ))}
                            </Box>
                        </Stack>

                        <Box mb={2} display="flex" justifyContent="center">
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<IoCloudUpload/>}
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    name={"images"}
                                    accept={"image/*"}
                                    type="file"
                                    onChange={(e) => addNewImage(e)}
                                />
                            </Button>
                        </Box>
                        <TextField
                            label="Variant Name"
                            defaultValue={selectedVariant?.variantName || ""}
                            fullWidth
                            required
                            name="variantName"
                            variant="outlined"
                            size="small"
                            sx={{mb: 3, textTransform: "capitalize"}}
                        />
                        <Typography variant="h6" gutterBottom>
                            Manage Sizes
                        </Typography>
                        <Grid container spacing={2}>
                            {sizes.map((size, index) => (
                                <Grid item xs={12} key={index}>
                                    <Stack direction="row" alignItems="center">
                                        <Typography variant="body1" sx={{flexGrow: 1}}>
                                            {size.size} - {size.stock} in stock
                                        </Typography>
                                        <IconButton onClick={() => handleRemoveSize(size.size)} color="error"
                                                    size="small">
                                            <DeleteIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => {
                                            setStock(size.stock);
                                            setSelectedSize(size.size);
                                        }} color="warning" size="small">
                                            <IoPencil/>
                                        </IconButton>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <Stack direction="row" spacing={2}>
                            <Select
                                variant="outlined"
                                size="small"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                sx={{flexGrow: 1}}
                            >
                                {(item?.type === "shoes" || item?.type == "sandals") && shoeSizesList.map((option) => (
                                    <MenuItem value={option} key={option}>{option}</MenuItem>
                                ))}
                                {item?.type === "accessories" && accessoriesSizesList.map((option) => (
                                    <MenuItem value={option.value} key={option.value}>{option.name}</MenuItem>
                                ))}
                                <MenuItem disabled value="none">Select Size</MenuItem>
                            </Select>
                            <TextField
                                label="Stock"
                                value={stock}
                                onChange={(e) => setStock(Number.parseInt(e.target.value))}
                                type="number"
                                fullWidth
                                size="small"
                            />
                            <Button onClick={handleAddSize} variant="contained" color="primary" size="small">
                                Add
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => clear()} color="secondary">
                        Cancel
                    </Button>
                    <Button type={"submit"} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </form>
            {isLoading && <ComponentsLoader title={"Working"}/>}
        </Dialog>
    );
};

export default VariantFormDialog;
