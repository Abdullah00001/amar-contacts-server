export interface IProcessImageUpload {
  image: string;
  publicId?: string;
}

export interface IProcessImageDelete {
  publicId: string;
}
