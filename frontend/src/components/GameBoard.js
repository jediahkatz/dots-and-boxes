import React, { useEffect, useState } from 'react'
import { OWNER } from '../shared/constants.js'

const FINAL_BLUE = '#00B4D8'
const HOVER_BLUE = '#90E0EF'
const FINAL_PINK = '#E36397'
const HOVER_PINK = '#FEEAFA'
const WHITE = '#FFFFFF'

const Dot = () => (
  <div
    style={{
      height: '12px',
      width: '12px',
      backgroundColor: '#000',
      borderRadius: '3px',
      marginLeft: '-2px',
      zIndex: 2,
    }}
  />
)

const HLine = ({ hLines, clickHLine, row, col, isPlayer1 }) => {
  const lineColor = 
    (hLines[row][col] === OWNER.PLAYER_1) ? FINAL_BLUE :
    (hLines[row][col] === OWNER.PLAYER_2) ? FINAL_PINK :
    WHITE
  const hoverColor = isPlayer1 ? HOVER_BLUE : HOVER_PINK
  const [color, setColor] = useState(lineColor)

  useEffect(() => setColor(lineColor), [lineColor])

  return (
    <div
      style={{
        height: '10px',
        width: '50px',
        backgroundColor: color,
        marginLeft: '-2px',
      }}
      onMouseOver={() => {
        if (lineColor === WHITE) {
          setColor(hoverColor) 
        }
      }}
      onMouseOut={() => setColor(lineColor)}
      onClick={() => {
        clickHLine(row, col)
      }}
    />
  )
}

const HRow = ({ hLines, clickHLine, cols, rowIndex, isPlayer1 }) => (
  <div
    className='row'
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginTop: '-10px',
      zIndex: 1,
    }}
  >
    {Array(cols)
      .fill(null)
      .map((_, colIndex) => (
        <React.Fragment key={`hl-${rowIndex}-${colIndex}`} >
          <Dot />
          <HLine hLines={hLines} clickHLine={clickHLine} row={rowIndex} col={colIndex} isPlayer1={isPlayer1} />
        </React.Fragment>
      ))}
    <Dot />
  </div>
)

const VLine = ({ vLines, clickVLine, row, col, isPlayer1 }) => {
  const lineColor = 
    (vLines[row][col] === OWNER.PLAYER_1) ? FINAL_BLUE :
    (vLines[row][col] === OWNER.PLAYER_2) ? FINAL_PINK :
    WHITE
  const hoverColor = isPlayer1 ? HOVER_BLUE : HOVER_PINK
  const [color, setColor] = useState(lineColor)

  return (
    <div
      style={{
        height: '60px',
        width: '10px',
        backgroundColor: color,
        marginLeft: '-2px',
      }}
      onMouseOver={() => {
        if (lineColor === WHITE) {
          setColor(hoverColor) 
        }
      }}
      onMouseOut={() => setColor(lineColor)}
      onClick={() => clickVLine(row, col)}
    />
  )
}

const Box = () => (
  <div style={{ height: '65px', width: '50px', backgroundColor: 'white' }} />
)

const VRow = ({ vLines, clickVLine, cols, rowIndex, isPlayer1 }) => (
  <div
    className='row'
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '-10px',
      zIndex: 0,
    }}
  >
    {Array(cols)
      .fill(null)
      .map((_, colIndex) => (
        <React.Fragment key={`vl-${rowIndex}-${colIndex}`}>
          <VLine vLines={vLines} clickVLine={clickVLine} row={rowIndex} col={colIndex} isPlayer1={isPlayer1} />
          <Box />
        </React.Fragment>
      ))}
    <VLine vLines={vLines} clickVLine={clickVLine} row={rowIndex} col={cols} isPlayer1={isPlayer1} />
  </div>
)

const GameBoard = ({
  rows,
  cols,
  hLines,
  vLines,
  isPlayer1,
  canClick,
  clickHLine,
  clickVLine,
}) => {
  const doClickHLine = (row, col) => {
    console.log('click h!', row, col, canClick)
    if (canClick) clickHLine(row, col)
  }
  const doClickVLine = (row, col) => {
    console.log('click v!', row, col, canClick)
    if (canClick) clickVLine(row, col)
  }

  return (
    <div className='columns' style={{ width: '300px', height: '300px' }}>
      {Array(rows)
        .fill(null)
        .map((_, i) => (
          <React.Fragment key={`rows-${i}`}>
            <HRow hLines={hLines} clickHLine={doClickHLine} cols={cols} rowIndex={i} isPlayer1={isPlayer1} />
            <VRow vLines={vLines} clickVLine={doClickVLine} cols={cols} rowIndex={i} isPlayer1={isPlayer1} />
          </React.Fragment>
        ))}
      <HRow hLines={hLines} clickHLine={clickHLine} cols={cols} rowIndex={rows} isPlayer1={isPlayer1} />
    </div>
  )
}

export default GameBoard
