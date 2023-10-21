import { css } from 'styled-components';
import { getGlobalHeadingStyles } from '../../typography/utils/getHeadingStyles';
import { getGlobalSmallStyles } from '../../typography/utils/getSmallStyles';
import { getBodyTypographyStyles } from '../../typography/utils/getBodyTypographyStyles';
export const getGlobalTypographyStyles = css(["body{", "}", " ", ""], getBodyTypographyStyles, getGlobalHeadingStyles, getGlobalSmallStyles);