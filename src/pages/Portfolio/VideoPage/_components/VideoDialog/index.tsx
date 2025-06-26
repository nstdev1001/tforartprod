interface Props {
  src: string;
  title: string;
  description?: string;
}

const VideoDialog = ({ src, title, description }: Props) => {
  return (
    <div className="w-[calc(100vw-50px)] max-w-[900px] md:p-4">
      <iframe
        className="w-full aspect-video"
        src={src}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <hr className="mt-5" />
      <div className="mt-3 overflow-hidden">
        <h3 className="font-semibold text-[16px] uppercase">{title}</h3>
        <p className="font-light">{description}</p>
      </div>
    </div>
  );
};

export default VideoDialog;
