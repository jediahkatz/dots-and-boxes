import React from 'react'
import { Button as AntButton } from 'antd'

const Button = ({ icon, text, ...kwargs }) => (
    <AntButton {...kwargs}>
        {icon}{' '}
        {text}
    </AntButton>
)
  
export default Button