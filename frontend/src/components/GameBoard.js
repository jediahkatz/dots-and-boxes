const FINAL_BLUE = "#00B4D8";
const HOVER_BLUE = "#90E0EF";
const FINAL_PINK = "#E36397";
const HOVER_PINK = "#FEEAFA";

const Dot = () => (
  <div
    style={{
      height: "12px",
      width: "12px",
      backgroundColor: "#000",
      borderRadius: "3px",
      marginLeft: "-2px",
      zIndex: 2,
    }}
  />
);

const HLine = () => (
  <div
    style={{
      height: "10px",
      width: "50px",
      backgroundColor: FINAL_PINK,
      marginLeft: "-2px",
    }}
  />
);

const HRow = ({ cols, rowIndex }) => (
  <div
    className="row"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginTop: "-10px",
      zIndex: 1,
    }}
  >
    {Array(cols)
      .fill(null)
      .map((_, colIndex) => (
        <>
          <Dot />
          <HLine key={"hr" + rowIndex + "c" + colIndex} />
        </>
      ))}
    <Dot />
  </div>
);

const VLine = () => (
  <div
    style={{
      height: "60px",
      width: "10px",
      backgroundColor: FINAL_BLUE,
      marginLeft: "-2px",
    }}
  />
);

const Box = () => (
  <div style={{ height: "65px", width: "50px", backgroundColor: "white" }} />
);

const VRow = ({ cols, rowIndex }) => (
  <div
    className="row"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "-10px",
      zIndex: 0,
    }}
  >
    {Array(cols)
      .fill(null)
      .map((_, colIndex) => (
        <>
          <VLine key={"vr" + rowIndex + "c" + colIndex} />
          <Box />
        </>
      ))}
    <VLine />
  </div>
);

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
  return (
    <div className="columns" style={{ width: "300px", height: "300px" }}>
      {Array(rows)
        .fill(null)
        .map((el, i) => (
          <>
            <HRow hLines={hLines} cols={cols} rowIndex={i} />
            <VRow vLines={vLines} cols={cols} rowIndex={i} />
          </>
        ))}
      <HRow cols={cols} />
    </div>
  );
};

export default GameBoard;
