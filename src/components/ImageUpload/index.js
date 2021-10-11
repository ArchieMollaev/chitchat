import React from "react";
import ImageUploading from "react-images-uploading";

export function ImageUpload(props) {
  const maxNumber = 1;
  const images = props.image ? [props.image] : [];

  const onChange = (imageList, addUpdateIndex) => {
    props.onImageChange(imageList[0] ? imageList[0] : null);
  };

  return (
    <div className="image-uploader">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            {imageList.length === 0 && (
              <button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                attach image
              </button>
            )}
            &nbsp;
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image["data_url"]} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button
                    onClick={() => {
                      onImageRemove(index);
                    }}
                  >
                    remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
