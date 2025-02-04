import React, {useEffect, useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import {Box, Checkbox, FormControlLabel, Grid, MenuItem, Select, styled, Switch, Typography} from "@mui/material";
import {genders, types} from "@/constant";
import {IoCloudUpload} from "react-icons/io5";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setItems, setSelectedItem, setShowEditingForm} from "@/lib/inventorySlice/inventorySlice";
import {Item} from "@/interfaces";
import {generateId} from "@/utils/Generate";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {addAItem, deleteAFile, updateAItem, uploadAFile} from '@/actions/inventoryActions';
import Image from "next/image";

const ItemFormDialog = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const {showEditingForm, selectedItem: item, items} = useAppSelector(state => state.inventorySlice);
    const [newImage, setNewImage] = useState(null)
    const [discount, setDiscount] = useState(0)
    const [sellingPrice, setSellingPrice] = useState(0)
    const [marketPrice, setMarketPrice] = useState(0)

    const [selectedGenders, setSelectedGenders] = useState<string[]>(item?.genders || []);


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


    const toggleGenderSelection = (gender: string) => {
        setSelectedGenders((prev) =>
            prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
        );
    };

    useEffect(() => {
        const discount = ((marketPrice - sellingPrice) / marketPrice) * 100
        setDiscount(discount.toFixed(2) as number)
    }, [sellingPrice, marketPrice])

    useEffect(() => {
        if (item) {
            setSelectedGenders(item?.genders || [])
            setSellingPrice(Math.round((item.sellingPrice - (item.discount * item.sellingPrice / 100)) / 10) * 10);
            setMarketPrice(item.sellingPrice)
        }
    }, [item]);
    const onFormSubmit = async (evt: any) => {
        evt.preventDefault();
        setIsLoading(true)
        try {
            const type = evt.target.type.value;
            const manufacturer = evt.target.manufacturer.value;
            const brand = evt.target.brand.value;
            const name = evt.target.name.value;
            const description = evt.target.description.value;
            const buyingPrice = evt.target.buyingPrice.value;
            const sellingPrice = evt.target.marketPrice.value;
            const discount = parseFloat(evt.target.discount.value).toFixed(2); // Cast to float with 2 decimals
            const itemId = evt.target.itemId.value == "" ? generateId("item", manufacturer) : evt.target.itemId.value;
            const status = evt.target.status.checked ? "Active" : "Inactive";
            let listing = evt.target.listOnWeb.checked ? "Active" : "Inactive";

            if (status === "Inactive") {
                listing = "Inactive"
            }

            const newItem: Item = {
                description: description,
                listing: listing,
                genders: selectedGenders,
                status: status,
                brand: brand.toLowerCase(),
                buyingPrice: Number.parseInt(buyingPrice),
                createdAt: item?.createdAt ? item?.createdAt : new Date().toISOString(),
                discount: parseFloat(discount),
                itemId: itemId,
                manufacturer: manufacturer.toLowerCase(),
                name: name,
                thumbnail: {file: "", url: ""},
                sellingPrice: Number.parseInt(sellingPrice),
                type: type.toLowerCase(),
                updatedAt: new Date().toISOString(),
                variants: item?.variants ? item.variants : []
            }
            if (newImage) {
                if (item) {
                    await deleteAFile(`inventory/${item.itemId}/${item.thumbnail.file}`);
                    newItem.thumbnail = await uploadAFile(newImage, `inventory/${itemId}`)
                } else {
                    newItem.thumbnail = await uploadAFile(newImage, `inventory/${itemId}`)
                }
            } else {
                if (item) {
                    newItem.thumbnail = item.thumbnail
                } else {
                    throw new Error("Thumbnail is required")
                }
            }
            if (!newImage && !item) {
                throw new Error("Thumbnail is required")
            }

            if (item) {
                await updateAItem(newItem);
                closeForm()
                updateItems(newItem)
            } else {
                await addAItem(newItem)
                closeForm()
                updateItems(newItem)
            }
            evt.target.reset()
        } catch (e: any) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    const closeForm = () => {
        dispatch(setShowEditingForm(false))
        dispatch(setSelectedItem(null))
        setSelectedGenders([])
        setIsLoading(false)
        setNewImage(null)
    }
    const updateItems = (newItem: Item) => {
        const updatedItems = items?.map((item: Item) => {
            if (item.itemId === newItem.itemId) {
                return newItem
            } else {
                return item
            }
        });
        dispatch(setItems(updatedItems))
    }
    return (
        <Dialog
            open={showEditingForm}
            onClose={() => closeForm()}
            aria-labelledby="edit-item-dialog-title"
            aria-describedby="edit-item-dialog-description"
        >
            {isLoading ? (<ComponentsLoader position=""/>) : (<div>
                <DialogTitle id="edit-item-dialog-title">Edit/Add Item</DialogTitle>
                <form onSubmit={onFormSubmit}>
                    <DialogContent>
                        <Box mb={2} hidden={true}>
                            <TextField
                                name={"itemId"}
                                label="Item ID"
                                defaultValue={item?.itemId}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                        </Box>

                        {(newImage || item?.thumbnail) && (<Box mt={2} mb={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                Thumbnail
                            </Typography>
                            <Box display="flex" justifyContent="center">
                                <Image src={
                                    newImage?.name ? URL.createObjectURL(newImage) : item?.thumbnail.url
                                } alt={item?.name || "thumbnail"} width={200}
                                       height={200}/>
                            </Box>
                        </Box>)
                        }
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
                                    name={"file"}
                                    type="file"
                                    accept={"image/*"}
                                    onChange={(event) => setNewImage(event.target.files[0])}
                                    multiple={false}
                                />
                            </Button>
                        </Box>

                        <Box display="flex" gap={2} mb={2}>
                            <Select
                                placeholder={"Type"}
                                name={"type"}
                                variant="outlined"
                                size="small"
                                defaultValue={item?.type || "shoes"}
                                fullWidth
                                required
                            >
                                {types.map((option) => (
                                    <MenuItem value={option.value} key={option.value}>{option.name}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                placeholder={"Nike, Adidas................"}
                                name={"manufacturer"}
                                disabled={!!item?.manufacturer}
                                variant="outlined"
                                size="small"
                                defaultValue={item?.manufacturer || "adidas"}
                                fullWidth
                                required
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                name={"brand"}
                                label="Brand"
                                fullWidth
                                defaultValue={item?.brand}
                                margin="normal"
                                required
                            />
                            <TextField
                                name={"name"}
                                label="Name"
                                fullWidth
                                defaultValue={item?.name}
                                margin="normal"
                                required
                            />
                            <TextField
                                name={"description"}
                                label="Description"
                                fullWidth
                                defaultValue={item?.description || ""}
                                margin="normal"
                                multiline
                                rows={4}
                                placeholder="Enter a brief description of the item"
                            />
                        </Box>


                        <Typography variant="subtitle1" gutterBottom>
                            Pricing Details
                        </Typography>
                        <Box mb={2}>
                            <Box mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="buyingPrice"
                                            label="Buying Price"
                                            type="number"
                                            defaultValue={item?.buyingPrice}
                                            fullWidth
                                            required
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: <span>LKR</span>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="sellingPrice"
                                            label="Selling Price"
                                            defaultValue={sellingPrice}
                                            value={sellingPrice}
                                            onChange={(evt) => setSellingPrice(evt.target.value as number)}
                                            type="number"
                                            required
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: <span>LKR</span>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="marketPrice"
                                            label="Market Price"
                                            value={marketPrice}
                                            defaultValue={marketPrice}
                                            onChange={(evt) => setMarketPrice(evt.target.value as number)}
                                            type="number"
                                            fullWidth
                                            required
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: <span>LKR</span>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="discount"
                                            disabled
                                            label="Discount"
                                            value={discount}
                                            type="number"
                                            fullWidth
                                            required
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: <span>%</span>
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Genders
                        </Typography>
                        <Box display="flex" gap={2} mb={2}>
                            {genders.map((gender) => (
                                <FormControlLabel
                                    key={gender.value}
                                    control={
                                        <Checkbox
                                            checked={selectedGenders.includes(gender.value)}
                                            onChange={() => toggleGenderSelection(gender.value)}
                                        />
                                    }
                                    label={gender.name}
                                />
                            ))}
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <FormControlLabel
                                name="status"
                                control={<Switch defaultChecked={item?.status === "Active"}/>}
                                label="Status"
                                labelPlacement="start"
                                sx={{
                                    marginRight: 2,
                                    ".MuiFormControlLabel-label": {
                                        fontWeight: 500,
                                        fontSize: "1rem",
                                    },
                                }}
                            />
                        </Box>
                        <Box display="flex" alignItems="center" mb={2}>
                            <FormControlLabel
                                name="listOnWeb"
                                control={<Switch defaultChecked={item?.listing === "Active"}/>}
                                label="List on Website"
                                labelPlacement="start"
                                sx={{
                                    marginRight: 2,
                                    ".MuiFormControlLabel-label": {
                                        fontWeight: 500,
                                        fontSize: "1rem",
                                    },
                                }}
                            />
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" type={"button"} color="primary" onClick={() => closeForm()}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" type="submit">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </div>)}
        </Dialog>
    );
};

export default ItemFormDialog;
