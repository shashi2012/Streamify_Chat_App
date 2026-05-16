import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="absolute top-[10px] right-2 md:right-4 z-[50]">
      <button 
        onClick={handleVideoCall} 
        className="btn btn-success btn-xs md:btn-sm text-white flex items-center gap-1 shadow-sm"
      >
        <VideoIcon className="size-3.5 md:size-4" />
        <span className="hidden sm:inline">Video</span>
      </button>
    </div>
  );
}

export default CallButton;
