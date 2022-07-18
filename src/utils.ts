export function makeImagePath(id: string, format?: string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
  }
  //배경사진 가져오는 함수