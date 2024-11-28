import React, {useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import {Box, Grid, MenuItem, Select, styled, Typography} from "@mui/material";
import {brands, types} from "@/constant";
import {IoCloudUpload} from "react-icons/io5";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getInventoryItems, setSelectedItem, setShowEditingForm} from "@/lib/inventorySlice/inventorySlice";
import {Item} from "@/interfaces";
import {Timestamp} from "@firebase/firestore";
import {generateId} from "@/utils/genarateIds";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {addAItem, deleteAFile, updateAItem, uploadAFile} from '@/actions/inventoryActions';
import {setError} from "@/lib/loadSlice/loadSlice";
import Image from "next/image";

const ItemFormDialog = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const {showEditingForm, selectedItem: item, page, size} = useAppSelector(state => state.inventorySlice);
    const [newImage, setNewImage] = useState(null)


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

    const onFormSubmit = async (evt: any) => {
        evt.preventDefault();
        setIsLoading(true)
        try {
            const type = evt.target.type.value;
            const manufacturer = evt.target.manufacturer.value;
            const brand = evt.target.brand.value;
            const name = evt.target.name.value;
            const buyingPrice = evt.target.buyingPrice.value;
            const sellingPrice = evt.target.sellingPrice.value;
            const discount = evt.target.discount.value;
            const file = evt.target.file.files[0];
            const itemId = evt.target.itemId.value == "" ? generateId("item", manufacturer) : evt.target.itemId.value;

            const newItem: Item = {
                brand: brand.toLowerCase(),
                buyingPrice: Number.parseInt(buyingPrice),
                createdAt: item?.createdAt ? item?.createdAt : Timestamp.now(),
                discount: Number.parseInt(discount),
                itemId: itemId,
                manufacturer: manufacturer.toLowerCase(),
                name: name,
                thumbnail: {file: "", url: ""},
                sellingPrice: Number.parseInt(sellingPrice),
                type: type.toLowerCase(),
                updatedAt: Timestamp.now(),
                variants: item?.variants ? item.variants : []
            }

            if (file != undefined && item != null) {
                await deleteAFile(`inventory/${item?.itemId}/${item?.thumbnail.file}`)
                newItem.thumbnail = await uploadAFile(file, `inventory/${itemId}`)
            } else if (item == null && file != undefined) {
                newItem.thumbnail = await uploadAFile(file, `inventory/${itemId}`)
            } else if (item == null && file == undefined) {
                dispatch(setError({id: new Date().getTime(), message: "Please upload a thumbnail", severity: "error"}))
                return
            } else {
                newItem.thumbnail = item?.thumbnail
            }

            if (item) {
                await updateAItem(newItem);
                closeForm()
            } else {
                await addAItem(newItem)
                closeForm()
            }
            evt.target.reset()
        } catch (e: any) {
            console.log(e)
        }
    }

    const closeForm = () => {
        dispatch(setShowEditingForm(false))
        dispatch(setSelectedItem(null))
        setIsLoading(false)
        dispatch(getInventoryItems({size: size, page: page}))
        setNewImage(null)
    }
    return (
        <Dialog
            open={showEditingForm}
            onClose={() => closeForm()}
            aria-labelledby="edit-item-dialog-title"
            aria-describedby="edit-item-dialog-description"
        >
            {isLoading ? (<ComponentsLoader/>) : (<div>
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
                            <Select
                                placeholder={"Manufacturer"}
                                name={"manufacturer"}
                                disabled={!!item?.manufacturer}
                                variant="outlined"
                                size="small"
                                defaultValue={item?.manufacturer || "adidas"}
                                fullWidth
                                required
                            >
                                {brands.map((manufacturer) => (
                                    <MenuItem value={manufacturer.value}
                                              key={manufacturer.value}>{manufacturer.name}</MenuItem>
                                ))}
                            </Select>
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
                        </Box>

                        <Typography variant="subtitle1" gutterBottom>
                            Pricing Details
                        </Typography>
                        <Box mb={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name={"buyingPrice"}
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
                                        name={"sellingPrice"}
                                        label="Selling Price"
                                        defaultValue={item?.sellingPrice}
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
                                        name={"discount"}
                                        label="Discount"
                                        defaultValue={item?.discount}
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
