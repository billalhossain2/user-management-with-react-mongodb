import React from 'react'
import loadingGif from "../assets/loading.gif";
const Spinner = () => {
  return (
    <img className="w-60" src={loadingGif} alt="Loading Spinner" />
  )
}

export default Spinner