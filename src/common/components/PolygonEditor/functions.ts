export const getCanvasCoords = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number
) => {
  const matrix = ctx.getTransform();
  const imgMatrix = matrix.invertSelf();
  const x = screenX * imgMatrix.a + screenY * imgMatrix.c + imgMatrix.e;
  const y = screenX * imgMatrix.b + screenY * imgMatrix.d + imgMatrix.f;
  return [x, y];
};

export const getMousePos = (
  canvas: HTMLCanvasElement,
  evt: React.MouseEvent<HTMLCanvasElement>
) => {
  // const rect = canvas.getBoundingClientRect(); // abs. size of element
  // const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
  // const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

  // return [
  //   (evt.clientX - rect.left) * scaleX,
  //   (evt.clientY - rect.top) * scaleY
  // ];

  const rect = canvas.getBoundingClientRect();
  return {
    mouseX: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    mouseY: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
};
