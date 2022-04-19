import React, { useEffect, useState } from 'react'
import { 
  OWNER, 
  FINAL_BLUE, 
  HOVER_BLUE, 
  FINAL_PINK, 
  HOVER_PINK, 
  WHITE 
} from '../shared/constants.js'

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

const HLine = ({ owner, clickHLine, row, col, isPlayer1 }) => {
  const lineColor = 
    (owner === OWNER.PLAYER_1) ? FINAL_BLUE :
    (owner === OWNER.PLAYER_2) ? FINAL_PINK :
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
          <HLine owner={hLines[rowIndex][colIndex]} clickHLine={clickHLine} row={rowIndex} col={colIndex} isPlayer1={isPlayer1} />
        </React.Fragment>
      ))}
    <Dot />
  </div>
)

const VLine = ({ owner, clickVLine, row, col, isPlayer1 }) => {
  const lineColor = 
    (owner === OWNER.PLAYER_1) ? FINAL_BLUE :
    (owner === OWNER.PLAYER_2) ? FINAL_PINK :
    WHITE
  const hoverColor = isPlayer1 ? HOVER_BLUE : HOVER_PINK
  const [color, setColor] = useState(lineColor)

  useEffect(() => setColor(lineColor), [lineColor])

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

const Box = ({ owner }) => {
  const lineColor = 
    (owner === OWNER.PLAYER_1) ? HOVER_BLUE :
    (owner === OWNER.PLAYER_2) ? HOVER_PINK :
    WHITE

  return (
    <div style={{ height: '65px', width: '50px', backgroundColor: lineColor }} />
  )
}

const VRow = ({ vLines, boxes, clickVLine, cols, rowIndex, isPlayer1 }) => (
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
          <VLine owner={vLines[rowIndex][colIndex]} clickVLine={clickVLine} row={rowIndex} col={colIndex} isPlayer1={isPlayer1} />
          <Box owner={boxes[rowIndex][colIndex]} />
        </React.Fragment>
      ))}
    <VLine owner={vLines[rowIndex][cols]} clickVLine={clickVLine} row={rowIndex} col={cols} isPlayer1={isPlayer1} />
  </div>
)

const GameBoard = ({ 
  rows,
  cols,
  hLines,
  vLines,
  boxes,
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
    <div className='columns' style={{ marginTop: '20px', width: '300px', height: '300px' }}>
      {Array(rows)
        .fill(null)
        .map((_, i) => (
          <React.Fragment key={`rows-${i}`}>
            <HRow hLines={hLines} clickHLine={doClickHLine} cols={cols} rowIndex={i} isPlayer1={isPlayer1} />
            <VRow vLines={vLines} hLines={hLines} boxes={boxes} clickVLine={doClickVLine} cols={cols} rowIndex={i} isPlayer1={isPlayer1} />
          </React.Fragment>
        ))}
      <HRow hLines={hLines} clickHLine={doClickHLine} cols={cols} rowIndex={rows} isPlayer1={isPlayer1} />
    </div>
  )
}

export default GameBoard
