export class VideoFeed {
  mediaType: string;
  constructor(mediaType: string) {
    this.mediaType = mediaType;
  }
}
export class VideoFileFeed extends VideoFeed {
  constructor(path: string) {
    super("File");
  }
}
