import React from 'react'
import { Button as AntButton } from 'antd'

const Button = ({ icon, text, onClick }) => (
    <AntButton className='button' type='button' onClick={onClick}>
        {icon}{' '}
        {text}
    </AntButton>
)
  
export default Button