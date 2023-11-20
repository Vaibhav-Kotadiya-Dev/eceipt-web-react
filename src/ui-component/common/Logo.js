// material-ui
// import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    // const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={logo} alt="Berry" width="100" />
         *
         */

        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" version="1.0" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"
            viewBox="0 0 100 100">
            <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer" />
                <path fill="#4A85B4"  d="M79.91 20.09l0 -15.95c0,-2.2 -1.79,-3.99 -3.99,-3.99l-71.78 0c-2.2,0 -3.99,1.79 -3.99,3.99l0 91.72c0,2.2 1.79,3.99 3.99,3.99l71.78 0c2.2,0 3.99,-1.79 3.99,-3.99l0 -15.95 -39.88 0 0 -19.94 39.88 0 0 -19.94 -39.88 0 0 -19.94 39.88 0z" />
                <path fill="#FAAF40"  d="M79.91 59.97l-39.88 0 0 -19.94 39.88 0 0 19.94zm15.95 -39.88l-71.78 0c-2.2,0 -3.99,1.79 -3.99,3.99l0 51.84c0,2.2 1.79,3.99 3.99,3.99l71.78 0c2.2,0 3.99,-1.79 3.99,-3.99l0 -51.84c0,-2.2 -1.79,-3.99 -3.99,-3.99z" />
            </g>
        </svg>

      
    );
};

export default Logo;
