import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const KusamaIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  fill = "#000",
  stroke = "#fff",
  className,
  ...props
}) => (
  <svg
    viewBox="0 0 441 441"
    height={size || height}
    width={size || width}
    className={className}
  >
    <title>kusama-ksm-logo</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <rect fill={fill} x="0.5" y="0.5" width="440" height="440" />
        <path
          stroke={stroke}
          fill={stroke}
          d="M373.6,127.4c-5.2-4.1-11.4-9.7-22.7-11.1-10.6-1.4-21.4,5.7-28.7,10.4s-21.1,18.5-26.8,22.7-20.3,8.1-43.8,22.2-115.7,73.3-115.7,73.3l24,.3-107,55.1H63.6L48.2,312s13.6,3.6,25-3.6v3.3s127.4-50.2,152-37.2l-15,4.4c1.3,0,25.5,1.6,25.5,1.6a34.34,34.34,0,0,0,15.4,24.8c14.6,9.6,14.9,14.9,14.9,14.9s-7.6,3.1-7.6,7c0,0,11.2-3.4,21.6-3.1a82.64,82.64,0,0,1,19.5,3.1s-.8-4.2-10.9-7-20.1-13.8-25-19.8a28,28,0,0,1-4.1-27.4c3.5-9.1,15.7-14.1,40.9-27.1,29.7-15.4,36.5-26.8,40.7-35.7s10.4-26.6,13.9-34.9c4.4-10.7,9.8-16.4,14.3-19.8s24.5-10.9,24.5-10.9S378.5,131.3,373.6,127.4Z"
        />
      </g>
    </g>
  </svg>
);

export const PolkadotIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  className,
  fill = "#E6007A",
  ...props
}) => (
  <svg
    version="1.1"
    id="Logo"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    className={className}
    viewBox="0 0 1326.1 1410.3"
    height={size || height}
    width={size || width}
  >
    <ellipse fill={fill} cx="663" cy="147.9" rx="254.3" ry="147.9" />
    <ellipse fill={fill} cx="663" cy="1262.3" rx="254.3" ry="147.9" />
    <ellipse
      transform="matrix(0.5 -0.866 0.866 0.5 -279.1512 369.5916)"
      fill={fill}
      cx="180.5"
      cy="426.5"
      rx="254.3"
      ry="148"
    />
    <ellipse
      transform="matrix(0.5 -0.866 0.866 0.5 -279.1552 1483.9517)"
      fill={fill}
      cx="1145.6"
      cy="983.7"
      rx="254.3"
      ry="147.9"
    />
    <ellipse
      transform="matrix(0.866 -0.5 0.5 0.866 -467.6798 222.044)"
      fill={fill}
      cx="180.5"
      cy="983.7"
      rx="148"
      ry="254.3"
    />
    <ellipse
      transform="matrix(0.866 -0.5 0.5 0.866 -59.8007 629.9254)"
      fill={fill}
      cx="1145.6"
      cy="426.6"
      rx="147.9"
      ry="254.3"
    />
  </svg>
);
