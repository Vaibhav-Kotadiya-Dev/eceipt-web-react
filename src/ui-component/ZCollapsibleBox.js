import { useState } from 'react';
// material-ui
import { styled } from '@mui/material/styles';
import { Collapse, CardContent, IconButton } from '@mui/material';
// import { gridSpacing } from 'common/constant';

import { IconChevronDown } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';

// const CardContentNoPadding = styled(CardContent)(`
//   padding: 0;
//   &:last-child {
//     padding-bottom: 0;
//   }
// `);


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const ZCollapsibleBox = ({ header, contents }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (<MainCard noPadding title={header} secondary={contents &&
        <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more">
            <IconChevronDown stroke={1.5} size="1.5rem" />
        </ExpandMore>}>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{ pl: 1, pr: 1, pt: 0, pb: 0 }}>
                {contents}
            </CardContent>
        </Collapse>
    </MainCard >
    )
}

export default ZCollapsibleBox;
