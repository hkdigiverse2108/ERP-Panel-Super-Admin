import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setModalVideoPlay } from "../../../Store/Slices/ModalSlice";
import CommonModal from "./CommonModal";

const CommonVideoModal = () => {
  const { isModalVideoPlay } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const handleCloseBtn = () => dispatch(setModalVideoPlay({ open: false, link: "" }));

  const getEmbedLink = (url: string): string => {
    if (!url) return "";

    let videoId = "";

    try {
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      } else if (url.includes("youtube.com/embed/")) {
        return url;
      }

      if (url.includes("drive.google.com")) {
        if (url.includes("/file/d/")) {
          videoId = url.split("/file/d/")[1]?.split("/")[0];
        } else if (url.includes("id=")) {
          videoId = url.split("id=")[1]?.split("&")[0];
        }

        return videoId ? `https://drive.google.com/file/d/${videoId}/preview` : url;
      }

      return url;
    } catch (err) {
      console.error("Invalid video URL:", err);
      return url;
    }
  };

  const embedUrl = getEmbedLink(isModalVideoPlay.link);
  return (
    <CommonModal isOpen={isModalVideoPlay.open} onClose={handleCloseBtn} className="max-w-250 m-2 sm:m-5">
      <div className="w-full 2xl:h-full h-fit aspect-video rounded-lg overflow-hidden shadow-xl">
        {/* <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay;" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
        <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer;" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </CommonModal>
  );
};

export default CommonVideoModal;
