import React from 'react'
import { Button as AntButton } from 'antd'

const Button = ({ text, onClick }) => (
    <AntButton className='button' type='button' onClick={onClick}>
        {text}
    </AntButton>
)
  
export default Button