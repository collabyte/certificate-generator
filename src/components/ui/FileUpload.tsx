const FileUpload = () => {
  return (
    <>
      <input className="hidden" accept="pdf" id="upload-pdf" type="file" />
      <label htmlFor="upload-pdf">
        <img src="./attach-file.png" className="h-10 w-10" />{" "}
        {/* This is the upload icon */}
      </label>
    </>
  );
};

export default FileUpload;
