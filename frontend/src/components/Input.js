import React from 'react'

const Input = ({ value, setInput }) => (
    <div>
        <input type='text' value={value} onChange={e => setInput(e.target.value)} />
    </div>
)
  
export default Input