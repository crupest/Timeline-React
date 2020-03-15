export function base64(blob: Blob): Promise<string> {
  return new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = function() {
      resolve((reader.result as string).replace(/^data:.+;base64,/, ''));
    };
    reader.readAsDataURL(blob);
  });
}
