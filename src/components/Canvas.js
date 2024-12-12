import React, { forwardRef } from 'react';

const Canvas = forwardRef((props, ref) => {
  return <canvas ref={ref} style={{ display: 'block', background: '#fff' }} />;
});

export default Canvas;
