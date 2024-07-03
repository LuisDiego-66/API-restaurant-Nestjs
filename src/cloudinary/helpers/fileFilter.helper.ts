export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  //console.log('hola desde el interceptor');

  if (!file) return callback(new Error('file is empty'), false); //! se devuelve el callback con false (no deja ingresar al controlador)

  const fileExtension = file.mimetype.split('/')[1]; //! se consigue la extencion del archivo :"image/jpeg"
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true); //? si el archivo tiene una extension valida se lo pasa al controlador
  }
  callback(null, false);
};
