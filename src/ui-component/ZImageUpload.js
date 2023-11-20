import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, IconButton } from "@mui/material";
import Image from "mui-image";

// material-ui
import ImageUploading from "react-images-uploading";
import { IconX, IconDeviceFloppy, IconPhotoPlus } from '@tabler/icons-react';




const ZImageUpload = ({ images, onChange, onRemove, onSave, withChange, text }) => {
    const theme = useTheme();
    const width = 150;
    const height = 150;
    const border = 1;

    return (
        <Grid container justifyContent="center" >
            <Grid item >
                <Grid item sx={{ width: width, height: height, border: border, borderColor: theme.palette.primary.light, backgroundColor: 'white' }}>
                    <ImageUploading value={images} onChange={onChange} acceptType={['jpg', 'jpeg', 'png']}>
                        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                            <Box sx={{ width: width - border * 2, height: height - border * 2 }}>
                                {images.length === 0 &&
                                    <Button onClick={onImageUpload}
                                        sx={{ backgroundColor: isDragging ? theme.palette.primary.light : undefined, width: width - border * 2, height: height - border * 2, p: 0 }}
                                        {...dragProps}>
                                        {text ? text :
                                            <IconPhotoPlus stroke={1} size="2rem" color={theme.palette.primary.dark} />}
                                    </Button>}
                                {images.length !== 0 &&
                                    <Grid container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', width: width - border * 2, height: height - border * 2 }} >
                                        <Grid item sx={{ position: 'absolute', left: '0', top: '0', width: width - border * 2, height: height - border * 2 }}>
                                            <Image width={'100%'} height={height - border * 2} duration={0} alt="Company Logo" easing='initial' style={{ borderRadius: 12, opacity: 100 }} fit='contain' src={images[0].dataURL} />
                                            {/* //multiple image
                                            {imageList.map((image, index) => (
                                                <Image width={'100%'} height={height - border * 2} duration={0} alt="Company Logo" easing='initial' style={{ borderRadius: 12, opacity: 100 }} fit='contain' src={image.dataURL} />
                                            ))} */}
                                        </Grid>
                                        <Grid item sx={{ position: 'absolute', right: '0', top: '0', height: 30, textAlign: 'right' }}>
                                            <IconButton color='primary' onClick={onRemove}>
                                                <IconX stroke={2} size="1.5rem" color={theme.palette.error.light} />
                                            </IconButton>
                                        </Grid>
                                        {withChange &&
                                            <Grid item sx={{ position: 'absolute', left: '0', top: '0', height: 30, textAlign: 'right' }}>
                                                <IconButton color='primary' onClick={onSave}>
                                                    <IconDeviceFloppy stroke={2} size="1.5rem" color={'black'} />
                                                </IconButton>
                                            </Grid>}
                                    </Grid>}
                            </Box>
                        )}
                    </ImageUploading>
                </Grid>
            </Grid></Grid>
    )
}

export default ZImageUpload;

