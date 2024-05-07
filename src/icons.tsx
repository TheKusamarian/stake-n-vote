import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export const KusamaIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  fill = '#000',
  stroke = '#fff',
  className,
  ...props
}) => (
  <svg
    viewBox="0 0 441 441"
    height={size || height}
    width={size || width}
    className={className}
    {...props}
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
)

export const YoutubeIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 461.001 461.001"
      {...props}
    >
      <g>
        <path
          fill="currentColor"
          d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
        c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
        C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
        c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
        />
      </g>
    </svg>
  )
}

export const PolkadotIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  className,
  fill = '#E6007A',
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
)

export const GithubIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export const XIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="currentColor"
      // style="enable-background:new 0 0 24 24;"
      // xml:space="preserve"
      {...props}
    >
      <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
    </svg>
  )
}

export const DiscordIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  )
}
