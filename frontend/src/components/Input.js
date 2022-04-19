import React from 'react'
import { Input as AntInput } from 'antd'

const Input = ({ label, value, setInput }) => (
    <div>
        {label === 'Password' ? 
            <AntInput.Password 
                type='text'
                value={value} 
                addonBefore={label}
                onChange={e => setInput(e.target.value)} 
            /> : 
            <AntInput 
                type='text'
                value={value} 
                addonBefore={label}
                onChange={e => setInput(e.target.value)} 
            />
        }
    </div>
)
  
export default Input