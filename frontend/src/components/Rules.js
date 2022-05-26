import React, { useState } from 'react'
import { Modal } from 'antd'
import rules1 from '../../images/rules1.png'
import rules2 from '../../images/rules2.png'

const Rules = () => {
    const [visible, setVisible] = useState(true)
    return (
        <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
            <p>Take turns drawing lines to connect the dots.</p>
            <span>
                <img src={rules1} width={'50%'} height={'50%'} />
            </span>
            <p>Fill in the fourth line in a 1-by-1 box to capture it and take another turn.</p>
            <span>
                <img src={rules2} width={'50%'} height={'50%'} />
            </span>
            <p>Whoever captures a majority of boxes wins!</p>
        </Modal>
    )
}

export default Rules