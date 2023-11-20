
// material-ui
import {Dialog, DialogActions, DialogContent, Paper, Grid, Box, Button} from '@mui/material';
import {useState} from "react";


const ZPDFViewDialog = ({ open, pdfUrl , onClickClose }) => {
    let clientHeight = document.documentElement.clientHeight - (document.documentElement.clientHeight * 0.1) - 140;
    const [iframeHeight, setIframeHeight] = useState(clientHeight);
    const resize = ()=>{
        setIframeHeight(document.documentElement.clientHeight - (document.documentElement.clientHeight * 0.1) - 140)
    }
    if(open){
        window.addEventListener('resize', resize)
    }else{
        window.removeEventListener('resize', resize)
    }
    return (
        <Dialog fullScreen={true} aria-describedby="simple-modal-description" open={open} maxWidth={'lg'}  scroll={'paper' } style={{width:'90%',height: '90%',left:'5%',top:'5%',backgroundColor:'#323639'}}>
            <DialogContent  style={{backgroundColor:'#323639'}}>
                <Grid container  justifyContent='center' style={{backgroundColor:'#323639'}}>
                    <Grid item sx={{ width: '100%' }} >
                        {pdfUrl &&
                            <Box sx={{ width: '100%' }} >
                                <Paper sx={{ width: '100%', height: '100%' }} style={{backgroundColor:'#323639'}}>
                                   <iframe id={'pdfViewer'}  title="Sample PDF Document" src={pdfUrl} width={"100%"}  style={{ height: iframeHeight, border: 'none' }}/>
                                </Paper>
                            </Box>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{  }}  style={{backgroundColor:'#323639'}}>
                <Button variant="contained" color="primary" onClick={onClickClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ZPDFViewDialog;
