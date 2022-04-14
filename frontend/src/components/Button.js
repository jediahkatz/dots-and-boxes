import React from 'react'

const Button = ({ text, onClick }) => (
    <button className='button' type='button' onClick={onClick}>
        {text}
    </button>
)
  
export default Button