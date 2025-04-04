import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={375}
      height={107}
      viewBox="0 0 375 107"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M121.662 21.233C66.789 22.433 17.69 8.066 0 .733v106h375v-106c-27.036 19.5-98.131 20-119.66 20-21.528 0-25.534 3-25.534 11.5s4.579 31.679-22.029 35c-52.069 6.5-62.237-11-63.084-22-1.001-13 1.502-24-23.031-24z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
