export const toBase64 = (file: File): Promise<null | string | ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

// takes file, converts it to base64 and removes first part with file type
export const convertImageToBase64 = async (file: File): Promise<string> => {
  const imageAsBase64 = (await toBase64(file)) as string;
  return imageAsBase64.split(',')[1];
};
