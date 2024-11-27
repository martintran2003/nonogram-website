function RowHints({ pieces, solved }) {
  return (
    <>
      {pieces.map((piece, index) =>
        solved[index] ? (
          <em key={index}>{piece}</em>
        ) : (
          <p key={index}>{piece}</p>
        )
      )}
    </>
  );
}

export default RowHints;
