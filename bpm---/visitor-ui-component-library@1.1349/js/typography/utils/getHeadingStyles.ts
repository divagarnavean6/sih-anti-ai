import { css } from 'styled-components';
const getH1Styles = css(["font-weight:700;font-size:32px;line-height:44px;margin-top:0;margin-bottom:16px;"]);
const getH2Styles = css(["font-weight:400;font-size:24px;line-height:30px;margin-top:0;margin-bottom:16px;"]);
const getH3Styles = css(["font-weight:700;font-size:22px;line-height:30px;margin-top:0;margin-bottom:16px;"]);
const getH4Styles = css(["font-weight:700;font-size:18px;line-height:26px;margin-top:0;margin-bottom:16px;"]);
const getH5Styles = css(["font-weight:400;font-size:16px;line-height:26px;margin-top:0;margin-bottom:16px;"]);
const getH6Styles = css(["font-weight:400;font-size:14px;line-height:24px;margin-top:0;margin-bottom:16px;"]);
export const getGlobalHeadingStyles = css(["h1{", ";}h2{", ";}h3{", ";}h4{", ";}h5{", ";}h6{", ";}"], getH1Styles, getH2Styles, getH3Styles, getH4Styles, getH5Styles, getH6Styles);